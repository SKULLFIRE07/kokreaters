/**
 * confetti.ts (DESIGN-SPEC v2 9): paper rectangles in the six pillar colours burst from a point, flutter (a cos flip
 * on one axis), fall with drag, and are gone after 1.6 s. Port of the Bencho "confetti" block (canvas 2D, DPR ≤ 2).
 *
 * MIT License · Copyright (c) 2026 Lorenzo Cabra (bencho.dev). Permission is hereby granted, free of charge, to any
 * person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the
 * Software without restriction, subject to the following condition: the above copyright notice and this permission
 * notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS",
 * WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 */
const COLOURS = ['#2C509E', '#5B2A86', '#C8457E', '#F4C841', '#8C5B88', '#4C9BE8'];
const LIFE = 1.6;

interface Bit { x: number; y: number; vx: number; vy: number; w: number; h: number; a: number; va: number; f: number; vf: number; c: string }

export default function fireConfetti(canvas: HTMLCanvasElement, from: { x: number; y: number }, count = 150): Promise<void> {
  return new Promise((resolve) => {
    const ctx2 = canvas.getContext('2d');
    if (!ctx2) { resolve(); return; }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = window.innerWidth, H = window.innerHeight;
    canvas.hidden = false;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
    const bits: Bit[] = Array.from({ length: count }, () => {
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.95;
      const sp = 520 + Math.random() * 760;
      return { x: from.x, y: from.y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, w: 7 + Math.random() * 7, h: 10 + Math.random() * 9,
        a: Math.random() * Math.PI, va: (Math.random() - 0.5) * 14, f: Math.random() * Math.PI, vf: 6 + Math.random() * 10, c: COLOURS[(Math.random() * COLOURS.length) | 0] };
    });
    let last = performance.now(); const t0 = last;
    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000); last = now;
      const t = (now - t0) / 1000;
      ctx2.clearRect(0, 0, W, H);
      const fade = t > LIFE - 0.4 ? Math.max(0, (LIFE - t) / 0.4) : 1;
      for (const b of bits) {
        b.vx *= 1 - 2.2 * dt; b.vy = b.vy * (1 - 2.2 * dt) + 1400 * dt;
        b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.va * dt; b.f += b.vf * dt;
        ctx2.save(); ctx2.globalAlpha = fade; ctx2.translate(b.x, b.y); ctx2.rotate(b.a); ctx2.scale(1, Math.cos(b.f));
        ctx2.fillStyle = b.c; ctx2.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx2.restore();
      }
      if (t < LIFE) requestAnimationFrame(frame);
      else { ctx2.clearRect(0, 0, W, H); canvas.hidden = true; resolve(); }
    };
    requestAnimationFrame(frame);
  });
}
