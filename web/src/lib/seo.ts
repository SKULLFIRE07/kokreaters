/** Page SEO strings (DESIGN-SPEC 3.8). Lengths are asserted at import, so a bad string fails the build. */
import { seo, articleOgPattern, type SeoEntry, type SeoKey } from '@/data/seo';
import { site } from '@/config/site';

/** Pack 3 lead decision 6: the one link-preview image (new logo + headline) for every page; public/og via prepare-brand. */
export const OG_IMAGE = '/og/kokreaters-social-share-1200x630.png';
export const OG_ALT = 'KoKreaters: Connect, Collaborate, Create. Deep expertise, turned into products, plants and markets.';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export interface PageSeo { title: string; description: string; path: string; ogImage?: string; noindex?: boolean; ogType?: 'website' | 'article' | 'profile'; }

/** Returns every length violation; throws when `throwOnError` (default) is set and there is any. */
/** Entries whose title and description are the client's verbatim copy (pack 2 item 39, V6 brief): length limits do not apply. */
export const LENGTH_EXEMPT: readonly SeoKey[] = ['home', 'insights'];

export function assertLengths(throwOnError = true): string[] {
  const errors: string[] = [];
  for (const [key, e] of Object.entries(seo) as [SeoKey, SeoEntry][]) {
    if (!e.title || !e.description) errors.push(`${key}: empty title or description`);
    if (LENGTH_EXEMPT.includes(key)) continue;
    if ([...e.title].length > TITLE_MAX) errors.push(`${key}: title is ${[...e.title].length} chars (max ${TITLE_MAX})`);
    if ([...e.description].length > DESCRIPTION_MAX) errors.push(`${key}: description is ${[...e.description].length} chars (max ${DESCRIPTION_MAX})`);
  }
  if (errors.length && throwOnError) throw new Error(`SEO length check failed:\n${errors.join('\n')}`);
  return errors;
}
assertLengths();

export function pageSeo(key: SeoKey): PageSeo {
  const e = seo[key];
  return {
    title: e.title,
    description: e.description,
    path: e.path,
    ...(e.og ? { ogImage: e.og } : {}),
    ...(e.noindex ? { noindex: true } : {}),
    ogType: key === 'about' ? 'profile' : 'website',
  };
}

/** Article title rule: `{title} | KoKreaters Insights` when ≤ 60, else `{title}`. */
export function articleTitle(title: string): string {
  const full = `${title} | KoKreaters Insights`;
  return [...full].length <= TITLE_MAX ? full : title;
}

export function articleSeo(entry: { id: string; title: string; description: string }): PageSeo {
  return {
    title: articleTitle(entry.title),
    description: entry.description,
    path: `/insights/${entry.id}`,
    ...(articleOgPattern ? { ogImage: articleOgPattern.replace('{id}', entry.id) } : {}),
    ogType: 'article',
  };
}

export const canonical = (path: string): string => (path === '/' ? `${site.url}/` : `${site.url}${path}`);
