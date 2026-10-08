// 把原始封面圖（PNG/JPG）轉成網站用的 WebP。
// 用法：COVERS_SRC=/workspace/blog-assets node scripts/optimize-covers.mjs
//   - 卡片封面：public/covers/<slug>.webp（1280×720，16:9）
//   - 內頁大圖：public/images/projects/<name>.webp（保留原比例，寬度上限 1600）
// 來源檔不存在就跳過；頁面會自動改用預設漸層圖，build 不會失敗。
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = process.env.COVERS_SRC ?? '/workspace/blog-assets';

/** 卡片封面：slug → 來源檔名與裁切位置 */
const COVERS = {
  'changshan-longdan': { src: 'changshan-longdan-itch-battle.png' }, // itch.io 商店頁的真實遊戲截圖
  // 直式戰報圖：只取上方的標題與主視覺（16:9），完整資訊圖放內頁
  'codex-jev-integration': { src: 'codex-jev-integration.png', extract: { left: 143, top: 0, width: 836, height: 470 } },
  'ai-flight-recorder': { src: 'ai-flight-recorder.png' },
  'adk-agents': { src: 'adk-agents.png' },
  'jev-systemone-lab': { src: 'jev-systemone-lab.png' },
  'agentic-agent': { src: 'agentic-agent.png' },
  'dotnet-llm-regression-reporting': { src: 'dotnet-llm-regression-reporting.png' },
};

/** 內頁圖片：輸出檔名 → 來源檔名 */
const IMAGES = {
  'codex-jev-integration-infographic': 'codex-jev-integration.png',
  'changshan-longdan-dragon': 'changshan-longdan-itch-dragon.png',
  'changshan-longdan-title': 'changshan-longdan-itch-title.png',
};

mkdirSync('public/covers', { recursive: true });
mkdirSync('public/images/projects', { recursive: true });

for (const [slug, { src, position = 'centre', extract }] of Object.entries(COVERS)) {
  const from = join(SRC, src);
  if (!existsSync(from)) { console.log(`skip cover ${slug}（找不到 ${from}）`); continue; }
  const out = `public/covers/${slug}.webp`;
  let img = sharp(from);
  if (extract) img = img.extract(extract);
  await img.resize(1280, 720, { fit: 'cover', position }).webp({ quality: 80 }).toFile(out);
  console.log(`cover ${out}`);
}

for (const [name, src] of Object.entries(IMAGES)) {
  const from = join(SRC, src);
  if (!existsSync(from)) { console.log(`skip image ${name}（找不到 ${from}）`); continue; }
  const out = `public/images/projects/${name}.webp`;
  await sharp(from).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 84 }).toFile(out);
  console.log(`image ${out}`);
}
