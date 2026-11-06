import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const root = 'archive/2026-11-05';
const m = JSON.parse(await readFile(`${root}/manifest.json`, 'utf8'));
const localName = url => '/assets/' + createHash('sha256').update(url).digest('hex').slice(0,16) + '-' + decodeURIComponent(new URL(url).pathname.split('/').pop()).replace(/[^a-zA-Z0-9._-]/g,'_').slice(-110);
for (const css of m.assets.filter(a => a.type?.includes('text/css'))) {
  let raw = await readFile(`${root}/styles/${path.basename(css.local)}`, 'utf8');
  const matches = [...raw.matchAll(/url\((?:"([^"]+)"|'([^']+)'|([^)]*))\)/g)];
  for (const match of matches) {
    const url = new URL(match[1] || match[2] || match[3], css.url).href;
    if (url.startsWith('data:')) continue;
    let a = m.assets.find(a => a.url === url && a.status === 200);
    if (!a) {
      const r = await fetch(url); if (!r.ok) throw new Error(`${url}: ${r.status}`);
      const bytes = Buffer.from(await r.arrayBuffer());
      a = {url, local:localName(url), bytes:bytes.length, type:r.headers.get('content-type'), status:200, sha256:createHash('sha256').update(bytes).digest('hex')};
      await writeFile('public'+a.local, bytes); m.assets.push(a);
    }
    raw = raw.replaceAll(match[0], `url("${a.local}")`);
  }
  await writeFile('public'+css.local, raw);
  css.bytes = Buffer.byteLength(raw); css.sha256 = createHash('sha256').update(raw).digest('hex');
}
m.archiveNotes = ['Three failed URLs are preconnect host roots, not downloadable files.', 'The upstream placeholder.svg returns 403 and is omitted from the replica.', 'The truncated font URL was a crawler parsing error; the complete font URL was subsequently fetched successfully.'];
await writeFile(`${root}/manifest.json`, JSON.stringify(m,null,2));
console.log('Repaired CSS dependencies; all referenced fonts are local.');
