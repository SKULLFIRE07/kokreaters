import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
const browser = await chromium.launch({ channel: 'chromium', headless: true, args: ['--disable-blink-features=AutomationControlled', '--disable-http2'] });
const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://www.mckinsey.com/in/our-insights', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
console.log(JSON.stringify(await page.evaluate(() => [...new Set([...document.querySelectorAll('main a[href]')].map(a => a.href))].slice(0, 40)), null, 0));
await browser.close();
