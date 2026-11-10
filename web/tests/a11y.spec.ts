/**
 * a11y (infra.md §1.3, REDESIGN-V3 §7): axe-core with the WCAG 2.0/2.1/2.2 A and AA rule sets, zero violations, on
 * every route and the 404 at 1440 and 390. The page is scrolled through first so every once-only reveal has finished
 * (axe would otherwise measure text mid-fade).
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { routes, settle, scrollThrough } from './helpers';

const WIDTHS = [1440, 390] as const;
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const w of WIDTHS) {
  test.describe(`axe @${w}`, () => {
    test.use({ viewport: { width: w, height: w > 1000 ? 900 : 844 } });
    for (const r of [...routes, { path: '/this-page-does-not-exist', name: '404', file: '404.html' }]) {
      test(`axe ${r.path} @${w}`, async ({ page }) => {
        await page.goto(r.path, { waitUntil: 'load' });
        await settle(page, 300);
        await scrollThrough(page);
        const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        const summary = results.violations.map((v) =>
          `${v.id} [${v.impact}] ${v.help}: ${v.nodes.slice(0, 6).map((n) => n.target.join(' ')).join(' | ')}${v.nodes.length > 6 ? ` (+${v.nodes.length - 6})` : ''}`);
        expect(summary, `axe violations on ${r.path} @${w}`).toEqual([]);
      });
    }
  });
}
