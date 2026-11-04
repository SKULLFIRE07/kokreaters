/**
 * /impact motion (DESIGN-SPEC v2 10.6): CardSwap and FoggyWord are lazy chunks (whenNear) and only run with motion;
 * reduced / JS off keep the 2 × 2 list and the clear figure. Count-ups, notes and reveals come from the shared recipes.
 */
import type { MotionContext } from '../motion/context';

export default function impact(ctx: MotionContext): void {
  if (ctx.reduced) return;
  document.querySelectorAll<HTMLElement>('[data-card-swap]').forEach((el) => {
    ctx.whenNear(el, async () => (await import('../bencho/card-swap')).default(el));
  });
  document.querySelectorAll<HTMLElement>('[data-fog]').forEach((el) => {
    ctx.whenNear(el, async () => (await import('../bencho/foggy-word')).default(el, ctx));
  });
}
