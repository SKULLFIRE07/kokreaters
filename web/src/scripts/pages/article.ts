/**
 * /insights/[slug] (DESIGN-SPEC 5.8, 6.7): progress rule, route rail, minutes-left running head.
 * Default: the progress bar and the rail's Sapphire segment are scrubbed to article progress.
 * Reduced motion (or motion failed): no scrub; the running head shows "{n} min left", updated per rAF.
 */
import type { MotionContext } from '../motion/context';

export default function initArticle(ctx: MotionContext): void {
  const body = document.querySelector<HTMLElement>('[data-article-body]');
  const article = document.querySelector<HTMLElement>('[data-article]');
  if (!body || !article) return;
  const { gsap, ScrollTrigger } = ctx;
  const headerH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;

  /* ── Route rail: active station ── */
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  const links = rail ? Array.from(rail.querySelectorAll<HTMLAnchorElement>('[data-rail-link]')) : [];
  const heads = links
    .map((a) => document.getElementById(a.dataset.railLink ?? ''))
    .filter((h): h is HTMLElement => !!h);
  const segment = rail?.querySelector<HTMLElement>('[data-rail-progress]') ?? null;

  let active = -1;
  const setActive = (i: number) => {
    if (i === active) return;
    active = i;
    links.forEach((a, j) => { if (j === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    if (ctx.reduced && segment && links.length > 1) {
      // static segment up to the current station
      segment.style.transform = `scaleY(${Math.max(0, i) / (links.length - 1)})`;
    }
  };
  const pickActive = () => {
    if (!heads.length) return;
    const line = headerH() + window.innerHeight * 0.25;
    let i = -1;
    heads.forEach((h, j) => { if (h.getBoundingClientRect().top <= line) i = j; });
    setActive(Math.max(0, i));
  };
  if (heads.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(() => pickActive(), { rootMargin: `-${headerH()}px 0px -60% 0px`, threshold: [0, 1] });
    heads.forEach((h) => io.observe(h));
  }

  /* ── Reading progress: 0 at the top of the body, 1 at its end ── */
  const progress = (): number => {
    const r = body.getBoundingClientRect();
    const start = headerH();
    const total = r.height - (window.innerHeight - start);
    if (total <= 0) return r.top < start ? 1 : 0;
    return Math.min(1, Math.max(0, (start - r.top) / total));
  };

  const timeEl = document.querySelector<HTMLElement>('[data-running-time]');
  const minutes = Number(article.dataset.minutes ?? 0);
  const leftTpl = timeEl?.dataset.labelLeft ?? '{n} min left';
  const readTpl = timeEl?.textContent ?? '';

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      pickActive();
      if (ctx.reduced && timeEl && minutes > 0) {
        const p = progress();
        const left = Math.ceil(minutes * (1 - p));
        timeEl.textContent = p <= 0 ? readTpl : leftTpl.replace('{n}', String(Math.max(0, left)));
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (ctx.reduced) {
    document.querySelectorAll<HTMLElement>('.progress-rule').forEach((el) => { el.hidden = true; });
    return;
  }

  ctx.mm.add('(prefers-reduced-motion: no-preference)', () => {
    const scrub = { trigger: body, start: 'top top+=72', end: 'bottom bottom', scrub: true } as const;
    gsap.fromTo('[data-progress]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: scrub });
    if (segment) gsap.fromTo(segment, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { ...scrub } });
    ScrollTrigger.refresh();
  });
}
