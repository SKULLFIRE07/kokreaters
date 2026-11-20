/** Home copy (DESIGN-SPEC 4.3), verbatim from the brief. */
/**
 * Home copy. v4 "Delft" (Ganeaysh's developer guide + homepage design, 20 Nov 2026): the hero, track record, approach,
 * industries, impact, Netherlands band and CTA follow his design word for word; facts stay those already in src/data.
 */
export const hero = {
  overline: 'Techno-commercial consulting · Agri, food & feed',
  headline: 'Deep expertise, turned into products, plants and markets.',
  /** The H1 as display lines (desktop line breaks of the design; each line rises in its own mask on load). */
  headlineLines: ['Deep expertise,', 'turned into products,', 'plants and markets.'],
  sub: 'KoKreaters helps agri, food, feed, nutrition and specialty-ingredient businesses develop products, run better plants and win new markets, with 25 years of plant-to-boardroom experience behind every recommendation.',
  primary: { label: 'Start a conversation', href: '/contact' },
  secondary: { label: 'Explore our expertise', href: '/expertise' },
  /**
   * Pack 2 item 14: the proof line in small caps between thin rules (desktop one line; phones three short lines).
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
/**
 * Pack 2 item 15: the home track-record strip (About and Impact have their own). Verbatim. `figure` splits the brief's
 * bold number into numerals (`n`, set large; counted up once) and words (`u`, set smaller) so "8 sites · 5 countries"
 * fits one column.
 */
export const homeProof: { figure: { n: string; u?: string }[]; label: string }[] = [
  { figure: [{ n: '25' }], label: 'years, from plant floor to global boardroom' },
  { figure: [{ n: '8', u: 'sites' }, { n: '5', u: 'countries' }], label: 'India, Indonesia, Ukraine, Türkiye and the Netherlands' },
  { figure: [{ n: '3', u: 'regions' }], label: 'teams led across the Americas, EMEA and Asia-Pacific' },
  { figure: [{ n: '2', u: 'national firsts' }], label: 'India’s first integrated specialty fats facility and Ukraine’s first cold-climate palm oil refinery' },
];
/** Pack 2 item 15 footnote (small, grey, right-aligned), verbatim. Replaces every "Figures from our founder’s career …" line (item 8). */
export const homeProofNote = 'From our founder’s 25-year career, before KoKreaters.';
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
export const proofSource = 'From our founder’s career';
/** Pack 2 item 8: the neutral footnote (item 15) replaces "Figures from our founder’s career at Wilmar and Cargill." */
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
};
export const method = { overline: 'The KoKreaters way', headline: 'Connect. Collaborate. Create.', link: { label: 'How we work', href: '/approach' } };
/** Home "Our approach" band: the three tall photo cards (lab → plant → market). */
export const approach = {
  overline: 'Our approach',
  headline: 'From the lab, to the plant, to the market.',
  link: { label: 'How we work', href: '/approach' },
  steps: [
    { n: '01', label: 'Develop', title: 'Concept, formulation and pilot trials', photo: 'develop-pipette', position: '50% 35%' },
    { n: '02', label: 'Scale', title: 'Process design, scale-up and plant performance', photo: 'scale-tanks', position: '50% 50%' },
    { n: '03', label: 'Access', title: 'Regulatory, supply chain and market entry', photo: 'access-ship', position: '62% 50%' },
  ] as const,
};
export const impact = {
  overline: 'Impact',
  headline: 'Results that started on the plant floor.',
  link: { label: 'See the impact', href: '/impact' },
  /** Pack 2 item 8: neutral footnote, no company names. */
  source: homeProofNote,
  /**
   * Pack 2 item 17: three cards, verbatim. `href` = the WHO story on the Impact page (item 28 story 4; anchor id
   * `story-who`, agreed with STORY). The figures count up once (motion.ts; WHO is left as it is).
   */
  cards: [
    { tag: 'OPERATIONS · INDONESIA', figure: '21%', line: 'Business growth after reshaping manufacturing: throughput, yield, quality and cost.' },
    { tag: 'PROCESS · UKRAINE', figure: '−25 °C', line: 'Ukraine’s first cold-climate crude palm oil refinery, with a 15% lower cost structure.' },
    { tag: 'FOOD SAFETY · GLOBAL', figure: 'WHO', line: 'Trans-fat elimination work praised publicly by the WHO Director-General.', href: '/impact#story-who', linkLabel: 'Read the WHO story' },
  ] as { tag: string; figure: string; line: string; href?: string; linkLabel?: string }[],
};
/**
 * Pack 2 item 16 (copy from item 31): the four ways to engage, summarised on Home under "What we do"; the band links to
 * /approach#engage. Titles and lines verbatim from item 31.
 */
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
/** Pack 2 item 18: slim band above Insights, one centred line in small caps (verbatim, split at " · "). */
export const trustLine = ['Confidential by default', 'We work under NDA', 'Client names are shared only with their consent'];
export const industries = {
  overline: 'Industries',
  headline: 'Where we work',
  link: { label: 'All industries', href: '/industries' },
  /** Six photo tiles; `anchor` is used only when that slug exists in src/data/industries.ts. */
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
/** Closing call to action (every page): Deep Delft band, one saffron button, the email address. */
export const cta = {
  headline: 'Let’s create something together.', swooshPhrase: 'together',
  /** Pack 2 item 2: the reply-time sentence, verbatim. */
  body: 'Ganeaysh reads every message personally and replies within two working days.',
  button: 'Start a conversation',
  href: '/contact',
};
/**
 * v3 home labels (REDESIGN-V3 §4 Home). Plain UI labels only; every fact stays in the exports above.
 *  proof — section label over the credibility strip (contract: "Our track record (or similar plain label)"). COMPOSED
 *  draft — staging-only badge on draft insight cards (never rendered in preview or production). COMPOSED
 */
export const homeLabels = {
  proof: 'Our track record',
  draft: 'Draft',
  soon: 'Coming soon',
};
