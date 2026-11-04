/** R6 Marquee (DESIGN-SPEC v2 8.3): [data-marquee] (data-marquee-speed px/s, data-marquee-dir 1|-1) holding a
 * [data-marquee-track] with two copies of the items. GSAP ticker moves x at speed, wraps at one copy's width; scroll
 * velocity adds up to ±3× speed and skewX ≤ 6°; hover slows to 0.2×; pause control / off-screen / hidden tab stop it. */
import type { MotionContext } from './context';
import { D } from './tokens';
import { onScreen } from './lazy';

export function initMarquees(ctx: MotionContext): void {
  const { gsap, ScrollTrigger } = ctx;
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) return;
    root.classList.add('is-moving');
    const speed = Number(root.dataset.marqueeSpeed) || D.marquee;
    let dir = Number(root.dataset.marqueeDir) === -1 ? -1 : 1;
    let x = 0; let boost = 0; let hover = 1; let visible = false; let width = 0;
    const measure = () => { width = (track.scrollWidth || 0) / 2; };
    measure();
    new ResizeObserver(measure).observe(track);
    const setX = gsap.quickSetter(track, 'x', 'px');
    const setSkew = gsap.quickSetter(track, 'skewX', 'deg');
    const st = ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top', onUpdate: (s) => {
      const v = s.getVelocity();
      if (Math.abs(v) > 20) dir = v > 0 ? 1 : -1;
      boost = Math.max(-3, Math.min(3, v / 900));
    } });
    root.addEventListener('pointerenter', () => { hover = .2; });
    root.addEventListener('pointerleave', () => { hover = 1; });
    const tick = (_t: number, dt: number) => {
      if (!visible || ctx.paused || !width) return;
      const s = (speed * hover + Math.abs(boost) * speed) * dir;
      x -= (s * dt) / 1000;
      if (x <= -width) x += width; else if (x > 0) x -= width;
      setX(x);
      setSkew(Math.max(-6, Math.min(6, -boost * 2)));
      boost *= .92;
    };
    gsap.ticker.add(tick);
    onScreen(root, (v) => { visible = v; });
    void st;
  });
}
