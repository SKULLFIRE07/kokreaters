/**
 * About page motion (DESIGN-SPEC 6.9, 6.8 gate hand-off). W2-about.
 * - Timeline: the 1px Sapphire line draws over 1200 ms (power2.inOut) once on enter, and each ring's
 *   inner dot fills as the drawn line reaches its position (0, 1/3, 2/3, 1). Ships drawn and filled,
 *   so no-JS, reduced motion and the failure timer all see the final state.
 * - Globe: hands over to W3-globe's loader (`initGlobe(ctx)`), which applies its own gate. The glob
 *   import keeps the build green while the loader does not exist yet, and keeps three.js lazy.
 */
import type { MotionContext } from '../motion/context';
import { D, E, START } from '../motion/tokens';

type GlobeLoader = { initGlobe?: (ctx: MotionContext) => void | (() => void) };
const globeLoader = import.meta.glob<GlobeLoader>('../globe/loader.ts');

function visible(el: Element): boolean {
  return (el as HTMLElement | SVGElement).getBoundingClientRect().width > 0 || getComputedStyle(el).display !== 'none';
}

function initTimeline(ctx: MotionContext): void {
  const root = document.querySelector<HTMLElement>('[data-timeline]');
  if (!root) return;
  const { gsap, mm } = ctx;
  mm.add({ h: '(min-width: 768px)', v: '(max-width: 767px)', motion: '(prefers-reduced-motion: no-preference)' }, (c) => {
    const { motion } = c.conditions as { h: boolean; v: boolean; motion: boolean };
    if (!motion || ctx.reduced || document.documentElement.classList.contains('motion-failed')) return;
    const paths = Array.from(root.querySelectorAll<SVGPathElement>('[data-timeline-path]'));
    const path = paths.find((p) => { const svg = p.ownerSVGElement; return !!svg && getComputedStyle(svg).display !== 'none' && visible(svg); });
    const dots = Array.from(root.querySelectorAll<SVGCircleElement>('.timeline__item [data-ring]'));
    if (!path || !dots.length) return;
    const n = dots.length;
    const lit = new Array<boolean>(n).fill(false);
    const fill = (i: number) => {
      if (lit[i]) return;
      lit[i] = true;
      gsap.to(dots[i], { scale: 1, opacity: 1, duration: D.uiIn + .04, ease: E.uiIn, overwrite: true });
    };
    gsap.set(dots, { scale: 0, opacity: 0, transformOrigin: '50% 50%' });
    const tween = gsap.fromTo(path, { drawSVG: '0%' }, {
      drawSVG: '100%', duration: D.connector, ease: E.draw,
      scrollTrigger: { trigger: root, start: START, once: true },
      onStart: () => fill(0),
      onUpdate() {
        const p = this.ratio as number;          // eased progress = how far the line has drawn
        for (let i = 0; i < n; i++) if (p >= (n === 1 ? 0 : i / (n - 1)) - 0.001) fill(i);
      },
      onComplete: () => { for (let i = 0; i < n; i++) fill(i); },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(path, { clearProps: 'all' });
      gsap.set(dots, { clearProps: 'all' });
    };
  });
}

export default function about(ctx: MotionContext): void {
  initTimeline(ctx);
  const load = globeLoader['../globe/loader.ts'];
  if (load) load().then((m) => { m.initGlobe?.(ctx); }).catch(() => { /* the static SVG stays */ });
}
