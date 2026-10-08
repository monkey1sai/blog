import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Post = CollectionEntry<'blog'>;

/** 正式 build 一律排除 draft；開發模式（npm run dev）保留草稿方便預覽。 */
const visible = (draft: boolean) => import.meta.env.DEV || !draft;

const LAST = Number.MAX_SAFE_INTEGER;
const byTitle = (a: Project, b: Project) => a.data.title.localeCompare(b.data.title, 'zh-Hant');

/** 作品集順序：先看 order，再看 featuredOrder，最後依標題。 */
export async function getProjects(): Promise<Project[]> {
  const items = await getCollection('projects', ({ data }) => visible(data.draft));
  return items.sort((a, b) => {
    const oa = a.data.order ?? LAST;
    const ob = b.data.order ?? LAST;
    if (oa !== ob) return oa - ob;
    const fa = a.data.featuredOrder ?? LAST;
    const fb = b.data.featuredOrder ?? LAST;
    if (fa !== fb) return fa - fb;
    return byTitle(a, b);
  });
}

/** 首頁精選：只看 featuredOrder。 */
export async function getFeaturedProjects(limit = 9): Promise<Project[]> {
  return (await getProjects())
    .filter((p) => p.data.featured)
    .sort((a, b) => (a.data.featuredOrder ?? LAST) - (b.data.featuredOrder ?? LAST) || byTitle(a, b))
    .slice(0, limit);
}

export async function getPosts(): Promise<Post[]> {
  const items = await getCollection('blog', ({ data }) => visible(data.draft));
  return items.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Taipei',
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
