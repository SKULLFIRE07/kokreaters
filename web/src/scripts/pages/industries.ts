/**
 * /industries (DESIGN-SPEC v2 10.4, 00.2).
 *  - Sector index (every mode, it is navigation state): an IntersectionObserver marks the sector in view with
 *    aria-current="true" and glides the Saffron highlight block behind it (CSS transitions `top`).
 *  - Sector wheel (every mode): hover / focus a wheel label → the wheel turns to it, the panel and pillar links follow.
 *  - Sector wheel (motion only): the section pins and scroll turns the wheel one sector per step (snapped), the active
 *    sector expands; pillar nodes it maps to spring up and their links draw out.
 */
import type { MotionContext } from '../motion/context';

function initIndex(): () => void {
  const nav = document.querySelector<HTMLElement>('[data-sector-index]');
  const bar = nav?.querySelector<HTMLElement>('[data-sector-bar]');
  const links = new Map<string, HTMLAnchorElement>();
  nav?.querySelectorAll<HTMLAnchorElement>('[data-sector-link]').forEach((a) => links.set(a.dataset.sectorLink ?? '', a));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-sector]'));
  if (!nav || !sections.length || !('IntersectionObserver' in window)) return () => {};

  let currentId = '';
  const setCurrent = (id: string) => {
    if (id === currentId) return;
    currentId = id;
    links.forEach((a, key) => { if (key === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    const a = links.get(id);
    if (!a) { nav.classList.remove('has-current'); return; }
    if (bar) {
      const li = a.parentElement as HTMLElement;
      bar.style.top = `${li.offsetTop}px`;
      bar.style.height = `${a.offsetHeight}px`;
      nav.classList.add('has-current');
    }
  };
  const pick = () => {
    const line = window.innerHeight * 0.45;
    let id = '';
    for (const s of sections) { if (s.getBoundingClientRect().top <= line) id = s.dataset.sector ?? ''; else break; }
    setCurrent(id);
  };
  const io = new IntersectionObserver(pick, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach((s) => io.observe(s));
  const onResize = () => { const id = currentId; currentId = ''; if (id) setCurrent(id); pick(); };
  window.addEventListener('resize', onResize, { passive: true });
  return () => { io.disconnect(); window.removeEventListener('resize', onResize); };
}

function initWheel(ctx: MotionContext): () => void {
  const root = document.querySelector<HTMLElement>('[data-wheel]');
  const dial = root?.querySelector<HTMLElement>('[data-wheel-dial]');
  const section = document.querySelector<HTMLElement>('[data-wheel-section]');
  if (!root || !dial || !section) return () => {};
  const { gsap } = ctx;
  const labels = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-wheel-link-i]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-wheel-panel]'));
  const plinks = Array.from(root.querySelectorAll<SVGLineElement>('[data-wheel-link]'));
  const pnodes = Array.from(root.querySelectorAll<SVGGElement>('[data-wheel-pnode]'));
  const n = labels.length, step = 360 / n;
  const state = { r: 0 };
  let active = 0;
  const kill: (() => void)[] = [];

  const render = () => { dial.style.setProperty('--wr', `${state.r.toFixed(2)}deg`); };
  const setActive = (i: number) => {
    if (i === active) return;
    active = i;
    root.dataset.active = String(i);
    labels.forEach((a, j) => a.classList.toggle('is-active', j === i));
    panels.forEach((p, j) => p.classList.toggle('is-active', j === i));
    const on = (panels[i]?.dataset.pillars ?? '').split(' ');
    plinks.forEach((l) => { if (on.includes(l.dataset.wheelLink ?? '')) l.setAttribute('data-on', ''); else l.removeAttribute('data-on'); });
    pnodes.forEach((g) => { if (on.includes(g.dataset.wheelPnode ?? '')) g.setAttribute('data-on', ''); else g.removeAttribute('data-on'); });
    if (!ctx.reduced) {
      const lit = plinks.filter((l) => l.hasAttribute('data-on'));
      gsap.fromTo(lit, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .5, ease: 'power2.out', stagger: .06, overwrite: true });
      const pn = panels[i];
      if (pn) gsap.fromTo(pn.children, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .45, stagger: .05, ease: 'power3.out', overwrite: true, clearProps: 'opacity,transform' });
    }
  };
  const turnTo = (i: number, instant = false) => {
    setActive(i);
    // shortest way round from the current angle
    const target = -i * step; let cur = state.r;
    while (target - cur > 180) cur += 360; while (target - cur < -180) cur -= 360;
    state.r = cur;
    if (instant || ctx.reduced) { state.r = target; render(); }
    else gsap.to(state, { r: target, duration: .8, ease: 'back.out(1.2)', onUpdate: render, overwrite: true });
  };

  let pinST: ScrollTrigger | undefined;
  labels.forEach((a, i) => {
    const f = () => {
      if (pinST && pinST.isActive) return;   // inside the pin, scroll owns the wheel
      turnTo(i);
    };
    a.addEventListener('focus', f); a.addEventListener('pointerenter', f);
    kill.push(() => { a.removeEventListener('focus', f); a.removeEventListener('pointerenter', f); });
  });

  if (!ctx.reduced) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.to(state, { r: -(n - 1) * step, duration: 1, onUpdate: () => { render(); setActive(Math.round(-state.r / step)); } });
    pinST = ctx.ScrollTrigger.create({
      trigger: section, start: 'top top', end: () => `+=${window.innerHeight * (window.innerWidth < 768 ? 2.6 : 3.4)}`,
      pin: true, scrub: .6, animation: tl, anticipatePin: 1,
      snap: { snapTo: 1 / (n - 1), duration: { min: .2, max: .6 }, delay: .08, ease: 'power2.inOut' },
      invalidateOnRefresh: true,
    });
    kill.push(() => { pinST?.kill(); tl.kill(); });
  }
  return () => kill.forEach((f) => f());
}

export default function initIndustries(ctx: MotionContext): () => void {
  const a = initIndex();
  const b = initWheel(ctx);
  return () => { a(); b(); };
}
