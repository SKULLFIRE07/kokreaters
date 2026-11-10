#!/usr/bin/env node
/**
 * qa-shoot.mjs (REDESIGN-V3 §3, dev/QA helper). Playwright, no test runner.
 *
 *   node scripts/qa-shoot.mjs <path> [name] [--base http://127.0.0.1:4321] [--widths 1440,390] [--motion] [--img-timeout 45000]
 *
 * For each width: emulates prefers-reduced-motion: reduce (so every reveal is visible at once; pass --motion to keep
 * motion on), scrolls the page through slowly (half a viewport per step, waiting for the images in view), then makes
 * every <img> eager and waits until all of them have loaded AND decoded (a slow dev server can take 10 s+ to generate
 * a phone-size variant; capped by --img-timeout), returns to the top, then writes
 *   ../research/v3/shots/<name>-<width>.jpg        full page, JPEG q72
 *   ../research/v3/shots/<name>-<width>-fold.jpg   first fold only
 * and prints: page height, horizontal-overflow offenders (selector + width), console errors, failed requests,
 * images without alt, the h1–h3 outline, and any visible text matching /CONFIRM|DRAFT/.
 * Widths below 600 use a touch phone profile (DPR 2; pages taller than ~32,000px are saved at CSS scale, JPEG limit).
 * The Astro dev toolbar is hidden. Always exits 0: it reports, it never gates.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.resolve(here, '../../research/v3/shots');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const base = (opt('--base', 'http://127.0.0.1:4321') || '').replace(/\/$/, '');
const widths = String(opt('--widths', '1440,390')).split(',').map(Number).filter(Boolean);
const imgTimeout = Number(opt('--img-timeout', '45000')) || 45000;
const flag = (k) => { const i = args.indexOf(k); if (i < 0) return false; args.splice(i, 1); return true; };
const motion = flag('--motion');
const route = args[0] ?? '/';
const name = args[1] ?? (route.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-') || 'home');

const log = (s = '') => process.stdout.write(`${s}\n`);

async function shoot(browser, width) {
  const phone = width < 600;
  const ctx = await browser.newContext({
    viewport: { width, height: phone ? 844 : 900 },
    deviceScaleFactor: phone ? 2 : 1,
    isMobile: phone, hasTouch: phone,
    locale: 'en-GB', timezoneId: 'Europe/Amsterdam',
    reducedMotion: motion ? 'no-preference' : 'reduce',
  });
  const page = await ctx.newPage();
  const consoleErrors = [], failed = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 240)); });
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message.slice(0, 240)}`));
  page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText ?? 'failed'} ${r.url()}`));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });

  const url = `${base}${route}`;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
  } catch (e) {
    log(`  ! navigation: ${e.message.split('\n')[0]}`);
  }
  await page.addStyleTag({ content: 'astro-dev-toolbar{display:none!important}' }).catch(() => {});   // dev overlay
  await page.evaluate(() => document.fonts?.ready).catch(() => {});

  // Scroll through slowly (reveals, lazy images), waiting for the images in view at each step, then back to the top.
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const inView = () => [...document.images].filter((i) => { const r = i.getBoundingClientRect(); return r.bottom > -innerHeight && r.top < innerHeight * 2; });
    const settle = (imgs, ms) => Promise.race([Promise.all(imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); })))), sleep(ms)]);
    const step = Math.round(innerHeight * 0.5);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await sleep(220);
      await settle(inView(), 4000);
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await sleep(400);
  });
  // Every image eager, then wait for load + decode (Chromium's full-page capture does not repaint a far off-screen
  // image that was never decoded, which is what showed up as grey boxes).
  const imgState = await page.evaluate(async (ms) => {
    const sleep = (t) => new Promise((r) => setTimeout(r, t));
    const imgs = [...document.images];
    for (const i of imgs) if (i.loading === 'lazy') i.loading = 'eager';
    const one = (i) => (i.complete && i.naturalWidth ? Promise.resolve() : new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }))
      .then(() => (i.naturalWidth && i.decode ? i.decode().catch(() => {}) : undefined));
    await Promise.race([Promise.all(imgs.map(one)), sleep(ms)]);
    const pending = imgs.filter((i) => !(i.complete && i.naturalWidth)).map((i) => i.currentSrc || i.src);
    window.scrollTo(0, 0);
    return { total: imgs.length, pending };
  }, imgTimeout).catch(() => ({ total: 0, pending: [] }));
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(motion ? 1200 : 500);

  const report = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const sel = (el) => {
      let s = el.tagName.toLowerCase();
      if (el.id) s += `#${el.id}`;
      const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter((c) => c && !c.startsWith('astro-')).slice(0, 3) : [];
      if (cls.length) s += `.${cls.join('.')}`;
      return s;
    };
    const clipped = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const ox = getComputedStyle(p).overflowX;
        if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') {
          const r = p.getBoundingClientRect();
          if (r.right <= vw + 1 && r.left >= -1) return true;
        }
      }
      return false;
    };
    const wide = [];
    for (const el of document.body.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue;
      if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;          // SVG internals: report the <svg>
      const r = el.getBoundingClientRect();
      if (r.width <= 2 || r.height <= 2 || r.right <= 0) continue;                   // honeypots, visually-hidden text
      if (el.closest('[aria-hidden="true"]') && (r.right <= 0 || r.left >= vw)) continue;
      if ((r.right > vw + 1 || r.left < -1) && !clipped(el)) wide.push({ el, s: sel(el), w: Math.round(r.width), l: Math.round(r.left), r: Math.round(r.right) });
    }
    // outermost offenders only (their descendants overflow with them)
    const set = new Set(wide.map((x) => x.el));
    const outer = wide.filter((x) => { for (let p = x.el.parentElement; p; p = p.parentElement) if (set.has(p)) return false; return true; })
      .map(({ s, w, l, r }) => ({ s, w, l, r }));
    const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[hidden],[aria-hidden="true"]'); };
    const imgsNoAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.currentSrc || i.src);
    const headings = [...document.querySelectorAll('h1, h2, h3')].map((h) => `${'  '.repeat(Number(h.tagName[1]) - 1)}${h.tagName.toLowerCase()}${visible(h) ? '' : ' (hidden)'}: ${h.textContent.replace(/\s+/g, ' ').trim().slice(0, 90)}`);
    const marks = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (/\b(CONFIRM|DRAFT)\b/.test(n.textContent) && n.parentElement && visible(n.parentElement)) marks.push(n.textContent.replace(/\s+/g, ' ').trim().slice(0, 100));
    }
    return {
      height: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth, vw,
      wide: outer, imgsNoAlt, headings, marks,
    };
  });

  const full = path.join(SHOTS, `${name}-${width}.jpg`);
  await mkdir(path.dirname(full), { recursive: true });   // a name like "about/hero" shoots into a subfolder
  const fold = path.join(SHOTS, `${name}-${width}-fold.jpg`);
  await page.screenshot({ path: fold, type: 'jpeg', quality: 72 });
  // JPEG tops out at 65,535px: tall pages on DPR-2 phones are captured at CSS scale (and capped) instead of failing.
  const dpr = phone ? 2 : 1;
  const tall = report.height * dpr > 65000;
  await page.screenshot({
    path: full, type: 'jpeg', quality: 72, fullPage: true,
    ...(tall ? { scale: 'css', ...(report.height > 65000 ? { clip: { x: 0, y: 0, width, height: 65000 } } : {}) } : {}),
  });

  log(`\n── ${url} @ ${width}px ──`);
  log(`  height: ${report.height}px   scrollWidth: ${report.scrollWidth} / viewport ${report.vw}${report.scrollWidth > report.vw ? '  ← HORIZONTAL SCROLL' : ''}`);
  log(`  wider than viewport: ${report.wide.length ? '' : 'none'}`);
  for (const w of report.wide.slice(0, 20)) log(`    ${w.s}  width ${w.w} (left ${w.l}, right ${w.r})`);
  if (report.wide.length > 20) log(`    … ${report.wide.length - 20} more`);
  log(`  console errors: ${consoleErrors.length ? '' : 'none'}`);
  for (const e of consoleErrors) log(`    ${e}`);
  log(`  failed requests: ${failed.length ? '' : 'none'}`);
  for (const f of [...new Set(failed)]) log(`    ${f}`);
  log(`  images: ${imgState.total}, not loaded before capture: ${imgState.pending.length ? '' : 'none'}`);
  for (const i of imgState.pending.slice(0, 10)) log(`    ${i}`);
  log(`  images without alt: ${report.imgsNoAlt.length ? '' : 'none'}`);
  for (const i of report.imgsNoAlt) log(`    ${i}`);
  log(`  CONFIRM/DRAFT visible: ${report.marks.length ? '' : 'none'}`);
  for (const m of report.marks.slice(0, 15)) log(`    "${m}"`);
  log('  headings:');
  for (const h of report.headings) log(`    ${h}`);
  log(`  shots: ${path.relative(process.cwd(), full)}, ${path.relative(process.cwd(), fold)}`);
  await ctx.close();
}

async function main() {
  const exe = chromium.executablePath();
  const browser = await chromium.launch(existsSync(exe) ? {} : { channel: 'chrome' });
  try {
    for (const w of widths) {
      // one retry when the page reloaded under us (dev-server HMR after a file save destroys the context)
      for (let attempt = 1; attempt <= 2; attempt++) {
        try { await shoot(browser, w); break; } catch (e) {
          const msg = e.message.split('\n')[0];
          if (attempt === 1 && /context was destroyed|navigation|Target closed/i.test(msg)) { log(`  … ${w}px: ${msg} (retrying)`); continue; }
          log(`  ! ${w}px: ${msg}`); break;
        }
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => log(`qa-shoot: ${e.message}`)).finally(() => process.exit(0));
