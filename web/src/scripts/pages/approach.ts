/**
 * /approach motion (DESIGN-SPEC v2 10.5, 00.2). No cross-unit imports (12.3).
 * - F2 the three acts: at ≥ 1024 with motion, the stage pins for 300% of the viewport; scroll scrubs the diagram from
 *   six scattered nodes (Connect) to one linked network (Collaborate) to a single rising arrow (Create); the acts
 *   cross-fade at the thirds and the stage ground tweens Sapphire → Violet → Saffron. Otherwise the slabs stay static.
 * - F3 Crumple and F5 FaqAccordion are lazy chunks (whenNear). Crumple also runs under reduced motion (instant).
 */
import type { MotionContext } from '../motion/context';
import { STATES, LINKS, type Pt } from '@/components/approach/acts';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const GROUNDS = ['g-sapphire', 'g-violet', 'g-saffron'];

function initActs(ctx: MotionContext): void {
  const root = document.querySelector<HTMLElement>('[data-acts]');
  const stage = root?.querySelector<HTMLElement>('[data-acts-stage]');
  if (!root || !stage) return;
  const { gsap, ScrollTrigger } = ctx;
  ctx.mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    if (ctx.reduced || document.documentElement.classList.contains('motion-failed')) return;
    root.classList.add('acts--pinned');
    const acts = Array.from(root.querySelectorAll<HTMLElement>('[data-act]'));
    const nodes = Array.from(root.querySelectorAll<SVGGElement>('[data-acts-nodes] > g'));
    const links = Array.from(root.querySelectorAll<SVGLineElement>('[data-acts-links] line'));
    const arrow = root.querySelector<SVGPathElement>('[data-acts-arrow]');
    const head = root.querySelector<SVGPathElement>('[data-acts-head]');
    const counter = root.querySelector<HTMLElement>('[data-acts-i]');
    const hint = Array.from(root.querySelectorAll<HTMLElement | SVGElement>('.acts__hint > *'));
    [...links, arrow, head].forEach((el) => { if (el) { el.style.strokeDasharray = '1 1'; el.style.strokeDashoffset = '1'; } });
    let current = -1;
    const show = (i: number, instant = false) => {
      if (i === current) return;
      const prev = current; current = i;
      GROUNDS.forEach((g, k) => stage.classList.toggle(g, k === i));
      if (counter) counter.textContent = String(i + 1);
      acts.forEach((a, k) => {
        a.classList.toggle('is-on', k === i);
        if (k === i) gsap.fromTo(a, { autoAlpha: 0, y: instant ? 0 : (prev < i ? 60 : -60) }, { autoAlpha: 1, y: 0, duration: instant ? 0 : .8, ease: 'expo.out', overwrite: true });
        else if (k === prev) gsap.to(a, { autoAlpha: 0, y: prev < i ? -50 : 50, duration: .45, ease: 'power2.in', overwrite: true });
        else gsap.set(a, { autoAlpha: 0 });
      });
    };
    const render = (p: number) => {
      const m12 = ease(seg(p, .2, .4));
      const m23 = ease(seg(p, .56, .76));
      const pos = STATES[0].map((a, i) => {
        const wob = (1 - m12) * 10;
        const a1: Pt = [a[0] + Math.sin(p * 18 + i * 1.7) * wob, a[1] + Math.cos(p * 15 + i) * wob];
        return lerp(lerp(a1, STATES[1][i], m12), STATES[2][i], m23);
      });
      const sc = 1 - .22 * m23;
      nodes.forEach((g, i) => g.setAttribute('transform', `translate(${pos[i][0].toFixed(1)} ${pos[i][1].toFixed(1)}) scale(${sc.toFixed(3)})`));
      const draw = seg(p, .3, .48);
      links.forEach((l, k) => {
        const [a, b] = LINKS[k];
        l.setAttribute('x1', pos[a][0].toFixed(1)); l.setAttribute('y1', pos[a][1].toFixed(1));
        l.setAttribute('x2', pos[b][0].toFixed(1)); l.setAttribute('y2', pos[b][1].toFixed(1));
        const d = clamp(draw * 1.6 - k * .06);
        l.style.strokeDashoffset = String(1 - d);
        l.style.opacity = String(.85 * (1 - seg(p, .6, .72)));
      });
      if (arrow) arrow.style.strokeDashoffset = String(1 - ease(seg(p, .7, .9)));
      if (head) head.style.strokeDashoffset = String(1 - seg(p, .88, .95));
      hint.forEach((h) => { h.style.opacity = String(1 - seg(p, .12, .22)); });
      show(p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2);
    };
    render(0); show(0, true);
    const st = ScrollTrigger.create({
      trigger: root, pin: stage, start: 'top top', end: '+=300%', scrub: .6, anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => render(self.progress),
      onRefresh: (self) => render(self.progress),
    });
    // keyboard: focus inside an act scrolls the pin to that act
    const onFocus = (e: FocusEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
      if (!a) return;
      const i = Number(a.dataset.act);
      const y = st.start + (st.end - st.start) * ((i + .5) / 3);
      if (ctx.lenis) ctx.lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
    };
    root.addEventListener('focusin', onFocus);
    return () => {
      root.removeEventListener('focusin', onFocus);
      root.classList.remove('acts--pinned');
      GROUNDS.forEach((g, k) => stage.classList.toggle(g, k === 0));
      gsap.set(acts, { clearProps: 'all' });
      acts.forEach((a) => a.classList.remove('is-on'));
    };
  });
}

export default function approach(ctx: MotionContext): void {
  initActs(ctx);
  document.querySelectorAll<HTMLElement>('[data-crumple]').forEach((el) => {
    ctx.whenNear(el, async () => (await import('../bencho/crumple')).default(el, ctx));
  });
  if (!ctx.reduced) document.querySelectorAll<HTMLElement>('[data-faq]').forEach((el) => {
    ctx.whenNear(el, async () => (await import('../bencho/faq-accordion')).default(el));
  });
}
