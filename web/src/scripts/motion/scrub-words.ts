/** R9 Scrubbed big type (DESIGN-SPEC v2 8.3): [data-scrub-words] → SplitText words, opacity .14 → 1 across the words,
 * scrubbed from 'top 80%' to 'bottom 60%'. Reaches full opacity by the section end. Never on an H1. */
import { SplitText } from 'gsap/SplitText';
import type { MotionContext } from './context';

export function initScrubWords(ctx: MotionContext): void {
  const { gsap } = ctx;
  document.querySelectorAll<HTMLElement>('[data-scrub-words]').forEach((el) => {
    if (el.tagName === 'H1') return;
    try {
      SplitText.create(el, {
        type: 'words', autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(self.words, { opacity: .14 }, { opacity: 1, ease: 'none', stagger: .1,
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 60%', scrub: true } });
        },
      });
    } catch { /* plain text stays */ }
  });
}
