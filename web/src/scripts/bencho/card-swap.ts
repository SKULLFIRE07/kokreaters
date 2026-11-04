/*
 * Ported from Bencho (https://bencho.dev) block "card-swap" to vanilla TypeScript + GSAP for KoKreaters (DESIGN-SPEC v2 9).
 * Original: MIT License, Copyright (c) 2026 Lorenzo Cabra.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 * and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 */
/** Card swap (DESIGN-SPEC v2 9): slots are fixed transforms; the order array is the only state. Drag: only the
 * grabbed front card moves, on a rubber band; a far or quick drag sends it to the back, a short one springs back.
 * Keyboard: the "Next card" button, ← / → inside the stack, and focus brings a card forward. */
let STEP = 26;
const slot = (k: number) => `translate3d(${k * STEP}px, ${-k * (STEP - 2)}px, 0) rotate(${[-2, 3, -3.5, 2.5][k] ?? 0}deg) scale(${Math.pow(.94, k).toFixed(3)})`;

export default function initCardSwap(root: HTMLElement): void {
  const list = root.querySelector<HTMLElement>('.csw__list');
  const next = root.querySelector<HTMLButtonElement>('[data-csw-next]');
  if (!list || !next) return;
  const cards = Array.from(list.children) as HTMLElement[];
  if (cards.length < 2) return;
  root.classList.add('is-live');
  next.hidden = false;
  let order = cards.map((_, i) => i);
  const fit = () => {
    STEP = root.clientWidth < 480 ? 12 : 26;
    list.style.removeProperty('--csw-h');
    const h = Math.max(...cards.map((c) => { c.style.height = 'auto'; const v = c.scrollHeight; c.style.height = ''; return v; }));
    list.style.setProperty('--csw-h', `${Math.ceil(h)}px`);
  };
  const paint = () => {
    order.forEach((ci, k) => {
      const c = cards[ci];
      c.style.setProperty('--t', slot(k));
      c.style.zIndex = String(cards.length - k);
      c.toggleAttribute('data-front', k === 0);
      c.style.transform = '';
    });
  };
  const swap = () => { order = [...order.slice(1), order[0]]; paint(); };
  const back = () => { order = [order[order.length - 1], ...order.slice(0, -1)]; paint(); };
  fit(); paint();
  window.addEventListener('resize', () => { fit(); paint(); }, { passive: true });
  next.addEventListener('click', swap);
  list.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); swap(); cards[order[0]].querySelector<HTMLElement>('a')?.focus(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); back(); cards[order[0]].querySelector<HTMLElement>('a')?.focus(); }
  });
  list.addEventListener('focusin', (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('.csw__list > *');
    const ci = li ? cards.indexOf(li) : -1;
    if (ci < 0 || order[0] === ci) return;
    const k = order.indexOf(ci);
    order = [...order.slice(k), ...order.slice(0, k)]; paint();
  });
  // drag + fling (pointer events, rubber band)
  let drag: null | { el: HTMLElement; id: number; x: number; y: number; dx: number; dy: number; t: number } = null;
  let moved = false;
  const rub = (d: number) => 160 * Math.tanh(d / 160);
  list.addEventListener('pointerdown', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('.csw__list > *');
    if (!el || !el.hasAttribute('data-front') || e.button !== 0 || drag) return;
    drag = { el, id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, dy: 0, t: performance.now() };
    moved = false;
    el.classList.add('is-dragging');
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  });
  function mv(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.x; drag.dy = e.clientY - drag.y;
    if (Math.hypot(drag.dx, drag.dy) > 6) moved = true;
    const x = rub(drag.dx), y = rub(drag.dy);
    drag.el.style.transform = `${slot(0)} translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(x * .06).toFixed(2)}deg)`;
  }
  function up(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
    d.el.classList.remove('is-dragging');
    const far = Math.hypot(d.dx, d.dy);
    const quick = far / Math.max(1, performance.now() - d.t) > .6;
    if (e.type !== 'pointercancel' && (far > 70 || (quick && far > 24))) swap(); else d.el.style.transform = '';
  }
  // a drag must not follow the link it started on
  list.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  list.addEventListener('dragstart', (e) => e.preventDefault());
}
