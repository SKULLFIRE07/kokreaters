/**
 * About page motion (DESIGN-SPEC v2 10.7, 00.2). P-story (not scripts/globe/*).
 * - Career journey: at ≥ 768 with motion the Sapphire line draws scrubbed with scroll (DrawSVG), each tile drops in
 *   (back.out) as the line reaches it, and the giant outlined year counts from the first year to the last. Everything
 *   is at its final state once the section's bottom passes 60% of the viewport. Ships drawn (JS off / reduced).
 * - Globe: hands over to the globe loader (initGlobe); when its canvas mounts, the section gets .has-globe so the
 *   "scroll to spin it" note shows.
 */
import type { MotionContext } from '../motion/context';

type GlobeLoader = { initGlobe?: (ctx: MotionContext) => void | (() => void) };
const globeLoader = import.meta.glob<GlobeLoader>('../globe/loader.ts');

function initJourney(ctx: MotionContext): void {
  const root = document.querySelector<HTMLElement>('[data-timeline]');
  if (!root) return;
  const { gsap, mm } = ctx;
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    if (ctx.reduced || document.documentElement.classList.contains('motion-failed')) return;
    const path = root.querySelector<SVGPathElement>('[data-timeline-path]');
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-journey-tile]'));
    const year = root.querySelector<HTMLElement>('[data-journey-year]');
    if (!path || !tiles.length) return;
    const from = Number(year?.dataset.from ?? 0), to = Number(year?.dataset.to ?? 0);
    const marks = [0.02, 0.36, 0.64, 0.96];
    const lit = tiles.map(() => false);
    gsap.set(tiles, { autoAlpha: 0, y: -70, rotation: (i) => (i % 2 ? 12 : -12), scale: 1.15 });
    const pop = (i: number, on: boolean) => {
      if (lit[i] === on) return; lit[i] = on;
      gsap.to(tiles[i], on
        ? { autoAlpha: 1, y: 0, rotation: 0, scale: 1, duration: .7, ease: 'back.out(1.7)', overwrite: true }
        : { autoAlpha: 0, y: -70, rotation: i % 2 ? 12 : -12, scale: 1.15, duration: .3, ease: 'power2.in', overwrite: true });
    };
    const tw = gsap.fromTo(path, { drawSVG: '0%' }, {
      drawSVG: '100%', ease: 'none',
      scrollTrigger: {
        trigger: root.querySelector('.journey__stage') ?? root, start: 'top 75%', end: 'bottom 60%', scrub: .6,
        onUpdate: (self) => {
          const p = self.progress;
          tiles.forEach((_, i) => { if (p >= marks[i]) pop(i, true); });   // once placed, a tile stays
          if (year && to > from) year.textContent = String(Math.round(from + (to - from) * p));
        },
        onLeave: () => { tiles.forEach((_, i) => pop(i, true)); if (year) year.textContent = String(to); },
      },
    });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); gsap.set([path, ...tiles], { clearProps: 'all' }); if (year) year.textContent = String(to); };
  });
}

function watchGlobe(): void {
  const section = document.querySelector<HTMLElement>('[data-globe-section]');
  const mount = section?.querySelector('[data-globe]');
  if (!section || !mount) return;
  const mark = () => { if (mount.querySelector('canvas')) { section.classList.add('has-globe'); return true; } return false; };
  if (mark()) return;
  const mo = new MutationObserver(() => { if (mark()) mo.disconnect(); });
  mo.observe(mount, { childList: true, subtree: true });
}

export default function about(ctx: MotionContext): void {
  initJourney(ctx);
  watchGlobe();
  const load = globeLoader['../globe/loader.ts'];
  if (load) load().then((m) => { m.initGlobe?.(ctx); }).catch(() => { /* the static SVG stays */ });
}
