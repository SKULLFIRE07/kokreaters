// Throwaway: interaction states on the built styleguide (motion on): reveal, accordion open, card focus + hover.
import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
const base = process.env.BASE ?? 'http://127.0.0.1:4402';
const out = '/home/aryan-budukh/Desktop/ganeshkaka-folder/research/v3/shots/foundation/';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(base + '/styleguide.html', { waitUntil: 'networkidle' });
const early = await p.evaluate(() => getComputedStyle(document.querySelector('#on-white .sh')).opacity);
await p.waitForTimeout(1500);
console.log('html class', await p.evaluate(() => document.documentElement.className), 'sh opacity before scroll', early);
// accordion
const acc = p.locator('#faq-white-1 summary');
await acc.scrollIntoViewIfNeeded();
await p.waitForTimeout(1200);
await acc.click();
await p.waitForTimeout(150);
const mid = await p.evaluate(() => document.querySelector('#faq-white-1').getBoundingClientRect().height);
await p.waitForTimeout(600);
const end = await p.evaluate(() => document.querySelector('#faq-white-1').getBoundingClientRect().height);
console.log('accordion height mid/end', mid, end);
await p.locator('#faq-white').screenshot({ path: out + 'state-accordion.png' });
// card focus via keyboard + hover
const link = p.locator('#on-white .xcard__link').first();
await link.focus();
await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab');
await p.waitForTimeout(300);
await p.locator('#on-white .card-grid').first().screenshot({ path: out + 'state-xcard-focus.png' });
await p.locator('#on-white .xcard').nth(1).hover();
await p.waitForTimeout(400);
await p.locator('#on-white .card-grid').first().screenshot({ path: out + 'state-xcard-hover.png' });
await p.locator('#on-white .icard').nth(1).hover();
await p.waitForTimeout(800);
await p.locator('#on-white .sg-insights').screenshot({ path: out + 'state-icard-hover.png' });
await p.locator('#on-white .tile-grid li').nth(1).hover();
await p.waitForTimeout(400);
await p.locator('#on-white .tile-grid').screenshot({ path: out + 'state-tile-hover.png' });
await b.close();
