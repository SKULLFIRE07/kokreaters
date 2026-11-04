#!/usr/bin/env node
/**
 * contrast-check.mjs (DESIGN-SPEC v2 3.3): recomputes the ground contrast table from src/styles/tokens.css and
 * src/styles/grounds.css and fails when a pair is below its WCAG 2.2 AA floor:
 *   text roles (--fg, --head, --fg-2, --link) on --bg ≥ 4.5 · pill label on pill fill and on the sweep ≥ 4.5 ·
 *   chip label on chip ≥ 4.5 · --note (Caveat ≥ 24px = large text) ≥ 3.0 · --focus ring on --bg ≥ 3.0 (non-text).
 * Usage: node scripts/contrast-check.mjs [--table]
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = readFileSync(resolve(ROOT, 'src/styles/tokens.css'), 'utf8');
const grounds = readFileSync(resolve(ROOT, 'src/styles/grounds.css'), 'utf8');
const TABLE = process.argv.includes('--table');

const kk = {};
for (const m of tokens.matchAll(/--kk-([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) kk[m[1]] = m[2];
const resolveVal = (v) => {
  v = v.trim();
  const m = v.match(/^var\(--kk-([\w-]+)\)$/); if (m) return kk[m[1]];
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  return null;
};
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const CHECKS = [
  ['--fg', '--bg', 4.5, 'text'], ['--head', '--bg', 4.5, 'headings'], ['--fg-2', '--bg', 4.5, 'secondary text'],
  ['--link', '--bg', 4.5, 'links'], ['--note', '--bg', 3.0, 'notes (Caveat ≥ 24px)'], ['--focus', '--bg', 3.0, 'focus ring'],
  ['--pill-fg', '--pill-bg', 4.5, 'pill label'], ['--pill-sweep-fg', '--pill-sweep', 4.5, 'pill label on sweep'],
  ['--chip-fg', '--chip-bg', 4.5, 'chip label'],
];
const failures = []; const rows = [];
for (const m of grounds.matchAll(/^\.g-([\w-]+)\s*\{([^}]*)\}/gm)) {
  const g = m[1]; const vars = {};
  for (const d of m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[d[1]] = resolveVal(d[2]);
  for (const [fg, bg, min, what] of CHECKS) {
    const a = vars[fg], b = vars[bg];
    if (!a || !b) { failures.push(`.g-${g}: ${fg} or ${bg} not resolvable`); continue; }
    const r = ratio(a, b);
    rows.push({ g, what, pair: `${fg} ${a} on ${bg} ${b}`, r: r.toFixed(2), min });
    if (r + 1e-9 < min) failures.push(`.g-${g}: ${what} ${fg} ${a} on ${bg} ${b} = ${r.toFixed(2)} < ${min}`);
  }
}
if (!rows.length) failures.push('no grounds parsed from grounds.css');
if (TABLE) for (const r of rows) console.log(`${('.g-' + r.g).padEnd(13)} ${r.what.padEnd(24)} ${r.r.padStart(6)} ≥ ${r.min}  ${r.pair}`);
const grounds_n = new Set(rows.map((r) => r.g)).size;
if (failures.length) { console.error(`contrast-check: FAIL (${failures.length})\n  - ${failures.join('\n  - ')}`); process.exit(1); }
console.log(`contrast-check: ${rows.length} pairs on ${grounds_n} grounds pass (text ≥ 4.5, notes/focus ≥ 3.0)`);
