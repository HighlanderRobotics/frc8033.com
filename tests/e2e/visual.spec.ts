import { test, expect } from './fixtures';

test('FAQ first viewport', async ({ page }) => {
  await page.goto('./faq/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot('faq.png', { animations: 'disabled', maxDiffPixelRatio: 0.005 });
});
