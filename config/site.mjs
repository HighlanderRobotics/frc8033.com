// GitHub Pages project site by default; override both values for a custom domain.
export const site = process.env.SITE_URL || 'https://highlanderrobotics.github.io';
const segments = (process.env.BASE_PATH ?? 'frc8033.com').split('/').filter(Boolean);
export const basePath = segments.length ? '/' + segments.join('/') + '/' : '/';
