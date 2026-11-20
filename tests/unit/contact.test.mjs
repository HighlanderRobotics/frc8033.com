import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import worker from '../../workers/contact/index.mjs';

const origin = 'https://www.frc8033.com';
const schema = readFileSync(new URL('../../workers/contact/schema.sql', import.meta.url), 'utf8');
let database, env, provider, work, requests;

beforeEach(() => {
  database = new DatabaseSync(':memory:');
  database.exec(schema);
  work = [];
  requests = 0;
  env = {
    CONTACT_ORIGINS: origin,
    TURNSTILE_SECRET: 'test-secret',
    RESEND_API_KEY: 'test-key',
    RESEND_FROM: 'contact@forms.frc8033.com',
    CONTACT_RATE_LIMIT: { limit: vi.fn(async () => ({ success: true })) },
    AI: { run: vi.fn(async () => ({ response: 'spam' })) },
    DB: {
      prepare(sql) {
        const statement = database.prepare(sql);
        return {
          bind(...parameters) {
            return {
              run: async () => ({ meta: statement.run(...parameters) }),
              first: async () => statement.get(...parameters),
              all: async () => ({ results: statement.all(...parameters) }),
            };
          },
        };
      },
    },
  };
  provider = vi.fn(async (url) => {
    if (url.includes('siteverify')) return Response.json({ success: true, hostname: 'www.frc8033.com', action: 'contact' });
    return Response.json({ id: 'example-delivery' });
  });
  vi.stubGlobal('fetch', provider);
});

afterEach(() => {
  vi.unstubAllGlobals();
  database.close();
});

async function submit(message, { headers = {}, fields = {} } = {}) {
  const body = new URLSearchParams({ name: 'Test Visitor', email: 'tester@example.org', message, token: 'test-token-' + ++requests, ...fields });
  const request = new Request('https://contact.example.org/contact', {
    method: 'POST', headers: { origin, 'cf-connecting-ip': '192.0.2.10', ...headers }, body,
  });
  return worker.fetch(request, env, { waitUntil: promise => work.push(promise) });
}

function deliveryCalls() {
  return provider.mock.calls.filter(([url]) => url === 'https://api.resend.com/emails');
}

test('rejects disallowed origins, bursts and mismatched Turnstile challenges before sending', async () => {
  expect((await submit('Hello', { headers: { origin: 'https://other.example.org' } })).status).toBe(403);
  env.CONTACT_RATE_LIMIT.limit.mockResolvedValueOnce({ success: false });
  expect((await submit('Hello')).status).toBe(429);
  provider.mockResolvedValueOnce(Response.json({ success: true, hostname: 'www.frc8033.com', action: 'other' }));
  expect((await submit('Hello')).status).toBe(400);
  expect(work).toHaveLength(0);
  expect(deliveryCalls()).toHaveLength(0);
});

test('delivers ordinary inquiries once with a fixed recipient and visitor Reply-To', async () => {
  const message = 'How can I volunteer as a mentor?';
  const first = await submit(message, { fields: { to: 'other@example.org' } });
  expect(first.status).toBe(202);
  expect(first.headers.get('access-control-allow-origin')).toBe(origin);
  expect((await submit(message)).status).toBe(202);
  await Promise.all(work);

  expect(env.AI.run).not.toHaveBeenCalled();
  expect(deliveryCalls()).toHaveLength(1);
  const [, delivery] = deliveryCalls()[0];
  expect(JSON.parse(delivery.body)).toMatchObject({
    to: ['frc8033@piedmontmakers.org'], reply_to: 'tester@example.org',
  });
  expect(database.prepare('SELECT status, message FROM contact_messages').get()).toMatchObject({ status: 'sent', message: '' });
});

test('holds strong spam signals and keeps flagged messages when AI is unavailable', async () => {
  env.AI.run.mockResolvedValueOnce({ response: 'legitimate' }).mockRejectedValueOnce(new Error('quota'));
  await submit('Test Visitor at tester@example.org sells backlinks.');
  await Promise.all(work);
  await submit('https://one.example https://two.example https://three.example');
  await Promise.all(work);

  const [, ai] = env.AI.run.mock.calls[0];
  expect(ai.messages[1].content).not.toMatch(/Test Visitor|tester@example.org/);
  expect(deliveryCalls()).toHaveLength(0);
  expect(database.prepare('SELECT status, reason FROM contact_messages ORDER BY rowid').all()).toMatchObject([
    { status: 'held', reason: 'spam-pattern:legitimate' },
    { status: 'held', reason: 'multiple-links:ai-unavailable' },
  ]);
});

test('retries transient delivery with the same idempotency key', async () => {
  provider.mockResolvedValueOnce(Response.json({ success: true, hostname: 'www.frc8033.com', action: 'contact' }));
  provider.mockResolvedValueOnce(new Response(null, { status: 429 }));
  await submit('What is the date of your next outreach event?');
  await Promise.all(work);
  database.prepare('UPDATE contact_messages SET next_attempt_at = 0').run();
  await worker.scheduled(null, env);
  const calls = deliveryCalls();
  expect(calls).toHaveLength(2);
  expect(calls[0][1].headers['Idempotency-Key']).toBe(calls[1][1].headers['Idempotency-Key']);
  expect(database.prepare('SELECT status FROM contact_messages').get().status).toBe('sent');
});
