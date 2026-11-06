import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ site: 'https://www.frc8033.com', output: 'static', devToolbar: { enabled: false }, vite: { plugins: [tailwindcss()] } });
