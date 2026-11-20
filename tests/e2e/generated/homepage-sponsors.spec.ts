import { test, expect } from '../fixtures';

test('all 15 homepage sponsor logos are unobscured', async ({ page }) => {
  const viewport = page.viewportSize()!;
  const widths = viewport.width >= 992 ? [viewport.width, 768, 480] : [viewport.width];
  for (const width of widths) {
    await test.step('Check sponsor logos at ' + width + 'px', async () => {
      if (width !== viewport.width) await page.setViewportSize({ ...viewport, width });
      await page.goto('./');
      const logos = page.locator('section').filter({
        has: page.getByRole('heading', { name: 'Our Sponsors', exact: true }),
      }).locator('img');
      await expect(logos).toHaveCount(15);

      const hidden = await logos.evaluateAll(async (images: HTMLImageElement[]) => {
        const decoded = await Promise.allSettled(images.map(async image => {
          image.loading = 'eager';
          await image.decode();
        }));
        return images.flatMap((image, index) => {
          image.scrollIntoView({ block: 'center', inline: 'nearest' });
          const { x, y, width, height } = image.getBoundingClientRect();
          const fullyExposed = [0.05, 0.5, 0.95].every(horizontal =>
            [0.05, 0.5, 0.95].every(vertical =>
              document.elementFromPoint(x + width * horizontal, y + height * vertical) === image,
            ),
          );
          return decoded[index].status === 'fulfilled' && width > 0 && height > 0 && fullyExposed
            ? []
            : [image.getAttribute('src')];
        });
      });
      expect(hidden).toEqual([]);
    });
  }
});
