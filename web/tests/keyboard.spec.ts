/**
 * Keyboard (DESIGN-SPEC 9 W3-tests, 10): from any route, /contact is reached in ≤ 2 actions through the header.
 *   1440: one action (activate the header CTA "Start a conversation"); by keyboard the CTA is in the first tab stops
 *         and every stop on the way shows a visible focus indicator.
 *   390:  two actions (Menu, then Contact); Esc closes the menu and returns focus to the Menu button.
 */
import { test, expect, type Page } from '@playwright/test';
import { routes, settle } from './helpers';

const MAX_TABS_TO_CTA = 10; // skip link, logo, Expertise, five nav links, CTA = 9

async function focusInfo(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    const visible = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 1) || cs.boxShadow !== 'none';
    return { tag: el.tagName.toLowerCase(), href: el.getAttribute('href'), text: (el.textContent ?? '').trim().slice(0, 30), inHeader: !!el.closest('header'), visible };
  });
}

test.describe('desktop 1440', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  for (const r of routes) {
    test(`header CTA reaches /contact from ${r.path}`, async ({ page }) => {
      await page.goto(r.path, { waitUntil: 'load' });
      await settle(page, 200);
      const cta = page.locator('header a.btn[href="/contact"]:not(#mobile-menu *)');
      await expect(cta, 'header CTA visible').toBeVisible();
      await expect(cta).toHaveText(/Start a conversation/);
      const box = await cta.boundingBox();
      expect(box!.height, 'CTA target ≥ 44px').toBeGreaterThanOrEqual(44);

      let tabs = 0; let reached = false; const noRing: string[] = [];
      while (tabs < MAX_TABS_TO_CTA + 5) {
        await page.keyboard.press('Tab'); tabs++;
        const f = await focusInfo(page);
        if (f && !f.visible) noRing.push(`${f.tag} ${f.href ?? ''} "${f.text}"`);
        if (f?.inHeader && f.href === '/contact') { reached = true; break; }
      }
      expect(reached, 'header CTA is in the tab order').toBe(true);
      expect(tabs, `tab stops to the header CTA`).toBeLessThanOrEqual(MAX_TABS_TO_CTA);
      expect(noRing, 'focus indicator visible on every stop').toEqual([]);
      await Promise.all([page.waitForURL(/\/contact$/), page.keyboard.press('Enter')]);
      await expect(page.locator('body[data-page="contact"]')).toHaveCount(1);
    });
  }
});

test.describe('mobile 390', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
  for (const r of routes) {
    test(`Menu → Contact from ${r.path}`, async ({ page }) => {
      await page.goto(r.path, { waitUntil: 'load' });
      await settle(page, 200);
      const btn = page.locator('header button[data-menu-toggle]');
      await expect(btn).toBeVisible();
      const b = await btn.boundingBox();
      expect(Math.min(b!.width, b!.height), 'menu button ≥ 44×44').toBeGreaterThanOrEqual(44);
      await btn.click();                                                    // action 1
      await expect(btn).toHaveAttribute('aria-expanded', 'true');
      const menu = page.locator('#mobile-menu');
      await expect(menu).toBeVisible();
      await expect(page.locator('main')).toHaveAttribute('inert', '');
      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
      expect(await page.evaluate(() => (document.activeElement as HTMLElement | null)?.hasAttribute('data-menu-toggle'))).toBe(true);
      await btn.click();
      await Promise.all([page.waitForURL(/\/contact$/), menu.locator('a.m-menu__link[href="/contact"]').click()]); // action 2
      await expect(page.locator('body[data-page="contact"]')).toHaveCount(1);
    });
  }
});
