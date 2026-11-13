import { load } from 'cheerio';
import { readFile, access, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { readdir } from 'node:fs/promises';
import { site, basePath } from '../config/site.mjs';
import { createPaths } from '../src/lib/paths.mjs';
const { withBase, withoutBase } = createPaths(basePath);
const m = JSON.parse(await readFile('archive/2026-11-05/manifest.json','utf8'));
const errors = []; let links = 0; let media = 0;
const routes = new Set([...m.pages.map(p => p.route),'/search','/admin','/404']);
for (const page of m.pages) {
  const file = 'dist' + (page.route === '/' ? '/index.html' : page.route+'/index.html');
  const $ = load(await readFile(file,'utf8'));
  if (!$('main[data-pagefind-body]').length) errors.push(`${page.route}: missing search body`);
  if ($('main').attr('data-page') !== page.route) errors.push(`${page.route}: deployment base leaked into styling route`);
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
      const route = withoutBase(href.split(/[?#]/)[0]);
      if (!routes.has(route)) { try { await access('dist'+route); } catch { errors.push(`${page.route}: broken link ${href}`); } }
    }
  }
  const urls = $('[src],[href],[srcset]').toArray().flatMap(el => ['src','href','srcset'].flatMap(attr => ($(el).attr(attr)||'').split(/,\s+/).map(s=>s.split(/\s+/)[0]))).filter(u=>u.startsWith(withBase('/assets/')));
  for (const url of urls) { media++; try { await access('dist'+withoutBase(url)); } catch { errors.push(`${page.route}: missing ${url}`); } }
  if (page.route === '/faq' && $('main details.migration-faq').length !== 16) errors.push('Expected 16 functional FAQ disclosures');
}
// Check every generated HTML page, not only the legacy content routes, and resolve
// CSS URLs relative to their stylesheet as a browser would under a project prefix.
async function checkUrl(value, from, label) {
  if (!value || value.startsWith('#') || /^(data:|mailto:|tel:|javascript:)/i.test(value)) return;
  const url = new URL(value, new URL(withBase(from), site));
  if (url.origin !== new URL(site).origin) return;
  if (basePath !== '/' && !url.pathname.startsWith(basePath)) { errors.push(`${label}: escapes deployment base: ${value}`); return; }
  const local = withoutBase(decodeURIComponent(url.pathname));
  const candidates = ['dist'+local, 'dist'+local+'/index.html'];
  if (local === '/') candidates.push('dist/index.html');
  if (local === '/404') candidates.push('dist/404.html');
  for (const file of candidates) { try { await access(file); return; } catch {} }
  errors.push(`${label}: unresolved ${value}`);
}
const output = await readdir('dist', {recursive:true});
let urlReferences = 0;
for (const file of output.filter(f=>f.endsWith('.html'))) {
  const html = await readFile(path.join('dist',file),'utf8');
  const $ = load(html);
  const from = '/'+file.replaceAll('\\','/');
  for (const el of $('[href],[src],[poster],[action],[srcset]').toArray()) {
    for (const attr of ['href','src','poster','action']) {
      const value = $(el).attr(attr);
      if (value) { urlReferences++; await checkUrl(value,from,file); }
    }
    const candidates = $(el).attr('srcset');
    if (candidates && !candidates.includes('data:')) for (const candidate of candidates.split(/,\s*/)) await checkUrl(candidate.split(/\s+/)[0],from,file);
  }
  for (const el of $('[style]').toArray()) for (const match of $(el).attr('style').matchAll(/url\((?:"([^"]+)"|'([^']+)'|([^)]*))\)/g)) await checkUrl(match[1]||match[2]||match[3],from,file);
  const canonical = $('link[rel=canonical]').attr('href');
  if (canonical && !canonical.startsWith(new URL(basePath, site).href)) errors.push(`${file}: incorrect canonical ${canonical}`);
}
const cssFiles = new Set([...output.filter(f=>f.endsWith('.css')), ...m.assets.filter(a=>a.type?.includes('text/css')).map(a=>a.local.slice(1))]);
for (const file of cssFiles) {
  const css = await readFile(path.join('dist',file),'utf8');
  for (const match of css.matchAll(/url\((?:"([^"]+)"|'([^']+)'|([^)]*))\)/g)) await checkUrl((match[1]||match[2]||match[3]).trim(),'/'+file.replaceAll('\\','/'),file);
}
const cms = await readFile('dist/admin/config.yml','utf8');
for (const expected of [`site_url: ${new URL(basePath,site).href}`,`display_url: ${new URL(basePath,site).href}`,`public_folder: ${withBase('/uploads')}`]) if (!cms.includes(expected)) errors.push('CMS missing '+expected);
const sitemap = load(await readFile('dist/sitemap.xml','utf8'), {xmlMode:true});
sitemap('loc').each((_,el)=>{ if (!sitemap(el).text().startsWith(new URL(basePath,site).href)) errors.push('Sitemap URL outside deployment'); });
await access('dist/pagefind/pagefind.js');
await access('dist/admin/index.html');
await access('dist/sitemap.xml');
const report = { site, basePath, pages:m.pages.length, checkedInternalLinks:links, checkedAssetReferences:media, checkedUrlReferences:urlReferences, errors:[...new Set(errors)] };
await writeFile('docs/verification.json',JSON.stringify(report,null,2));
console.log(report);
if (errors.length) process.exitCode=1;
