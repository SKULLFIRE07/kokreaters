#!/usr/bin/env node
/**
 * make-portrait.mjs (REDESIGN-V3 §8.4)
 *
 * Builds the founder portrait from the retouched cut-out (lapel pin already removed) on a calm studio backdrop.
 *
 *   in : src/assets/photos/ganeaysh-cutout.png             1665 × 2048 RGBA cut-out
 *   out: src/assets/photos/ganeaysh-portrait.jpg           4:5, 1600 × 2000, mozjpeg q82 (About hero, Home founder band)
 *        src/assets/photos/ganeaysh-portrait-square.jpg    1:1 head and shoulders, 1200 × 1200 (bylines, author box, JSON-LD)
 *
 * Run from web/:  node scripts/make-portrait.mjs
 *
 * Recipe (deterministic: same input → same bytes):
 *   1. Backdrop: warm-grey studio paper, #ECECE9 at the top → #DCDCD7 at the bottom, a soft key-light bloom behind the
 *      head (upper left of centre), then a broad, gentle vignette, so it reads as a lit wall, not a flat fill.
 *   2. Seat the subject: a very soft, low-opacity shadow cast down-right from the cut-out's own alpha (a person
 *      standing ~1 m from a backdrop), and a 0.6 px alpha choke so no halo of the old wall survives on hair edges.
 *   3. Grade the whole frame like the photo set, only lighter: saturation ×0.9, a slight cool cast, contrast ×1.03,
 *      then a fine monochrome grain (seeded) so the backdrop has photographic texture and the JPEG never bands.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(here, '..');
const IN = path.join(WEB, 'src/assets/photos/ganeaysh-cutout.png');
const OUT_45 = path.join(WEB, 'src/assets/photos/ganeaysh-portrait.jpg');
const OUT_SQ = path.join(WEB, 'src/assets/photos/ganeaysh-portrait-square.jpg');

const W = 1600, H = 2000;          // 4:5 output
const QUALITY = 82;

const backdropSvg = (w, h) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ECECE9"/>
      <stop offset="0.55" stop-color="#E5E5E1"/>
      <stop offset="1" stop-color="#DCDCD7"/>
    </linearGradient>
    <radialGradient id="key" cx="0.42" cy="0.24" r="0.62" fx="0.40" fy="0.22">
      <stop offset="0" stop-color="#F3F3F0" stop-opacity="0.85"/>
      <stop offset="0.55" stop-color="#EEEEEB" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#EEEEEB" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.42" r="0.78">
      <stop offset="0.55" stop-color="#2A2A28" stop-opacity="0"/>
      <stop offset="1" stop-color="#2A2A28" stop-opacity="0.2"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#paper)"/>
  <rect width="100%" height="100%" fill="url(#key)"/>
  <rect width="100%" height="100%" fill="url(#vignette)"/>
</svg>`;

/** Place an RGBA layer (w × h) at (x, y) on a transparent W × H frame, cropping whatever falls outside it. */
async function onFrame(png, w, h, x, y) {
  const l = Math.max(0, -x), t = Math.max(0, -y);
  const cw = Math.min(w - l, W - Math.max(0, x)), ch = Math.min(h - t, H - Math.max(0, y));
  const part = await sharp(png).extract({ left: l, top: t, width: cw, height: ch }).png().toBuffer();
  return sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: part, left: Math.max(0, x), top: Math.max(0, y) }]).png().toBuffer();
}

async function main() {
  await mkdir(path.dirname(OUT_45), { recursive: true });
  const meta = await sharp(IN).metadata();

  // Fit the cut-out so the shoulders still reach both frame edges (cover), anchored to the bottom edge.
  const scale = Math.max(W / meta.width, H / meta.height);
  const sw = Math.round(meta.width * scale), sh = Math.round(meta.height * scale);
  const left = Math.round((W - sw) / 2), top = H - sh;

  // Subject at output scale. PNG round-trips keep RGB un-premultiplied; channels are read from `info`, never assumed.
  const resized = await sharp(IN).resize(sw, sh, { kernel: 'lanczos3' }).ensureAlpha().png().toBuffer();
  const rgb = await sharp(resized).removeAlpha().png().toBuffer();
  const { data: a0, info } = await sharp(resized).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const { data: blurred, info: bi } = await sharp(a0, { raw: { width: info.width, height: info.height, channels: 1 } })
    .blur(0.6).raw().toBuffer({ resolveWithObject: true });
  // Choke the edge by ~0.6 px (blur the alpha, lift its floor, keep the smaller of old and new) to kill halos.
  const n = info.width * info.height;
  const alpha = Buffer.alloc(n), shadowA = Buffer.alloc(n);
  for (let j = 0; j < n; j++) {
    const b = blurred[j * bi.channels] / 255;
    const choked = Math.min(1, Math.max(0, (b - 0.12) / 0.88)) * 255;
    alpha[j] = Math.round(Math.min(a0[j], choked));
    shadowA[j] = alpha[j];
  }
  const raw1 = { raw: { width: info.width, height: info.height, channels: 1 } };
  const subject = await sharp(rgb).joinChannel(await sharp(alpha, raw1).png().toBuffer()).png().toBuffer();

  // Contact shadow: the alpha, offset down-right, very blurred, warm grey, 14 % opacity.
  const { data: sb, info: si } = await sharp(shadowA, raw1).blur(42).raw().toBuffer({ resolveWithObject: true });
  const shadowRgba = Buffer.alloc(n * 4);
  for (let j = 0; j < n; j++) {
    shadowRgba[j * 4] = 58; shadowRgba[j * 4 + 1] = 56; shadowRgba[j * 4 + 2] = 52;
    shadowRgba[j * 4 + 3] = Math.round(sb[j * si.channels] * 0.14);
  }
  const shadow = await sharp(shadowRgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();

  const composed = await sharp(Buffer.from(backdropSvg(W, H)))
    .composite([
      { input: await onFrame(shadow, info.width, info.height, left + 34, top + 26) },
      { input: await onFrame(subject, info.width, info.height, left, top) },
    ])
    .flatten({ background: '#E5E5E1' })
    .png()
    .toBuffer();

  // Grade: lighter version of scripts/grade-photos.mjs (saturation, cool cast, contrast), then grain.
  const contrast = 1.03, offset = 128 - 128 * contrast;
  const { data: px, info: gi } = await sharp(composed)
    .modulate({ saturation: 0.9 })
    .linear([0.985 * contrast, 0.995 * contrast, 1.012 * contrast], [offset, offset, offset])
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  // Monochrome grain, σ ≈ 2 levels, from a seeded PRNG (Box–Muller) so the output is reproducible.
  let seed = 0x6b6b7233;
  const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) + 0.5) / 4294967296;
  for (let i = 0; i < px.length; i += gi.channels) {
    const g = Math.sqrt(-2 * Math.log(rnd())) * Math.cos(2 * Math.PI * rnd()) * 2.1;
    for (let c = 0; c < 3; c++) px[i + c] = Math.max(0, Math.min(255, Math.round(px[i + c] + g)));
  }
  const graded = await sharp(px, { raw: { width: gi.width, height: gi.height, channels: gi.channels } }).png().toBuffer();

  await sharp(graded).jpeg({ quality: QUALITY, mozjpeg: true, chromaSubsampling: '4:4:4' }).withMetadata({ density: 72 }).toFile(OUT_45);

  // Square: head and shoulders. The face centre sits at ~46.5 % across; the crop starts a little above the hair.
  const side = 1360;
  const sx = Math.max(0, Math.min(W - side, Math.round(W * 0.468 - side / 2)));
  const sy = 40;
  await sharp(graded).extract({ left: sx, top: sy, width: side, height: side }).resize(1200, 1200, { kernel: 'lanczos3' })
    .jpeg({ quality: QUALITY, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(OUT_SQ);

  for (const f of [OUT_45, OUT_SQ]) {
    const m = await sharp(f).metadata();
    console.log(`${path.relative(WEB, f)}  ${m.width}×${m.height}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
