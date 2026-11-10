/**
 * Site mode (REDESIGN-V3 §6, §8.5). PUBLIC_SITE_MODE = staging | preview | production; unset = staging.
 *
 * | export            | staging | preview | production |
 * |-------------------|---------|---------|------------|
 * | showConfirm       | yes     | no      | no         |  <Confirm> tags
 * | showDraftLabels   | yes     | no      | no         |  "Draft" labels on insights
 * | includeDrafts     | yes     | yes     | no         |  draft / pending insights listed and built
 * | showPendingConsent| yes     | no      | no         |  engagements with consent 'pending'
 * | indexable         | no      | no      | PUBLIC_INDEXABLE=1 only |  robots meta + robots.txt
 */
import { site } from '@/config/site';

export type SiteMode = 'staging' | 'preview' | 'production';
export const mode: SiteMode = site.mode;
export const isStaging: boolean = mode === 'staging';
export const isPreview: boolean = mode === 'preview';
export const isProduction: boolean = mode === 'production';

export const showConfirm: boolean = isStaging;
export const showDraftLabels: boolean = isStaging;
export const includeDrafts: boolean = isStaging || isPreview;
/** Alias used by §6 wording. */
export const showDrafts: boolean = includeDrafts;
/** Client consent: engagements with consent 'pending' render only in staging, never on a shared link. */
export const showPendingConsent: boolean = isStaging;
export const indexable: boolean = site.indexable;

/**
 * The brief's section 11 [CONFIRM] items (ids 1–14), for reference by <Confirm id={n}>.
 * Wording is the brief's own item title. Spec-added ids are C-1 … C-21 (DESIGN-SPEC 8.2).
 */
export const confirmItems: Record<number, string> = {
  1: 'Vector logo files (SVG) and a reversed version',
  2: 'Choose headline option A, B or C',
  3: 'Professional portrait session',
  4: 'Approve founder quote wording',
  5: 'Decide whether to name companies worked with, and get permission for any logos',
  6: 'Client consent for the two anonymised Indian engagements',
  7: 'Confirm CBE and other specialty-fats wording',
  8: 'Two to four testimonials with written permission',
  9: 'Public email address, reply-time promise, booking tool, free first call',
  10: 'Engagement models and durations',
  11: 'Legal entity, KvK, VAT and registered address',
  12: 'Trademark filing status and when ® may be used',
  13: '“Founded in 2026” and career dates',
  14: 'First two Insights drafts',
};
