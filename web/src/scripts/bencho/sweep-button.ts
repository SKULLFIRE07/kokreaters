/*
 * Ported from Bencho (https://bencho.dev) block "sweep-button" to vanilla TypeScript + GSAP for KoKreaters (DESIGN-SPEC v2 9).
 * Original: MIT License, Copyright (c) 2026 Lorenzo Cabra.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 * and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 */
/**
 * Sweep button (DESIGN-SPEC v2 7.7, 9): CSS-first (ui/Button.astro: a registered --sweep angle turns a conic mask so
 * the --pill-sweep colour sweeps round from the edge the pointer entered, then floods). JS only sets the entry angle.
 * Focus-visible runs the same sweep from the top.
 */
export function initSweep(): void {
  const set = (e: PointerEvent) => {
    const b = (e.target as Element | null)?.closest?.<HTMLElement>('.btn--sweep');
    if (!b) return;
    const r = b.getBoundingClientRect();
    const a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI + 90;
    b.style.setProperty('--sweep-from', `${Math.round(a)}deg`);
  };
  document.addEventListener('pointerover', set as EventListener, { passive: true });
}
