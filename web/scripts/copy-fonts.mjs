// Copies the self-hosted variable woff2 files (REDESIGN-V3 §1.2: Source Serif 4 + Inter, opsz files) from node_modules
// into public/fonts.
// Runs as predev/prebuild. Idempotent: skips files that are already identical.
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'fonts');

const FILES = [
  ['@fontsource-variable/source-serif-4', 'source-serif-4-latin-opsz-normal.woff2'],
  ['@fontsource-variable/source-serif-4', 'source-serif-4-latin-opsz-italic.woff2'],
  ['@fontsource-variable/inter', 'inter-latin-opsz-normal.woff2'],
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
// Remove any woff2 in public/fonts that is no longer in FILES (v1 Fraunces, v2 Bricolage / Plex Mono / Caveat / Instrument Sans).
for (const name of readdirSync(outDir)) {
  if (name.endsWith('.woff2') && !FILES.some(([, f]) => f === name)) { unlinkSync(join(outDir, name)); console.log(`[copy-fonts] removed stale ${name}`); }
}
console.log(`[copy-fonts] ${copied} copied, ${FILES.length - copied} up to date → public/fonts`);
