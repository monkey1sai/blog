// 由 public/og-default.svg 產生 public/og-default.png（1200×630）。
// 多數社群平台不支援 SVG 作為 og:image，所以另外輸出 PNG。
// 用法：node scripts/build-og.mjs（需要系統有 Noto Sans CJK TC 字型才能正確畫出中文）
import sharp from 'sharp';
await sharp('public/og-default.svg', { density: 144 })
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile('public/og-default.png');
console.log('wrote public/og-default.png');
