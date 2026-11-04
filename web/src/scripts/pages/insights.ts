/**
 * /insights (DESIGN-SPEC 5.7, 6.7): un-hide the filters, read ?pillar=&format=, filter the rows.
 * Changes animate with GSAP Flip (dynamically imported, so it ships only here); instant when reduced.
 */
import type { MotionContext } from '../motion/context';

type Key = 'pillar' | 'format';

export default function initInsights(ctx: MotionContext): void {
  const root = document.querySelector<HTMLElement>('[data-filters]');
  const list = document.querySelector<HTMLElement>('[data-insight-list]');
  if (!root || !list) return;
  const rows = Array.from(list.querySelectorAll<HTMLElement>('.insight-row'));
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const status = root.querySelector<HTMLElement>('[data-filter-status]');
  const template = status?.dataset.template ?? '{n}';

  const valid = (key: Key, v: string | null): string =>
    v && buttons.some((b) => b.dataset.filter === key && b.dataset.value === v) ? v : '';

  const params = new URLSearchParams(window.location.search);
  const state: Record<Key, string> = { pillar: valid('pillar', params.get('pillar')), format: valid('format', params.get('format')) };

  let flip: typeof import('gsap/Flip').Flip | null = null;
  if (!ctx.reduced) {
    import('gsap/Flip').then((m) => { ctx.gsap.registerPlugin(m.Flip); flip = m.Flip; }).catch(() => { flip = null; });
  }

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

  function apply(animate: boolean): void {
    const match = (r: HTMLElement) =>
      (!state.pillar || r.dataset.pillar === state.pillar) && (!state.format || r.dataset.format === state.format);
    const changes = rows.some((r) => r.hidden === match(r));
    const run = () => {
      let n = 0;
      rows.forEach((r) => { const ok = match(r); r.hidden = !ok; if (ok) n += 1; });
      if (status) status.textContent = template.replace('{n}', String(n));
    };
    if (animate && changes && flip && !ctx.reduced) {
      const { gsap } = ctx;
      const st = flip.getState(rows);
      run();
      flip.from(st, {
        duration: 0.4, ease: 'power2.inOut', absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.2 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.15 }),
        onComplete: () => ctx.ScrollTrigger.refresh(),
      });
    } else {
      run();
      if (changes) ctx.ScrollTrigger.refresh();
    }
  }

  root.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[data-filter]');
    if (!b) return;
    const key = b.dataset.filter as Key;
    const v = b.dataset.value ?? '';
    if (state[key] === v) return;
    state[key] = v;
    syncButtons();
    syncUrl();
    apply(true);
  });

  root.hidden = false;
  syncButtons();
  apply(false);
}
