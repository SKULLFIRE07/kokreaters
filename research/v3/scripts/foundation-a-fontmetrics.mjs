// Throwaway: measure Source Serif 4 / Inter widths vs Liberation Serif (Times metrics) and Liberation Sans (Arial metrics).
import { readFileSync } from 'node:fs';
import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
const fs = '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/@fontsource-variable/';
const html = `<style>
@font-face{font-family:SS;src:url(data:font/woff2;base64,${readFileSync(fs+'source-serif-4/files/source-serif-4-latin-opsz-normal.woff2').toString('base64')});font-weight:200 900}
@font-face{font-family:SSI;src:url(data:font/woff2;base64,${readFileSync(fs+'source-serif-4/files/source-serif-4-latin-opsz-italic.woff2').toString('base64')});font-weight:200 900;font-style:italic}
@font-face{font-family:IN;src:url(data:font/woff2;base64,${readFileSync(fs+'inter/files/inter-latin-opsz-normal.woff2').toString('base64')});font-weight:100 900}
span{white-space:nowrap;font-optical-sizing:auto}
</style><div id=h></div>`;
const texts = {
  h1: 'Where deep expertise meets shared ambition.',
  h2: 'Six ways we create value, together. Results that started on the plant floor.',
  body: 'KoKreaters helps food, nutrition and specialty-ingredient businesses design better products, run better plants and make bolder decisions, with 25 years of plant-to-boardroom leadership behind every recommendation.',
};
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent(html);
await p.evaluate(async () => { await Promise.all(['400 20px SS','italic 400 20px SSI','400 20px IN'].map((f) => document.fonts.load(f))); await document.fonts.ready; return [...document.fonts].map((f) => f.family + ':' + f.status); }).then(console.log);
const res = await p.evaluate(({ texts }) => {
  const m = (fam, size, w, ls, text, style = 'normal') => { const s = document.createElement('span'); s.style.cssText = `font-family:${fam};font-size:${size}px;font-weight:${w};letter-spacing:${ls}em;font-style:${style}`; s.textContent = text; document.body.append(s); const r = s.getBoundingClientRect().width; s.remove(); return r; };
  const out = {};
  for (const [size, w, ls, t] of [[64, 420, -0.02, 'h1'], [42, 430, -0.012, 'h2'], [26, 500, -0.005, 'h2'], [18, 400, 0, 'body']]) {
    out[`serif ${size}/${w}`] = m('SS', size, w, ls, texts[t]) / m('"Liberation Serif"', size, 400, ls, texts[t]);
  }
  out['serif italic 30/400'] = m('SSI', 30, 400, -0.01, texts.h2, 'italic') / m('"Liberation Serif"', 30, 400, -0.01, texts.h2, 'italic');
  out['inter 18/400'] = m('IN', 18, 400, 0, texts.body) / m('"Liberation Sans"', 18, 400, 0, texts.body);
  out['inter 15/600'] = m('IN', 15, 600, 0.005, texts.body) / m('"Liberation Sans"', 15, 700, 0.005, texts.body);
  out['inter 21/400'] = m('IN', 21, 400, -0.005, texts.body) / m('"Liberation Sans"', 21, 400, -0.005, texts.body);
  return out;
}, { texts });
console.log(res);
await b.close();
