/**
 * responsive (infra.md §1.6, REDESIGN-V3 §7 "no horizontal scroll at 360px"): at 360, 375, 390, 768, 1024, 1280 and
 * 1440 no route scrolls sideways (`scrollWidth <= innerWidth`, and a forced horizontal scroll stays at 0), and no text
 * is cut off at the viewport edge (overflow-x: clip on html/body would hide it silently). Text inside its own
 * clipping/scrolling box that sits within the viewport (an ellipsis line, a scrollable table) is allowed.
 */
import { test, expect } from '@playwright/test';
import { routes, settle, scrollThrough } from './helpers';

const WIDTHS = [360, 375, 390, 768, 1024, 1280, 1440] as const;

for (const w of WIDTHS) {
  test.describe(`@${w}`, () => {
    test.use({ viewport: { width: w, height: 900 } });
    for (const r of routes) {
      test(`no horizontal overflow ${r.path} @${w}`, async ({ page }) => {
        await page.goto(r.path, { waitUntil: 'load' });
        await settle(page, 200);
        await scrollThrough(page, 30);
        const m = await page.evaluate(() => {
          const de = document.documentElement;
          window.scrollTo(600, window.scrollY);
          const sx = window.scrollX;
          window.scrollTo(0, window.scrollY);
          const cut: string[] = [];
          const wide: string[] = [];
          const vw = de.clientWidth;
          for (const el of document.body.querySelectorAll('*')) {
            if (el.closest('[hidden], [aria-hidden="true"], .visually-hidden, .skip-link, dialog:not([open]), noscript, script, style')) continue;
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue;
            const box = el.getBoundingClientRect();
            const clipped = (() => {
              for (let a: Element | null = el.parentElement; a && a !== document.body; a = a.parentElement) {
                const ox = getComputedStyle(a).overflowX;
                if (ox !== 'visible') { const ar = a.getBoundingClientRect(); if (ar.right <= vw + 1 && ar.left >= -1) return true; }
              }
              return false;
            })();
            if (box.width > 0 && (box.right > vw + 1 || box.left < -1) && !clipped && wide.length < 8) {
              wide.push(`${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className ? '.' + el.className.split(/\s+/)[0] : ''} [${Math.round(box.left)}…${Math.round(box.right)}]`);
            }
            const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? '').trim().length > 1);
            if (!hasText || cs.opacity === '0') continue;
            let left = Infinity; let right = -Infinity;
            for (const n of el.childNodes) {
              if (n.nodeType !== 3 || !(n.textContent ?? '').trim()) continue;
              const range = document.createRange();
              range.selectNodeContents(n);
              const b = range.getBoundingClientRect();
              if (b.width < 1 || b.height < 1) continue;
              left = Math.min(left, b.left); right = Math.max(right, b.right);
            }
            if (!Number.isFinite(left) || !(right > vw + 1 || left < -1)) continue;
            const inner = (() => {
              for (let a: Element | null = el; a && a !== document.body; a = a.parentElement) {
                const ox = getComputedStyle(a).overflowX;
                if (ox !== 'visible') { const ar = a.getBoundingClientRect(); if (ar.right <= vw + 1 && ar.left >= -1) return true; }
              }
              return false;
            })();
            if (!inner) cut.push(`${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className ? '.' + el.className.split(/\s+/)[0] : ''} "${(el.textContent ?? '').trim().slice(0, 40)}" [${Math.round(left)}…${Math.round(right)}]`);
          }
          return { scrollWidth: de.scrollWidth, innerWidth: window.innerWidth, scrollX: sx, cut, wide };
        });
        expect(m.scrollWidth, `documentElement.scrollWidth vs innerWidth ${m.innerWidth}; wider elements: ${m.wide.join(', ') || 'none'}`).toBeLessThanOrEqual(m.innerWidth);
        expect(m.scrollX, 'forced horizontal scroll').toBe(0);
        expect(m.cut, 'text cut off at the viewport edge').toEqual([]);
      });
    }
  });
}
