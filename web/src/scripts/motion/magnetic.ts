/** R7 Magnetic pill / sticker (DESIGN-SPEC v2 8.3): [data-magnetic="0.35"]. Pointer-fine only. Within the element's
 * box + 40px it moves toward the pointer × strength (max 14px), its label × 1.4; leave: elastic.out(1, .35) 0.9 s. */
import type { MotionContext } from './context';
import { D, E } from './tokens';

export function initMagnetic(ctx: MotionContext): void {
  if (!ctx.fine) return;
  const { gsap } = ctx;
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
  if (!els.length) return;
  type M = { el: HTMLElement; s: number; x: gsap.QuickToFunc; y: gsap.QuickToFunc; lx?: gsap.QuickToFunc; ly?: gsap.QuickToFunc; on: boolean };
  const items: M[] = els.map((el) => {
    const label = el.querySelector<HTMLElement>('.btn__label, [data-magnetic-label]') ?? undefined;
    return {
      el, s: Math.min(1, Number(el.dataset.magnetic) || .35), on: false,
      x: gsap.quickTo(el, 'x', { duration: D.magnetIn, ease: E.magnet }), y: gsap.quickTo(el, 'y', { duration: D.magnetIn, ease: E.magnet }),
      lx: label && gsap.quickTo(label, 'x', { duration: D.magnetIn, ease: E.magnet }), ly: label && gsap.quickTo(label, 'y', { duration: D.magnetIn, ease: E.magnet }),
    };
  });
  const clamp = (v: number) => Math.max(-14, Math.min(14, v));
  let raf = 0; let px = 0; let py = 0;
  const tick = () => {
    raf = 0;
    for (const m of items) {
      const r = m.el.getBoundingClientRect();
      if (r.width === 0) continue;
      const inside = px > r.left - 40 && px < r.right + 40 && py > r.top - 40 && py < r.bottom + 40;
      if (inside) {
        const dx = clamp((px - (r.left + r.width / 2)) * m.s), dy = clamp((py - (r.top + r.height / 2)) * m.s);
        m.on = true; m.x(dx); m.y(dy); m.lx?.(dx * .4); m.ly?.(dy * .4);
      } else if (m.on) {
        m.on = false;
        const targets = [m.el, m.el.querySelector('.btn__label, [data-magnetic-label]')].filter(Boolean) as Element[];
        gsap.to(targets, { x: 0, y: 0, duration: D.magnetOut, ease: E.release, overwrite: true });
      }
    }
  };
  window.addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
}
