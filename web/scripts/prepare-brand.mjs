// prepare-brand.mjs (REDESIGN-V3 §2): vector logo set, the founder cut-out (input of make-portrait.mjs), favicons.
// Idempotent. Reads from ASSETS_DIR (default ../assets), never modifies the sources. Outputs are committed.
// Every logo is the vector set from assets/logo/vector/. v3 dropped the v2 grain tile, the home-dock logo split
// (svg/derived/*) and the cut-out square crop; this script deletes them if they reappear (OLD list).
// Founder photos: run `node scripts/make-portrait.mjs` after this (cut-out → graded 4:5 portrait + square crop).
import sharp from 'sharp';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS_DIR = resolve(WEB, process.env.ASSETS_DIR ?? '../assets');
const src = (p) => resolve(ASSETS_DIR, p);
const out = (p) => resolve(WEB, p);
async function ensure(p) { await mkdir(dirname(p), { recursive: true }); return p; }

const LOGOS = [
  'kokreaters-logo-full.svg', 'kokreaters-logo-full-white.svg',
  'kokreaters-logo-horizontal.svg', 'kokreaters-logo-horizontal-white.svg',
  'kokreaters-wordmark.svg', 'kokreaters-wordmark-white.svg',
  'kokreaters-node-cluster.svg',
];
const OLD = [
  'src/assets/brand/wordmark.png', 'src/assets/brand/wordmark-white.png', 'src/assets/brand/lockup-tagline.png',
  'src/assets/brand/lockup-tagline-white.png', 'src/assets/brand/logo-full.png',
  'src/assets/photos/ganeaysh-portrait.png', 'src/assets/photos/ganeaysh-square.png',
  // v2 → v3
  'src/assets/fx/grain.png', 'src/assets/photos/ganeaysh-cutout-square.png',
  'src/assets/brand/svg/derived/horizontal-cluster.svg', 'src/assets/brand/svg/derived/horizontal-white-cluster.svg',
  'src/assets/brand/svg/derived/horizontal-word.svg', 'src/assets/brand/svg/derived/horizontal-white-word.svg',
];

async function main() {
  // 1. Vector logo set → src/assets/brand/svg/.
  for (const f of LOGOS) await copyFile(src(`logo/vector/${f}`), await ensure(out(`src/assets/brand/svg/${f}`)));

  // 2. Old rasters and v2 leftovers out.
  for (const f of OLD) if (existsSync(out(f))) await rm(out(f));
  for (const d of ['src/assets/fx', 'src/assets/brand/svg/derived']) if (existsSync(out(d))) await rm(out(d), { recursive: true, force: true });

  // 3. Founder cut-out (1665×2048 RGBA, lapel pin removed): the input of scripts/make-portrait.mjs, never shown as is.
  await copyFile(src('photos/ganeaysh-cutout-clean.png'), await ensure(out('src/assets/photos/ganeaysh-cutout.png')));

  // 4. Favicon SVG: the node cluster minus comment / role / aria / id.
  const svg = (await readFile(src('logo/vector/kokreaters-node-cluster.svg'), 'utf8'))
    .replace(/<!--[\s\S]*?-->\s*/g, '')
    .replace(/\s(role|aria-label)="[^"]*"/g, '')
    .replace(/\s+id="nodes"/, '')
    .replace(/\n\s*\n/g, '\n');
  await writeFile(await ensure(out('public/favicon.svg')), svg.trim() + '\n');

  // 5. Raster icons from the SVG (density 384 so the 512 is sharp).
  const svgBuf = Buffer.from(svg);
  const clear = { r: 255, g: 255, b: 255, alpha: 0 };
  const icon = (n) => sharp(svgBuf, { density: 384 }).resize(n, n, { fit: 'contain', background: clear }).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(out('public/favicon-32.png'), await icon(32));
  await writeFile(out('public/icon-512.png'), await icon(512));
  await writeFile(await ensure(out('public/brand/kokreaters-logo-512.png')), await icon(512));
  const inner = Math.round(180 * 0.76);
  const pad = Math.round((180 - inner) / 2);
  await writeFile(out('public/apple-touch-icon.png'),
    await sharp(await icon(inner))
      .extend({ top: pad, bottom: 180 - inner - pad, left: pad, right: 180 - inner - pad, background: '#ffffff' })
      .flatten({ background: '#ffffff' })
      .png({ compressionLevel: 9 })
      .toBuffer());

  console.log('prepare-brand: done');
}

main().catch((e) => { console.error(e); process.exit(1); });
