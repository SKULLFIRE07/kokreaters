/** Industries (DESIGN-SPEC 4.5; brief 6.3). Pillar links are a COMPOSED mapping (C-10). No images until licensed photography exists (graft 13). */
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
};
