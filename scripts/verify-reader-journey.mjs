import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(join('dist', path), 'utf8');
const home = read('index.html');
for (const label of ['看常山龍膽的設計取捨', '看 Codex Jev 的協作邊界', '看 AERIS 怎麼區分證據']) {
  assert(home.includes(label), `Missing specific homepage invitation: ${label}`);
}
const expected = {
  'changshan-longdan': ['jev-ai', 'mmo-asset-pipeline'],
  'codex-jev-integration': ['jev-systemone-lab'],
  'ai-flight-recorder': ['codex-jev-integration'],
};
for (const [slug, next] of Object.entries(expected)) {
  const html = read(`projects/${slug}/index.html`);
  assert(html.includes('id="reader-guide-title"'), `Missing reader guide: ${slug}`);
  assert(html.indexOf('id="reader-guide-title"') < html.indexOf('class="prose"'), 'Guide must precede long case study');
  assert(html.includes('案例資料更新：'), `Missing evidence date context: ${slug}`);
  const onward = html.slice(html.indexOf('class="next-reading"'));
  for (const id of next) assert(onward.includes(`href="/projects/${id}/"`), `Missing next read: ${slug} → ${id}`);
}
let checked = 0;
for (const entry of readdirSync('dist/projects', { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const path = `projects/${entry.name}/index.html`;
  if (!existsSync(join('dist', path))) continue;
  const html = read(path);
  assert(html.includes('id="next-reading-title"'), `Dead-end case: ${entry.name}`);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, href] of html.matchAll(/href="(#[^"]+)"/g)) {
    assert(ids.has(decodeURIComponent(href.slice(1))), `Broken section link: ${path} ${href}`);
  }
  for (const [, slug] of html.matchAll(/href="\/projects\/([^/"?#]+)\/"/g)) {
    assert(existsSync(join('dist/projects', decodeURIComponent(slug), 'index.html')), `Broken project link: ${path} → ${slug}`);
  }
  checked++;
}
assert(checked > 0);
console.log(`PASS: 3 factual guides, specific homepage invitations, related journeys, and local project/section links across ${checked} cases.`);
