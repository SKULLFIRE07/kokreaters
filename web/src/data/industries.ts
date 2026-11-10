/**
 * Industries (DESIGN-SPEC 4.5; brief 6.3). Pillar links are a COMPOSED mapping (C-10).
 * v3: the /industries cards are text-only on purpose (REDESIGN-V3 §8.9; photos.md has no licensed pet-food photo, and
 * one odd card out would look broken). `image`/`imageAlt` stay in the type for when all nine have one.
 * The page intro (C-15) is drafted from the brief (10 Nov 2026, for approval) and renders in every mode.
 */
import type { Industry } from './types';

export const industries: Industry[] = [
  { n: 1, slug: 'confectionery', name: 'Confectionery', copy: 'Cocoa butter equivalents, filling and coating fats, bloom resistance and cost-in-use for chocolate and sugar confectionery.', pillars: ['innovation', 'process'] },
  { n: 2, slug: 'bakery', name: 'Bakery', copy: 'Shortenings, margarines and laminating fats that perform on the line and in the bite, with lower trans and saturated fat.', pillars: ['innovation', 'process'] },
  { n: 3, slug: 'dairy-nutrition', name: 'Dairy and specialised nutrition', copy: 'Fat systems and contaminant control for infant, medical and adult nutrition, where quality has no margin.', pillars: ['innovation', 'quality'] },
  { n: 4, slug: 'plant-based', name: 'Plant-based', copy: 'Fat functionality that delivers the melt, bite and juiciness consumers expect.', pillars: ['innovation'] },
  { n: 5, slug: 'snacks-food-service', name: 'Snacks and food service', copy: 'Frying oils, stability and cost for high-volume operations.', pillars: ['innovation', 'process'] },
  { n: 6, slug: 'edible-oils-specialty-fats', name: 'Edible oils and specialty fats', copy: 'Refining, fractionation and specialty fats, from crude oil to customer specification.', pillars: ['process', 'quality'] },
  { n: 7, slug: 'personal-care-oleochemicals', name: 'Personal care and oleochemicals', copy: 'Ingredient functionality and manufacturing processes for beauty and oleochemical products.', pillars: ['innovation', 'process'] },
  { n: 8, slug: 'pet-food-animal-nutrition', name: 'Pet food and animal nutrition', copy: 'Product development and process improvement tailored to species-specific needs and regulations.', pillars: ['innovation', 'process'] },
  { n: 9, slug: 'industrial-minerals', name: 'Industrial minerals and process inputs', copy: 'Market entry, feasibility and application know-how for the inputs the oils industry depends on, such as bleaching earths.', pillars: ['strategy'] },
];

export const industriesPage = {
  overline: 'Industries',
  headline: 'Where we work',
  relevantExpertise: 'Relevant expertise',   // COMPOSED (8.3)
  /**
   * v3: the one-paragraph page intro (C-15), DRAFTED 10 Nov 2026 for Ganeaysh's approval
   * (../CONTENT-DRAFTED-FOR-APPROVAL.md). Facts only: the roots in oils and fats and the five functionality words are
   * the Product and Category Innovation intro (brief 6.2.1); the sectors are this list's own names (brief 6.3); "the
   * inputs the oils industry depends on" is industries[8].copy; the count is `industries.length` (keep "nine" in step).
   * It names groups, not all nine cards (the grid right below lists them).
   */
  lead: 'Our roots are in edible oils and specialty fats, so we are at our best where fat functionality decides whether a product succeeds: texture, bloom, shelf life, mouthfeel and cost. That knowledge runs from the refinery into confectionery, bakery, nutrition, plant-based foods and snacks, and on into personal care, pet food and the inputs the oils industry depends on. Each of the nine industries below links to the expertise it draws on most.',
  /** v3: accessible name (visually hidden h2) of the nine-card grid under the hero. */
  listHeading: 'All industries',              // COMPOSED (same wording as the nav's "All industries")
};
