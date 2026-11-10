/**
 * iphone (WebKit, iPhone 13 390×844; infra.md §1.10 — the brief asks for phone quality, and Safari is what the client
 * reviews on). Runs only in the `iphone` project.
 *   every route   200, one visible h1, no page errors, no horizontal overflow
 *   menu flow     (port of the v2 .stuck.mjs probe) open/close keeps the page scrollable: body styles restored,
 *                 main not inert, scroll position kept; a tap on a menu link navigates
 */
import { test, expect } from '@playwright/test';
import { routes, settle } from './helpers';

for (const r of routes) {
  test(`iphone ${r.path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const res = await page.goto(r.path, { waitUntil: 'load' });
    expect(res?.status()).toBe(200);
    await settle(page, 200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
    expect(m.sw, 'no horizontal overflow').toBeLessThanOrEqual(m.iw);
    expect(errors).toEqual([]);
  });
}

test('iphone menu: open/close keeps the page scrollable, a tap navigates', async ({ page }) => {
  await page.goto('/about', { waitUntil: 'load' });
  await settle(page, 200);
  await page.evaluate(() => window.scrollTo(0, 900));
  const y0 = await page.evaluate(() => window.scrollY);
  const btn = page.locator('header button[data-menu-toggle]');
  const menu = page.locator('#mobile-menu');
  for (let i = 0; i < 2; i++) {
    await btn.tap();
    await expect(menu).toBeVisible();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await btn.tap();
    await expect(menu).toBeHidden();
  }
  const s = await page.evaluate(() => ({ pos: document.body.style.position, top: document.body.style.top, inert: (document.querySelector('main') as HTMLElement).inert, y: window.scrollY }));
  expect(s, 'body restored, main not inert, scroll kept').toEqual({ pos: '', top: '', inert: false, y: y0 });
  await page.evaluate(() => window.scrollBy(0, 300));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(y0);
  await btn.tap();
  await Promise.all([page.waitForURL(/\/insights$/), menu.locator('a.m-menu__link[href="/insights"]').tap()]);
  await expect(page.locator('body[data-page="insights"]')).toHaveCount(1);
});
