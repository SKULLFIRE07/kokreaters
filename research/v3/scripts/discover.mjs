import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
const urls = process.argv.slice(2);
const browser = await chromium.launch({ headless: true, args: ['--disable-blink-features=AutomationControlled'] });
const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', viewport: { width: 1440, height: 900 }, locale: 'en-US' });
await ctx.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => undefined }); });
for (const u of urls) {
  const p = await ctx.newPage();
  try {
    const r = await p.goto(u, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    const links = await p.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map(a => a.href + ' :: ' + (a.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 50)))]);
    console.log('=== ', u, r && r.status(), await p.title());
    console.log(links.filter(l => /publication|approach|about|industr|insight|need|capabilit|who-we|20\d\d/i.test(l)).slice(0, 60).join('\n'));
  } catch (e) { console.log('ERR', u, String(e).slice(0, 200)); }
  await p.close();
}
await browser.close();
