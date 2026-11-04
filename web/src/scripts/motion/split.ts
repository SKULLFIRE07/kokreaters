import { SplitText } from 'gsap/SplitText';
import type { MotionContext } from './context';
import { D, E, START } from './tokens';

/**
 * data-reveal="lines": fold h2s rise line by line behind masks (DESIGN-SPEC 6.4).
 * Never the H1. autoSplit re-splits on resize and keeps the tween in sync.
 */
export function initSplits(ctx: MotionContext): void {
  const { gsap } = ctx;
  document.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
    if (el.tagName === 'H1' || el.closest('h1')) { el.style.visibility = 'visible'; return; }
    try {
      SplitText.create(el, {
        type: 'lines', mask: 'lines', autoSplit: true,
        onSplit(self) {
          el.style.visibility = 'visible';
          return gsap.from(self.lines, {
            yPercent: 100, duration: D.lines, stagger: .07, ease: E.reveal,
            scrollTrigger: { trigger: el, start: START, once: true },
          });
        },
      });
    } catch {
      el.style.visibility = 'visible';
    }
  });
}
