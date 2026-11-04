/**
 * /approach motion (DESIGN-SPEC 5.5, 6.5). The method line is scrubbed with W2-home's
 * `initMethodLine(root, ctx)` from ./home.ts. The import goes through import.meta.glob so the
 * build never fails while that export is missing; a local equivalent runs in that case.
 * Everything else on the page is the shared reveal grammar (motion/index.ts).
 */
import type { MotionContext } from '../motion/context';

type MethodLineInit = (root: Element, ctx: MotionContext) => void | (() => void);
const homeModule = import.meta.glob<{ initMethodLine?: MethodLineInit }>('./home.ts');

/** Same behaviour as the home fold: the line draws scrubbed, rings fill at 0 / .5 / 1, head at 100%. */
function localMethodLine(root: Element, ctx: MotionContext): void {
  const { gsap } = ctx;
  const line = root.querySelector('[data-method-line]') ?? root;
  const paths = Array.from(line.querySelectorAll<SVGPathElement>('[data-method-path]'));
  const path = paths.find((p) => (p.ownerSVGElement ? getComputedStyle(p.ownerSVGElement).display !== 'none' : false)) ?? paths[0];
  if (!path) return;
  const rings = Array.from(line.querySelectorAll<SVGCircleElement>('[data-ring]'));
  const heads = Array.from(line.querySelectorAll<SVGPathElement>('[data-method-head]'));
  const marks = [0, 0.5, 1];
  gsap.set(rings, { opacity: 0, scale: 0, transformOrigin: '50% 50%' });
  gsap.set(heads, { opacity: 0 });
  const lit = rings.map(() => false);
  let headOn = false;
  // non-scaling strokes defeat DrawSVG's measuring, so the straight line draws as a scale from its start edge
  const svg = path.ownerSVGElement ?? path;
  const vertical = svg.classList.contains('ml-path--v');
  const axis = vertical ? 'scaleY' : 'scaleX';
  gsap.fromTo(svg, { [axis]: 0, transformOrigin: vertical ? '50% 0%' : '0% 50%' }, {
    [axis]: 1, ease: 'none',
    scrollTrigger: {
      trigger: root, start: 'top 70%', end: 'bottom 60%', scrub: 0.6,
      onRefresh: (self) => update(self.progress),
      onUpdate: (self) => update(self.progress),
    },
  });
  function update(p: number): void {
    rings.forEach((r, i) => {
      const on = p > 0 && p >= (marks[i] ?? 1) - 0.001;
      if (on !== lit[i]) { lit[i] = on; gsap.to(r, { opacity: on ? 1 : 0, scale: on ? 1 : 0, duration: .22, ease: 'power1.out', overwrite: true }); }
    });
    const h = p >= 0.999;
    if (h !== headOn) { headOn = h; gsap.to(heads, { opacity: h ? 1 : 0, duration: .2, overwrite: true }); }
  }
}

export default function approach(ctx: MotionContext): void {
  const root = document.querySelector('[data-method-fold]');
  if (!root || ctx.reduced) return;           // reduced: the line ships drawn and the rings filled
  ctx.mm.add('(prefers-reduced-motion: no-preference)', (mc) => {
    if (document.documentElement.classList.contains('motion-failed')) return;
    const load = homeModule['./home.ts'];
    // mc.add records tweens created after the async import, so a runtime switch to reduced motion reverts them
    const run = (init?: MethodLineInit) => mc.add(() => { if (init) init(root, ctx); else localMethodLine(root, ctx); });
    if (!load) { run(); return; }
    load().then((m) => run(m.initMethodLine)).catch(() => run()).finally(() => ctx.ScrollTrigger.refresh());
  });
}
