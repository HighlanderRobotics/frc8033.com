import { test, expect } from './fixtures';

test('FAQ answers can be opened and closed with the keyboard', async ({ page }) => {
  await page.goto('./faq/');
  const question = page.locator('main details').filter({ hasText: 'Do I have to live in Piedmont' });
  const summary = question.locator('summary');
  const answer = question.getByText('No, our team is open to all students in the Bay Area!');
  await expect(answer).toBeHidden();
  await summary.focus(); await page.keyboard.press('Enter');
  await expect(answer).toBeVisible();
  await page.keyboard.press('Space');
  await expect(answer).toBeHidden();
});

test('built search returns a robot and navigates to its page', async ({ page, baseURL }) => {
  test.skip(process.env.PW_DEV === '1', 'Pagefind is generated only by the production build.');
  await page.goto('./search/');
  await page.getByRole('textbox', { name: /search/i }).fill('Paddo');
  const result = page.locator('.pagefind-ui__result-link').filter({ hasText: /Paddo/i }).first();
  await expect(result).toBeVisible();
  const href = await result.getAttribute('href');
  expect(new URL(href!, baseURL).pathname).toContain(new URL(baseURL!).pathname + 'robots/paddo');
  await result.click();
  await expect(page.locator('main h1')).toContainText(/Paddo/i);
});

test('mobile and desktop pages do not overflow horizontally', async ({ page }) => {
  for (const route of ['./', './faq/', './robots/overview/', './robots/wispp---2026/']) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), route).toBeLessThanOrEqual(1);
  }
});

test('contact page offers a native form and a direct email alternative', async ({ page }) => {
  await page.goto('./contact/');
  const form = page.locator('main form');
  await expect(form.getByLabel('Name', { exact: true })).toBeEditable();
  await expect(form.getByLabel('Email', { exact: true })).toHaveAttribute('type', 'email');
  await expect(form.getByLabel('Message', { exact: true })).toBeEditable();
  await expect(form.getByRole('button', { name: 'Send message' })).toBeVisible();
  await expect(page.locator('main iframe[src*="docs.google.com/forms"]')).toHaveCount(0);
  await expect(page.locator('main').getByRole('link', { name: 'frc8033@piedmontmakers.org' }))
    .toHaveAttribute('href', 'mailto:frc8033@piedmontmakers.org');
});

test('contact form preserves a message on failure and clears it after acceptance', async ({ page }) => {
  const endpoint = 'https://contact.example.test/contact';
  await page.route('**/contact/', async (route) => {
    const source = await route.fetch();
    const html = (await source.text())
      .replace(/ data-(?:endpoint|site-key)="[^"]*"/g, '')
      .replace('data-contact-form', 'data-contact-form data-endpoint="' + endpoint + '" data-site-key="test"');
    await route.fulfill({ status: source.status(), contentType: 'text/html; charset=utf-8', body: html });
  });
  await page.route('https://challenges.cloudflare.com/turnstile/**', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: 'window.turnstile = { render(_, options) { this.callback = options.callback; this.reset(); return "test"; }, reset() { this.callback("test-token"); } };',
  }));
  const received: URLSearchParams[] = [];
  await page.route(endpoint, (route) => {
    received.push(new URLSearchParams(route.request().postData()!));
    return route.fulfill({
      status: received.length === 1 ? 503 : 202,
      headers: { 'Access-Control-Allow-Origin': new URL(page.url()).origin },
    });
  });

  await page.goto('./contact/');
  const form = page.locator('main form');
  const button = form.getByRole('button', { name: 'Send message' });
  const message = form.getByLabel('Message', { exact: true });
  await form.getByLabel('Name', { exact: true }).fill('Test Visitor');
  await form.getByLabel('Email', { exact: true }).fill('visitor@example.org');
  await message.fill('How can I join the team?');
  await button.click();
  await expect(form.getByRole('status')).toContainText('could not confirm receipt');
  await expect(message).toHaveValue('How can I join the team?');
  await button.click();
  await expect(form.getByRole('status')).toContainText('Your message was received');
  await expect(message).toHaveValue('');
  expect(received.map((body) => [body.get('email'), body.get('token')])).toEqual([
    ['visitor@example.org', 'test-token'], ['visitor@example.org', 'test-token'],
  ]);
});
