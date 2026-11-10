// Throwaway reference-capture script. Usage:
//   node capture.mjs <slug> <url> [desktop|mobile|both]
// Writes screenshots to ../refs and measurement JSON to ../data
import { chromium } from '/home/aryan-budukh/Desktop/ganeshkaka-folder/web/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/home/aryan-budukh/Desktop/ganeshkaka-folder/research/v3';
const REFS = path.join(ROOT, 'refs');
const DATA = path.join(ROOT, 'data');
fs.mkdirSync(REFS, { recursive: true });
fs.mkdirSync(DATA, { recursive: true });

const [slug, url, mode = 'both'] = process.argv.slice(2);
if (!slug || !url) { console.error('usage: slug url [mode]'); process.exit(1); }

const DESKTOP_UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36';

const COOKIE_SELECTORS = [
  '#onetrust-accept-btn-handler', '#truste-consent-button', 'button.cookie-consent__accept',
  'button#accept-recommended-btn-handler',
  '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
  '#CybotCookiebotDialogBodyButtonAccept',
  'button[data-testid="uc-accept-all-button"]',
  '.cc-allow', '.cookie-accept', '#truste-consent-button',
];
const COOKIE_TEXT = /^(accept all and close|accept all( cookies)?|accept( cookies)?|allow all( cookies)?|i agree|agree|ok|got it|alle akzeptieren|accept and continue|agree and close)$/i;

async function dismissCookies(page) {
  for (let attempt = 0; attempt < 2; attempt++) {
    for (const sel of COOKIE_SELECTORS) {
      try {
        const el = await page.$(sel);
        if (el && await el.isVisible()) { await el.click({ timeout: 2000 }); await page.waitForTimeout(800); return sel; }
      } catch {}
    }
    try {
      const btns = await page.$$('button, a[role="button"], [role="button"]');
      for (const b of btns) {
        const t = ((await b.innerText().catch(() => '')) || '').trim();
        if (COOKIE_TEXT.test(t) && await b.isVisible().catch(() => false)) {
          await b.click({ timeout: 2000 }).catch(() => {});
          await page.waitForTimeout(800);
          return 'text:' + t;
        }
      }
    } catch {}
    // Usercentrics shadow DOM
    try {
      const clicked = await page.evaluate(() => {
        const host = document.querySelector('#usercentrics-root, #usercentrics-cmp-ui');
        const root = host && host.shadowRoot;
        if (!root) return false;
        const b = root.querySelector('[data-testid="uc-accept-all-button"]') || [...root.querySelectorAll('button')].find(x => /accept/i.test(x.textContent));
        if (b) { b.click(); return true; }
        return false;
      });
      if (clicked) { await page.waitForTimeout(800); return 'usercentrics'; }
    } catch {}
    await page.waitForTimeout(1500);
  }
  return null;
}

async function hideOverlays(page) {
  await page.addStyleTag({ content: `#onetrust-consent-sdk,#usercentrics-root,#CybotCookiebotDialog,.onetrust-pc-dark-filter,#truste-consent-track,[id*="cookie-banner"],[class*="cookie-banner"],[class*="CookieBanner"]{display:none!important}` }).catch(() => {});
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.7);
    let y = 0;
    const max = () => document.documentElement.scrollHeight;
    while (y < max() && y < 40000) {
      y += step; window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 220));
    }
    await new Promise(r => setTimeout(r, 600));
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 600));
  });
}

// ---------- measurement (runs in page) ----------
function measure() {
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05; };
  const fam = f => (f || '').split(',')[0].replace(/["']/g, '').trim();
  const famCat = f => {
    const s = (f || '').toLowerCase();
    if (/serif/.test(s) && !/sans/.test(s)) return 'serif';
    if (/georgia|times|garamond|tiempos|freight|lyon|playfair|caslon|minion|bower|henderson/.test(s)) return 'serif';
    if (/mono/.test(s)) return 'mono';
    return 'sans';
  };
  const typo = el => { const cs = getComputedStyle(el); return { tag: el.tagName.toLowerCase(), text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 80), family: fam(cs.fontFamily), cat: famCat(cs.fontFamily), size: parseFloat(cs.fontSize), lh: cs.lineHeight, ls: cs.letterSpacing, weight: cs.fontWeight, tt: cs.textTransform, color: cs.color, maxW: Math.round(el.getBoundingClientRect().width) }; };

  const out = { url: location.href, title: document.title, vw: innerWidth, vh: innerHeight, pageHeight: document.documentElement.scrollHeight };
  out.htmlFontSize = getComputedStyle(document.documentElement).fontSize;
  const bcs = getComputedStyle(document.body);
  out.body = { family: fam(bcs.fontFamily), size: bcs.fontSize, lh: bcs.lineHeight, color: bcs.color, bg: bcs.backgroundColor };

  for (const h of ['h1', 'h2', 'h3', 'h4']) out[h] = [...document.querySelectorAll(h)].filter(vis).slice(0, 8).map(typo);
  // paragraph sizes
  const ps = [...document.querySelectorAll('p')].filter(vis).filter(p => (p.innerText || '').trim().length > 40);
  const pHist = {};
  ps.forEach(p => { const cs = getComputedStyle(p); const k = `${fam(cs.fontFamily)}|${cs.fontSize}|${cs.lineHeight}|${cs.fontWeight}|${cs.letterSpacing}`; pHist[k] = (pHist[k] || 0) + (p.innerText || '').length; });
  out.pHist = Object.entries(pHist).sort((a, b) => b[1] - a[1]).slice(0, 6);
  out.pSamples = ps.slice(0, 4).map(typo);

  // typography histogram (weighted by chars) for all text-bearing leaf-ish elements
  const all = [...document.body.querySelectorAll('*')].filter(el => el.childElementCount === 0 || [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 2));
  const tHist = {};
  all.forEach(el => {
    if (!vis(el)) return;
    const t = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
    if (t.length < 2) return;
    const cs = getComputedStyle(el);
    const k = `${famCat(cs.fontFamily)}:${fam(cs.fontFamily)}|${cs.fontSize}|w${cs.fontWeight}|lh${cs.lineHeight}|ls${cs.letterSpacing}|${cs.textTransform}`;
    tHist[k] = (tHist[k] || 0) + t.length;
  });
  out.typeHist = Object.entries(tHist).sort((a, b) => b[1] - a[1]).slice(0, 25);

  // small labels / eyebrows: short text, uppercase or small size, above headings
  const labels = all.filter(el => {
    if (!vis(el)) return false;
    const t = (el.innerText || '').trim();
    if (t.length < 2 || t.length > 40) return false;
    const cs = getComputedStyle(el);
    const s = parseFloat(cs.fontSize);
    return (cs.textTransform === 'uppercase' || s <= 14) && !el.closest('nav, header, footer');
  }).slice(0, 400);
  const lHist = {};
  labels.forEach(el => { const cs = getComputedStyle(el); const k = `${fam(cs.fontFamily)}|${cs.fontSize}|w${cs.fontWeight}|ls${cs.letterSpacing}|${cs.textTransform}|${cs.color}`; (lHist[k] = lHist[k] || { n: 0, ex: [] }).n++; if (lHist[k].ex.length < 3) lHist[k].ex.push((el.innerText || '').trim().slice(0, 30)); });
  out.labels = Object.entries(lHist).sort((a, b) => b[1].n - a[1].n).slice(0, 8);

  // header
  const header = document.querySelector('header') || document.querySelector('[class*="header" i]');
  if (header) { const r = header.getBoundingClientRect(); const cs = getComputedStyle(header); out.header = { h: Math.round(r.height), pos: cs.position, bg: cs.backgroundColor, borderBottom: cs.borderBottom, boxShadow: cs.boxShadow, cls: header.className.toString().slice(0, 80) };
    const navLinks = [...header.querySelectorAll('a, button')].filter(vis).slice(0, 30).map(a => ({ t: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 30), ...(() => { const cs = getComputedStyle(a); return { size: cs.fontSize, w: cs.fontWeight, tt: cs.textTransform, ls: cs.letterSpacing, color: cs.color }; })(), x: Math.round(a.getBoundingClientRect().left), h: Math.round(a.getBoundingClientRect().height) }));
    out.headerLinks = navLinks;
    const logo = header.querySelector('img, svg');
    if (logo) { const r2 = logo.getBoundingClientRect(); out.logo = { w: Math.round(r2.width), h: Math.round(r2.height), x: Math.round(r2.left), y: Math.round(r2.top) }; }
  }

  // container widths: elements with max-width set & centred
  const cont = {};
  [...document.querySelectorAll('body *')].forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.maxWidth && cs.maxWidth !== 'none' && cs.maxWidth.endsWith('px') && parseFloat(cs.maxWidth) > 700) {
      const r = el.getBoundingClientRect(); if (r.width < 600) return;
      const k = `${cs.maxWidth}|pl${cs.paddingLeft}|pr${cs.paddingRight}|w${Math.round(r.width)}|x${Math.round(r.left)}`; cont[k] = (cont[k] || 0) + 1;
    }
  });
  out.containers = Object.entries(cont).sort((a, b) => b[1] - a[1]).slice(0, 10);
  // content left edge: most common left x of headings & paragraphs
  const lefts = {};
  [...document.querySelectorAll('h1,h2,h3,p')].filter(vis).forEach(el => { const x = Math.round(el.getBoundingClientRect().left); lefts[x] = (lefts[x] || 0) + 1; });
  out.leftEdges = Object.entries(lefts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const rights = {};
  [...document.querySelectorAll('h1,h2,h3,p')].filter(vis).forEach(el => { const x = Math.round(innerWidth - el.getBoundingClientRect().right); rights[x] = (rights[x] || 0) + 1; });
  out.rightEdges = Object.entries(rights).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // sections: big blocks in main
  const main = document.querySelector('main') || document.body;
  let blocks = [...main.children];
  if (blocks.length < 3) blocks = blocks.flatMap(b => [...b.children]);
  if (blocks.length < 3) blocks = blocks.flatMap(b => [...b.children]);
  out.sections = blocks.filter(vis).map(el => {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    // find inner padding: first descendant with padding-top > 0
    let inner = el, pt = parseFloat(cs.paddingTop), pb = parseFloat(cs.paddingBottom);
    if (pt === 0) { const d = [...el.querySelectorAll('*')].slice(0, 6).find(x => parseFloat(getComputedStyle(x).paddingTop) > 0); if (d) { pt = parseFloat(getComputedStyle(d).paddingTop); pb = parseFloat(getComputedStyle(d).paddingBottom); } }
    const firstH = el.querySelector('h1,h2,h3');
    const top = r.top + scrollY;
    const hTop = firstH ? Math.round(firstH.getBoundingClientRect().top + scrollY - top) : null;
    return { tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 60), top: Math.round(top), h: Math.round(r.height), bg: cs.backgroundColor, pt, pb, mt: cs.marginTop, mb: cs.marginBottom, firstHeading: firstH ? (firstH.innerText || '').trim().slice(0, 60) : null, headingOffset: hTop, imgs: el.querySelectorAll('img,picture,video').length };
  }).slice(0, 40);

  // buttons
  const btns = [...document.querySelectorAll('a, button')].filter(vis).filter(b => {
    const cs = getComputedStyle(b); const r = b.getBoundingClientRect();
    const hasBg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
    const hasBorder = parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.borderLeftWidth) > 0;
    const t = (b.innerText || '').trim();
    return (hasBg || hasBorder) && r.height >= 28 && r.height <= 72 && t.length > 1 && t.length < 40 && r.width < 420;
  });
  const bHist = {};
  btns.forEach(b => { const cs = getComputedStyle(b); const r = b.getBoundingClientRect(); const k = `h${Math.round(r.height)}|r${cs.borderRadius}|p${cs.paddingTop} ${cs.paddingRight}|${cs.fontSize}|w${cs.fontWeight}|${cs.textTransform}|ls${cs.letterSpacing}|bg${cs.backgroundColor}|c${cs.color}|bd${cs.borderTopWidth} ${cs.borderTopColor}`; (bHist[k] = bHist[k] || { n: 0, ex: [] }).n++; if (bHist[k].ex.length < 3) bHist[k].ex.push((b.innerText || '').trim().slice(0, 25)); });
  out.buttons = Object.entries(bHist).sort((a, b) => b[1].n - a[1].n).slice(0, 8);
  // text links with arrows (CTA links)
  const arrowLinks = [...document.querySelectorAll('a')].filter(vis).filter(a => /→|›|>|arrow|read more|learn more|explore|discover|see all|view all/i.test((a.innerText || '') + ' ' + a.innerHTML.slice(0, 300)) && (a.innerText || '').trim().length < 40 && (a.innerText || '').trim().length > 2).slice(0, 6).map(typo);
  out.arrowLinks = arrowLinks;

  // dividers
  const dHist = {};
  [...document.querySelectorAll('body *')].forEach(el => {
    if (!vis(el)) return;
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    for (const side of ['Top', 'Bottom', 'Left']) {
      const w = parseFloat(cs[`border${side}Width`]);
      if (w > 0 && w <= 4 && cs[`border${side}Style`] !== 'none' && (side === 'Left' ? r.height > 40 : r.width > 150)) {
        const k = `${side}|${w}px|${cs[`border${side}Color`]}`; dHist[k] = (dHist[k] || 0) + 1;
      }
    }
    if (el.tagName === 'HR') { const k = `hr|${cs.borderTopWidth}|${cs.borderTopColor}|h${r.height}|bg${cs.backgroundColor}`; dHist[k] = (dHist[k] || 0) + 1; }
  });
  out.dividers = Object.entries(dHist).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // cards: elements (a/article/li/div) with one image and a heading-ish text, width 200-700
  const cardCands = [...document.querySelectorAll('article, li, a, div')].filter(vis).filter(el => {
    const r = el.getBoundingClientRect(); if (r.width < 180 || r.width > 760 || r.height < 150 || r.height > 900) return false;
    const imgs = el.querySelectorAll('img, picture'); if (imgs.length < 1 || imgs.length > 2) return false;
    const h = el.querySelector('h2,h3,h4,h5,[class*="title" i]'); return !!h;
  });
  // keep the outermost of nested
  const cards = cardCands.filter(el => !cardCands.some(o => o !== el && o.contains(el) && o.getBoundingClientRect().height < el.getBoundingClientRect().height * 1.3 && o.getBoundingClientRect().width <= el.getBoundingClientRect().width * 1.1));
  const seenSig = new Set();
  out.cards = [];
  for (const c of cards) {
    const img = c.querySelector('img, picture'); const ir = img.getBoundingClientRect(); const r = c.getBoundingClientRect();
    const h = c.querySelector('h2,h3,h4,h5,[class*="title" i]');
    const hs = getComputedStyle(h);
    const label = [...c.querySelectorAll('*')].filter(vis).find(x => x !== h && !x.contains(h) && !h.contains(x) && x.childElementCount === 0 && (x.innerText || '').trim().length > 1 && (x.innerText || '').trim().length < 40 && parseFloat(getComputedStyle(x).fontSize) <= 15);
    const ls = label ? getComputedStyle(label) : null;
    const sig = `${Math.round(r.width)}|${Math.round(ir.width / Math.max(ir.height, 1) * 100)}`;
    if (seenSig.has(sig)) continue; seenSig.add(sig);
    const ccs = getComputedStyle(c);
    out.cards.push({ w: Math.round(r.width), h: Math.round(r.height), imgW: Math.round(ir.width), imgH: Math.round(ir.height), ratio: +(ir.width / Math.max(ir.height, 1)).toFixed(2), imgFilter: getComputedStyle(img).filter, title: (h.innerText || '').trim().slice(0, 60), titleSize: hs.fontSize, titleLh: hs.lineHeight, titleW: hs.fontWeight, titleFam: fam(hs.fontFamily), titleGapFromImg: Math.round(h.getBoundingClientRect().top - ir.bottom), label: label ? { t: (label.innerText || '').trim(), size: ls.fontSize, w: ls.fontWeight, tt: ls.textTransform, ls: ls.letterSpacing, color: ls.color } : null, cardBg: ccs.backgroundColor, cardRadius: ccs.borderRadius, cardBorder: ccs.border, cardShadow: ccs.boxShadow });
    if (out.cards.length >= 10) break;
  }

  // big numbers / stats
  out.stats = [...document.querySelectorAll('body *')].filter(vis).filter(el => {
    const t = (el.innerText || '').trim(); const s = parseFloat(getComputedStyle(el).fontSize);
    return s >= 30 && t.length <= 12 && /\d/.test(t) && /^[\s\d.,%+x$€£~<>#-]*[\d][\s\d.,%+xkKmMbB$€£-]*[a-zA-Z%+]{0,10}$/.test(t) && el.childElementCount <= 2;
  }).slice(0, 10).map(el => { const x = typo(el); const lab = el.parentElement && el.parentElement.innerText.replace(el.innerText, '').trim().slice(0, 60); return { ...x, ctx: lab }; });

  // footer
  const footer = document.querySelector('footer') || document.querySelector('[class*="footer" i]');
  if (footer) {
    const r = footer.getBoundingClientRect(); const cs = getComputedStyle(footer);
    const lists = [...footer.querySelectorAll('ul')].filter(vis);
    const colsX = new Set(lists.map(u => Math.round(u.getBoundingClientRect().left)));
    const links = [...footer.querySelectorAll('a')].filter(vis);
    const lcs = links[0] ? getComputedStyle(links[0]) : null;
    out.footer = { h: Math.round(r.height), bg: cs.backgroundColor, color: cs.color, pt: cs.paddingTop, lists: lists.length, distinctColumnX: [...colsX].sort((a, b) => a - b), links: links.length, linkSize: lcs && lcs.fontSize, linkColor: lcs && lcs.color, headings: [...footer.querySelectorAll('h2,h3,h4,h5,strong,[class*="title" i]')].filter(vis).slice(0, 10).map(typo) };
  }

  // colours
  const bg = {}, fg = {};
  [...document.querySelectorAll('body *')].forEach(el => { if (!vis(el)) return; const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); const area = r.width * r.height; if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') bg[cs.backgroundColor] = (bg[cs.backgroundColor] || 0) + area; const t = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim(); if (t.length > 1) fg[cs.color] = (fg[cs.color] || 0) + t.length; });
  out.bgColors = Object.entries(bg).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([c, a]) => [c, Math.round(a / 1000) + 'k px2']);
  out.fgColors = Object.entries(fg).sort((a, b) => b[1] - a[1]).slice(0, 10);
  // fonts used
  out.fontsLoaded = [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family} ${f.weight}`))].slice(0, 20);
  // nav labels (top-level)
  out.navText = [...document.querySelectorAll('header nav a, header nav button, nav[aria-label] a')].filter(vis).map(a => (a.innerText || '').trim()).filter(Boolean).slice(0, 25);
  // images: filters, aspect ratios
  const ar = {};
  [...document.querySelectorAll('img')].filter(vis).forEach(i => { const r = i.getBoundingClientRect(); if (r.width < 120) return; const k = (r.width / r.height).toFixed(2); ar[k] = (ar[k] || 0) + 1; });
  out.imgRatios = Object.entries(ar).sort((a, b) => b[1] - a[1]).slice(0, 8);
  // transitions/animations found
  out.motion = { reducedMotionQuery: matchMedia('(prefers-reduced-motion: reduce)').matches };
  return out;
}

async function headerAfterScroll(page) {
  await page.evaluate(() => window.scrollTo(0, 1400));
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => {
    const header = document.querySelector('header') || document.querySelector('[class*="header" i]');
    if (!header) return null;
    const r = header.getBoundingClientRect(); const cs = getComputedStyle(header);
    // find visible fixed/sticky bar at top
    const tops = [...document.querySelectorAll('body *')].filter(el => { const c = getComputedStyle(el); return (c.position === 'fixed' || c.position === 'sticky') && el.getBoundingClientRect().top <= 1 && el.getBoundingClientRect().height > 30 && el.getBoundingClientRect().height < 200 && el.getBoundingClientRect().width > innerWidth * 0.8; }).map(el => ({ cls: el.className.toString().slice(0, 60), h: Math.round(el.getBoundingClientRect().height), bg: getComputedStyle(el).backgroundColor, shadow: getComputedStyle(el).boxShadow }));
    return { h: Math.round(r.height), top: Math.round(r.top), pos: cs.position, bg: cs.backgroundColor, transform: cs.transform, shadow: cs.boxShadow, fixedBars: tops.slice(0, 4) };
  });
  return r;
}

async function run(viewport) {
  const isMobile = viewport === 'mobile';
  const browser = await chromium.launch({ headless: true, args: ['--disable-blink-features=AutomationControlled'] });
  const ctx = await browser.newContext({
    userAgent: isMobile ? MOBILE_UA : DESKTOP_UA,
    viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    deviceScaleFactor: isMobile ? 2 : 1,
    isMobile, hasTouch: isMobile, locale: 'en-US',
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
  });
  await ctx.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => undefined }); });
  const page = await ctx.newPage();
  const tag = `${slug}-${viewport}`;
  const res = { slug, viewport, url };
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    res.status = resp && resp.status();
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => { res.networkidle = 'timeout'; });
    await page.waitForTimeout(1500);
    res.cookie = await dismissCookies(page);
    await page.waitForTimeout(2500);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1000);
    await hideOverlays(page);
    res.titleSeen = await page.title();
    res.bodyTextStart = (await page.evaluate(() => document.body.innerText.slice(0, 300))).replace(/\s+/g, ' ');
    await page.screenshot({ path: path.join(REFS, `bcg-rb-kearney-${tag}-fold.jpg`), type: 'jpeg', quality: 75 });
    await autoScroll(page);
    await page.waitForTimeout(800);
    res.m = await page.evaluate(measure);
    res.scrolledHeader = await headerAfterScroll(page);
    await page.screenshot({ path: path.join(REFS, `bcg-rb-kearney-${tag}-scrolled.jpg`), type: 'jpeg', quality: 70 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(REFS, `bcg-rb-kearney-${tag}-full.jpg`), type: 'jpeg', quality: 70, fullPage: true });
    if (isMobile) {
      // open menu
      const opened = await page.evaluate(() => {
        const cands = [...document.querySelectorAll('header button, header [role="button"], button[aria-label*="menu" i], button[class*="menu" i], button[class*="burger" i], [class*="hamburger" i]')].filter(b => { const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top < 120; });
        const b = cands.find(x => /menu|nav|burger|hamburger/i.test((x.getAttribute('aria-label') || '') + x.className + x.innerText)) || cands[cands.length - 1];
        if (!b) return null; const r = b.getBoundingClientRect(); b.click();
        return { label: b.getAttribute('aria-label') || b.innerText.trim() || b.className.toString().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left) };
      });
      res.menuButton = opened;
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(REFS, `bcg-rb-kearney-${tag}-menu.jpg`), type: 'jpeg', quality: 75 });
      res.menuItems = await page.evaluate(() => [...document.querySelectorAll('nav a, nav button, [role="dialog"] a, [class*="menu" i] a')].filter(a => { const r = a.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top < innerHeight && r.top >= 0; }).slice(0, 20).map(a => { const cs = getComputedStyle(a); return { t: (a.innerText || '').trim().slice(0, 30), size: cs.fontSize, w: cs.fontWeight, h: Math.round(a.getBoundingClientRect().height) }; }));
    }
  } catch (e) {
    res.error = String(e).slice(0, 400);
    try { await page.screenshot({ path: path.join(REFS, `bcg-rb-kearney-${tag}-error.jpg`), type: 'jpeg', quality: 60 }); } catch {}
  }
  fs.writeFileSync(path.join(DATA, `${tag}.json`), JSON.stringify(res, null, 1));
  console.log(tag, 'status', res.status, 'cookie', res.cookie, 'h', res.m && res.m.pageHeight, res.error || '');
  await browser.close();
}

if (mode === 'both' || mode === 'desktop') await run('desktop');
if (mode === 'both' || mode === 'mobile') await run('mobile');
