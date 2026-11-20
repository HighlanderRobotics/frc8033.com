// Read-only inventory of the public site; does not import or overwrite content.
import { load } from 'cheerio';
import { writeFile } from 'node:fs/promises';
const origin = 'https://www.frc8033.com';
const queue = ['/'];
const pages = [];
const seen = new Set();
while (queue.length && seen.size < 80) {
  const route = queue.shift();
  if (seen.has(route)) continue;
  seen.add(route);
  const response = await fetch(origin + route, { signal: AbortSignal.timeout(30000) });
  const $ = load(await response.text());
  const links = [...new Set($('a[href]').toArray().flatMap(el => {
    const url = new URL($(el).attr('href'), origin + route);
    return url.origin === origin ? [url.pathname + url.search + url.hash] : [];
  }))];
  pages.push({ route, status: response.status, title: $('title').text(), links });
  for (const link of links) {
    const pathname = link.split(/[?#]/)[0].replace(/\/$/, '') || '/';
    if (!/\.[a-z0-9]+$/i.test(pathname) && !seen.has(pathname)) queue.push(pathname);
  }
}
if (queue.length) throw new Error('Crawl limit reached; review inventory before use');
await writeFile('docs/url-compatibility/live-site.json', JSON.stringify({ origin, checkedOn: '2026-11-19', pages }, null, 2) + '\n');
console.log(pages.map(p => `${p.status} ${p.route}`).join('\n'));
