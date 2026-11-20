/**
 * About page copy, pack 2 (brief items 21–26, verbatim). PEOPLE-CONTENT owns this file; founder.ts (CHROME-HOME) keeps
 * the founder's name and role lines (item 19). No Astro-only imports: scripts/build-knowledge.mjs and
 * scripts/make-profile-pdf.mjs can load it with Node's type stripping.
 * Placeholders (⟦…⟧ in the brief) are `null` or `Unconfirmed` here and render only in staging, with their Part K
 * number, through <Confirm>.
 */
import type { StripItem, Unconfirmed } from './types';
import { minus25 } from '@/lib/typography';

export const about = {
  overline: 'About',
  headline: 'Twenty-five years of making ingredients work.',
  intro: 'After 25 years building and leading technical organisations in edible oils, specialty fats and food ingredients, Ganeaysh Kulkarni created KoKreaters: the senior, hands-on partner he wished he could call when he was running plants and R&D teams.',
};

/** Item 21: shown by default. */
export const shortBio = 'Ganeaysh is a food technologist who learned the trade where it is hardest: on the refinery floor. He has built facilities that had never existed in their countries, turned around plants in three very different climates, and led global product design for one of the world’s largest food and agriculture companies. Today he brings that whole journey, from the bench to the boardroom, to the businesses he works with.';

/** Item 21: "Read the long version". Each paragraph opens with its bold lead-in, as in the brief. */
export const longBio: { lead: string; text: string }[] = [
  {
    lead: 'Where it started.',
    text: 'Ganeaysh trained in food technology at CSIR-CFTRI Mysore, India’s leading food research institute, after a degree in chemistry from the University of Pune. He began on the plant floor, and that is where his instinct for what really works was formed.',
  },
  {
    lead: 'Building firsts.',
    text: `Over the next decade he led technical operations across Asia and Eastern Europe. He built India’s first world-class integrated specialty fats facility, which opened new product lines and multi-million-dollar businesses. In Ukraine he led the design and commissioning of the country’s first cold-climate crude palm oil refinery, a tropical oil processed through winters of ${minus25}, and improved the regional cost structure by 15%. In Indonesia he reshaped manufacturing, lifting throughput and yields, stabilising quality and delivering 21% growth.`,
  },
  {
    lead: 'Going global.',
    text: 'He then spent fourteen years in technical, R&D and food-safety leadership at Cargill. He led technical services, applications, R&D and FSQR for India, integrating food-safety systems through a major transformation and aligning them with WHO standards for industrial trans fat. He designed a bakery innovation architecture and led technology transfers across the Americas, Asia and EMEA, supported acquisitions with technical due diligence, and led category R&D for confectionery and plant-based foods. Finally, as Global Product & Process Design Director, he steered new product platforms across confectionery, plant-based, bakery and specialised nutrition, including an AI-enabled formulation system, with Fortune 500 customers and start-ups alike.',
  },
  {
    lead: 'What he is known for.',
    text: 'Contaminant-reduction technologies taken from the lab to commercial scale, in line with Indian and European regulation. Trans-fat elimination work praised publicly by the WHO Director-General. Asset-light growth models that build business without heavy capital. And a habit of connecting people across functions, cultures and languages so that good ideas actually ship.',
  },
  {
    lead: 'Why KoKreaters.',
    text: '“Ko” stands for together. Ganeaysh works side by side with owners, plant heads and R&D teams, and leaves capability behind, not just a report.',
  },
];
/** The long bio as plain paragraphs (lead-in + text), for JSON-LD, the chat knowledge and the profile PDF. */
export const longBioText: string[] = longBio.map((p) => `${p.lead} ${p.text}`);

/** About map (v3 design, kept): heading and lead. The lead is the v3 bio's own sentence (no Wilmar or Cargill). */
export const placesMap = {
  heading: 'Eight places in five countries',
  lead: 'His career has taken him across India, Indonesia, Ukraine, Türkiye and the Netherlands, leading teams in the Americas, EMEA and Asia-Pacific.',
};

/** Item 22. */
export const timelineSection = {
  heading: 'From CFTRI Mysore to KoKreaters',
  subtitle: 'Eight places, five countries, three continents of teams.',
  places: ['Mundra', 'Medan', 'Odessa', 'Kakinada', 'Gurugram', 'Balikesir', 'Pune', 'Amsterdam'],
  /** Accessible name of the places line. COMPOSED. */
  placesLabel: 'Places he has worked',
};
export interface TimelineRow { years: string; org: string; line: string; now?: boolean; }
export const timeline: TimelineRow[] = [
  { years: '1996–1999', org: 'University of Pune', line: 'BSc Chemistry' },
  { years: '1999–2001', org: 'CSIR-CFTRI Mysore', line: 'Postgraduate degree in Food Technology' },
  { years: '2001–2012', org: 'Wilmar', line: 'Technical Head Specialties to Technical Director, across India, Indonesia and Ukraine' },
  { years: '2012–2021', org: 'Cargill', line: 'Technical services, applications, R&D and FSQR leadership, India' },
  { years: '2021–2023', org: 'Cargill', line: 'Regional Technical Lead and Bakery Technology Transfer Leader; Category R&D Leader, Confectionery and Plant-based' },
  { years: '2023–2026', org: 'Cargill', line: 'Global Product & Process Design Director' },
  { years: 'Today', org: 'KoKreaters', line: 'Founder and Principal, the Netherlands', now: true },
];

/** Item 23: the About strip (different from home and Impact). Three figures are Part K 2 placeholders. */
const p2 = (note: string): Unconfirmed => ({ confirmed: false, confirm: 'P-2', note });
export const aboutStrip: { label: string; items: StripItem[] } = {
  label: 'In numbers',                                                         // COMPOSED (band label)
  items: [
    { value: '50+', label: 'products and reformulations taken to market', pending: p2('products taken to market (50+)') },
    { value: '10+', label: 'plants, lines and facilities designed, commissioned or turned around', pending: p2('plants and lines (10+)') },
    { value: '100+', label: 'customers co-created with, from start-ups to Fortune 500 companies', pending: p2('customers (100+)') },
    { value: '5', label: 'working languages: English, Hindi, Marathi, Bahasa Indonesia and Russian' },
  ],
};
/** The languages behind the "5" figure (item 23), for the one-figure layout. */
export const languages = ['English', 'Hindi', 'Marathi', 'Bahasa Indonesia', 'Russian'];

/** Item 24. Sector icons only, never company logos. `icon` = a lucide-static icon name. */
export const workedAlongside = {
  heading: 'Who he has worked alongside',
  body: 'Over his career, Ganeaysh has co-developed products and processes with global leaders in infant and medical nutrition, sports and dairy nutrition, FMCG, personal care, oleochemicals and pet food.',
  /** The sectors named in `body`, in its order (labels are its own words). */
  sectors: [
    { label: 'Infant and medical nutrition', icon: 'baby' },
    { label: 'Sports and dairy nutrition', icon: 'milk' },
    { label: 'FMCG', icon: 'shopping-basket' },
    { label: 'Personal care', icon: 'sparkles' },
    { label: 'Oleochemicals', icon: 'flask-conical' },
    { label: 'Pet food', icon: 'paw-print' },
  ],
} as const;

/** Item 25: four columns. A column whose rows are all placeholders (Part K 11) renders only in staging. */
export interface CredentialRow { main: string; meta?: string; }
export interface CredentialColumn { heading: string; rows: CredentialRow[]; pending?: Unconfirmed; }
export const credentials: { heading: string; columns: CredentialColumn[] } = {
  heading: 'Credentials',
  columns: [
    {
      heading: 'Education',
      rows: [
        { main: 'Postgraduate in Food Technology', meta: 'CSIR-CFTRI Mysore' },
        { main: 'BSc Chemistry', meta: 'University of Pune' },
      ],
    },
    {
      heading: 'Executive education',
      rows: [
        { main: 'Creativity and Innovation', meta: 'IIM Ahmedabad (2014)' },
        { main: 'EDGE Founder’s Bootcamp', meta: 'Innovation Acceleration Group, UC Berkeley (2021)' },
      ],
    },
    {
      heading: 'Professional memberships',
      rows: [],
      pending: { confirmed: false, confirm: 'P-11', note: 'memberships actually held (e.g. AOCS, SEA India, OTAI, AFST(I), MVO); hidden until confirmed' },
    },
    {
      heading: 'Speaking and publications',
      rows: [],
      pending: { confirmed: false, confirm: 'P-11', note: 'talks (title, event, city, year), papers or articles, patents; hidden until confirmed' },
    },
  ],
};

/**
 * Item 26: three slots; publish only quotes given in writing with permission to use name and title. The section
 * renders outside staging only once at least two are here.
 */
export interface Testimonial { quote: string; name: string; role: string; company: string; permission: true; }
export const testimonials = {
  heading: 'In their words',                                                   // COMPOSED
  minimum: 2,
  items: [] as Testimonial[],
  pending: { confirmed: false, confirm: 'P-12', note: 'two or three written testimonials with permission; the section is hidden until two are confirmed' } satisfies Unconfirmed,
};

/** Page labels. */
export const aboutPage = {
  bioMore: 'Read the long version',
  /** The one-figure layout of the strip, outside staging: "5" + this label + the languages. */
  languagesLabel: 'working languages',
  linkedin: 'View LinkedIn profile',
  profilePdf: 'Download one-page profile (PDF)',
  profilePdfShort: 'Download profile (PDF)',
  profilePdfHref: '/downloads/ganeaysh-kulkarni-profile.pdf',
  /** The PDF still carries the v3 bio ("KoKreaters 2026", old service names): hidden outside staging until regenerated. */
  profilePdfCurrent: false,
  /** Photo interlude over the Dutch polder: the home Netherlands band's headline (item 20). */
  interludeCaption: 'A Dutch base. A global reach.',
};
