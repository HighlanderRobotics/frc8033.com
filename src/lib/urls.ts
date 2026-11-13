import { createPaths } from './paths.mjs';
export const { withBase, withoutBase, srcset, root } = createPaths(import.meta.env.BASE_URL);
