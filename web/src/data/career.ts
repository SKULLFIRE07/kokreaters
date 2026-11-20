/**
 * Pack 3 (Ganeaysh's v3 review, 20 Nov 2026): career figures, founder titles, credentials and languages, shared by
 * Home (CHROME-HOME), About (PEOPLE-CONTENT) and Impact (STORY).
 *
 * The six scale figures are DRAFT (brief "Make 25 years felt" point 3): Ganeaysh confirms or corrects each one before
 * launch. Edit `value` / `unit` / `label` here and set `status: 'confirmed'`. Drafts render in staging and preview
 * (where he reviews them) and never in production. No counting animation on any figure (lead decision 1).
 */
import { mode } from '@/lib/mode';

export type FigureStatus = 'draft' | 'confirmed';

/** A big number: `value` set in Bodoni lining figures, `unit` in Manrope beside it, `label` under it. */
export interface CareerFigure {
  id: string;
  value: string;
  unit?: string;
  label: string;
  status: FigureStatus;
}

/** Drafts show in staging and preview; production shows only confirmed figures. */
export const showDraftFigures: boolean = mode !== 'production';
export const isVisible = (f: { status: FigureStatus }): boolean => f.status === 'confirmed' || showDraftFigures;
export const visible = <T extends { status: FigureStatus }>(items: readonly T[]): T[] => items.filter(isVisible);

/** The brief's six figures, in its order (#1–#6), labels verbatim. */
export const careerFigures: CareerFigure[] = [
  { id: 'capacity', value: '3,000', unit: 't/day', label: 'processing and refining capacity led across sites', status: 'draft' },
  { id: 'refinery', value: '500', unit: 't/day', label: 'largest single refinery designed and commissioned', status: 'draft' },
  { id: 'specialty', value: '100', unit: 't/day', label: 'specialty fats capacity built from scratch, India’s first integrated facility', status: 'draft' },
  { id: 'team', value: '100', unit: 'people', label: 'largest team led, across plants and functions', status: 'draft' },
  { id: 'global-team', value: '40', unit: 'people', label: 'global product and process design team, across the Americas, EMEA and Asia-Pacific', status: 'draft' },
  { id: 'india-team', value: '30', unit: 'people', label: 'technical services, R&D and food-safety team built in India', status: 'draft' },
];
export const figure = (id: string): CareerFigure => {
  const f = careerFigures.find((x) => x.id === id);
  if (!f) throw new Error(`career.ts: no figure "${id}"`);
  return f;
};

/** Established career facts (already on the site since v3), used beside the six figures. */
export const careerFacts: Record<'years' | 'sites' | 'countries' | 'regions' | 'firsts' | 'languages', CareerFigure> = {
  years: { id: 'years', value: '25', unit: 'years', label: 'from plant floor to global boardroom', status: 'confirmed' },
  sites: { id: 'sites', value: '8', unit: 'sites', label: 'in 5 countries: India, Indonesia, Ukraine, Türkiye and the Netherlands', status: 'confirmed' },
  countries: { id: 'countries', value: '5', unit: 'countries', label: 'India, Indonesia, Ukraine, Türkiye and the Netherlands', status: 'confirmed' },
  regions: { id: 'regions', value: '3', unit: 'regions', label: 'teams led across the Americas, EMEA and Asia-Pacific', status: 'confirmed' },
  firsts: { id: 'firsts', value: '2', unit: 'national firsts', label: 'India’s first integrated specialty fats facility and Ukraine’s first cold-climate palm oil refinery', status: 'confirmed' },
  languages: { id: 'languages', value: '5', unit: 'languages', label: 'English, Hindi, Marathi, Bahasa Indonesia and Russian', status: 'confirmed' },
};

/**
 * Home track record (brief point 3): "25 years · 8 sites in 5 countries · 3 regions · 2 national firsts · 3,000 t/day ·
 * 100 people". Six tiles; "8 sites" is one figure with "in 5 countries" in its label, so no tile breaks over two lines
 * (bug 2). In production the two drafts drop out until confirmed.
 */
export const homeTrackRecord: CareerFigure[] = [
  careerFacts.years, careerFacts.sites, careerFacts.regions, careerFacts.firsts, figure('capacity'), figure('team'),
];
/** Impact strip (brief point 3): figures 1, 2 and 4 (STORY adds 21%, 15% and −25 °C from impact.ts). */
export const impactFigures: CareerFigure[] = [figure('capacity'), figure('refinery'), figure('team')];
/** About band (brief point 3): all six, plus 25 years, 8 sites and 5 languages. */
export const aboutFigures: CareerFigure[] = [careerFacts.years, careerFacts.sites, careerFacts.languages, ...careerFigures];

/** Lead decision 7 / brief: the one footnote, verbatim. At most once per page. */
export const careerFootnote =
  'Results delivered by Ganeaysh Kulkarni in senior roles at global agri-food companies. Client and employer details are kept confidential.';

/** Lead decision 8 / bug 5: the three title lines, exact, in this order. `flourish` only in the home founder block and on About. */
export const founderTitles = {
  name: 'Ganeaysh Kulkarni',
  main: 'Founder and Principal, KoKreaters',
  former: 'Former Global Product & Process Design Director, Cargill',
  flourish: 'Chief Catalyst',
} as const;

/** Brief "Make 25 years felt" point 2: the founder card's one line, verbatim. */
export const founderLine = '25 years leading R&D, plants and food safety across 5 countries and 3 continents';

/** Working languages (About; approach FAQ wording stays in approach.ts). */
export const languages: string[] = ['English', 'Hindi', 'Marathi', 'Bahasa Indonesia', 'Russian'];

/**
 * Credentials strip (brief point 4; earlier item 25: Education · Executive education · Memberships · Recognition).
 * Text only, no third-party logos. A column with `status: 'draft'` and no rows is a placeholder slot: render it only
 * in staging with <Confirm id="P-11">.
 */
export interface CredentialItem { main: string; meta?: string; }
export interface CredentialGroup { id: string; heading: string; items: CredentialItem[]; status: FigureStatus; confirm?: string; }
export const credentials: CredentialGroup[] = [
  {
    id: 'education', heading: 'Education', status: 'confirmed',
    items: [
      { main: 'Food Technology', meta: 'CSIR-CFTRI Mysore' },
      { main: 'BSc Chemistry', meta: 'University of Pune' },
    ],
  },
  {
    id: 'executive', heading: 'Executive education', status: 'confirmed',
    items: [
      { main: 'Creativity and Innovation', meta: 'IIM Ahmedabad' },
      { main: 'EDGE Founder’s Bootcamp', meta: 'UC Berkeley' },
    ],
  },
  {
    id: 'recognition', heading: 'Recognition', status: 'confirmed',
    items: [{ main: 'Trans-fat elimination work', meta: 'Praised publicly by the WHO Director-General' }],
  },
  {
    id: 'memberships', heading: 'Memberships', status: 'draft', items: [],
    confirm: 'Memberships actually held (e.g. AOCS, OTAI, IFT)',
  },
  {
    id: 'talks', heading: 'Talks and publications', status: 'draft', items: [],
    confirm: 'Talks, conference appearances, publications or patents',
  },
];
