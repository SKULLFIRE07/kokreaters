import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
const browser = await chromium.launch({ headless: true, args: ['--disable-blink-features=AutomationControlled'] });
const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', viewport: { width: 1440, height: 900 }, locale: 'en-US' });
const p = await ctx.newPage();
await p.goto('https://www.bcg.com/publications', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
const links = await p.evaluate(() => [...new Set([...document.querySelectorAll('a[href*="/publications/20"]')].map(a => a.href + ' :: ' + (a.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70)))]);
console.log(links.slice(0, 20).join('\n'));
await browser.close();
