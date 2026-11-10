/**
 * /insights filters (REDESIGN-V3 §4; contract: research/v3/inventory-insights.md A6). Loaded by pages/insights/index.astro.
 * - Un-hides [data-filters] (server-rendered `hidden`, so without JS the unfiltered library shows and no dead controls
 *   appear).
 * - Reads ?pillar= and ?format= (unknown values fall back to "All"), keeps them in the URL with history.replaceState
 *   (the hash is kept), AND-filters the .insight-row items in [data-insight-list] by data-pillar / data-format.
 * - The featured row ([data-featured], shown in its own band above) stays hidden while both rows are on "All" and
 *   joins the results only when a filter is chosen.
 * - While a filter is chosen, writes "{n} insight(s)" into [data-filter-status] (aria-live; empty on "All", where the
 *   featured band and the grid together show everything) and shows [data-filter-empty] when nothing matches;
 *   its [data-filter-reset] button returns both rows to "All" and moves focus to the first filter.
 * - One highlight per row glides to the pressed button (transform/width/height, --d-2; instant under reduced motion
 *   because the duration tokens are 0 there). Filtering itself is instant: no layout animation.
 */
type Key = 'pillar' | 'format';

function initFilters(): void {
  const root = document.querySelector<HTMLElement>('[data-filters]');
  const list = document.querySelector<HTMLElement>('[data-insight-list]');
  if (!root || !list) return;
  const rows = Array.from(list.querySelectorAll<HTMLElement>('.insight-row'));
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const tracks = Array.from(root.querySelectorAll<HTMLElement>('[data-filter-track]'));
  const status = root.querySelector<HTMLElement>('[data-filter-status]');
  const empty = document.querySelector<HTMLElement>('[data-filter-empty]');
  const many = status?.dataset.template ?? '{n}';
  const one = status?.dataset.templateOne ?? many;

  const valid = (key: Key, v: string | null): string =>
    v && buttons.some((b) => b.dataset.filter === key && b.dataset.value === v) ? v : '';

  const params = new URLSearchParams(window.location.search);
  const state: Record<Key, string> = { pillar: valid('pillar', params.get('pillar')), format: valid('format', params.get('format')) };

  function syncButtons(): void {
    buttons.forEach((b) => {
      const key = b.dataset.filter as Key;
      b.setAttribute('aria-pressed', String((b.dataset.value ?? '') === state[key]));
    });
  }

  function syncUrl(): void {
    const url = new URL(window.location.href);
    (['pillar', 'format'] as Key[]).forEach((k) => {
      if (state[k]) url.searchParams.set(k, state[k]); else url.searchParams.delete(k);
    });
    history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function apply(): void {
    const filtered = Boolean(state.pillar || state.format);
    let n = 0;
    rows.forEach((r) => {
      const ok = (!state.pillar || r.dataset.pillar === state.pillar) && (!state.format || r.dataset.format === state.format);
      r.hidden = !ok || (!filtered && r.dataset.featured !== undefined);
      if (ok) n += 1;
    });
    // The count answers a filter: with both rows on "All" the featured insight sits in its own band above, so a total
    // under the filters would not match the cards below it. The line (and its hairline) stays; the text appears on use.
    if (status) status.textContent = filtered ? (n === 1 ? one : many).replace('{n}', String(n)) : '';
    if (empty) empty.hidden = n > 0;
  }

  /* sliding highlight: one per row, placed on that row's pressed button */
  function placeGlides(animate: boolean): void {
    tracks.forEach((t) => {
      const glide = t.querySelector<HTMLElement>('[data-filter-glide]');
      const on = t.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!glide || !on || !on.getClientRects().length) return;
      glide.classList.toggle('is-still', !animate || glide.style.opacity !== '1');
      glide.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`;
      glide.style.width = `${on.offsetWidth}px`;
      glide.style.height = `${on.offsetHeight}px`;
      glide.style.opacity = '1';
      t.classList.add('has-glide');
    });
  }

  function set(key: Key, v: string): void {
    if (state[key] === v) return;
    state[key] = v;
    syncButtons();
    syncUrl();
    apply();
    placeGlides(true);
  }

  root.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[data-filter]');
    if (b) set(b.dataset.filter as Key, b.dataset.value ?? '');
  });

  empty?.querySelector<HTMLButtonElement>('[data-filter-reset]')?.addEventListener('click', () => {
    state.pillar = ''; state.format = '';
    syncButtons(); syncUrl(); apply(); placeGlides(true);
    root.querySelector<HTMLButtonElement>('[data-filter]')?.focus();
  });

  root.hidden = false;
  syncButtons();
  syncUrl();   // drops a ?pillar= / ?format= value that has no button (it fell back to "All")
  apply();
  placeGlides(false);
  let raf = 0;
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => placeGlides(false)); }, { passive: true });
  document.fonts?.ready.then(() => placeGlides(false)).catch(() => {});
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initFilters, { once: true });
else initFilters();
