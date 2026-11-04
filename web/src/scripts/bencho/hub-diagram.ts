/*
 * Ported from Bencho (https://bencho.dev) block "hub-diagram" to vanilla TypeScript + GSAP for KoKreaters (DESIGN-SPEC v2 9).
 * Original: MIT License, Copyright (c) 2026 Lorenzo Cabra.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 * and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
/**
 * Hub diagram motion (DESIGN-SPEC v2 9, 10.2 F2). Loaded lazily near the viewport by pages/expertise.ts.
 *  - Hover / focus a pillar disc → root[data-active] (CSS lights the spoke + caption). Runs in every mode.
 *  - Assembly (motion only): scrubbed as the stage scrolls in: discs fly in from the edges with a spin, spokes draw,
 *    the centre stamp lands. Ends fully drawn.
 *  - Packets (motion only, pausable): three Saffron dots per spoke run centre → disc for 6 s after assembly, and on the
 *    hovered spoke while hovered.
 *  - Drift (pointer-fine, motion only): discs lean ≤ 14px toward the pointer; spokes are rebuilt each frame to follow.
 */
import type { MotionContext } from '../motion/context';

const S = 720, C = S / 2;

export default function initHub(root: HTMLElement, ctx: MotionContext): () => void {
  const { gsap } = ctx;
  const stage = root.querySelector<HTMLElement>('[data-hub-stage]');
  if (!stage) return () => {};
  const keys = Array.from(root.querySelectorAll<HTMLElement>('[data-hub-node]')).map((li) => li.dataset.hubNode ?? '');
  const items = new Map(keys.map((k) => [k, root.querySelector<HTMLElement>(`[data-hub-node="${k}"]`)!]));
  const links = new Map(keys.map((k) => [k, root.querySelector<HTMLAnchorElement>(`[data-hub-link="${k}"]`)!]));
  const spokes = new Map(keys.map((k) => [k, root.querySelector<SVGPathElement>(`[data-hub-spoke="${k}"]`)!]));
  const packets = new Map(keys.map((k) => [k, Array.from(root.querySelectorAll<SVGCircleElement>(`[data-hub-packet="${k}"]`))]));
  const base = new Map(keys.map((k, i) => {
    const a = (-90 + i * 60) * Math.PI / 180;
    return [k, { x: C + 262 * Math.cos(a), y: C + 262 * Math.sin(a), bend: Number(spokes.get(k)?.dataset.bend ?? 0) }];
  }));
  const cleanups: (() => void)[] = [];
  const on = <K extends keyof HTMLElementEventMap>(el: EventTarget, ev: K, fn: (e: HTMLElementEventMap[K]) => void) => {
    el.addEventListener(ev, fn as EventListener, { passive: true });
    cleanups.push(() => el.removeEventListener(ev, fn as EventListener));
  };

  /* ── hover / focus state (every mode) ── */
  let hovered = '';
  const setActive = (k: string) => { hovered = k; if (k) root.dataset.active = k; else delete root.dataset.active; };
  links.forEach((a, k) => {
    on(a, 'pointerenter', () => setActive(k));
    on(a, 'pointerleave', () => { if (hovered === k) setActive(''); });
    on(a, 'focus', () => setActive(k));
    on(a, 'blur', () => { if (hovered === k) setActive(''); });
  });
  if (ctx.reduced) return () => cleanups.forEach((f) => f());

  /* ── assembly, scrubbed ── */
  const centre = root.querySelector<HTMLElement>('[data-hub-centre]');
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: stage, start: 'top 92%', end: 'center 62%', scrub: .9 },
  });
  if (centre) tl.fromTo(centre, { scale: .25, rotation: -120, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: .5, ease: 'back.out(1.6)' }, 0);
  keys.forEach((k, i) => {
    const b = base.get(k)!, li = items.get(k)!, sp = spokes.get(k)!;
    const push = 1.9;
    tl.fromTo(sp, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .45, ease: 'power2.inOut' }, .12 + i * .07);
    tl.fromTo(li, { xPercent: (b.x - C) * push * .9, yPercent: (b.y - C) * push * .9, rotation: (i % 2 ? 1 : -1) * 70, scale: .4, opacity: 0 },
      { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 1, duration: .55, ease: 'back.out(1.4)' }, .1 + i * .07);
  });

  /* ── packets ── */
  let runAllUntil = 0;
  const geom = new Map<string, { x: number; y: number }>(keys.map((k) => [k, { x: 0, y: 0 }]));
  const rebuild = (k: string) => {
    const b = base.get(k)!, g = geom.get(k)!;
    const x = b.x + g.x, y = b.y + g.y, mx = (C + x) / 2, my = (C + y) / 2;
    const len = Math.hypot(x - C, y - C) || 1, nx = -(y - C) / len, ny = (x - C) / len;
    spokes.get(k)!.setAttribute('d', `M${C} ${C} Q ${(mx + nx * b.bend).toFixed(1)} ${(my + ny * b.bend).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`);
  };
  let t0 = performance.now();
  let visible = false;
  const tick = () => {
    if (!visible) return;
    const now = performance.now();
    const all = now < runAllUntil && !ctx.paused;
    keys.forEach((k) => {
      const live = !ctx.paused && (all || hovered === k);
      const sp = spokes.get(k)!; const ps = packets.get(k)!;
      if (!live) { ps.forEach((p) => { if (p.style.opacity !== '0') p.style.opacity = '0'; }); return; }
      const L = sp.getTotalLength();
      ps.forEach((p, j) => {
        const t = (((now - t0) / 1400) + j / 3) % 1;
        const pt = sp.getPointAtLength(t * L);
        p.setAttribute('cx', pt.x.toFixed(1)); p.setAttribute('cy', pt.y.toFixed(1));
        p.style.opacity = String(Math.sin(t * Math.PI).toFixed(2));
      });
    });
  };
  gsap.ticker.add(tick);
  cleanups.push(() => gsap.ticker.remove(tick));
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (!visible) packets.forEach((ps) => ps.forEach((p) => { p.style.opacity = '0'; })); });
  io.observe(stage); cleanups.push(() => io.disconnect());
  const st = ctx.ScrollTrigger.create({ trigger: stage, start: 'center 62%', once: true, onEnter: () => { t0 = performance.now(); runAllUntil = t0 + 6000; } });
  cleanups.push(() => st.kill());

  /* ── pointer drift (pointer-fine) ── */
  if (ctx.fine) {
    const qx = new Map(keys.map((k) => [k, gsap.quickTo(geom.get(k)!, 'x', { duration: .6, ease: 'power3.out', onUpdate: () => rebuild(k) })]));
    const qy = new Map(keys.map((k) => [k, gsap.quickTo(geom.get(k)!, 'y', { duration: .6, ease: 'power3.out', onUpdate: () => rebuild(k) })]));
    const drift = (k: string, dx: number, dy: number) => {
      qx.get(k)!(dx); qy.get(k)!(dy);
      const s = stage.clientWidth / S;
      gsap.to(links.get(k)!, { x: dx * s, y: dy * s, duration: .6, ease: 'power3.out', overwrite: 'auto' });
    };
    on(stage, 'pointermove', (e) => {
      const r = stage.getBoundingClientRect(); const k2v = S / r.width;
      const px = (e.clientX - r.left) * k2v, py = (e.clientY - r.top) * k2v;
      keys.forEach((k) => {
        const b = base.get(k)!; const dx = px - b.x, dy = py - b.y; const d = Math.hypot(dx, dy);
        const f = Math.max(0, 1 - d / 300) * 22;
        drift(k, d ? (dx / d) * f : 0, d ? (dy / d) * f : 0);
      });
    });
    on(stage, 'pointerleave', () => keys.forEach((k) => {
      qx.get(k)!(0); qy.get(k)!(0);
      gsap.to(links.get(k)!, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, .35)', overwrite: 'auto' });
    }));
  }

  return () => { tl.scrollTrigger?.kill(); tl.kill(); cleanups.forEach((f) => f()); };
}
