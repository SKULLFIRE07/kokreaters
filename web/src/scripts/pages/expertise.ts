/**
 * /expertise and /expertise/[slug] (DESIGN-SPEC v2 10.2, 10.3, 00.2). Runs for page="expertise" and page="pillar".
 *  - Hub diagram (/expertise): lazy chunk near the viewport (scripts/bencho/hub-diagram.ts).
 *  - Constellation (pillar hero): strings draw out from the sticker, nodes pop, then bob gently (pausable).
 *  - Signature diagram (pillar pages): scrubbed with scroll: [data-pd-draw] strokes draw, [data-pd-pop] pops,
 *    [data-pd-from] arrives, [data-pd-to] travels, each at data-pd-at (0..1). `.is-live` starts the CSS flow once drawn.
 *  - Spec inspector (pillar pages): lazy chunk; a reader-driven toy, so it also runs under reduced motion.
 * Under reduced motion / JS off the markup is the finished state.
 */
import type { MotionContext } from '../motion/context';
import { E } from '../motion/tokens';

export default function initExpertise(ctx: MotionContext): void | (() => void) {
  const { gsap } = ctx;
  const kill: (() => void)[] = [];

  document.querySelectorAll<HTMLElement>('[data-hub]').forEach((el) => {
    let dispose: (() => void) | undefined;
    kill.push(ctx.whenNear(el, async () => { dispose = (await import('../bencho/hub-diagram')).default(el, ctx); }, '400px'));
    kill.push(() => dispose?.());
  });
  document.querySelectorAll<HTMLElement>('[data-spec-inspector]').forEach((el) => {
    let dispose: (() => void) | undefined;
    kill.push(ctx.whenNear(el, async () => { dispose = (await import('../bencho/spec-inspector')).default(el, ctx.reduced); }));
    kill.push(() => dispose?.());
  });
  if (ctx.reduced) return () => kill.forEach((f) => f());

  /* constellation */
  const pmap = document.querySelector<HTMLElement>('[data-pmap]');
  const lines = pmap ? Array.from(pmap.querySelectorAll<SVGPathElement>('.pmap__line')) : [];
  if (pmap && lines.length && pmap.querySelector('svg')!.getBoundingClientRect().width > 0) {
    const nodes = pmap.querySelectorAll<SVGGElement>('.pmap__node');
    const here = pmap.querySelector<HTMLElement>('.pmap__sticker');
    const tl = gsap.timeline({ delay: .15 });
    if (here) tl.from(here, { scale: .3, rotation: -40, duration: .8, ease: 'back.out(1.8)' }, 0);
    tl.fromTo(lines, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .7, stagger: .08, ease: E.draw }, .2)
      .from(nodes, { scale: 0, transformOrigin: '50% 50%', duration: .5, stagger: .08, ease: 'back.out(2.4)' }, .55);
    kill.push(() => tl.kill());
    // a gentle bob of the sticker, pausable
    if (here) {
      const bob = gsap.to(here, { y: -8, rotation: 3, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.4 });
      kill.push(ctx.onPause((p) => (p ? bob.pause() : bob.resume())), () => bob.kill());
      if (ctx.paused) bob.pause();
    }
  }

  /* signature diagram, scrubbed */
  document.querySelectorAll<HTMLElement>('[data-pdiag]').forEach((fig) => {
    const stage = fig.querySelector<HTMLElement>('.pd__stage');
    if (!stage) return;
    const at = (el: Element) => Number((el as HTMLElement).dataset.pdAt ?? 0);
    const dur = (el: Element, d: number) => Number((el as HTMLElement).dataset.pdDur ?? d);
    const xy = (v?: string) => (v ?? '0,0').split(',').map(Number);
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage, start: 'top 85%', end: 'bottom 80%', scrub: .7,
        onUpdate: (st) => fig.classList.toggle('is-live', st.progress > .96),
        onLeave: () => fig.classList.add('is-live'),
      },
    });
    tl.set({}, {}, 1);   // a fixed 0..1 timeline
    fig.querySelectorAll<SVGPathElement>('[data-pd-draw]').forEach((p) => {
      tl.fromTo(p, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur(p, .15), ease: 'power1.inOut' }, at(p));
    });
    fig.querySelectorAll<HTMLElement | SVGElement>('[data-pd-pop]').forEach((el) => {
      const html = el instanceof HTMLElement;
      tl.fromTo(el, html ? { opacity: 0, y: 16, scale: .8 } : { scale: 0, transformOrigin: '50% 50%' },
        html ? { opacity: 1, y: 0, scale: 1, duration: .07, ease: 'back.out(2)' } : { scale: 1, duration: .08, ease: 'back.out(2)' }, at(el));
    });
    fig.querySelectorAll<SVGElement>('[data-pd-to]').forEach((el) => {
      const [x, y] = xy(el.dataset.pdTo);
      tl.fromTo(el, { x: 0, y: 0 }, { x, y, duration: dur(el, .3), ease: 'power2.in', ...(el.classList.contains('pd-idea') ? { scale: .35, transformOrigin: '50% 50%' } : {}) }, at(el));
    });
    fig.querySelectorAll<SVGElement>('[data-pd-from]').forEach((el) => {
      const [x, y] = xy(el.dataset.pdFrom);
      tl.fromTo(el, { x, y }, { x: 0, y: 0, duration: dur(el, .2), ease: 'power2.out' }, at(el));
    });
    kill.push(() => { tl.scrollTrigger?.kill(); tl.kill(); });
  });

  return () => kill.forEach((f) => f());
}
