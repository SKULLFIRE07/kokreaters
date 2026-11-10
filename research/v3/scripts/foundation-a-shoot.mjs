// Throwaway QA: full-page shots of /styleguide at 1440 and 390 (reduced motion = final state), plus crops.
// node foundation-a-shoot.mjs [path] [name]
import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
const base = process.env.BASE ?? 'http://127.0.0.1:4400';
const path = process.argv[2] ?? '/styleguide';
const name = process.argv[3] ?? 'styleguide';
const out = '/home/aryan-budukh/Desktop/ganeshkaka-folder/research/v3/shots/foundation/';
const b = await chromium.launch();
for (const [w, h, dpr] of [[1440, 900, 1], [390, 844, 2]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  const errors = [];
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('requestfailed', (r) => errors.push('failed ' + r.url()));
  await p.goto(base + path, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { await document.fonts.ready; for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
  await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 60000 }).catch(() => console.log('images still loading'));
  await p.addStyleTag({ content: 'astro-dev-toolbar{display:none!important}' });
  await p.waitForTimeout(400);
  const info = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const over = [...document.querySelectorAll('body *')].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 1 || r.left < -1); })
      .filter((el) => !el.closest('.hero__media, .hero__bg')).slice(0, 12).map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')} ${Math.round(el.getBoundingClientRect().left)}→${Math.round(el.getBoundingClientRect().right)}`);
    const fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.style} ${f.weight}`);
    return { h: document.body.scrollHeight, sw: document.documentElement.scrollWidth, vw, over, fonts, noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length };
  });
  console.log(w, JSON.stringify(info), errors.slice(0, 8));
  await p.screenshot({ path: `${out}${name}-${w}.png`, fullPage: true });
  await ctx.close();
}
await b.close();
