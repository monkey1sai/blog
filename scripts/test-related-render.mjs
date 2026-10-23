import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

// Isolated build: synthetic posts never touch the real collections or output.
const dir = mkdtempSync(join(tmpdir(), 'blog-related-render-'));
try {
  for (const path of ['src', 'public', 'astro.config.mjs', 'package.json', 'tsconfig.json']) cpSync(path, join(dir, path), { recursive: true });
  symlinkSync(realpathSync('node_modules'), join(dir, 'node_modules'), 'dir');
  const fixture = (title, tags) => `---\ntitle: ${title}\ndescription: Test-only fixture\npublishedAt: 2026-10-23\ncategory: building-in-public\ntags: [${tags}]\nrelatedProjects: [changshan-longdan]\ndraft: false\n---\n\nSynthetic test content.\n`;
  writeFileSync(join(dir, 'src/content/blog/test-match.md'), fixture('Test match', 'browser-game, threejs'));
  writeFileSync(join(dir, 'src/content/blog/test-peer.md'), fixture('Test peer', 'browser-game'));
  writeFileSync(join(dir, 'src/content/blog/test-peer-two.md'), fixture('Test peer two', 'browser-game'));
  writeFileSync(join(dir, 'src/content/blog/test-peer-three.md'), fixture('Test peer three', 'browser-game'));
  writeFileSync(join(dir, 'src/content/blog/test-single.md'), fixture('Test single', 'voxel'));
  writeFileSync(join(dir, 'src/content/blog/test-empty.md'), fixture('Test empty', 'test-no-overlap-unique'));
  execFileSync(process.execPath, [realpathSync('node_modules/.bin/astro'), 'build'], { cwd: dir, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', XDG_CONFIG_HOME: join(dir, '.config') }, stdio: 'pipe' });
  const match = readFileSync(join(dir, 'dist/blog/test-match/index.html'), 'utf8');
  const aside = match.match(/<aside[^>]*>[\s\S]*?延伸閱讀[\s\S]*?<\/aside>/)?.[0];
  assert(aside, 'Tag matches must render ending');
  assert(aside.includes('/projects/changshan-longdan/'), 'Real project with actual matching tag');
  assert(aside.includes('/blog/test-peer/'), 'Actual post candidate with matching tag');
  assert(!aside.includes('/blog/test-match/'), 'No self');
  assert(!aside.includes('/blog/test-empty/'), 'No nonmatching post');
  assert.equal((aside.match(/<li>/g) ?? []).length, 3, 'Cap four matching candidates at three');
  const links = [...aside.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(links).size, links.length, 'No duplicate rendered links');
  for (const href of links) assert(existsSync(join(dir, 'dist', href, 'index.html')), `Missing target: ${href}`);
  const single = readFileSync(join(dir, 'dist/blog/test-single/index.html'), 'utf8').match(/<aside[^>]*>[\s\S]*?延伸閱讀[\s\S]*?<\/aside>/)?.[0];
  assert(single?.includes('/projects/changshan-longdan/'));
  assert.equal((single.match(/<li>/g) ?? []).length, 1);
  const empty = readFileSync(join(dir, 'dist/blog/test-empty/index.html'), 'utf8');
  assert(!empty.includes('延伸閱讀'), 'Zero tag overlap omits section despite explicit relatedProjects mapping');
  console.log('PASS: isolated Astro rendered matching project/post links and omitted empty-tag-match ending; production content unchanged.');
} finally {
  rmSync(dir, { recursive: true, force: true });
}
