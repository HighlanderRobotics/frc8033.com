import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { site, basePath } from './config/site.mjs';
export default defineConfig({
  site,
  base: basePath,
  // Accept original Webflow bookmarks and directory URLs during local preview.
  // GitHub Pages serves the directory index and adds the slash in production.
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  output: 'static',
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
});
