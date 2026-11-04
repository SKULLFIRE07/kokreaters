/**
 * /insights (DESIGN-SPEC 5.7, 6.7): un-hide the filters, read ?pillar=&format=, filter the rows.
 * Changes animate with GSAP Flip (dynamically imported, so it ships only here); instant when reduced.
 */
import type { MotionContext } from '../motion/context';

type Key = 'pillar' | 'format';

export default function initInsights(ctx: MotionContext): void {
  initFan(ctx);
  initPlane(ctx);
  initFilters(ctx);
}

/** F2: the card fan (bencho port), a lazy chunk loaded near the viewport. */
function initFan(ctx: MotionContext): void {
  const fan = document.querySelector<HTMLElement>('[data-card-fan]');
  if (fan) ctx.whenNear(fan, async () => { (await import('../bencho/card-fan')).default(fan, ctx); });
}

/** F6: the paper plane's dashed flight path draws on, then the plane lands with a little wobble. */
function initPlane(ctx: MotionContext): void {
  const svg = document.querySelector<SVGSVGElement>('[data-plane]');
  if (!svg || ctx.reduced) return;
  const { gsap } = ctx;
  const trail = svg.querySelector<SVGPathElement>('[data-plane-trail]');
  const craft = svg.querySelector<SVGGElement>('[data-plane-craft]');
  if (!trail || !craft) return;
  const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
  const id = `plane-m-${Math.random().toString(36).slice(2, 7)}`;
  mask.id = id;
  const m = trail.cloneNode() as SVGPathElement;
  m.removeAttribute('class'); m.removeAttribute('data-plane-trail');
  m.setAttribute('stroke', '#fff'); m.setAttribute('stroke-width', '8'); m.setAttribute('fill', 'none');
  m.style.strokeDasharray = '1'; m.style.strokeDashoffset = '1';
  mask.appendChild(m);
  svg.prepend(mask);
  trail.setAttribute('mask', `url(#${id})`);
  gsap.set(craft, { opacity: 0, x: -40, y: 30, rotation: -12, transformOrigin: '60% 50%' });
  const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 80%', once: true } });
  tl.to(m, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' })
    .to(craft, { opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.8, ease: 'back.out(2)' }, '-=0.35');
  if (ctx.fine) {
    svg.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(craft, { x: dx * 24, y: dy * 18, rotation: dx * 8, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
    });
    svg.addEventListener('pointerleave', () => gsap.to(craft, { x: 0, y: 0, rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' }));
  }
}

function initFilters(ctx: MotionContext): void {
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
