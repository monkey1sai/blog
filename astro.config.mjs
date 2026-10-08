// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 正式網址：部署後若 pages.dev 子網域或自訂網域不同，設定環境變數 SITE_URL 再 build。
const site = process.env.SITE_URL ?? 'https://ai-craft-lab.pages.dev';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
