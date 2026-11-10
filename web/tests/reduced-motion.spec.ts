/**
 * reduced-motion (REDESIGN-V3 §1.5 "every motion is disabled under prefers-reduced-motion: reduce and content is fully
 * visible without JS"; infra.md §1.5):
 *   reduce @1440   nothing in <main> is left at opacity 0 / visibility hidden (before and after scrolling) and no
 *                  animation is running (CSS animations, transitions and scroll-driven settles all off)
 *   JS off @390    html keeps `no-js`, the h1 is visible, nothing in <main> is hidden
 * KK_SHOTS=1 also writes full-page screenshots to research/v3/shots/tests/.
 */
import { test, expect, type Page } from '@playwright/test';
import { routes, settle, scrollThrough, hiddenInMain, shotPath, shotsOn } from './helpers';

const running = (page: Page) => page.evaluate(() => document.getAnimations()
  .filter((a) => a.playState === 'running')
  .map((a) => {
    const t = (a.effect as KeyframeEffect | null)?.target as Element | null;
    const name = (a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty ?? a.constructor.name;
    return `${name} on ${t ? t.tagName.toLowerCase() + (typeof t.className === 'string' && t.className ? '.' + t.className.split(/\s+/)[0] : '') : '?'}`;
  }));

test.describe('prefers-reduced-motion: reduce', () => {
  test.use({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  for (const r of routes) {
    test(`reduced ${r.path}`, async ({ page }) => {
      await page.goto(r.path, { waitUntil: 'load' });
      await settle(page, 300);
      expect(await hiddenInMain(page), 'hidden before any scroll').toEqual([]);
      expect(await running(page), 'running animations at load').toEqual([]);
      await scrollThrough(page, 30);
      expect(await hiddenInMain(page), 'hidden after scrolling').toEqual([]);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
      await page.waitForTimeout(100);
      expect(await running(page), 'running animations mid-page').toEqual([]);
      if (shotsOn) await page.screenshot({ path: shotPath(`rm-${r.name}-1440.png`), fullPage: true });
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
