/*
 * Ported from Bencho (https://bencho.dev) block "magnetic-letters" to vanilla TypeScript + GSAP for KoKreaters (DESIGN-SPEC v2 9).
 * Original: MIT License, Copyright (c) 2026 Lorenzo Cabra.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 * and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 */
/**
 * magnetic-letters.ts (DESIGN-SPEC v2 9, P-home): letters of the home H1 lean ≤ 10px toward the pointer within 140px
 * (0.5 s power3.out) and spring back with elastic.out(1, .4). Desktop + fine pointer + motion only; the caller gates.
 * The split keeps every element of the H1 (line spans, the swoosh scribble), wraps only text nodes, and moves the
 * words for assistive tech into one visually hidden span, so the accessible name is unchanged.
 */
import type { gsap as GSAP } from 'gsap';

const RADIUS = 140, MAX = 10;

function split(h1: HTMLElement): HTMLElement[] {
  const full = (h1.textContent ?? '').replace(/\s+/g, ' ').trim();
  const visual = document.createElement('span');
  visual.className = 'ml';
  visual.setAttribute('aria-hidden', 'true');
  while (h1.firstChild) visual.appendChild(h1.firstChild);
  const letters: HTMLElement[] = [];
  const walker = document.createTreeWalker(visual, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement?.closest('svg') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const frag = document.createDocumentFragment();
    (node.nodeValue ?? '').split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
      const w = document.createElement('span');
      w.className = 'ml-w';
      for (const ch of part) {
        const c = document.createElement('span');
        c.className = 'ml-c';
        c.textContent = ch;
        w.appendChild(c);
        letters.push(c);
      }
      frag.appendChild(w);
    });
    node.replaceWith(frag);
  }
  const sr = document.createElement('span');
  sr.className = 'visually-hidden';
  sr.textContent = full;
  h1.append(sr, visual);
  return letters;
}

export default function magneticLetters(h1: HTMLElement, gsap: typeof GSAP, isPaused: () => boolean): () => void {
  const original = h1.innerHTML;
  const letters = split(h1);
  h1.classList.add('is-magnetic');
  let centres: { x: number; y: number }[] = [];
  let dirty = true, raf = 0, px = -1e4, py = -1e4;
  const near = new Set<number>();
  const measure = () => {
    centres = letters.map((c) => { const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2 - (Number(gsap.getProperty(c, 'x')) || 0), y: r.top + r.height / 2 - (Number(gsap.getProperty(c, 'y')) || 0) }; });
    dirty = false;
  };
  const frame = () => {
    raf = 0;
    if (dirty) measure();
    letters.forEach((c, i) => {
      const dx = px - centres[i].x, dy = py - centres[i].y, d = Math.hypot(dx, dy);
      if (d < RADIUS && !isPaused()) {
        const f = (1 - d / RADIUS) * MAX;
        gsap.to(c, { x: (dx / (d || 1)) * f, y: (dy / (d || 1)) * f, duration: .5, ease: 'power3.out', overwrite: 'auto' });
        near.add(i);
      } else if (near.has(i)) {
        near.delete(i);
        gsap.to(c, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, .4)', overwrite: 'auto' });
      }
    });
  };
  const onMove = (e: PointerEvent) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(frame); };
  const onLeave = () => { px = py = -1e4; if (!raf) raf = requestAnimationFrame(frame); };
  const onDirty = () => { dirty = true; };
  const zone = h1.closest('section') ?? h1;
  zone.addEventListener('pointermove', onMove as EventListener, { passive: true });
  zone.addEventListener('pointerleave', onLeave);
  window.addEventListener('scroll', onDirty, { passive: true });
  window.addEventListener('resize', onDirty, { passive: true });
  return () => {
    zone.removeEventListener('pointermove', onMove as EventListener);
    zone.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('scroll', onDirty);
    window.removeEventListener('resize', onDirty);
    if (raf) cancelAnimationFrame(raf);
    gsap.killTweensOf(letters);
    h1.classList.remove('is-magnetic');
    h1.innerHTML = original;
  };
}
