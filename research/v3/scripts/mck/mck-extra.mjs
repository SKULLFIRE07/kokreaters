// India page extras: footer screenshot, links, mobile menu, header on scroll-up
import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
const OUT = '/home/aryan-budukh/Desktop/ganeshkaka-folder/research/v3';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
const browser = await chromium.launch({ channel: 'chromium', headless: true, args: ['--disable-blink-features=AutomationControlled', '--disable-http2'] });
for (const vp of [{ n: 'desktop', v: { width: 1440, height: 900 }, s: 1 }, { n: 'mobile', v: { width: 390, height: 844 }, s: 2 }]) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: vp.v, deviceScaleFactor: vp.s, isMobile: vp.n === 'mobile', hasTouch: vp.n === 'mobile' });
  const page = await ctx.newPage();
  const r = await page.goto('https://www.mckinsey.com/in/overview', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log(vp.n, r.status());
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  try { await page.locator('#onetrust-accept-btn-handler').click({ timeout: 4000 }); } catch {}
  if (vp.n === 'desktop') {
    const links = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map(a => a.href))].filter(h => h.includes('mckinsey.com')));
    console.log(JSON.stringify(links));
  }
  // scroll to bottom slowly
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200)); } window.scrollTo(0, document.documentElement.scrollHeight); });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/refs/mckinsey-india-${vp.n}-footer.jpg`, type: 'jpeg', quality: 70 });
  const ft = await page.evaluate(() => { const f = document.querySelector('footer'); if (!f) return null; const r = f.getBoundingClientRect(); const cs = getComputedStyle(f);
    const blocks = [...f.querySelectorAll('*')].filter(e => { const rr = e.getBoundingClientRect(); return rr.height > 0 && e.children.length === 0 && (e.innerText || '').trim(); }).slice(0, 40).map(e => { const c = getComputedStyle(e); const rr = e.getBoundingClientRect(); return [e.tagName, (e.innerText || '').trim().slice(0, 28), c.fontSize, c.fontWeight, c.lineHeight, c.color, Math.round(rr.left), Math.round(rr.top - r.top)]; });
    return { h: Math.round(r.height), bg: cs.backgroundColor, bt: cs.borderTop, blocks, txt: f.innerText.replace(/\s+/g, ' ').slice(0, 500) }; });
  console.log('FOOTER', vp.n, JSON.stringify(ft));
  // scroll up a bit: does header reappear?
  await page.evaluate(() => window.scrollBy(0, -400)); await page.waitForTimeout(1200);
  const hdrUp = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const s = getComputedStyle(e); const rr = e.getBoundingClientRect(); return (s.position === 'fixed' || s.position === 'sticky') && rr.height > 20 && rr.width > 300 && rr.bottom > 0 && rr.top < 200; }).map(e => ({ cls: e.className?.toString().slice(0, 50), top: Math.round(e.getBoundingClientRect().top), h: Math.round(e.getBoundingClientRect().height), bg: getComputedStyle(e).backgroundColor })));
  console.log('HEADER-on-scroll-up', vp.n, JSON.stringify(hdrUp));
  await page.screenshot({ path: `${OUT}/refs/mckinsey-india-${vp.n}-scrollup.jpg`, type: 'jpeg', quality: 60 });
  // menu
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
  const btn = await page.evaluate(() => { const hdr = document.querySelector('header'); const c = [...(hdr || document).querySelectorAll('button, [role=button], a')].filter(b => b.getBoundingClientRect().width > 0 && b.getBoundingClientRect().left < 80 && b.getBoundingClientRect().top < 120); return c.map(b => ({ tag: b.tagName, aria: b.getAttribute('aria-label'), cls: b.className?.toString().slice(0, 60), x: Math.round(b.getBoundingClientRect().left), y: Math.round(b.getBoundingClientRect().top), w: Math.round(b.getBoundingClientRect().width), h: Math.round(b.getBoundingClientRect().height) })); });
  console.log('MENU-BTNS', vp.n, JSON.stringify(btn));
  if (btn.length) {
    const b = btn[0]; await page.mouse.click(b.x + b.w / 2, b.y + b.h / 2); await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/refs/mckinsey-india-${vp.n}-menu.jpg`, type: 'jpeg', quality: 70 });
    const menu = await page.evaluate(() => [...document.querySelectorAll('a, button')].filter(a => { const r = a.getBoundingClientRect(); const s = getComputedStyle(a); return r.height > 0 && r.top >= 0 && r.top < innerHeight && s.visibility !== 'hidden' && (a.innerText || '').trim(); }).slice(0, 24).map(a => { const c = getComputedStyle(a); const r = a.getBoundingClientRect(); return [(a.innerText || '').trim().slice(0, 24), c.fontSize, c.fontWeight, c.color, Math.round(r.left), Math.round(r.top), Math.round(r.height)]; }));
    console.log('MENU-OPEN', vp.n, JSON.stringify(menu));
  }
  await ctx.close();
}
await browser.close();
