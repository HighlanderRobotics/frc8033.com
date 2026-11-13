import { site } from '../../config/site.mjs';
import { withBase } from '../lib/urls';
export function GET() {
  return new Response(`User-agent: *\nAllow: ${withBase('/')}\nDisallow: ${withBase('/admin/')}\nSitemap: ${new URL(withBase('/sitemap.xml'), site).href}\n`, { headers: { 'Content-Type': 'text/plain' } });
}
