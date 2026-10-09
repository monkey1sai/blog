import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const home = readFileSync('dist/index.html', 'utf8');
const cardIds = [...home.matchAll(/data-project[^>]*>[\s\S]*?<h3[^>]*>\s*<a href="\/projects\/([^/]+)\//g)].map((m) => m[1]);
assert.deepEqual(cardIds, ['changshan-longdan', 'codex-jev-integration', 'ai-flight-recorder']);
assert(!home.includes('id="posts-title"'), 'No published posts: hide homepage article area');
assert(!home.includes('href="/blog/"'), 'No published posts: hide article navigation');
assert(!home.includes('待竣傑確認'));
let pages = 0;
function visit(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) visit(path);
    else if (item.name.endsWith('.html')) {
      const html = readFileSync(path, 'utf8'); pages++;
      for (const match of html.matchAll(/<img[^>]+src="(\/[^"?#]+)"/g)) assert(existsSync(join('dist', match[1])), `Missing image ${match[1]} in ${path}`);
      assert(!/<(?:video|iframe)\b/.test(html), `Unexpected embedded video: ${path}`);
      assert(!html.includes('待竣傑確認'), `Placeholder in ${path}`);
    }
  }
}
visit('dist');
const projects = readFileSync('dist/projects/index.html', 'utf8');
assert(projects.includes('data-filter="category"') && projects.includes('data-filter="status"'));
assert.equal((projects.match(/data-project(?:\s|>)/g) || []).length, 15);
console.log(`PASS: 3 featured projects; empty articles hidden; 15 projects; media and placeholders checked across ${pages} pages.`);
