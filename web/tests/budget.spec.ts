/**
 * Budgets measured in a real browser (DESIGN-SPEC 9 W3-tests): home total transfer ≤ 600KB (internal goal; the brief
 * caps at 1.5MB), after scrolling the whole page so lazy images load. `astro preview` does not compress, so text
 * responses are counted at their gzip size and binary responses at their real size, which is what a host sends.
 * Also: three.js is never requested outside /about, and never at 390, under reduced motion or with WebGL off.
 * The static gates (JS/CSS/fonts gzip per page) live in scripts/check-budget.mjs (`npm run verify`).
 */
import { test, expect, type Page } from '@playwright/test';
import { gzipSync } from 'node:zlib';
import { routes, settle, scrollThrough } from './helpers';

const KB = 1024;
const TEXT = /^(text\/|application\/(javascript|json|xml|manifest\+json)|image\/svg\+xml)/;

async function measure(page: Page, path: string) {
  const rows: { url: string; type: string; bytes: number }[] = [];
  const pending: Promise<void>[] = [];
  page.on('response', (res) => {
    pending.push((async () => {
      try {
        const body = await res.body();
        const type = (res.headers()['content-type'] ?? '').split(';')[0];
        rows.push({ url: res.url(), type, bytes: TEXT.test(type) ? gzipSync(body, { level: 6 }).length : body.length });
      } catch { /* redirects and aborted prefetches have no body */ }
    })());
  });
  await page.goto(path, { waitUntil: 'load' });
  await settle(page, 2400);
  await scrollThrough(page);
  await page.waitForLoadState('networkidle');
  await Promise.all(pending);
  return rows;
}
const isThree = (u: string) => /\/_astro\/(three|scene)[^/]*\.js$/.test(u);

for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`home total transfer ≤ 600KB @${vp.width}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    const rows = await measure(page, '/');
    const total = rows.reduce((s, r) => s + r.bytes, 0);
    const by = (re: RegExp) => rows.filter((r) => re.test(r.type)).reduce((s, r) => s + r.bytes, 0);
    test.info().annotations.push({ type: 'transfer', description:
      `total ${(total / KB).toFixed(1)}KB · js ${(by(/javascript/) / KB).toFixed(1)} · css ${(by(/css/) / KB).toFixed(1)} · fonts ${(by(/font|woff/) / KB).toFixed(1)} · images ${(by(/^image\//) / KB).toFixed(1)} · html ${(by(/html/) / KB).toFixed(1)} · ${rows.length} requests` });
    console.log(`[budget] home @${vp.width}: ${test.info().annotations.at(-1)!.description}`);
    expect(total, 'home transfer bytes').toBeLessThanOrEqual(600 * KB);
    expect(rows.filter((r) => isThree(r.url)).map((r) => r.url), 'no three.js on home').toEqual([]);
    await ctx.close();
  });
}

test('three.js is requested on no route except /about (1440)', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const bad: string[] = [];
  for (const r of routes.filter((x) => x.path !== '/about')) {
    const page = await ctx.newPage();
    page.on('request', (req) => { if (isThree(req.url())) bad.push(`${r.path} → ${req.url()}`); });
    await page.goto(r.path, { waitUntil: 'load' });
    await settle(page, 300);
    await scrollThrough(page, 30);
    await page.close();
  }
  await ctx.close();
  expect(bad).toEqual([]);
});

for (const variant of [
  { name: '390', opts: { viewport: { width: 390, height: 844 } } },
  { name: 'reduced motion', opts: { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' as const } },
]) {
  test(`/about requests no three.js chunk @ ${variant.name}`, async ({ browser }) => {
    const ctx = await browser.newContext(variant.opts);
    const page = await ctx.newPage();
    const hits: string[] = [];
    page.on('request', (req) => { if (isThree(req.url())) hits.push(req.url()); });
    await page.goto('/about', { waitUntil: 'load' });
    await settle(page, 600);
    await scrollThrough(page);
    expect(hits).toEqual([]);
    await expect(page.locator('[data-globe] svg').first()).toBeVisible();
    await ctx.close();
  });
}
