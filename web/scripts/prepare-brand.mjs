// prepare-brand.mjs (pack 3, logo Option A, approved 20 Nov 2026): Ganeaysh's refined original logo → the site.
// Idempotent. Reads from BRAND_DIR (default ../research/pack3/kokreaters-logo-A), never modifies the sources.
// Outputs are committed.
//  1. Logo SVGs (text outlined, no fonts needed) → src/assets/brand/svg/ (read by components/brand/Logo.astro and
//     NodeMark.astro, and scripts/make-profile-pdf.mjs).
//  2. Favicons (nodes only, readable at 16 px) → public/ (favicon.ico, favicon.svg, apple-touch-icon.png, icon-192.png,
//     icon-512.png); public/site.webmanifest lists the two PNG icons with theme_color #0E1F4D.
//  3. The square mark (512 px) → public/brand/kokreaters-mark-A-512.png (JSON-LD Organization.logo); the navy 1200 px
//     logo and the 400 px avatar → public/brand/ (documents, About, social avatars).
//  4. The one link-preview image → public/og/kokreaters-social-share-1200x630.png (og:image on every page).
//  5. The K-mark logo set, its favicon PNG and the per-page OG cards are deleted if they reappear (OLD).
import { copyFile, mkdir, rm, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BRAND_DIR = resolve(WEB, process.env.BRAND_DIR ?? '../research/pack3/kokreaters-logo-A');
const src = (p) => resolve(BRAND_DIR, p);
const out = (p) => resolve(WEB, p);
async function ensure(p) { await mkdir(dirname(p), { recursive: true }); return p; }

const LOGOS = [
  'kokreaters-logo-A-navy.svg', 'kokreaters-logo-A-navy-no-tagline.svg',
  'kokreaters-logo-A-white.svg', 'kokreaters-logo-A-white-no-tagline.svg', 'kokreaters-mark-A.svg',
];
const FAVICONS = ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'];
const PNGS = { 'kokreaters-mark-A-512.png': 'public/brand/kokreaters-mark-A-512.png',
  'kokreaters-logo-A-navy-1200.png': 'public/brand/kokreaters-logo-A-navy-1200.png',
  'kokreaters-logo-A-navy-600.png': 'public/brand/kokreaters-logo-A-navy-600.png',
  'kokreaters-avatar-A-400.png': 'public/brand/kokreaters-avatar-A-400.png',
  'kokreaters-social-share-1200x630.png': 'public/og/kokreaters-social-share-1200x630.png' };
export const OG_IMAGE = '/og/kokreaters-social-share-1200x630.png';
const OLD = [
  'src/assets/brand/svg/kokreaters-logo-navy-no-tagline.svg', 'src/assets/brand/svg/kokreaters-logo-navy.svg',
  'src/assets/brand/svg/kokreaters-logo-white.svg', 'src/assets/brand/svg/kokreaters-mark.svg',
  'public/brand/kokreaters-mark-512.png', 'public/favicon-32.png',
];
const MANIFEST = {
  name: 'KoKreaters', short_name: 'KoKreaters', lang: 'en-GB', start_url: '/', scope: '/', display: 'browser',
  background_color: '#FFFFFF', theme_color: '#0E1F4D',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
};

async function main() {
  for (const f of LOGOS) await copyFile(src(`svg/${f}`), await ensure(out(`src/assets/brand/svg/${f}`)));
  for (const f of FAVICONS) await copyFile(src(`favicon/${f}`), await ensure(out(`public/${f}`)));
  for (const [f, to] of Object.entries(PNGS)) await copyFile(src(`png/${f}`), await ensure(out(to)));
  await writeFile(out('public/site.webmanifest'), `${JSON.stringify(MANIFEST, null, 2)}\n`);
  for (const f of OLD) if (existsSync(out(f))) await rm(out(f));
  // one link-preview image for every page: drop any other card in public/og
  for (const f of await readdir(out('public/og'))) if (`/og/${f}` !== OG_IMAGE) await rm(out(`public/og/${f}`));
  console.log('prepare-brand: done');
}

main().catch((e) => { console.error(e); process.exit(1); });
