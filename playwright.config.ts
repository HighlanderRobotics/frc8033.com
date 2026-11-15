import { defineConfig, devices } from '@playwright/test';
import { basePath } from './config/site.mjs';

const visual = process.env.PW_VISUAL === '1';
const dev = process.env.PW_DEV === '1';
if (dev && visual) throw new Error('Visual tests require a production build.');
const origin = 'http://localhost:4325';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: visual ? '**/visual.spec.ts' : '**/*.spec.ts',
  testIgnore: visual ? [] : ['**/visual.spec.ts'],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: origin + basePath,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    colorScheme: 'light',
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
    reducedMotion: 'reduce',
  },
  projects: visual ? [
    { name: 'visual-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'visual-mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
  ] : [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: { args: ['--enable-unsafe-swiftshader'] } } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'], launchOptions: { args: ['--enable-unsafe-swiftshader'] } } },
    ...(process.env.PW_ALL_BROWSERS === '1' ? [
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ] : []),
  ],
  webServer: {
    command: dev
      ? 'npm run dev -- --port 4325 --ignore-lock'
      : 'npm run preview -- --port 4325 --ignore-lock',
    url: origin + basePath,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
