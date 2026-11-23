/** Founder and About copy (DESIGN-SPEC 4.8; brief 6.7). CONFIRM 13 covers the dates and "founded in 2026". */
import type { BioSidenote, TimelineItem } from './types';
import { minus25 } from '@/lib/typography';
import { places } from './places';


export const founderName = 'Ganeaysh Kulkarni';
/** Pack 2 item 19: "Founder and Principal, KoKreaters" (rendered as `${founderRole}, KoKreaters`); JSON-LD jobTitle (item 40). */
export const founderRole = 'Founder and Principal';
/** Pack 2 item 19, line 2: the only founder line that names a former employer (item 8). */
export const founderFormerRole = 'Former Global Product & Process Design Director, Cargill';
/** Alias read by the article AuthorBox (PEOPLE-CONTENT). */
export const founderFormer = founderFormerRole;
/** Pack 2 item 19, line 3: small italic flourish. */
export const founderFlourish = 'Chief Catalyst';

/** Pack 2 item 21 (verbatim). The About page reads its copy from src/data/about.ts (PEOPLE-CONTENT); these stay for
 * scripts/og.mjs, scripts/build-knowledge.mjs, scripts/make-profile-pdf.mjs and the JSON-LD. */
export const about = {
  overline: 'About',
  headline: 'Twenty-five years of making ingredients work.',
  intro: 'After 25 years building and leading technical organisations in edible oils, specialty fats and food ingredients, Ganeaysh Kulkarni created KoKreaters: the senior, hands-on partner he wished he could call when he was running plants and R&D teams.',
};

/** Pack 2 item 21: the intro, then the long bio's five paragraphs (lead-ins kept as plain text). Item 9: no "founded in 2026". */
export const longBio: string[] = [
  about.intro,
  'Where it started. Ganeaysh trained in food technology at CSIR-CFTRI Mysore, India’s leading food research institute, after a degree in chemistry from the University of Pune. He began on the plant floor, and that is where his instinct for what really works was formed.',
  `Building firsts. Over the next decade he led technical operations across Asia and Eastern Europe. He built India’s first world-class integrated specialty fats facility, which opened new product lines and multi-million-dollar businesses. In Ukraine he led the design and commissioning of the country’s first cold-climate crude palm oil refinery, a tropical oil processed through winters of ${minus25}, and improved the regional cost structure by 15%. In Indonesia he reshaped manufacturing, lifting throughput and yields, stabilising quality and delivering 21% growth.`,
  'Going global. He then spent fourteen years in technical, R&D and food-safety leadership at Cargill. He led technical services, applications, R&D and FSQR for India, integrating food-safety systems through a major transformation and aligning them with WHO standards for industrial trans fat. He designed a bakery innovation architecture and led technology transfers across the Americas, Asia and EMEA, supported acquisitions with technical due diligence, and led category R&D for confectionery and plant-based foods. Finally, as Global Product & Process Design Director, he steered new product platforms across confectionery, plant-based, bakery and specialised nutrition, with Fortune 500 customers and start-ups alike.',
  'What he is known for. Contaminant-reduction technologies taken from the lab to commercial scale, in line with Indian and European regulation. Trans-fat elimination work praised publicly by the WHO Director-General. Asset-light growth models that build business without heavy capital. And a habit of connecting people across functions, cultures and languages so that good ideas actually ship.',
  'Why KoKreaters. “Ko” stands for together. Ganeaysh works side by side with owners, plant heads and R&D teams, and leaves capability behind, not just a report.',
];

/** Dates the bio already contains; `at` is the 1-based paragraph index. */
export const bioSidenotes: BioSidenote[] = [
  { at: 3, text: '2001 · Wilmar' },
  { at: 4, text: '2012 · Cargill' },
  { at: 4, text: '2023 to 2026 · Global Product & Process Design Director' },
];

export const shortBio = 'Ganeaysh is a food technologist who learned the trade where it is hardest: on the refinery floor. He has built facilities that had never existed in their countries, turned around plants in three very different climates, and led global product design for one of the world’s largest food and agriculture companies. Today he brings that whole journey, from the bench to the boardroom, to the businesses he works with.';

export const timeline: TimelineItem[] = [   // CONFIRM 13
  { label: 'CFTRI Mysore', years: '1999 to 2001' },
  { label: 'Wilmar', years: '2001 to 2012' },
  { label: 'Cargill', years: '2012 to 2026' },
  { label: 'KoKreaters', years: 'Today' },   // pack 2 item 9
];

/**
 * v3: one line per timeline stop, keyed by `timeline[].label`. Each line restates the bio and education above (no new
 * facts); COMPOSED wording, covered by CONFIRM 13 with the dates.
 */
export const timelineRoles: Record<string, string> = {
  'CFTRI Mysore': 'Postgraduate degree in Food Technology',
  Wilmar: 'Technical Head Specialties to Technical Director',
  Cargill: 'Technical, R&D and FSQR leadership; Global Product and Process Design Director, 2023 to 2026',
  KoKreaters: 'Founder and Principal, the Netherlands',
};

/** The About globe fold (5.9.4). */
export const globe = {
  /** Not rendered in v3: the About map heading is aboutPage.mapHeading, because the lead already names the countries. */
  headline: 'India, Indonesia, Ukraine, Türkiye and the Netherlands',
  lead: 'His career has taken him across India, Indonesia, Ukraine, Türkiye and the Netherlands, leading teams in the Americas, EMEA and Asia-Pacific.',
};

export const name = {
  heading: 'The name',
  ko: 'Ko stands for together: co-creation, collaboration, community.',
  kreaters: 'Kreaters are the people who make things happen.',
  quote: 'In Ganeaysh’s words, the work has “co-creation and creativity at its soul, at a global level”.',
  tagline: 'The tagline in the logo spells out the method: Connect · Collaborate · Create.',
  lockupAlt: 'KoKreaters: Connect · Collaborate · Create',
  /** The two halves of the name, set large on About (were hard-coded in the v2 NamePanel). */
  koWord: 'Ko',
  kreatersWord: 'Kreaters',
};

export const educationLabel = 'Education';
export const languagesLabel = 'Languages';
export const education: string[] = [
  'Postgraduate degree in Food Technology, CFTRI Mysore',
  'Degree in Chemistry, University of Pune',
  'Creativity and Innovation programme, IIM Ahmedabad',
  'EDGE Founder’s Bootcamp, UC Berkeley',
];
export const languages: string[] = ['English', 'Hindi', 'Marathi', 'Bahasa Indonesia (conversational)', 'Russian (basic)'];

/** CONFIRM 5: sectors are shown, never company names. The bio's own phrase, as a sentence. */
export const workedWith = 'Working with global leaders in nutrition, food, personal care and pet food.';

/** "eight", "five": counts in a heading read as words, not figures. */
const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const inWords = (n: number) => NUMBER_WORDS[n] ?? String(n);
const placeCount = inWords(places.length);
const countryCount = inWords(new Set(places.map((p) => p.country)).size);

/**
 * v3 About page labels (COMPOSED, plain UI copy; research/v3 About brief). The story eyebrow reuses `founderRole`; the
 * career heading is derived from the timeline; the map heading is counted from places.ts (the lead names the
 * countries, so the heading no longer repeats them); the recognition column reuses impact.ts `tfa`.
 */
export const aboutPage = {
  bioMore: 'Read the long version',
  careerHeading: `From ${timeline[0].label} to ${timeline[timeline.length - 1].label}`,
  mapHeading: `${placeCount.charAt(0).toUpperCase()}${placeCount.slice(1)} places in ${countryCount} countries`,
  credentialsHeading: 'Education, languages and recognition',
  recognitionLabel: 'Recognition',
  /** v3.1 photo interlude caption: the sectors from longBio[0], word for word; no new fact. */
  interludeCaption: 'Edible oils, specialty fats and food ingredients.',
  linkedin: 'View LinkedIn profile',
  profilePdf: 'Download one-page profile (PDF)',
  /** The same button below 390px wide, where the full label would wrap "(PDF)" onto a second line. */
  profilePdfShort: 'Download profile (PDF)',
  /** Written by scripts/make-profile-pdf.mjs from this file; re-run it when the founder data changes. */
  profilePdfHref: '/downloads/ganeaysh-kulkarni-profile.pdf',
  /** Headings inside the PDF itself. */
  pdf: {
    title: 'Ganeaysh Kulkarni, founder of KoKreaters: one-page profile',
    profile: 'Profile',
    career: 'Career',
    results: 'Selected results',
    resultsNote: 'From his career at Wilmar and Cargill.',
    expertise: 'Expertise',
    contact: 'Contact',
  },
};

export const portraitAlt = {
  founder: 'Ganeaysh Kulkarni, Founder and Principal of KoKreaters',
  about: 'Ganeaysh Kulkarni',
};
