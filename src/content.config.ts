import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
export const collections = {
  pages: defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/pages' }),
    schema: z.object({ route: z.string(), title: z.string(), description: z.string(), bodyClass: z.string(), body: z.string() })
  })
};
