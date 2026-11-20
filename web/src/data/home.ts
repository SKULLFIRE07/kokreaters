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
  footLeft: 'Based in the Netherlands',
  footLead: 'Experience across',
  footRight: ['India', 'Indonesia', 'Ukraine', 'Türkiye', 'the Netherlands'],
};
/**
 * Track record (developer guide content fixes): both "25 years in industry" and "14 years in oils, fats and food
 * ingredients". The v3 "regions of teams led" figure is an open question for Ganeaysh, so no count is shown.
 * `strong` is the word set in bold at the start of the label on Home.
 */
export const proof: { value: string; count?: number; strong?: string; label: string }[] = [
  { value: '25', count: 25, strong: 'years', label: 'years in industry, from plant floor to boardroom' },
  { value: '14', count: 14, strong: 'years', label: 'years in oils, fats and food ingredients' },
  { value: '5', count: 5, strong: 'countries', label: 'countries of hands-on plant and business leadership' },
  { value: 'WHO', strong: 'Director-General', label: 'Director-General recognition for trans-fat elimination work' },
];
export const proofSource = 'From our founder’s career';
/** The readable source line beside the track-record strip (home + Impact). All four figures come from the Wilmar and Cargill years. */
export const proofStripSource = 'Figures from our founder’s career at Wilmar and Cargill.';
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
  source: 'From our founder’s career at Wilmar and Cargill.',
};
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
/** Netherlands band (developer guide: "Based in the Netherlands" gets its own band). */
export const netherlands = {
  overline: 'Based in the Netherlands',
  headline: 'A Dutch base. A global reach.',
  body: 'We work from the Netherlands with clients across Europe, India and Asia, and on site wherever your plants and markets are.',
  button: { label: 'Plan a visit or a call', href: '/contact' },
};
export const founderQuote = {
  folio: 'Founder',
  quote: 'Co-creation and creativity are at the soul of everything we do. We do not just advise. We create with you.',  // CONFIRM 4
  attribution: 'Ganeaysh Kulkarni, Chief Catalyst and Founder',
  link: { label: 'Meet Ganeaysh', href: '/about' },
};
/** Closing call to action (every page): Deep Delft band, one saffron button, the email address. */
export const cta = {
  headline: 'Let’s create something together.', swooshPhrase: 'together',
  body: 'Tell us about your product, plant or market. We will come back within two working days.',
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
