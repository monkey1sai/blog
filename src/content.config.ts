import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const kebab = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, '標籤請使用 kebab-case（小寫英數與連字號）');

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(140),
    category: z.enum(['game', 'ai-agent', 'audio', 'tool', 'product']),
    tags: z.array(kebab).default([]),
    techStack: z.array(z.string()).default([]),
    cover: z.string().optional(),
    status: z.enum(['live', 'beta', 'development', 'archived']),
    featured: z.boolean().default(false),
    featuredOrder: z.number().int().positive().optional(),
    draft: z.boolean().default(false),
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    links: z
      .array(
        z.object({
          type: z.enum(['demo', 'source', 'video', 'store', 'docs']),
          label: z.string(),
          url: z.url(),
        }),
      )
      .default([]),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum([
      'ai-agents',
      'game-dev',
      'creative-coding',
      'engineering',
      'research',
      'building-in-public',
    ]),
    tags: z.array(kebab).default([]),
    cover: z.string().optional(),
    relatedProjects: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
