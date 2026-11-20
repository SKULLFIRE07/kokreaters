/**
 * chrome (infra.md §1.9, REDESIGN-V3 §3 chrome): body order skip link → (announcement line) → header; one
 * footer#site-footer; the newsletter is a real <form> (labelled required email input, submit button, action = endpoint
 * or mailto:); the v2 Pause-motion bar is gone; header compacts (`.is-scrolled`) once the page scrolls.
 */
import { test, expect } from '@playwright/test';
import { settle } from './helpers';

test('body order, footer and no motion toggle', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  const order = await page.evaluate(() => [...document.body.children]
    .filter((el) => !['SCRIPT', 'STYLE', 'TEMPLATE'].includes(el.tagName))
    .slice(0, 3)
    .map((el) => (el.matches('a.skip-link') ? 'skip' : el.matches('[data-announcement]') ? 'ann' : el.matches('header.site-header') ? 'header' : el.tagName.toLowerCase())));
  expect(order[0]).toBe('skip');
  expect(order.slice(1).filter((x) => x !== 'ann')[0], 'header follows the skip link (and the announcement line)').toBe('header');
  await expect(page.locator('footer#site-footer')).toHaveCount(1);
  await expect(page.locator('[data-motion-toggle]')).toHaveCount(0);
});

test('newsletter forms are real forms', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  const forms = page.locator('form[data-newsletter]');
  // v3 Delft: the client's design has no newsletter on home; any newsletter form that does render must be real
  for (const f of await forms.all()) {
    const action = await f.getAttribute('action');
    expect(action, 'action = endpoint or mailto:').toMatch(/^(https:\/\/|mailto:)/);
    const email = f.locator('input[type="email"]');
    await expect(email).toHaveCount(1);
    await expect(email).toHaveAttribute('required', '');
    const id = await email.getAttribute('id');
    await expect(page.locator(`label[for="${id}"]`), 'email input has a label').toHaveCount(1);
    await expect(f.locator('button[type="submit"]')).toHaveCount(1);
  }
});

test('newsletter rejects an invalid address inline (aria-live)', async ({ page }) => {
  await page.goto('/insights', { waitUntil: 'load' });
  await settle(page, 200);
  const f = page.locator('form[data-nl]').first();
  await f.scrollIntoViewIfNeeded();
  await f.locator('input[type="email"]').fill('not-an-email');
  await f.evaluate((form: HTMLFormElement) => form.requestSubmit());
  await expect(f.locator('[data-nl-error="email"]')).not.toBeEmpty();
  await expect(f.locator('input[type="email"]')).toHaveAttribute('aria-invalid', 'true');
});

test('header compacts on scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'load' });
  await settle(page, 200);
  const header = page.locator('header.site-header');
  await expect(header).not.toHaveClass(/is-scrolled/);
  await page.mouse.wheel(0, 600);
  await expect(header).toHaveClass(/is-scrolled/);
});
