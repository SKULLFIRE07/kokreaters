#!/usr/bin/env node
/**
 * check-budget.mjs (REDESIGN-V3 §1.2, §1.5, §7): static post-build gates over dist/.
 *
 *   JS per page      gzip (level 9) of everything the page can load: the static + dynamic import closure of every
 *                    <script src> / modulepreload, plus inline module/classic scripts (the head script). ≤ 15 KB.
 *   CSS per page     linked stylesheets + inline <style>, gzip ≤ 60 KB.
 *   Fonts            dist/fonts: exactly the three v3 woff2 files (Source Serif 4 opsz normal + italic, Inter opsz),
 *                    ≤ 330 KB together (woff2 is already compressed: raw bytes). No v2 family may ship.
 *   Banned libraries no dist/_astro/*.js may carry GSAP, Lenis or three.js (§1.5: "Delete GSAP, Lenis and Three").
 *   Palette          no v2 purple / pink / yellow / red hex in built CSS (dist/_astro/*.css + inline <style> + style=""
 *                    attributes). The node-cluster logo keeps its colours, so SVG files and inline <svg> are exempt.
 *   Old assets       nothing in src/ may reference a v1/v2 asset (raster logos, cut-out photo, grain, globe, v2 fonts).
 *
 * Usage: node scripts/check-budget.mjs [--dist <dir>] [--json]   (env KK_DIST also works). Exits 1 when a gate fails.
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
const BUDGET = { js: 15 * KB, css: 60 * KB, fonts: 330 * KB };
const FONT_FILES = ['bodoni-moda-latin-opsz-italic.woff2', 'bodoni-moda-latin-opsz-normal.woff2', 'manrope-latin-wght-normal.woff2'];
/** Signatures of the three libraries v3 removed. */
const BANNED_JS = [
  ['GSAP', /GreenSock|gsap\.registerPlugin|_gsScope|ScrollTrigger\.create|\bgsap\.(?:to|from|timeline)\(/],
  ['Lenis', /__lenis|new Lenis\b|lenis-smooth|data-lenis-prevent/],
  ['three.js', /WebGLRenderer|THREE\.REVISION|three\.module|WebGLRenderingContext[\s\S]{0,200}REVISION/],
];
/** v2 palette (DESIGN-SPEC v2 3.1): purple, pink, yellow, red and their tints. Only the logo artwork may use them. */
const V2_HEXES = ['#F4C841', '#E5494D', '#3A1C5C', '#5B2A86', '#7B4BC4', '#8C5B88', '#C8457E', '#EADCFF', '#FFEEB0',
  '#F6DCE8', '#A2335F', '#6F4470', '#F8F6FC'];
const OLD_ASSETS = /ganeaysh-portrait\.png|ganeaysh-portrait-1665|ganeaysh-square|ganeaysh-cutout|wordmark\.png|lockup-tagline|logo-full\.png|fx\/grain|grain\.png|globe-static|coast\.json|bricolage|caveat|ibm-plex|instrument-sans/i;

function walk(dir, ext, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, ext, out); else if (p.endsWith(ext)) out.push(p);
  }
  return out;
}
const gz = new Map();
const gzipSize = (abs) => { if (!gz.has(abs)) gz.set(abs, gzipSync(readFileSync(abs), { level: 9 }).length); return gz.get(abs); };
const gzipStr = (s) => gzipSync(Buffer.from(s), { level: 9 }).length;
const toAbs = (url, fromFile) => {
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) return null;
  const clean = url.split(/[?#]/)[0];
  return clean.startsWith('/') ? join(DIST, clean) : join(dirname(fromFile), clean);
};

// ── JS module graph (static + dynamic imports between built chunks) ──
const STR = String.raw`["'\x60]([^"'\x60]+?\.js)["'\x60]`;
const reStatic = new RegExp(String.raw`(?:\bimport|\bexport)\s*(?:[\w*$\s{},]*?\bfrom\s*)?` + STR, 'g');
const reDynamic = new RegExp(String.raw`\bimport\s*\(\s*` + STR + String.raw`\s*\)`, 'g');
const edges = new Map();
function deps(abs) {
  if (edges.has(abs)) return edges.get(abs);
  const out = new Set();
  edges.set(abs, out);
  if (!existsSync(abs)) return out;
  const src = readFileSync(abs, 'utf8');
  for (const re of [reDynamic, reStatic]) for (const m of src.matchAll(re)) { const a = toAbs(m[1], abs); if (a) out.add(a); }
  return out;
}
function closure(roots) {
  const seen = new Set(); const stack = [...roots];
  while (stack.length) { const a = stack.pop(); if (!a || seen.has(a)) continue; seen.add(a); for (const d of deps(a)) stack.push(d); }
  return seen;
}
const NON_JS_TYPES = /application\/(?:ld\+)?json|text\/(?:plain|template|x-template)/i;

const results = [];
const failures = [];
const cssHits = [];
const scanCss = (css, where) => {
  for (const m of css.matchAll(/#([0-9a-f]{6})\b/gi)) if (V2_HEXES.includes(`#${m[1].toUpperCase()}`)) cssHits.push(`${where}: #${m[1].toUpperCase()}`);
};

for (const file of walk(DIST, '.html')) {
  const rel = file.slice(DIST.length + 1);
  if (rel === 'styleguide.html') continue;   // staging-only dev page (a redirect stub in other modes)
  const html = readFileSync(file, 'utf8');
  const page = (html.match(/<body[^>]*\bdata-page=["']([\w-]+)["']/) ?? [])[1] ?? '';
  const roots = [];
  for (const m of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) roots.push(toAbs(m[1], file));
  for (const m of html.matchAll(/<link\b[^>]*rel=["']modulepreload["'][^>]*href=["']([^"']+)["']/gi)) roots.push(toAbs(m[1], file));
  const chunks = [...closure(roots.filter(Boolean))].filter(existsSync);
  let inline = 0;
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc=/.test(m[1]) || NON_JS_TYPES.test(m[1]) || !m[2].trim()) continue;
    inline += gzipStr(m[2]);
  }
  const jsBytes = chunks.reduce((s, a) => s + gzipSize(a), 0) + inline;

  let cssBytes = 0;
  for (const m of html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)) {
    const a = toAbs(m[1], file); if (a && existsSync(a)) cssBytes += gzipSize(a);
  }
  const noSvg = html.replace(/<svg\b[\s\S]*?<\/svg>/gi, '');
  for (const m of noSvg.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) { cssBytes += gzipStr(m[1]); scanCss(m[1], `${rel} <style>`); }
  for (const m of noSvg.matchAll(/\sstyle="([^"]*)"/gi)) scanCss(m[1], `${rel} style=""`);
  const htmlBytes = gzipSize(file);

  results.push({ page: rel, dataPage: page, html: htmlBytes, js: jsBytes, jsChunks: chunks.map((a) => posix.basename(a)), css: cssBytes });
  if (jsBytes > BUDGET.js) failures.push(`${rel}: JS ${fmt(jsBytes)} > ${fmt(BUDGET.js)} gzip`);
  if (cssBytes > BUDGET.css) failures.push(`${rel}: CSS ${fmt(cssBytes)} > ${fmt(BUDGET.css)} gzip`);
}

// ── Banned libraries + palette over every built asset ──
const astroDir = join(DIST, '_astro');
const jsFiles = existsSync(astroDir) ? walk(astroDir, '.js') : [];
for (const f of jsFiles) {
  const src = readFileSync(f, 'utf8');
  for (const [name, re] of BANNED_JS) if (re.test(src)) failures.push(`banned library ${name} in ${posix.basename(f)}`);
}
for (const f of existsSync(astroDir) ? walk(astroDir, '.css') : []) scanCss(readFileSync(f, 'utf8'), `_astro/${posix.basename(f)}`);
for (const h of cssHits) failures.push(`v2 palette colour in built CSS: ${h}`);

// ── Fonts ──
const fontsDir = join(DIST, 'fonts');
const fonts = existsSync(fontsDir) ? walk(fontsDir, '.woff2') : [];
const fontBytes = fonts.reduce((s, f) => s + statSync(f).size, 0);
const fontNames = fonts.map((f) => posix.basename(f)).sort();
if (!fonts.length) failures.push('no woff2 files in dist/fonts (run node scripts/copy-fonts.mjs before astro build)');
for (const n of fontNames) if (!FONT_FILES.includes(n)) failures.push(`unexpected font shipped: fonts/${n}`);
for (const n of FONT_FILES) if (!fontNames.includes(n)) failures.push(`missing font: fonts/${n}`);
if (fontBytes > BUDGET.fonts) failures.push(`fonts ${fmt(fontBytes)} > ${fmt(BUDGET.fonts)}`);

// ── Old assets referenced from src/ ──
for (const f of walk(join(ROOT, 'src'), '')) {
  if (!/\.(astro|ts|tsx|js|mjs|css|mdx?|json)$/.test(f)) continue;
  readFileSync(f, 'utf8').split('\n').forEach((l, i) => { if (OLD_ASSETS.test(l)) failures.push(`old asset referenced: ${f.slice(ROOT.length + 1)}:${i + 1}`); });
}
for (const old of ['src/assets/brand/wordmark.png', 'src/assets/brand/logo-full.png', 'src/assets/photos/ganeaysh-portrait.png',
  'src/assets/photos/ganeaysh-square.png', 'src/assets/fx/grain.png', 'src/assets/globe/globe-static.svg', 'src/data/globe/coast.json']) {
  if (existsSync(join(ROOT, old))) failures.push(`old asset still present: ${old}`);
}

function fmt(b) { return `${(b / KB).toFixed(1)}KB`; }

if (JSON_OUT) {
  console.log(JSON.stringify({ dist: DIST, budget: BUDGET, results, fonts: { files: fontNames, bytes: fontBytes }, failures }, null, 2));
} else {
  console.log(`check-budget: ${DIST}`);
  console.log('page'.padEnd(52) + 'html'.padStart(9) + 'js'.padStart(9) + 'css'.padStart(9) + '   chunks');
  for (const r of results.sort((a, b) => a.page.localeCompare(b.page))) {
    console.log(r.page.padEnd(52) + fmt(r.html).padStart(9) + fmt(r.js).padStart(9) + fmt(r.css).padStart(9) + `   ${r.jsChunks.length}`);
  }
  const maxJs = Math.max(...results.map((r) => r.js)), maxCss = Math.max(...results.map((r) => r.css));
  console.log(`max JS ${fmt(maxJs)} / ${fmt(BUDGET.js)} · max CSS ${fmt(maxCss)} / ${fmt(BUDGET.css)} gzip`);
  console.log(`fonts: ${fonts.length} file(s), ${fmt(fontBytes)} / ${fmt(BUDGET.fonts)}`);
  console.log(`banned libraries: ${jsFiles.length} chunk(s) scanned · palette: ${cssHits.length} v2 colour(s)`);
  if (failures.length) { console.error(`\ncheck-budget: FAIL (${failures.length})\n  - ${failures.join('\n  - ')}`); }
  else console.log('\ncheck-budget: all budgets pass');
}
process.exit(failures.length ? 1 : 0);
