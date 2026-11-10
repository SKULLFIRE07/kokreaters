import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
const browser = await chromium.launch({ channel: 'chromium', headless: true, args: ['--disable-blink-features=AutomationControlled', '--disable-http2'] });
const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://www.mckinsey.com/in/overview', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
try { await page.locator('#onetrust-accept-btn-handler').click({ timeout: 4000 }); } catch {}
const r = await page.evaluate(() => {
  const out = {};
  const f = document.querySelector('[class*="factoid" i]');
  if (f) out.factoid = [...f.querySelectorAll('*')].flatMap(e => ['::before', '::after'].map(p => { const c = getComputedStyle(e, p); return (c.content !== 'none' && (parseFloat(c.borderLeftWidth) || parseFloat(c.width) <= 2)) ? [e.className?.toString().slice(0, 40), p, c.width, c.height, c.backgroundColor, c.borderLeft] : null; })).filter(Boolean).slice(0, 6);
  if (f) out.factoidItems = [...f.querySelectorAll('*')].filter(e => parseFloat(getComputedStyle(e).borderLeftWidth) > 0 || parseFloat(getComputedStyle(e).borderRightWidth) > 0).slice(0, 4).map(e => [e.className?.toString().slice(0, 40), getComputedStyle(e).borderLeft, getComputedStyle(e).borderRight, Math.round(e.getBoundingClientRect().height)]);
  const tr = new Map();
  for (const e of document.querySelectorAll('a, button, img, [class*="card" i], [class*="item" i]')) { const c = getComputedStyle(e); if (c.transitionDuration !== '0s') { const k = e.tagName + ' ' + c.transitionProperty.slice(0, 50) + ' ' + c.transitionDuration + ' ' + c.transitionTimingFunction; tr.set(k, (tr.get(k) || 0) + 1); } }
  out.transitions = [...tr.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  out.animations = document.getAnimations().length;
  out.scrollBehavior = getComputedStyle(document.documentElement).scrollBehavior;
  let rm = 0; for (const s of document.styleSheets) { try { for (const r of s.cssRules) if (r.conditionText && r.conditionText.includes('prefers-reduced-motion')) rm++; } catch {} }
  out.reducedMotionRules = rm;
  return out;
});
console.log(JSON.stringify(r, null, 1));
// hover a blog card title link to capture hover state
const link = page.locator('a:has-text("Meet our people")').first();
try { const before = await link.evaluate(e => [getComputedStyle(e).backgroundColor, getComputedStyle(e).color]); await link.hover(); await page.waitForTimeout(600); const after = await link.evaluate(e => [getComputedStyle(e).backgroundColor, getComputedStyle(e).color]); console.log('secondary btn hover', before, '->', after); } catch (e) { console.log('hover err', e.message.slice(0, 80)); }
const ttl = page.locator('a:has-text("A new McKinsey look")').first();
try { const b = await ttl.evaluate(e => { const s = e.querySelector('span') || e; return [getComputedStyle(s).color, getComputedStyle(s).textDecorationLine, getComputedStyle(s).borderBottom]; }); await ttl.hover(); await page.waitForTimeout(600); const a = await ttl.evaluate(e => { const s = e.querySelector('span') || e; return [getComputedStyle(s).color, getComputedStyle(s).textDecorationLine, getComputedStyle(s).borderBottom]; }); console.log('card title hover', b, '->', a); } catch (e) { console.log('hover err2', e.message.slice(0, 80)); }
await browser.close();
