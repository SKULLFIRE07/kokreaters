import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
const [url, ch] = process.argv.slice(2);
const browser = await chromium.launch({ channel: ch, headless: true, args: ['--disable-blink-features=AutomationControlled','--disable-http2'] });
const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 }, locale: 'en-IN' });
const page = await ctx.newPage();
// warm up via India page (which passes), then navigate
await page.goto('https://www.mckinsey.com/in/overview', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(()=>{});
await page.waitForTimeout(6000);
const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => null);
console.log('status', r?.status(), await page.title());
await page.waitForTimeout(10000);
console.log('after wait', await page.title(), (await page.evaluate(() => document.body.innerText.slice(0, 200))).replace(/\s+/g,' '));
await browser.close();
