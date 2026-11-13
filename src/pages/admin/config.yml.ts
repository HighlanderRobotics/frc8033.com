import template from '../../data/admin-config.yml?raw';
import { withBase } from '../../lib/urls';
import { site } from '../../../config/site.mjs';
export function GET() {
  const url = new URL(withBase('/'), site).href;
  const config = template.replace(/^public_folder:.*$/m, `public_folder: ${withBase('/uploads')}`);
  return new Response(`${config}\nsite_url: ${url}\ndisplay_url: ${url}\n`, { headers: { 'Content-Type': 'text/yaml; charset=utf-8' } });
}
