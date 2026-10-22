import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const catalogImage = z.object({
  src: z.string(),
  alt: z.object({ tr: z.string(), en: z.string() }),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  position: z.string().default('center'),
});
const imageSource = z.object({
  src: z.string(),
  width: z.number().int().positive(),
});

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
    translatedFrom: z.string().optional(),
    catalog: z
      .object({
        shelf: z.enum(['technology', 'culture', 'society']),
        summary: z.object({ tr: z.string(), en: z.string() }),
        cover: catalogImage,
        banner: catalogImage
          .extend({
            sources: z.array(imageSource).min(1),
            mobile: z.object({
              src: z.string(),
              width: z.number().int().positive(),
              height: z.number().int().positive(),
              position: z.string().default('center'),
              sources: z.array(imageSource).min(1),
            }),
          })
          .optional(),
        tone: z.enum(['blue', 'amber', 'violet', 'green']),
      })
      .optional(),
    source: z
      .object({
        url: z.url(),
        published: z.string(),
        visibleDate: z.string(),
        categories: z.array(z.string()),
        imported: z.coerce.date(),
      })
      .optional(),
  }),
});

export const collections = { writing };
