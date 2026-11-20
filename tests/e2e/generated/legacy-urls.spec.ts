import { readFileSync } from 'node:fs';
import { test, expect } from '../fixtures';
import { site, basePath } from '../../../config/site.mjs';

const live = JSON.parse(readFileSync('docs/url-compatibility/live-site.json', 'utf8'));
const archive = JSON.parse(readFileSync('archive/2026-11-05/manifest.json', 'utf8'));
const routes = [...new Set<string>([...live.pages, ...archive.pages].map(page => page.route))];

test('every original public page accepts old and directory URLs', async ({ request, baseURL }) => {
  for (const route of routes) {
    const suffix = route === '/' ? '' : route.slice(1) + '/';
    const canonical = new URL(basePath + suffix, site).href;
    for (const path of new Set([suffix, suffix.replace(/\/$/, '')])) {
      const response = await request.get(new URL(path, baseURL!).href);
      expect(response.status(), route).toBe(200);
      const html = await response.text();
      expect(html, route).toContain(`data-page="${route}"`);
      expect(html, route).toContain(`rel="canonical" href="${canonical}"`);
    }
  }
});

test('legacy bookmark retains its query and fragment', async ({ page, baseURL }) => {
  const url = new URL('robots/wispp---2026?from=bookmark#main', baseURL!);
  await page.goto(url.href);
  await expect(page.locator('main')).toHaveAttribute('data-page', '/robots/wispp---2026');
  expect(new URL(page.url()).search).toBe('?from=bookmark');
  expect(new URL(page.url()).hash).toBe('#main');
});
