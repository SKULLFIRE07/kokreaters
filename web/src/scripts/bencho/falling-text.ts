/**
 * falling-text.ts (DESIGN-SPEC v2 9): the 404 word pit. Port of the Bencho "falling-text" block to vanilla TS on
 * scripts/bencho/physics.ts. Tiles drop in from above when the pit comes into view, pile, and can be grabbed and
 * thrown with the pointer (touch too). The loop sleeps when everything rests, stops off-screen and on Pause motion.
 *
 * MIT License · Copyright (c) 2026 Lorenzo Cabra (bencho.dev). Permission is hereby granted, free of charge, to any
 * person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the
 * Software without restriction, subject to the following condition: the above copyright notice and this permission
 * notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS",
 * WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 */
import { World, type Body } from './physics';
import type { MotionContext } from '../motion/context';

export default function initFallingText(root: HTMLElement, ctx: MotionContext): () => void {
  const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-tile]'));
  if (!tiles.length) return () => {};
  const ac = new AbortController();
  const sig = { signal: ac.signal };
  const sizes = tiles.map((t) => ({ w: t.offsetWidth, h: t.offsetHeight }));
  let W = root.clientWidth, H = root.clientHeight;
  const world = new World({ width: W, height: H, ceiling: true, restitution: 0.3, friction: 0.5 });
  root.classList.add('is-live');
  const bodies: Body[] = tiles.map((t, i) => {
    const { w, h } = sizes[i];
    const x = Math.min(W - w / 2 - 4, Math.max(w / 2 + 4, W * (0.2 + 0.6 * ((i * 0.37) % 1))));
    return world.add({ x, y: -60 - i * 70, width: w, height: h, angle: (Math.random() - 0.5) * 0.9, data: t });
  });
  // bodies start above the pit: let them fall in through the open top, then close it
  world.ceiling = false;
  const render = () => {
    bodies.forEach((b, i) => {
      const { w, h } = sizes[i];
      tiles[i].style.transform = `translate3d(${(b.x - w / 2).toFixed(1)}px, ${(b.y - h / 2).toFixed(1)}px, 0) rotate(${b.a.toFixed(3)}rad)`;
    });
  };
  render();

  let raf = 0, visible = false, last = 0, closed = false;
  const tick = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    const awake = world.step(dt);
    if (!closed && bodies.every((b) => b.y > b.r)) { world.ceiling = true; closed = true; }
    render();
    if ((awake || !closed) && visible && !ctx.paused) raf = requestAnimationFrame(tick);
  };
  const run = () => { if (!raf && visible && !ctx.paused) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  const io = new IntersectionObserver((es) => { visible = es.some((e) => e.isIntersecting); if (visible) run(); });
  io.observe(root);
  ctx.onPause(() => { if (!ctx.paused) run(); });

  const local = (e: PointerEvent) => { const r = root.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
  let held = false;
  root.addEventListener('pointerdown', (e) => {
    const [x, y] = local(e);
    const b = world.hit(x, y);
    if (!b) return;
    e.preventDefault();
    held = true; root.setPointerCapture(e.pointerId);
    world.grab(b, x, y); run();
  }, sig);
  root.addEventListener('pointermove', (e) => { if (!held) return; const [x, y] = local(e); world.drag(x, y); run(); }, sig);
  const up = () => { if (!held) return; held = false; world.release(); run(); };
  root.addEventListener('pointerup', up, sig);
  root.addEventListener('pointercancel', up, sig);
  const ro = new ResizeObserver(() => { W = root.clientWidth; H = root.clientHeight; world.resize(W, H); run(); });
  ro.observe(root);

  return () => { ac.abort(); io.disconnect(); ro.disconnect(); if (raf) cancelAnimationFrame(raf); };
}
