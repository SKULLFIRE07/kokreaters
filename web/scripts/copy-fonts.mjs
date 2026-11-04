// Copies the self-hosted woff2 files (DESIGN-SPEC v2 2.1) from node_modules into public/fonts.
// Runs as predev/prebuild. Idempotent: skips files that are already identical.
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'fonts');

const FILES = [
  ['@fontsource-variable/bricolage-grotesque', 'bricolage-grotesque-latin-wdth-normal.woff2'],
  ['@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2'],
  ['@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff2'],
  ['@fontsource/caveat', 'caveat-latin-600-normal.woff2'],
  ['@fontsource-variable/instrument-sans', 'instrument-sans-latin-wght-normal.woff2'],
];

mkdirSync(outDir, { recursive: true });
let copied = 0;
let missing = 0;
for (const [pkg, file] of FILES) {
  const src = join(root, 'node_modules', pkg, 'files', file);
  const dest = join(outDir, file);
  if (!existsSync(src)) {
    console.error(`[copy-fonts] missing ${pkg}/files/${file}. Run npm install.`);
    missing++;
    continue;
  }
  if (existsSync(dest) && statSync(dest).size === statSync(src).size) continue;
  copyFileSync(src, dest);
  copied++;
}
if (missing) process.exit(1);
// Remove any woff2 in public/fonts that is no longer in FILES (v1 Fraunces files).
for (const name of readdirSync(outDir)) {
  if (name.endsWith('.woff2') && !FILES.some(([, f]) => f === name)) { unlinkSync(join(outDir, name)); console.log(`[copy-fonts] removed stale ${name}`); }
}
console.log(`[copy-fonts] ${copied} copied, ${FILES.length - copied} up to date → public/fonts`);
