import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { songs } from '../src/data/songs.ts';
const home = readFileSync('dist/index.html', 'utf8');
const music = readFileSync('dist/music/index.html', 'utf8');
const sorted = [...songs].sort((a, b) => b.date.localeCompare(a.date));
assert(home.includes('聽我的音樂'));
assert(home.includes('href="/music/"'));
if (sorted.length) assert(home.includes(sorted[0].title));
assert(!/<iframe\b/.test(home), 'No homepage embed');
assert(!/<iframe\b/.test(music), 'Music player must be click-loaded');
const nojs = music.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? '';
assert(nojs.includes('nojs-songs-title'));
for (const song of songs) {
  assert(nojs.includes(song.title), `Missing no-JS title: ${song.id}`);
  assert(nojs.includes(`https://youtu.be/${song.id}`), `Missing no-JS direct link: ${song.id}`);
}
assert(music.includes('tabindex="-1"'), 'Playback region can receive programmatic focus');
let checked = 0;
function visit(dir) {
  for (const file of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, file.name);
    if (file.isDirectory()) visit(path);
    else if (path.endsWith('.html')) {
      const html = readFileSync(path, 'utf8');
      for (const [, href] of html.matchAll(/href="(\/[^"?#]*)/g)) {
        if (href.startsWith('//')) continue;
        const target = join('dist', decodeURIComponent(href));
        assert(existsSync(target) || existsSync(join(target, 'index.html')), `Missing internal target: ${path} → ${href}`);
        checked++;
      }
    }
  }
}
visit('dist');
console.log(`PASS: homepage music CTA, latest date-sorted song, ${songs.length} no-JS direct links, no initial embed, focusable playback region, ${checked} internal link targets.`);
