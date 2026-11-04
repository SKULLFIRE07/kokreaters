import { gsap } from 'gsap';
import { site } from '@/config/site';
import type { MotionContext } from './context';
import { D, E, START } from './tokens';

/**
 * R8 Count-up (DESIGN-SPEC v2 8.3): [data-count] (target), optional data-count-from, data-count-suffix.
 * {v: from} → target over 1.4 s expo.out, snapped integers, tabular-nums. The server-rendered text is the final value
 * (screen readers get it from a visually-hidden sibling, v1 pattern); any prefix/suffix around the first run of digits
 * ("25+", "21%", "−25 °C") is kept while counting. Negative targets (−25) count from 0 down.
 */
export function countUp(el: HTMLElement, duration: number = D.count): gsap.core.Tween | null {
  const target = Number.parseInt((el.dataset.count ?? '').replace('−', '-'), 10);
  // count inside the first text node that holds digits, so markup such as <span class="unit">%</span> survives
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (/\d/.test(n.nodeValue ?? '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP) });
  const node = walker.nextNode() as Text | null;
  const text = node?.nodeValue ?? '';
  const m = /[−-]?\d[\d,]*/.exec(text);
  if (!site.motion.proofCountUp || !Number.isFinite(target) || !node || !m) return null;
  const pre = text.slice(0, m.index);
  const post = text.slice(m.index + m[0].length);
  const from = Number.parseInt((el.dataset.countFrom ?? '0').replace('−', '-'), 10) || 0;
  const fmt = (v: number) => (v < 0 ? `−${Math.abs(v)}` : String(v));
  const state = { v: from };
  return gsap.to(state, {
    v: target, duration, ease: E.count,
    onStart: () => { node.nodeValue = `${pre}${fmt(from)}${post}`; },
    onUpdate: () => { node.nodeValue = `${pre}${fmt(Math.round(state.v))}${post}`; },
    onComplete: () => { node.nodeValue = text; },
  });
}

/** True when a page timeline (the home proof band) owns this counter. */
function isDriven(el: HTMLElement): boolean {
  const fold = el.closest('section') ?? el.parentElement;
  return !!fold?.querySelector('[data-proof-line]') || el.hasAttribute('data-count-manual');
}

/** Every [data-count] not owned by a page timeline counts once on enter. */
export function initCounts(ctx: MotionContext): void {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    if (isDriven(el)) return;
    ctx.ScrollTrigger.create({ trigger: el, start: START, once: true, onEnter: () => { countUp(el); } });
  });
}
