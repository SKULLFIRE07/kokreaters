/** Insight queries (DESIGN-SPEC 4.12, 0.3). Coming-soon stubs never get a route. */
import { getCollection, type CollectionEntry } from 'astro:content';
import { isStaging } from './mode';
import { readingTime } from './reading-time';
import type { PillarKey } from '@/data/types';
import { formatLabels } from '@/data/microcopy';

export type Insight = CollectionEntry<'insights'>;
export { readingTime };

const time = (e: Insight): number => (e.data.date ? e.data.date.getTime() : 0);
const newestFirst = (a: Insight, b: Insight): number => time(b) - time(a) || a.data.title.localeCompare(b.data.title);

/** Staging: everything except coming-soon (drafts included). Production: published and approved only. Newest first. */
export async function visibleInsights(): Promise<Insight[]> {
  const all = await getCollection('insights');
  return all
    .filter((e) => (isStaging ? e.data.status !== 'coming-soon' : e.data.status === 'published' && e.data.review === 'approved'))
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

/** True when the entry should carry the DRAFT ribbon (staging only shows drafts at all). */
export const isDraft = (e: Insight): boolean => e.data.status === 'draft' || e.data.review !== 'approved';

export const formatLabel = (e: Insight): string => formatLabels[e.data.format];

/** Minutes, from the raw MDX body. */
export const insightReadingTime = (e: Insight): number => readingTime(e.body);

export const insightHref = (e: Insight): string => `/insights/${e.id}`;
