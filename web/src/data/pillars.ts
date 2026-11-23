/** The six services. v4 (developer guide 20 Nov 2026): names, home lines (`promise`) and order follow Ganeaysh's list;
 * keys stay stable. */
import type { Pillar } from './types';
import type { PhotoSlug } from './photos';
import { careerFootnote } from './career';

export const pillars: Pillar[] = [
  {
    key: 'innovation', slug: 'product-innovation', n: 1,
    name: 'Product development',
    promise: 'New foods and reformulation, from whipped toppings and bakery to chocolate, snacks and sauces. Bench to launch, with cost-in-use.',
    headline: 'From unmet need to a product that scales.',
    intro: 'We turn consumer and customer needs into clear technical briefs, then into products your plants can make profitably. Our roots are in specialty ingredients, so we are at our best where ingredient functionality decides whether a product succeeds: taste, texture, stability, shelf life and cost.',
    helpWith: [
      'New foods for finished products: whipped toppings and creams, bakery and patisserie, chocolate and confectionery, snacks, sauces and beverages',
      'Reformulation and renovation: sugar, salt, trans-fat and saturated-fat reduction, cleaner labels, cost-in-use',
      'Plant-based, dairy-alternative and specialised nutrition applications, feed and pet food',
      'Specialty ingredients and fats: cocoa butter equivalents (CBE), filling fats, bakery shortenings, margarines and laminating fats',
      'Sensory evaluation, consumer insight and foresight',
      'Technical road-mapping and innovation pipelines',
    ],
    deliverables: ['Innovation roadmaps', 'technical briefs', 'formulation and prototype plans', 'lab-to-plant scale-up plans', 'launch support'],
    colourVar: '--pillar-innovation', hex: '#2C509E', inkText: false, impactId: 'story-india', shortLabel: 'Product',
    audience: 'For R&D heads and business owners who need products that sell and plants that can make them.',   // COMPOSED
    engagement: 'Defined project, stage by stage from brief to launch',                                         // COMPOSED
    offer: { title: 'Book a product and cost-in-use review', line: 'One product, one plant: where the recipe, the ingredient system and the cost can improve.' },   // COMPOSED
  },
  {
    key: 'process', slug: 'process-design', n: 2,
    name: 'Process development and plant performance',
    promise: 'Design, debottleneck and run plants that cost less and deliver more.',
    headline: 'Plants that run better, cost less and grow with you.',
    intro: 'We have designed, commissioned and run food and ingredient plants in four very different countries, from tropical Indonesia to a refinery operating at −25 °C in Ukraine. We bring that experience to your process, whether you are building new, expanding or fixing what you have.',
    helpWith: [
      'Refining, fractionation, interesterification and blending process design',
      'Greenfield and brownfield projects, commissioning and start-up',
      'Debottlenecking: throughput, yield, utilities and cost',
      'Technology scouting and transfer, including enzymatic processing',
      'Asset-light and tolling models for faster, lower-capital growth',
    ],
    deliverables: ['Process design basis', 'plant assessments', 'debottlenecking plans', 'commissioning support', 'technology transfer packages'],
    colourVar: '--pillar-process', hex: '#5B2A86', inkText: false, impactId: 'story-ukraine', shortLabel: 'Process',
    audience: 'For plant heads and operations directors building, expanding or fixing a plant.',   // COMPOSED
    engagement: 'Diagnostic sprint',
    offer: { title: 'Book a diagnostic sprint', line: 'A site visit, your data and process reviewed, and a prioritised roadmap with the value at stake.' },
  },
  {
    key: 'strategy', slug: 'strategy-feasibility', n: 3,
    name: 'Market access and strategy',
    promise: 'Feasibility, market entry and clear Go/No-Go decisions, grounded in plant reality.',
    headline: 'Clear Go/No-Go decisions, and a clear route to market.',
    intro: 'Before you commit capital, you need to know whether the market is real, whether the technology works and whether the numbers hold. We combine market analysis with technical judgement to give boards and investors a decision they can defend, and a route to market they can follow.',
    helpWith: [
      'Market entry and go-to-market strategy, including India and Asia',
      'Market analysis, product-market fit and competitive landscapes',
      'Feasibility studies and business plans for new plants and product lines',
      'Business and technology alignment plans and technical roadmaps',
      'Investor-grade reports and presentations, including for mineral and ingredient companies',   // pack 3 brief
    ],
    deliverables: ['Market entry strategies', 'feasibility reports', 'business plans with scenarios', 'investor decks'],
    colourVar: '--pillar-strategy', hex: '#F4C841', inkText: true, impactId: 'story-asset-light', shortLabel: 'Market access',
    audience: 'For owners, boards and investors deciding where to commit capital.',   // COMPOSED
    engagement: 'Feasibility study as a defined project, with a Go/No-Go gate',      // COMPOSED
    offer: { title: 'Get a Go/No-Go assessment', line: 'Market, technology and numbers tested before you commit capital.' },   // COMPOSED (the page's three questions)
  },
  {
    key: 'quality', slug: 'food-safety-quality', n: 4,
    name: 'Food safety, quality and regulatory',
    promise: 'Process contaminants, audits and compliance, solved at the source.',
    headline: 'Pass the audit. Protect the brand. Stay ahead of the regulation.',
    intro: 'Certification covers the generic food safety system. Multinational customers look further, at the product- and process-specific risks. With eight years leading FSQR teams at one of the world’s largest agri-food companies, we help suppliers see their plant through the auditor’s eyes, and help brand owners understand their suppliers.',
    helpWith: [
      'Process contaminant mitigation: 3-MCPD and glycidyl esters, trans fats, mineral oil hydrocarbons',
      'Multinational customer audit readiness: plant and supplier audits before the customer’s pre-approval audit',   // pack 3 brief: named offer
      'EUDR and sustainability compliance for palm, soy and cocoa supply chains',   // pack 3 brief
      'Building FSQR systems, teams and culture',
      'Packaging-related contaminants, product integrity and shelf life',
      'Regulatory horizon scanning for India and Europe',
    ],
    deliverables: ['Audit reports with photographic evidence', 'gap analyses', 'corrective action plans', 'mitigation programmes', 'training'],
    colourVar: '--pillar-quality', hex: '#C8457E', inkText: false, impactId: 'story-who', shortLabel: 'Food safety',
    audience: 'For quality heads, suppliers and brand owners facing customer audits and tighter limits.',   // COMPOSED
    engagement: 'Diagnostic sprint, on site',                                                              // V6 brief
    offer: { title: 'Get a contaminant risk review', line: 'Your raw materials, process and packaging checked for 3-MCPD, GE, trans fats and mineral oils.' },   // brief offer; line COMPOSED from the help list
  },
  {
    key: 'deals', slug: 'due-diligence', n: 5,
    name: 'Deals, due diligence and partnerships',
    promise: 'See what is really behind an asset, a partner or a technology.',
    headline: 'See what is really behind the deal.',
    intro: 'Spreadsheets do not show a tired refinery, a fragile quality system or a technology that will not transfer. We give buyers, investors and partners an independent technical view, then help make the integration work.',
    helpWith: [
      'Technical due diligence of plants, products, R&D and quality systems',
      'Post-acquisition integration planning',
      'Joint ventures, partner and channel selection',
      'Technology licensing and transfer assessments',
    ],
    deliverables: ['Due diligence reports', 'red-flag summaries', 'integration plans', 'partner assessments'],
    colourVar: '--pillar-deals', hex: '#8C5B88', inkText: false, impactId: 'story-deals', shortLabel: 'Deals',
    audience: 'For investors, acquirers and lenders who need a technical view before they sign.',   // COMPOSED
    engagement: 'Expert review, timed to your deal',                                               // COMPOSED (engage item 4)
    offer: { title: 'Commission a red-flag review', line: 'An independent technical view of the asset, as a one-page red-flag summary, before you sign.' },   // COMPOSED
  },
  {
    key: 'capability', slug: 'technology-leadership', n: 6,
    name: 'Technology and innovation leadership',
    promise: 'Senior technical and innovation leadership for your business, built around the outcomes you need.',
    headline: 'Senior technical and innovation leadership for your business, built around the outcomes you need.',
    intro: 'Not every business needs a full-time CTO or Head of R&D, but every growing one needs that judgement. We work alongside your leadership team as a long-term partner: we shape the technical and innovation agenda with your team, steer R&D and advise the board. And because lasting change comes from people, we train your technical teams, transfer know-how between sites and coach leaders through growth and change, drawing on experience leading teams across the Americas, EMEA and Asia-Pacific.',
    helpWith: [
      'Technology and innovation leadership: the senior judgement of a CTO, technical director or Head of R&D, as a long-term partner',
      'R&D steering, board advisory and ongoing technical counsel',
      'Organisation design for R&D, technical services and quality',
      'Technical training: ingredients and applications, processing, FSQR',
      'Technology transfer and site start-up coaching',
      'Leadership development for technical leaders',
    ],
    deliverables: ['Technical and innovation leadership', 'R&D steering', 'organisation designs', 'training programmes and academies', 'transfer playbooks'],
    colourVar: '--pillar-capability', hex: '#4C9BE8', inkText: true, impactId: 'story-product-design', shortLabel: 'Technology leadership',
    audience: 'For owners and CEOs who need senior technical judgement without a full-time hire.',   // COMPOSED
    engagement: 'Long-term partnership',
    offer: { title: 'Scope a long-term partnership', line: 'The agenda, the outcomes and the reporting agreed in one conversation.' },
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
  fromTheRecord: 'From the record',          // pack 3: no "founder's career" lines (brief "Stop the site sounding new")
  /** pack 3: the one footnote per page (career.ts `careerFootnote`); kept as an alias for older imports. */
  proofSource: careerFootnote,
  audience: 'Who it is for',                  // COMPOSED (UI label)
  engagement: 'Typical engagement',           // brief wording
  offerLabel: 'Our offer',                    // COMPOSED (UI label)
  quoteLabel: 'In their words',               // COMPOSED (UI label)
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
 * v4 Delft: the photos of each pillar page (client photo set of 20 Nov 2026 plus the v3 food shots; no refinery).
 * v3.1 (REDESIGN-V3 §9.2 "no image cut"): the photos of each pillar page. Slugs from src/data/photos.ts; alt text and
 * the tuned focal point travel with the photo record.
 *  slug   — the pillar hero (PillarHero: the photo fills the right ≈ 2/3 of the band at full height, box ≈ 1.2–1.5:1,
 *           fading into navy on the left) and the hub index image (3:2): a landscape BLEED_SAFE photo whose subject sits
 *           centre or right. `position` overrides the record's crop for the hero's box.
 *  detail — the framed photo beside "What we help with", in its natural orientation: portraits in a 4:5 frame,
 *           landscapes in a 3:2 frame (so nothing is cut). Was the split-hero photo in v3.0 (lab-01, factory-01 are not
 *           bleed-safe, so they moved here).
 */
export const pillarPhoto: Record<Pillar['key'], { slug: PhotoSlug; position?: string; detail: PhotoSlug; detailPosition?: string }> = {
  innovation: { slug: 'chocolate-01', position: '60% 50%', detail: 'develop-pipette' },
  process: { slug: 'spare-hall', position: '50% 55%', detail: 'scale-tanks' },
  strategy: { slug: 'access-ship', position: '50% 50%', detail: 'people-03' },
  quality: { slug: 'oils-01', position: '50% 30%', detail: 'lab-02' },
  deals: { slug: 'feed-silos', position: '50% 40%', detail: 'audit-01' },
  capability: { slug: 'people-01', position: '50% 70%', detail: 'factory-01' },
};

/** v4: the hub hero (/expertise): ripe wheat against a deep blue sky (client photo set, 20 Nov 2026). */
export const expertiseHubPhoto: { slug: PhotoSlug; position?: string } = { slug: 'spare-wheat', position: '50% 40%' };

/**
 * v3: labels for one quiet static exhibit per pillar page (were expertiseNotes.diagram.*, minus the
 * "scroll, it draws itself" hint). Each is a restatement of that pillar's own brief copy, never a new claim.
 * `steps` read in order; `from` is the label before the first step and `to` the outcome(s) after the last, where the
 * old diagram had them.
 */
export const pillarExhibits: Record<Pillar['key'], { title: string; steps: string[]; from?: string; to?: string[] }> = {
  innovation: { title: 'From unmet need to a product that scales', steps: ['Unmet need', 'Technical brief', 'Prototype', 'Scale-up', 'Launch'] },
  process: { title: 'Oilseed in, customer specification out', from: 'Oilseed crushing', steps: ['Crude', 'Degumming', 'Bleaching', 'Deodorisation', 'Fractionation', 'Interesterification'], to: ['Spec'] },
  quality: { title: 'Process contaminants, stopped layer by layer', from: 'Risk', steps: ['3-MCPD and GE', 'Trans fats', 'Mineral oil hydrocarbons'], to: ['Your brand'] },
  strategy: { title: 'Three questions before you commit capital', from: 'Your idea', steps: ['Is the market real?', 'Does the technology work?', 'Do the numbers hold?'], to: ['Go', 'No-Go'] },
  deals: { title: 'What the spreadsheet shows, and what it does not', from: 'What the spreadsheet shows', steps: ['A tired refinery', 'A fragile quality system', 'A technology that will not transfer'] },
  capability: { title: 'Lead, then leave stronger teams behind', steps: ['Lead', 'Train', 'Transfer', 'Coach'], to: ['Stronger teams'] },
};


/* ───────────────────────── pack 3 (Ganeaysh's v3 review, 20 Nov 2026): per-page additions ───────────────────────── */

/**
 * Process development: the refining strip gains oilseed crushing (first step, in pillarExhibits.process) and enzymatic
 * processing (an option on degumming and interesterification), plus one capacity figure from career.ts.
 */
export const processStrip = {
  enzymatic: { steps: ['Degumming', 'Interesterification'], note: 'Enzymatic processing: an option at degumming and interesterification' },   // pack 3 brief
  figureId: 'refinery',          // career.ts: 500 t/day, largest single refinery designed and commissioned (draft)
};

/**
 * Market access: the Go/No-Go flow as a drawn diagram (brief: "rather than a numbered list"). The same chain as
 * pillarExhibits.strategy; each gate also says what "no" leads to, so the diagram reads as a decision, not a list.
 */
export const goNoGo = {
  title: 'Three gates before you commit capital',            // COMPOSED (from pillarExhibits.strategy)
  start: 'Your idea',
  gates: [
    { q: 'Is the market real?', yes: 'Demand, price and customers confirmed', no: 'Rethink the market' },          // COMPOSED short labels
    { q: 'Does the technology work?', yes: 'Process and product proven at scale', no: 'Adapt the technology' },
    { q: 'Do the numbers hold?', yes: 'Capex, margins and payback hold up', no: 'Rework the business case' },
  ],
  go: 'Go: a route to market you can follow',
  noGo: 'No-Go: capital kept for a better bet',
  caption: 'Each gate is tested with market data, plant reality and the numbers; you decide at each one whether to continue.',
};

/** Deals: "What we look at" (brief: assets, process, quality system, people, technology, capex). One short line each. COMPOSED. */
export const dealChecklist = {
  title: 'What we look at',
  items: [
    { key: 'assets', name: 'Assets', line: 'Condition, capacity and remaining life of the plant.' },
    { key: 'process', name: 'Process', line: 'Yields, losses and bottlenecks against the business plan.' },
    { key: 'quality', name: 'Quality system', line: 'Audit history, open findings and customer approvals.' },
    { key: 'people', name: 'People', line: 'Key technical roles, depth and retention risk.' },
    { key: 'technology', name: 'Technology', line: 'Know-how, licences and whether they transfer.' },
    { key: 'capex', name: 'Capex', line: 'Deferred maintenance and the upgrades the plan needs.' },
  ],
} as const;

/**
 * Deals: a sample red-flag summary (brief: "a sample red-flag summary layout"). Neutral example rows, clearly
 * labelled "Example layout": they show the shape of the deliverable, not a real finding. COMPOSED.
 */
export const redFlagSample = {
  title: 'A red-flag summary, on one page',
  badge: 'Example layout',
  note: 'Illustrative rows only, not findings from any engagement.',
  columns: { area: 'Area', finding: 'Finding', rating: 'Rating', action: 'Before signing' },
  ratings: { high: 'High', medium: 'Medium', low: 'Low' },
  rows: [
    { area: 'Assets', finding: 'Bleaching section near the end of its life', rating: 'high', action: 'Price the replacement into the offer' },
    { area: 'Quality system', finding: 'Two open findings from the last customer audit', rating: 'medium', action: 'Agree a close-out plan with the seller' },
    { area: 'Process', finding: 'Yields in line with the business plan', rating: 'low', action: 'None' },
    { area: 'People', finding: 'Process know-how held by one shift leader', rating: 'medium', action: 'Retention terms for key staff' },
  ],
} as const;

/** Technology and innovation leadership: how it works in practice (V6 brief Table 5 R5). */
export const leadershipInPractice = {
  title: 'How it works in practice',
  items: [
    { key: 'agenda', label: 'The agenda', value: 'Agreed up front', line: 'The outcomes and milestones that matter to your business.' },
    { key: 'working', label: 'The way of working', value: 'On site and remote', line: 'Set around your priorities.' },
    { key: 'board', label: 'The board receives', value: 'A regular report', line: 'Progress, technical risks and the decisions needed.' },
  ],
} as const;

/**
 * One short client or colleague quote per service page (brief: "where available"). Empty until real quotes with
 * permission arrive; staging shows the slot with a <Confirm>, preview and production render nothing.
 */
export const pillarQuotes: Partial<Record<Pillar['key'], { quote: string; name: string; role: string }>> = {};
