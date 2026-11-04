/**
 * card-fan.ts (DESIGN-SPEC v2 9): enhances CardFan.astro. Port of the Bencho "card-fan" block to vanilla TS + GSAP.
 *
 * MIT License · Copyright (c) 2026 Lorenzo Cabra (bencho.dev). Permission is hereby granted, free of charge, to any
 * person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the
 * Software without restriction, subject to the following condition: the above copyright notice and this permission
 * notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS",
 * WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 *
 * ≥ 1024px with motion: the hand is "dealt" as you scroll in (one custom property, --deal 0 → 1, scrubbed), and on
 * hover/focus the neighbours lean away from the lifted card (--push). The lift itself is CSS (works for keyboard).
 */
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { MotionContext } from '../motion/context';

export default function initCardFan(root: HTMLElement, ctx: MotionContext): () => void {
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-fan-item]'));
  const mq = window.matchMedia('(min-width: 1024px)');
  const ac = new AbortController();
  const { gsap } = ctx;
  let st: ScrollTrigger | null = null;

  const push = (active: HTMLElement | null) => {
    const slot = (el: HTMLElement) => Number(el.dataset.slot ?? 0);
    const ai = active ? slot(active) : -1;
    items.forEach((el) => {
      const i = slot(el);
      if (ai < 0 || i === ai) { el.style.removeProperty('--push'); return; }
      const dir = i < ai ? -1 : 1;
      const dist = Math.abs(i - ai);
      el.style.setProperty('--push', `${dir * Math.max(0, 70 - (dist - 1) * 24)}px`);
    });
  };
  items.forEach((el) => {
    if (el.hasAttribute('inert')) return;
    el.addEventListener('pointerenter', () => push(el), { signal: ac.signal });
    el.addEventListener('focusin', () => push(el), { signal: ac.signal });
  });
  root.addEventListener('pointerleave', () => { if (!root.contains(document.activeElement)) push(null); }, { signal: ac.signal });
  root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget as Node)) push(null); }, { signal: ac.signal });

  const setup = () => {
    st?.kill(); st = null;
    root.style.removeProperty('--deal');
    if (!mq.matches || ctx.reduced) return;
    const state = { d: 0 };
    root.classList.add('is-dealing');
    const tw = gsap.to(state, {
      d: 1, ease: 'power2.out',
      onUpdate: () => { root.style.setProperty('--deal', state.d.toFixed(4)); root.classList.toggle('is-dealing', state.d < 0.995); },
      scrollTrigger: { trigger: root, start: 'top 92%', end: 'top 38%', scrub: 0.6 },
    });
    st = tw.scrollTrigger ?? null;
  };
  setup();
  mq.addEventListener('change', setup, { signal: ac.signal });
  return () => { ac.abort(); st?.kill(); };
}
