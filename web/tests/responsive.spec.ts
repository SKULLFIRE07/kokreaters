/**
 * responsive (DESIGN-SPEC 1.4, 9 W3-tests, 10): at 360, 768, 1024, 1280 and 1440 the page never scrolls
 * sideways (`scrollWidth <= innerWidth`, and a forced horizontal scroll stays at 0), and no text is cut off at the
 * viewport edge (overflow-x: clip on html/body would hide it silently).
 */
import { test, expect } from '@playwright/test';
import { routes, settle, scrollThrough } from './helpers';

const WIDTHS = [360, 768, 1024, 1280, 1440] as const;

for (const w of WIDTHS) {
  test.describe(`@${w}`, () => {
    test.use({ viewport: { width: w, height: 900 } });
    for (const r of routes) {
      test(`no horizontal scroll ${r.path} @${w}`, async ({ page }) => {
        await page.goto(r.path, { waitUntil: 'load' });
        await settle(page, 200);
        await scrollThrough(page, 30);
        const m = await page.evaluate(() => {
          const de = document.documentElement;
          window.scrollTo(600, window.scrollY);
          const sx = window.scrollX;
          window.scrollTo(0, window.scrollY);
          const cut: string[] = [];
          const vw = de.clientWidth;
          for (const el of document.body.querySelectorAll('*')) {
            const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? '').trim().length > 1);
            if (!hasText) continue;
            if (el.closest('[hidden], [aria-hidden="true"], .visually-hidden, .skip-link, dialog:not([open]), noscript, script, style')) continue;
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0' || cs.position === 'fixed') continue;
            // measure only this element's own text nodes (descendants such as .visually-hidden spans are measured on their own)
            let left = Infinity; let right = -Infinity;
            for (const n of el.childNodes) {
              if (n.nodeType !== 3 || !(n.textContent ?? '').trim()) continue;
              const range = document.createRange();
              range.selectNodeContents(n);
              const b = range.getBoundingClientRect();
              if (b.width < 1 || b.height < 1) continue;
              left = Math.min(left, b.left); right = Math.max(right, b.right);
            }
            if (!Number.isFinite(left)) continue;
            const rr = { left, right };
            if (!(rr.right > vw + 1 || rr.left < -1)) continue;
            // text inside its own clipping or scrolling box (ellipsis rows, a scrollable table) is not cut by the page edge
            let inner = false;
            for (let a: Element | null = el; a && a !== document.body; a = a.parentElement) {
              const ox = getComputedStyle(a).overflowX;
              if (ox !== 'visible') { const ar = a.getBoundingClientRect(); if (ar.right <= vw + 1 && ar.left >= -1) { inner = true; break; } }
            }
            if (!inner) cut.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(/\s+/)[0] : ''} "${(el.textContent ?? '').trim().slice(0, 40)}" [${Math.round(rr.left)}…${Math.round(rr.right)}]`);
          }
          return { scrollWidth: de.scrollWidth, bodyScrollWidth: document.body.scrollWidth, innerWidth: window.innerWidth, clientWidth: vw, scrollX: sx, cut };
        });
        expect(m.scrollWidth, `documentElement.scrollWidth vs innerWidth ${m.innerWidth}`).toBeLessThanOrEqual(m.innerWidth);
        expect(m.scrollX, 'forced horizontal scroll').toBe(0);
        expect(m.cut, 'text cut off at the viewport edge').toEqual([]);
      });
    }
  });
}
