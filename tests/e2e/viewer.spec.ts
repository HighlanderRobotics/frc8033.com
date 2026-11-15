import { test, expect } from './fixtures';

test('3D model is loaded only after the visitor requests it', async ({ page }) => {
  test.setTimeout(90_000);
  const requests: string[] = [];
  page.on('request', request => { if (request.url().includes('.glb')) requests.push(request.url()); });
  await page.goto('./robots/wispp---2026/');
  const viewer = page.locator('[data-robot-viewer]');
  await expect(viewer.getByRole('button', { name: 'Front', exact: true })).toBeDisabled();
  await expect(viewer.locator('canvas')).toHaveCount(0);
  expect(requests).toHaveLength(0);
  await viewer.getByRole('button', { name: /Explore the 3D Model/ }).click();
  await expect(viewer).toHaveAttribute('data-ready', 'true', { timeout: 60_000 });
  await expect(viewer.locator('canvas')).toBeVisible();
  expect(requests).toHaveLength(1);
  const front = viewer.getByRole('button', { name: 'Front', exact: true });
  await front.click();
  await expect(front).toHaveAttribute('aria-pressed', 'true');
  await viewer.getByRole('button', { name: 'Auto-Rotate', exact: true }).click();
  await expect(viewer.getByRole('button', { name: 'Stop Rotation' })).toHaveAttribute('aria-pressed', 'true');
  await viewer.getByRole('button', { name: 'Stop Rotation' }).click();
  await expect(viewer.getByRole('button', { name: 'Auto-Rotate', exact: true })).toHaveAttribute('aria-pressed', 'false');
  const host = viewer.getByRole('group', { name: 'Interactive Wisp robot model', exact: true });
  await host.focus(); await page.keyboard.press('0');
  await expect(viewer.getByRole('button', { name: 'Reset View' })).toHaveAttribute('aria-pressed', 'true');
});

test('model download failure offers a retry', async ({ page }) => {
  await page.route('**/models/wisp.glb.gz', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('./robots/wispp---2026/');
  await page.getByRole('button', { name: /Explore the 3D Model/ }).click();
  await expect(page.getByRole('button', { name: 'Try Loading Again' })).toBeEnabled();
  await expect(page.locator('.model-status')).toContainText('The 3D model could not load.');
  await expect(page.locator('[data-robot-viewer]')).not.toHaveClass(/is-loaded/);
});
