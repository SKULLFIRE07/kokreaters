// Throwaway: element shots of the hero variants at 390 (reduced motion).
import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
const out = '/home/aryan-budukh/Desktop/ganeshkaka-folder/research/v3/shots/foundation/';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await p.goto((process.env.BASE ?? 'http://127.0.0.1:4402') + '/styleguide.html', { waitUntil: 'networkidle' });
const heroes = p.locator('#heroes > section');
const n = await heroes.count();
for (let i = 0; i < n; i++) { await heroes.nth(i).scrollIntoViewIfNeeded(); await p.waitForTimeout(500); await heroes.nth(i).screenshot({ path: `${out}hero-390-${i}.png` }); }
await b.close();
console.log(n);
