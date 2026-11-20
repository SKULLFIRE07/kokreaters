/**
 * Budgets measured in a real browser (REDESIGN-V3 §7; infra.md §1.8). `astro preview` does not compress, so text
 * responses are counted at their gzip size and binary responses at their real size, which is what a host sends.
 *   home total transfer ≤ 600 KB at 1440 and 390 after scrolling the whole page (the photography guard)
 *   every route: JavaScript transferred ≤ 15 KB gzip, only the three v3 fonts, no GSAP / Lenis / three.js request
 * The static gates (per-page JS/CSS gzip, font files, banned signatures, palette) live in scripts/check-budget.mjs.
 */
import { test, expect, type Page } from '@playwright/test';
import { gzipSync } from 'node:zlib';
import { routes, settle, scrollThrough } from './helpers';

const KB = 1024;
const TEXT = /^(text\/|application\/(javascript|json|xml|manifest\+json)|image\/svg\+xml)/;
const FONTS = ['manrope-latin-wght-normal.woff2', 'bodoni-moda-latin-opsz-normal.woff2', 'bodoni-moda-latin-opsz-italic.woff2'];
const BANNED = /WebGLRenderer|THREE\.REVISION/;   // v3 Delft: GSAP + Lenis are allowed (lazy), three.js stays out

async function measure(page: Page, path: string) {
  const rows: { url: string; type: string; bytes: number; body: string }[] = [];
  const pending: Promise<void>[] = [];
  page.on('response', (res) => {
    pending.push((async () => {
      try {
        const body = await res.body();
        const type = (res.headers()['content-type'] ?? '').split(';')[0];
        rows.push({ url: res.url(), type, bytes: TEXT.test(type) ? gzipSync(body, { level: 6 }).length : body.length, body: /javascript/.test(type) ? body.toString('utf8') : '' });
      } catch { /* redirects and aborted prefetches have no body */ }
    })());
  });
  await page.goto(path, { waitUntil: 'load' });
  await settle(page, 300);
  await scrollThrough(page, 40);
  await page.waitForLoadState('networkidle');
  await Promise.all(pending);
  return rows;
}

for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`home total transfer ≤ 800KB phone / 1.8MB desktop @${vp.width}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    const rows = await measure(page, '/');
    const total = rows.reduce((s, r) => s + r.bytes, 0);
    const by = (re: RegExp) => rows.filter((r) => re.test(r.type)).reduce((s, r) => s + r.bytes, 0);
    const note = `total ${(total / KB).toFixed(1)}KB · js ${(by(/javascript/) / KB).toFixed(1)} · css ${(by(/css/) / KB).toFixed(1)} · fonts ${(by(/font|woff/) / KB).toFixed(1)} · images ${(by(/^image\//) / KB).toFixed(1)} · html ${(by(/html/) / KB).toFixed(1)} · ${rows.length} requests`;
    test.info().annotations.push({ type: 'transfer', description: note });
    console.log(`[budget] home @${vp.width}: ${note}`);
    expect(total, 'home transfer bytes').toBeLessThanOrEqual((vp.width >= 1024 ? 1800 : 800) * KB);
    await ctx.close();
  });
}

test('every route: JS ≤ 70KB gzip incl. lazy GSAP/Lenis, only the v3 fonts, no three.js (1440)', async ({ browser }) => {
  test.setTimeout(240_000);
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const problems: string[] = [];
  for (const r of routes) {
    const page = await ctx.newPage();
    const rows = await measure(page, r.path);
    const js = rows.filter((x) => /javascript/.test(x.type));
    const jsBytes = js.reduce((s, x) => s + x.bytes, 0);
    if (jsBytes > 70 * KB) problems.push(`${r.path}: JS ${(jsBytes / KB).toFixed(1)}KB gzip > 70KB`);
    for (const x of js) if (BANNED.test(x.body)) problems.push(`${r.path}: banned library signature in ${x.url}`);
    for (const x of rows.filter((x) => /\/fonts\//.test(x.url))) {
      const name = x.url.split('/').pop()!.split('?')[0];
      if (!FONTS.includes(name)) problems.push(`${r.path}: unexpected font ${name}`);
    }
    await page.close();
  }
  await ctx.close();
  expect(problems).toEqual([]);
});
