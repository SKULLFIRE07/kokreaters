/**
 * Impact (DESIGN-SPEC 4.6; brief 6.1, 6.5 and the bio).
 * Past results are always "From our founder’s career", never KoKreaters projects (0.2.2).
 * v3 (10 Nov 2026): the three missing `challenge` rows (C-9: india, indonesia, tfa) are DRAFTED for Ganeaysh's approval
 * (../CONTENT-DRAFTED-FOR-APPROVAL.md). Each restates only the case's own facts (homeLine, done, result, longBio[1–2]
 * and the brief's pillar copy): no new number, client, date or claim. A field set to null again → <Confirm id="C-9">
 * in staging, row omitted elsewhere.
 */
import type { Engagement, FounderResult } from './types';
import { minus25 } from '@/lib/typography';

/*
 * Label convention (v3): `context` opens with the first pillar's `shortLabel` (pillars.ts), the same short name every
 * uppercase label on the site uses (InsightCards, article eyebrow); full pillar names appear only in tags and links.
 * `sectors` use the exact industries.ts names, so each tag links to its /industries anchor.
 */
export const founderResults: FounderResult[] = [
  { id: 'india', dateline: 'India · Wilmar',
    homeLine: 'India’s first world-class integrated specialty fats facility, built and activated.',
    emphasis: [],
    context: 'Product · India · From our founder’s career (Wilmar)',
    outcome: 'India’s first world-class integrated specialty fats facility',
    challenge: 'Create integrated specialty fats production in India, where no facility of its kind yet existed.',
    done: 'Built and activated the facility.', result: 'India’s first world-class integrated specialty fats facility.',
    pillars: ['innovation', 'process'], sectors: ['Edible oils and specialty fats'] },
  { id: 'indonesia', dateline: 'Indonesia · Wilmar',
    homeLine: '21% growth in Indonesia by reshaping manufacturing operations.',
    emphasis: ['21%'],
    context: 'Capability · Indonesia · From our founder’s career (Wilmar)',
    outcome: '21% growth in Indonesia',
    challenge: 'Turn manufacturing operations in Indonesia into a source of growth for the business.',
    done: 'Reshaped manufacturing operations.', result: '21% growth.',
    figure: { value: '21%', source: 'From our founder’s career, Wilmar, Indonesia' },
    pillars: ['capability', 'process'], sectors: ['Edible oils and specialty fats'] },
  { id: 'ukraine', dateline: 'Ukraine · Wilmar',
    homeLine: `Ukraine’s first cold-climate crude palm oil refinery, commissioned at ${minus25}, cost structure improved by 15%.`,
    emphasis: [minus25, '15%'],
    context: 'Process · Ukraine · From our founder’s career (Wilmar)',
    outcome: 'Ukraine’s first cold-climate crude palm oil refinery',
    challenge: `Design and build a continuous refinery able to operate in extreme winter conditions, down to ${minus25}.`,
    done: 'Full design-to-execution leadership of the facility, from process design to commissioning.',
    result: 'The first refinery of its kind in Ukraine; overall cost structure improved by 15%.',
    figure: { value: minus25, source: 'From our founder’s career, Wilmar, Ukraine', frost: true },
    pillars: ['process'], sectors: ['Edible oils and specialty fats'] },
  { id: 'tfa', dateline: 'Cargill',
    homeLine: 'Trans-fat (iTFA) elimination work publicly recognised by the WHO Director-General.',
    emphasis: ['WHO'],
    context: 'Food safety · From our founder’s career (Cargill)',
    outcome: 'Trans-fat elimination work recognised by the WHO Director-General',
    challenge: 'Eliminate industrially produced trans fat from oils and fats through reformulation.',
    done: 'Trans-fat (iTFA) elimination work.', result: 'Publicly recognised by the Director-General of the World Health Organization.',
    pillars: ['quality', 'innovation'], sectors: [] },
];

/** The Ukraine case shows a second figure under its result (4.6; brief numbers only, C-9). */
export const secondaryFigures: Partial<Record<FounderResult['id'], string>> = { ukraine: '15%' };

/**
 * v3: the display figure for results that carry no `figure` (was storyNotes/homeNotes/expertiseNotes `indiaFigure`
 * plus the hard-coded 'WHO' in ImpactFold and expertise/[slug]). Derived from the brief ("India's first"; WHO), no new claim.
 */
export const figureFallback: Partial<Record<FounderResult['id'], string>> = { india: '1st', tfa: 'WHO' };

/** KoKreaters engagements, anonymised (brief 6.5). All held as pending (C-12); flip `consent` to 'cleared' to publish. */
export const engagements: Engagement[] = [
  { id: 'eu-minerals', text: 'Feasibility study and business plan for a European industrial-minerals company entering a new market.', consent: 'pending', pillars: ['strategy'] },
  { id: 'in-specialty-audit', text: 'Multinational-customer pre-approval readiness audit for an Indian specialty fats manufacturer.', consent: 'pending', pillars: ['quality'] },
  { id: 'n-india-contaminants', text: 'Contaminant mitigation and portfolio development programme for a North Indian edible oils company.', consent: 'pending', pillars: ['quality', 'innovation'] },
];

export const testimonials: { quote: string; name: string; role: string; permission: true }[] = [];   // CONFIRM 8: render nothing while empty

/** /impact page copy (5.6). */
export const impactPage = {
  overline: 'Impact',
  headline: 'Results that started on the plant floor.',
  lead: `From India’s first integrated specialty fats facility to a refinery at ${minus25}: the results behind KoKreaters.`,   // brief SEO copy
  partOne: 'From our founder’s career',
  partTwo: 'KoKreaters engagements',
  anonymised: 'Anonymised',
  engagementDateline: 'KoKreaters engagement',
  labels: { challenge: 'The challenge', done: 'What was done', result: 'The result' },
  /* v3 labels (10 Nov 2026; plain UI labels, no new facts) */
  recordLabel: 'Track record',                                                        // stat strip heading (the page title is "Impact and Track Record")
  partOneLead: 'Four results from 25\u00A0years at Wilmar and Cargill, before KoKreaters.',  // from founder.ts shortBio + timeline; NBSP binds 25 years
  tagsLabel: 'Related expertise and industries',                                      // aria-label of each case's tag list
  testimonialsLabel: 'Testimonials',
  /** v3.1 photo interlude caption: the Ukraine case's own words ("from process design to commissioning"), no new fact. */
  interludeCaption: 'From process design to commissioning.',                                                  // label-style h2, only if testimonials ever exist (CONFIRM 8)
};

/**
 * v3: one short caption per case figure, so each figure reads on its own (value + label, like the stat strip).
 * Every caption restates the case's own data (homeLine, result, founder.ts longBio); none adds a claim.
 * Keyed by the figure string shown (figure.value, secondaryFigures, figureFallback).
 */
export const figureCaptions: Partial<Record<FounderResult['id'], Record<string, string>>> = {
  india: { '1st': 'of its kind in India' },
  indonesia: { '21%': 'growth' },   // "by reshaping manufacturing operations" is the case's What was done row, said once
  ukraine: { [minus25]: 'operating temperature', '15%': 'improvement in overall cost structure' },
  tfa: { WHO: 'Director-General recognition' },
};
