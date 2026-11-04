/**
 * Home motion (DESIGN-SPEC 6.5): hero bloom + dock, the proof line and counts, the scrubbed
 * method line. Everything else on home is the shared reveal grammar (motion/reveal.ts), plus the
 * founder ring (data-draw) and the CTA sequence (data-cta).
 * Every tween is created inside ctx.mm.add(), so a flip to reduced motion reverts to the
 * server-rendered final state.
 */
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { MotionContext } from '../motion/context';
import { countUp } from '../motion/countup';
import { initHero } from './hero';
import { initDock, loadedPastHero } from './dock';

const MOTION = '(prefers-reduced-motion: no-preference)';
const IMPERIAL = '#3A1C5C';
const SAFFRON = '#F4C841';
const failed = () => document.documentElement.classList.contains('motion-failed');

/* ── Proof band (graft 2) ─────────────────────────────────────────────────────────────── */

function initProof(ctx: MotionContext): void {
  const root = document.querySelector<HTMLElement>('[data-proof]');
  if (!root) return;
  ctx.mm.add(MOTION, () => {
    if (failed()) return;
    const { gsap } = ctx;
    const line = root.querySelector<HTMLElement>('[data-proof-line]');
    const items = Array.from(root.querySelectorAll<HTMLElement>('.proof__item'));
    if (!line || !items.length) return;
    const lineVisible = getComputedStyle(line).display !== 'none';
    const lineBox = line.getBoundingClientRect();
    const LINE = 1.2;

    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 70%', once: true } });
    if (lineVisible) tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: LINE, ease: 'power2.inOut', transformOrigin: '0% 50%' }, 0);

    items.forEach((item, i) => {
      const node = item.querySelector<HTMLElement>('[data-proof-node]');
      const counter = item.querySelector<HTMLElement>('[data-count]');
      const word = item.querySelector<HTMLElement>('[data-proof-word]');
      const label = item.querySelector<HTMLElement>('.proof__label');
      // The node lights when the line passes its x fraction; below 768 they light in turn.
      const x = node && lineVisible ? node.getBoundingClientRect().left - lineBox.left : 0;
      const at = lineVisible && lineBox.width > 0 ? LINE * Math.min(1, Math.max(0, x / lineBox.width)) : i * .15;
      if (node) {
        tl.fromTo(node, { scale: .6, backgroundColor: IMPERIAL },
          { scale: 1, backgroundColor: SAFFRON, duration: .22, ease: 'power1.out', clearProps: 'transform,backgroundColor' }, at);
      }
      const counted = counter ? countUp(counter) : null;
      if (counter) {
        // Hidden until its node lights, so the final figure never flashes before the count.
        tl.fromTo(counter, { opacity: 0 }, { opacity: 1, duration: counted ? .12 : .4, ease: 'power1.out', clearProps: 'opacity' }, at);
        if (counted) { counted.pause(0); tl.add(counted.play(), at); }
      }
      if (word) tl.fromTo(word, { opacity: 0 }, { opacity: 1, duration: .4, ease: 'power1.out', clearProps: 'opacity' }, at);
      if (label) tl.fromTo(label, { opacity: 0 }, { opacity: 1, duration: .4, ease: 'power1.out', clearProps: 'opacity' }, at);
    });
  });
}

/* ── Method line (reused by approach.ts) ──────────────────────────────────────────────── */

/**
 * Scrub the Connect · Collaborate · Create line across its fold (no pin): the visible path
 * draws 0 → 100%, each ring's dot fills as progress crosses its fraction (0, .5, 1), the arrow
 * head fades in at the end. Horizontal ≥ 768px, vertical below; the same code drives both.
 * `root` is the fold (the ScrollTrigger trigger) or the [data-method-line] element itself.
 * Reduced motion: nothing runs; the line ships drawn and the rings filled.
 */
export function initMethodLine(root: Element | null, ctx: MotionContext): void {
  if (!root) return;
  const line = root.matches('[data-method-line]') ? root : root.querySelector('[data-method-line]');
  if (!line) return;
  const fold = root.matches('[data-method-line]') ? (line.closest('section') ?? line) : root;

  ctx.mm.add({ h: `${MOTION} and (min-width: 768px)`, v: `${MOTION} and (max-width: 767px)` }, (c) => {
    if (failed()) return;
    const { gsap } = ctx;
    const vertical = !!(c.conditions as { v?: boolean }).v;
    const pathSvg = line.querySelector<SVGSVGElement>(vertical ? '.ml-path--v' : '.ml-path--h');
    const head = line.querySelector<SVGSVGElement>(vertical ? '.ml-head--v' : '.ml-head--h');
    const dots = Array.from(line.querySelectorAll<SVGCircleElement>('[data-ring]'));
    if (!pathSvg) return;

    // The path uses non-scaling strokes inside preserveAspectRatio="none", which DrawSVG cannot
    // measure; drawing is a scale from the start edge, which reads identically on a straight line.
    const axis = vertical ? 'scaleY' : 'scaleX';
    gsap.set(pathSvg, { [axis]: 0, transformOrigin: vertical ? '50% 0%' : '0% 50%' });
    gsap.set(dots, { opacity: 0, scale: 0, transformOrigin: '50% 50%' });
    if (head) gsap.set(head, { opacity: 0 });

    const fractions = dots.map((_, i) => (dots.length > 1 ? i / (dots.length - 1) : 0));
    const lit = dots.map(() => false);
    let headOn = false;
    const apply = (prog: number) => {
      fractions.forEach((f, i) => {
        const on = prog >= Math.max(.02, Math.min(.98, f));
        if (on !== lit[i]) {
          lit[i] = on;
          gsap.to(dots[i], { opacity: on ? 1 : 0, scale: on ? 1 : 0, duration: .22, ease: 'power1.out', overwrite: true });
        }
      });
      const h = prog >= .99;
      if (head && h !== headOn) { headOn = h; gsap.to(head, { opacity: h ? 1 : 0, duration: .2, overwrite: true }); }
    };

    const tween = gsap.to(pathSvg, {
      [axis]: 1, ease: 'none',
      scrollTrigger: {
        trigger: fold, start: 'top 70%', end: 'bottom 60%', scrub: .6,
        onUpdate: (self: ScrollTrigger) => apply(self.progress),
      },
    });
    // Sync the thresholds with wherever the page already is (reload mid-page).
    apply((tween.scrollTrigger as ScrollTrigger | undefined)?.progress ?? 0);
  });
}

/* ── Page entry ───────────────────────────────────────────────────────────────────────── */

export default function home(ctx: MotionContext): void {
  // Hero bloom, desktop and mobile; the dock only at ≥ 1024px.
  ctx.mm.add(MOTION, () => {
    if (failed()) return;
    const past = loadedPastHero();
    const hero = initHero(ctx, past);
    if (!hero) return;
    let undock: (() => void) | null = null;
    const desk = ctx.gsap.matchMedia();
    desk.add('(min-width: 1024px)', () => {
      undock = initDock(ctx, hero.control);
      return () => { undock?.(); undock = null; };
    });
    return () => { desk.revert(); hero.cleanup(); };
  });

  initProof(ctx);
  initMethodLine(document.querySelector('[data-method-fold]'), ctx);
}
