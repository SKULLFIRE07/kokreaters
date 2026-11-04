/**
 * chrome (DESIGN-SPEC v2 7.1, 12.2): every page renders the announcement bar (first region after the skip link, with
 * the insights link), and the Pause motion control toggles html.motion-paused, aria-pressed and its label, and
 * persists across a reload. Under reduced motion the control is not shown (nothing loops).
 */
import { test, expect } from '@playwright/test';
import { routes, settle } from './helpers';

for (const r of routes) {
  test(`announcement bar on ${r.path}`, async ({ page }) => {
    await page.goto(r.path, { waitUntil: 'load' });
    const ann = page.locator('body > .ann[role="region"]');
    await expect(ann).toHaveCount(1);
    await expect(ann).toBeVisible();
    await expect(ann.locator('a[href="/insights"]')).toHaveCount(1);
    // order: skip link, then the bar, then the header
    const order = await page.evaluate(() => Array.from(document.body.children).map((e) => e.className.split(' ')[0] || e.tagName.toLowerCase()).slice(0, 3));
    expect(order).toEqual(['skip-link', 'ann', 'site-header']);
  });
}

test.describe('Pause motion', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test('toggles html.motion-paused and persists', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await settle(page, 200);
    const btn = page.locator('[data-motion-toggle]').first();
    await expect(btn).toBeVisible();
    const box = await btn.boundingBox();
    expect(Math.min(box!.width, box!.height), 'target ≥ 44px').toBeGreaterThanOrEqual(44);
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => document.documentElement.classList.contains('motion-paused'))).toBe(true);
    await expect(btn).toContainText('Play motion');
    await page.reload({ waitUntil: 'load' });
    await settle(page, 200);
    expect(await page.evaluate(() => document.documentElement.classList.contains('motion-paused'))).toBe(true);
    await expect(page.locator('[data-motion-toggle]').first()).toHaveAttribute('aria-pressed', 'true');
    await page.locator('[data-motion-toggle]').first().click();
    expect(await page.evaluate(() => document.documentElement.classList.contains('motion-paused'))).toBe(false);
  });
});

test.describe('Pause motion under reduced motion', () => {
  test.use({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  test('is not shown', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await settle(page, 200);
    await expect(page.locator('[data-motion-toggle]').first()).toBeHidden();
  });
});
