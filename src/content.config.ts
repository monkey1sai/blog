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
    /** 副標，通常放 repo 名稱 */
    subtitle: z.string().optional(),
    summary: z.string().max(140),
    category: z.enum(['game', 'ai-agent', 'audio', 'tool', 'product', 'research', 'design']),
    tags: z.array(kebab).default([]),
    techStack: z.array(z.string()).default([]),
    /** 卡片封面，public/ 底下的路徑（例如 /covers/my-game.webp）；檔案不存在時自動改用預設圖樣 */
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    status: z.enum(['live', 'beta', 'development', 'prototype', 'design', 'archived']),
    /** 狀態標籤的實際文字（例如「已公開試玩」）；不填就用 status 的預設名稱 */
    statusLabel: z.string().max(24).optional(),
    /** 作品集頁排序（數字越小越前面）；不填排在有填的後面 */
    order: z.number().int().positive().optional(),
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
