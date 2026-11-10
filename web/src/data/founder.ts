/** Founder and About copy (DESIGN-SPEC 4.8; brief 6.7). CONFIRM 13 covers the dates and "founded in 2026". */
import type { BioSidenote, TimelineItem } from './types';
import { minus25 } from '@/lib/typography';
import { places } from './places';

/** U+00A0: binds a figure to its unit where a headline could break between them ("25 years"). */
const NBSP = '\u00A0';

export const founderName = 'Ganeaysh Kulkarni';
export const founderRole = 'Founder';

export const about = {
  overline: 'About',
  headline: `Built on 25${NBSP}years of making ingredients work.`,
  intro: 'KoKreaters is the consultancy Ganeaysh Kulkarni wished he could call when he was running plants and R&D teams: someone who has done the work, understands the business and builds the answer with you.',
};

/** Six paragraphs, verbatim from brief 6.7 (the brief's last paragraph is split in two; no words changed). */
export const longBio: string[] = [
  'Ganeaysh Kulkarni founded KoKreaters in 2026 after 25 years building and leading technical organisations in edible oils, specialty fats and food ingredients.',
  `He began his career at Wilmar in 2001, rising from Technical Head Specialties to Technical Director. There he built and activated India’s first world-class integrated specialty fats facility, reshaped manufacturing operations in Indonesia to deliver 21% growth, and commissioned Ukraine’s first cold-climate crude palm oil refinery, operating at ${minus25} and improving the cost structure by 15%.`,
  'In 2012 he joined Cargill. Over the next fourteen years he led Technical Services, Applications, R&D and Food Safety, Quality and Regulatory (FSQR) teams; served as Regional Technical Lead and Bakery Technology Transfer Leader, supporting technical due diligence for acquisitions; led Category R&D for Confectionery and Plant-Based; and was Global Product and Process Design Director from 2023 to 2026. His trans-fat elimination work at Cargill was publicly recognised by the Director-General of the World Health Organization.',
  'His career has taken him across India, Indonesia, Ukraine, Türkiye and the Netherlands, leading teams in the Americas, EMEA and Asia-Pacific and working with global leaders in nutrition, food, personal care and pet food.',
  'Ganeaysh holds a postgraduate degree in Food Technology from CFTRI Mysore and a degree in Chemistry from the University of Pune, and has completed programmes in Creativity and Innovation at IIM Ahmedabad and the EDGE Founder’s Bootcamp at UC Berkeley. He works in English, Hindi and Marathi, with conversational Bahasa Indonesia and basic Russian.',
  'He is based in the Netherlands and works with clients worldwide.',
];

/** Dates the bio already contains; `at` is the 1-based paragraph index. */
export const bioSidenotes: BioSidenote[] = [
  { at: 2, text: '2001 · Wilmar' },
  { at: 3, text: '2012 · Cargill' },
  { at: 3, text: '2023–2026 · Global Product and Process Design Director' },
];

export const shortBio = 'Ganeaysh Kulkarni is the founder of KoKreaters. A food technologist with 25 years at Wilmar and Cargill, he has built specialty fats facilities, commissioned refineries, led global R&D and FSQR teams and supported acquisitions across Asia, Europe and the Americas. He now helps food and ingredient companies co-create better products, plants and decisions.';

export const timeline: TimelineItem[] = [   // CONFIRM 13
  { label: 'CFTRI Mysore', years: '1999–2001' },
  { label: 'Wilmar', years: '2001–2012' },
  { label: 'Cargill', years: '2012–2026' },
  { label: 'KoKreaters', years: '2026' },
];

/**
 * v3: one line per timeline stop, keyed by `timeline[].label`. Each line restates the bio and education above (no new
 * facts); COMPOSED wording, covered by CONFIRM 13 with the dates.
 */
export const timelineRoles: Record<string, string> = {
  'CFTRI Mysore': 'Postgraduate degree in Food Technology',
  Wilmar: 'Technical Head Specialties to Technical Director',
  Cargill: 'Technical, R&D and FSQR leadership; Global Product and Process Design Director, 2023–2026',
  KoKreaters: 'Founder, based in the Netherlands',
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
  founder: 'Ganeaysh Kulkarni, founder of KoKreaters',
  about: 'Ganeaysh Kulkarni',
};
