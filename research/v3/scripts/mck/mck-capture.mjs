// Throwaway McKinsey reference-study capture: screenshots + computed-style measurements.
// Run: cd web && node ../research/v3/scripts/mck/mck-capture.mjs <slug> <url>
import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const OUT = '/home/aryan-budukh/Desktop/ganeshkaka-folder/research/v3';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
const UA_M = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const [slug, url] = process.argv.slice(2);

const browser = await chromium.launch({
  channel: 'chromium', headless: true,
  args: ['--disable-blink-features=AutomationControlled', '--disable-http2'],
});

async function dismiss(page) {
  const sels = ['#onetrust-accept-btn-handler', 'button:has-text("Accept All Cookies")', 'button:has-text("Accept all")', 'button:has-text("Accept")', 'button:has-text("I agree")'];
  for (const s of sels) {
    try { const b = page.locator(s).first(); if (await b.isVisible({ timeout: 800 })) { await b.click({ timeout: 2000 }); await page.waitForTimeout(600); return s; } } catch {}
  }
  return null;
}

async function autoscroll(page) {
  await page.evaluate(async () => {
    const step = 700; let y = 0;
    while (y < document.documentElement.scrollHeight) { window.scrollTo(0, y); y += step; await new Promise(r => setTimeout(r, 220)); }
    await new Promise(r => setTimeout(r, 800));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
}

const measure = () => {
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0; };
  const fam = f => f.split(',')[0].replace(/["']/g, '').trim();
  const ty = el => { const c = getComputedStyle(el); return { fam: fam(c.fontFamily), size: c.fontSize, lh: c.lineHeight, ls: c.letterSpacing, w: c.fontWeight, tt: c.textTransform, color: c.color }; };
  const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70);
  const out = { url: location.href, vw: innerWidth, docH: document.documentElement.scrollHeight };
  out.body = ty(document.body); out.bodyBg = getComputedStyle(document.body).backgroundColor;
  out.fontsLoaded = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight + ' ' + f.style).filter((v, i, a) => a.indexOf(v) === i).slice(0, 20);
  out.headings = {};
  for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
    const els = [...document.querySelectorAll(tag)].filter(vis).slice(0, 8);
    out.headings[tag] = els.map(e => ({ ...ty(e), mb: getComputedStyle(e).marginBottom, mt: getComputedStyle(e).marginTop, maxW: getComputedStyle(e).maxWidth, wpx: Math.round(e.getBoundingClientRect().width), left: Math.round(e.getBoundingClientRect().left), top: Math.round(e.getBoundingClientRect().top + scrollY), t: txt(e) }));
  }
  out.p = [...document.querySelectorAll('main p, p')].filter(vis).slice(0, 14).map(e => ({ ...ty(e), mb: getComputedStyle(e).marginBottom, wpx: Math.round(e.getBoundingClientRect().width), left: Math.round(e.getBoundingClientRect().left), t: txt(e).slice(0, 50) }));
  const hist = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = walker.nextNode())) {
    const s = n.textContent.trim(); if (s.length < 2) continue;
    const el = n.parentElement; if (!el || !vis(el)) continue;
    const t = ty(el); const k = [t.fam, t.size, t.w, t.lh, t.ls, t.tt].join('|');
    const h = hist.get(k) || { k, count: 0, chars: 0, samples: [], colors: new Set() };
    h.count++; h.chars += s.length; h.colors.add(t.color); if (h.samples.length < 3) h.samples.push(el.tagName.toLowerCase() + ':' + s.slice(0, 40));
    hist.set(k, h);
  }
  out.typeHist = [...hist.values()].sort((a, b) => b.chars - a.chars).slice(0, 28).map(h => ({ ...h, colors: [...h.colors].slice(0, 3) }));
  const hdr = document.querySelector('header') || document.querySelector('[class*="header" i]');
  if (hdr) { const r = hdr.getBoundingClientRect(); const c = getComputedStyle(hdr); out.header = { h: Math.round(r.height), pos: c.position, bg: c.backgroundColor, bb: c.borderBottom, shadow: c.boxShadow, cls: hdr.className?.toString().slice(0, 80) };
    out.headerLinks = [...hdr.querySelectorAll('a,button')].filter(vis).slice(0, 14).map(a => ({ t: txt(a).slice(0, 25), ...ty(a), h: Math.round(a.getBoundingClientRect().height), x: Math.round(a.getBoundingClientRect().left) }));
    const logo = hdr.querySelector('svg, img'); if (logo) { const lr = logo.getBoundingClientRect(); out.logo = { w: Math.round(lr.width), h: Math.round(lr.height), x: Math.round(lr.left), y: Math.round(lr.top) }; }
  }
  out.fixed = [...document.querySelectorAll('body *')].filter(e => { const c = getComputedStyle(e); return (c.position === 'fixed' || c.position === 'sticky') && vis(e); }).slice(0, 8).map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, cls: e.className?.toString().slice(0, 60), top: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width), bg: getComputedStyle(e).backgroundColor }; });
  const cont = new Map();
  for (const e of document.querySelectorAll('body *')) {
    const c = getComputedStyle(e); if (c.maxWidth === 'none' || !vis(e)) continue;
    const r = e.getBoundingClientRect(); if (r.width < 300) continue;
    const k = c.maxWidth + ' | w=' + Math.round(r.width) + ' | left=' + Math.round(r.left) + ' | pl=' + c.paddingLeft + ' pr=' + c.paddingRight;
    cont.set(k, (cont.get(k) || 0) + 1);
  }
  out.containers = [...cont.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14);
  const lefts = new Map();
  for (const e of document.querySelectorAll('h1,h2,h3,p,li a')) { if (!vis(e)) continue; const x = Math.round(e.getBoundingClientRect().left); lefts.set(x, (lefts.get(x) || 0) + 1); }
  out.textLefts = [...lefts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const rights = new Map();
  for (const e of document.querySelectorAll('h1,h2,h3,p,img')) { if (!vis(e)) continue; const x = Math.round(e.getBoundingClientRect().right); rights.set(x, (rights.get(x) || 0) + 1); }
  out.rightEdges = [...rights.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const main = document.querySelector('main') || document.body;
  let lvl = main; for (let i = 0; i < 5 && lvl.children.length <= 2; i++) { const big = [...lvl.children].sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0]; if (!big) break; lvl = big; }
  out.sectionsParent = lvl.tagName + '.' + (lvl.className?.toString().slice(0, 50) || '');
  out.sections = [...lvl.children].filter(vis).slice(0, 30).map(e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); const firstH = e.querySelector('h1,h2,h3'); return { tag: e.tagName, cls: e.className?.toString().slice(0, 70), top: Math.round(r.top + scrollY), h: Math.round(r.height), pt: c.paddingTop, pb: c.paddingBottom, mt: c.marginTop, mb: c.marginBottom, bg: c.backgroundColor, bgImg: c.backgroundImage !== 'none', head: firstH ? txt(firstH).slice(0, 50) : '' }; });
  out.h2Tops = [...document.querySelectorAll('h2')].filter(vis).map(e => [Math.round(e.getBoundingClientRect().top + scrollY), txt(e).slice(0, 30)]);
  out.images = [...document.querySelectorAll('img, video')].filter(vis).slice(0, 30).map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, w: Math.round(r.width), h: Math.round(r.height), ratio: +(r.width / r.height).toFixed(2), top: Math.round(r.top + scrollY), left: Math.round(r.left), radius: getComputedStyle(e).borderRadius, fit: getComputedStyle(e).objectFit, alt: (e.alt || '').slice(0, 40) }; });
  const cards = [];
  for (const e of document.querySelectorAll('a, article, li, div')) {
    if (!vis(e)) continue; const r = e.getBoundingClientRect(); if (r.width < 180 || r.width > 900 || r.height < 150 || r.height > 900) continue;
    const img = e.querySelector('img'); const head = e.querySelector('h2,h3,h4,h5,[class*="title" i]');
    if (!img || !head || !vis(img)) continue;
    if (cards.some(c => c.el.contains(e) || e.contains(c.el))) continue;
    const ir = img.getBoundingClientRect(); const hr = head.getBoundingClientRect();
    const leafs = [...e.querySelectorAll('span,div,p,a,time,small')].filter(x => x.children.length === 0 && vis(x) && !head.contains(x) && (x.innerText || '').trim().length > 1);
    const eyebrow = leafs.find(x => (x.innerText || '').trim().length < 40 && x.getBoundingClientRect().bottom <= hr.top + 2 && x.getBoundingClientRect().top >= ir.bottom - 2);
    const desc = leafs.find(x => x.getBoundingClientRect().top >= hr.bottom - 2 && (x.innerText || '').trim().length > 30);
    const meta = leafs.find(x => x !== desc && x.getBoundingClientRect().top >= hr.bottom - 2 && (x.innerText || '').trim().length <= 30);
    const c = getComputedStyle(e);
    cards.push({ el: e, tag: e.tagName, w: Math.round(r.width), h: Math.round(r.height), left: Math.round(r.left), top: Math.round(r.top + scrollY), img: { w: Math.round(ir.width), h: Math.round(ir.height), ratio: +(ir.width / ir.height).toFixed(2), radius: getComputedStyle(img).borderRadius, leftOfText: ir.right <= hr.left + 2 }, gapImgToText: Math.round((eyebrow ? eyebrow.getBoundingClientRect().top : hr.top) - ir.bottom), gapEyebrowToTitle: eyebrow ? Math.round(hr.top - eyebrow.getBoundingClientRect().bottom) : null, eyebrow: eyebrow ? { t: txt(eyebrow), ...ty(eyebrow) } : null, title: { t: txt(head).slice(0, 50), ...ty(head) }, desc: desc ? { t: txt(desc).slice(0, 40), ...ty(desc), gap: Math.round(desc.getBoundingClientRect().top - hr.bottom) } : null, meta: meta ? { t: txt(meta), ...ty(meta) } : null, bg: c.backgroundColor, border: c.border, radius: c.borderRadius, shadow: c.boxShadow });
    if (cards.length >= 14) break;
  }
  out.cards = cards.map(({ el, ...c }) => c);
  const btns = [];
  for (const e of document.querySelectorAll('a, button')) {
    if (!vis(e)) continue; const c = getComputedStyle(e); const r = e.getBoundingClientRect();
    const hasBox = (c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent') || parseFloat(c.borderTopWidth) > 0 || parseFloat(c.borderBottomWidth) > 0;
    if (!hasBox || r.height < 20 || r.height > 90 || r.width > 500) continue;
    const k = [c.backgroundColor, c.color, c.borderTop, c.borderBottom, c.borderRadius, Math.round(r.height), c.fontSize, c.fontWeight].join('|');
    if (btns.some(b => b.k === k)) continue;
    btns.push({ k, t: txt(e).slice(0, 30), h: Math.round(r.height), w: Math.round(r.width), pad: c.padding, radius: c.borderRadius, bg: c.backgroundColor, color: c.color, border: c.borderTop, bb: c.borderBottom, ...ty(e) });
    if (btns.length > 14) break;
  }
  out.buttons = btns;
  out.arrowLinks = [...document.querySelectorAll('a')].filter(a => vis(a) && a.querySelector('svg') && (a.innerText || '').trim().length > 3 && (a.innerText || '').trim().length < 40).slice(0, 6).map(a => { const s = a.querySelector('svg').getBoundingClientRect(); return { t: txt(a), ...ty(a), svg: Math.round(s.width) + 'x' + Math.round(s.height), deco: getComputedStyle(a).textDecorationLine }; });
  out.inlineLinks = [...document.querySelectorAll('main p a, article p a')].filter(vis).slice(0, 5).map(a => ({ t: txt(a).slice(0, 30), color: getComputedStyle(a).color, deco: getComputedStyle(a).textDecorationLine, decoThick: getComputedStyle(a).textDecorationThickness, offset: getComputedStyle(a).textUnderlineOffset }));
  const lines = new Map();
  for (const e of document.querySelectorAll('body *')) {
    if (!vis(e)) continue; const c = getComputedStyle(e); const r = e.getBoundingClientRect(); if (r.width < 100 && r.height < 40) continue;
    for (const side of ['Top', 'Bottom', 'Left']) { const w = parseFloat(c['border' + side + 'Width']); if (w > 0 && c['border' + side + 'Style'] !== 'none') { const k = side + ' ' + w + 'px ' + c['border' + side + 'Color']; lines.set(k, (lines.get(k) || 0) + 1); } }
    if (e.tagName === 'HR') { const k = 'HR h=' + r.height + ' bg=' + c.backgroundColor + ' bt=' + c.borderTop; lines.set(k, (lines.get(k) || 0) + 1); }
  }
  out.lines = [...lines.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  const colors = new Map(), bgs = new Map();
  for (const e of document.querySelectorAll('body *')) {
    if (!vis(e)) continue; const c = getComputedStyle(e);
    if ([...e.childNodes].some(x => x.nodeType === 3 && x.textContent.trim())) colors.set(c.color, (colors.get(c.color) || 0) + 1);
    if (c.backgroundColor !== 'rgba(0, 0, 0, 0)') { const r = e.getBoundingClientRect(); bgs.set(c.backgroundColor, (bgs.get(c.backgroundColor) || 0) + Math.round(r.width * r.height / 1000)); }
  }
  out.textColors = [...colors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  out.bgColors = [...bgs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  out.stats = [...document.querySelectorAll('body *')].filter(e => vis(e) && e.children.length === 0 && /\d/.test(e.innerText || '') && (e.innerText || '').trim().length < 14 && parseFloat(getComputedStyle(e).fontSize) >= 28).slice(0, 10).map(e => { const lab = e.nextElementSibling || e.parentElement?.nextElementSibling; return { t: txt(e), ...ty(e), label: lab ? { t: txt(lab).slice(0, 60), ...ty(lab) } : null }; });
  const ft = document.querySelector('footer');
  if (ft) { const r = ft.getBoundingClientRect(); const c = getComputedStyle(ft);
    const lists = [...ft.querySelectorAll('ul')].filter(vis);
    out.footer = { h: Math.round(r.height), bg: c.backgroundColor, color: c.color, pt: c.paddingTop, pb: c.paddingBottom,
      lists: lists.slice(0, 12).map(l => { const lr = l.getBoundingClientRect(); return { x: Math.round(lr.left), w: Math.round(lr.width), y: Math.round(lr.top - r.top), items: l.querySelectorAll('a').length, first: txt(l).slice(0, 70) }; }),
      linkType: [...ft.querySelectorAll('a')].filter(vis).slice(0, 6).map(a => ({ t: txt(a).slice(0, 25), ...ty(a), h: Math.round(a.getBoundingClientRect().height) })),
      text: (ft.innerText || '').replace(/\s+/g, ' ').slice(0, 600) };
  }
  out.eyebrows = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map(h => { const p = h.previousElementSibling; return p && vis(p) && (p.innerText || '').trim().length < 50 && (p.innerText || '').trim().length > 0 ? { t: txt(p), ...ty(p), gap: Math.round(h.getBoundingClientRect().top - p.getBoundingClientRect().bottom), for: txt(h).slice(0, 30) } : null; }).filter(Boolean).slice(0, 8);
  out.forms = [...document.querySelectorAll('input:not([type=hidden]), select, textarea')].filter(vis).slice(0, 6).map(i => { const c = getComputedStyle(i); const r = i.getBoundingClientRect(); return { type: i.type, ph: i.placeholder, h: Math.round(r.height), w: Math.round(r.width), border: c.borderBottom, bt: c.borderTop, radius: c.borderRadius, bg: c.backgroundColor, size: c.fontSize }; });
  return out;
};

const results = {};
for (const vp of [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, ua: UA, isMobile: false },
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, ua: UA_M, isMobile: true, hasTouch: true },
]) {
  const ctx = await browser.newContext({ userAgent: vp.ua, viewport: vp.viewport, deviceScaleFactor: vp.deviceScaleFactor, isMobile: vp.isMobile, hasTouch: !!vp.hasTouch, locale: 'en-IN' });
  const page = await ctx.newPage();
  let ok = false, err;
  for (let a = 0; a < 3 && !ok; a++) {
    try { const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); ok = r && r.status() < 400; if (!ok) err = 'status ' + r?.status(); } catch (e) { err = e.message.split('\n')[0]; await page.waitForTimeout(3000); }
  }
  if (!ok) { results[vp.name] = { error: err }; await ctx.close(); continue; }
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  const dismissed = await dismiss(page);
  await autoscroll(page);
  await dismiss(page);
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.screenshot({ path: `${OUT}/refs/mckinsey-${slug}-${vp.name}-fold.jpg`, type: 'jpeg', quality: 70 });
  const m = await page.evaluate(measure);
  m.dismissed = dismissed;
  await page.evaluate(() => window.scrollTo(0, 1400)); await page.waitForTimeout(1200);
  m.headerScrolled = await page.evaluate(() => { const hdr = document.querySelector('header') || document.querySelector('[class*="header" i]'); const fixed = [...document.querySelectorAll('body *')].filter(e => { const s = getComputedStyle(e); const rr = e.getBoundingClientRect(); return (s.position === 'fixed' || s.position === 'sticky') && rr.height > 20 && rr.top <= 1 && rr.bottom > 0 && rr.width > 300; }).map(e => ({ tag: e.tagName, cls: e.className?.toString().slice(0, 60), top: Math.round(e.getBoundingClientRect().top), h: Math.round(e.getBoundingClientRect().height), bg: getComputedStyle(e).backgroundColor, shadow: getComputedStyle(e).boxShadow })); if (!hdr) return { fixed }; const r = hdr.getBoundingClientRect(); const c = getComputedStyle(hdr); return { top: Math.round(r.top), h: Math.round(r.height), pos: c.position, bg: c.backgroundColor, fixed }; });
  await page.screenshot({ path: `${OUT}/refs/mckinsey-${slug}-${vp.name}-scrolled.jpg`, type: 'jpeg', quality: 60 });
  if (vp.name === 'mobile') {
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600);
    for (const s of ['button[aria-label*="menu" i]', 'button[class*="menu" i]', 'button[class*="hamburger" i]', 'header button']) {
      try { const b = page.locator(s).first(); if (await b.isVisible({ timeout: 600 })) { m.menuButton = { sel: s, ...(await b.boundingBox()) }; await b.click({ timeout: 2000 }); await page.waitForTimeout(1200); await page.screenshot({ path: `${OUT}/refs/mckinsey-${slug}-mobile-menu.jpg`, type: 'jpeg', quality: 70 }); m.menuOpen = await page.evaluate(() => [...document.querySelectorAll('nav a, nav button, [role="dialog"] a')].filter(e => { const r = e.getBoundingClientRect(); return r.height > 0 && r.top >= 0 && r.top < 844 && getComputedStyle(e).visibility !== 'hidden'; }).slice(0, 14).map(a => { const c = getComputedStyle(a); return { t: (a.innerText || '').trim().slice(0, 25), size: c.fontSize, w: c.fontWeight, h: Math.round(a.getBoundingClientRect().height), fam: c.fontFamily.split(',')[0] }; })); break; } } catch {}
    }
  }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/refs/mckinsey-${slug}-${vp.name}-full.jpg`, type: 'jpeg', quality: 60, fullPage: true }).catch(e => (m.fullErr = e.message));
  if (vp.name === 'desktop') m.articleLinks = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href*="/our-insights/"]')].map(a => a.href).filter(h => h.split('/').length > 7))].slice(0, 15));
  results[vp.name] = m;
  await ctx.close();
}
fs.writeFileSync(`${OUT}/scripts/mck/mck-measure-${slug}.json`, JSON.stringify(results, null, 1));
console.log('done', slug, Object.fromEntries(Object.entries(results).map(([k, v]) => [k, v.error || ('docH=' + v.docH + ' dismissed=' + v.dismissed)])));
await browser.close();
