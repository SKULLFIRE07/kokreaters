/** Pillar lookups (v3). Pillar colours are retired (REDESIGN-V3 §1.1): every pillar uses brand blue. */
import { pillars } from '@/data/pillars';
import type { Pillar, PillarKey, PillarSlug } from '@/data/types';

export { pillars };
export const pillarKeys: PillarKey[] = pillars.map((p) => p.key);

const byKey = new Map<PillarKey, Pillar>(pillars.map((p) => [p.key, p]));
const bySlug = new Map<PillarSlug, Pillar>(pillars.map((p) => [p.slug, p]));

export function getPillar(key: PillarKey): Pillar {
  const p = byKey.get(key);
  if (!p) throw new Error(`Unknown pillar key: ${key}`);
  return p;
}
export const getPillarBySlug = (slug: string): Pillar | undefined => bySlug.get(slug as PillarSlug);
export const pillarHref = (key: PillarKey): string => `/expertise/${getPillar(key).slug}`;
export const isPillarKey = (v: unknown): v is PillarKey => typeof v === 'string' && byKey.has(v as PillarKey);

/** "01" … "06". */
export const pillarNumber = (p: Pillar): string => String(p.n).padStart(2, '0');

/** The pillars before and after `key` in brief order, wrapping round (01 ← 06, 06 → 01). For the pillar-page pager. */
export function adjacentPillars(key: PillarKey): { prev: Pillar; next: Pillar } {
  const i = pillars.findIndex((p) => p.key === key);
  if (i < 0) throw new Error(`Unknown pillar key: ${key}`);
  const n = pillars.length;
  return { prev: pillars[(i - 1 + n) % n], next: pillars[(i + 1) % n] };
}

