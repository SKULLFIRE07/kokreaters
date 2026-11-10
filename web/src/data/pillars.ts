/** The six pillars (DESIGN-SPEC 4.4; brief 5). Order and slugs are the brief's. */
import type { Pillar } from './types';
import type { BleedSafeSlug, PhotoSlug } from './photos';

export const pillars: Pillar[] = [
  {
    key: 'innovation', slug: 'product-innovation', n: 1,
    name: 'Product and Category Innovation',
    promise: 'From unmet need to a product that scales.',
    headline: 'From unmet need to a product that scales.',
    intro: 'We turn consumer and customer needs into clear technical briefs, then into products your plants can make profitably. Our roots are in oils and fats, so we are at our best where fat functionality decides whether a product succeeds: texture, bloom, shelf life, mouthfeel and cost.',
    helpWith: [
      'Specialty fats: cocoa butter equivalents (CBE), confectionery and filling fats, bakery shortenings, margarines and laminating fats', // CONFIRM 7
      'Plant-based, dairy and specialised nutrition applications',
      'Reformulation and renovation: trans-fat elimination, saturated fat reduction, cleaner labels, cost-in-use',
      'Sensory evaluation, consumer insight and foresight',
      'Technical road-mapping and innovation pipelines',
    ],
    deliverables: ['Innovation roadmaps', 'technical briefs', 'formulation and prototype plans', 'lab-to-plant scale-up plans', 'launch support'],
    colourVar: '--pillar-innovation', hex: '#2C509E', inkText: false, impactId: 'india', shortLabel: 'Product',
  },
  {
    key: 'process', slug: 'process-design', n: 2,
    name: 'Process Design and Plant Performance',
    promise: 'Plants that run better, cost less and grow with you.',
    headline: 'Plants that run better, cost less and grow with you.',
    intro: 'We have designed, commissioned and run oils and fats plants in four very different countries, from tropical Indonesia to a refinery operating at −25 °C in Ukraine. We bring that experience to your process, whether you are building new, expanding or fixing what you have.',
    helpWith: [
      'Refining, fractionation, interesterification and blending process design',
      'Greenfield and brownfield projects, commissioning and start-up',
      'Debottlenecking: throughput, yield, utilities and cost',
      'Technology scouting and transfer, including enzymatic processing',
      'Asset-light and tolling models for faster, lower-capital growth',
    ],
    deliverables: ['Process design basis', 'plant assessments', 'debottlenecking plans', 'commissioning support', 'technology transfer packages'],
    colourVar: '--pillar-process', hex: '#5B2A86', inkText: false, impactId: 'ukraine', shortLabel: 'Process',
  },
  {
    key: 'quality', slug: 'food-safety-quality', n: 3,
    name: 'Food Safety, Quality and Contaminants',
    promise: 'Pass the audit. Protect the brand. Stay ahead of the regulation.',
    headline: 'Pass the audit. Protect the brand. Stay ahead of the regulation.',
    intro: 'Certification covers the generic food safety system. Multinational customers look further, at the product- and process-specific risks. With eight years leading FSQR teams at Cargill, we help suppliers see their plant through the auditor’s eyes, and help brand owners understand their suppliers.',
    helpWith: [
      'Process contaminant mitigation: 3-MCPD and glycidyl esters, trans fats, mineral oil hydrocarbons',
      'Plant and supplier audits; readiness for multinational customer pre-approval audits',
      'Building FSQR systems, teams and culture',
      'Packaging-related contaminants, product integrity and shelf life',
      'Regulatory horizon scanning for India and Europe',
    ],
    deliverables: ['Audit reports with photographic evidence', 'gap analyses', 'corrective action plans', 'mitigation programmes', 'training'],
    colourVar: '--pillar-quality', hex: '#C8457E', inkText: false, impactId: 'tfa', shortLabel: 'Food safety',
  },
  {
    key: 'strategy', slug: 'strategy-feasibility', n: 4,
    name: 'Strategy, Feasibility and Market Entry',
    promise: 'Clear answers for Go/No-Go decisions.',
    headline: 'Clear answers for Go/No-Go decisions.',
    intro: 'Before you commit capital, you need to know whether the market is real, whether the technology works and whether the numbers hold. We combine market analysis with technical judgement to give boards and investors a decision they can defend.',
    helpWith: [
      'Market analysis, product-market fit and competitive landscapes',
      'Feasibility studies and business plans for new plants and product lines',
      'Market entry and go-to-market strategy, including India and Asia',
      'Business and technology alignment plans and technical roadmaps',
      'Investor-grade reports and presentations',
    ],
    deliverables: ['Feasibility reports', 'business plans with scenarios', 'market entry strategies', 'investor decks'],
    colourVar: '--pillar-strategy', hex: '#F4C841', inkText: true, shortLabel: 'Strategy',   // impact: none (C-8)
  },
  {
    key: 'deals', slug: 'due-diligence', n: 5,
    name: 'M&A, Due Diligence and Partnerships',
    promise: 'See what is really behind the deal.',
    headline: 'See what is really behind the deal.',
    intro: 'Spreadsheets do not show a tired refinery, a fragile quality system or a technology that will not transfer. We give buyers, investors and partners an independent technical view, then help make the integration work.',
    helpWith: [
      'Technical due diligence of plants, products, R&D and quality systems',
      'Post-acquisition integration planning',
      'Joint ventures, partner and channel selection',
      'Technology licensing and transfer assessments',
    ],
    deliverables: ['Due diligence reports', 'red-flag summaries', 'integration plans', 'partner assessments'],
    colourVar: '--pillar-deals', hex: '#8C5B88', inkText: false, shortLabel: 'Deals',   // impact: none (C-8)
  },
  {
    key: 'capability', slug: 'capability', n: 6,
    name: 'Capability, Leadership and Transformation',
    promise: 'Leave stronger teams behind.',
    headline: 'Leave stronger teams behind.',
    intro: 'Lasting change comes from people. We train technical teams, transfer know-how between sites and coach leaders through growth and change, drawing on experience leading teams across the Americas, EMEA and Asia-Pacific.',
    helpWith: [
      'Technical training: oils and fats, specialty fats, applications, FSQR',
      'Technology transfer and site start-up coaching',
      'Leadership development for technical leaders',
      'Organisation design for R&D, technical services and quality',
      'Interim technical leadership',
    ],
    deliverables: ['Training programmes', 'academies', 'transfer playbooks', 'organisation designs', 'interim roles'],
    colourVar: '--pillar-capability', hex: '#4C9BE8', inkText: true, impactId: 'indonesia', shortLabel: 'Capability',   // C-8
  },
];

/** /expertise overview copy (4.4). */
export const expertiseOverview = {
  overline: 'Expertise',
  headline: 'Expertise that connects science, plants and strategy.',
  intro: 'Most problems in food and ingredients do not respect departmental lines. A texture defect may start in the refinery; an audit failure may start in the business model. Our six areas of expertise are designed to work together.',
  prompt: { text: 'Not sure where you fit?', link: { label: 'Start a conversation', href: '/contact' } },
};

/** Pillar page section headings (brief 5). */
export const pillarPage = {
  helpWith: 'What we help with',
  deliverables: 'Typical deliverables',
  fromTheRecord: 'From our founder’s career',
  /* v3 (REDESIGN-V3 §4 expertise detail) */
  challenge: 'The challenge we solve',
  relatedIndustries: 'Related industries',   // COMPOSED
  previous: 'Previous',                       // COMPOSED (pillar pager)
  next: 'Next',                               // COMPOSED (pillar pager)
};

/** v3: open client questions on a pillar's help list, shown as <Confirm> under the list in staging only. */
export const pillarHelpConfirm: Partial<Record<Pillar['key'], { id: number | string; note: string }>> = {
  innovation: { id: 7, note: 'CBE and specialty-fats wording, item 01' },
};

/**
 * v3.1 (REDESIGN-V3 §9.2 "no image cut"): the photos of each pillar page. Slugs from src/data/photos.ts; alt text and
 * the tuned focal point travel with the photo record.
 *  slug   — the pillar hero (PillarHero: the photo fills the right ≈ 2/3 of the band at full height, box ≈ 1.2–1.5:1,
 *           fading into navy on the left) and the hub index image (3:2): a landscape BLEED_SAFE photo whose subject sits
 *           centre or right. `position` overrides the record's crop for the hero's box.
 *  detail — the framed photo beside "What we help with", in its natural orientation: portraits in a 4:5 frame,
 *           landscapes in a 3:2 frame (so nothing is cut). Was the split-hero photo in v3.0 (lab-01, factory-01 are not
 *           bleed-safe, so they moved here).
 */
export const pillarPhoto: Record<Pillar['key'], { slug: BleedSafeSlug; position?: string; detail: PhotoSlug; detailPosition?: string }> = {
  innovation: { slug: 'chocolate-01', detail: 'bakery-01' },
  process: { slug: 'plant-01', position: '50% 40%', detail: 'cold-01' },
  quality: { slug: 'oils-01', position: '50% 20%', detail: 'lab-02' },
  strategy: { slug: 'oilseeds-01', detail: 'people-03' },
  deals: { slug: 'refinery-02', position: '50% 25%', detail: 'audit-01' },
  capability: { slug: 'people-02', position: '88% 45%', detail: 'factory-01' },
};

/** v3.1: the hub hero (/expertise), a quiet dark full-bleed photo so the display headline carries the screen. */
export const expertiseHubPhoto: { slug: BleedSafeSlug; position?: string } = { slug: 'texture-01' };

/**
 * v3: labels for one quiet static exhibit per pillar page (were expertiseNotes.diagram.*, minus the
 * "scroll, it draws itself" hint). Each is a restatement of that pillar's own brief copy, never a new claim.
 * `steps` read in order; `from` is the label before the first step and `to` the outcome(s) after the last, where the
 * old diagram had them.
 */
export const pillarExhibits: Record<Pillar['key'], { title: string; steps: string[]; from?: string; to?: string[] }> = {
  innovation: { title: 'From unmet need to a product that scales', steps: ['Unmet need', 'Technical brief', 'Prototype', 'Scale-up', 'Launch'] },
  process: { title: 'Crude oil in, customer specification out', from: 'Crude', steps: ['Degumming', 'Bleaching', 'Deodorisation', 'Fractionation', 'Interesterification'], to: ['Spec'] },
  quality: { title: 'Process contaminants, stopped layer by layer', from: 'Risk', steps: ['3-MCPD and GE', 'Trans fats', 'Mineral oil hydrocarbons'], to: ['Your brand'] },
  strategy: { title: 'Three questions before you commit capital', from: 'Your idea', steps: ['Is the market real?', 'Does the technology work?', 'Do the numbers hold?'], to: ['Go', 'No-Go'] },
  deals: { title: 'What the spreadsheet shows, and what it does not', from: 'What the spreadsheet shows', steps: ['A tired refinery', 'A fragile quality system', 'A technology that will not transfer'] },
  capability: { title: 'Train, transfer, coach: stronger teams', steps: ['Train', 'Transfer', 'Coach'], to: ['Stronger teams'] },
};

