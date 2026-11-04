/*
 * Ported from Bencho (https://bencho.dev) block "crumple" to vanilla TypeScript + GSAP for KoKreaters (DESIGN-SPEC v2 9).
 * Original: MIT License, Copyright (c) 2026 Lorenzo Cabra.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 * and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 */
/**
 * Crumple (DESIGN-SPEC v2 9): the paper is redrawn onto a canvas as a textured triangle mesh (cols × rows). Two mixes
 * run on one clock: flat → creased (still sheet-sized), then creased → ball, running out from where you pressed.
 * Then the ball drops with gravity, bounces on the floor and rolls off to the right. "Smooth it out" brings it back
 * and un-crumples it. Reduced motion: instant (the paper hides, the note shows). Keyboard: the real <button>.
 */
import type { MotionContext } from '../motion/context';

type V = [number, number];
const COLS = 9, ROWS = 11;
const smooth = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
const mix = (a: V, b: V, t: number): V => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

export default function initCrumple(root: HTMLElement, ctx: MotionContext): void {
  const stage = root.querySelector<HTMLElement>('.crumple__stage');
  const paper = root.querySelector<HTMLElement>('[data-crumple-paper]');
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');
  const btn = root.querySelector<HTMLButtonElement>('[data-crumple-btn]');
  const label = root.querySelector<HTMLElement>('[data-crumple-label]');
  if (!stage || !paper || !canvas || !btn || !label) return;
  const g = canvas.getContext('2d');
  if (!g) return;
  const instant = () => ctx.reduced || matchMedia('(prefers-reduced-motion: reduce)').matches;
  // reduced motion keeps the static state (strike + note visible); the button still works, instantly
  if (!instant()) root.classList.add('is-live');
  btn.hidden = false;
  let state: 'flat' | 'busy' | 'done' = 'flat';
  let raf = 0;

  // ── texture: the paper as it looks in the DOM (rotation removed), drawn once per run ──
  const tex = document.createElement('canvas');
  let W = 0, H = 0, dpr = 1, PW = 0, PH = 0, ox = 0, oy = 0, rot = 0;
  function measure() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const sr = stage!.getBoundingClientRect();
    W = sr.width; H = sr.height;
    canvas!.width = Math.round(W * dpr); canvas!.height = Math.round(H * dpr);
    PW = paper!.offsetWidth; PH = paper!.offsetHeight;
    ox = paper!.offsetLeft - PW / 2; oy = paper!.offsetTop - PH / 2;          // translate -50% -50%
    rot = (parseFloat(getComputedStyle(paper!).rotate) || 0) * Math.PI / 180;
    tex.width = Math.round(PW * dpr); tex.height = Math.round(PH * dpr);
    const t = tex.getContext('2d')!;
    t.setTransform(dpr, 0, 0, dpr, 0, 0);
    t.fillStyle = '#fff'; t.fillRect(0, 0, PW, PH);
    const pr = paper!.getBoundingClientRect();
    const cs = getComputedStyle(paper!);
    // child boxes, measured unrotated via offsets
    paper!.querySelectorAll<HTMLElement>('.crumple__title, .crumple__line').forEach((el) => {
      t.fillStyle = getComputedStyle(el).backgroundColor; t.globalAlpha = parseFloat(getComputedStyle(el).opacity) || 1;
      t.beginPath(); t.roundRect(el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight, 3); t.fill();
    });
    t.globalAlpha = 1;
    const f = paper!.querySelector<HTMLElement>('.crumple__file');
    if (f) {
      const fs = getComputedStyle(f);
      t.fillStyle = fs.color; t.font = `${fs.fontWeight} ${fs.fontSize} ${fs.fontFamily}`; t.textBaseline = 'top';
      t.fillText(f.textContent ?? '', f.offsetLeft, f.offsetTop + 2);
      t.fillRect(f.offsetLeft, f.offsetTop + f.offsetHeight - 2, f.offsetWidth, 2);
    }
    t.strokeStyle = cs.borderTopColor; t.lineWidth = 2; t.strokeRect(1, 1, PW - 2, PH - 2);
    void pr;
  }

  // ── mesh ──
  let flat: V[] = [], creased: V[] = [], ball: V[] = [], src: V[] = [], dist: number[] = [];
  function build(px: number, py: number) {
    flat = []; creased = []; ball = []; src = []; dist = [];
    const cx = ox + PW / 2, cy = oy + PH / 2, R = Math.min(PW, PH) * .2;
    const cos = Math.cos(rot), sin = Math.sin(rot);
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let j = 0; j <= ROWS; j++) for (let i = 0; i <= COLS; i++) {
      const u = i / COLS, v = j / ROWS;
      const lx = (u - .5) * PW, ly = (v - .5) * PH;
      src.push([u * PW, v * PH]);
      const f: V = [cx + lx * cos - ly * sin, cy + lx * sin + ly * cos];
      flat.push(f);
      const edge = (i === 0 || j === 0 || i === COLS || j === ROWS) ? 1.4 : 1;
      creased.push([cx + (f[0] - cx) * .86 + (rnd() - .5) * 34 * edge, cy + (f[1] - cy) * .86 + (rnd() - .5) * 34 * edge]);
      const lon = (u - .5) * Math.PI * 1.7 + (rnd() - .5) * .5, lat = (v - .5) * Math.PI * .95 + (rnd() - .5) * .4;
      const rr = R * (.82 + rnd() * .3);
      ball.push([Math.sin(lon) * Math.cos(lat) * rr, Math.sin(lat) * rr]);
      dist.push(Math.hypot(f[0] - px, f[1] - py) / Math.hypot(PW, PH));
    }
  }
  const idx = (i: number, j: number) => j * (COLS + 1) + i;

  function draw(pos: V[], shadeAmt: number) {
    g!.setTransform(dpr, 0, 0, dpr, 0, 0);
    g!.clearRect(0, 0, W, H);
    for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
      const a = idx(i, j), b = idx(i + 1, j), c = idx(i, j + 1), d = idx(i + 1, j + 1);
      tri(pos, a, b, c, shadeAmt, (i + j) % 2 ? .6 : 1);
      tri(pos, b, d, c, shadeAmt, (i + j) % 2 ? 1 : .55);
    }
  }
  function tri(pos: V[], a: number, b: number, c: number, sh: number, facet: number) {
    const [x0, y0] = pos[a], [x1, y1] = pos[b], [x2, y2] = pos[c];
    const [u0, v0] = src[a], [u1, v1] = src[b], [u2, v2] = src[c];
    const det = (u1 - u0) * (v2 - v0) - (u2 - u0) * (v1 - v0);
    if (!det) return;
    const A = ((x1 - x0) * (v2 - v0) - (x2 - x0) * (v1 - v0)) / det;
    const B = ((y1 - y0) * (v2 - v0) - (y2 - y0) * (v1 - v0)) / det;
    const C = ((x2 - x0) * (u1 - u0) - (x1 - x0) * (u2 - u0)) / det;
    const D = ((y2 - y0) * (u1 - u0) - (y1 - y0) * (u2 - u0)) / det;
    const E = x0 - A * u0 - C * v0, F = y0 - B * u0 - D * v0;
    // expand the clip a hair so seams do not show
    const mx = (x0 + x1 + x2) / 3, my = (y0 + y1 + y2) / 3, k = 1.04;
    g!.save();
    g!.beginPath();
    g!.moveTo(mx + (x0 - mx) * k, my + (y0 - my) * k); g!.lineTo(mx + (x1 - mx) * k, my + (y1 - my) * k); g!.lineTo(mx + (x2 - mx) * k, my + (y2 - my) * k);
    g!.closePath(); g!.clip();
    g!.transform(A, B, C, D, E, F);
    g!.drawImage(tex, 0, 0, tex.width, tex.height, 0, 0, PW, PH);
    g!.restore();
    if (sh > 0) {
      const area = ((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)) / det;   // < 1 when compressed, < 0 when flipped
      const s = Math.min(.34, sh * ((1 - Math.min(1, Math.abs(area))) * .32 + (area < 0 ? .16 : 0) + (1 - facet) * .3));
      g!.fillStyle = `rgba(18,24,51,${s.toFixed(3)})`;
      g!.beginPath(); g!.moveTo(x0, y0); g!.lineTo(x1, y1); g!.lineTo(x2, y2); g!.closePath(); g!.fill();
    }
  }

  function crumpleAt(px: number, py: number) {
    measure(); build(px, py);
    state = 'busy'; root.classList.add('is-busy'); root.classList.remove('is-done');
    btn!.disabled = true;
    const cx = ox + PW / 2, cy = oy + PH / 2, R = Math.min(PW, PH) * .2;
    const t0 = performance.now();
    let phase: 'fold' | 'fall' = 'fold';
    let bx = cx, by = cy, vx = 0, vy = 0, spin = 0, last = t0;
    const floor = H - R - 6;
    const step = (now: number) => {
      const dt = Math.min(.033, (now - last) / 1000); last = now;
      if (phase === 'fold') {
        const t = Math.min(1, (now - t0) / 900);
        const s1 = smooth(t / .5);
        const pos = flat.map((f, i) => {
          const p = mix(f, creased[i], s1);
          const k = smooth(((t - .3) / .7) * 1.4 - dist[i] * .4);
          return mix(p, [cx + ball[i][0], cy + ball[i][1]], k);
        });
        draw(pos, Math.min(1, t * 1.6));
        if (t >= 1) { phase = 'fall'; vx = 260; vy = -120; }
      } else {
        vy += 2200 * dt; bx += vx * dt; by += vy * dt;
        if (by > floor) { by = floor; vy = -Math.abs(vy) * .42; vx *= .96; if (Math.abs(vy) < 60) vy = 0; vx += 140 * dt * 6; }
        spin += (vx * dt) / R;
        const c = Math.cos(spin), s = Math.sin(spin);
        draw(ball.map((p) => [bx + p[0] * c - p[1] * s, by + p[0] * s + p[1] * c] as V), 1);
        if (bx - R > W + 20) { finish(); return; }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  function finish() {
    g!.setTransform(1, 0, 0, 1, 0, 0); g!.clearRect(0, 0, canvas!.width, canvas!.height);
    state = 'done'; root.classList.remove('is-busy'); root.classList.add('is-done');
    label!.textContent = root.dataset.labelReset ?? 'Smooth it out';
    btn!.setAttribute('aria-pressed', 'true'); btn!.disabled = false;
  }
  function smoothOut() {
    cancelAnimationFrame(raf);
    root.classList.remove('is-done');
    label!.textContent = root.dataset.labelCrumple ?? 'Crumple it';
    btn!.setAttribute('aria-pressed', 'false');
    if (instant() || !flat.length) { state = 'flat'; root.classList.remove('is-busy'); return; }
    state = 'busy'; root.classList.add('is-busy'); btn!.disabled = true;
    const cx = ox + PW / 2, cy = oy + PH / 2;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 750);
      const e = 1 - Math.pow(1 - t, 3);
      const pos = flat.map((f, i) => mix(mix([cx + ball[i][0], cy + ball[i][1]], creased[i], smooth(e * 1.6)), f, smooth((e - .45) / .55)));
      draw(pos, 1 - e);
      if (t < 1) raf = requestAnimationFrame(step);
      else { state = 'flat'; root.classList.remove('is-busy'); btn!.disabled = false; }
    };
    raf = requestAnimationFrame(step);
  }
  function crumple(px?: number, py?: number) {
    if (state !== 'flat') return;
    if (instant()) { state = 'done'; root.classList.add('is-done'); label!.textContent = root.dataset.labelReset ?? 'Smooth it out'; btn!.setAttribute('aria-pressed', 'true'); return; }
    const sr = stage!.getBoundingClientRect();
    crumpleAt(px ?? sr.width / 2, py ?? sr.height / 2);
  }
  btn.addEventListener('click', () => { if (state === 'flat') crumple(); else if (state === 'done') smoothOut(); });
  paper.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    const sr = stage.getBoundingClientRect();
    crumple(e.clientX - sr.left, e.clientY - sr.top);
  });
}
