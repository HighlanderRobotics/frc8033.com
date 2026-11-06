import manifest from '../../archive/2026-11-05/manifest.json';
export function GET() {
  const paths = [...manifest.pages.map(p => p.route), '/search'];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p => `<url><loc>https://www.frc8033.com${p}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
}
