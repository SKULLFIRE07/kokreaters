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
 * Recipe (deterministic: same input → same bytes), v3.2 polish:
 *   1. Backdrop: a studio grey-blue, deeper and cooler at the edges (#8E9AAB → #7D899B at the foot), lifting to a soft
 *      pale centre behind the head (#E4E9EF), then a gentle navy vignette, so the subject sits in light, not on a flat fill.
 *   2. Crop: tighter head and shoulders (the cut-out at 1.12× cover, head top ≈ 6 % from the frame top).
 *   3. Seat the subject: a soft, low-opacity shadow cast down-right from the cut-out's own alpha, a ≈ 1 px alpha choke
 *      (no halo of the old wall), then a 1.4 px feather so the edge melts into the backdrop; semi-transparent edge
 *      pixels are pulled toward the backdrop tone so light fringes never read as a pasted outline.
 *   4. Grade: saturation ×0.94, a gentle cool cast, contrast ×1.07 (richer skin and navy blazer), then a very fine
 *      seeded monochrome grain (σ ≈ 1.2 levels) so the gradient never bands in JPEG.
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
      <stop offset="0" stop-color="#97A3B3"/>
      <stop offset="0.6" stop-color="#8A96A8"/>
      <stop offset="1" stop-color="#7A8698"/>
    </linearGradient>
    <radialGradient id="key" cx="0.5" cy="0.27" r="0.62" fx="0.47" fy="0.24">
      <stop offset="0" stop-color="#E6EBF1" stop-opacity="1"/>
      <stop offset="0.35" stop-color="#D2D9E2" stop-opacity="0.8"/>
      <stop offset="0.7" stop-color="#B3BDCA" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#A9B4C2" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.4" r="0.8">
      <stop offset="0.5" stop-color="#0B1B33" stop-opacity="0"/>
      <stop offset="1" stop-color="#0B1B33" stop-opacity="0.32"/>
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

  // Fit the cut-out 12 % past cover (tighter head and shoulders), centred, anchored so the head top sits ≈ 6 % down.
  const scale = Math.max(W / meta.width, H / meta.height) * 1.12;
  const sw = Math.round(meta.width * scale), sh = Math.round(meta.height * scale);
  const HEAD_TOP = 150;                                   // first opaque row of the cut-out (hair)
  const HAIR_BOTTOM = 470;                                // below this row the edge is skin, ears and jacket
  const left = Math.round((W - sw) / 2) - 10, top = Math.round(H * 0.06 - HEAD_TOP * scale);

  // Subject at output scale. PNG round-trips keep RGB un-premultiplied; channels are read from `info`, never assumed.
  const resized = await sharp(IN).resize(sw, sh, { kernel: 'lanczos3' }).ensureAlpha().png().toBuffer();
  const rgb = await sharp(resized).removeAlpha().png().toBuffer();
  const { data: a0, info } = await sharp(resized).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  // Clean the hair outline: the cut-out keeps a few light wedges of the old wall along the top of the hair. Near the
  // edge (within ≈ 30 px of transparency) and above the hairline, anything much lighter than hair is wall: drop it.
  {
    const { data: px0, info: p0 } = await sharp(resized).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const { data: far, info: fa } = await sharp(a0, { raw: { width: info.width, height: info.height, channels: 1 } })
      .blur(14).raw().toBuffer({ resolveWithObject: true });
    const yMax = Math.round(HAIR_BOTTOM * scale);
    for (let y = 0; y < Math.min(yMax, info.height); y++) for (let x = 0; x < info.width; x++) {
      const j = y * info.width + x;
      if (!a0[j] || far[j * fa.channels] > 248) continue;
      const i = j * p0.channels;
      const luma = 0.299 * px0[i] + 0.587 * px0[i + 1] + 0.114 * px0[i + 2];
      const keep = Math.min(1, Math.max(0, (100 - luma) / 30));
      a0[j] = Math.round(a0[j] * keep);
    }
  }
  const { data: blurred, info: bi } = await sharp(a0, { raw: { width: info.width, height: info.height, channels: 1 } })
    .blur(1.0).raw().toBuffer({ resolveWithObject: true });
  // Choke the edge by ~1 px (blur the alpha, lift its floor, keep the smaller of old and new) to kill halos.
  const n = info.width * info.height;
  const alpha = Buffer.alloc(n), shadowA = Buffer.alloc(n);
  for (let j = 0; j < n; j++) {
    const b = blurred[j * bi.channels] / 255;
    const choked = Math.min(1, Math.max(0, (b - 0.22) / 0.78)) * 255;
    alpha[j] = Math.round(Math.min(a0[j], choked));
    shadowA[j] = alpha[j];
  }
  const raw1 = { raw: { width: info.width, height: info.height, channels: 1 } };
  // Feather: a 1.4 px blur of the choked alpha, never above the choked value inside the subject.
  const { data: fe, info: fi } = await sharp(alpha, raw1).blur(1.4).raw().toBuffer({ resolveWithObject: true });
  for (let j = 0; j < n; j++) alpha[j] = Math.min(alpha[j], fe[j * fi.channels]);
  // Decontaminate the fringe: where alpha < 1, pull the RGB toward a mid backdrop tone so old-wall white never glows.
  const { data: rgbRaw, info: ri } = await sharp(rgb).raw().toBuffer({ resolveWithObject: true });
  const BG = [176, 186, 199];
  for (let j = 0; j < n; j++) {
    const a = alpha[j] / 255;
    if (a >= 0.98) continue;
    const k = Math.pow(1 - a, 0.7) * 0.85;
    for (let c = 0; c < 3; c++) {
      const i = j * ri.channels + c;
      rgbRaw[i] = Math.round(Math.min(rgbRaw[i], rgbRaw[i] * (1 - k) + BG[c] * k));
    }
  }
  const rgbClean = await sharp(rgbRaw, { raw: { width: ri.width, height: ri.height, channels: ri.channels } }).png().toBuffer();
  const subject = await sharp(rgbClean).joinChannel(await sharp(alpha, raw1).png().toBuffer()).png().toBuffer();

  // Contact shadow: the alpha, offset down-right, very blurred, warm grey, 14 % opacity.
  const { data: sb, info: si } = await sharp(shadowA, raw1).blur(42).raw().toBuffer({ resolveWithObject: true });
  const shadowRgba = Buffer.alloc(n * 4);
  for (let j = 0; j < n; j++) {
    shadowRgba[j * 4] = 20; shadowRgba[j * 4 + 1] = 30; shadowRgba[j * 4 + 2] = 48;
    shadowRgba[j * 4 + 3] = Math.round(sb[j * si.channels] * 0.22);
  }
  const shadow = await sharp(shadowRgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();

  const composed = await sharp(Buffer.from(backdropSvg(W, H)))
    .composite([
      { input: await onFrame(shadow, info.width, info.height, left + 34, top + 26) },
      { input: await onFrame(subject, info.width, info.height, left, top) },
    ])
    .flatten({ background: '#8E9AAB' })
    .png()
    .toBuffer();

  // Grade: lighter version of scripts/grade-photos.mjs (saturation, cool cast, contrast), then grain.
  const contrast = 1.07, offset = 128 - 128 * contrast;
  const { data: px, info: gi } = await sharp(composed)
    .modulate({ saturation: 0.94 })
    .linear([0.99 * contrast, 0.998 * contrast, 1.012 * contrast], [offset, offset, offset])
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  // Monochrome grain, σ ≈ 2 levels, from a seeded PRNG (Box–Muller) so the output is reproducible.
  let seed = 0x6b6b7233;
  const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) + 0.5) / 4294967296;
  for (let i = 0; i < px.length; i += gi.channels) {
    const g = Math.sqrt(-2 * Math.log(rnd())) * Math.cos(2 * Math.PI * rnd()) * 1.2;
    for (let c = 0; c < 3; c++) px[i + c] = Math.max(0, Math.min(255, Math.round(px[i + c] + g)));
  }
  const graded = await sharp(px, { raw: { width: gi.width, height: gi.height, channels: gi.channels } }).png().toBuffer();

  await sharp(graded).jpeg({ quality: QUALITY, mozjpeg: true, chromaSubsampling: '4:4:4' }).withMetadata({ density: 72 }).toFile(OUT_45);

  // Square: head and shoulders. The face centre sits at ≈ 46 % across; the crop starts just above the hair.
  const side = 1440;
  const sx = Math.max(0, Math.min(W - side, Math.round(W * 0.46 - side / 2)));
  const sy = 30;
  await sharp(graded).extract({ left: sx, top: sy, width: side, height: side }).resize(1200, 1200, { kernel: 'lanczos3' })
    .jpeg({ quality: QUALITY, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(OUT_SQ);

  for (const f of [OUT_45, OUT_SQ]) {
    const m = await sharp(f).metadata();
    console.log(`${path.relative(WEB, f)}  ${m.width}×${m.height}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
