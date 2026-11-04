/**
 * JSON-LD builders (DESIGN-SPEC 3.7). Every value is a brief fact.
 * Builders return plain graph nodes; JsonLd.astro wraps them in one @graph.
 */
import { site } from '@/config/site';
import { pillars } from '@/data/pillars';
import { shortBio, founderName, founderRole } from '@/data/founder';
import { microcopy } from '@/data/microcopy';

export interface SeoProps {
  title: string;               // full title, exactly as in src/data/seo.ts
  description: string;         // ≤155 chars, from src/data/seo.ts
  path: string;                // '/about'; canonical = site + path ('/' for home)
  ogImage?: string;            // '/og/about.png'; default '/og/default.png'
  ogType?: 'website' | 'article' | 'profile';
  noindex?: boolean;           // 404 always true; staging forces true
  jsonLd?: Record<string, unknown>[];  // already-built graph nodes (schema.ts builders)
  article?: { published?: string; modified?: string; section?: string };
}

export type GraphNode = Record<string, unknown>;

const BASE = site.url.replace(/\/$/, '');
export const abs = (path: string): string => (/^https?:\/\//.test(path) ? path : `${BASE}${path.startsWith('/') ? '' : '/'}${path}`);
export const canonicalFor = (path: string): string => (path === '/' || path === '' ? `${BASE}/` : abs(path.replace(/\/$/, '')));

const ID = {
  org: `${BASE}/#org`,
  service: `${BASE}/#service`,
  website: `${BASE}/#website`,
  person: `${BASE}/about#ganeaysh`,
};

/** Brief section 1, positioning statement (verbatim). */
export const POSITIONING_STATEMENT =
  'KoKreaters helps food, nutrition and specialty-ingredient companies design better products, run better plants and make bolder decisions, by co-creating with their teams from the plant floor to the boardroom.';

/** Brief section 8 target search terms (verbatim). */
const TARGET_TERMS = [
  'specialty fats consultant',
  'oils and fats consultant',
  'edible oil refining consultant',
  'cocoa butter equivalent (CBE) development',
  'bakery shortening and margarine development',
  '3-MCPD and glycidyl ester reduction',
  'trans fat elimination consultant',
  'food safety audit for oils and fats suppliers',
  'supplier pre-approval audit readiness',
  'technical due diligence food ingredients',
  'feasibility study food ingredients plant',
  'palm oil refinery commissioning',
  'fractionation and interesterification consulting',
  'food ingredients market entry India',
  'oleochemicals consulting',
];

export function organization(): GraphNode {
  return {
    '@type': 'Organization',
    '@id': ID.org,
    name: site.name,
    url: `${BASE}/`,
    logo: `${BASE}/brand/kokreaters-logo-512.png`,
    email: site.email,
    foundingDate: '2026', // CONFIRM 13
    founder: { '@id': ID.person },
    sameAs: [], // C-7: empty until a LinkedIn company page exists
  };
}

export function professionalService(): GraphNode {
  return {
    '@type': 'ProfessionalService',
    '@id': ID.service,
    name: site.name,
    url: `${BASE}/`,
    description: POSITIONING_STATEMENT,
    areaServed: 'Worldwide',
    address: { '@type': 'PostalAddress', addressCountry: 'NL' },
    email: site.email,
    telephone: '+31622157910',
    knowsAbout: [...pillars.map((p) => p.name), ...TARGET_TERMS],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Expertise',
      itemListElement: pillars.map((p) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: p.name, url: abs(`/expertise/${p.slug}`) },
      })),
    },
    parentOrganization: { '@id': ID.org },
  };
}

export function website(): GraphNode {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    name: site.name,
    url: `${BASE}/`,
    inLanguage: 'en-GB',
    publisher: { '@id': ID.org },
  };
}

/** `image` is the portrait URL (absolute or root-relative); pass the built 4:5 WebP src. */
export function person(image?: string): GraphNode {
  return {
    '@type': 'Person',
    '@id': ID.person,
    name: founderName,
    jobTitle: founderRole,
    worksFor: { '@id': ID.org },
    description: shortBio,
    ...(image ? { image: abs(image) } : {}),
    knowsLanguage: ['en', 'hi', 'mr', 'id', 'ru'],
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'CFTRI Mysore' },
      { '@type': 'CollegeOrUniversity', name: 'University of Pune' },
    ],
    address: { '@type': 'PostalAddress', addressCountry: 'NL' },
    sameAs: [site.linkedin.href],
  };
}

export interface ArticleInput {
  title: string;
  standfirst: string;
  path: string;              // '/insights/slug'
  published?: Date | string;
  modified?: Date | string;
  section?: string;          // pillar name
  ogImage?: string;
}
const iso = (d?: Date | string) => (d ? (d instanceof Date ? d.toISOString() : d) : undefined);

export function article(entry: ArticleInput): GraphNode {
  const url = canonicalFor(entry.path);
  const published = iso(entry.published);
  const modified = iso(entry.modified) ?? published;
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: entry.title,
    description: entry.standfirst,
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    author: { '@id': ID.person, '@type': 'Person', name: founderName },
    publisher: { '@id': ID.org },
    image: abs(entry.ogImage ?? '/og/default.png'),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(entry.section ? { articleSection: entry.section } : {}),
    inLanguage: 'en-GB',
  };
}

export interface Crumb { label: string; href: string }

/** Prepends Home when the trail does not start at '/'. */
export function withHome(items: Crumb[]): Crumb[] {
  if (!items.length) return items;
  return items[0].href === '/' ? items : [{ label: microcopy.homeCrumb, href: '/' }, ...items];
}

export function breadcrumbs(items: Crumb[]): GraphNode {
  const trail = withHome(items);
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: canonicalFor(c.href),
    })),
  };
}
