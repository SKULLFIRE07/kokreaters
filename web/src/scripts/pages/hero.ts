/**
 * Hero bloom (DESIGN-SPEC 6.5, graft 1). Runs only without reduced motion, desktop and mobile.
 * The network ships fully drawn; [data-hero-hide] groups are held at opacity 0 by motion.css until
 * this timeline takes them over. The H1 is never touched; only its swoosh draws (B3).
 *
 *   t=0     B1  the five logo dots light, .35 → 1, 220 ms each, stagger 90 ms
 *   t=420   B2  six branches draw from the Saffron centre; each pillar node pops as its branch nears the end
 *   t=1150  B3  the swoosh under "shared ambition" draws, 900 ms, head at 90%
 *   t=1300  B4  three station lines draw 500 ms, then their dots fade in 200 ms
 *   ≈2100   done. Nothing loops.
 */
import type { MotionContext } from '../motion/context';
import { swooshInto } from '../motion/reveal';

const ORDER = ['innovation', 'process', 'quality', 'strategy', 'deals', 'capability'] as const;
const B1_ORDER = ['sapphire', 'cobalt', 'saffron', 'sky', 'coral'] as const;

export interface HeroParts {
  root: HTMLElement;
  svg: SVGSVGElement;
  cluster: SVGSVGElement | null;
  groups: SVGGElement[];
  branches: SVGLineElement[];
  nodes: SVGGElement[];
  labels: SVGTextElement[];
  stationLines: SVGLineElement[];
  stationDots: SVGCircleElement[];
  rings: SVGCircleElement[];
}

export function heroParts(): HeroParts | null {
  const root = document.querySelector<HTMLElement>('[data-hero-root]');
  const svg = root?.querySelector<SVGSVGElement>('[data-hero-network]');
  if (!root || !svg) return null;
  const byKey = <T extends Element>(sel: string, attr: string) =>
    ORDER.map((k) => svg.querySelector<T>(`${sel}[${attr}="${k}"]`)).filter((x): x is T => !!x);
  const pillarGroups = byKey<SVGGElement>('.hn-pillar', 'data-p');
  return {
    root, svg,
    cluster: svg.querySelector<SVGSVGElement>('[data-hero="cluster"] svg'),
    groups: Array.from(svg.querySelectorAll<SVGGElement>('[data-hero-hide]')),
    branches: byKey<SVGLineElement>('line', 'data-branch'),
    nodes: pillarGroups.map((g) => g.querySelector<SVGGElement>('.hn-node')!).filter(Boolean),
    labels: pillarGroups.map((g) => g.querySelector<SVGTextElement>('.node-label')!).filter(Boolean),
    stationLines: Array.from(svg.querySelectorAll<SVGLineElement>('.hn-station-line')),
    stationDots: Array.from(svg.querySelectorAll<SVGCircleElement>('.hn-station')),
    rings: pillarGroups.map((g) => g.querySelector<SVGCircleElement>('.hn-ring')!).filter(Boolean),
  };
}

/**
 * The network half of the bloom (B2 + B4), shared by the first play and the undock replay.
 * `speed` scales every duration and offset (the replay uses 0.4).
 */
export function networkInto(_ctx: MotionContext, tl: gsap.core.Timeline, p: HeroParts, at: number, speed = 1): void {
  const s = (n: number) => n * speed;
  tl.set(p.groups, { opacity: 1 }, at);
  tl.set(p.branches, { drawSVG: '0%' }, at);
  tl.set(p.nodes, { scale: .6, opacity: 0, transformOrigin: '50% 50%' }, at);
  tl.set(p.labels, { opacity: 0 }, at);
  tl.set(p.stationLines, { drawSVG: '0%' }, at);
  tl.set(p.stationDots, { opacity: 0 }, at);
  p.branches.forEach((line, i) => {
    const start = at + s(i * .08);
    tl.to(line, { drawSVG: '100%', duration: s(.7), ease: 'power2.inOut' }, start);
    // power2.inOut reaches 85% of its distance at ~72% of its time
    const pop = start + s(.7 * .72);
    if (p.nodes[i]) tl.to(p.nodes[i], { scale: 1, opacity: 1, duration: s(.22), ease: 'power1.out' }, pop);
    if (p.labels[i]) tl.to(p.labels[i], { opacity: 1, duration: s(.2), ease: 'power1.out' }, pop + s(.08));
  });
  const b4 = at + s(1.3 - .42);
  tl.to(p.stationLines, { drawSVG: '100%', duration: s(.5), ease: 'power2.inOut' }, b4);
  tl.to(p.stationDots, { opacity: 1, duration: s(.2), ease: 'power1.out' }, b4 + s(.5));
  tl.set(p.nodes, { clearProps: 'transform' }, '>');
}

/** The first bloom. Returns the timeline so the dock can finish it early. */
export function playBloom(ctx: MotionContext, p: HeroParts): gsap.core.Timeline {
  const { gsap } = ctx;
  const tl = gsap.timeline();
  // B1 · the logo lights (full colour without JS: .35 is set here, inside the timeline)
  const dots = B1_ORDER
    .map((k) => p.cluster?.querySelector<SVGCircleElement>(`g[data-node="${k}"] circle:nth-child(3)`))
    .filter((x): x is SVGCircleElement => !!x);
  tl.set(dots, { opacity: .35 }, 0);
  tl.to(dots, { opacity: 1, duration: .22, stagger: .09, ease: 'power1.out', clearProps: 'opacity' }, 0);
  // B2 + B4 · the bloom and the stations
  networkInto(ctx, tl, p, .42);
  // B3 · the swoosh
  const swoosh = p.root.querySelector('h1 [data-swoosh]');
  if (swoosh) {
    tl.call(() => p.root.classList.add('is-swooshed'), [], 1.15);
    swooshInto(tl, swoosh, 1.15);
  } else {
    p.root.classList.add('is-swooshed');
  }
  return tl;
}

/** The one hover beat (Network B6): the six outer rings pulse 1 → 2.5 → 1 on "Explore our expertise". */
function bindPulse(ctx: MotionContext, p: HeroParts): () => void {
  const { gsap } = ctx;
  const link = p.root.querySelector<HTMLElement>('[data-hero-explore]');
  if (!link || !p.rings.length) return () => {};
  let busy = false;
  const pulse = () => {
    if (busy) return;
    busy = true;
    gsap.timeline({ onComplete: () => { busy = false; } })
      .to(p.rings, { attr: { 'stroke-width': 2.5 }, duration: .09, ease: 'power1.out', stagger: .06 }, 0)
      .to(p.rings, { attr: { 'stroke-width': 1 }, duration: .09, ease: 'power1.in', stagger: .06 }, .09);
  };
  link.addEventListener('pointerenter', pulse);
  link.addEventListener('focus', pulse);
  return () => { link.removeEventListener('pointerenter', pulse); link.removeEventListener('focus', pulse); };
}

export interface HeroControl { parts: HeroParts; bloom: gsap.core.Timeline | null; }

/**
 * Start the hero. `skipBloom` (page loaded already scrolled past the hero) shows the final state.
 * Must be called inside a gsap.matchMedia context so a flip to reduced motion reverts it.
 */
export function initHero(ctx: MotionContext, skipBloom = false): { control: HeroControl; cleanup: () => void } | null {
  const p = heroParts();
  if (!p) return null;
  let bloom: gsap.core.Timeline | null = null;
  if (skipBloom) {
    ctx.gsap.set(p.groups, { opacity: 1 });
    p.root.classList.add('is-swooshed');
  } else {
    bloom = playBloom(ctx, p);
  }
  const unbind = bindPulse(ctx, p);
  return { control: { parts: p, bloom }, cleanup: () => { unbind(); p.root.classList.remove('is-swooshed'); } };
}
