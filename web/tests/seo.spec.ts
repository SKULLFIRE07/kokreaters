/**
 * seo (infra.md §1.7, REDESIGN-V3 §7): per built page, from the served HTML (server render, no JS): one h1; one
 * <title> ≤ 60 characters containing KoKreaters (articles: `{title} | KoKreaters Insights` when that fits, else the
 * bare title — DESIGN-SPEC 3.8); meta description ≤ 155; titles and descriptions unique; one canonical = site + path;
 * lang en-GB; meta robots per `indexable` (not per mode: preview is noindex); og:image absolute, 1200×630 and present
 * in the build; og:url, og:locale; one JSON-LD @graph with the node types each page owns.
 */
import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { routes, indexable, DIST, SITE, decode } from './helpers';

const all = (html: string, re: RegExp) => [...html.matchAll(re)];
const metaContent = (html: string, attr: 'name' | 'property', key: string) => {
  const tag = html.match(new RegExp(`<meta\\b[^>]*\\b${attr}=["']${key}["'][^>]*>`, 'i'))?.[0];
  return tag ? decode(tag.match(/\bcontent=["']([^"']*)["']/i)?.[1] ?? '') : null;
};
const WANT_TYPES: Record<string, string[]> = {
  home: ['Organization', 'ProfessionalService', 'WebSite'],
  about: ['Person', 'BreadcrumbList'],
  article: ['Article', 'BreadcrumbList'],
};

for (const r of routes) {
  test(`seo ${r.path}`, async ({ request }) => {
    const res = await request.get(r.path);
    expect(res.status()).toBe(200);
    const html = await res.text();
    const page = html.match(/<body[^>]*\bdata-page=["']([\w-]+)["']/)?.[1] ?? '';

    const h1 = all(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
    expect(h1, 'one h1 in the server HTML').toHaveLength(1);
    const titles = all(html, /<title>([\s\S]*?)<\/title>/gi).map((m) => decode(m[1].trim()));
    expect(titles, 'one <title>').toHaveLength(1);
    const title = titles[0];
    if (page === 'article') {
      const h1Text = decode(h1[0][1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
      const suffixed = `${h1Text} | KoKreaters Insights`;
      expect(title, 'article <title> per the 3.8 rule').toBe([...suffixed].length <= 60 ? suffixed : h1Text);
      if ([...title].length > 60) test.info().annotations.push({ type: 'warning', description: `article title is ${[...title].length} chars (bare-title fallback): ${title}` });
    } else {
      expect([...title].length, `title "${title}"`).toBeLessThanOrEqual(60);
      expect(title).toMatch(/KoKreaters/);
    }

    const description = metaContent(html, 'name', 'description');
    expect(description, 'meta description').toBeTruthy();
    expect([...description!].length, `description "${description}"`).toBeLessThanOrEqual(155);

    const canon = all(html, /<link\b[^>]*rel=["']canonical["'][^>]*>/gi);
    expect(canon, 'one canonical').toHaveLength(1);
    expect(canon[0][0].match(/href=["']([^"']+)["']/)?.[1]).toBe(`${SITE}${r.path}`);
    expect(html).toMatch(/<html[^>]*\blang=["']en-GB["']/);
    expect(metaContent(html, 'name', 'robots'), `robots (indexable=${indexable})`).toBe(indexable ? 'index, follow' : 'noindex, nofollow');

    const og = metaContent(html, 'property', 'og:image');
    expect(og, 'og:image').toMatch(/^https:\/\/kokreaters\.com\/og\/[\w-]+\.png$/);
    expect(existsSync(join(DIST, new URL(og!).pathname)), `og:image ${og} exists in the build`).toBe(true);
    expect(og, 'every route has its own card').not.toMatch(/\/og\/default\.png$/);
    expect(metaContent(html, 'property', 'og:image:width')).toBe('1200');
    expect(metaContent(html, 'property', 'og:image:height')).toBe('630');
    expect(metaContent(html, 'property', 'og:url')).toBe(`${SITE}${r.path}`);
    expect(metaContent(html, 'property', 'og:locale')).toBe('en_GB');

    const blocks = all(html, /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    expect(blocks.length, 'one JSON-LD block').toBe(1);
    const ld = JSON.parse(blocks[0][1]) as { '@context': string; '@graph': { '@type': string }[] };
    expect(ld['@context']).toBe('https://schema.org');
    expect(Array.isArray(ld['@graph'])).toBe(true);
    const types = ld['@graph'].map((n) => n['@type']);
    for (const t of WANT_TYPES[page] ?? ['BreadcrumbList']) expect(types, `JSON-LD @types on ${r.path}`).toContain(t);
    for (const n of ld['@graph']) expect(n['@type'], 'every node has @type').toBeTruthy();
  });
}

test('titles and descriptions are unique across pages', async ({ request }) => {
  const facts: { path: string; title: string; description: string }[] = [];
  for (const r of routes) {
    const html = await (await request.get(r.path)).text();
    facts.push({ path: r.path, title: decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? ''), description: metaContent(html, 'name', 'description') ?? '' });
  }
  const dup = (k: 'title' | 'description') => {
    const m = new Map<string, string[]>();
    for (const f of facts) m.set(f[k], [...(m.get(f[k]) ?? []), f.path]);
    return [...m].filter(([, p]) => p.length > 1).map(([v, p]) => `${v} → ${p.join(', ')}`);
  };
  expect(dup('title'), 'duplicate titles').toEqual([]);
  expect(dup('description'), 'duplicate descriptions').toEqual([]);
});
