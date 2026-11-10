#!/usr/bin/env node
// Throwaway (integrator QA): slice a page into readable PNG chunks, or shoot chrome states.
//   node integ-shoot.mjs slices <url> <width> <outPrefix> [sliceH=1400] [from=0] [to=end]
//   node integ-shoot.mjs els <url> <width> <outPrefix> <selector> [maxH=1600]
//   node integ-shoot.mjs chrome <base> <outDir>
import { chromium } from '../../../web/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const [cmd, ...a] = process.argv.slice(2);
const browser = await chromium.launch();
const ctxFor = (w) => browser.newContext({
  viewport: { width: w, height: w < 600 ? 844 : 900 }, deviceScaleFactor: w < 600 ? 2 : 1,
  isMobile: w < 600, hasTouch: w < 600, locale: 'en-GB',
});
async function settle(page) {
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}
try {
  if (cmd === 'slices') {
    const [url, w, out, sh = '1400', from = '0', to] = a;
    const page = await (await ctxFor(+w)).newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await settle(page);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    const end = Math.min(H, to ? +to : H);
    await mkdir(path.dirname(out), { recursive: true });
    let i = 0;
    for (let y = +from; y < end; y += +sh, i++) {
      const h = Math.min(+sh, end - y);
      await page.screenshot({ path: `${out}-${String(i).padStart(2, '0')}.png`, fullPage: true, clip: { x: 0, y, width: +w, height: h } });
    }
    console.log(`height ${H}, ${i} slices → ${out}-NN.png`);
  } else if (cmd === 'els') {
    const [url, w, out, sel, maxH = '1600'] = a;
    const page = await (await ctxFor(+w)).newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await settle(page);
    const boxes = await page.$$eval(sel, (els) => els.map((e) => { const r = e.getBoundingClientRect(); return { y: r.top + scrollY, h: r.height }; }));
    await mkdir(path.dirname(out), { recursive: true });
    let n = 0;
    for (const [bi, b] of boxes.entries()) {
      for (let y = b.y, k = 0; y < b.y + b.h; y += +maxH, k++) {
        const h = Math.min(+maxH, b.y + b.h - y);
        const f = `${out}-${bi}${k ? `-${k}` : ''}.png`;
        await page.screenshot({ path: f, fullPage: true, clip: { x: 0, y: Math.max(0, y - 8), width: +w, height: h + 16 } });
        n++;
      }
    }
    console.log(`${boxes.length} elements, ${n} shots → ${out}-*.png`);
  }
} finally { await browser.close(); }
