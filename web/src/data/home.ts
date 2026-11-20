/**
 * Home copy. Pack 3 (Ganeaysh's v3 review, 20 Nov 2026): nine sections in the brief's order — hero · founder strip ·
 * track record · what we do · impact · credentials + testimonial · industries · insights · CTA. Owner: "very sharp, not
 * too much text, good visuals". Career figures, titles, credentials and the footnote live in src/data/career.ts.
 * Exports no longer on Home (positioning, method, engage, trustLine, netherlands, proof) stay for the pages that read them.
 */
import { careerFootnote, founderLine } from './career';
import type { PhotoSlug } from './photos';
import { bookingHref, bookingLabel } from '@/lib/booking';
export const hero = {
  /** Pack 3 "Make 25 years felt" point 1, verbatim. */
  overline: '25 years · Agri, food and feed · Plant floor to boardroom',
  headline: 'Deep expertise, turned into products, plants and markets.',
  /** The H1 as display lines (desktop line breaks of the design; each line rises in its own mask on load). */
  headlineLines: ['Deep expertise,', 'turned into products,', 'plants and markets.'],
  sub: 'KoKreaters helps agri, food, feed, nutrition and specialty-ingredient businesses develop products, run better plants and win new markets, with 25 years of plant-to-boardroom experience behind every recommendation.',
  /** Pack 3: "Book a 30-minute call" (saffron; href from bookingHref()) and "Explore our expertise". */
  primary: { label: bookingLabel, href: bookingHref() },
  secondary: { label: 'Explore our expertise', href: '/expertise' },
  /**
   * Pack 2 item 14: the proof line in small caps between thin rules. Pack 3 bug 1: on its own row below the buttons.
   * Verbatim; split at the brief's " · ".
   */
  proofLine: [
    'Former global R&D director at one of the world’s largest agri-food companies',
    'Two national industry firsts',
    'Trans-fat work praised by the WHO Director-General',
  ],
  /** v4 foot line, no longer on the home hero (pack 2 item 14); kept for the staging styleguide only. */
  footLeft: 'Based in the Netherlands',
  footLead: 'Experience across',
  footRight: ['India', 'Indonesia', 'Ukraine', 'Türkiye', 'the Netherlands'],
};
/** Pack 3 "Make 25 years felt" point 2: the founder strip under the hero. Titles from career.ts founderTitles. */
export const founderStrip = {
  label: 'Founder',
  line: founderLine,
  /** "A Dutch base. A global reach." merged into the founder strip (brief Home, after the nine sections). */
  base: 'Based in the Netherlands, working worldwide',
  link: { label: 'Meet Ganeaysh', href: '/about' },
};
/** Home track record (pack 3 point 3): six tiles from career.ts homeTrackRecord; no counting animation. */
export const trackRecord = { label: 'Our track record' };
/** Pack 3 lead decision 7: the one footnote (at most once per page; on Home at the end of the Impact section). */
export const homeProofNote = careerFootnote;
/**
 * v4 track record. Pack 2: no longer on Home (see `homeProof`); kept only while the About page still imports it
 * (PEOPLE-CONTENT moves About to its own strip, brief item 23). `strong` is the word set in bold.
 */
export const proof: { value: string; count?: number; strong?: string; label: string }[] = [
  { value: '25', count: 25, strong: 'years', label: 'years in industry, from plant floor to boardroom' },
  { value: '14', count: 14, strong: 'years', label: 'years in oils, fats and food ingredients' },
  { value: '5', count: 5, strong: 'countries', label: 'countries of hands-on plant and business leadership' },
  { value: 'WHO', strong: 'Director-General', label: 'Director-General recognition for trans-fat elimination work' },
];
/** Styleguide only (staging); pack 3 footnote wording. */
export const proofSource = careerFootnote.replace(/\.$/, '');
export const proofStripSource = homeProofNote;
export const positioning = {                                  // graft 9, brief 1
  folio: 'Our promise',                                       // COMPOSED (8.3)
  headline: 'Deep expertise, shared ownership, measurable results.',
  promise: 'We do not hand over a report and leave. We build the answer with your people, so it still works after we have gone.',
  range: 'What makes KoKreaters different is range. Most consultants are either plant engineers or strategists. KoKreaters works from the plant floor to the boardroom: designing a product, fixing a process, passing a customer audit, valuing an acquisition and writing the business plan, all with the same person who has done it inside global companies.',
};
export const whatWeDo = {
  overline: 'What we do',
  headline: 'End-to-end techno-commercial support, from first idea to first sale.',
  intro: 'One partner who understands the chemistry, the plant and the market. We work wherever technology and business meet, and we stay until the result is real.',
  /** Pack 3: Home links to Approach ("How we engage" moved there). */
  approachLink: { label: 'How we engage', href: '/approach#engage' },
};
/**
 * Pack 3 "Signal what is current" point 8: the brief's live themes, shortened only where the brief's own words allow.
 * Ganeaysh confirms which he wants to be found for (CONFIRM marker in staging).
 */
export const helpNow = {
  label: 'Where we help now',
  themes: [
    'EUDR readiness for palm, soy and cocoa supply chains',
    '3-MCPD and GE limits',
    'Trans-fat and saturated-fat reduction',
    'AI-assisted formulation',
    'Cost-in-use under volatile oil prices',
  ],
  confirm: 'which live themes Ganeaysh wants to be found for',
};
export const method = { overline: 'The KoKreaters way', headline: 'Connect. Collaborate. Create.', link: { label: 'How we work', href: '/approach' } };
export const impact = {
  overline: 'Impact',
  headline: 'Results that started on the plant floor.',
  link: { label: 'See the impact', href: '/impact' },
  /** Pack 3: the one footnote, at the end of the Impact section. */
  source: careerFootnote,
  /**
   * Pack 2 item 17: three cards, verbatim. `href` = the WHO story on the Impact page (item 28 story 4; anchor id
   * `story-who`, agreed with STORY). The figures count up once (motion.ts; WHO is left as it is).
   */
  cards: [
    { tag: 'OPERATIONS · INDONESIA', figure: '21%', line: 'Business growth after reshaping manufacturing: throughput, yield, quality and cost.', photo: 'plant-01' },
    { tag: 'PROCESS · UKRAINE', figure: '−25 °C', line: 'Ukraine’s first cold-climate crude palm oil refinery, with a 15% lower cost structure.', photo: 'cold-01' },
    { tag: 'FOOD SAFETY · GLOBAL', figure: 'WHO', line: 'Trans-fat elimination work praised publicly by the WHO Director-General.', href: '/impact#story-who', linkLabel: 'Read the WHO story', photo: 'bakery-01' },
  ] as { tag: string; figure: string; line: string; href?: string; linkLabel?: string; photo: PhotoSlug }[],
};
/** Pack 2 item 16 (copy from item 31): the four ways to engage. Pack 3: no longer on Home (moved to Approach). */
export const engage = {
  headline: 'How we engage',
  intro: 'Four ways to work together. Every engagement starts with a 30-minute conversation, at no cost.',
  href: '/approach#engage',
  cards: [
    { n: '01', title: 'Diagnostic sprint', line: 'Two to three weeks. A site visit, a review of your data and process, and a prioritised roadmap with the value at stake in each step.' },
    { n: '02', title: 'Defined project', line: 'A fixed scope with clear stages and deliverables, from first trial to commercial scale. You decide at each stage gate whether to continue.' },
    { n: '03', title: 'Leadership on demand', line: 'A set number of days each month as your CTO or Head of R&D. We own the technical agenda with your team and build its capability as we go.' },
    { n: '04', title: 'Expert review', line: 'Fast, independent opinions for owners, investors and lenders on an asset, a technology, a partner or a plan.' },
  ],
};
/** Pack 2 item 18. Pack 3: removed from Home, kept on Approach and Contact. */
export const trustLine = ['Confidential by default', 'We work under NDA', 'Client names are shared only with their consent'];
export const industries = {
  overline: 'Industries',
  headline: 'Where we work',
  link: { label: 'All industries', href: '/industries' },
  /** Six photo tiles (also the mega-menu and footer industries); `anchor` is used only when that slug exists in src/data/industries.ts. */
  tiles: [
    { name: 'Agri and oilseeds', photo: 'agri-fields', anchor: '' },
    { name: 'Edible oils and specialty fats', photo: 'oils-pour', anchor: 'edible-oils-specialty-fats' },
    { name: 'Feed and animal nutrition', photo: 'feed-silos', anchor: 'pet-food-animal-nutrition' },
    { name: 'Bakery and food service', photo: 'bakery-dough', anchor: 'bakery' },
    { name: 'Cocoa, chocolate and confectionery', photo: 'cocoa-pods', anchor: 'confectionery' },
    { name: 'Nutrition and specialty ingredients', photo: 'nutrition-spices', anchor: 'dairy-nutrition' },
  ] as const,
  alsoLabel: 'Also',
  also: ['dairy and specialised nutrition', 'plant-based', 'snacks', 'personal care and oleochemicals', 'industrial minerals and process inputs'],
};
export const insights = { overline: 'Insights', headline: 'Ideas from the plant floor and the boardroom.' };
/**
 * Netherlands band. Pack 2 item 20: "We work from ⟦City⟧, the Netherlands, with clients …". The city is unconfirmed
 * (Part K 1) → `city: null` and the brief's interim wording "from the Netherlands"; set `city` to switch.
 */
export const netherlands = {
  overline: 'Based in the Netherlands',
  headline: 'A Dutch base. A global reach.',
  city: null as string | null,   // P-1
  body: (city: string | null) => `We work from ${city ? `${city}, the Netherlands,` : 'the Netherlands,'} with clients across Europe, India and Asia, and on site wherever your plants and markets are.`,
  button: { label: 'Plan a visit or a call', href: '/contact' },
};
export const founderQuote = {
  folio: 'Founder',
  /** Pack 2 item 19: "Keep the quote" (confirmed). */
  quote: 'Co-creation and creativity are at the soul of everything we do. We do not just advise. We create with you.',
  attribution: 'Ganeaysh Kulkarni, Founder and Principal, KoKreaters',
  link: { label: 'Meet Ganeaysh', href: '/about' },
};
/** Closing call to action (every page): Deep Delft band, "Book a 30-minute call" (pack 3), the email address. */
export const cta = {
  headline: 'Let’s create something together.', swooshPhrase: 'together',
  /** Pack 2 item 2: the reply-time sentence, verbatim. */
  body: 'Ganeaysh reads every message personally and replies within two working days.',
  button: bookingLabel,
  href: '/contact',
};
/** Pack 3 point 4–5: the credentials strip and one testimonial (slot hidden outside staging until a real quote exists). */
export const credentialsBand = {
  label: 'Credentials',
  testimonialConfirm: 'one short testimonial with name and role (or role and company type), with permission',
};
/**
 * v3 home labels (REDESIGN-V3 §4 Home). Plain UI labels only; every fact stays in the exports above.
 *  proof — section label over the credibility strip (contract: "Our track record (or similar plain label)"). COMPOSED
 *  draft — staging-only badge on draft insight cards (never rendered in preview or production). COMPOSED
 */
export const homeLabels = {
  proof: 'Our track record',   // pack 3: trackRecord.label
  draft: 'Draft',
  soon: 'Coming soon',
};
