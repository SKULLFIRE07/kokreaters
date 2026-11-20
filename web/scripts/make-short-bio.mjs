#!/usr/bin/env node
/**
 * Pack 3 (brief, About): the downloadable short bio and the high-resolution portrait for event organisers.
 *
 *   node scripts/make-short-bio.mjs
 *
 * 1. Prints scripts/short-bio/short-bio.html (print-styled A4, confirmed facts only; edit that file to change the
 *    words) to public/downloads/ganeaysh-kulkarni-short-bio.pdf with headless Chrome (--print-to-pdf, no header or
 *    footer). Needs public/fonts (node scripts/copy-fonts.mjs).
 * 2. Writes public/downloads/ganeaysh-kulkarni-portrait.jpg (full resolution, JPEG q90, sRGB) from the portrait
 *    original ../assets/photos/ganeaysh-portrait-1665x2048.png (falls back to src/assets/photos/ganeaysh-portrait.jpg).
 * Both are static assets: nothing runs at build time. src/pages/about.astro links each one only if the file exists.
 * Replace the portrait source after the professional shoot (earlier item 42) and re-run.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(WEB, 'public/downloads');
const HTML = resolve(WEB, 'scripts/short-bio/short-bio.html');
const PDF = resolve(OUT, 'ganeaysh-kulkarni-short-bio.pdf');
const JPG = resolve(OUT, 'ganeaysh-kulkarni-portrait.jpg');
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';

mkdirSync(OUT, { recursive: true });
if (!existsSync(resolve(WEB, 'public/fonts/manrope-latin-wght-normal.woff2'))) {
  console.error('make-short-bio: public/fonts missing; run node scripts/copy-fonts.mjs first');
  process.exit(1);
}

execFileSync(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer', '--allow-file-access-from-files',
  '--run-all-compositor-stages-before-draw', '--virtual-time-budget=5000',
  `--print-to-pdf=${PDF}`, pathToFileURL(HTML).href,
], { stdio: ['ignore', 'ignore', 'pipe'] });
console.log(`make-short-bio: ${PDF.replace(`${WEB}/`, '')} ${(statSync(PDF).size / 1024).toFixed(0)} KB`);

const original = resolve(WEB, '../assets/photos/ganeaysh-portrait-1665x2048.png');
const src = existsSync(original) ? original : resolve(WEB, 'src/assets/photos/ganeaysh-portrait.jpg');
const info = await sharp(src).toColourspace('srgb').jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(JPG);
console.log(`make-short-bio: ${JPG.replace(`${WEB}/`, '')} ${info.width}×${info.height} ${(info.size / 1024).toFixed(0)} KB`);
