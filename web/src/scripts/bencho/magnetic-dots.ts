/*
 * Ported from Bencho (https://bencho.dev) block "magnetic-dots" to vanilla TypeScript + GSAP for KoKreaters (DESIGN-SPEC v2 9).
 * Original: MIT License, Copyright (c) 2026 Lorenzo Cabra.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 * and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 */
/**
 * Magnetic dots (DESIGN-SPEC v2 7.5, 9): a canvas 2D dot grid (22px) behind the Saffron CTA. Every dot is its own
 * damped spring; the pointer sets a target toward it on a smoothstep falloff to nothing at 180px, leaning ≤ 8px, so the
 * field ripples instead of snapping. An idle "breathing" wave runs only while on screen and not paused. DPR ≤ 2.
 * The <canvas> is aria-hidden; without JS (or under reduced motion) a CSS radial-dot background shows instead.
 */
import { onPause, isPaused } from '../motion/pause';
import { onScreen } from '../motion/lazy';

export default function initMagneticDots(canvas: HTMLCanvasElement): void {
  const ctx2 = canvas.getContext('2d');
  if (!ctx2) return;
  const GAP = 22, R = 180, PULL = 8, K = 120, C = 14;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const color = getComputedStyle(canvas).color || '#3A1C5C';
  type Dot = { rx: number; ry: number; x: number; y: number; vx: number; vy: number };
  let dots: Dot[] = []; let w = 0; let h = 0; let dpr = 1;
  let px = -9999, py = -9999; let visible = false; let raf = 0; let last = 0; let t0 = performance.now();

  const layout = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    dots = [];
    for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) dots.push({ rx: x, ry: y, x, y, vx: 0, vy: 0 });
    draw(0);
  };
  const draw = (time: number) => {
    ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx2.clearRect(0, 0, w, h);
    ctx2.fillStyle = color;
    const breathe = !reduce && !isPaused();
    for (const d of dots) {
      const s = breathe ? 1.6 + .5 * Math.sin(time / 900 + d.rx / 90 + d.ry / 140) : 1.6;
      ctx2.beginPath(); ctx2.arc(d.x, d.y, s, 0, Math.PI * 2); ctx2.fill();
    }
  };
  const step = (now: number) => {
    raf = 0;
    const dt = Math.min(.033, (now - last) / 1000 || .016); last = now;
    let energy = 0;
    for (const d of dots) {
      let tx = d.rx, ty = d.ry;
      const dx = px - d.rx, dy = py - d.ry, dist = Math.hypot(dx, dy);
      if (dist < R && dist > .01) { const u = 1 - dist / R, near = u * u * (3 - 2 * u); tx += (dx / dist) * PULL * near; ty += (dy / dist) * PULL * near; }
      d.vx += (K * (tx - d.x) - C * d.vx) * dt; d.vy += (K * (ty - d.y) - C * d.vy) * dt;
      d.x += d.vx * dt; d.y += d.vy * dt;
      energy += Math.abs(d.vx) + Math.abs(d.vy);
    }
    draw(now - t0);
    if (visible && (energy > .5 || !isPaused())) raf = requestAnimationFrame(step);
  };
  const kick = () => { if (!raf && visible && !reduce) { last = performance.now(); raf = requestAnimationFrame(step); } };
  layout();
  new ResizeObserver(layout).observe(canvas);
  onScreen(canvas, (v) => { visible = v; if (v) kick(); });
  onPause((p) => { if (!p) kick(); else draw(0); });
  if (fine && !reduce) {
    const host = canvas.parentElement ?? canvas;
    host.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; kick(); }, { passive: true });
    host.addEventListener('pointerleave', () => { px = -9999; py = -9999; kick(); });
  }
  canvas.classList.add('is-live');
}
