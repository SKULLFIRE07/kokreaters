/**
 * Impact (DESIGN-SPEC 4.6; brief 6.1, 6.5 and the bio).
 * Past results are always "From our founder’s career", never KoKreaters projects (0.2.2).
 * Fields the brief does not supply are null → <Confirm id="C-9" note="case detail"> in staging. Nothing is written into them.
 */
import type { Engagement, FounderResult } from './types';
import { minus25 } from '@/lib/typography';

export const founderResults: FounderResult[] = [
  { id: 'india', dateline: 'India · Wilmar',
    homeLine: 'India’s first world-class integrated specialty fats facility, built and activated.',
    emphasis: [],
    context: 'Product and category innovation · India · From our founder’s career (Wilmar)',
    outcome: 'India’s first world-class integrated specialty fats facility',
    challenge: null, done: 'Built and activated the facility.', result: 'India’s first world-class integrated specialty fats facility.',
    pillars: ['innovation', 'process'], sectors: ['Edible oils and specialty fats'] },
  { id: 'indonesia', dateline: 'Indonesia · Wilmar',
    homeLine: '21% growth in Indonesia by reshaping manufacturing operations.',
    emphasis: ['21%'],
    context: 'Capability and transformation · Indonesia · From our founder’s career (Wilmar)',
    outcome: '21% growth in Indonesia',
    challenge: null, done: 'Reshaped manufacturing operations.', result: '21% growth.',
    figure: { value: '21%', source: 'From our founder’s career, Wilmar, Indonesia' },
    pillars: ['capability', 'process'], sectors: ['Edible oils and specialty fats'] },
  { id: 'ukraine', dateline: 'Ukraine · Wilmar',
    homeLine: `Ukraine’s first cold-climate crude palm oil refinery, commissioned at ${minus25}, cost structure improved by 15%.`,
    emphasis: [minus25, '15%'],
    context: 'Process design · Ukraine · From our founder’s career (Wilmar)',
    outcome: 'Ukraine’s first cold-climate crude palm oil refinery',
    challenge: `Design and build a continuous refinery able to operate in extreme winter conditions, down to ${minus25}.`,
    done: 'Full design-to-execution leadership of the facility, from process design to commissioning.',
    result: 'The first refinery of its kind in Ukraine; overall cost structure improved by 15%.',
    figure: { value: minus25, source: 'From our founder’s career, Wilmar, Ukraine', frost: true },
    pillars: ['process'], sectors: ['Edible oils'] },
  { id: 'tfa', dateline: 'Cargill',
    homeLine: 'Trans-fat (iTFA) elimination work publicly recognised by the WHO Director-General.',
    emphasis: ['WHO'],
    context: 'Food safety and reformulation · From our founder’s career (Cargill)',
    outcome: 'Trans-fat elimination work recognised by the WHO Director-General',
    challenge: null, done: 'Trans-fat (iTFA) elimination work.', result: 'Publicly recognised by the Director-General of the World Health Organization.',
    pillars: ['quality', 'innovation'], sectors: [] },
];

/** The Ukraine case shows a second figure under its result (4.6; brief numbers only, C-9). */
export const secondaryFigures: Partial<Record<FounderResult['id'], string>> = { ukraine: '15%' };

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
};
