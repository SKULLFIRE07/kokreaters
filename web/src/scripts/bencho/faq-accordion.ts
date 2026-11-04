/*
 * Ported from Bencho (https://bencho.dev) block "faq-accordion" to vanilla TypeScript + GSAP for KoKreaters (DESIGN-SPEC v2 9).
 * Original: MIT License, Copyright (c) 2026 Lorenzo Cabra.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 * and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. Full text: web/THIRD_PARTY_NOTICES.md.
 */
/** FaqAccordion behaviour (DESIGN-SPEC v2 9): intercept the summary click, open the <details> first and then grow its
 * answer row (data-open), or shrink the row first and close the <details> when the transition ends. Native toggles
 * (find-in-page, keyboard) stay in sync through the toggle event. */
export default function initFaq(root: HTMLElement): void {
  root.classList.add('is-live');
  root.querySelectorAll<HTMLDetailsElement>('details').forEach((d) => {
    const sum = d.querySelector('summary');
    const ans = d.querySelector<HTMLElement>('.faq__answer');
    if (!sum || !ans) return;
    if (d.open) d.setAttribute('data-open', '');
    let closing = 0;
    sum.addEventListener('click', (e) => {
      e.preventDefault();
      if (d.open && d.hasAttribute('data-open')) {
        d.removeAttribute('data-open');
        window.clearTimeout(closing);
        closing = window.setTimeout(() => { d.open = false; }, 440);
      } else {
        window.clearTimeout(closing);
        d.open = true;
        requestAnimationFrame(() => requestAnimationFrame(() => d.setAttribute('data-open', '')));
      }
    });
    d.addEventListener('toggle', () => {
      if (d.open && !d.hasAttribute('data-open')) requestAnimationFrame(() => d.setAttribute('data-open', ''));
      if (!d.open) d.removeAttribute('data-open');
    });
  });
}
