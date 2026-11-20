#!/usr/bin/env node
/**
 * Open Graph image and SEO checks (REDESIGN-V3 §1, §7; DESIGN-SPEC 3.7; pack 3 lead decision 6).
 *
 *   node scripts/og.mjs            install the one link-preview image (Ganeaysh's kokreaters-social-share-1200x630.png,
 *                                  logo A + headline) via prepare-brand.mjs and verify it is 1200×630.
 *   node scripts/og.mjs check [dist]   validate a built site: titles, descriptions, canonicals, og:image (the one
 *                                  image on every page) and size, JSON-LD, sitemap, robots (keyed on `indexable`) and,
 *                                  for a production build, that no unapproved insight is built, listed or linked.
 *                                  Mode comes from dist/build-info.json (src/pages/build-info.json.ts).
 */
import { registerHooks } from 'node:module';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, mkdtempSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import sharp from 'sharp';

const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(WEB, 'src');
const OUT = join(WEB, 'public', 'og');
const SITE = 'https://kokreaters.com';
const W = 1200, H = 630;
const MODE = ['preview', 'production'].includes(process.env.PUBLIC_SITE_MODE ?? '') ? process.env.PUBLIC_SITE_MODE : 'staging';
const PORT = Number(process.env.OG_PORT ?? 4412);
const CHROME = process.env.CHROME ?? '/usr/bin/google-chrome';

/* ── TS data modules: `@/x` → src/x.ts, `./x` → ./x.ts when the bare path does not exist ── */
registerHooks({
  resolve(spec, ctx, next) {
    const tryTs = (base) => {
      for (const c of [base, `${base}.ts`, join(base, 'index.ts')]) if (existsSync(c) && statSync(c).isFile()) return pathToFileURL(c).href;
      return null;
    };
    if (spec.startsWith('@/')) { const u = tryTs(join(SRC, spec.slice(2))); if (u) return next(u, ctx); }
    if ((spec.startsWith('./') || spec.startsWith('../')) && ctx.parentURL?.startsWith('file:')) {
      const u = tryTs(resolve(dirname(fileURLToPath(ctx.parentURL)), spec));
      if (u) return next(u, ctx);
    }
    return next(spec, ctx);
  },
});

/* ── Insight frontmatter (plain YAML subset: key: "value" / key: value) ── */
function insightEntries() {
  const dir = join(SRC, 'content', 'insights');
  return readdirSync(dir).filter((f) => /\.mdx?$/.test(f)).map((f) => {
    const raw = readFileSync(join(dir, f), 'utf8');
    const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    const data = {};
    for (const line of fm.split('\n')) {
      const m = line.match(/^([A-Za-z_]+):\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if (/^".*"$/.test(v)) v = JSON.parse(v); else if (/^'.*'$/.test(v)) v = v.slice(1, -1);
      data[m[1]] = v;
    }
    return { id: f.replace(/\.mdx?$/, ''), ...data };
  });
}
/** Routed in staging and preview (src/lib/mode.ts includeDrafts): everything except coming-soon. */
const routedWithDrafts = (e) => e.status !== 'coming-soon';
/** Routed in production (published and approved). */
const routedInProduction = (e) => e.status === 'published' && e.review === 'approved';
const routedIn = (mode) => (mode === 'production' ? routedInProduction : routedWithDrafts);

/* ── Card list: label + title mirror each page's PageHero eyebrow + H1 ── */
/** Pack 3 (lead decision 6): the one link-preview image is Ganeaysh's file, installed by prepare-brand.mjs. */
const OG_IMAGE = '/og/kokreaters-social-share-1200x630.png';
async function render() {
  await new Promise((ok, fail) => spawn(process.execPath, [join(WEB, 'scripts', 'prepare-brand.mjs')], { stdio: 'inherit' })
    .on('close', (c) => (c === 0 ? ok() : fail(new Error(`prepare-brand exited ${c}`)))));
  const m = await sharp(join(WEB, 'public', OG_IMAGE.slice(1))).metadata();
  if (m.width !== W || m.height !== H) throw new Error(`${OG_IMAGE} is ${m.width}×${m.height}, want ${W}×${H}`);
  console.log(`og: public${OG_IMAGE} (${W}×${H}), the one link-preview image for every page`);
}

/* ── check ── */
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));
const routeOf = (dist, file) => {
  const rel = relative(dist, file).split(sep).join('/').replace(/\.html$/, '');
  if (rel === 'index') return '/';
  return `/${rel.replace(/\/index$/, '')}`;
};
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const decode = (s) => s?.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x27;/g, "'");
const metas = (html, key, val) => [...html.matchAll(/<meta\b[^>]*>/g)].map((m) => m[0]).filter((t) => attr(t, key) === val).map((t) => decode(attr(t, 'content')));

const REQUIRED = {
  Organization: ['@id', 'name', 'url', 'logo', 'email'],
  ProfessionalService: ['@id', 'name', 'url', 'description', 'address', 'email'],
  WebSite: ['@id', 'url', 'inLanguage', 'publisher'],
  Person: ['@id', 'name', 'jobTitle', 'worksFor', 'image', 'description'],
  Article: ['headline', 'description', 'datePublished', 'author', 'publisher', 'image', 'mainEntityOfPage', 'inLanguage'],
  BreadcrumbList: ['itemListElement'],
};
const EXPECT = (route) => {
  if (route === '/') return ['Organization', 'ProfessionalService', 'Person', 'WebSite'];
  if (route === '/about') return ['Person', 'BreadcrumbList'];
  if (route.startsWith('/insights/')) return ['Article', 'BreadcrumbList'];
  if (route === '/404') return [];
  return ['BreadcrumbList'];
};

async function check(distArg) {
  const dist = resolve(distArg ?? join(WEB, 'dist'));
  if (!existsSync(join(dist, 'index.html'))) throw new Error(`no build at ${dist}`);
  const errors = [], warnings = [];
  const robotsTxt = readFileSync(join(dist, 'robots.txt'), 'utf8');
  const infoFile = join(dist, 'build-info.json');
  const info = existsSync(infoFile) ? JSON.parse(readFileSync(infoFile, 'utf8')) : { mode: 'unknown', indexable: !/Disallow:\s*\/\s*$/m.test(robotsTxt) };
  const production = info.mode === 'production';
  const indexable = info.indexable === true;
  if (!existsSync(infoFile)) warnings.push('dist/build-info.json missing: mode unknown, robots inferred from robots.txt');
  const titles = new Map(), descs = new Map();
  // the styleguide is a staging-only dev page (a redirect stub to /404 in other modes): not part of the site
  const files = walk(dist).filter((f) => f.endsWith('.html') && relative(dist, f) !== 'styleguide.html').sort();
  const routes = [];
  const ogSeen = new Set();
  for (const file of files) {
    const route = routeOf(dist, file);
    routes.push(route);
    const html = readFileSync(file, 'utf8');
    const e = (m) => errors.push(`${route}: ${m}`);
    const titleTags = [...html.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((m) => decode(m[1]).trim());
    if (titleTags.length !== 1 || !titleTags[0]) e(`expected one non-empty <title>, found ${titleTags.length}`);
    const title = titleTags[0] ?? '';
    // Articles use `{title} | KoKreaters Insights` when ≤ 60, else the bare title (3.8), which may run longer.
    // Home: the client's verbatim title and description (pack 2 item 39) run past the guide limits on purpose.
    const exempt = route === '/';
    if ([...title].length > 60) (route.startsWith('/insights/') ? warnings.push(`${route}: article title is ${[...title].length} chars (3.8 allows the bare title)`)
      : exempt ? warnings.push(`${route}: title is ${[...title].length} chars (client copy, exempt)`) : e(`title over 60 chars (${[...title].length})`));
    const desc = metas(html, 'name', 'description');
    if (desc.length !== 1 || !desc[0]) e('expected one meta description');
    if ([...(desc[0] ?? '')].length > 155) (exempt ? warnings.push(`${route}: description is ${[...desc[0]].length} chars (client copy, exempt)`) : e('description over 155 chars'));
    (titles.get(title) ?? titles.set(title, []).get(title)).push(route);
    (descs.get(desc[0]) ?? descs.set(desc[0], []).get(desc[0])).push(route);

    const canon = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)].map((m) => attr(m[0], 'href'));
    const want = route === '/' ? `${SITE}/` : `${SITE}${route}`;
    if (canon.length !== 1) e(`expected one canonical, found ${canon.length}`);
    else if (canon[0] !== want && route !== '/404') e(`canonical ${canon[0]} ≠ ${want}`);
    const ogUrl = metas(html, 'property', 'og:url')[0];
    if (route !== '/404' && ogUrl !== want) e(`og:url ${ogUrl} ≠ ${want}`);
    for (const p of ['og:title', 'og:description', 'og:type', 'og:site_name', 'og:locale']) if (!metas(html, 'property', p)[0]) e(`missing ${p}`);
    if (metas(html, 'property', 'og:locale')[0] !== 'en_GB') e('og:locale is not en_GB');
    if (!/<html\b[^>]*lang="en-GB"/.test(html)) e('html lang is not en-GB');
    const robots = metas(html, 'name', 'robots')[0];
    const wantRobots = !indexable || route === '/404' ? 'noindex, nofollow' : 'index, follow';
    if (robots !== wantRobots) e(`robots "${robots}" ≠ "${wantRobots}"`);

    for (const p of [['property', 'og:image'], ['name', 'twitter:image']]) {
      const img = metas(html, ...p)[0];
      if (!img) { e(`missing ${p[1]}`); continue; }
      if (!img.startsWith(`${SITE}/`)) { e(`${p[1]} not absolute on ${SITE}: ${img}`); continue; }
      const local = join(dist, img.slice(SITE.length));
      if (!existsSync(local)) { e(`${p[1]} ${img} not in dist`); continue; }
      if (!ogSeen.has(local)) {
        ogSeen.add(local);
        const m = await sharp(local).metadata();
        if (m.width !== W || m.height !== H) e(`${img} is ${m.width}×${m.height}`);
      }
      // pack 3: one link-preview image for every page
      if (img !== `${SITE}${OG_IMAGE}`) e(`${p[1]} ${img} is not ${OG_IMAGE}`);
    }
    const ogW = metas(html, 'property', 'og:image:width')[0], ogH = metas(html, 'property', 'og:image:height')[0];
    if (ogW !== String(W) || ogH !== String(H)) e(`og:image:width/height ${ogW}×${ogH}`);

    const blocks = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    const types = [];
    for (const b of blocks) {
      let doc;
      try { doc = JSON.parse(b); } catch (err) { e(`JSON-LD does not parse: ${err.message}`); continue; }
      if (doc['@context'] !== 'https://schema.org') e('JSON-LD @context is not https://schema.org');
      for (const node of doc['@graph'] ?? [doc]) {
        const t = node['@type'];
        types.push(t);
        for (const k of REQUIRED[t] ?? []) if (node[k] === undefined || node[k] === '' || (Array.isArray(node[k]) && !node[k].length)) e(`${t} missing ${k}`);
        if (t === 'BreadcrumbList') node.itemListElement?.forEach((it, i) => {
          if (it.position !== i + 1 || !it.name || !(it.item ?? '').startsWith(SITE)) e(`BreadcrumbList item ${i + 1} incomplete`);
        });
        if (t === 'Article') {
          if (!String(node.image ?? '').startsWith(SITE)) e('Article image not absolute');
          else if (!existsSync(join(dist, String(node.image).slice(SITE.length)))) e(`Article image ${node.image} not in dist`);
          if (node.inLanguage !== 'en-GB') e('Article inLanguage is not en-GB');
        }
        for (const v of JSON.stringify(node).matchAll(/"(https?:\/\/[^"]+)"/g)) if (/kokreaters\.com/i.test(v[1]) && !v[1].startsWith(SITE)) e(`non-canonical URL in JSON-LD: ${v[1]}`);
      }
    }
    for (const t of EXPECT(route)) if (!types.includes(t)) e(`JSON-LD missing ${t}`);
  }
  for (const [t, r] of titles) if (r.length > 1) errors.push(`duplicate title "${t}": ${r.join(', ')}`);
  for (const [, r] of descs) if (r.length > 1) errors.push(`duplicate description: ${r.join(', ')}`);

  // sitemap
  const index = readFileSync(join(dist, 'sitemap-index.xml'), 'utf8');
  const locs = [];
  for (const sm of [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) {
    const f = join(dist, sm.replace(SITE, ''));
    if (!existsSync(f)) { errors.push(`sitemap ${sm} missing`); continue; }
    locs.push(...[...readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  const want = new Set(routes.filter((r) => r !== '/404').map((r) => (r === '/' ? `${SITE}/` : `${SITE}${r}`)));
  const have = new Set(locs);
  for (const u of want) if (!have.has(u)) errors.push(`sitemap is missing ${u}`);
  for (const u of have) if (!want.has(u)) errors.push(`sitemap lists ${u}, which has no page`);
  if ([...have].some((u) => /\/404/.test(u))) errors.push('sitemap lists 404');

  // drafts (production)
  const llms = existsSync(join(dist, 'llms.txt')) ? readFileSync(join(dist, 'llms.txt'), 'utf8') : '';
  if (!llms) errors.push('llms.txt missing');
  if (production) {
    for (const d of insightEntries().filter((x) => !routedInProduction(x))) {
      const path = `/insights/${d.id}`;
      if ([...have].some((u) => u.endsWith(path))) errors.push(`production sitemap lists unapproved ${path}`);
      if (llms.includes(path)) errors.push(`production llms.txt links unapproved ${path}`);
      if (existsSync(join(dist, `${path}.html`))) errors.push(`production build has a page for unapproved ${path}`);
    }
  }
  if (indexable && !/Sitemap: https:\/\/kokreaters\.com\/sitemap-index\.xml/.test(robotsTxt)) errors.push('indexable robots.txt lacks the sitemap line');
  if (!indexable && !/Disallow:\s*\/\s*$/m.test(robotsTxt)) errors.push('non-indexable build: robots.txt must be Disallow: /');

  console.log(`og check: ${dist} (${info.mode}${indexable ? ', indexable' : ', noindex'}), ${files.length} pages, ${have.size} sitemap URLs, ${ogSeen.size} OG images`);
  for (const w of warnings) console.log(`  warn  ${w}`);
  for (const er of errors) console.log(`  FAIL  ${er}`);
  if (errors.length) { console.log(`og check: ${errors.length} failure(s)`); process.exitCode = 1; }
  else console.log('og check: all passed');
}

const [cmd, arg] = process.argv.slice(2);
(cmd === 'check' ? check(arg) : render()).catch((err) => { console.error(err); process.exitCode = 1; });
