import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * 封面路徑指向 public/ 底下的檔案。檔案還沒放進來時回傳 undefined，
 * 讓頁面改用預設圖樣，build 不會因為缺圖而失敗。
 */
export function resolveCover(cover?: string): string | undefined {
  if (!cover) return undefined;
  if (/^https?:\/\//.test(cover)) return cover;
  return existsSync(join(process.cwd(), 'public', cover)) ? cover : undefined;
}
