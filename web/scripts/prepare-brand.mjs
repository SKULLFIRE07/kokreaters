// W1-brand: brand rasters, favicons and portrait crops (DESIGN-SPEC section 7).
// Idempotent. Reads from ASSETS_DIR, never modifies the sources. Outputs are committed.
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS_DIR = resolve(WEB, process.env.ASSETS_DIR ?? '../assets');
const src = (p) => resolve(ASSETS_DIR, p);
const out = (p) => resolve(WEB, p);

async function ensure(p) { await mkdir(dirname(p), { recursive: true }); return p; }

/** Recolour every opaque pixel to white, keeping the alpha channel. */
async function toWhite(buf) {
  const img = sharp(buf).ensureAlpha();
  const { width, height } = await img.metadata();
  const alpha = await img.clone().extractChannel('alpha').toBuffer();
  return sharp({ create: { width, height, channels: 3, background: '#ffffff' } })
    .joinChannel(alpha)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  const fullPath = src('logo/kokreaters-logo-full-transparent.png');
  const lockupPath = src('logo/kokreaters-wordmark-tagline-raster.png');
  const portraitPath = src('photos/ganeaysh-portrait-1665x2048.png');
  const clusterPath = src('logo/kokreaters-node-cluster.svg');

  // 1. Wordmark + rising arrow, no tagline ("Create" starts at about y=370).
  // Two pipelines: sharp applies trim before extract when both are chained.
  const wordmarkRaw = await sharp(fullPath)
    .extract({ left: 675, top: 30, width: 1510, height: 322 })
    .png()
    .toBuffer();
  const wordmark = await sharp(wordmarkRaw).trim().png({ compressionLevel: 9 }).toBuffer();
  await writeFile(await ensure(out('src/assets/brand/wordmark.png')), wordmark);
  await writeFile(out('src/assets/brand/wordmark-white.png'), await toWhite(wordmark));

  // 2. Wordmark + tagline lockup, positive and reversed.
  const lockup = await sharp(lockupPath).trim().png({ compressionLevel: 9 }).toBuffer();
  await writeFile(out('src/assets/brand/lockup-tagline.png'), lockup);
  await writeFile(out('src/assets/brand/lockup-tagline-white.png'), await toWhite(lockup));

  // 3. Full logo, trimmed.
  await writeFile(out('src/assets/brand/logo-full.png'),
    await sharp(fullPath).trim().png({ compressionLevel: 9 }).toBuffer());

  // 4. Portrait crops. Both exclude the lapel pin (about x 1090–1130, y 1300–1352). C-17.
  await writeFile(await ensure(out('src/assets/photos/ganeaysh-portrait.png')),
    await sharp(portraitPath).extract({ left: 252, top: 0, width: 1016, height: 1270 }).png({ compressionLevel: 9 }).toBuffer());
  await writeFile(out('src/assets/photos/ganeaysh-square.png'),
    await sharp(portraitPath).extract({ left: 260, top: 150, width: 1050, height: 1050 }).png({ compressionLevel: 9 }).toBuffer());

  // 5. Favicon SVG: same file, comment and role/aria removed.
  const svg = (await readFile(clusterPath, 'utf8'))
    .replace(/<!--[\s\S]*?-->\s*/g, '')
    .replace(/\s(role|aria-label)="[^"]*"/g, '')
    .replace(/\s+id="nodes"/, '');
  await writeFile(await ensure(out('public/favicon.svg')), svg.trim() + '\n');

  // 6. Raster icons from the SVG.
  const svgBuf = Buffer.from(svg);
  const clear = { r: 255, g: 255, b: 255, alpha: 0 };
  const icon = (n) => sharp(svgBuf, { density: 384 }).resize(n, n, { fit: 'contain', background: clear }).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(out('public/favicon-32.png'), await icon(32));
  await writeFile(out('public/icon-512.png'), await icon(512));
  await writeFile(await ensure(out('public/brand/kokreaters-logo-512.png')), await icon(512));
  // apple-touch: White square, 12% padding each side.
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
