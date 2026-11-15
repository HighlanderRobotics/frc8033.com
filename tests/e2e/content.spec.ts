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

test('contact form embeds the intended service without submitting data', async ({ page }) => {
  await page.goto('./contact/');
  await expect(page.locator('iframe.contact-google-form')).toHaveAttribute('src', /https:\/\/docs.google.com\/forms\//);
  await expect(page.locator('main form')).toHaveCount(0);
});
