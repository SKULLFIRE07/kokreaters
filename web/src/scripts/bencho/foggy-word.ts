/*
 * Ported from Bencho (https://bencho.dev) block "foggy-word" to vanilla TypeScript + GSAP for KoKreaters (DESIGN-SPEC v2 9).
 * Original: MIT License, Copyright (c) 2026 Lorenzo Cabra.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 * and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 */
/** Foggy word (DESIGN-SPEC v2 9): frost texture + the word blurred into it; destination-out stamps wipe it; fog returns
 * with alpha 1 − e^(−dt·3/back) for a few seconds after the last wipe, then the loop sleeps. */
import type { MotionContext } from '../motion/context';
import { onScreen } from '../motion/lazy';

export default function initFog(root: HTMLElement, ctx: MotionContext): void {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');
  const word = root.querySelector<HTMLElement>('.fog__word');
  const g = canvas?.getContext('2d');
  if (!canvas || !word || !g || ctx.reduced) return;
  root.classList.add('is-live');
  const fogTex = document.createElement('canvas');
  let W = 0, H = 0, dpr = 1, cleared = false, raf = 0, lastWipe = 0, last = 0;
  const BACK = 5;
  function paintTex() {
    dpr = Math.min(2, devicePixelRatio || 1);
    const r = canvas!.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas!.width = fogTex.width = Math.round(W * dpr); canvas!.height = fogTex.height = Math.round(H * dpr);
    const t = fogTex.getContext('2d')!;
    t.setTransform(dpr, 0, 0, dpr, 0, 0);
    t.fillStyle = 'rgba(214,226,250,0.86)'; t.beginPath(); t.roundRect(0, 0, W, H, 14); t.fill();
    let s = 3;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = 0; i < 70; i++) {                      // frost crystals and droplets
      const x = rnd() * W, y = rnd() * H, rr = 2 + rnd() * 16;
      const gr = t.createRadialGradient(x, y, 0, x, y, rr);
      gr.addColorStop(0, `rgba(255,255,255,${(.35 + rnd() * .4).toFixed(2)})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
      t.fillStyle = gr; t.beginPath(); t.arc(x, y, rr, 0, Math.PI * 2); t.fill();
    }
    const cs = getComputedStyle(word!);
    t.filter = 'blur(9px)'; t.fillStyle = 'rgba(58,28,92,.55)';
    t.font = `${cs.fontWeight} ${cs.fontStretch === '75%' ? 'condensed ' : ''}${cs.fontSize} ${cs.fontFamily}`;
    t.textBaseline = 'middle';
    t.fillText(word!.textContent ?? '', 18, H / 2 + 4);
    t.filter = 'none';
    g!.setTransform(1, 0, 0, 1, 0, 0); g!.clearRect(0, 0, canvas!.width, canvas!.height); g!.drawImage(fogTex, 0, 0);
  }
  function wipe(x: number, y: number, r = 46) {
    g!.save(); g!.setTransform(dpr, 0, 0, dpr, 0, 0);
    g!.globalCompositeOperation = 'destination-out';
    const gr = g!.createRadialGradient(x, y, r * .45, x, y, r);
    gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g!.fillStyle = gr; g!.beginPath(); g!.arc(x, y, r, 0, Math.PI * 2); g!.fill();
    g!.restore();
    lastWipe = performance.now();
    if (!raf && !cleared) { last = lastWipe; raf = requestAnimationFrame(tick); }
  }
  function tick(now: number) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (cleared || ctx.paused || now - lastWipe > 6000) { raf = 0; return; }
    if (now - lastWipe > 700) {                         // steams back after a pause
      g!.save(); g!.globalAlpha = (1 - Math.exp(-dt * 3 / BACK)) * .5; g!.drawImage(fogTex, 0, 0); g!.restore();
    }
    raf = requestAnimationFrame(tick);
  }
  function clearAll() {
    if (cleared) return; cleared = true;
    ctx.gsap.to(canvas!, { opacity: 0, duration: 1.1, ease: 'power2.out', onComplete: () => root.classList.remove('is-live') });
  }
  paintTex();
  document.fonts?.ready.then(paintTex).catch(() => {});
  let rt = 0;
  window.addEventListener('resize', () => { window.clearTimeout(rt); rt = window.setTimeout(() => { if (!cleared) paintTex(); }, 200); }, { passive: true });
  if (ctx.fine) {
    root.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      wipe(e.clientX - r.left, e.clientY - r.top);
    });
  } else {
    let t = 0;
    const stop = onScreen(root, (v) => { window.clearTimeout(t); if (v) t = window.setTimeout(() => { clearAll(); stop(); }, 1200); }, '-20% 0px');
  }
  root.closest('article')?.addEventListener('focusin', clearAll);
}
