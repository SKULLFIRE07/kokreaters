// Kearney: mega menu via mouse coords + mobile burger (third attempt for these URLs)
import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const REFS = '/home/aryan-budukh/Desktop/ganeshkaka-folder/research/v3/refs/';
const b = await chromium.launch({ headless: true, args: ['--disable-blink-features=AutomationControlled'] });
const res = {};
async function prep(p) {
  await p.goto('https://www.kearney.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(2000);
  for (const s of ['.osano-cm-accept-all', '.osano-cm-dialog__close', '.osano-cm-close']) { const e = await p.$(s); if (e && await e.isVisible().catch(() => false)) { await e.click().catch(() => {}); await p.waitForTimeout(500); } }
  await p.addStyleTag({ content: '.osano-cm-window,.osano-cm-dialog,[class*="equally-ai"]{display:none!important}' });
}
const navDump = () => [...document.querySelectorAll('a, button, span')].filter(a => { const r = a.getBoundingClientRect(); const cs = getComputedStyle(a); return r.width > 0 && r.height > 0 && r.top > 95 && r.top < 900 && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.2 && (a.innerText || '').trim().length > 1 && a.childElementCount === 0; }).slice(0, 40).map(a => { const cs = getComputedStyle(a); const r = a.getBoundingClientRect(); return [(a.innerText || '').trim().slice(0, 34), cs.fontSize, cs.fontWeight, cs.color, Math.round(r.left), Math.round(r.top)]; });
{
  const c = await b.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', viewport: { width: 1440, height: 900 } });
  const p = await c.newPage(); await prep(p);
  res.navPos = await p.evaluate(() => [...document.querySelectorAll('a')].filter(a => /^(Your industry|Your needs)$/.test((a.innerText || '').trim())).map(a => { const r = a.getBoundingClientRect(); return { t: a.innerText.trim(), x: r.left, y: r.top, w: r.width, h: r.height, vis: getComputedStyle(a).visibility }; }));
  for (const n of res.navPos.filter(n => n.w > 0).slice(0, 2)) {
    await p.mouse.move(n.x + n.w / 2, n.y + n.h / 2); await p.waitForTimeout(1500);
    let items = await p.evaluate(navDump);
    if (items.length < 5) { await p.mouse.click(n.x + n.w / 2, n.y + n.h / 2); await p.waitForTimeout(1500); items = await p.evaluate(navDump); }
    res['mega_' + n.t] = items;
    await p.screenshot({ path: REFS + `bcg-rb-kearney-kearney-mega-${n.t.split(' ')[1]}-desktop.jpg`, type: 'jpeg', quality: 75 });
    await p.keyboard.press('Escape'); await p.mouse.move(700, 880); await p.waitForTimeout(800);
  }
  await c.close();
}
{
  const c = await b.newContext({ userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await c.newPage(); await prep(p);
  await p.screenshot({ path: REFS + 'bcg-rb-kearney-kearney-home-mobile-fold.jpg', type: 'jpeg', quality: 75 });
  res.mBurger = await p.evaluate(() => { const el = document.elementFromPoint(360, 28); return el ? { tag: el.tagName, cls: el.className.toString().slice(0, 60), al: el.getAttribute('aria-label') } : null; });
  await p.mouse.click(360, 28); await p.waitForTimeout(1500);
  await p.screenshot({ path: REFS + 'bcg-rb-kearney-kearney-home-mobile-menu.jpg', type: 'jpeg', quality: 75 });
  res.mMenu = await p.evaluate(() => [...document.querySelectorAll('a, button')].filter(a => { const r = a.getBoundingClientRect(); const cs = getComputedStyle(a); return r.width > 0 && r.height > 0 && r.top > 40 && r.top < 844 && cs.visibility !== 'hidden' && (a.innerText || '').trim().length > 1; }).slice(0, 14).map(a => { const cs = getComputedStyle(a); const r = a.getBoundingClientRect(); return [(a.innerText || '').trim().slice(0, 28), cs.fontSize, cs.fontWeight, Math.round(r.height), Math.round(r.left), Math.round(r.top)]; }));
  await c.close();
}
fs.writeFileSync('/home/aryan-budukh/Desktop/ganeshkaka-folder/research/v3/data/bcg-rb-kearney-kmenu.json', JSON.stringify(res, null, 1));
console.log(JSON.stringify(res).slice(0, 3500));
await b.close();
