import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const insights = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/insights' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    standfirst: z.string(),
    description: z.string().max(155),
    pillar: z.enum(['innovation', 'process', 'quality', 'strategy', 'deals', 'capability']),
    format: z.enum(['point-of-view', 'field-notes', 'explainer']),
    status: z.enum(['published', 'draft', 'coming-soon']),
    review: z.enum(['pending', 'approved']).default('pending'),
    date: z.coerce.date().optional(),          // CONFIRM publication date
    updated: z.coerce.date().optional(),
    author: z.literal('ganeaysh').default('ganeaysh'),
    image: image().optional(), imageAlt: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { insights };
