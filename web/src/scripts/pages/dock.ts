/**
 * The dock (DESIGN-SPEC 6.5, graft 1). ≥ 1024px, motion allowed, home only.
 * Scrolling past the hero folds the network away and flies the logo cluster into the header
 * slot; scrolling back flies it home and replays the bloom quickly. Not scrubbed: one beat each way.
 * Flip is imported here, dynamically, so it never blocks the hero.
 */
import type { MotionContext } from '../motion/context';
import { networkInto, type HeroControl } from './hero';

type FlipType = typeof import('gsap/Flip').Flip;

export function initDock(ctx: MotionContext, hero: HeroControl): () => void {
  const { gsap, ScrollTrigger } = ctx;
  const p = hero.parts;
  const slot = document.querySelector<HTMLElement>('[data-dock-slot]');
  const slotSvg = slot?.querySelector<SVGSVGElement>('svg') ?? null;
  const source = p.cluster;
  if (!slot || !slotSvg || !source) return () => {};

  let Flip: FlipType | null = null;
  let docked = false;
  let clone: SVGSVGElement | null = null;
  let active: gsap.core.Animation[] = [];
  let dead = false;

  const flipReady = import('gsap/Flip').then((m) => { Flip = m.Flip; gsap.registerPlugin(m.Flip); }).catch(() => { Flip = null; });

  const killActive = () => { active.forEach((a) => a.kill()); active = []; clone?.remove(); clone = null; };

  /** A fixed-position copy of `from`, laid over its current rect. */
  const makeClone = (from: SVGSVGElement): SVGSVGElement => {
    const r = from.getBoundingClientRect();
    const c = from.cloneNode(true) as SVGSVGElement;
    c.removeAttribute('id');
    c.setAttribute('aria-hidden', 'true');
    c.setAttribute('width', String(r.width));
    c.setAttribute('height', String(r.height));
    Object.assign(c.style, {
      position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`,
      margin: '0', zIndex: '60', pointerEvents: 'none', overflow: 'visible', display: 'block',
    });
    c.classList.add('dock-clone');
    document.body.appendChild(c);
    return c;
  };

  /** Fly `c` onto `target`'s rect. Flip.fit when loaded; a plain rect tween otherwise. */
  const fly = (c: SVGSVGElement, target: Element, onComplete: () => void): gsap.core.Animation => {
    if (Flip) {
      const t = Flip.fit(c, target, { duration: .64, ease: 'power3.inOut', onComplete }) as gsap.core.Animation | null;
      if (t) return t;
    }
    const r = target.getBoundingClientRect();
    return gsap.to(c, { left: r.left, top: r.top, width: r.width, height: r.height, duration: .64, ease: 'power3.inOut', onComplete });
  };

  const showSlot = (on: boolean) => { slot.style.visibility = on ? 'visible' : 'hidden'; };

  /** Fold the network away (reverse order, 40 ms stagger, 360 ms). */
  const collapse = (instant = false) => {
    const tl = gsap.timeline();
    const d = instant ? 0 : .36;
    tl.to([...p.branches].reverse(), { drawSVG: '0%', duration: d, stagger: instant ? 0 : .04, ease: 'power2.inOut' }, 0);
    tl.to([...p.stationLines].reverse(), { drawSVG: '0%', duration: d, stagger: instant ? 0 : .04, ease: 'power2.inOut' }, 0);
    tl.to([...p.nodes, ...p.labels, ...p.stationDots], { opacity: 0, duration: d, ease: 'power1.in' }, 0);
    return tl;
  };

  const dock = (instant = false) => {
    if (docked || dead) return;
    docked = true;
    killActive();
    hero.bloom?.progress(1);
    const fold = collapse(instant);
    if (instant) {
      fold.progress(1);
      gsap.set(source, { opacity: 0 });
      showSlot(true);
      return;
    }
    active.push(fold);
    clone = makeClone(source);
    gsap.set(source, { opacity: 0 });
    const c = clone;
    active.push(fly(c, slotSvg, () => { showSlot(true); c.remove(); if (clone === c) clone = null; }));
  };

  const undock = () => {
    if (!docked || dead) return;
    docked = false;
    killActive();
    showSlot(false);
    clone = makeClone(slotSvg);
    const c = clone;
    active.push(fly(c, source, () => {
      gsap.set(source, { opacity: 1 });
      c.remove(); if (clone === c) clone = null;
      const replay = gsap.timeline();
      networkInto(ctx, replay, p, 0, .4);
      active.push(replay);
    }));
  };

  const heroEl = p.root;
  let st: ScrollTrigger | null = null;
  flipReady.then(() => {
    if (dead) return;
    st = ScrollTrigger.create({
      trigger: heroEl, start: 'top top', end: 'bottom 40%',
      onLeave: () => dock(), onEnterBack: () => undock(),
    });
    // Loaded (or restored) already past the hero: dock without animation.
    if (st && window.scrollY >= st.end) dock(true);
  });

  return () => {
    dead = true;
    st?.kill();
    killActive();
    slot.style.removeProperty('visibility');
    gsap.set(source, { clearProps: 'opacity' });
    gsap.set([...p.branches, ...p.stationLines], { drawSVG: '100%' });
    gsap.set([...p.nodes, ...p.labels, ...p.stationDots], { opacity: 1 });
  };
}

/** True when the page loaded already scrolled past most of the hero (6.5). */
export function loadedPastHero(): boolean {
  const hero = document.querySelector<HTMLElement>('[data-hero-root]');
  if (!hero) return false;
  const bottom = hero.getBoundingClientRect().bottom + window.scrollY;
  return window.scrollY > bottom * .6;
}
