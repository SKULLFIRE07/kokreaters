/**
 * Titles and descriptions (DESIGN-SPEC 3.8). Brief section 8 strings are verbatim;
 * rows marked COMPOSED are written from brief copy because the brief gives none for those pages.
 * Limits (title ≤ 60, description ≤ 155) are asserted in `src/lib/seo.ts`; `home` is exempt (client copy, pack 2 item 39).
 * Pack 3 (lead decision 6): one link-preview image for every page (OG_IMAGE in src/lib/seo.ts); `og` keys are unused.
 */
import type { PillarSlug } from './types';

export type SeoKey =
  | 'home' | 'expertise' | 'approach' | 'impact' | 'insights' | 'about' | 'contact' | 'industries'
  | PillarSlug | 'privacy' | 'cookies' | 'terms' | 'notfound';

export interface SeoEntry { title: string; description: string; path: string; og?: string; noindex?: boolean; composed?: true; }

export const seo: Record<SeoKey, SeoEntry> = {
  /** V6 brief: positioning across agri-food, feed, nutrition and specialty ingredients. */
  home: { path: '/', title: 'KoKreaters | Agri-Food, Feed, Nutrition and Specialty Ingredients Consulting', description: 'Agri-food, feed, nutrition and specialty ingredients consulting, from product formulation to plant performance and market access. Based in the Netherlands, working worldwide.' },
  expertise: { path: '/expertise', title: 'Expertise | Product, Process, Quality, Strategy | KoKreaters', description: 'Six connected areas of expertise: innovation, process design, food safety and contaminants, feasibility, due diligence and capability building.' },
  approach: { path: '/approach', title: 'Our Approach: Connect, Collaborate, Create | KoKreaters', description: 'We create with you, not for you. See how KoKreaters works and the ways you can engage us, from audits to advisory retainers.' },
  impact: { path: '/impact', title: 'Impact and Track Record | KoKreaters', description: 'From India’s first integrated specialty fats facility to a refinery at −25 °C: the results behind KoKreaters.' },
  insights: { path: '/insights', title: 'Insights on Food, Feed and Specialty Ingredients | KoKreaters', description: 'Points of view and field notes on food and ingredient development, processing, food safety, audits and growth.' },
  about: { path: '/about', title: 'About Ganeaysh Kulkarni, Founder | KoKreaters', description: 'Food technologist and former Cargill and Wilmar technical leader. Founder of KoKreaters, based in the Netherlands, working worldwide.' },
  contact: { path: '/contact', title: 'Contact KoKreaters | Start a Conversation', description: 'Tell us about your product, plant or decision. We typically reply within two working days.' },
  industries: { composed: true, path: '/industries', title: 'Industries We Work In | KoKreaters', description: 'Consulting for agri-food, feed, nutrition, specialty ingredients, bakery, chocolate, dairy alternatives and food and beverage products.' },
  'product-innovation': { composed: true, path: '/expertise/product-innovation', title: 'Product development | KoKreaters', description: 'From unmet need to a product that scales: specialty fats, reformulation, plant-based and nutrition applications, and lab-to-plant scale-up.' },
  'process-design': { composed: true, path: '/expertise/process-design', title: 'Process development and plant performance | KoKreaters', description: 'Plants that run better, cost less and grow with you: refining, fractionation, interesterification, commissioning and debottlenecking.' },
  'food-safety-quality': { composed: true, path: '/expertise/food-safety-quality', title: 'Food safety, quality and regulatory | KoKreaters', description: 'Pass the audit. Protect the brand. 3-MCPD and glycidyl esters, trans fats, mineral oil hydrocarbons, supplier audits and FSQR systems.' },
  'strategy-feasibility': { composed: true, path: '/expertise/strategy-feasibility', title: 'Market access and strategy | KoKreaters', description: 'Clear Go/No-Go decisions grounded in plant reality: market analysis, feasibility studies, business plans and market entry, including India and Asia.' },
  'due-diligence': { composed: true, path: '/expertise/due-diligence', title: 'Deals, due diligence and partnerships | KoKreaters', description: 'See what is really behind the deal: technical due diligence of plants, products, R&D and quality systems, and post-acquisition integration.' },
  'technology-leadership': { composed: true, path: '/expertise/technology-leadership', title: 'Technology and innovation leadership | KoKreaters', description: 'Senior technical and innovation leadership for your business, built around the outcomes you need, plus training, technology transfer and coaching.' },
  privacy: { composed: true, path: '/privacy', title: 'Privacy policy | KoKreaters', description: 'How KoKreaters collects, uses and protects personal data.' },
  cookies: { composed: true, path: '/cookies', title: 'Cookie policy | KoKreaters', description: 'Which cookies and browser storage the KoKreaters website uses, and how to control them.' },
  terms: { composed: true, path: '/terms', title: 'Terms of use | KoKreaters', description: 'The terms that apply when you use the KoKreaters website.' },
  notfound: { path: '/404', noindex: true, title: 'Page not found | KoKreaters', description: 'This page hasn’t been created yet. Let’s connect you back.' },
};

/** Pack 3: null, every article shares the one link-preview image (OG_IMAGE in src/lib/seo.ts). */
export const articleOgPattern: string | null = null;
