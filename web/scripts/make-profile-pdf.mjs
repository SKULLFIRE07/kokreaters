#!/usr/bin/env node
/**
 * One-page founder profile PDF (REDESIGN-V3 §4 About: "Download one-page profile (PDF)").
 *
 *   node scripts/make-profile-pdf.mjs [--png <file>]
 *
 * Reads the founder data straight from src/data (founder.ts, impact.ts, pillars.ts) and src/config/site.ts, renders
 * a print-styled A4 page (navy band with the portrait, career timeline with the ringed node, expertise, education,
 * languages, recognition, contact) and prints it with Playwright's page.pdf() to
 *   public/downloads/ganeaysh-kulkarni-profile.pdf
 * `--png <file>` also writes a screenshot of the page for a visual check. Re-run whenever the founder data changes;
 * the file is a static asset (Playwright is not needed at build time or on the host).
 * Every word comes from the data modules; nothing is typed here except CSS.
 */
import { readFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { registerHooks } from 'node:module';
import sharp from 'sharp';
import { chromium } from 'playwright';

const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(WEB, 'public/downloads/ganeaysh-kulkarni-profile.pdf');
const args = process.argv.slice(2);
const pngAt = args.indexOf('--png') >= 0 ? resolve(args[args.indexOf('--png') + 1]) : null;

/* Let Node load the TypeScript data modules: resolve the "@/…" alias and extension-less specifiers to .ts, and give
   `import.meta.env` (Vite-only) an empty object so site.ts falls back to its defaults. Node strips the types. */
const SRC = pathToFileURL(resolve(WEB, 'src')).href + '/';
const withExt = (href) => {
  const p = fileURLToPath(href);
  for (const c of [p, `${p}.ts`, `${p}/index.ts`]) if (/\.(ts|json|m?js)$/.test(c) && existsSync(c)) return pathToFileURL(c).href;
  return href;
};
registerHooks({
  resolve(spec, ctx, next) {
    if (spec.startsWith('@/')) return next(withExt(new URL(spec.slice(2), SRC).href), ctx);
    if (/^\.\.?\//.test(spec) && ctx.parentURL?.endsWith('.ts') && !/\.(ts|json|m?js)$/.test(spec)) {
      return next(withExt(new URL(spec, ctx.parentURL).href), ctx);
    }
    return next(spec, ctx);
  },
  load(url, ctx, next) {
    const r = next(url, ctx);
    return url.endsWith('.ts') && r.source ? { ...r, source: String(r.source).replace(/import\.meta\.env/g, '({})') } : r;
  },
});

const load = (p) => import(pathToFileURL(resolve(WEB, p)).href);
const founder = await load('src/data/founder.ts');
const { founderResults } = await load('src/data/impact.ts');
const { pillars } = await load('src/data/pillars.ts');
const { site } = await load('src/config/site.ts');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const b64 = async (p) => (await readFile(resolve(WEB, p))).toString('base64');

const [serif, serifItalic, sans, logoSvg, portrait] = await Promise.all([
  b64('public/fonts/bodoni-moda-latin-opsz-normal.woff2'),
  b64('public/fonts/bodoni-moda-latin-opsz-italic.woff2'),
  b64('public/fonts/manrope-latin-wght-normal.woff2'),
  readFile(resolve(WEB, 'src/assets/brand/svg/kokreaters-logo-horizontal-white.svg'), 'utf8'),
  sharp(resolve(WEB, 'src/assets/photos/ganeaysh-portrait.jpg')).resize({ width: 720 }).jpeg({ quality: 84, mozjpeg: true }).toBuffer(),
]);

const {
  founderName, founderRole, about, shortBio, timeline, timelineRoles, education, languages, workedWith,
  educationLabel, languagesLabel, aboutPage, portraitAlt,
} = founder;
const L = aboutPage.pdf;
const host = site.url.replace(/^https?:\/\//, '');
/** "Degree in Chemistry, University of Pune" → ["Degree in Chemistry", "University of Pune"] */
const splitLast = (s, sep = ', ') => { const i = s.lastIndexOf(sep); return i < 0 ? [s, ''] : [s.slice(0, i), s.slice(i + sep.length)]; };
/** "Bahasa Indonesia (conversational)" → ["Bahasa Indonesia", "conversational"] */
const splitParen = (s) => { const m = s.match(/^(.*?)\s*\((.+)\)$/); return m ? [m[1], m[2]] : [s, '']; };

const html = `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><title>${esc(L.title)}</title>
<style>
  @font-face { font-family: "Bodoni Moda"; src: url(data:font/woff2;base64,${serif}) format("woff2"); font-weight: 200 900; font-style: normal; }
  @font-face { font-family: "Bodoni Moda"; src: url(data:font/woff2;base64,${serifItalic}) format("woff2"); font-weight: 200 900; font-style: italic; }
  @font-face { font-family: "Manrope"; src: url(data:font/woff2;base64,${sans}) format("woff2"); font-weight: 100 900; font-style: normal; }
  @page { size: A4; margin: 0; }
  :root {
    --navy-900: #0B1B33; --navy-800: #13284A; --blue-700: #2C509E; --blue-500: #306FE0; --blue-300: #8DB2F7;
    --grey-50: #F2F2F0; --grey-200: #D9D9D4; --ink: #1A1A1A; --ink-2: #5A5A5A; --on-navy-2: rgba(255,255,255,.74);
    --serif: "Bodoni Moda", Georgia, serif; --sans: "Manrope", Arial, sans-serif; --gx: 15mm; --side: 64mm;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 210mm; height: 297mm; }
  body { font-family: var(--sans); font-size: 8.6pt; line-height: 1.5; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact;
    font-optical-sizing: auto; font-variant-numeric: lining-nums; text-rendering: geometricPrecision; }
  .tnum { font-variant-numeric: lining-nums tabular-nums; }
  .page { width: 210mm; height: 297mm; display: flex; flex-direction: column; overflow: hidden; }

  /* navy band: text left, portrait right, full band height */
  .band { flex: none; position: relative; background: var(--navy-900); color: #fff; height: 68mm; display: grid; grid-template-columns: 1fr var(--side); }
  .band__text { padding: 11mm var(--gx) 10mm; display: flex; flex-direction: column; }
  .band__logo { width: 40mm; height: auto; display: block; }
  .band__logo svg { width: 100%; height: auto; display: block; }
  .band__label { margin-top: auto; padding-top: 6mm; font-size: 7pt; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--blue-300); }
  .band__name { margin-top: 2.5mm; font-family: var(--serif); font-weight: 420; font-size: 27pt; line-height: 1.04; letter-spacing: -.018em; }
  .band__lead { margin-top: 3mm; font-family: var(--serif); font-style: italic; font-weight: 400; font-size: 11.5pt; line-height: 1.35; color: var(--on-navy-2); max-width: 100mm; }
  .band__photo { position: relative; overflow: hidden; }
  .band__photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 4%; }

  .body { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr var(--side); }
  .main { padding: 9mm 9mm 8mm var(--gx); }
  .side { padding: 9mm var(--gx) 8mm 8mm; background: var(--grey-50); }

  h2 { font-size: 6.8pt; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--blue-700); margin-bottom: 2.6mm; }
  h2 + * { margin-top: 0; }
  section + section { margin-top: 6.5mm; }
  .bio { font-size: 9.6pt; line-height: 1.55; color: var(--ink); }
  .bio + .bio { margin-top: 2mm; }

  /* career timeline: the ringed node on a hairline spine */
  .tl { list-style: none; position: relative; }
  .tl li { position: relative; padding-left: 7mm; padding-bottom: 3.4mm; }
  .tl li:last-child { padding-bottom: 0; }
  .tl li::before { content: ""; position: absolute; left: 0; top: 1.1mm; width: 2.6mm; height: 2.6mm; border-radius: 50%;
    background: var(--blue-700); border: .55mm solid #fff; box-shadow: 0 0 0 .55mm var(--blue-700); box-sizing: border-box; }
  .tl li:last-child::before { background: var(--blue-500); box-shadow: 0 0 0 .55mm var(--blue-500); }
  .tl li:not(:last-child)::after { content: ""; position: absolute; left: 1.3mm; top: 3.7mm; bottom: -1.1mm; width: .25mm; background: var(--blue-700); opacity: .55; }
  .tl__row { display: flex; align-items: baseline; gap: 3mm; }
  .tl__org { font-family: var(--serif); font-weight: 560; font-size: 11pt; line-height: 1.25; color: var(--navy-900); }
  .tl__years { font-size: 7.6pt; color: var(--blue-700); font-weight: 600; }
  .tl__role { font-size: 8.4pt; color: var(--ink-2); line-height: 1.4; margin-top: .4mm; }

  .results { list-style: none; border-top: .25mm solid var(--grey-200); }
  .results li { display: grid; grid-template-columns: 27mm 1fr; gap: 3mm; padding: 2mm 0; border-bottom: .25mm solid var(--grey-200); align-items: baseline; }
  .results__where { font-size: 7.4pt; font-weight: 600; color: var(--blue-700); }
  .results__what { font-size: 8.6pt; line-height: 1.4; }
  .note { margin-top: 1.8mm; font-size: 7.2pt; color: var(--ink-2); }

  .list { list-style: none; }
  .list li { padding: 1.15mm 0; border-top: .25mm solid var(--grey-200); font-size: 8.4pt; line-height: 1.35; }
  .list li:last-child { border-bottom: .25mm solid var(--grey-200); }
  .list small { display: block; font-size: 7.4pt; color: var(--ink-2); }

  .foot { flex: none; background: var(--navy-900); color: #fff; display: grid; grid-template-columns: 1fr var(--side); font-size: 8.2pt; line-height: 1.4; }
  .foot__main { padding: 5.5mm 9mm 6mm var(--gx); }
  .foot__side { padding: 5.5mm var(--gx) 6mm 8mm; display: flex; align-items: flex-end; }
  .foot__label { display: block; margin-bottom: 1.6mm; font-size: 6.8pt; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--blue-300); }
  .foot__items { display: flex; flex-wrap: wrap; gap: 1mm 5.5mm; align-items: baseline; }
  .foot a { color: #fff; text-decoration: none; }
  .foot__base { color: var(--on-navy-2); }
</style></head>
<body><div class="page">
  <header class="band">
    <div class="band__text">
      <div class="band__logo" role="img" aria-label="KoKreaters">${logoSvg.replace(/<\?xml[^>]*>/, '')}</div>
      <p class="band__label">${esc(founderRole)}, ${esc(site.name)}</p>
      <h1 class="band__name">${esc(founderName)}</h1>
      <p class="band__lead">${esc(about.headline)}</p>
    </div>
    <div class="band__photo"><img src="data:image/jpeg;base64,${portrait.toString('base64')}" alt="${esc(portraitAlt.founder)}"></div>
  </header>
  <div class="body">
    <main class="main">
      <section>
        <h2>${esc(L.profile)}</h2>
        <p class="bio">${esc(shortBio)}</p>
        <p class="bio">${esc(workedWith)}</p>
      </section>
      <section>
        <h2>${esc(L.career)}</h2>
        <ol class="tl">
          ${timeline.map((t) => `<li><div class="tl__row"><span class="tl__org">${esc(t.label)}</span><span class="tl__years tnum">${esc(t.years)}</span></div>${timelineRoles[t.label] ? `<p class="tl__role">${esc(timelineRoles[t.label])}</p>` : ''}</li>`).join('')}
        </ol>
      </section>
      <section>
        <h2>${esc(L.results)}</h2>
        <ul class="results">
          ${founderResults.map((r) => `<li><span class="results__where">${esc(r.dateline)}</span><span class="results__what">${esc(r.homeLine)}</span></li>`).join('')}
        </ul>
        <p class="note">${esc(L.resultsNote)}</p>
      </section>
    </main>
    <aside class="side">
      <section>
        <h2>${esc(L.expertise)}</h2>
        <ul class="list">${pillars.map((p) => `<li>${esc(p.name)}</li>`).join('')}</ul>
      </section>
      <section>
        <h2>${esc(educationLabel)}</h2>
        <ul class="list">${education.map((e) => { const [a, b] = splitLast(e); return `<li>${esc(a)}${b ? `<small>${esc(b)}</small>` : ''}</li>`; }).join('')}</ul>
      </section>
      <section>
        <h2>${esc(languagesLabel)}</h2>
        <ul class="list">${languages.map((l) => { const [a, b] = splitParen(l); return `<li>${esc(a)}${b ? `<small>${esc(b[0].toUpperCase() + b.slice(1))}</small>` : ''}</li>`; }).join('')}</ul>
      </section>

    </aside>
  </div>
  <footer class="foot">
    <div class="foot__main">
      <span class="foot__label">${esc(L.contact)}</span>
      <div class="foot__items">
        <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>
        <a href="${esc(site.linkedin.href)}">${esc(site.linkedin.display)}</a>
        <a href="${esc(site.url)}">${esc(host)}</a>
      </div>
    </div>
    <div class="foot__side"><span class="foot__base">${esc(site.base)}</span></div>
  </footer>
</div></body></html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.evaluate(() => {
    const p = document.querySelector('.page');
    return [...p.querySelectorAll('.main, .side')].map((el) => el.scrollHeight - el.clientHeight).filter((d) => d > 1);
  });
  if (overflow.length) console.warn(`make-profile-pdf: content overflows the page by ${overflow.join(', ')}px; tighten the layout`);
  await mkdir(dirname(OUT), { recursive: true });
  await page.pdf({ path: OUT, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true, outline: false });
  if (pngAt) {
    await mkdir(dirname(pngAt), { recursive: true });
    await page.emulateMedia({ media: 'print' });
    await page.screenshot({ path: pngAt, fullPage: false });
  }
  const { size } = await stat(OUT);
  console.log(`make-profile-pdf: ${OUT.replace(WEB + '/', '')} ${(size / 1024).toFixed(0)} KB${pngAt ? ` · preview ${pngAt}` : ''}`);
} finally {
  await browser.close();
}
if (!existsSync(OUT)) process.exit(1);
