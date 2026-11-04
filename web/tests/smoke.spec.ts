/**
 * smoke (DESIGN-SPEC 9 W3-tests): every route returns 200 from `astro preview`, has exactly one h1, logs no console
 * errors, makes no third-party or failed requests (privacy gate, section 10), and boots motion without the 3 s
 * motion-failed fallback. The site's own CSP from dist/_headers is applied to each document so a blocked inline
 * script shows up here, not in production.
 */
import { test, expect } from '@playwright/test';
import { routes, builtCsp, settle, scrollThrough, mode } from './helpers';

const csp = builtCsp();

for (const r of routes) {
  test(`smoke ${r.path}`, async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const errors: string[] = [];
    const foreign: string[] = [];
    const failed: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('request', (req) => {
      const u = req.url();
      if (!u.startsWith('data:') && !u.startsWith('blob:') && new URL(u).origin !== origin) foreign.push(u);
    });
    page.on('requestfailed', (req) => failed.push(`${req.url()} ${req.failure()?.errorText ?? ''}`));
    page.on('response', (res) => { if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`); });
    await page.addInitScript(() => {
      (window as unknown as { __csp: string[] }).__csp = [];
      document.addEventListener('securitypolicyviolation', (e) => (window as unknown as { __csp: string[] }).__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
    });
    if (csp) {
      await page.route((url) => url.origin === origin, async (route) => {
        if (route.request().resourceType() !== 'document') return route.continue();
        const res = await route.fetch();
        await route.fulfill({ response: res, headers: { ...res.headers(), 'content-security-policy': csp } });
      });
    }

    const res = await page.goto(r.path, { waitUntil: 'load' });
    expect(res?.status(), 'HTTP status').toBe(200);
    await settle(page, 600);
    await scrollThrough(page, 40);

    await expect(page.locator('h1'), 'exactly one h1').toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('header.site-header, body > header'), 'one site header').toHaveCount(1);
    await expect(page.locator('main#main')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.lang)).toBe('en-GB');
    const cls = await page.evaluate(() => document.documentElement.className);
    expect(cls, 'motion booted without the 3 s fallback').not.toContain('motion-failed');
    expect(cls).not.toContain('no-js');

    const violations = await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp);
    expect(violations, 'CSP violations').toEqual([]);
    expect(errors, 'console errors').toEqual([]);
    expect(foreign, 'third-party requests').toEqual([]);
    expect(failed, 'failed requests').toEqual([]);
  });
}

test('unknown URL serves the 404 page with status 404, one h1 and noindex', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist', { waitUntil: 'load' });
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('body[data-page="notfound"]')).toHaveCount(1);
  expect(await page.locator('meta[name="robots"]').getAttribute('content')).toMatch(/noindex/);
});

test('machine files: robots.txt, llms.txt and the sitemap', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  const rt = await robots.text();
  if (mode === 'staging') expect(rt).toMatch(/Disallow:\s*\/\s*$/m);
  else { expect(rt).toMatch(/Allow:\s*\//); expect(rt).toContain('Sitemap: https://kokreaters.com/sitemap-index.xml'); }

  const llms = await request.get('/llms.txt');
  expect(llms.status()).toBe(200);
  const lt = await llms.text();
  expect(lt.startsWith('# KoKreaters')).toBe(true);
  expect(lt).toContain('office@kokreaters.com');

  const idx = await request.get('/sitemap-index.xml');
  expect(idx.status()).toBe(200);
  const sm = await request.get('/sitemap-0.xml');
  expect(sm.status()).toBe(200);
  const xml = await sm.text();
  for (const r of routes) {
    const loc = `https://kokreaters.com${r.path === '/' ? '/' : r.path}`;
    expect(xml, `sitemap lists ${r.path}`).toContain(`<loc>${loc}</loc>`);
  }
  expect(xml).not.toContain('/404');
});
