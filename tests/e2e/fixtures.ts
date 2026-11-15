import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page, baseURL }, use) => {
    // Test our site deterministically; do not depend on YouTube, Forms, or
    // analytics availability and never submit anything to external services.
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      return url.origin === new URL(baseURL!).origin || !/^https?:$/.test(url.protocol)
        ? route.continue() : route.abort();
    });
    await use(page);
  },
});
export { expect };
