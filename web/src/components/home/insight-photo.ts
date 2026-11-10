/**
 * Card photo for an insight on the home page. The MDX frontmatter `image` / `imageAlt` wins (the Insights builder owns
 * those); until an entry carries one, fall back to the photo research/v3/photos.md maps to that slug ("Insight heroes"),
 * so the home card always matches the article hero. `position` is looked up from src/data/photos.ts when the
 * frontmatter image is one of the stock set.
 */
import type { ImageMetadata } from 'astro';
import { photos, photoList, type PhotoSlug } from '@/data/photos';
import type { Insight } from '@/lib/insights';

/** research/v3/photos.md, "Insight heroes (21:9 desktop, 4:3 mobile) and their cards". */
const PLAN: Record<string, PhotoSlug> = {
  '3-mcpd-glycidyl-esters-playbook': 'refinery-02',
  'trans-fat-elimination-inside-a-plant': 'bakery-02',
  'cocoa-butter-equivalents-india': 'chocolate-01',
  'bleaching-earth': 'oils-02',
  'passing-pre-approval-audit': 'audit-01',
  'refining-palm-oil-minus-25': 'cold-01',
};

export interface InsightPhoto { src: ImageMetadata; alt: string; position?: string }

export function insightPhoto(e: Insight): InsightPhoto | undefined {
  const own = e.data.image;
  if (own) {
    const stock = photoList.find((p) => p.src.src === own.src);
    return { src: own, alt: e.data.imageAlt ?? stock?.alt ?? '', position: stock?.position };
  }
  const slug = PLAN[e.id];
  if (!slug) return undefined;
  const p = photos[slug];
  return { src: p.src, alt: p.alt, position: p.position };
}
