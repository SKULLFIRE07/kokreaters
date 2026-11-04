/**
 * R5 Rails (DESIGN-SPEC v2 7.8, 8.3): [data-rail] with [data-rail-track] (<ul>).
 *  - pinned (data-rail-pin) at ≥ 1024 + motion: pin the rail and scrub the track sideways; cards lean with velocity
 *    (±3°); focus entering a card scrolls the window to that card's place in the scrub.
 *  - otherwise: native overflow-x scroll-snap (CSS) with prev/next buttons and an "i / n" counter.
 */
import type { MotionContext } from './context';

function initNative(root: HTMLElement, track: HTMLElement) {
  const items = Array.from(track.children) as HTMLElement[];
  const prev = root.querySelector<HTMLButtonElement>('[data-rail-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-rail-next]');
  const count = root.querySelector<HTMLElement>('[data-rail-count]');
  const tpl = count?.dataset.template ?? '{i} / {n}';
  const current = () => {
    const left = track.getBoundingClientRect().left;
    let best = 0, bestD = Infinity;
    items.forEach((it, i) => { const d = Math.abs(it.getBoundingClientRect().left - left); if (d < bestD) { bestD = d; best = i; } });
    return best;
  };
  const update = () => {
    const i = current();
    if (count) count.textContent = tpl.replace('{i}', String(i + 1)).replace('{n}', String(items.length));
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  };
  const go = (d: number) => {
    const i = Math.max(0, Math.min(items.length - 1, current() + d));
    track.scrollTo({ left: items[i].offsetLeft - items[0].offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  update();
}

export function initRails(ctx: MotionContext): void {
  const { gsap, ScrollTrigger, mm } = ctx;
  document.querySelectorAll<HTMLElement>('[data-rail]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-rail-track]');
    if (!track) return;
    initNative(root, track);
    if (!root.hasAttribute('data-rail-pin') || ctx.reduced) return;
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      root.classList.add('is-pinned');
      const header = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 64;
      const side = parseFloat(getComputedStyle(root).getPropertyValue('--side')) || 72;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + side * 2);
      const cards = Array.from(track.children) as HTMLElement[];
      const lean = cards.map((c) => gsap.quickTo(c, 'rotation', { duration: .5, ease: 'power3.out' }));
      const tween = gsap.to(track, { x: () => -distance(), ease: 'none' });
      const st = ScrollTrigger.create({
        trigger: root, pin: true, start: `top top+=${header}`, end: () => `+=${distance()}`, scrub: 1,
        animation: tween, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (s) => { const v = Math.max(-3, Math.min(3, s.getVelocity() / 600)); lean.forEach((q) => q(v)); },
        onLeave: () => lean.forEach((q) => q(0)), onLeaveBack: () => lean.forEach((q) => q(0)),
      });
      const onFocus = (e: FocusEvent) => {
        const card = cards.find((c) => c.contains(e.target as Node));
        if (!card) return;
        const off = card.offsetLeft - cards[0].offsetLeft;
        const y = st.start + (Math.min(off, distance()) / (distance() || 1)) * (st.end - st.start);
        window.scrollTo({ top: y, behavior: 'auto' });
      };
      track.addEventListener('focusin', onFocus);
      return () => { track.removeEventListener('focusin', onFocus); root.classList.remove('is-pinned'); gsap.set(track, { clearProps: 'transform' }); };
    });
  });
}
