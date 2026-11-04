/** The six pillars (DESIGN-SPEC 4.4; brief 5). Order and slugs are the brief's. */
import type { Pillar } from './types';

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
      'Business–technology alignment plans and technical roadmaps',
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
};

/** Hero node labels, COMPOSED from the pillar names (5.1, 8.3). */
export const heroNodeLabels: Record<Pillar['key'], string> = {
  innovation: 'Product innovation',      // COMPOSED
  process: 'Process design',             // COMPOSED
  quality: 'Food safety and quality',    // COMPOSED
  strategy: 'Strategy and feasibility',  // COMPOSED
  deals: 'Due diligence',                // COMPOSED
  capability: 'Capability',              // COMPOSED
};
