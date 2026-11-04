/**
 * Site mode (DESIGN-SPEC 0.3). `staging` is the default when PUBLIC_SITE_MODE is unset.
 */
import { site } from '@/config/site';

export type SiteMode = 'staging' | 'production';
export const mode: SiteMode = site.mode;
export const isStaging: boolean = mode === 'staging';
export const isProduction: boolean = !isStaging;

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
