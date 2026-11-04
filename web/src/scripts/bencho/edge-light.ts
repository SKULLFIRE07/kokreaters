/*
 * Ported from Bencho (https://bencho.dev) block "edge-light" to vanilla TypeScript + GSAP for KoKreaters (DESIGN-SPEC v2 9).
 * Original: MIT License, Copyright (c) 2026 Lorenzo Cabra.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 * and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 */
/**
 * R11 Edge light (DESIGN-SPEC v2 8.3, 9): [data-edge-light]. Pointer-fine only. A soft Saffron rim light (a stack of
 * shadows inside and outside the border) cut by a narrow cone that turns to face the pointer; it brightens as the
 * pointer nears the rim. Lerped (0.25 s). Decorative; no layout.
 */
import { gsap } from 'gsap';

const LAYERS: [number, number, number, boolean][] = [[0, 1.5, 100, true], [6, 0, 70, true], [14, 0, 40, false], [28, 2, 22, false], [50, 4, 10, false]];
const SHADOW = LAYERS.map(([blur, spread, a, inset]) => `${inset ? 'inset ' : ''}0 0 ${blur}px ${spread}px rgb(244 200 65 / ${a}%)`).join(', ');

export function initEdgeLight(root: ParentNode = document): void {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  root.querySelectorAll<HTMLElement>('[data-edge-light]').forEach((el) => {
    if (el.querySelector(':scope > .edge-light__glow')) return;
    const glow = document.createElement('span');
    glow.className = 'edge-light__glow';
    glow.setAttribute('aria-hidden', 'true');
    glow.style.boxShadow = SHADOW;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.append(glow);
    const st = { a: 0, o: 0 };
    const apply = () => {
      glow.style.opacity = String(st.o);
      const m = `conic-gradient(from ${st.a}deg at center, #000 2.5%, transparent 12%, transparent 88%, #000 97.5%)`;
      glow.style.setProperty('-webkit-mask-image', m); glow.style.setProperty('mask-image', m);
    };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.width / 2, cy = r.height / 2, dx = e.clientX - r.left - cx, dy = e.clientY - r.top - cy;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      const near = 1 / Math.min(cx / (Math.abs(dx) || 1e-3), cy / (Math.abs(dy) || 1e-3));   // 1 on the rim
      let a = angle; const d = a - st.a; a = st.a + ((d + 540) % 360) - 180;               // shortest turn
      gsap.to(st, { a, o: Math.max(.25, Math.min(1, (near * 100 - 30) / 70)), duration: .25, ease: 'power2.out', onUpdate: apply, overwrite: true });
    });
    el.addEventListener('pointerleave', () => gsap.to(st, { o: 0, duration: .4, onUpdate: apply, overwrite: true }));
  });
}
export default initEdgeLight;
