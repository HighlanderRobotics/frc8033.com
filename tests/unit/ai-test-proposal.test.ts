import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, expect, it } from 'vitest';

const script = path.resolve('scripts/ai-test-proposal.mjs');
const temporary: string[] = [];
afterEach(() => {
  for (const directory of temporary.splice(0)) {
    if (path.dirname(directory) !== path.resolve(tmpdir()) || !path.basename(directory).startsWith('highlander-tests-')) throw new Error('Unexpected cleanup directory.');
    rmSync(directory, { recursive: true, force: true });
  }
});
const testFile = 'tests/unit/generated/regression.test.ts';
function proposal(files: Record<string, string>, manifest = Object.keys(files)) {
  const directory = mkdtempSync(path.join(tmpdir(), 'highlander-tests-'));
  temporary.push(directory);
  const artifact = path.join(directory, '.ai-proposal');
  mkdirSync(artifact);
  for (const [file, content] of Object.entries(files)) {
    const target = path.join(artifact, file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
  writeFileSync(path.join(artifact, 'manifest.json'), JSON.stringify({ files: manifest }));
  return { directory, apply: () => execFileSync(process.execPath, [script, 'apply'], { cwd: directory, stdio: 'pipe' }) };
}

it('copies an allowed new test and its documented requirement', () => {
  const content = 'test("regression", () => expect(result).toBe(expected));';
  const { directory, apply } = proposal({ [testFile]: content, 'docs/testing-cases/regression.md': 'The expected behavior.' });
  apply();
  expect(readFileSync(path.join(directory, testFile), 'utf8')).toBe(content);
  expect(readFileSync(path.join(directory, 'docs/testing-cases/regression.md'), 'utf8')).toBe('The expected behavior.');
});

it.each(['../outside.test.ts', 'src/lib/paths.mjs', '.github/workflows/pages.yml', 'tests/unit/generated/nested/regression.test.ts'])('rejects destination %s', forbidden => {
  const { apply } = proposal({ [testFile]: 'test("valid", () => {});' }, [testFile, forbidden]);
  expect(apply).toThrow();
});

it('refuses an overwrite before copying any of the proposed batch', () => {
  const other = 'tests/unit/generated/existing.test.ts';
  const { directory, apply } = proposal({ [testFile]: 'new test', [other]: 'replacement' });
  mkdirSync(path.join(directory, 'tests/unit/generated'), { recursive: true });
  writeFileSync(path.join(directory, other), 'original');
  expect(apply).toThrow();
  expect(readFileSync(path.join(directory, other), 'utf8')).toBe('original');
  expect(existsSync(path.join(directory, testFile))).toBe(false);
});

it('rejects unlisted artifact files and disabled tests', () => {
  const extra = proposal({ [testFile]: 'test("case", () => {});', 'unexpected.txt': 'extra' }, [testFile]);
  expect(extra.apply).toThrow();
  const disabled = proposal({ [testFile]: 'test.skip("case", () => {});' });
  expect(disabled.apply).toThrow();
});

it('requires tests, rejects duplicates, and bounds proposal size', () => {
  expect(proposal({ 'docs/testing-cases/notes.md': 'notes only' }).apply).toThrow();
  expect(proposal({ [testFile]: 'test' }, [testFile, testFile]).apply).toThrow();
  expect(proposal({ [testFile]: 'x'.repeat(50_001) }).apply).toThrow();
});
