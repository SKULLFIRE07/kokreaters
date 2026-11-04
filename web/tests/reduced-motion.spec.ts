/**
 * reduced-motion (DESIGN-SPEC 0.2.6, 6.4, 9 W3-tests): with `reducedMotion: 'reduce'` every route is screenshotted
 * (research/shots/build/tests-rm-{route}-1440.png) and nothing inside <main> may be left at opacity 0 or
 * visibility hidden. The same holds with JavaScript disabled. Lenis must not exist under reduced motion.
 */
import { test, expect } from '@playwright/test';
import { routes, settle, scrollThrough, hiddenInMain, shotPath, shotsOn } from './helpers';

test.describe('prefers-reduced-motion: reduce', () => {
  test.use({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  for (const r of routes) {
    test(`reduced ${r.path}`, async ({ page }) => {
      await page.goto(r.path, { waitUntil: 'load' });
      await settle(page, 300);
      expect(await hiddenInMain(page), 'hidden before any scroll').toEqual([]);
      await scrollThrough(page, 30);
      expect(await hiddenInMain(page), 'hidden after scrolling').toEqual([]);
      expect(await page.evaluate(() => document.documentElement.classList.contains('motion')), 'html.motion removed').toBe(false);
      expect(await page.evaluate(() => !!(window as unknown as { __lenis?: unknown }).__lenis), 'no Lenis under reduced motion').toBe(false);
      if (shotsOn) await page.screenshot({ path: shotPath(`tests-rm-${r.name}-1440.png`), fullPage: true });
    });
  }
});

test.describe('JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  for (const r of routes) {
    test(`no-js ${r.path}`, async ({ page }) => {
      await page.goto(r.path, { waitUntil: 'load' });
      expect(await page.evaluate(() => document.documentElement.className)).toContain('no-js');
      await expect(page.locator('h1')).toBeVisible();
      expect(await hiddenInMain(page), 'hidden with JS off').toEqual([]);
    });
  }
});
