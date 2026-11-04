/** Page SEO strings (DESIGN-SPEC 3.8). Lengths are asserted at import, so a bad string fails the build. */
import { seo, articleOgPattern, type SeoEntry, type SeoKey } from '@/data/seo';
import { site } from '@/config/site';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export interface PageSeo { title: string; description: string; path: string; ogImage?: string; noindex?: boolean; ogType?: 'website' | 'article' | 'profile'; }

/** Returns every length violation; throws when `throwOnError` (default) is set and there is any. */
export function assertLengths(throwOnError = true): string[] {
  const errors: string[] = [];
  for (const [key, e] of Object.entries(seo) as [SeoKey, SeoEntry][]) {
    if ([...e.title].length > TITLE_MAX) errors.push(`${key}: title is ${[...e.title].length} chars (max ${TITLE_MAX})`);
    if ([...e.description].length > DESCRIPTION_MAX) errors.push(`${key}: description is ${[...e.description].length} chars (max ${DESCRIPTION_MAX})`);
    if (!e.title || !e.description) errors.push(`${key}: empty title or description`);
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
