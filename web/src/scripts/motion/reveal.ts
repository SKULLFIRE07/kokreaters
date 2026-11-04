import type { MotionContext } from './context';
import { D, E, START } from './tokens';
import { drawTargets } from './draw';

type El = HTMLElement;
const BLOCKS = '[data-reveal]:not([data-reveal="lines"])';

/** Mark an element finished: drop GSAP's inline styles and let CSS show it for good. */
function settle(els: Element[], cls: string): void {
  els.forEach((el) => {
    el.classList.add(cls);
    (el as El).style.removeProperty('opacity');
    (el as El).style.removeProperty('transform');
  });
}

/** R2 data-reveal blocks: opacity 0→1, y 28→0, 0.8 s expo.out, once. data-reveal-group staggers 70 ms. */
function initBlocks(ctx: MotionContext): void {
  const { gsap } = ctx;
  const all = Array.from(document.querySelectorAll<El>(BLOCKS));
  const grouped = new Map<Element, El[]>();
  const single: El[] = [];
  for (const el of all) {
    const g = el.parentElement?.closest('[data-reveal-group]');
    if (g) { const list = grouped.get(g) ?? []; list.push(el); grouped.set(g, list); }
    else single.push(el);
  }
  const play = (trigger: Element, targets: El[]) => {
    gsap.fromTo(targets, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: D.reveal, ease: E.reveal, stagger: targets.length > 1 ? .07 : 0,
      scrollTrigger: { trigger, start: START, once: true },
      onComplete: () => settle(targets, 'is-revealed'),
    });
  };
  single.forEach((el) => play(el, [el]));
  grouped.forEach((els, g) => play(g, els));
}

/** data-rule: scaleX 0→1 from the left, 500 ms power2.inOut; rules in one list stagger 60 ms. */
function initRules(ctx: MotionContext): void {
  const { gsap } = ctx;
  const groups = new Map<Element, El[]>();
  document.querySelectorAll<El>('[data-rule]').forEach((el) => {
    const key = el.closest('[data-reveal-group], ol, ul') ?? el;
    const list = groups.get(key) ?? []; list.push(el); groups.set(key, list);
  });
  groups.forEach((els, key) => {
    gsap.fromTo(els, { scaleX: 0, transformOrigin: '0% 50%' }, {
      scaleX: 1, duration: D.rule, ease: E.draw, stagger: els.length > 1 ? .06 : 0,
      scrollTrigger: { trigger: key, start: START, once: true },
      onComplete: () => settle(els, 'is-drawn'),
    });
  });
}

/** The RisingArrow parts: its <svg> and the arrow head. */
function swooshParts(root: Element) {
  const svg = root.querySelector<SVGSVGElement>('svg');
  const head = root.querySelector<SVGGeometryElement>('.swoosh__head');
  return { svg, head };
}

const CLIP_HIDDEN = 'inset(-50% 100% -50% 0%)';
const CLIP_SHOWN = 'inset(-50% 0% -50% 0%)';

/**
 * Add the swoosh beat to a timeline: the stroke wipes in left to right over `dur`
 * (power2.inOut), and the head fades in at 90% over 120 ms. The RisingArrow uses
 * preserveAspectRatio="none" with non-scaling strokes, whose length the browser cannot
 * measure, so the draw is a clip-path wipe rather than DrawSVG. Exported for page
 * modules (hero bloom B3).
 */
export function swooshInto(tl: gsap.core.Timeline, root: Element, at: gsap.Position = '>', dur: number = D.swoosh): void {
  const { svg, head } = swooshParts(root);
  if (!svg) return;
  tl.fromTo(svg, { clipPath: CLIP_HIDDEN }, { clipPath: CLIP_SHOWN, duration: dur, ease: E.draw, clearProps: 'clipPath' }, at);
  if (head) tl.fromTo(head, { opacity: 0 }, { opacity: 1, duration: .12, ease: E.uiIn, clearProps: 'opacity' }, `<${dur * .9}`);
}

/** data-swoosh outside the hero and the CTA: draws once on enter. */
function initSwooshes(ctx: MotionContext): void {
  const { gsap } = ctx;
  document.querySelectorAll<Element>('[data-swoosh]').forEach((root) => {
    if (root.closest('[data-cta], [data-hero-hide], [data-swoosh="manual"]')) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: START, once: true } });
    swooshInto(tl, root, 0);
  });
}

/** data-frost: the Ice underline under "−25 °C" draws on enter (class toggle; CSS does the 900 ms). */
function initFrost(ctx: MotionContext): void {
  document.querySelectorAll<El>('[data-frost]').forEach((el) => {
    el.classList.add('frost-ready');
    ctx.ScrollTrigger.create({ trigger: el, start: START, once: true, onEnter: () => el.classList.add('is-frosted') });
  });
}

/** Terminal node of the CTA field (W1-brand marks it data-cta-node; older class names accepted). */
function ctaNode(root: Element): Element | null {
  return root.querySelector('[data-cta-node], [data-terminal], .cta-node, .cta__node, .terminal-node');
}

/**
 * data-cta: the CtaField sequence (DESIGN-SPEC 5.0.12, 6.5). The Sky line draws 600 ms,
 * the Saffron terminal node scales .6→1 over 220 ms, then the swoosh draws 900 ms.
 */
function initCta(ctx: MotionContext): void {
  const { gsap } = ctx;
  document.querySelectorAll<Element>('[data-cta]').forEach((root) => {
    const lineHosts = root.querySelectorAll('[data-cta-line], [data-draw]');
    const lines = Array.from(lineHosts).flatMap((h) => drawTargets(h)).filter((l) => !l.closest('[data-swoosh]'));
    const node = ctaNode(root);
    const swoosh = root.querySelector('[data-swoosh]');
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: START, once: true } });
    if (lines.length) tl.fromTo(lines, { drawSVG: '0%' }, { drawSVG: '100%', duration: .6, ease: E.draw }, 0);
    if (node) tl.fromTo(node, { scale: .6, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: .22, ease: E.uiIn }, '>');
    if (swoosh) swooshInto(tl, swoosh, '>');
  });
}

export function initReveals(ctx: MotionContext): void {
  initBlocks(ctx);
  initRules(ctx);
  initSwooshes(ctx);
  initFrost(ctx);
  initCta(ctx);
}

/**
 * Failure path: finish every gated element at once and drop the gate.
 * Used when boot throws or the 3 s timer fires mid-boot.
 */
export function revealAllNow(): void {
  const html = document.documentElement;
  html.classList.add('motion-failed');
  document.querySelectorAll<El>('[data-reveal], [data-rule], [data-hero-hide]').forEach((el) => {
    el.style.removeProperty('opacity');
    el.style.removeProperty('transform');
    el.style.removeProperty('visibility');
  });
  document.querySelectorAll<El>('[data-frost]').forEach((el) => el.classList.add('is-frosted'));
  document.querySelectorAll<El>('[data-note], [data-scribble], [data-doodle], [data-venn], [data-sticker]').forEach((el) => {
    el.classList.add('is-drawn'); el.style.removeProperty('opacity'); el.style.removeProperty('transform');
  });
}
