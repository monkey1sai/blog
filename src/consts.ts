export const SITE = {
  name: '許竣傑 · AI Craft Lab',
  shortName: 'AI Craft Lab',
  author: '許竣傑',
  handle: 'monkey1sai',
  tagline: '把想法做出來，把過程留下來。',
  description:
    '許竣傑（monkey1sai）的作品集與開發筆記：瀏覽器遊戲、AI 遊戲代理、即時音訊合成、MCP 工具與 Agent 技能商店。',
  locale: 'zh-TW',
  ogImage: '/og-default.png',
} as const;

export const NAV = [
  { href: '/', label: '首頁' },
  { href: '/projects/', label: '作品集' },
  { href: '/blog/', label: '文章' },
  { href: '/about/', label: '關於' },
  { href: '/contact/', label: '聯絡' },
] as const;

export const SOCIALS = [
  { name: 'X', handle: '@monkey1sai', url: 'https://x.com/monkey1sai' },
  { name: 'Threads', handle: '@monkey1sai', url: 'https://www.threads.com/@monkey1sai' },
  { name: 'GitHub', handle: 'monkey1sai', url: 'https://github.com/monkey1sai' },
  { name: 'YouTube', handle: '竣傑的AiCraftLabTW', url: 'https://www.youtube.com/@Aicraftlab-f3s' },
  { name: 'itch.io', handle: 'monkey1sai', url: 'https://monkey1sai.itch.io' },
] as const;

export const PROJECT_CATEGORIES = {
  game: '遊戲',
  'ai-agent': 'AI Agent',
  audio: '音訊',
  tool: '工具',
  product: '產品',
  research: '研究',
  design: '架構設計',
} as const;

export const PROJECT_STATUS = {
  live: '已上線',
  beta: '測試中',
  development: '開發中',
  prototype: '原型',
  design: '設計階段',
  archived: '已封存',
} as const;

export const LINK_TYPES = {
  demo: '線上體驗',
  source: '原始碼',
  video: '影片',
  store: '商店',
  docs: '文件',
} as const;

export const BLOG_CATEGORIES = {
  'ai-agents': 'AI Agents',
  'game-dev': '遊戲開發',
  'creative-coding': '創意程式',
  engineering: '工程實作',
  research: '研究筆記',
  'building-in-public': '公開開發',
} as const;
