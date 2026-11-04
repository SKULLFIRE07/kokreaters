/**
 * 404 (DESIGN-SPEC v2 10.12): loads the FallingText pit (bencho port) near the viewport. The H1 is static text; the
 * pit is decorative. Reduced motion: nothing runs; the tiles stay piled in their static layout.
 */
import type { MotionContext } from '../motion/context';

export default function initNotFound(ctx: MotionContext): () => void {
  const pit = document.querySelector<HTMLElement>('[data-falling-text]');
  if (!pit || ctx.reduced) return () => {};
  let dispose: (() => void) | null = null;
  const stop = ctx.whenNear(pit, async () => { dispose = (await import('../bencho/falling-text')).default(pit, ctx); });
  return () => { stop(); dispose?.(); };
}
