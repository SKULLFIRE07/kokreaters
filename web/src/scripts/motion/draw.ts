import type { MotionContext } from './context';
import { E, START } from './tokens';

const SHAPES = 'path, line, circle, polyline, polygon, ellipse, rect';

/** Resolve a data-draw host to the strokes it draws: itself, or its shapes if it is an <svg>/<g>. */
export function drawTargets(el: Element): SVGGeometryElement[] {
  if (el instanceof SVGGeometryElement) return [el];
  return Array.from(el.querySelectorAll<SVGGeometryElement>(SHAPES));
}

/** Containers whose line-work is sequenced elsewhere (CTA field in reveal.ts, page hero modules). */
export function isManaged(el: Element): boolean {
  return !!el.closest('[data-cta], [data-hero-hide], [data-draw="manual"]');
}

/**
 * data-draw: strokes draw once on enter (DESIGN-SPEC 6.4). Ships drawn, so no-JS and
 * reduced motion see the finished line. Optional data-draw-duration / data-draw-delay
 * (seconds) and data-draw-from="center".
 */
export function initDraws(ctx: MotionContext): void {
  const { gsap } = ctx;
  document.querySelectorAll<Element>('[data-draw]').forEach((host) => {
    if (isManaged(host)) return;
    const targets = drawTargets(host);
    if (!targets.length) return;
    const d = (host as HTMLElement | SVGElement).dataset;
    const fromCentre = d.drawFrom === 'center';
    gsap.fromTo(targets,
      { drawSVG: fromCentre ? '50% 50%' : '0%' },
      {
        drawSVG: fromCentre ? '0% 100%' : '100%',
        duration: Number(d.drawDuration ?? .9) || .9,
        delay: Number(d.drawDelay ?? 0) || 0,
        ease: E.draw,
        scrollTrigger: { trigger: host, start: START, once: true },
      });
  });
}
