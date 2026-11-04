// Copies the three self-hosted woff2 files from node_modules into public/fonts.
// Runs as predev/prebuild. Idempotent: skips files that are already identical.
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'fonts');

const FILES = [
  ['@fontsource-variable/fraunces', 'fraunces-latin-opsz-normal.woff2'],
  ['@fontsource-variable/fraunces', 'fraunces-latin-opsz-italic.woff2'],
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
console.log(`[copy-fonts] ${copied} copied, ${FILES.length - copied} up to date → public/fonts`);
