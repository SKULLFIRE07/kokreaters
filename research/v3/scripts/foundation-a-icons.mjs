// Throwaway: contact sheet of Lucide candidates for the six expertise icons (32px, stroke 1.5, brand blue).
import { readFileSync } from 'node:fs';
import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
const dir = '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/lucide-static/icons/';
const groups = {
  innovation: ['flask-conical', 'flask-round', 'lightbulb', 'beaker', 'test-tube-diagonal', 'sparkles', 'microscope', 'cookie'],
  process: ['factory', 'cog', 'workflow', 'waypoints', 'container', 'warehouse', 'settings-2', 'gauge'],
  quality: ['shield-check', 'badge-check', 'clipboard-check', 'scan-search', 'search-check', 'shield', 'list-checks', 'microscope'],
  strategy: ['split', 'signpost', 'signpost-big', 'route', 'compass', 'target', 'git-fork', 'chart-line'],
  deals: ['file-search', 'handshake', 'scan-search', 'search', 'file-check', 'briefcase-business', 'scale', 'landmark'],
  capability: ['users', 'users-round', 'graduation-cap', 'presentation', 'book-open', 'trending-up', 'sprout', 'user-round-check'],
};
const inner = (n) => { try { return readFileSync(dir + n + '.svg', 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''); } catch { return '<text x="2" y="14" font-size="6">missing</text>'; } };
const html = `<html><body style="font:13px Inter, Arial;margin:24px;background:#fff">${Object.entries(groups).map(([k, list]) => `<h3 style="font:600 13px Arial;margin:16px 0 8px">${k}</h3><div style="display:flex;gap:28px">${list.map((n) => `<figure style="margin:0;text-align:center;width:96px"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2C509E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${inner(n)}</svg><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2C509E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:8px auto 0">${inner(n)}</svg><figcaption style="margin-top:4px;font-size:11px">${n}</figcaption></figure>`).join('')}</div>`).join('')}</body></html>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 1.5 });
await p.setContent(html);
await p.screenshot({ path: '/home/aryan-budukh/Desktop/ganeshkaka-folder/research/v3/shots/foundation/icons-candidates.png', fullPage: true });
await b.close();
