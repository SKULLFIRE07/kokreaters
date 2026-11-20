/**
 * About page copy, pack 2 (brief items 21–26, verbatim). PEOPLE-CONTENT owns this file; founder.ts (CHROME-HOME) keeps
 * the founder's name and role lines (item 19). No Astro-only imports: scripts/build-knowledge.mjs and
 * scripts/make-profile-pdf.mjs can load it with Node's type stripping.
 * Placeholders (⟦…⟧ in the brief) are `null` or `Unconfirmed` here and render only in staging, with their Part K
 * number, through <Confirm>.
 */
import type { Unconfirmed } from './types';
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

/**
 * Pack 3 (brief, About): open with achievements, not education. The timeline starts at 2001 (Wilmar) and every step
 * carries one achievement line; education moves to the small credentials block. Roles and dates as in pack 2 item 22
 * (CONFIRM 13); each achievement restates a fact from the long bio below (no new claims). The Wilmar line is the
 * brief's own example plus the second national first from the same paragraph.
 */
export const timelineSection = {
  heading: 'From the plant floor to the boardroom',                            // COMPOSED (the hero eyebrow's phrase)
  subtitle: 'Twenty-five years, one achievement at each step.',               // COMPOSED
};
export interface TimelineRow { from: string; to?: string; org: string; role: string; achievement: string; now?: boolean; }
export const timeline: TimelineRow[] = [
  { from: '2001', to: '2012', org: 'Wilmar', role: 'Technical Head Specialties to Technical Director, across India, Indonesia and Ukraine', achievement: 'Built India’s first integrated specialty fats facility and Ukraine’s first cold-climate palm oil refinery.' },
  { from: '2012', to: '2021', org: 'Cargill', role: 'Technical services, applications, R&D and FSQR leadership, India', achievement: 'Aligned food-safety systems with WHO standards for industrial trans fat.' },
  { from: '2021', to: '2023', org: 'Cargill', role: 'Regional Technical Lead and Bakery Technology Transfer Leader; Category R&D Leader, Confectionery and Plant-based', achievement: 'Led bakery technology transfers across the Americas, Asia and EMEA.' },
  { from: '2023', to: '2026', org: 'Cargill', role: 'Global Product & Process Design Director', achievement: 'Steered new product platforms, including an AI-enabled formulation system.' },
  { from: 'Today', org: 'KoKreaters', role: 'Founder and Principal, the Netherlands', achievement: 'The senior, hands-on partner for agri, food and feed businesses.', now: true },   // COMPOSED (from the intro)
];

/**
 * Pack 3: the figures band under the intro reads `aboutFigures` from src/data/career.ts (25 years, 8 sites, 5 languages
 * and the six draft scale figures; drafts render in staging and preview only). Only the band label lives here.
 */
export const aboutStrip = {
  label: 'In numbers',                                                         // COMPOSED (band label)
};

/**
 * Earlier item 24 (pack 3 "Still open"): a short section naming types of organisations, not logos. The tiles are the
 * brief's five types; the lead is the long bio's own sector list.
 */
export const workedAlongside = {
  heading: 'Who he has worked alongside',
  body: 'Products and processes co-developed with global leaders in infant and medical nutrition, sports and dairy nutrition, FMCG, personal care, oleochemicals and pet food.',
  /** `icon` = a lucide-static icon name (SectorIcon). */
  types: [
    { label: 'Global agri-food majors', icon: 'globe' },
    { label: 'Fortune 500 food brands', icon: 'award' },
    { label: 'National refiners', icon: 'factory' },
    { label: 'Start-ups', icon: 'rocket' },
    { label: 'Investors', icon: 'landmark' },
  ],
} as const;

/**
 * Pack 3 credentials strip + languages: the groups come from src/data/career.ts `credentials` (draft groups with no
 * items render only in staging, with <Confirm id="P-11">); the languages column is added here.
 */
export const credentialsSection = {
  heading: 'Education and credentials',                                        // COMPOSED
  languagesHeading: 'Languages',
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
  linkedin: 'LinkedIn profile',
  /** Pack 3: downloadable short bio and high-resolution portrait, for event organisers. */
  bioPdf: 'Download short bio (PDF)',
  bioPdfShort: 'Short bio (PDF)',
  /** Written by `node scripts/make-short-bio.mjs` (headless Chrome) from scripts/short-bio/short-bio.html. */
  bioPdfHref: '/downloads/ganeaysh-kulkarni-short-bio.pdf',
  bioPdfName: 'ganeaysh-kulkarni-short-bio.pdf',
  portrait: 'High-resolution portrait',
  portraitHref: '/downloads/ganeaysh-kulkarni-portrait.jpg',
  portraitName: 'ganeaysh-kulkarni-portrait.jpg',
  /** Photo interlude over the Dutch polder: the home Netherlands band's headline (item 20). */
  interludeCaption: 'A Dutch base. A global reach.',
};
