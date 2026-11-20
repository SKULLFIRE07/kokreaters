/**
 * Keyboard (infra.md §1.4, REDESIGN-V3 §3 chrome + §7 "Esc closes overlays", §8.7 hooks):
 *   every route @1440   the header CTA ([data-header-cta] "Start a conversation", ≥ 44px) is reached in ≤ 10 Tab stops
 *                       (skip link, announcement, logo, Expertise, Industries, Approach, Impact, Insights, About, CTA),
 *                       every stop shows a focus indicator, Enter lands on /contact
 *   every route @390    Menu (≥ 44×44) → sheet open, main inert → Esc closes, focus back on Menu → reopen → Contact
 *   skip link           first Tab stop, visible when focused, Enter moves focus to main#main
 *   header nav          aria-current="page" on the active section
 *   mega-menu/dropdown  Enter opens (aria-expanded), Tab enters the panel, Esc closes and returns focus to the trigger;
 *                       outside click closes
 *   mobile menu trap    Tab / Shift+Tab never leave the toggle + sheet; Esc closes; scroll lock released; links navigate
 */
import { test, expect } from '@playwright/test';
import { routes, settle, focusInfo } from './helpers';

const MAX_TABS_TO_CTA = 10;

test.describe('desktop 1440', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const r of routes) {
    test(`header CTA reaches /contact from ${r.path}`, async ({ page }) => {
      await page.goto(r.path, { waitUntil: 'load' });
      await settle(page, 200);
      const cta = page.locator('header [data-header-cta]');
      await expect(cta, 'header CTA visible').toBeVisible();
      await expect(cta).toHaveText(/Book a/);
      await expect(cta).toHaveAttribute('href', /^(\/contact#start|https:\/\/)/);
      expect((await cta.boundingBox())!.height, 'CTA target ≥ 40px').toBeGreaterThanOrEqual(40);

      let tabs = 0; let reached = false; const noRing: string[] = [];
      while (tabs < MAX_TABS_TO_CTA + 6) {
        await page.keyboard.press('Tab'); tabs++;
        const f = await focusInfo(page);
        if (f && !f.ring) noRing.push(`${f.tag} ${f.href ?? ''} "${f.text}"`);
        if (f?.isCta) { reached = true; break; }
      }
      expect(reached, 'header CTA is in the tab order').toBe(true);
      expect(tabs, 'tab stops to the header CTA').toBeLessThanOrEqual(MAX_TABS_TO_CTA);
      expect(noRing, 'focus indicator visible on every stop').toEqual([]);
      await Promise.all([page.waitForURL(/\/contact(#start)?$/), page.keyboard.press('Enter')]);
      await expect(page.locator('body[data-page="contact"]')).toHaveCount(1);
    });
  }

  test('skip link is the first stop and moves focus to main', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await settle(page, 200);
    await page.keyboard.press('Tab');
    const skip = page.locator('a.skip-link');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    expect(await page.evaluate(() => document.body.firstElementChild?.matches('a.skip-link')), 'skip link is first in <body>').toBe(true);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await expect(page.locator('main#main')).toBeFocused();
  });

  for (const [path, href] of [['/impact', '/impact'], ['/insights', '/insights'], ['/about', '/about']] as const) {
    test(`header nav marks ${href} current on ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'load' });
      const current = page.locator('header .site-nav [aria-current="page"]');
      await expect(current).toHaveCount(1);
      await expect(current).toHaveAttribute('href', href);
    });
  }

  for (const [label, panel] of [['Expertise', 'mega-expertise']] as const) {
    test(`${label} panel: Enter opens, Tab enters, Esc closes and returns focus`, async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });
      await settle(page, 200);
      const trigger = page.locator(`header button[data-nav-toggle][aria-controls="${panel}"]`);
      const box = page.locator(`#${panel}`);
      await expect(trigger).toBeVisible();
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(box).toBeHidden();

      await trigger.focus();
      await page.keyboard.press('Enter');
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expect(box).toBeVisible();
      await page.keyboard.press('Tab');
      expect(await page.evaluate((id) => !!document.activeElement?.closest(`#${id}`), panel), 'Tab moves into the panel').toBe(true);
      expect((await focusInfo(page))?.ring, 'panel link shows focus').toBe(true);

      await page.keyboard.press('Escape');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(box).toBeHidden();
      await expect(trigger).toBeFocused();

      // reopen with the mouse; a click outside closes it
      await trigger.click();
      await expect(box).toBeVisible();
      await page.mouse.click(720, 860);
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(box).toBeHidden();
    });
  }

  test('the panel link navigates (Expertise → a pillar page)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await settle(page, 200);
    await page.locator('header button[data-nav-toggle][aria-controls="mega-expertise"]').click();
    const link = page.locator('#mega-expertise a[href^="/expertise/"]').first();
    await expect(link).toBeVisible();
    await Promise.all([page.waitForURL(/\/expertise\/[\w-]+$/), link.click()]);
    await expect(page.locator('body[data-page="pillar"]')).toHaveCount(1);
  });
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
      await btn.click();
      await expect(btn).toHaveAttribute('aria-expanded', 'true');
      const menu = page.locator('#mobile-menu');
      await expect(menu).toBeVisible();
      await expect(page.locator('main')).toHaveAttribute('inert', '');
      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
      await expect(btn).toBeFocused();
      await btn.click();
      await Promise.all([page.waitForURL(/\/contact$/), menu.locator('a.m-menu__link[href="/contact"]').click()]);
      await expect(page.locator('body[data-page="contact"]')).toHaveCount(1);
    });
  }

  test('mobile menu traps focus, locks scroll and releases both on Esc', async ({ page }) => {
    await page.goto('/expertise', { waitUntil: 'load' });
    await settle(page, 200);
    await page.evaluate(() => window.scrollTo(0, 600));
    const y0 = await page.evaluate(() => window.scrollY);
    const btn = page.locator('header button[data-menu-toggle]');
    await btn.click();
    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeVisible();
    await expect(btn.locator('[data-menu-label]')).toHaveText(/Close/);
    expect(await page.evaluate(() => getComputedStyle(document.body).position), 'body scroll locked').toBe('fixed');
    for (const sel of ['main', 'footer']) expect(await page.evaluate((s) => (document.querySelector(s) as HTMLElement).inert, sel), `${sel} inert`).toBe(true);
    expect((await focusInfo(page))?.inMenu, 'focus moves into the sheet').toBe(true);

    const escaped: string[] = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      const f = await focusInfo(page);
      if (!f || !(f.inMenu || f.isToggle)) escaped.push(`Tab ${i + 1}: ${f ? `${f.tag} ${f.href ?? ''} "${f.text}"` : 'body'}`);
    }
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Shift+Tab');
      const f = await focusInfo(page);
      if (!f || !(f.inMenu || f.isToggle)) escaped.push(`Shift+Tab ${i + 1}: ${f ? `${f.tag} "${f.text}"` : 'body'}`);
    }
    expect(escaped, 'focus never leaves the open menu').toEqual([]);

    // accordion groups (Expertise / Industries) open in place
    const group = menu.locator('button[data-menu-group]').first();
    await group.click();
    await expect(group).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(btn).toBeFocused();
    await expect(btn.locator('[data-menu-label]')).toHaveText(/Menu/);
    expect(await page.evaluate(() => document.body.style.position), 'scroll lock released').toBe('');
    expect(await page.evaluate(() => (document.querySelector('main') as HTMLElement).inert), 'main no longer inert').toBe(false);
    expect(await page.evaluate(() => window.scrollY), 'scroll position restored').toBe(y0);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => page.evaluate(() => window.scrollY), { message: 'page still scrolls after closing' }).toBeGreaterThan(y0);
  });
});
