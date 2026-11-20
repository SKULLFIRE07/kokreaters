/**
 * brief-guard (REDESIGN-V3 §0, §1.1, §1.2, §1.5, §5; research/v3/copy-edits.md; infra.md §1.10): static checks over
 * the built HTML/CSS plus a computed-style check in the browser.
 *   copy     none of the deleted casual asides / toy instructions is visible text or an accessible label on any page
 *   toys     none of the v2 toy hooks is in the markup (split-flap, scramble, crumple, gravity, marquee, rail, globe, …)
 *   palette  no v2 purple / pink / yellow / red hex in built CSS (dist/_astro/*.css, <style>, style="") — the logo SVGs
 *            (inline <svg> and .svg files) keep the node-cluster colours and are exempt
 *   type     no v2 font file is requested; h1 is Source Serif 4, body is Inter at 18px (≥ 1024 and on phones)
 */
import { test, expect } from '@playwright/test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { routes, readHtml, htmlText, decode, DIST, settle } from './helpers';

/** copy-edits.md B + C: DELETE verdicts that are distinctive enough to never be legitimate copy. Lower case, ' for ’. */
const BANNED_COPY = [
  'or just say hello', "we're all ears", 'thanks for reading all the way down', "they're designed to work together",
  "that's us", 'hover a pillar', 'tap one to dive in', 'six blocks, one team', 'start anywhere', 'you are here',
  'the other five', 'scroll, it draws itself', 'read the full note', 'nothing hidden', 'contents may vary with your plant',
  'inspect the label', 'close the inspector', 'drag the frame over the label', 'what lands on your desk',
  'one for the record', 'pick yours', 'industries wheel', 'scroll to turn the wheel',
  "that's you + us", "pull a node, it's all connected", 'yes, that who', 'plant floor · lab · boardroom',
  'most consultants pick one circle', 'read the whole truth', 'crude comes in', 'refine it right', 'split the fractions',
  'blend to spec', 'product that ships', 'one pipe, one person', 'and up it goes', 'scroll, it flows',
  'keep scrolling, it moves sideways', 'swipe for all six', 'listening comes first', 'with proof that it works',
  'yes, minus twenty-five', 'home base', 'go on, toss one', 'fresh from the notebook', 'no noise, really', 'no noise.',
  "that's ganeaysh",
  'field notes, not fluff', 'press one to lift it', "what's inside", 'the rest of the deck is on its way', 'grab a coffee',
  'the short version', 'boarding pass', 'passenger', 'tear here', 'the more detail, the better', 'talk soon',
  'the small print, in normal-size print', 'go on, make a mess',
  'the whole idea, really', 'three acts, keep scrolling', 'final_report_v7.pdf', 'crumple it', 'smooth it out',
  'much better', 'the house rules', 'pick a shape', 'fling one', 'next card', 'wipe the glass', 'names withheld, on purpose',
  'hello from the netherlands', 'the long way round', 'scroll to spin it', '= together', '= the people who make things happen',
  'and a bit of russian', 'pause motion', 'play motion', 'reconnect the node', '✶',
];
const TOY_HOOKS = ['data-flap-board', 'data-flap-tile', 'data-scramble', 'data-crumple', 'data-gravity-tags', 'data-falling-text',
  'data-ticket', 'data-magnetic', 'data-magnetic-letters', 'data-magnetic-dots', 'data-note', 'data-scribble', 'data-sticker',
  'data-stamp-spin', 'data-marquee', 'data-rail', 'data-cursor', 'data-pipeline', 'data-venn', 'data-emulsion',
  'data-fan-item', 'data-globe', 'data-motion-toggle'];   // v3 Delft: data-lenis-prevent is allowed (Lenis is back)
const V2_HEXES = ['#F4C841', '#E5494D', '#3A1C5C', '#5B2A86', '#7B4BC4', '#8C5B88', '#C8457E', '#EADCFF', '#FFEEB0', '#F6DCE8',
  '#A2335F', '#6F4470', '#F8F6FC'];

const pages = [...routes, { path: '/404', file: '404.html', name: '404' }].filter((r) => existsSync(join(DIST, r.file)));
const norm = (s: string) => s.toLowerCase().replace(/[’‘]/g, "'");

test('no casual asides or toy instructions in any page (text + accessible labels)', () => {
  const hits: string[] = [];
  for (const r of pages) {
    const html = readHtml(r.file);
    const labels = [...html.matchAll(/\s(?:aria-label|alt|title|placeholder|data-label-[\w-]+)="([^"]*)"/gi)].map((m) => decode(m[1])).join(' · ');
    const text = norm(`${htmlText(html)} · ${labels}`);
    for (const s of BANNED_COPY) if (text.includes(s)) hits.push(`${r.path}: "${s}"`);
  }
  expect(hits).toEqual([]);
});

test('no v2 toy hooks in the markup', () => {
  const hits: string[] = [];
  for (const r of pages) {
    const html = readHtml(r.file);
    for (const h of TOY_HOOKS) if (new RegExp(`\\s${h}(?:[\\s=>])`).test(html)) hits.push(`${r.path}: [${h}]`);
    if (/\sdraggable="true"/.test(html)) hits.push(`${r.path}: [draggable="true"]`);
    // v3.1 §9.4: the CSS-only drift is allowed, but only on the foundation PhotoInterlude frame
    for (const m of html.matchAll(/<[^>]*\sdata-parallax[\s=>][^>]*>/g)) if (!/class="[^"]*\binterlude__frame\b/.test(m[0])) hits.push(`${r.path}: [data-parallax] outside PhotoInterlude`);
  }
  expect(hits).toEqual([]);
});

test('palette: no v2 purple / pink / yellow / red in built CSS (logo SVGs exempt)', () => {
  const hits: string[] = [];
  const scan = (css: string, where: string) => {
    for (const m of css.matchAll(/#([0-9a-f]{6})\b/gi)) if (V2_HEXES.includes(`#${m[1].toUpperCase()}`)) hits.push(`${where}: #${m[1].toUpperCase()}`);
  };
  const astro = join(DIST, '_astro');
  for (const f of readdirSync(astro).filter((n) => n.endsWith('.css'))) scan(readFileSync(join(astro, f), 'utf8'), `_astro/${f}`);
  for (const r of pages) {
    const html = readHtml(r.file).replace(/<svg\b[\s\S]*?<\/svg>/gi, '');
    for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) scan(m[1], `${r.path} <style>`);
    for (const m of html.matchAll(/\sstyle="([^"]*)"/gi)) scan(m[1], `${r.path} style=""`);
  }
  expect(hits).toEqual([]);
});

for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`type: Bodoni Moda headlines, Manrope 18px body, no older fonts @${vp.width}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: vp });
    const problems: string[] = [];
    for (const path of ['/', '/expertise/process-design', '/insights', '/about', '/contact', '/privacy']) {
      if (!routes.some((r) => r.path === path)) continue;
      const page = await ctx.newPage();
      const fonts: string[] = [];
      page.on('request', (req) => { if (/\/fonts\//.test(req.url())) fonts.push(req.url()); });
      await page.goto(path, { waitUntil: 'load' });
      await settle(page, 200);
      await page.evaluate(() => document.fonts.ready);
      const t = await page.evaluate(() => {
        const h1 = getComputedStyle(document.querySelector('h1')!);
        const body = getComputedStyle(document.body);
        const p = document.querySelector('main p');
        return { h1: h1.fontFamily, body: body.fontFamily, bodySize: body.fontSize, p: p ? getComputedStyle(p).fontSize : null,
          loaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')) };
      });
      if (!/^"?Bodoni Moda"?/.test(t.h1)) problems.push(`${path}: h1 font-family ${t.h1}`);
      if (!/^"?Manrope"?/.test(t.body)) problems.push(`${path}: body font-family ${t.body}`);
      if (!(parseFloat(t.bodySize) >= 17.5 && parseFloat(t.bodySize) <= 18.5)) problems.push(`${path}: body font-size ${t.bodySize}`);
      if (!t.loaded.includes('Bodoni Moda') || !t.loaded.includes('Manrope')) problems.push(`${path}: web fonts not loaded (${t.loaded.join(', ')})`);
      for (const f of fonts) if (/bricolage|ibm-plex|caveat|instrument|fraunces|source-serif|inter-latin/i.test(f)) problems.push(`${path}: v2 font requested ${f}`);
      await page.close();
    }
    await ctx.close();
    expect(problems).toEqual([]);
  });
}
