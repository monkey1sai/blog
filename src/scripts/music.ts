/** One click-loaded player, shared search/tag pagination, keyboard focus handoff. */
export const MUSIC_PAGE_SIZE = 12;

export function initMusic(root: Document) {
  const get = <T extends HTMLElement>(id: string) => root.getElementById(id) as T | null;
  const rows = [...root.querySelectorAll<HTMLElement>('#list .row')];
  const chips = [...root.querySelectorAll<HTMLButtonElement>('.controls [data-tag]')];
  const featured = get('featured');
  const video = get('f-video');
  const more = get<HTMLButtonElement>('more');
  const empty = get('empty');
  let limit = MUSIC_PAGE_SIZE, tag = '', query = '';
  function embed(id: string, title: string) {
    if (!video) return;
    const frame = root.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1`;
    frame.title = `播放 ${title}`;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture';
    frame.allowFullscreen = true;
    video.replaceChildren(frame);
  }
  function focusPlayer() {
    featured?.focus({ preventScroll: true });
    featured?.scrollIntoView({ behavior: root.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }
  get('f-play')?.addEventListener('click', () => {
    embed(video?.dataset.id ?? '', get('f-title')?.textContent ?? '');
    focusPlayer();
  });
  function render() {
    const matched = rows.filter((row) => (!tag || row.dataset.tags?.split('|').includes(tag)) && (!query || row.dataset.text?.includes(query)));
    rows.forEach((row) => row.classList.add('hidden'));
    matched.slice(0, limit).forEach((row) => row.classList.remove('hidden'));
    if (more) more.hidden = matched.length <= limit;
    if (empty) empty.hidden = matched.length > 0;
  }
  rows.forEach((row) => row.querySelector('button')?.addEventListener('click', () => {
    const data = row.dataset;
    if (!video || !data.id) return;
    video.dataset.id = data.id;
    for (const [id, value] of [['f-title', data.title], ['f-meta', data.meta], ['f-intro', data.intro], ['f-label', '正在播放']]) {
      const el = get(id!); if (el) el.textContent = value ?? '';
    }
    const link = get<HTMLAnchorElement>('f-link');
    if (link) link.href = `https://youtu.be/${encodeURIComponent(data.id)}`;
    rows.forEach((item) => item.classList.toggle('active', item === row));
    embed(data.id, data.title ?? '');
    focusPlayer();
  }));
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((item) => { item.classList.toggle('on', item === chip); item.setAttribute('aria-pressed', String(item === chip)); });
    tag = chip.dataset.tag ?? ''; limit = MUSIC_PAGE_SIZE; render();
  }));
  get<HTMLInputElement>('q')?.addEventListener('input', (event) => {
    query = (event.currentTarget as HTMLInputElement).value.trim().toLowerCase(); limit = MUSIC_PAGE_SIZE; render();
  });
  more?.addEventListener('click', () => {
    const previous = new Set(rows.filter((row) => !row.classList.contains('hidden')));
    limit += MUSIC_PAGE_SIZE; render();
    rows.find((row) => !row.classList.contains('hidden') && !previous.has(row))?.querySelector<HTMLButtonElement>('button')?.focus();
  });
  render();
}
