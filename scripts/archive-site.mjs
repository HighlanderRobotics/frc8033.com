import { load } from 'cheerio';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Explicit refresh only: the raw archive is immutable evidence; imported content is separate.
const origin = 'https://www.frc8033.com';
const root = 'archive/2026-11-05';
await mkdir(`${root}/pages`, { recursive: true });
await mkdir('public/assets', { recursive: true });
const manifest = { reviewed: '2026-11-05', fetchedAt: new Date().toISOString(), origin, pages: [], assets: [], probes: [], externalLinks: [] };
const queue = ['/'];
const seen = new Set();
const assets = new Map();
const external = new Set();
const localName = url => '/assets/' + createHash('sha256').update(url).digest('hex').slice(0, 16) + '-' + decodeURIComponent(new URL(url).pathname.split('/').pop()).replace(/[^a-zA-Z0-9._-]/g, '_').slice(-110);
function asset(url, base = origin) {
  try {
    const u = new URL(url, base);
    if (!['cdn.prod.website-files.com', 'uploads-ssl.webflow.com', 'fonts.gstatic.com', 'fonts.googleapis.com', 'd3e54v103j8qbb.cloudfront.net', 'ajax.googleapis.com'].includes(u.hostname)) return url;
    if (!assets.has(u.href)) assets.set(u.href, localName(u.href));
    return assets.get(u.href);
  } catch { return url; }
}
async function get(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return await fetch(url, { headers: { 'User-Agent': 'HighlanderRoboticsMigration/1.0 (public site archive)' }, signal: AbortSignal.timeout(45000) }); }
    catch (error) { if (attempt === 2) throw error; }
  }
}
while (queue.length) {
  const route = queue.shift();
  if (seen.has(route)) continue;
  seen.add(route);
  const response = await get(origin + route);
  if (!response.ok) { manifest.probes.push({ url: origin + route, status: response.status }); continue; }
  const html = await response.text();
  const filename = route === '/' ? 'index.html' : route.slice(1).replaceAll('/', '__') + '.html';
  await writeFile(`${root}/pages/${filename}`, html);
  const $ = load(html);
  $('a[href]').each((_, el) => {
    try {
      const u = new URL($(el).attr('href'), origin);
      if (['frc8033.com', 'www.frc8033.com'].includes(u.hostname)) {
        const next = u.pathname.replace(/\/$/, '') || '/';
        if (!seen.has(next) && !queue.includes(next)) queue.push(next);
      } else if (u.protocol.startsWith('http')) external.add(u.href);
    } catch {}
  });
  $('[src], [href], [poster]').each((_, el) => {
    for (const attr of ['src', 'href', 'poster']) if ($(el).attr(attr)) $(el).attr(attr, asset($(el).attr(attr)));
  });
  $('[srcset]').each((_, el) => $(el).attr('srcset', $(el).attr('srcset').split(/,\s+/).map(item => { const [u, size] = item.split(/\s+/); return asset(u) + (size ? ' ' + size : ''); }).join(', ')));
  $('[style]').each((_, el) => $(el).attr('style', $(el).attr('style').replace(/url\(["']?([^)'"\s]+)["']?\)/g, (_, u) => `url("${asset(u)}")`)));
  const css = $('link[rel="stylesheet"]').map((_, el) => $(el).attr('href')).get();
  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content') || $('body').text().replace(/\s+/g, ' ').trim().slice(0, 155);
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  const forms = $('form').map((_, el) => ({ name: $(el).attr('name'), action: $(el).attr('action') || null, fields: $(el).find('input, textarea').map((_, f) => ({ name: $(f).attr('name'), type: $(f).attr('type'), required: $(f).is('[required]') })).get() })).get();
  const placeholders = $('a[href="#"]').map((_, el) => $(el).text().trim()).get();
  const header = $('body > header').first().toString();
  const footerEl = $('footer').first();
  const footer = footerEl.toString();
  $('body > header, footer, script').remove();
  $('[data-w-id]').removeAttr('data-w-id');
  // Webflow runtime is replaced with small, accessible native controls.
  $('a[href]').each((_, el) => { const href = $(el).attr('href'); if (/^https?:\/\/(www\.)?frc8033\.com/.test(href)) $(el).attr('href', new URL(href).pathname); });
  const body = $('body').html();
  manifest.pages.push({ route, title, description, filename, css, bodyClass: $('body').attr('class') || '', forms, placeholders, images: $('img').length, emptyAltImages: $('img[alt=""]').length });
  await writeFile(`${root}/pages/${filename}.txt`, text);
  await mkdir('src/content/pages', { recursive: true });
  const record = { route, title, description, bodyClass: $('body').attr('class') || '', body };
  await writeFile(`src/content/pages/${filename.replace('.html', '.json')}`, JSON.stringify(record, null, 2));
  if (route === '/') {
    await mkdir('src/data', { recursive: true });
    await writeFile('src/data/chrome.json', JSON.stringify({ header, footer, css }, null, 2));
  }
  console.log('Archived', route);
}
// Fonts requested by the original WebFont loader, downloaded as local styles/assets.
asset('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&family=Russo+One&display=swap');
const done = new Set();
while ([...assets.keys()].some(u => !done.has(u))) {
  const batch = [...assets.entries()].filter(([u]) => !done.has(u));
  for (let i = 0; i < batch.length; i += 8) await Promise.all(batch.slice(i, i + 8).map(async ([url, local]) => {
    done.add(url);
    try {
      const r = await get(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      let data = Buffer.from(await r.arrayBuffer());
      const type = r.headers.get('content-type') || '';
      if (type.includes('text/css')) {
        const raw = data.toString();
        await mkdir(`${root}/styles`, { recursive: true });
        await writeFile(`${root}/styles/${path.basename(local)}`, raw);
        data = Buffer.from(raw.replace(/url\(["']?([^)'"\s]+)["']?\)/g, (_, u) => `url("${asset(u, url)}")`));
      }
      await writeFile('public' + local, data);
      manifest.assets.push({ url, local, bytes: data.length, type, sha256: createHash('sha256').update(data).digest('hex'), status: 200 });
    } catch (e) { manifest.assets.push({ url, local, error: e.message }); }
  }));
  console.log('Assets processed', done.size, '/', assets.size);
}
for (const route of ['/robots.txt', '/sitemap.xml']) {
  const r = await get(origin + route);
  const body = await r.text();
  manifest.probes.push({ url: origin + route, status: r.status });
  await writeFile(`${root}/${route.slice(1)}`, body);
}
manifest.externalLinks = [...external].sort();
await writeFile(`${root}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({ pages: manifest.pages.length, assets: manifest.assets.length, failedAssets: manifest.assets.filter(a => a.error).length }));
