import { test, expect } from './fixtures';

test.beforeEach(async ({ page }) => { await page.goto('./'); });

test('navigation works with the keyboard and closes with Escape', async ({ page }) => {
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  const mobile = await toggle.isVisible();
  if (mobile) await toggle.click();
  const robots = page.locator('header details').filter({ has: page.locator('summary', { hasText: /^Robots$/ }) });
  const summary = robots.locator('summary');
  await summary.focus(); await page.keyboard.press('Enter');
  await expect(robots).toHaveAttribute('open', '');
  await expect(robots.getByRole('link', { name: 'All Robots', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(robots).not.toHaveAttribute('open', '');
  await expect(summary).toBeFocused();
  if (mobile) {
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  }
});

test('opening another menu closes the previous one and links stay under the deployment prefix', async ({ page, baseURL }) => {
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  if (await toggle.isVisible()) await toggle.click();
  const menus = page.locator('header details');
  await menus.nth(0).locator('summary').click();
  await expect(menus.nth(0)).toHaveAttribute('open', '');
  await menus.nth(1).locator('summary').click();
  await expect(menus.nth(0)).not.toHaveAttribute('open', '');
  await expect(menus.nth(1)).toHaveAttribute('open', '');
  const robots = menus.filter({ has: page.locator('summary', { hasText: /^Robots$/ }) });
  await robots.locator('summary').click();
  const all = robots.getByRole('link', { name: 'All Robots', exact: true });
  await expect(all).toHaveAttribute('href', new URL('robots/overview/', baseURL).pathname);
  await all.click();
  await expect(page).toHaveURL(new URL('robots/overview/', baseURL).href);
  await expect(page.locator('main h1')).toBeVisible();
});

test('skip link is keyboard reachable and jumps to main content', async ({ page }) => {
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator('main')).toBeInViewport();
});
