/*
 * Ported from Bencho (https://bencho.dev) block "spec-inspector" to vanilla TypeScript + GSAP for KoKreaters (DESIGN-SPEC v2 9).
 * Original: MIT License, Copyright (c) 2026 Lorenzo Cabra.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 * and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
/**
 * Spec inspector (DESIGN-SPEC v2 9, 10.3 F2). Loaded lazily by pages/expertise.ts. Works in every motion mode (it is a
 * toy driven by the reader, not ambient motion); under reduced motion the frame jumps instead of easing.
 *  - The toggle (shown by this script) opens / closes the frame; aria-pressed + label swap.
 *  - Pointer: drag the frame (clamped to the label). Keyboard: arrows move it 16px while the toggle has focus; Esc closes.
 *  - Touch / coarse pointer: the frame covers the whole label (a tap on the toggle = blueprint on / off).
 *  - The lens holds an aria-hidden, inert clone of the label, offset so it lines up with the original underneath.
 *  - Captions: "{n} items" + "fig. 0n" and the frame's live size in px, measured off the real layout.
 */
export default function initSpecInspector(root: HTMLElement, reduced: boolean): () => void {
  const target = root.querySelector<HTMLElement>('[data-spi-target]');
  const label = target?.querySelector<HTMLElement>('.spec');
  const frame = root.querySelector<HTMLElement>('[data-spi-frame]');
  const lens = root.querySelector<HTMLElement>('[data-spi-lens]');
  const toggle = root.querySelector<HTMLButtonElement>('[data-spi-toggle]');
  const text = root.querySelector<HTMLElement>('[data-spi-label]');
  const capTop = root.querySelector<HTMLElement>('[data-spi-cap-top]');
  const capSide = root.querySelector<HTMLElement>('[data-spi-cap-side]');
  if (!target || !label || !frame || !lens || !toggle || !text) return () => {};

  const coarse = !matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clone = label.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id'); clone.removeAttribute('aria-labelledby'); clone.removeAttribute('data-spec-inspect');
  clone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  clone.setAttribute('aria-hidden', 'true'); clone.setAttribute('inert', '');
  lens.append(clone);
  toggle.hidden = false;

  let open = false, x = 0, y = 0, fw = 220, fh = 160;
  const offset = () => ({ left: label.offsetLeft, top: label.offsetTop, w: label.offsetWidth, h: label.offsetHeight });
  const place = (nx: number, ny: number, ease = false) => {
    const o = offset();
    x = Math.max(o.left - 16, Math.min(o.left + o.w - fw + 16, nx));
    y = Math.max(o.top - 16, Math.min(o.top + o.h - fh + 16, ny));
    frame.style.transition = ease && !reduced ? 'translate .35s cubic-bezier(.16,1,.3,1)' : 'none';
    frame.style.translate = `${x}px ${y}px`;
    clone.style.width = `${o.w}px`;
    clone.style.rotate = getComputedStyle(label).rotate;
    clone.style.translate = `${o.left - x - 2}px ${o.top - y - 2}px`;
    if (capTop) capTop.textContent = [root.dataset.fig, root.dataset.items].filter(Boolean).join(' · ');
    if (capSide) capSide.textContent = `${Math.round(fw)} × ${Math.round(fh)} px`;
  };
  const size = () => {
    const o = offset();
    if (coarse) { fw = o.w + 8; fh = o.h + 8; root.classList.add('spi--full'); }
    else { fw = Math.min(220, o.w); fh = Math.min(160, o.h); }
    frame.style.width = `${fw}px`; frame.style.height = `${fh}px`;
  };
  const setOpen = (v: boolean) => {
    open = v;
    frame.hidden = !v;
    toggle.setAttribute('aria-pressed', String(v));
    text.textContent = v ? (root.dataset.closeLabel ?? '') : (root.dataset.openLabel ?? '');
    if (v) { size(); const o = offset(); place(coarse ? o.left - 4 : o.left + o.w * .35, coarse ? o.top - 4 : o.top + o.h * .25); }
  };
  const onToggle = () => setOpen(!open);
  const onKey = (e: KeyboardEvent) => {
    if (!open) return;
    const step = e.shiftKey ? 48 : 16;
    const d: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (d[e.key] && !coarse) { e.preventDefault(); place(x + d[e.key][0], y + d[e.key][1], true); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
  };
  let drag: { px: number; py: number; x: number; y: number } | null = null;
  const down = (e: PointerEvent) => {
    if (coarse) return;
    drag = { px: e.clientX, py: e.clientY, x, y };
    frame.setPointerCapture(e.pointerId); frame.classList.add('is-drag');
  };
  const move = (e: PointerEvent) => { if (drag) place(drag.x + e.clientX - drag.px, drag.y + e.clientY - drag.py); };
  const up = () => { drag = null; frame.classList.remove('is-drag'); };
  const onResize = () => { if (open) { size(); place(x, y); } };
  const onDocKey = (e: KeyboardEvent) => { if (open && e.key === 'Escape' && !toggle.matches(':focus')) setOpen(false); };

  toggle.addEventListener('click', onToggle);
  toggle.addEventListener('keydown', onKey);
  frame.addEventListener('pointerdown', down);
  frame.addEventListener('pointermove', move);
  frame.addEventListener('pointerup', up);
  frame.addEventListener('pointercancel', up);
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('keydown', onDocKey);
  return () => {
    toggle.removeEventListener('click', onToggle); toggle.removeEventListener('keydown', onKey);
    frame.removeEventListener('pointerdown', down); frame.removeEventListener('pointermove', move);
    frame.removeEventListener('pointerup', up); frame.removeEventListener('pointercancel', up);
    window.removeEventListener('resize', onResize); document.removeEventListener('keydown', onDocKey);
    clone.remove(); toggle.hidden = true; frame.hidden = true;
  };
}
