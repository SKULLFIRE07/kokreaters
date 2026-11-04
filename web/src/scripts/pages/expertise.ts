/**
 * /expertise and /expertise/[slug] (DESIGN-SPEC 6.6). Runs for page="expertise" and page="pillar".
 * - PillarMap: the five lines draw out from the current node, 700ms, stagger 80ms, on load.
 *   They ship drawn; under motion the group is hidden by data-hero-hide until this runs.
 * - Help list connector: the 1px Hairline line through the bullets draws on enter, 900ms.
 * Hover link colours are CSS only. Under reduced motion nothing runs: the final state is in the HTML.
 */
import type { MotionContext } from '../motion/context';
import { E, START } from '../motion/tokens';

export default function initExpertise(ctx: MotionContext): void | (() => void) {
  if (ctx.reduced) return;
  const { gsap } = ctx;
  const tweens: gsap.core.Animation[] = [];

  const group = document.querySelector<SVGGElement>('[data-pmap-lines]');
  if (group) {
    const lines = Array.from(group.querySelectorAll<SVGLineElement>('line'));
    // Only animate where the map is shown (≥768px); below that the SVG is display:none.
    if (lines.length && group.getBoundingClientRect().width > 0) {
      const tl = gsap.timeline({ onComplete: () => { gsap.set(lines, { clearProps: 'strokeDasharray,strokeDashoffset' }); } });
      tl.set(lines, { drawSVG: '0%' })
        .set(group, { opacity: 1 })
        .to(lines, { drawSVG: '100%', duration: .7, stagger: .08, ease: E.draw });
      tweens.push(tl);
    } else {
      gsap.set(group, { opacity: 1 });
    }
  }

  const connector = document.querySelector<HTMLElement>('[data-connector]');
  if (connector) {
    tweens.push(gsap.fromTo(connector, { scaleY: 0, transformOrigin: '50% 0%' }, {
      scaleY: 1, duration: .9, ease: E.draw, clearProps: 'transform',
      scrollTrigger: { trigger: connector, start: START, once: true },
    }));
  }

  return () => tweens.forEach((t) => t.kill());
}
