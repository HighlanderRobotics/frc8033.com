import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';

for (const route of ['./', './faq/', './robots/overview/', './search/']) {
  test(`accessibility: ${route}`, async ({ page }, testInfo) => {
    await page.goto(route);
    if (route === './search/' && process.env.PW_DEV !== '1') await expect(page.getByRole('textbox', { name: /search/i })).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    await testInfo.attach('accessibility-results', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
    expect(results.violations).toEqual([]);
  });
}
