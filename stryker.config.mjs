export default {
  ignorePatterns: ['**', '!src/**', '!config/**', '!scripts/ai-test-proposal.mjs', '!tests/unit/**', '!vitest.config.ts', '!tsconfig.json', '!package.json'],
  disableTypeChecks: false,
  testRunner: 'vitest',
  vitest: { configFile: 'vitest.config.ts' },
  mutate: ['src/lib/paths.mjs', 'src/lib/viewer-render-loop.mjs'],
  coverageAnalysis: 'perTest',
  reporters: ['clear-text', 'html', 'json'],
  incremental: true,
  concurrency: 2,
  thresholds: { high: 90, low: 75, break: 70 },
};
