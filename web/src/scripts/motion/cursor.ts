/** Cursor follower (DESIGN-SPEC v2 7.9): pointer-fine only, a 12px Ink dot that trails the pointer (quickTo 0.35 s);
 * over [data-cursor] it grows to 84px and shows the Caveat label (drag, throw, wipe, press, open, pull). The native
 * cursor is never hidden. aria-hidden, pointer-events none. */
import type { MotionContext } from './context';

export function initCursor(ctx: MotionContext, labels: Record<string, string>): void {
  if (!ctx.fine) return;
  const { gsap } = ctx;
  const dot = document.createElement('div');
  dot.className = 'kk-cursor';
  dot.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.className = 'kk-cursor__label';
  dot.append(label);
  document.body.append(dot);
  const x = gsap.quickTo(dot, 'x', { duration: .35, ease: 'power3.out' });
  const y = gsap.quickTo(dot, 'y', { duration: .35, ease: 'power3.out' });
  let current: Element | null = null;
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    dot.classList.add('is-on');
    x(e.clientX); y(e.clientY);
    const t = (e.target as Element | null)?.closest?.('[data-cursor]') ?? null;
    if (t !== current) {
      current = t;
      const key = t?.getAttribute('data-cursor') ?? '';
      label.textContent = key ? (labels[key] ?? key) : '';
      dot.classList.toggle('is-big', !!key);
    }
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => dot.classList.remove('is-on'));
}
