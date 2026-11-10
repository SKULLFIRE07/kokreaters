/** Insight queries (DESIGN-SPEC 4.12, 0.3). Coming-soon stubs never get a route. */
import { getCollection, type CollectionEntry } from 'astro:content';
import { includeDrafts } from './mode';
import { readingTime } from './reading-time';
import type { PillarKey } from '@/data/types';
import { formatLabels } from '@/data/microcopy';
import { photoList } from '@/data/photos';
import type { ImageMetadata } from 'astro';

export type Insight = CollectionEntry<'insights'>;
export { readingTime };

const time = (e: Insight): number => (e.data.date ? e.data.date.getTime() : 0);
const newestFirst = (a: Insight, b: Insight): number => time(b) - time(a) || a.data.title.localeCompare(b.data.title);

/**
 * Staging and preview (`includeDrafts`): everything except coming-soon, drafts included (the Draft label itself is
 * staging-only). Production: published and approved only. Coming-soon never gets a route. Newest first.
 */
export async function visibleInsights(): Promise<Insight[]> {
  const all = await getCollection('insights');
  return all
    .filter((e) => (includeDrafts ? e.data.status !== 'coming-soon' : e.data.status === 'published' && e.data.review === 'approved'))
    .sort(newestFirst);
}

/** Coming-soon stubs, shown only as unlinked titles under "In preparation". */
export async function comingSoon(): Promise<Insight[]> {
  const all = await getCollection('insights');
  return all.filter((e) => e.data.status === 'coming-soon');
}

/** Visible insights for one pillar. */
export async function byPillar(key: PillarKey): Promise<Insight[]> {
  return (await visibleInsights()).filter((e) => e.data.pillar === key);
}

export async function comingSoonByPillar(key: PillarKey): Promise<Insight[]> {
  return (await comingSoon()).filter((e) => e.data.pillar === key);
}

/** The first `featured` visible entry, otherwise the newest visible one. */
export async function featuredInsight(): Promise<Insight | undefined> {
  const list = await visibleInsights();
  return list.find((e) => e.data.featured) ?? list[0];
}

/** True for draft / unapproved entries. Render a label only when `showDraftLabels` (staging). */
export const isDraft = (e: Insight): boolean => e.data.status === 'draft' || e.data.review !== 'approved';

export const formatLabel = (e: Insight): string => formatLabels[e.data.format];

/** Minutes, from the raw MDX body. */
export const insightReadingTime = (e: Insight): number => readingTime(e.body);

export const insightHref = (e: Insight): string => `/insights/${e.id}`;

/**
 * The entry's frontmatter photo with its alt text and the crop position from src/data/photos.ts (matched by the
 * stock file's slug in the image URL; position is undefined for a photo that is not in the stock set).
 * Use the same photo for the card, the hub feature and the article hero (research/v3/photos.md).
 */
export function insightImage(e: Insight): { src: ImageMetadata; alt: string; position?: string } | undefined {
  const img = e.data.image;
  if (!img) return undefined;
  const match = photoList.find((p) => img.src.includes(`/${p.slug}.`));
  return { src: img, alt: e.data.imageAlt ?? match?.alt ?? '', position: match?.position };
}

/** Coming-soon stubs ordered by format (point of view, field notes, explainer), then title. */
export async function comingSoonSorted(): Promise<Insight[]> {
  const order = Object.keys(formatLabels);
  return (await comingSoon()).sort((a, b) => order.indexOf(a.data.format) - order.indexOf(b.data.format) || a.data.title.localeCompare(b.data.title));
}
