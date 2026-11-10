/**
 * home structure (REDESIGN-V3 §4 Home "8 sections"; infra.md §1.10): <main> holds exactly eight top-level sections:
 * the hero (PageHero, with the only h1), six content bands (track record, what we do, insights, results, industries,
 * founder) and the closing CtaBand (#cta-heading, with the newsletter on home). Each band is a labelled section.
 * The insights band renders only when an insight is visible in the build's mode (§8 gaps rule): preview and staging
 * always have one (drafts included), a production build before any article is approved has seven sections.
 * The page height at 1440 is reported (target ≈ 5,500–6,500 px, §8.2).
 */
import { test, expect } from '@playwright/test';
import { settle, build } from './helpers';

test('home has exactly 8 top-level sections: hero + 6 bands + CtaBand (7 without visible insights)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'load' });
  await settle(page, 200);
  const sections = page.locator('main > section');
  const hasInsights = (await page.locator('main > section[aria-labelledby="insights-heading"]').count()) === 1;
  if (build.includeDrafts) expect(hasInsights, 'preview/staging: the insights band is present').toBe(true);
  await expect(sections).toHaveCount(hasInsights ? 8 : 7);
  await expect(sections.first().locator('h1'), 'first section is the hero with the h1').toHaveCount(1);
  await expect(sections.last().locator('#cta-heading'), 'last section is the CtaBand').toHaveCount(1);
  await expect(sections.last().locator('form[data-newsletter]'), 'home CtaBand carries the newsletter').toHaveCount(1);
  const unnamed = await page.evaluate(() => [...document.querySelectorAll('main > section')]
    .filter((s) => !s.getAttribute('aria-labelledby') && !s.getAttribute('aria-label'))
    .map((s) => s.className.split(/\s+/).slice(0, 3).join('.')));
  expect(unnamed, 'every section has an accessible name').toEqual([]);
  const ids = await page.evaluate(() => [...document.querySelectorAll('main > section[aria-labelledby]')]
    .filter((s) => !document.getElementById(s.getAttribute('aria-labelledby')!)).map((s) => s.getAttribute('aria-labelledby')));
  expect(ids, 'aria-labelledby points at an existing heading').toEqual([]);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  test.info().annotations.push({ type: 'home height @1440', description: `${height}px (target ≈ 5,500–6,500)` });
});
