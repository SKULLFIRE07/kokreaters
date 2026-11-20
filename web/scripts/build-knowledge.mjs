#!/usr/bin/env node
/**
 * build-knowledge.mjs — the "Ask KoKreaters" knowledge base (api/chat.js imports it).
 *
 * Reads the site's real content and writes api/_lib/knowledge.js (`export const KNOWLEDGE = "…"`), a plain-text
 * knowledge base that becomes the cached part of the chatbot's system prompt:
 *   src/data/*.ts      home, pillars (expertise), industries, approach (method, principles, models, FAQ), impact
 *                      (founder results; engagements only when consent is 'cleared'), founder, contact facts
 *   src/config/site.ts email, base, WhatsApp, LinkedIn
 *   src/content/insights/*.mdx  title, standfirst, key takeaways and body text of the insights VISIBLE in this build's
 *                      mode (same rule as src/lib/insights.ts visibleInsights(): staging/preview = everything but
 *                      coming-soon; production = published + approved). Coming-soon titles are listed as "in preparation".
 * Mode: PUBLIC_SITE_MODE (staging | preview | production, default staging), the same env the Astro build reads.
 * Output is deterministic (no timestamps), so the prompt cache prefix stays byte-identical between deploys of the
 * same content. Run by prebuild / build:preview / build:prod; the generated file is committed too, so the function
 * always has a knowledge base even if a builder runs before the build script.
 *
 * Also exports CONTACT_FIELDS (src/data/contact.ts fields) and CONTACT_EMAIL for api/contact.js.
 *
 * Usage: node scripts/build-knowledge.mjs [--check]   (--check: exit 1 if api/_lib/knowledge.js is stale)
 *
 * TypeScript data files are loaded with Node's own type stripping (Node ≥ 22.18) plus two tiny module hooks:
 * '@/…' → src/…, extensionless relative imports → .ts, and `import.meta.env` → process.env (src/config/site.ts).
 */
import { registerHooks } from 'node:module';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse as parseYaml } from 'yaml';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'api', '_lib', 'knowledge.js');
const CHECK = process.argv.includes('--check');
const MODE = ['preview', 'production'].includes(process.env.PUBLIC_SITE_MODE ?? '') ? process.env.PUBLIC_SITE_MODE : 'staging';
const includeDrafts = MODE !== 'production';

registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('@/')) {
      const base = join(SRC, specifier.slice(2));
      return next(pathToFileURL(existsSync(base + '.ts') ? base + '.ts' : base).href, context);
    }
    if (/^\.\.?\//.test(specifier) && !/\.[cm]?[jt]s$/.test(specifier) && context.parentURL?.startsWith(pathToFileURL(SRC).href)) {
      const base = fileURLToPath(new URL(specifier, context.parentURL));
      if (existsSync(base + '.ts')) return next(pathToFileURL(base + '.ts').href, context);
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    const r = next(url, context);
    if (url.startsWith(pathToFileURL(SRC).href) && url.endsWith('.ts')) {
      const src = String(r.source).replace(/import\.meta\.env/g, 'process.env');
      return { ...r, source: src };
    }
    return r;
  },
});

const load = (rel) => import(pathToFileURL(join(SRC, rel)).href);
const [home, pillarsM, industriesM, approachM, impactM, founderM, contactM, siteM] = await Promise.all([
  load('data/home.ts'), load('data/pillars.ts'), load('data/industries.ts'), load('data/approach.ts'),
  load('data/impact.ts'), load('data/founder.ts'), load('data/contact.ts'), load('config/site.ts'),
]);
const { site } = siteM;
const { pillars, expertiseOverview } = pillarsM;
const { industries, industriesPage } = industriesM;
const { approach, steps, principles, engage, faq } = approachM;
const { impactStories, engagements, testimonials, impactPage } = impactM;
const { founderName, about, longBio, shortBio, timeline, timelineRoles, name, education, languages, workedWith } = founderM;

/* ── text helpers ── */
const clean = (s) => String(s ?? '')
  .replace(/[  ]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const pillarName = (key) => pillars.find((p) => p.key === key)?.name ?? key;
const list = (items) => items.map((i) => `- ${clean(i)}`).join('\n');

/* ── insights (MDX) ── */
function readInsights() {
  const dir = join(SRC, 'content', 'insights');
  return readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort().map((f) => {
    const raw = readFileSync(join(dir, f), 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    const data = m ? parseYaml(m[1]) : {};
    const body = m ? m[2] : raw;
    return { id: f.replace(/\.mdx$/, ''), data: { review: 'pending', ...data }, body };
  });
}
const visible = (e) => (includeDrafts ? e.data.status !== 'coming-soon' : e.data.status === 'published' && e.data.review === 'approved');

/** Strip MDX to readable text: imports, <Confirm> (staging-only notes), JSX tags, markdown syntax. Keeps headings. */
function mdxToText(body) {
  let s = body;
  const takeaways = [];
  s = s.replace(/<Takeaways\s+items=\{\[([\s\S]*?)\]\}\s*\/>/g, (_, inner) => {
    for (const t of inner.matchAll(/(['"`])((?:\\.|(?!\1).)*)\1/g)) takeaways.push(t[2].replace(/\\'/g, "'"));
    return '';
  });
  s = s.replace(/^import .*$/gm, '');
  s = s.replace(/<Confirm\b[^>]*\/>/g, '');
  s = s.replace(/<Confirm\b[\s\S]*?<\/Confirm>/g, '');
  s = s.replace(/<Note\b[^>]*>([\s\S]*?)<\/Note>/g, ' ($1)');
  // ProcessChain / Exhibit steps: keep the step names and notes as a list
  s = s.replace(/<ProcessChain\s+steps=\{\[([\s\S]*?)\]\}\s*\/>/g, (_, inner) => {
    const rows = [...inner.matchAll(/name:\s*(['"])(.*?)\1(?:,\s*note:\s*(['"])(.*?)\3)?/g)].map((r) => `- ${r[2]}${r[4] ? `: ${r[4]}` : ''}`);
    return `\n${rows.join('\n')}\n`;
  });
  s = s.replace(/<Exhibit\b[^>]*title="([^"]*)"[^>]*>/g, '\nExhibit: $1\n');
  s = s.replace(/<PullQuote\b[^>]*>([\s\S]*?)<\/PullQuote>/g, '\n“$1”\n');
  s = s.replace(/<\/?[A-Z][\w.]*\b[^>]*\/?>/g, '');   // remaining components
  s = s.replace(/<\/?[a-z][^>]*>/g, '');              // stray HTML
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');          // MDX comments
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');       // links → text
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1$2');
  s = s.replace(/^#{2,}\s*(.+)$/gm, '\n$1\n');
  s = s.replace(/^\s*[-*]\s+/gm, '- ');
  s = s.replace(/[  ]/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return { text: s, takeaways };
}

const insights = readInsights();
const shown = insights.filter(visible);
const preparing = insights.filter((e) => e.data.status === 'coming-soon');

/* ── assemble ── */
const sections = [];
const add = (title, body) => sections.push(`## ${title}\n${body.trim()}`);

add('About KoKreaters', [
  `KoKreaters is an independent technical and strategy consultancy for food, feed and specialty ingredients. ${clean(home.hero.sub)}`,
  `Founder: ${founderName}. ${clean(shortBio)}`,
  clean(about.intro),
  `Positioning: ${clean(home.positioning.headline)} ${clean(home.positioning.promise)}`,
  clean(home.positioning.range),
  `Base: ${site.base}. Countries of the founder's career: ${home.hero.footRight.join(', ')}.`,
  `The name: ${clean(name.ko)} ${clean(name.kreaters)} ${clean(name.tagline)}`,
  `Founder quote: “${clean(home.founderQuote.quote)}” (${home.founderQuote.attribution})`,
  `Track record (from the founder's career): ${home.proof.map((p) => `${p.value} ${p.label}`).join('; ')}.`,
].join('\n'));

add('Expertise: the six areas', [
  clean(expertiseOverview.intro),
  ...pillars.map((p) => [
    `### ${p.n}. ${p.name} (${'/expertise/' + p.slug})`,
    `Promise: ${clean(p.promise)}`,
    clean(p.intro),
    'What we help with:', list(p.helpWith),
    `Typical deliverables: ${p.deliverables.map(clean).join(', ')}.`,
  ].join('\n')),
].join('\n\n'));

add('Industries (/industries)', [
  clean(industriesPage.lead),
  ...industries.map((i) => `- ${i.name}: ${clean(i.copy)} Relevant expertise: ${i.pillars.map(pillarName).join(', ')}.`),
].join('\n'));

add('Approach (/approach): how we work', [
  `${clean(approach.headline)} ${clean(approach.intro)}`,
  'The method: Connect. Collaborate. Create.',
  ...steps.map((s) => `### ${s.n}. ${s.name}\n${clean(s.copy)}\nWhat we do: ${clean(s.whatWeDo)}\nWhat you get: ${clean(s.whatYouGet)}\nTypical duration: ${clean(s.duration)}`),
  '### Principles', list(principles.map((p) => `${p.name}: ${p.copy}`)),
  `### ${engage.title}`, clean(engage.intro), list(engage.items.map((m) => `${m.title}: ${m.copy}`)), clean(engage.confidential), 'No prices are published.',
  '### Frequently asked questions', ...faq.map((f) => `Q: ${clean(f.q)}\nA: ${clean(f.a)}`),
].join('\n'));

const cleared = engagements.filter((e) => e.consent === 'cleared');
add('Impact (/impact)', [
  clean(impactPage.lead),
  'Stories from the founder’s 25-year career, before KoKreaters (never present them as KoKreaters client projects; confirmed figures only):',
  ...impactStories.map((r) => { const figs = r.figures.filter((f) => !f.pending).map((f) => `${f.value} ${f.label}`).join('; '); return `- ${r.tag}: ${clean(r.title)}.${figs ? ` Figures: ${figs}.` : ''} Challenge: ${clean(r.challenge)} What was done: ${clean(r.done)} Result: ${clean(r.result)} Expertise: ${r.pillars.map(pillarName).join(', ')}.`; }),
  ...(cleared.length ? ['KoKreaters engagements (anonymised):', ...cleared.map((e) => `- ${clean(e.text)}`)] : []),
  ...(testimonials.length ? ['Testimonials:', ...testimonials.map((t) => `- “${clean(t.quote)}” ${t.name}, ${t.role}`)] : []),
].join('\n'));

add(`Founder (/about): ${founderName}`, [
  ...longBio.map(clean),
  `Career timeline: ${timeline.map((t) => `${t.label} ${t.years} (${clean(timelineRoles[t.label] ?? '')})`).join('; ')}.`,
  `Education: ${education.join('; ')}.`,
  `Languages: ${languages.join(', ')}.`,
  clean(workedWith),
].join('\n'));

add('Insights (/insights)', [
  ...(shown.length ? shown.map((e) => {
    const { text, takeaways } = mdxToText(e.body);
    return [
      `### ${clean(e.data.title)} (/insights/${e.id})`,
      `Area: ${pillarName(e.data.pillar)}.`,
      e.data.standfirst ? `Standfirst: ${clean(e.data.standfirst)}` : '',
      takeaways.length ? `Key takeaways:\n${list(takeaways)}` : '',
      text,
    ].filter(Boolean).join('\n');
  }) : ['No insights are published yet.']),
  ...(preparing.length ? [`In preparation (not yet published, no content to quote): ${preparing.map((e) => clean(e.data.title)).join('; ')}.`] : []),
].join('\n\n'));

add('Contact', [
  `Email: ${site.email}. WhatsApp: ${site.whatsapp.display}. LinkedIn: ${site.linkedin.display}.`,
  `The contact form is on /contact ("${clean(contactM.contact.headline)}"). ${clean(contactM.contact.intro)}`,
  `${clean(home.cta.body)}`,
  `Fields the form asks for: ${contactM.fields.filter((f) => f.type !== 'checkbox').map((f) => f.label).join(', ')}.`,
].join('\n'));

const KNOWLEDGE = `# KoKreaters knowledge base (kokreaters.com)\n\n${sections.join('\n\n')}\n`;
const file = [
  '// GENERATED by scripts/build-knowledge.mjs from src/data, src/config/site.ts and src/content/insights. Do not edit.',
  `// Mode: ${MODE} (PUBLIC_SITE_MODE). Re-run the script after any content change (prebuild does it).`,
  `export const KNOWLEDGE_MODE = ${JSON.stringify(MODE)};`,
  '/** The contact form fields (src/data/contact.ts), so api/contact.js validates the same names, labels and options. */',
  `export const CONTACT_FIELDS = ${JSON.stringify(contactM.fields.map(({ name, label, type, required, options, maxLength }) => ({ name, label, type, required, ...(options ? { options } : {}), ...(maxLength ? { maxLength } : {}) })))};`,
  `export const CONTACT_EMAIL = ${JSON.stringify(site.email)};`,
  `export const KNOWLEDGE = ${JSON.stringify(KNOWLEDGE)};`,
  '',
].join('\n');

if (CHECK) {
  const cur = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (cur !== file) { console.error(`build-knowledge: STALE ${OUT}. Run "node scripts/build-knowledge.mjs".`); process.exit(1); }
  console.log('build-knowledge: api/_lib/knowledge.js is current.');
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, file);
  console.log(`build-knowledge: wrote ${OUT.slice(ROOT.length + 1)} (${MODE}; ${KNOWLEDGE.length} chars, ≈${Math.round(KNOWLEDGE.length / 4)} tokens; ${shown.length} insight(s), ${preparing.length} in preparation)`);
}
