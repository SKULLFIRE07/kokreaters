/**
 * smoke (infra.md §1.2): every route returns 200, renders one visible h1 inside the v3 chrome, logs no console errors,
 * makes no third-party or failed requests (privacy gate: photos, fonts and scripts are self-hosted), and site.ts boots
 * without the 3 s `motion-failed` fallback. The site's own CSP from dist/_headers is injected into every document, so
 * a blocked inline script fails here, not in production. Plus the 404 and the machine files.
 */
import { test, expect } from '@playwright/test';
import { routes, builtCsp, settle, scrollThrough, indexable, build } from './helpers';

const csp = builtCsp();

test('dist/_headers carries a CSP (run node scripts/csp-hash.mjs after the build)', () => {
  expect(csp, 'Content-Security-Policy in dist/_headers').toBeTruthy();
  expect(csp!).toMatch(/script-src 'self' 'sha256-/);
});

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
    await settle(page, 300);
    await scrollThrough(page, 40);

    await expect(page.locator('h1'), 'exactly one h1').toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('header.site-header'), 'one site header').toHaveCount(1);
    await expect(page.locator('main#main'), 'one main#main').toHaveCount(1);
    await expect(page.locator('footer#site-footer'), 'one footer#site-footer').toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.lang)).toBe('en-GB');
    const cls = await page.evaluate(() => document.documentElement.className);
    expect(cls, 'site.ts booted (no 3 s fallback)').toContain('motion-booted');
    expect(cls).not.toContain('motion-failed');
    expect(cls).not.toContain('no-js');

    const violations = await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp);
    expect(violations, 'CSP violations').toEqual([]);
    expect(errors, 'console errors').toEqual([]);
    expect(foreign, 'third-party requests').toEqual([]);
    expect(failed, 'failed requests').toEqual([]);
  });
}

test('unknown URL serves the 404 page with status 404, one h1 and noindex', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const res = await page.goto('/this-page-does-not-exist', { waitUntil: 'load' });
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('body[data-page="notfound"]')).toHaveCount(1);
  expect(await page.locator('meta[name="robots"]').getAttribute('content')).toMatch(/noindex/);
  for (const href of ['/', '/expertise', '/insights', '/contact']) await expect(page.locator(`main a[href="${href}"]`).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('machine files: robots.txt (per indexable), llms.txt, sitemap, build-info', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  const rt = await robots.text();
  if (indexable) { expect(rt).toMatch(/Allow:\s*\//); expect(rt).toContain('Sitemap: https://kokreaters.com/sitemap-index.xml'); }
  else expect(rt).toMatch(/Disallow:\s*\/\s*$/m);

  const llms = await request.get('/llms.txt');
  expect(llms.status()).toBe(200);
  const lt = await llms.text();
  expect(lt.startsWith('# KoKreaters')).toBe(true);
  expect(lt).toContain('office@kokreaters.com');

  expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
  const sm = await request.get('/sitemap-0.xml');
  expect(sm.status()).toBe(200);
  const xml = await sm.text();
  for (const r of routes) expect(xml, `sitemap lists ${r.path}`).toContain(`<loc>https://kokreaters.com${r.path}</loc>`);
  expect(xml).not.toContain('/404');
  expect(xml).not.toContain('/styleguide');
  expect(xml).not.toContain('build-info');

  const info = await (await request.get('/build-info.json')).json();
  expect(info.mode).toBe(build.mode);
});
