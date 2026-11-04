/*
 * Ported from Bencho (https://bencho.dev) block "flap-board" to vanilla TypeScript + GSAP for KoKreaters (DESIGN-SPEC v2 9).
 * Original: MIT License, Copyright (c) 2026 Lorenzo Cabra.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 * and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 */
/**
 * Flap board (DESIGN-SPEC v2 9): a split-flap departures board cycling entries (e.g. "INDIA · WILMAR"). Each tile is two
 * halves; a step drops two flaps over them (the old top falls to edge-on, then the new bottom lands flat). Each tile
 * counts through a few drum characters before its letter, rippling out from the left. 3.2 s per entry; stops after
 * one full cycle unless hovered; pausable; off-screen stops. The real text is a visually hidden <p>; the board is
 * aria-hidden. Static state: the first entry.
 */
import { onPause, isPaused } from '../motion/pause';
import { onScreen } from '../motion/lazy';

const DRUM = ' ABCDEFGHIJKLMNOPQRSTUVWXYZÜ·−°0123456789';

export default function initFlapBoard(root: HTMLElement): void {
  const entries: string[] = JSON.parse(root.dataset.flapEntries ?? '[]');
  const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-flap-tile]'));
  if (entries.length < 2 || !tiles.length) return;
  const width = tiles.length;
  const pad = (s: string) => s.toUpperCase().padEnd(width, ' ').slice(0, width);
  let idx = 0; let timer = 0; let cycled = 0; let hovered = false; let visible = false;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const flip = (tile: HTMLElement, to: string, delay: number) => {
    const cur = tile.dataset.ch ?? ' ';
    if (cur === to) return;
    const ci = Math.max(0, DRUM.indexOf(cur)), ti = DRUM.indexOf(to) >= 0 ? DRUM.indexOf(to) : 0;
    const lap = (ti - ci + DRUM.length) % DRUM.length;
    const n = Math.min(lap, 2 + Math.floor(Math.random() * 4));
    const seq = Array.from({ length: n }, (_, k) => DRUM[(ti - n + 1 + k + DRUM.length) % DRUM.length]);
    seq.forEach((ch, k) => window.setTimeout(() => setTile(tile, ch), delay + k * 70));
  };
  const setTile = (tile: HTMLElement, ch: string) => {
    const prev = tile.dataset.ch ?? ' ';
    tile.dataset.ch = ch;
    const shown = ch === ' ' ? ' ' : ch, was = prev === ' ' ? ' ' : prev;
    const q = (c: string) => tile.querySelector<HTMLElement>(`${c} i`);
    // static halves: new top, old bottom until the falling flap lands; flaps: old top falls, new bottom lands
    const st = q('.flap__st'), sb = q('.flap__sb'), ft = q('.flap__ft'), fb = q('.flap__fb');
    if (st) st.textContent = shown; if (ft) ft.textContent = was; if (fb) fb.textContent = shown;
    if (sb) { sb.textContent = was; window.setTimeout(() => { if (tile.dataset.ch === ch) sb.textContent = shown; }, 260); }
    tile.classList.remove('is-flipping'); void tile.offsetWidth; tile.classList.add('is-flipping');
  };
  const show = (i: number) => { const s = pad(entries[i]); tiles.forEach((t, c) => flip(t, s[c], c * 45)); };
  const schedule = () => {
    window.clearTimeout(timer);
    if (reduce || isPaused() || !visible) return;
    if (cycled >= entries.length && !hovered) return;
    timer = window.setTimeout(() => { idx = (idx + 1) % entries.length; cycled++; show(idx); schedule(); }, 3200);
  };
  root.addEventListener('pointerenter', () => { hovered = true; schedule(); });
  root.addEventListener('pointerleave', () => { hovered = false; });
  onScreen(root, (v) => { visible = v; schedule(); });
  onPause(() => schedule());
  root.classList.add('is-live');
}
