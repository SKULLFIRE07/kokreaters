/** Pillar lookups and the CSS custom properties BaseLayout puts on <body> (DESIGN-SPEC 3.1). */
import { pillars } from '@/data/pillars';
import type { GroundKey, Pillar, PillarKey, PillarSlug } from '@/data/types';

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

/** `--pillar`, `--pillar-tint`, `--pillar-text` for a pillar, as a style object and as a string. */
export function pillarVars(key: PillarKey): Record<string, string> {
  return {
    '--pillar': `var(--pillar-${key})`,
    '--pillar-tint': `var(--pillar-${key}-tint)`,
    '--pillar-text': `var(--pillar-${key}-text)`,
  };
}
export const pillarStyle = (key: PillarKey): string =>
  Object.entries(pillarVars(key)).map(([k, v]) => `${k}: ${v}`).join('; ');

/** "01" … "06". */
export const pillarNumber = (p: Pillar): string => String(p.n).padStart(2, '0');

/** v2 (3.2): the colour-block ground for a pillar, and the tint ground for its lighter surfaces. */
const GROUND: Record<PillarKey, GroundKey> = { innovation: 'sapphire', process: 'violet', quality: 'orchid', strategy: 'saffron', deals: 'mauve', capability: 'sky' };
const TINT: Record<PillarKey, GroundKey> = { innovation: 'ice', process: 'lavender', quality: 'blush', strategy: 'butter', deals: 'blush', capability: 'ice' };
export const pillarGround = (key: PillarKey): GroundKey => GROUND[key];
export const pillarTintGround = (key: PillarKey): GroundKey => TINT[key];
