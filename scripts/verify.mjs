import { load } from 'cheerio';
import { readFile, access, writeFile } from 'node:fs/promises';
import path from 'node:path';
const m = JSON.parse(await readFile('archive/2026-11-05/manifest.json','utf8'));
const errors = []; let links = 0; let media = 0;
const routes = new Set([...m.pages.map(p => p.route),'/search','/admin','/404']);
for (const page of m.pages) {
  const file = 'dist' + (page.route === '/' ? '/index.html' : page.route+'/index.html');
  const $ = load(await readFile(file,'utf8'));
  if (!$('main[data-pagefind-body]').length) errors.push(`${page.route}: missing search body`);
  if ($('main h1').length !== 1) errors.push(`${page.route}: expected one main heading`);
  if ($('header details.nav-dropdown').length !== 3) errors.push(`${page.route}: expected three native navigation dropdowns`);
  if (!$('header button[aria-controls="primary-navigation"]').length) errors.push(`${page.route}: missing mobile navigation control`);
  if ($('main a.w-button[href="#"]').length) errors.push(`${page.route}: placeholder action button`);
  if ($('main .lottie-animation').length) errors.push(`${page.route}: unsupported Webflow animation`);
  if (!$('footer, .footer-dark').length) errors.push(`${page.route}: missing footer`);
  if ($('script[src*="webflow"]').length) errors.push(`${page.route}: legacy runtime retained`);
  for (const el of $('a[href]').toArray()) {
    const href = $(el).attr('href');
    if (href.startsWith('/') && !href.startsWith('//')) {
      links++;
      const route = href.split(/[?#]/)[0].replace(/\/$/,'') || '/';
      if (!routes.has(route)) { try { await access('dist'+route); } catch { errors.push(`${page.route}: broken link ${href}`); } }
    }
  }
  const urls = $('[src],[href],[srcset]').toArray().flatMap(el => ['src','href','srcset'].flatMap(attr => ($(el).attr(attr)||'').split(/,\s+/).map(s=>s.split(/\s+/)[0]))).filter(u=>u.startsWith('/assets/'));
  for (const url of urls) { media++; try { await access('dist'+url); } catch { errors.push(`${page.route}: missing ${url}`); } }
  if (page.route === '/faq' && $('main details.migration-faq').length !== 16) errors.push('Expected 16 functional FAQ disclosures');
}
// CSS images/fonts must resolve too.
for (const asset of m.assets.filter(a => a.type?.includes('text/css'))) {
  const css = await readFile('dist'+asset.local,'utf8');
  for (const match of css.matchAll(/url\("(\/assets\/[^\"]+)"\)/g)) { try { await access('dist'+match[1]); } catch { errors.push('CSS missing '+match[1]); } }
}
await access('dist/pagefind/pagefind.js');
await access('dist/admin/index.html');
await access('dist/sitemap.xml');
const report = { pages:m.pages.length, checkedInternalLinks:links, checkedAssetReferences:media, errors:[...new Set(errors)] };
await writeFile('docs/verification.json',JSON.stringify(report,null,2));
console.log(report);
if (errors.length) process.exitCode=1;
