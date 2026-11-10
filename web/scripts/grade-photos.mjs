#!/usr/bin/env node
/**
 * grade-photos.mjs
 *
 * Grades the licensed stock photography into one calm, cool family for the v3 editorial site.
 *
 *   in : ../assets/photos/stock-src/<slug>.(jpg|jpeg|png|webp)   raw Unsplash / Pexels originals, never edited
 *   out: src/assets/photos/stock/<slug>.jpg                      graded, max 2400px long edge, mozjpeg q80
 *
 * Run from web/:   node scripts/grade-photos.mjs              all photos
 *                  node scripts/grade-photos.mjs bakery-02    one or more slugs
 *
 * Idempotent: the pipeline is deterministic and a file is only rewritten when its bytes change,
 * so re-running leaves unchanged outputs (and their mtimes) alone. Credits live in src/data/photos.ts.
 *
 * The grade is the same for every photo, so the set reads as one family:
 *   pass 1  auto-orient, optional per-slug fix (crop / hue), fit inside 2400 x 2400 (never enlarge), sRGB,
 *           saturation x0.78, gentle cool cast (R x0.97, G x0.99, B x1.025), contrast x1.05 around mid-grey
 *   pass 2  a 25% wash of the photo's own luminance tinted logo blue (#2C509E): pulls stray hues
 *           (purple skies, orange skin casts) toward one cool family without turning food grey,
 *           then a 50% "screen" of navy (#0B1B33) so the deepest shadows sit on navy, not black
 * Warm subjects (oil, chocolate, crust) stay recognisably warm, just quieter.
 */
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(here, '..');
const SRC_DIR = path.resolve(WEB, '../assets/photos/stock-src');
const OUT_DIR = path.resolve(WEB, 'src/assets/photos/stock');

const MAX_EDGE = 2400;
const QUALITY = 80;

export const GRADE = {
  saturation: 0.78,
  tint: [0.97, 0.99, 1.025],               // R, G, B multipliers: a gentle cool cast
  contrast: 1.05,                           // around mid-grey (128)
  wash: { r: 44, g: 80, b: 158, alpha: 0.25 },   // logo blue #2C509E, applied to the photo's own luminance
  shadow: { r: 11, g: 27, b: 51, alpha: 0.5 },   // navy #0B1B33, screen blend: lifts blacks onto navy
};

/**
 * Per-slug fixes, kept short and explained. crop = fractions of the source edge to trim;
 * hue = degrees of hue rotation applied before the shared grade (only to pull an off-family sky into line);
 * saturation = extra multiplier on GRADE.saturation (only for a warm cast that a hue turn would push toward magenta).
 */
const FIXES = {
  'bakery-02': { crop: { top: 0.14 } },     // removes a partial uniform emblem on a worker's back at the top edge
  'audit-01': { crop: { top: 0.22 } },      // removes a cut-off face fragment; keeps gloved hands + clipboard
  'refinery-01': { hue: -14 },              // violet dusk sky -> blue dusk sky, closer to the navy/logo-blue family
  'cold-01': { saturation: 0.25 },         // pink/mauve sunrise on sky + snow -> cool snow light (a hue turn reads magenta)
};

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff']);

async function gradeOne(file) {
  const slug = path.basename(file, path.extname(file)).toLowerCase();
  const input = path.join(SRC_DIR, file);
  const out = path.join(OUT_DIR, `${slug}.jpg`);

  // ---- pass 1: geometry + global colour, to an uncompressed buffer (no generation loss) ----
  let img = sharp(input, { failOn: 'error' }).rotate();
  const fix = FIXES[slug] ?? {};
  const crop = fix.crop;
  if (crop) {
    const meta = await sharp(input).metadata();
    const swap = (meta.orientation ?? 1) >= 5;      // EXIF 5-8 swap width/height after rotate()
    const W = swap ? meta.height : meta.width;
    const H = swap ? meta.width : meta.height;
    const left = Math.floor(W * (crop.left ?? 0));
    const top = Math.floor(H * (crop.top ?? 0));
    const width = Math.floor(W * (1 - (crop.left ?? 0) - (crop.right ?? 0)));
    const height = Math.floor(H * (1 - (crop.top ?? 0) - (crop.bottom ?? 0)));
    img = img.extract({ left, top, width, height });  // chained after rotate(), so the crop is in display orientation
  }
  const { contrast, tint, saturation } = GRADE;
  const offset = 128 - 128 * contrast;
  const { data, info } = await img
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .toColourspace('srgb')
    .modulate({ saturation: saturation * (fix.saturation ?? 1), hue: fix.hue ?? 0 })
    .linear(tint.map((t) => t * contrast), [offset, offset, offset])
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const raw = { raw: { width: info.width, height: info.height, channels: info.channels } };

  // ---- pass 2: blue luminance wash + navy shadow lift, then encode ----
  const { wash, shadow } = GRADE;
  const washLayer = await sharp(data, raw)
    .greyscale()
    .toColourspace('srgb')
    .tint({ r: wash.r, g: wash.g, b: wash.b })
    .ensureAlpha(wash.alpha)
    .png({ compressionLevel: 0 })
    .toBuffer();
  const jpg = await sharp(data, raw)
    .composite([
      { input: washLayer, blend: 'over' },
      {
        input: { create: { width: 1, height: 1, channels: 4, background: { r: shadow.r, g: shadow.g, b: shadow.b, alpha: shadow.alpha } } },
        tile: true,
        blend: 'screen',
      },
    ])
    .jpeg({ quality: QUALITY, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .toBuffer();

  let status = 'written';
  try {
    if (Buffer.compare(await readFile(out), jpg) === 0) status = 'unchanged';
  } catch { /* no previous output */ }
  if (status === 'written') await writeFile(out, jpg);

  const { width, height } = info;
  const orientation = width > height * 1.08 ? 'landscape' : height > width * 1.08 ? 'portrait' : 'square';
  return { slug, width, height, kb: Math.round(jpg.length / 1024), orientation, status, fix: Object.keys(fix).join('+') || '-' };
}

async function main() {
  const only = new Set(process.argv.slice(2).map((s) => s.toLowerCase()));
  await mkdir(OUT_DIR, { recursive: true });
  const files = (await readdir(SRC_DIR))
    .filter((f) => !f.startsWith('.') && !f.startsWith('_') && IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .filter((f) => only.size === 0 || only.has(path.basename(f, path.extname(f)).toLowerCase()))
    .sort();
  if (files.length === 0) {
    console.error(`No source images found in ${SRC_DIR}${only.size ? ` for ${[...only].join(', ')}` : ''}`);
    process.exit(1);
  }
  const rows = [];
  for (const f of files) {
    if ((await stat(path.join(SRC_DIR, f))).size === 0) { console.warn(`skip ${f}: empty file`); continue; }
    rows.push(await gradeOne(f));
  }
  console.table(rows);
  const total = rows.reduce((n, r) => n + r.kb, 0);
  console.log(`${rows.length} photo(s) -> ${path.relative(WEB, OUT_DIR)}  (${total} KB total)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
