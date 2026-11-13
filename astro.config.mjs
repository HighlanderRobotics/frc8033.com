import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { site, basePath } from './config/site.mjs';
export default defineConfig({ site, base: basePath, trailingSlash: 'always', output: 'static', devToolbar: { enabled: false }, vite: { plugins: [tailwindcss()] } });
