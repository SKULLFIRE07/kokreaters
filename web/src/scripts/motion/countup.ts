import { gsap } from 'gsap';
import { site } from '@/config/site';
import type { MotionContext } from './context';
import { D, E, START } from './tokens';

/**
 * data-count: integers only, 0 → count over 600 ms (DESIGN-SPEC 6.4, C-18).
 * The server-rendered text is the final value; any prefix or suffix around the
 * first run of digits ("25+", "3×") is kept while counting.
 */
export function countUp(el: HTMLElement, duration: number = D.count): gsap.core.Tween | null {
  const target = Number.parseInt(el.dataset.count ?? '', 10);
  const text = el.textContent ?? '';
  const m = /\d[\d,]*/.exec(text);
  if (!site.motion.proofCountUp || !Number.isFinite(target) || !m) return null;
  const pre = text.slice(0, m.index);
  const post = text.slice(m.index + m[0].length);
  const state = { v: 0 };
  return gsap.to(state, {
    v: target, duration, ease: E.count,
    onStart: () => { el.textContent = `${pre}0${post}`; },
    onUpdate: () => { el.textContent = `${pre}${Math.round(state.v)}${post}`; },
    onComplete: () => { el.textContent = text; },
  });
}

/** True when a page timeline (the home proof band) owns this counter. */
function isDriven(el: HTMLElement): boolean {
  const fold = el.closest('section') ?? el.parentElement;
  return !!fold?.querySelector('[data-proof-line]');
}

/**
 * Counters inside the proof band are driven by its timeline (home.ts calls countUp).
 * Any other data-count (none ship; count-ups are banned elsewhere) counts on enter.
 */
export function initCounts(ctx: MotionContext): void {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    if (isDriven(el)) return;
    ctx.ScrollTrigger.create({ trigger: el, start: START, once: true, onEnter: () => { countUp(el); } });
  });
}
