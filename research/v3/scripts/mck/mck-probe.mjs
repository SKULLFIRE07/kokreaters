import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
const url = process.argv[2] || 'https://www.mckinsey.com/in/overview';
const browser = await chromium.launch({ args: ['--disable-blink-features=AutomationControlled','--disable-http2'], channel: process.env.CH || undefined, headless: process.env.HEADED ? false : true });
const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 }, locale: 'en-IN' });
const page = await ctx.newPage();
const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => ({ err: e.message }));
console.log('status', resp?.status?.() ?? resp);
await page.waitForTimeout(5000);
console.log('title', await page.title());
console.log((await page.evaluate(() => document.body.innerText.slice(0, 600))));
await browser.close();
