import { getCollection } from 'astro:content';
import { site } from '../../config/site.mjs';
import { withBase } from '../lib/urls';
export async function GET() {
  const paths = [...(await getCollection('pages')).map(p => p.data.route), '/search'];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p => `<url><loc>${new URL(withBase(p === '/' ? '/' : p + '/'), site).href}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
}
