import { load } from 'cheerio';
import { readFile, writeFile } from 'node:fs/promises';
const root = 'archive/2026-11-05';
const manifest = JSON.parse(await readFile(`${root}/manifest.json`, 'utf8'));
const mapping = new Map(manifest.assets.filter(a => a.status === 200).map(a => [a.url, a.local]));
function rewrite(value) {
  for (const [url, local] of [...mapping].sort((a,b) => b[0].length-a[0].length)) value = value.replaceAll(url, local);
  return value;
}
for (const page of manifest.pages) {
  const $ = load(rewrite(await readFile(`${root}/pages/${page.filename}`, 'utf8')));
  $('script').remove();
  $('[data-w-id]').removeAttr('data-w-id');
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (/^https?:\/\/(www\.)?frc8033\.com/.test(href)) { $(el).attr('href', new URL(href).pathname); $(el).removeAttr('target'); }
    if ($(el).attr('target') === '_blank') $(el).attr('rel', 'noopener noreferrer');
  });
  // Replace the platform-dependent FAQ widget with native disclosures.
  $('.question-dropdown').each((_, el) => {
    const item = $(el);
    const summary = item.children('.w-dropdown-toggle').html();
    const answer = item.children('.w-dropdown-list');
    answer.find('a[href="#"]').each((_, a) => { const p = $('<p></p>').attr('class', $(a).attr('class')).html($(a).html()); $(a).replaceWith(p); });
    item.replaceWith(`<details class="question-dropdown migration-faq"><summary class="dropdown-toggle-7">${summary}</summary><div class="w-dropdown-list">${answer.html()}</div></details>`);
  });
  if (page.route === '/') $('a[href="#"]').filter((_, el) => $(el).text().trim() === 'Learn More').attr('href', '/robots/paddo');
  // Missing decorative Webflow placeholders are not meaningful content.
  $('img[src*="placeholder.svg"]').remove();
  const header = $('body > header').first().toString();
  const footer = $('body > .footer-dark').first().toString();
  if (page.route === '/') await writeFile('src/data/chrome.json', JSON.stringify({ header, footer, css: page.css }, null, 2));
  $('body > header, body > .footer-dark').remove();
  // Retain the actual headline as an accessible first-level heading.
  $('.heading.h1').each((_, el) => $(el).replaceWith(`<h1 class="${$(el).attr('class')}">${$(el).html()}</h1>`));
  await writeFile(`src/content/pages/${page.filename.replace('.html', '.json')}`, JSON.stringify({ route: page.route, title: page.title, description: page.description, bodyClass: page.bodyClass, body: $('body').html() }, null, 2));
}
console.log(`Imported ${manifest.pages.length} pages from the preserved archive.`);
