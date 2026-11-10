#!/usr/bin/env node
/**
 * contrast-check.mjs (REDESIGN-V3 §1.1, §7, §8.1): recomputes the role-token contrast table for the three v3 grounds
 * and fails when a pair is below its WCAG 2.2 AA floor.
 *
 *   palette   `--name: #hex | rgba(…)` inside the first `:root { … }` of src/styles/tokens.css
 *   grounds   `.band--white`, `.band--grey`, `.band--navy` in src/styles/layout.css (each re-declares the role tokens),
 *             plus the `:root` defaults (the white ground every page starts on)
 *   values    `var(--palette)`, `#rrggbb`, `rgb()/rgba()` (alpha is composited over the pair's background, which is
 *             itself composited over the ground's --bg). Anything else (color-mix, nested var chains) is a failure.
 *
 * Floors: text roles ≥ 4.5 (body, secondary, headings, labels, small links, buttons, form text, on the ground and on
 * cards) · large text / non-text ≥ 3.0 (accent figures ≥ 24px, stat figures, focus ring, input borders).
 * Usage: node scripts/contrast-check.mjs [--table]
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokensCss = readFileSync(resolve(ROOT, 'src/styles/tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const layoutCss = readFileSync(resolve(ROOT, 'src/styles/layout.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const TABLE = process.argv.includes('--table');

const decls = (body) => Object.fromEntries([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((d) => [d[1], d[2].trim()]));
const rootBody = tokensCss.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
const root = decls(rootBody);

/** Parse a colour literal to [r, g, b, a] (0–255, alpha 0–1), or null. */
function literal(v) {
  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).concat(1);
  m = v.match(/^#([0-9a-f]{3})$/i);
  if (m) return [...m[1]].map((c) => parseInt(c + c, 16)).concat(1);
  m = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i);
  if (m) {
    const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return [+m[1], +m[2], +m[3], a];
  }
  return null;
}
/** Resolve a declaration value against the ground's own declarations, then the :root palette. */
function resolveColour(v, scope, depth = 0) {
  if (!v || depth > 4) return null;
  const lit = literal(v);
  if (lit) return lit;
  const m = v.match(/^var\((--[\w-]+)\)$/);
  if (!m) return null;
  return resolveColour(scope[m[1]] ?? root[m[1]], scope, depth + 1);
}
const over = (top, under) => {           // source-over compositing; `under` must be opaque
  const a = top[3];
  return [0, 1, 2].map((i) => Math.round(top[i] * a + under[i] * (1 - a))).concat(1);
};
const hex = (c) => '#' + c.slice(0, 3).map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase();
const lum = (c) => {
  const l = c.slice(0, 3).map((x) => x / 255).map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

/** [foreground role, background role, floor, what]. Background roles are composited over --bg first. */
const TEXT = 4.5, LARGE = 3.0;
const CHECKS = [
  ['--fg', '--bg', TEXT, 'body text'],
  ['--fg-2', '--bg', TEXT, 'secondary text'],
  ['--head', '--bg', TEXT, 'headings'],
  ['--label', '--bg', TEXT, 'labels / eyebrows'],
  ['--link', '--bg', TEXT, 'small links'],
  ['--accent', '--bg', LARGE, 'accent (≥ 24px, arrows)'],
  ['--figure', '--bg', LARGE, 'stat figures (≥ 48px)'],
  ['--focus', '--bg', LARGE, 'focus ring'],
  ['--fg', '--surface', TEXT, 'card text'],
  ['--fg-2', '--surface', TEXT, 'card secondary text'],
  ['--head', '--surface', TEXT, 'card titles'],
  ['--label', '--surface', TEXT, 'card labels'],
  ['--link', '--surface', TEXT, 'card links'],
  ['--accent', '--surface', LARGE, 'card accent figures'],
  ['--focus', '--surface', LARGE, 'focus ring on cards'],
  ['--fg', '--surface-hover', TEXT, 'card text (hover)'],
  ['--head', '--surface-hover', TEXT, 'card titles (hover)'],
  ['--btn-fg', '--btn-bg', TEXT, 'primary button'],
  ['--btn-fg', '--btn-bg-hover', TEXT, 'primary button (hover)'],
  ['--fg', '--field-bg', TEXT, 'form field text'],
  ['--field-border', '--field-bg', LARGE, 'form field border'],
];
/** Fixed-colour pairs used outside the role system (form states on light grounds). */
const FIXED = [
  ['--danger', '--white', TEXT, 'error text on white'], ['--danger', '--grey-50', TEXT, 'error text on grey'],
  ['--success', '--white', TEXT, 'success text on white'], ['--success', '--grey-50', TEXT, 'success text on grey'],
];

const grounds = [['root (white default)', root]];
for (const m of layoutCss.matchAll(/\.band--(white|grey|navy)\s*\{([^}]*)\}/g)) grounds.push([`.band--${m[1]}`, { ...decls(m[2]) }]);

const failures = []; const rows = [];
for (const [g, scope] of grounds) {
  const bg = resolveColour(scope['--bg'], scope);
  if (!bg || bg[3] !== 1) { failures.push(`${g}: --bg not resolvable to an opaque colour (${scope['--bg']})`); continue; }
  for (const [fgRole, bgRole, min, what] of CHECKS) {
    const fgRaw = resolveColour(scope[fgRole], scope);
    const bgRaw = bgRole === '--bg' ? bg : resolveColour(scope[bgRole], scope);
    if (!fgRaw || !bgRaw) { failures.push(`${g}: ${fgRole} (${scope[fgRole]}) or ${bgRole} (${scope[bgRole]}) not resolvable`); continue; }
    const b = over(bgRaw, bg);
    const f = over(fgRaw, b);
    const r = ratio(f, b);
    rows.push({ g, what, pair: `${fgRole} ${hex(f)} on ${bgRole} ${hex(b)}`, r, min });
    if (r + 1e-9 < min) failures.push(`${g}: ${what} ${fgRole} ${hex(f)} on ${bgRole} ${hex(b)} = ${r.toFixed(2)} < ${min}`);
  }
}
for (const [fgRole, bgRole, min, what] of FIXED) {
  const f = resolveColour(root[fgRole], root), b = resolveColour(root[bgRole], root);
  if (!f || !b) { failures.push(`fixed: ${fgRole} or ${bgRole} not resolvable`); continue; }
  const r = ratio(f, b);
  rows.push({ g: 'fixed', what, pair: `${fgRole} ${hex(f)} on ${bgRole} ${hex(b)}`, r, min });
  if (r + 1e-9 < min) failures.push(`fixed: ${what} = ${r.toFixed(2)} < ${min}`);
}
if (grounds.length < 4) failures.push(`expected :root + 3 grounds (.band--white/grey/navy), parsed ${grounds.length}`);

if (TABLE) for (const r of rows) console.log(`${r.g.padEnd(21)} ${r.what.padEnd(26)} ${r.r.toFixed(2).padStart(6)} ≥ ${r.min}  ${r.pair}`);
if (failures.length) { console.error(`contrast-check: FAIL (${failures.length})\n  - ${failures.join('\n  - ')}`); process.exit(1); }
console.log(`contrast-check: ${rows.length} pairs on ${grounds.length} grounds pass (text ≥ 4.5, large/non-text ≥ 3.0)`);
