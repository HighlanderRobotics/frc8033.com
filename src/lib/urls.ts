import { createPaths } from './paths.mjs';
import { linkTitle } from './page-titles';
export const { withBase, withoutBase, srcset, root } = createPaths(import.meta.env.BASE_URL);

/** Directory-style page URLs work in Astro dev and on GitHub Pages. */
export function pageUrl(href: string) {
  return withBase(linkTitle(href) ? href.replace(/^([^?#]*?)(\/?)([?#].*)?$/, '$1/$3') : href);
}
