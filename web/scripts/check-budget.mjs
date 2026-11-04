#!/usr/bin/env node
/**
 * check-budget.mjs (W3-tests, DESIGN-SPEC 6.10 + section 9 W3-tests budgets)
 *
 * Post-build gzip gates over the static output:
 *   - JS per page (gzip, level 9): the module graph each HTML starts, i.e. the static import closure of every
 *     <script src> / modulepreload, PLUS the page module that motion/index.ts loads for this page's data-page
 *     (import.meta.glob → dynamic import that always runs at boot) and its static closure.
 *     home ≤ 95KB, every other page ≤ 85KB. Lazy chunks (Flip, Draggable, three) are reported, not counted.
 *   - CSS per page (linked stylesheets + inline <style>) ≤ 60KB gzip.
 *   - Fonts: all woff2 under /fonts ≤ 240KB (v2 2.1; woff2 is already compressed; raw bytes).
 *   - Old assets (v2 5.2): nothing in src/ may reference the v1 raster logos or the old founder crops.
 *   - Lazy chunks (v2 8.5): each ≤ 35KB gzip (three.js has its own gate).
 *   - three.js: any chunk containing three.js may be reachable only from about.html.
 * Usage: node scripts/check-budget.mjs [--dist <dir>] [--json]   (env KK_DIST also works)
 * Exits 1 when a gate fails.
 */
import { gzipSync } from 'node:zlib';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const DIST = resolve(ROOT, opt('--dist') ?? process.env.KK_DIST ?? 'dist');
const JSON_OUT = args.includes('--json');
if (!existsSync(DIST)) { console.error(`check-budget: ${DIST} does not exist. Run the build first.`); process.exit(1); }

const KB = 1024;
const BUDGET = { jsHome: 95 * KB, jsOther: 85 * KB, css: 60 * KB, fonts: 240 * KB, three: 170 * KB, lazyChunk: 35 * KB };
// motion/index.ts pageFile() map (DESIGN-SPEC 6.2)
const PAGE_FILE = { home: 'home', pillar: 'expertise', expertise: 'expertise', industries: 'industries', approach: 'approach',
  impact: 'impact', insights: 'insights', article: 'article', about: 'about', contact: 'contact', notfound: 'notfound' };

function walk(dir, ext, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, ext, out); else if (p.endsWith(ext)) out.push(p);
  }
  return out;
}
const gz = new Map();
const gzipSize = (abs) => { if (!gz.has(abs)) gz.set(abs, gzipSync(readFileSync(abs), { level: 9 }).length); return gz.get(abs); };
const toAbs = (url, fromFile) => {
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) return null;
  const clean = url.split(/[?#]/)[0];
  return clean.startsWith('/') ? join(DIST, clean) : join(dirname(fromFile), clean);
};

// ── JS module graph ──
const graph = new Map(); // abs → { static:Set, dynamic:Set, globPages: Map<page, abs>, isThree }
const STR = String.raw`["'\x60]([^"'\x60]+?\.js)["'\x60]`;
const reStatic = new RegExp(String.raw`(?:\bimport|\bexport)\s*(?:[\w*$\s{},]*?\bfrom\s*)?` + STR, 'g');
const reDynamic = new RegExp(String.raw`\bimport\s*\(\s*` + STR + String.raw`\s*\)`, 'g');
const reGlob = new RegExp(String.raw`["'\x60]\.\.\/pages\/([\w-]+)\.ts["'\x60]\s*:\s*\(\)\s*=>[^]*?\bimport\s*\(\s*` + STR, 'g');
function node(abs) {
  if (graph.has(abs)) return graph.get(abs);
  const n = { static: new Set(), dynamic: new Set(), globPages: new Map(), isThree: false };
  graph.set(abs, n);
  if (!existsSync(abs)) return n;
  const src = readFileSync(abs, 'utf8');
  n.isThree = /THREE\.WebGLRenderer|WebGLRenderingContext.*REVISION|three\.module/.test(src) && /WebGL/.test(src) && src.length > 100_000;
  const globSpans = [];
  for (const m of src.matchAll(reGlob)) { n.globPages.set(m[1], toAbs(m[2], abs)); globSpans.push(m[2]); }
  for (const m of src.matchAll(reDynamic)) { if (!globSpans.includes(m[1])) n.dynamic.add(toAbs(m[1], abs)); }
  // static: remove dynamic import(...) occurrences first so they are not double counted
  const noDyn = src.replace(reDynamic, '');
  for (const m of noDyn.matchAll(reStatic)) n.static.add(toAbs(m[1], abs));
  for (const s of [...n.static]) if (!s) n.static.delete(s);
  return n;
}
function staticClosure(roots) {
  const seen = new Set(); const stack = [...roots];
  while (stack.length) { const a = stack.pop(); if (!a || seen.has(a)) continue; seen.add(a); for (const s of node(a).static) stack.push(s); }
  return seen;
}
function fullClosure(roots, page) {
  // everything this page can ever load: statics, dynamics, and only its own glob page module
  const seen = new Set(); const stack = [...roots];
  while (stack.length) {
    const a = stack.pop(); if (!a || seen.has(a)) continue; seen.add(a);
    const n = node(a);
    for (const s of n.static) stack.push(s);
    for (const d of n.dynamic) stack.push(d);
    const own = n.globPages.get(PAGE_FILE[page] ?? '__none'); if (own) stack.push(own);
    // page modules that are themselves loaded by another page module (hero.ts, dock.ts from home.ts) are reached via their dynamic imports
  }
  return seen;
}

const results = [];
const failures = [];
const threeSeen = new Map(); // three chunk → pages reaching it

for (const file of walk(DIST, '.html')) {
  const rel = file.slice(DIST.length + 1);
  const html = readFileSync(file, 'utf8');
  const page = (html.match(/<body[^>]*\bdata-page=["']([\w-]+)["']/) ?? [])[1] ?? '';
  const roots = [];
  for (const m of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) roots.push(toAbs(m[1], file));
  for (const m of html.matchAll(/<link\b[^>]*rel=["']modulepreload["'][^>]*href=["']([^"']+)["']/gi)) roots.push(toAbs(m[1], file));
  const initial = staticClosure(roots.filter(Boolean));
  const pageModules = new Set();
  for (const a of initial) { const own = node(a).globPages.get(PAGE_FILE[page] ?? '__none'); if (own) pageModules.add(own); }
  const boot = staticClosure([...initial, ...pageModules]);
  const all = fullClosure(roots.filter(Boolean), page);
  const lazy = [...all].filter((a) => !boot.has(a));
  const jsBytes = [...boot].filter(existsSync).reduce((s, a) => s + gzipSize(a), 0);
  const lazyBytes = lazy.filter(existsSync).reduce((s, a) => s + gzipSize(a), 0);
  for (const a of all) if (node(a).isThree) { if (!threeSeen.has(a)) threeSeen.set(a, []); threeSeen.get(a).push(rel); }

  let cssBytes = 0;
  for (const m of html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)) {
    const a = toAbs(m[1], file); if (a && existsSync(a)) cssBytes += gzipSize(a);
  }
  for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) cssBytes += gzipSync(Buffer.from(m[1]), { level: 9 }).length;
  const htmlBytes = gzipSize(file);

  const jsBudget = page === 'home' ? BUDGET.jsHome : BUDGET.jsOther;
  const row = { page: rel, dataPage: page, html: htmlBytes, js: jsBytes, jsBudget, jsLazy: lazyBytes,
    lazyChunks: lazy.map((a) => posix.basename(a)), css: cssBytes };
  results.push(row);
  if (jsBytes > jsBudget) failures.push(`${rel}: JS ${fmt(jsBytes)} > ${fmt(jsBudget)} gzip`);
  if (cssBytes > BUDGET.css) failures.push(`${rel}: CSS ${fmt(cssBytes)} > ${fmt(BUDGET.css)} gzip`);
}

for (const [chunk, pages] of threeSeen) {
  const bad = pages.filter((p) => p !== 'about.html');
  if (bad.length) failures.push(`three chunk ${posix.basename(chunk)} reachable from ${bad.join(', ')} (about.html only)`);
  const size = gzipSize(chunk);
  if (size > BUDGET.three) failures.push(`three chunk ${posix.basename(chunk)} ${fmt(size)} > ${fmt(BUDGET.three)} gzip`);
}

const fontsDir = join(DIST, 'fonts');
const fonts = existsSync(fontsDir) ? walk(fontsDir, '.woff2') : [];
const fontBytes = fonts.reduce((s, f) => s + statSync(f).size, 0);
if (!fonts.length) failures.push('no woff2 files in dist/fonts');
if (fontBytes > BUDGET.fonts) failures.push(`fonts ${fmt(fontBytes)} > ${fmt(BUDGET.fonts)}`);

// v2 5.2: no v1 raster logo or old founder crop may be referenced anywhere in src/
const OLD_ASSETS = /ganeaysh-portrait|ganeaysh-square|wordmark\.png|lockup-tagline|logo-full\.png/;
for (const f of walk(join(ROOT, 'src'), '')) {
  if (!/\.(astro|ts|tsx|js|mjs|css|mdx?|json)$/.test(f)) continue;
  readFileSync(f, 'utf8').split('\n').forEach((l, i) => { if (OLD_ASSETS.test(l)) failures.push(`old asset referenced: ${f.slice(ROOT.length + 1)}:${i + 1}`); });
}
for (const old of ['src/assets/brand/wordmark.png', 'src/assets/brand/logo-full.png', 'src/assets/photos/ganeaysh-portrait.png', 'src/assets/photos/ganeaysh-square.png']) {
  if (existsSync(join(ROOT, old))) failures.push(`old asset still present: ${old}`);
}
// v2 8.5: every lazy chunk ≤ 35KB gzip (three.js has its own gate)
const lazySeen = new Set();
for (const r of results) for (const c of r.lazyChunks) lazySeen.add(c);
for (const c of lazySeen) {
  const abs = join(DIST, '_astro', c);
  if (!existsSync(abs) || node(abs).isThree) continue;
  const size = gzipSize(abs);
  if (size > BUDGET.lazyChunk) failures.push(`lazy chunk ${c} ${fmt(size)} > ${fmt(BUDGET.lazyChunk)} gzip`);
}

function fmt(b) { return `${(b / KB).toFixed(1)}KB`; }

if (JSON_OUT) {
  console.log(JSON.stringify({ dist: DIST, results, fonts: { files: fonts.map((f) => posix.basename(f)), bytes: fontBytes },
    three: [...threeSeen].map(([c, p]) => ({ chunk: posix.basename(c), gzip: gzipSize(c), pages: p })), failures }, null, 2));
} else {
  console.log(`check-budget: ${DIST}`);
  console.log('page'.padEnd(52) + 'html'.padStart(9) + 'js'.padStart(9) + ' /budget' + 'lazy'.padStart(9) + 'css'.padStart(9));
  for (const r of results.sort((a, b) => a.page.localeCompare(b.page))) {
    console.log(r.page.padEnd(52) + fmt(r.html).padStart(9) + fmt(r.js).padStart(9) + ` /${(r.jsBudget / KB).toFixed(0)}KB`.padEnd(8) +
      fmt(r.jsLazy).padStart(9) + fmt(r.css).padStart(9) + (r.lazyChunks.length ? `   lazy: ${r.lazyChunks.join(', ')}` : ''));
  }
  console.log(`fonts: ${fonts.length} file(s), ${fmt(fontBytes)} / ${fmt(BUDGET.fonts)}`);
  if (threeSeen.size) for (const [c, p] of threeSeen) console.log(`three: ${posix.basename(c)} ${fmt(gzipSize(c))} gzip, reachable from ${p.join(', ')}`);
  else console.log('three: no three.js chunk in this build');
  if (failures.length) { console.error(`\ncheck-budget: FAIL (${failures.length})\n  - ${failures.join('\n  - ')}`); }
  else console.log('\ncheck-budget: all budgets pass');
}
process.exit(failures.length ? 1 : 0);
