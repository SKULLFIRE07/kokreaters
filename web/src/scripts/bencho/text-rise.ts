/*
 * Ported from Bencho (https://bencho.dev) block "text-rise" to vanilla TypeScript + GSAP for KoKreaters (DESIGN-SPEC v2 9).
 * Original: MIT License, Copyright (c) 2026 Lorenzo Cabra.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 * and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 */
/**
 * R1 Text rise (DESIGN-SPEC v2 8.3): [data-rise="lines"|"words"] (and the v1 alias [data-reveal="lines"]).
 * SplitText with masks (autoSplit re-splits on resize); pieces rise from yPercent 110 with a 2.5° tilt, 0.9 s expo.out,
 * stagger 0.08, once at 'top 80%'. Never on an H1. CSS hides the element (visibility) only while html.motion is set;
 * we reveal it as soon as it is split, so a failure never leaves it hidden.
 */
import { SplitText } from 'gsap/SplitText';
import type { MotionContext } from '../motion/context';
import { D, E, START } from '../motion/tokens';

export function initTextRise(ctx: MotionContext): void {
  const { gsap } = ctx;
  document.querySelectorAll<HTMLElement>('[data-rise], [data-reveal="lines"]').forEach((el) => {
    if (el.tagName === 'H1' || el.closest('h1')) { el.style.visibility = 'visible'; return; }
    const mode = el.dataset.rise === 'words' ? 'words' : 'lines';
    try {
      SplitText.create(el, {
        type: mode === 'words' ? 'words,lines' : 'lines', mask: 'lines', autoSplit: true,
        onSplit(self) {
          el.style.visibility = 'visible';
          const parts = mode === 'words' ? self.words : self.lines;
          return gsap.from(parts, {
            yPercent: 110, rotate: 2.5, transformOrigin: '0% 100%', duration: D.rise, stagger: .08, ease: E.rise,
            scrollTrigger: { trigger: el, start: START, once: true },
          });
        },
      });
    } catch {
      el.style.visibility = 'visible';
    }
  });
}
