// Supplemental captures: Kearney without Osano overlay, mega menus, mobile menus for RB + Kearney.
import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const REFS = '/home/aryan-budukh/Desktop/ganeshkaka-folder/research/v3/refs/';
const DATA = '/home/aryan-budukh/Desktop/ganeshkaka-folder/research/v3/data/';
const DUA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const MUA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36';
const out = {};
const browser = await chromium.launch({ headless: true, args: ['--disable-blink-features=AutomationControlled'] });

async function ctxFor(mobile) {
  const c = await browser.newContext({ userAgent: mobile ? MUA : DUA, viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, locale: 'en-US' });
  await c.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => undefined }); });
  return c;
}
async function killConsent(page) {
  for (const sel of ['.osano-cm-accept-all', '.osano-cm-button--type_accept', '.osano-cm-dialog__close', '.osano-cm-close', 'button[data-testid="uc-accept-all-button"]']) {
    try { const el = await page.$(sel); if (el && await el.isVisible()) { await el.click({ timeout: 2000 }); await page.waitForTimeout(600); } } catch {}
  }
  await page.evaluate(() => { const h = document.querySelector('#usercentrics-root'); const b = h && h.shadowRoot && h.shadowRoot.querySelector('[data-testid="uc-accept-all-button"]'); if (b) b.click(); });
  await page.addStyleTag({ content: '.osano-cm-window,.osano-cm-dialog,.osano-cm-info-dialog,#usercentrics-root{display:none!important}' });
  await page.waitForTimeout(500);
}
async function load(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await killConsent(page);
}
const btnDump = () => [...document.querySelectorAll('button, a, [role="button"]')].filter(b => { const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top < 110; }).map(b => ({ tag: b.tagName, t: (b.innerText || '').trim().slice(0, 20), al: b.getAttribute('aria-label'), cls: (b.className || '').toString().slice(0, 50), x: Math.round(b.getBoundingClientRect().left), y: Math.round(b.getBoundingClientRect().top), w: Math.round(b.getBoundingClientRect().width), h: Math.round(b.getBoundingClientRect().height) }));

// ---- Kearney desktop home + industry (clean) + mega menus
{
  const c = await ctxFor(false); const p = await c.newPage();
  await load(p, 'https://www.kearney.com/');
  await p.screenshot({ path: REFS + 'bcg-rb-kearney-kearney-home-desktop-fold.jpg', type: 'jpeg', quality: 75 });
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(800);
  await p.screenshot({ path: REFS + 'bcg-rb-kearney-kearney-home-desktop-full.jpg', type: 'jpeg', quality: 70, fullPage: true });
  out.kearneyHome = await p.evaluate(() => {
    const pick = sel => [...document.querySelectorAll(sel)].filter(e => e.getBoundingClientRect().height > 0).slice(0, 12).map(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return { sel, t: (e.innerText || '').trim().slice(0, 50), fs: cs.fontSize, lh: cs.lineHeight, w: cs.fontWeight, c: cs.color, bg: cs.backgroundColor, bd: cs.border, rad: cs.borderRadius, pad: cs.padding, x: Math.round(r.left), y: Math.round(r.top + scrollY), wd: Math.round(r.width), ht: Math.round(r.height) }; });
    return { h: pick('h1,h2,h3,h4'), p: pick('p'), btn: pick('a.btn, .btn, a[class*="button" i], a[class*="cta" i]'), imgs: [...document.querySelectorAll('img')].filter(i => i.getBoundingClientRect().width > 150).slice(0, 10).map(i => { const r = i.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top + scrollY), f: getComputedStyle(i).filter }; }) };
  });
  // mega menu: hover "Your industry"
  for (const label of ['Your industry', 'Your needs']) {
    try {
      const link = p.locator('header a, header button, nav a').filter({ hasText: label }).first();
      await link.hover({ timeout: 4000 }); await p.waitForTimeout(1200);
      await p.screenshot({ path: REFS + `bcg-rb-kearney-kearney-mega-${label.split(' ')[1]}-desktop.jpg`, type: 'jpeg', quality: 75 });
      out['kearneyMega_' + label] = await p.evaluate(() => {
        const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.1 && r.top > 90 && r.top < 900; };
        const links = [...document.querySelectorAll('header a, nav a')].filter(vis);
        const xs = [...new Set(links.map(a => Math.round(a.getBoundingClientRect().left)))].sort((a, b) => a - b);
        const s = links.slice(0, 40).map(a => { const cs = getComputedStyle(a); return [(a.innerText || '').trim().slice(0, 30), cs.fontSize, cs.fontWeight, Math.round(a.getBoundingClientRect().left), Math.round(a.getBoundingClientRect().top), Math.round(a.getBoundingClientRect().height)]; });
        const panel = [...document.querySelectorAll('header *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 1000 && r.height > 150 && r.top >= 60 && r.top < 140; }).map(e => ({ cls: e.className.toString().slice(0, 60), h: Math.round(e.getBoundingClientRect().height), top: Math.round(e.getBoundingClientRect().top), bg: getComputedStyle(e).backgroundColor }))[0];
        return { columnsX: xs, links: s, panel };
      });
      await p.mouse.move(700, 850); await p.waitForTimeout(600);
    } catch (e) { out['kearneyMegaErr_' + label] = String(e).slice(0, 200); }
  }
  await load(p, 'https://www.kearney.com/industry');
  await p.screenshot({ path: REFS + 'bcg-rb-kearney-kearney-industry-desktop-full.jpg', type: 'jpeg', quality: 75, fullPage: true });
  out.kearneyIndustry = await p.evaluate(() => {
    const links = [...document.querySelectorAll('main a, #main a, .content a, a')].filter(a => /\/industry\//.test(a.getAttribute('href') || '') && a.getBoundingClientRect().top > 400 && a.getBoundingClientRect().top < 900 && a.getBoundingClientRect().width > 0);
    return links.slice(0, 16).map(a => { const cs = getComputedStyle(a); const r = a.getBoundingClientRect(); return { t: (a.innerText || '').trim(), fs: cs.fontSize, lh: cs.lineHeight, w: cs.fontWeight, c: cs.color, td: cs.textDecorationLine + ' ' + cs.textDecorationThickness + ' ' + cs.textDecorationColor, bb: cs.borderBottom, x: Math.round(r.left), y: Math.round(r.top), ht: Math.round(r.height), wd: Math.round(r.width) }; });
  });
  await c.close();
}

// ---- RB desktop mega menu (Expertise)
{
  const c = await ctxFor(false); const p = await c.newPage();
  await load(p, 'https://www.rolandberger.com/en/');
  try {
    const link = p.locator('header a, header button').filter({ hasText: 'Expertise' }).first();
    await link.hover({ timeout: 4000 }); await p.waitForTimeout(1000);
    const vis = await p.evaluate(() => [...document.querySelectorAll('header a')].filter(a => { const r = a.getBoundingClientRect(); return r.width > 0 && r.top > 170; }).length);
    if (vis < 5) { await link.click({ timeout: 4000 }).catch(() => {}); await p.waitForTimeout(1200); }
    await p.screenshot({ path: REFS + 'bcg-rb-kearney-rb-mega-expertise-desktop.jpg', type: 'jpeg', quality: 75 });
    out.rbMega = await p.evaluate(() => {
      const links = [...document.querySelectorAll('header a, nav a')].filter(a => { const r = a.getBoundingClientRect(); const cs = getComputedStyle(a); return r.width > 0 && r.top > 170 && r.top < 900 && cs.visibility !== 'hidden'; });
      return { columnsX: [...new Set(links.map(a => Math.round(a.getBoundingClientRect().left)))].sort((a, b) => a - b), links: links.slice(0, 30).map(a => { const cs = getComputedStyle(a); return [(a.innerText || '').trim().slice(0, 30), cs.fontSize, cs.fontWeight, cs.color, Math.round(a.getBoundingClientRect().left), Math.round(a.getBoundingClientRect().top)]; }) };
    });
  } catch (e) { out.rbMegaErr = String(e).slice(0, 200); }
  await c.close();
}

// ---- Mobile menus: Kearney + RB
for (const [slug, url] of [['kearney-home', 'https://www.kearney.com/'], ['kearney-industry', 'https://www.kearney.com/industry'], ['rb-home', 'https://www.rolandberger.com/en/']]) {
  const c = await ctxFor(true); const p = await c.newPage();
  try {
    await load(p, url);
    await p.screenshot({ path: REFS + `bcg-rb-kearney-${slug}-mobile-fold.jpg`, type: 'jpeg', quality: 75 });
    if (slug.startsWith('kearney')) {
      await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200)); } window.scrollTo(0, 0); });
      await p.waitForTimeout(600);
      await p.screenshot({ path: REFS + `bcg-rb-kearney-${slug}-mobile-full.jpg`, type: 'jpeg', quality: 70, fullPage: true });
    }
    const dump = await p.evaluate(btnDump);
    out[slug + '_mobileTopButtons'] = dump;
    out[slug + '_mobileHeader'] = await p.evaluate(() => { const bars = [...document.querySelectorAll('body *')].filter(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return (cs.position === 'fixed' || cs.position === 'sticky' || e.tagName === 'HEADER') && r.top <= 2 && r.height > 30 && r.height < 140 && r.width > 300; }).map(e => ({ tag: e.tagName, cls: e.className.toString().slice(0, 50), h: Math.round(e.getBoundingClientRect().height), bg: getComputedStyle(e).backgroundColor })); return bars.slice(0, 4); });
    // choose burger: right-most small square-ish button in top bar that isn't search/lang
    const target = dump.filter(b => b.w <= 70 && b.h <= 70 && b.w >= 18 && !/search|skip|EN|DE|jobs/i.test((b.al || '') + b.t + b.cls)).sort((a, b) => b.x - a.x)[0];
    out[slug + '_burger'] = target || null;
    if (target) {
      await p.mouse.click(target.x + target.w / 2, target.y + target.h / 2);
      await p.waitForTimeout(1400);
      await p.screenshot({ path: REFS + `bcg-rb-kearney-${slug}-mobile-menu.jpg`, type: 'jpeg', quality: 75 });
      out[slug + '_menuItems'] = await p.evaluate(() => [...document.querySelectorAll('a, button')].filter(a => { const r = a.getBoundingClientRect(); const cs = getComputedStyle(a); return r.width > 0 && r.height > 0 && r.top > 40 && r.top < 844 && cs.visibility !== 'hidden' && (a.innerText || '').trim().length > 1; }).slice(0, 16).map(a => { const cs = getComputedStyle(a); const r = a.getBoundingClientRect(); return [(a.innerText || '').trim().slice(0, 28), cs.fontSize, cs.fontWeight, Math.round(r.height), Math.round(r.left), Math.round(r.top)]; }));
    }
  } catch (e) { out[slug + '_mobileErr'] = String(e).slice(0, 200); }
  await c.close();
}
fs.writeFileSync(DATA + 'bcg-rb-kearney-extra.json', JSON.stringify(out, null, 1));
await browser.close();
console.log(JSON.stringify(out).slice(0, 200));
