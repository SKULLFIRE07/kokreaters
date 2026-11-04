/**
 * seo (DESIGN-SPEC 3.7, 3.8, 9 W3-tests): per built page, from the served HTML (server render, no JS):
 * title ≤ 60 and description ≤ 155 characters and both unique; exactly one canonical equal to site + path; one h1;
 * lang en-GB; robots meta per mode; og:image absolute and present in the build; JSON-LD parses into one
 * schema.org @graph with the node types 3.7 assigns to that page.
 */
import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { routes, mode, DIST, SITE } from './helpers';

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'");
const all = (html: string, re: RegExp) => [...html.matchAll(re)];
const metaContent = (html: string, attr: 'name' | 'property', key: string) => {
  const tag = html.match(new RegExp(`<meta\\b[^>]*\\b${attr}=["']${key}["'][^>]*>`, 'i'))?.[0];
  return tag ? decode(tag.match(/\bcontent=["']([^"']*)["']/i)?.[1] ?? '') : null;
};

interface Facts { path: string; title: string; description: string }

for (const r of routes) {
  test(`seo ${r.path}`, async ({ request }) => {
    const res = await request.get(r.path);
    expect(res.status()).toBe(200);
    const html = await res.text();
    const page = html.match(/<body[^>]*\bdata-page=["']([\w-]+)["']/)?.[1] ?? '';

    const titles = all(html, /<title>([\s\S]*?)<\/title>/gi).map((m) => decode(m[1].trim()));
    expect(titles, 'one <title>').toHaveLength(1);
    const title = titles[0];
    const h1 = all(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
    expect(h1, 'one h1 in the server HTML').toHaveLength(1);
    if (page === 'article') {
      // 3.8: `{title} | KoKreaters Insights` when that fits in 60 characters, else the bare article title
      const h1Text = decode(h1[0][1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
      const suffixed = `${h1Text} | KoKreaters Insights`;
      expect([suffixed.length <= 60 ? suffixed : h1Text], `article <title> per the 3.8 rule`).toContain(title);
      if (title.length > 60) test.info().annotations.push({ type: 'warning', description: `article title is ${title.length} chars (bare-title fallback): ${title}` });
    } else {
      expect(title.length, `title "${title}"`).toBeLessThanOrEqual(60);
      expect(title).toMatch(/KoKreaters/);
    }

    const description = metaContent(html, 'name', 'description');
    expect(description, 'meta description').toBeTruthy();
    expect(description!.length, `description "${description}"`).toBeLessThanOrEqual(155);

    const canon = all(html, /<link\b[^>]*rel=["']canonical["'][^>]*>/gi);
    expect(canon, 'one canonical').toHaveLength(1);
    const href = canon[0][0].match(/href=["']([^"']+)["']/)?.[1];
    expect(href).toBe(`${SITE}${r.path}`);
    expect(html).toMatch(/<html[^>]*\blang=["']en-GB["']/);

    const robots = metaContent(html, 'name', 'robots');
    expect(robots).toBe(mode === 'staging' ? 'noindex, nofollow' : 'index, follow');

    const og = metaContent(html, 'property', 'og:image');
    expect(og, 'og:image').toMatch(/^https:\/\/kokreaters\.com\/.+\.(png|jpg)$/);
    expect(existsSync(join(DIST, new URL(og!).pathname)), `og:image ${og} exists in the build`).toBe(true);
    expect(metaContent(html, 'property', 'og:url')).toBe(`${SITE}${r.path}`);
    expect(metaContent(html, 'property', 'og:locale')).toBe('en_GB');

    const blocks = all(html, /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    expect(blocks.length, 'one JSON-LD block').toBe(1);
    const ld = JSON.parse(blocks[0][1]) as { '@context': string; '@graph': { '@type': string; '@id'?: string }[] };
    expect(ld['@context']).toBe('https://schema.org');
    expect(Array.isArray(ld['@graph'])).toBe(true);
    const types = ld['@graph'].map((n) => n['@type']);
    const want: Record<string, string[]> = {
      home: ['Organization', 'ProfessionalService', 'WebSite'],
      about: ['Person', 'BreadcrumbList'],
      article: ['Article', 'BreadcrumbList'],
    };
    for (const t of want[page] ?? ['BreadcrumbList']) expect(types, `JSON-LD @types on ${r.path}`).toContain(t);
    for (const n of ld['@graph']) expect(n['@type'], 'every node has @type').toBeTruthy();
  });
}

test.describe.serial('uniqueness', () => {
  test('titles and descriptions are unique across pages', async ({ request }) => {
    const facts: Facts[] = [];
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
});
