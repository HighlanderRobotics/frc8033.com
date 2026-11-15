import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.{ts,mjs}'],
    environment: 'node',
    watchTriggerPatterns: [{
      pattern: /scripts[\\/]ai-test-proposal\.mjs$/,
      testsToRun: () => 'tests/unit/ai-test-proposal.test.ts',
    }],
    coverage: {
      provider: 'v8',
      include: ['src/lib/paths.mjs', 'src/lib/viewer-render-loop.mjs'],
      reporter: ['text', 'html', 'json-summary'],
      thresholds: { lines: 95, functions: 95, statements: 95, branches: 90 },
    },
  },
});
