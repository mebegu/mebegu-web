import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    category: z.enum(['Notes', 'Software', 'Personal', 'Atlantis']),
    draft: z.boolean().default(false),
    lang: z.enum(['en', 'tr']),
    translationKey: z.string(),
  }),
});

export const collections = { writing };
