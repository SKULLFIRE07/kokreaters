// prepare-brand.mjs (pack 2, brief items 4, 11, 12): Ganeaysh's 20 Nov 2026 brand files → the site.
// Idempotent. Reads from BRAND_DIR (default ../research/pack2/brand), never modifies the sources. Outputs are committed.
//  1. Logo SVGs (text already outlined) → src/assets/brand/svg/ (read by components/brand/Logo.astro and NodeMark.astro,
//     scripts/og.mjs and scripts/make-profile-pdf.mjs).
//  2. Favicon option B (navy tile, white mark, saffron node) from brand/favicon → public/ (favicon.ico, favicon.svg,
//     apple-touch-icon.png, icon-192.png, icon-512.png); public/site.webmanifest lists the two PNG icons.
//  3. The square mark (512 px) → public/brand/kokreaters-mark-512.png (JSON-LD Organization.logo).
//  4. The v3 logo set and favicons are deleted if they reappear (OLD).
// Founder photos: `node scripts/make-portrait.mjs` (unchanged; the cut-out comes from ../assets).
import { copyFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BRAND_DIR = resolve(WEB, process.env.BRAND_DIR ?? '../research/pack2/brand');
const src = (p) => resolve(BRAND_DIR, p);
const out = (p) => resolve(WEB, p);
async function ensure(p) { await mkdir(dirname(p), { recursive: true }); return p; }

const LOGOS = ['kokreaters-logo-navy-no-tagline.svg', 'kokreaters-logo-navy.svg', 'kokreaters-logo-white.svg', 'kokreaters-mark.svg'];
const FAVICONS = ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'];
const OLD = [
  'src/assets/brand/svg/kokreaters-logo-full.svg', 'src/assets/brand/svg/kokreaters-logo-full-white.svg',
  'src/assets/brand/svg/kokreaters-logo-horizontal.svg', 'src/assets/brand/svg/kokreaters-logo-horizontal-white.svg',
  'src/assets/brand/svg/kokreaters-wordmark.svg', 'src/assets/brand/svg/kokreaters-wordmark-white.svg',
  'src/assets/brand/svg/kokreaters-node-cluster.svg',
  'public/favicon-32.png', 'public/brand/kokreaters-logo-512.png',
];

async function main() {
  for (const f of LOGOS) await copyFile(src(f), await ensure(out(`src/assets/brand/svg/${f}`)));
  for (const f of FAVICONS) await copyFile(src(`favicon/${f}`), await ensure(out(`public/${f}`)));
  await copyFile(src('kokreaters-mark-512.png'), await ensure(out('public/brand/kokreaters-mark-512.png')));
  for (const f of OLD) if (existsSync(out(f))) await rm(out(f));
  console.log('prepare-brand: done');
}

main().catch((e) => { console.error(e); process.exit(1); });
