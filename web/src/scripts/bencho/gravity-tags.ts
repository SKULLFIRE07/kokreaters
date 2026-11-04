/*
 * Ported from Bencho (https://bencho.dev) block "gravity-tags" to vanilla TypeScript + GSAP for KoKreaters (DESIGN-SPEC v2 9).
 * Original: MIT License, Copyright (c) 2026 Lorenzo Cabra.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 * and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 */
/**
 * gravity-tags.ts (DESIGN-SPEC v2 9, P-home): the industry pills fall into their box once (staggered from above), pile,
 * and can be dragged and thrown (FOUNDATION physics.ts). A click without a drag follows the link as normal; a drag
 * suppresses the click. Double-click follows the link too. Keyboard: Tab focuses each link in DOM order; focus wakes that
 * pill and nudges it up so the ring is visible. Renders only while on screen and not paused. Returns a disposer.
 */
import { World, type Body } from './physics';

export default function gravityTags(root: HTMLElement, isPaused: () => boolean): () => void {
  const tags = Array.from(root.querySelectorAll<HTMLAnchorElement>('.gtags__tag'));
  if (!tags.length) return () => {};
  const sizes = tags.map((t) => ({ w: t.offsetWidth, h: t.offsetHeight }));
  let W = root.clientWidth, H = root.clientHeight;
  root.classList.add('is-live');
  const world = new World({ width: W, height: H, gravity: 2200, restitution: .25, friction: .5 });
  const bodies: Body[] = tags.map((_t, i) => {
    const s = sizes[i];
    const x = Math.min(W - s.w / 2 - 8, Math.max(s.w / 2 + 8, (W * (.15 + ((i * 37) % 70) / 100))));
    return world.add({ x, y: -80 - i * 70, width: s.w, height: s.h, angle: ((i % 5) - 2) * .12, data: i });
  });
  // the pills start above the box; let them fall in
  world.ceiling = false;
  let raf = 0, last = 0, onScreen = false, dragged = false, downAt = { x: 0, y: 0 }, held: Body | null = null;
  const place = () => {
    bodies.forEach((b, i) => {
      const s = sizes[i];
      tags[i].style.transform = `translate(${(b.x - s.w / 2).toFixed(1)}px, ${(b.y - s.h / 2).toFixed(1)}px) rotate(${b.a.toFixed(3)}rad)`;
    });
  };
  const frame = (t: number) => {
    raf = 0;
    const dt = last ? Math.min(1 / 20, (t - last) / 1000) : 1 / 60;
    last = t;
    // step() reports false on a frame too short for a 60 Hz sub-step, so ask the bodies directly
    const awake = world.step(dt) || bodies.some((b) => !b.asleep);
    place();
    if (bodies.every((b) => b.y > 0)) world.ceiling = true;
    if ((awake || held) && onScreen && !isPaused()) raf = requestAnimationFrame(frame);
    else last = 0;
  };
  const wake = () => { if (!raf && onScreen && !isPaused()) raf = requestAnimationFrame(frame); };
  place();

  const local = (e: PointerEvent) => { const r = root.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const onDown = (e: PointerEvent) => {
    const i = tags.indexOf((e.target as Element).closest('.gtags__tag') as HTMLAnchorElement);
    if (i < 0) return;
    const p = local(e);
    held = bodies[i]; dragged = false; downAt = p;
    world.grab(held, p.x, p.y);
    root.setPointerCapture(e.pointerId);
    e.preventDefault();
    wake();
  };
  const onMove = (e: PointerEvent) => {
    if (!held) return;
    const p = local(e);
    if (Math.hypot(p.x - downAt.x, p.y - downAt.y) > 6) dragged = true;
    world.drag(p.x, p.y);
    wake();
  };
  const onUp = (e: PointerEvent) => {
    if (!held) return;
    world.release(); held = null;
    root.releasePointerCapture?.(e.pointerId);
    wake();
  };
  const onClick = (e: MouseEvent) => { if (dragged) { e.preventDefault(); dragged = false; } };
  const onDbl = (e: MouseEvent) => { const a = (e.target as Element).closest('a'); if (a) window.location.href = a.href; };
  const onFocus = (e: FocusEvent) => {
    const i = tags.indexOf(e.target as HTMLAnchorElement);
    if (i < 0) return;
    const b = bodies[i];
    b.vy = -600; b.asleep = false; b.idle = 0; wake();
  };
  root.addEventListener('pointerdown', onDown);
  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerup', onUp);
  root.addEventListener('pointercancel', onUp);
  root.addEventListener('click', onClick, true);
  root.addEventListener('dblclick', onDbl);
  root.addEventListener('focusin', onFocus);
  const io = new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; if (onScreen) wake(); }, { threshold: .2 });
  io.observe(root);
  const ro = new ResizeObserver(() => { W = root.clientWidth; H = root.clientHeight; world.resize(W, H); wake(); });
  ro.observe(root);
  return () => {
    if (raf) cancelAnimationFrame(raf);
    io.disconnect(); ro.disconnect();
    root.removeEventListener('pointerdown', onDown);
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerup', onUp);
    root.removeEventListener('pointercancel', onUp);
    root.removeEventListener('click', onClick, true);
    root.removeEventListener('dblclick', onDbl);
    root.removeEventListener('focusin', onFocus);
    root.classList.remove('is-live');
    tags.forEach((t) => { t.style.transform = ''; });
  };
}
