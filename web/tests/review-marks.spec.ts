/**
 * review-marks (REDESIGN-V3 §0 "no visible CONFIRM/DRAFT on the public link", §6, §8.5; infra.md §1.10).
 * Only for builds that can be shared (preview = the Vercel review link, production = kokreaters.com); a staging build
 * shows these marks on purpose and is skipped. On every route, in the rendered page (JS on):
 *   no Confirm tags / draft ribbons / draft badges in the DOM, and no visible "CONFIRM", "DRAFT", "· Draft",
 *   "Pending client consent" or the staging-only lawyer-review banner text.
 */
import { test, expect } from '@playwright/test';
import { routes, settle, mode } from './helpers';

const MARK_SELECTORS = '.confirm, [data-confirm-id], [data-draft], .draft-ribbon, [data-pending-consent]';
const VISIBLE_TEXT = [
  /\bCONFIRM\b/, /\bDRAFT\b/, /·\s*Draft\b/, /Pending client consent/i, /for Ganeaysh[’']s review/i,
  /Placeholder text for review by a lawyer/i,
];

test.describe('shareable build carries no review marks', () => {
  test.skip(mode === 'staging', 'staging builds show Confirm/Draft marks by design');
  for (const r of [...routes, { path: '/this-page-does-not-exist', name: '404', file: '404.html' }]) {
    test(`no CONFIRM / DRAFT / pending consent on ${r.path}`, async ({ page }) => {
      await page.goto(r.path, { waitUntil: 'load' });
      await settle(page, 200);
      expect(await page.locator(MARK_SELECTORS).count(), `review-mark elements (${MARK_SELECTORS})`).toBe(0);
      const text = await page.evaluate(() => document.body.innerText);
      const hits = VISIBLE_TEXT.filter((re) => re.test(text)).map((re) => `${re} → "${text.match(re)![0]}"`);
      expect(hits, 'visible review marks').toEqual([]);
    });
  }
});
