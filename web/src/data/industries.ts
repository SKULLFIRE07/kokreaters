/**
 * Industries. v4 Delft (developer guide, 20 Nov 2026): six featured industries, each with a client photo, in the guide's
 * order (agri and oilseeds; edible oils and specialty fats; feed and animal nutrition; bakery and food service; cocoa,
 * chocolate and confectionery; nutrition and specialty ingredients), "plus the rest as a text line" (`otherIndustries`).
 * `industries` stays the full list (featured first), so nav menus and the /industries#<slug> anchors keep working.
 * Copy: the v3 lines where the industry existed (brief 6.3). COMPOSED for Ganeaysh's approval (no new facts, phrases
 * re-used from the v3 copy and pillars.ts): agri and oilseeds; nutrition and specialty ingredients; the food-service
 * clause of bakery (from the v3 snacks line); "feed" in the animal-nutrition line. Pillar links are COMPOSED (C-10).
 */
import type { Industry, PillarKey } from './types';
import type { PhotoSlug } from './photos';

export const featuredIndustries: Industry[] = [
  { n: 1, slug: 'agri-oilseeds', name: 'Agri and oilseeds', copy: 'Feasibility, market entry and process know-how for agri and oilseed businesses, from raw material to crude oil.', pillars: ['strategy', 'process'] },
  { n: 2, slug: 'edible-oils-specialty-fats', name: 'Edible oils and specialty fats', copy: 'Refining, fractionation and specialty fats, from crude oil to customer specification.', pillars: ['process', 'quality'] },
  { n: 3, slug: 'feed-animal-nutrition', name: 'Feed and animal nutrition', copy: 'Product development and process improvement for feed and pet food, tailored to species-specific needs and regulations.', pillars: ['innovation', 'process'] },
  { n: 4, slug: 'bakery-food-service', name: 'Bakery and food service', copy: 'Shortenings, margarines and laminating fats that perform on the line and in the bite, with lower trans and saturated fat, and frying oils for high-volume operations.', pillars: ['innovation', 'process'] },
  { n: 5, slug: 'cocoa-chocolate-confectionery', name: 'Cocoa, chocolate and confectionery', copy: 'Cocoa butter equivalents, filling and coating fats, bloom resistance and cost-in-use for chocolate and sugar confectionery.', pillars: ['innovation', 'process'] },
  { n: 6, slug: 'nutrition-specialty-ingredients', name: 'Nutrition and specialty ingredients', copy: 'Ingredient functionality, contaminant control and regulatory know-how for nutrition and specialty-ingredient businesses.', pillars: ['innovation', 'quality'] },
];

/** The rest, shown as a text line on home and as a compact list on /industries (v3 copy). */
export const otherIndustries: Industry[] = [
  { n: 7, slug: 'dairy-nutrition', name: 'Dairy and specialised nutrition', copy: 'Fat systems and contaminant control for infant, medical and adult nutrition, where quality has no margin.', pillars: ['innovation', 'quality'] },
  { n: 8, slug: 'plant-based', name: 'Plant-based', copy: 'Fat functionality that delivers the melt, bite and juiciness consumers expect.', pillars: ['innovation'] },
  { n: 9, slug: 'snacks', name: 'Snacks', copy: 'Frying oils, stability and cost for high-volume operations.', pillars: ['innovation', 'process'] },
  { n: 10, slug: 'personal-care-oleochemicals', name: 'Personal care and oleochemicals', copy: 'Ingredient functionality and manufacturing processes for beauty and oleochemical products.', pillars: ['innovation', 'process'] },
  { n: 11, slug: 'industrial-minerals', name: 'Industrial minerals and process inputs', copy: 'Market entry, feasibility and application know-how for the inputs the oils industry depends on, such as bleaching earths.', pillars: ['strategy'] },
];

export const industries: Industry[] = [...featuredIndustries, ...otherIndustries];

/** Photo of each featured industry (guide's photo list). Slugs from src/data/photos.ts. */
export const industryPhoto: Record<string, PhotoSlug> = {
  'agri-oilseeds': 'agri-fields',
  'edible-oils-specialty-fats': 'oils-pour',
  'feed-animal-nutrition': 'feed-silos',
  'bakery-food-service': 'bakery-dough',
  'cocoa-chocolate-confectionery': 'cocoa-pods',
  'nutrition-specialty-ingredients': 'nutrition-spices',
};

export const industriesByPillar = (k: PillarKey): Industry[] => industries.filter((i) => i.pillars.includes(k));

export const industriesPage = {
  overline: 'Industries',
  headline: 'Where we work',
  relevantExpertise: 'Relevant expertise',   // COMPOSED (8.3)
  /**
   * Page intro (C-15, v3 approved wording, v4 sector list). Facts only: the roots in oils and fats and the five
   * functionality words are the Product development intro; the sectors are this list's own names.
   */
  lead: 'Our roots are in edible oils and specialty fats, so we are at our best where fat functionality decides whether a product succeeds: texture, bloom, shelf life, mouthfeel and cost. That knowledge runs from agri and oilseeds through oils, feed, bakery, chocolate and nutrition, and on into personal care and the inputs the oils industry depends on. Each industry below links to the expertise it draws on most.',
  /** accessible / visible name of the featured grid */
  listHeading: 'Six industries at our core',   // COMPOSED (UI label)
  /** the text line for the rest (home) and the h2 of the compact list (/industries) */
  otherLabel: 'Also',                          // design file, 20 Nov 2026
  otherHeading: 'Also where we work',          // COMPOSED (UI label)
};
