/** R10 Parallax (DESIGN-SPEC v2 8.3): [data-parallax="0.15"] on decorative pieces only (stickers, notes, backing
 * discs; never text blocks): y = −speed × 100 % of travel, scrubbed. */
import type { MotionContext } from './context';

export function initParallax(ctx: MotionContext): void {
  const { gsap } = ctx;
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const s = Number(el.dataset.parallax) || .15;
    gsap.fromTo(el, { yPercent: s * 50 }, { yPercent: -s * 50, ease: 'none',
      scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}
