// Throwaway (integrator QA): chrome states. node integ-chrome.mjs <base> <outDir> [path=/contact]
import { chromium } from '../../../web/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';
const [base, out, route = '/about'] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const b = await chromium.launch();
const hideTb = (p) => p.addStyleTag({ content: 'astro-dev-toolbar{display:none!important}' });
try {
  // desktop
  const d = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await d.goto(base + route, { waitUntil: 'networkidle' }); await hideTb(d);
  await d.evaluate(() => document.fonts.ready);
  await d.screenshot({ path: `${out}/chrome-1440-top.png`, clip: { x: 0, y: 0, width: 1440, height: 260 } });
  await d.click('[aria-controls="mega-expertise"]'); await d.waitForTimeout(900);
  await d.screenshot({ path: `${out}/chrome-1440-mega.png` });
  await d.keyboard.press('Escape'); await d.waitForTimeout(500);
  await d.click('[aria-controls="menu-industries"]'); await d.waitForTimeout(900);
  await d.screenshot({ path: `${out}/chrome-1440-industries.png`, clip: { x: 0, y: 0, width: 1440, height: 760 } });
  await d.keyboard.press('Escape'); await d.waitForTimeout(400);
  await d.mouse.wheel(0, 900); await d.waitForTimeout(700);
  await d.hover('a.site-nav__link[href="/impact"]'); await d.waitForTimeout(500);
  await d.screenshot({ path: `${out}/chrome-1440-scrolled-hover.png`, clip: { x: 0, y: 0, width: 1440, height: 200 } });
  // keyboard focus ring in mega
  await d.evaluate(() => scrollTo(0, 0)); await d.waitForTimeout(300);
  await d.focus('[aria-controls="mega-expertise"]'); await d.keyboard.press('Enter'); await d.waitForTimeout(700);
  await d.keyboard.press('Tab'); await d.keyboard.press('Tab'); await d.waitForTimeout(300);
  await d.screenshot({ path: `${out}/chrome-1440-mega-focus.png`, clip: { x: 0, y: 0, width: 1440, height: 560 } });
  // phones
  for (const w of [390, 360]) {
    const m = await (await b.newContext({ viewport: { width: w, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
    await m.goto(base + route, { waitUntil: 'networkidle' }); await hideTb(m);
    await m.evaluate(() => document.fonts.ready);
    await m.screenshot({ path: `${out}/chrome-${w}-top.png` });
    await m.tap('[data-menu-toggle]'); await m.waitForTimeout(900);
    await m.screenshot({ path: `${out}/chrome-${w}-menu.png` });
    await m.tap('[aria-controls="m-menu-expertise"]'); await m.waitForTimeout(700);
    await m.screenshot({ path: `${out}/chrome-${w}-menu-expertise.png` });
    await m.evaluate(() => { const s = document.getElementById('mobile-menu'); s.scrollTop = s.scrollHeight; }); await m.waitForTimeout(400);
    await m.screenshot({ path: `${out}/chrome-${w}-menu-bottom.png` });
    const ov = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(w, 'overflow', ov);
  }
} finally { await b.close(); }
