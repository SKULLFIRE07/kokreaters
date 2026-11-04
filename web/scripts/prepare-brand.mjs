// prepare-brand.mjs (DESIGN-SPEC v2 5): vector logo set, founder cut-out crops, favicons, grain tile.
// Idempotent. Reads from ASSETS_DIR (default ../assets), never modifies the sources. Outputs are committed.
// The raster wordmark/lockup PNGs of v1 are gone; every logo is the vector set from assets/logo/vector/.
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
];

/** Mulberry32: seeded, so the grain tile is byte-identical on every run. */
function rng(seed) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

async function main() {
  // 1. Vector logo set → src/assets/brand/svg/.
  for (const f of LOGOS) await copyFile(src(`logo/vector/${f}`), await ensure(out(`src/assets/brand/svg/${f}`)));

  // 1b. The horizontal lockup split into its two parts, sharing the file's vertical viewBox (y −25…590): the cluster
  //     (x 20…590) and the wordmark (x 590…2200). Side by side they render exactly like the single file; the header
  //     inlines the cluster (the home dock flies it) and loads the wordmark part as a cached <img>. Paths untouched.
  for (const tone of ['', '-white']) {
    const raw = (await readFile(src(`logo/vector/kokreaters-logo-horizontal${tone}.svg`), 'utf8')).replace(/<!--[\s\S]*?-->/g, '');
    const [, vb] = raw.match(/viewBox="([^"]+)"/);
    const [x, y, w, h] = vb.split(/\s+/).map(Number);
    const body = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    const at = body.indexOf('<path fill=');
    const head = (vbx) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbx}">`;
    await writeFile(await ensure(out(`src/assets/brand/svg/derived/horizontal${tone}-cluster.svg`)), `${head(`${x} ${y} 570 ${h}`)}${body.slice(0, at).trim()}</svg>\n`);
    await writeFile(out(`src/assets/brand/svg/derived/horizontal${tone}-word.svg`), `${head(`${x + 570} ${y} ${w - 570} ${h}`)}${body.slice(at).trim()}</svg>\n`);
  }

  // 2. Old rasters out.
  for (const f of OLD) if (existsSync(out(f))) await rm(out(f));

  // 3. Founder cut-out (1665×2048 RGBA; bottom row hard-cropped, right edge through the shoulder).
  const cut = src('photos/ganeaysh-cutout-clean.png');
  await copyFile(cut, await ensure(out('src/assets/photos/ganeaysh-cutout.png')));
  // Square avatar crop, head centred (face centre ≈ x 760, hair top ≈ y 152, chin ≈ y 1048), alpha kept. Checked visually.
  const SQ = { left: 160, top: 40, width: 1200, height: 1200 };
  await writeFile(out('src/assets/photos/ganeaysh-cutout-square.png'),
    await sharp(cut).extract(SQ).png({ compressionLevel: 9 }).toBuffer());

  // 4. Grain tile: 160×160, 4 grey levels, mostly white (multiply → white is a no-op), palette PNG ≤ 6KB.
  const N = 160, r = rng(0x6b6b);
  const px = Buffer.alloc(N * N);
  for (let i = 0; i < px.length; i++) { const v = r(); px[i] = v < 0.62 ? 255 : v < 0.84 ? 214 : v < 0.96 ? 168 : 120; }
  await writeFile(await ensure(out('src/assets/fx/grain.png')),
    await sharp(px, { raw: { width: N, height: N, channels: 1 } }).png({ palette: true, colours: 4, compressionLevel: 9, effort: 10 }).toBuffer());

  // 5. Favicon SVG: the node cluster minus comment / role / aria / id.
  const svg = (await readFile(src('logo/vector/kokreaters-node-cluster.svg'), 'utf8'))
    .replace(/<!--[\s\S]*?-->\s*/g, '')
    .replace(/\s(role|aria-label)="[^"]*"/g, '')
    .replace(/\s+id="nodes"/, '')
    .replace(/\n\s*\n/g, '\n');
  await writeFile(await ensure(out('public/favicon.svg')), svg.trim() + '\n');

  // 6. Raster icons from the SVG (density 384 so the 512 is sharp).
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
