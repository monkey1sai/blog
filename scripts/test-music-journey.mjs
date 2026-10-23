import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { relatedByTags } from '../src/lib/related.ts';
import { initMusic } from '../src/scripts/music.ts';

// Synthetic fixtures are test-only, never written to content collections or songs.ts.
const item = (id, tags, kind = 'projects') => ({ id, tags, kind, title: id });
const current = item('current', ['ai', 'music'], 'blog');
const matches = relatedByTags(current, [current, item('a', ['ai']), item('a', ['ai']), item('b', ['music', 'ai']), item('c', ['music']), item('d', ['music']), item('none', ['other'])]);
assert.equal(matches.length, 3);
assert.equal(matches[0].id, 'b');
assert.equal(new Set(matches.map((x) => `${x.kind}/${x.id}`)).size, 3);
assert(!matches.some((x) => x.id === 'current' || x.id === 'none'));
assert.deepEqual(relatedByTags(item('empty', [], 'blog'), [item('a', ['ai'])]), []);
assert.deepEqual(relatedByTags(current, [item('same-category-not-tag', ['other'])]), []);
// Actual content: the existing draft's explicit project mapping must not invent overlap.
const actual = ['projects', 'blog'].flatMap((kind) => readdirSync(`src/content/${kind}`).filter((f) => f.endsWith('.md')).map((file) => {
  const source = readFileSync(`src/content/${kind}/${file}`, 'utf8');
  return item(file.slice(0, -3), (source.match(/^tags: \[([^\]]*)\]/m)?.[1] ?? '').split(',').map((x) => x.trim()).filter(Boolean), kind);
}));
for (const source of actual) {
  for (const result of relatedByTags(source, actual)) {
    assert(result.tags.some((tag) => source.tags.includes(tag)));
    assert.notEqual(`${source.kind}/${source.id}`, `${result.kind}/${result.id}`);
  }
}
const draft = actual.find((x) => x.id === 'hello-ai-craft-lab');
assert(draft);
assert.deepEqual(relatedByTags(draft, actual.filter((x) => x.kind === 'projects')), []);

// Minimal DOM contract exercises the actual browser module, not a copied filter algorithm.
class Element {
  constructor(id = '', root = null) { this.id = id; this.root = root; this.dataset = {}; this.attrs = {}; this.events = {}; this.children = []; this.hidden = false; this.textContent = ''; this.value = ''; const values = new Set(); this.classList = { add: (x) => values.add(x), remove: (x) => values.delete(x), contains: (x) => values.has(x), toggle: (x, on) => on ? values.add(x) : values.delete(x) }; }
  addEventListener(name, callback) { this.events[name] = callback; }
  fire(name) { this.events[name]?.({ currentTarget: this }); }
  querySelector() { return this.button; }
  setAttribute(name, value) { this.attrs[name] = value; }
  replaceChildren(...children) { this.children = children; }
  focus() { this.root.activeElement = this; }
  scrollIntoView(options) { this.scroll = options; }
}
function fixture(count) {
  const root = { activeElement: null, defaultView: { matchMedia: () => ({ matches: true }) } };
  const ids = Object.fromEntries(['featured', 'f-video', 'f-play', 'f-title', 'f-meta', 'f-intro', 'f-label', 'f-link', 'more', 'empty', 'q'].map((id) => [id, new Element(id, root)]));
  const rows = Array.from({ length: count }, (_, i) => { const row = new Element(`row-${i}`, root); row.button = new Element('', root); row.dataset = { id: `fixture-${i}`, title: `Song ${i}`, meta: '2026-10-23', intro: `Intro ${i}`, tags: i % 2 ? 'odd|shared' : 'even|shared', text: `song ${i} intro ${i} ${i % 2 ? 'odd' : 'even'} shared` }; return row; });
  const chips = ['', 'even', 'odd'].map((tag) => { const chip = new Element('', root); chip.dataset.tag = tag; return chip; });
  root.getElementById = (id) => ids[id] ?? null;
  root.querySelectorAll = (selector) => selector === '#list .row' ? rows : chips;
  root.createElement = () => new Element('', root);
  if (count) { ids['f-video'].dataset.id = 'fixture-0'; ids['f-title'].textContent = 'Song 0'; }
  else { delete ids.featured; delete ids['f-video']; delete ids['f-play']; }
  initMusic(root);
  return { root, ids, rows, chips, visible: () => rows.filter((r) => !r.classList.contains('hidden')) };
}
for (const count of [0, 1, 4, 12, 13, 25]) {
  const f = fixture(count);
  assert.equal(f.visible().length, Math.min(count, 12));
  assert.equal(f.ids.more.hidden, count <= 12);
  assert.equal(f.ids.empty.hidden, count > 0);
  if (count > 12) {
    f.ids.more.fire('click');
    assert.equal(f.visible().length, Math.min(count, 24));
    assert.equal(f.root.activeElement, f.rows[12].button);
    assert.equal(f.ids.more.hidden, count <= 24);
  }
}
const f = fixture(25);
f.chips[1].fire('click'); assert.equal(f.visible().length, 12); assert.equal(f.chips[1].attrs['aria-pressed'], 'true');
f.ids.more.fire('click'); assert.equal(f.visible().length, 13); assert.equal(f.ids.more.hidden, true);
f.ids.q.value = ' SONG 24 '; f.ids.q.fire('input'); assert.equal(f.visible().length, 1);
f.chips[2].fire('click'); assert.equal(f.visible().length, 0); assert.equal(f.ids.empty.hidden, false);
f.ids.q.value = ''; f.ids.q.fire('input'); assert.equal(f.visible().length, 12);
f.chips[0].fire('click'); assert.equal(f.visible().length, 12); assert.equal(f.ids.more.hidden, false);
assert.equal(f.ids['f-video'].children.length, 0, 'No player before click');
f.rows[3].button.fire('click'); assert.equal(f.ids['f-video'].children.length, 1); assert.equal(f.root.activeElement, f.ids.featured); assert.equal(f.ids.featured.scroll.behavior, 'auto');
assert.equal(f.ids['f-title'].textContent, 'Song 3'); assert.equal(f.ids['f-link'].href, 'https://youtu.be/fixture-3');
f.rows[4].button.fire('click'); assert.equal(f.ids['f-video'].children.length, 1, 'Replacement must not create another player'); assert(f.ids['f-video'].children[0].src.includes('fixture-4'));
console.log('PASS: actual-tag recommendations; self/duplicate/empty exclusions; music 0/1/4/12/13/25 boundaries, combined search/tags/reset, more focus, single click-loaded player and selection focus.');
