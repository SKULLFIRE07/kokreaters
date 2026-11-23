/**
 * Impact (pack 2, 20 Nov 2026: brief items 7, 8, 17, 27–30).
 * Past results are Ganeaysh’s, delivered in senior roles before KoKreaters (pack 3: said once per page, in the
 * career.ts footnote, never repeated under figures). Employer names
 * appear only in the founder line and on the About page (item 8), so nothing in this file names them.
 * Placeholders (brief ⟦…⟧, Part K): modelled as `pending: { confirmed: false, confirm: 'P-n', note }`. They render in
 * staging only, beside a <Confirm id="P-n">; in preview and production the figure / sentence / link is not rendered.
 */
import type { Engagement, FounderResult, ImpactStory, Unconfirmed } from './types';
import { careerFootnote, figure, impactFigures, type CareerFigure } from './career';
import { minus25 } from '@/lib/typography';
import { bookingHref } from '@/lib/booking';

const pending = (confirm: Unconfirmed['confirm'], note: string): Unconfirmed => ({ confirmed: false, confirm, note });

/**
 * The nine stories (brief item 28), verbatim; apostrophes set typographically. `pillars` / `industries` are the
 * brief's chips (service chips as pillar keys, rendered with the full service name; industry chips as the exact
 * industries.ts names, linked to /industries#<slug>). Filters on /impact are built from these chips.
 */
export const impactStories: ImpactStory[] = [
  {
    photo: 'spare-hall',
    id: 'story-india', n: 1, tag: 'PRODUCT AND PROCESS · INDIA',
    title: 'India’s first world-class integrated specialty fats facility',
    figures: [{ value: '1st', label: 'of its kind in India' }],
    challenge: 'India’s bakers, confectioners and food-service chains depended on imported specialty fats or on vanaspati. No facility in the country brought refining, fractionation, interesterification and blending together to world standards.',
    done: 'Ganeaysh led the technical build-up and start-up of the facility, from process design and product development to customer trials, so that it could make specialty fats to order rather than to stock.',
    result: 'New product lines for customers, and multi-million-dollar businesses built on them.',
    resultMore: { text: `Capacity: ${figure('specialty').value}\u00A0${figure('specialty').unit}.`, pending: pending('P-3', 'draft career figure 3, to confirm') },
    pillars: ['innovation', 'process'], industries: ['Edible oils and specialty fats'],
  },
  {
    photo: 'cold-01',
    id: 'story-ukraine', n: 2, tag: 'PROCESS · UKRAINE',
    title: `A tropical oil, refined through a ${minus25} winter`,
    figures: [{ value: minus25, label: 'operating temperature' }, { value: '15%', label: 'lower cost structure' }],
    challenge: 'Palm oil is solid in a European winter. Building a continuous refinery for it in Ukraine meant that every tank, line and transfer had to keep the oil moving through months of extreme cold, and no one in the country had done it before.',
    done: 'Full design-to-execution leadership, from process design and equipment selection to commissioning and the first saleable product.',
    result: 'Ukraine’s first cold-climate crude palm oil refinery. It shifted the region’s competitive dynamics and improved the cost structure by 15%.',
    pillars: ['process'], industries: ['Edible oils and specialty fats'],
    homeLine: 'Ukraine’s first cold-climate crude palm oil refinery, with a 15% lower cost structure.',
  },
  {
    photo: 'plant-01',
    id: 'story-indonesia', n: 3, tag: 'OPERATIONS · INDONESIA',
    title: '21% growth from the same plant',
    figures: [{ value: '21%', label: 'business growth' }],
    challenge: 'A large operation in Medan was held back by process bottlenecks, variable quality and rising cost.',
    done: 'Ganeaysh reshaped manufacturing operations: he solved the process constraints, raised throughput and yields, stabilised quality and took cost out, working shoulder to shoulder with the plant teams.',
    result: '21% business growth, from capacity the company already owned.',
    resultMore: { text: 'Yield gain: X%.', pending: pending('P-4', 'Indonesia yield gain') },
    pillars: ['process'], industries: ['Edible oils and specialty fats'],
    homeLine: 'Business growth after reshaping manufacturing: throughput, yield, quality and cost.',
  },
  {
    photo: 'oils-02',
    id: 'story-who', n: 4, tag: 'FOOD SAFETY · GLOBAL',
    title: 'Trans-fat work praised by the WHO Director-General',
    figures: [{ value: 'WHO', label: 'Director-General recognition' }],
    challenge: 'In 2018 the World Health Organization called for industrially produced trans fat to be eliminated from the world’s food supply by 2023. Its benchmark is no more than 2\u00A0g of industrial trans fat per 100\u00A0g of fat. Meeting that across a large oils portfolio meant changing formulations, processes and habits at the same time.',
    done: 'Ganeaysh led food-safety and quality integration aligned with WHO standards for industrial trans fat, and shaped health-forward reformulation approaches at category level.',
    result: 'The company’s commitment to the WHO trans-fat standard was praised publicly by the WHO Director-General, Dr Tedros Adhanom Ghebreyesus.',
    verify: [
      { label: 'Dr Tedros’s post on X', href: null, pending: pending('P-5', 'URL of Dr Tedros’s post on X') },
      {
        label: 'His published commentary',
        href: 'https://english.aawsat.com/home/article/4153266/tedros-adhanom-ghebreyesus/food-should-be-source-health-not-cause-disease',
        cite: { title: 'Food should be a source of health, not a cause of disease', author: 'Dr Tedros Adhanom Ghebreyesus', publication: 'Asharq Al-Awsat' },   // pack 3: a proper source link (title and outlet from the URL)
      },
    ],
    pillars: ['quality', 'innovation'], industries: [],
    homeLine: 'Trans-fat elimination work praised publicly by the WHO Director-General.',
  },
  {
    photo: 'lab-01',
    id: 'story-contaminants', n: 5, tag: 'FOOD SAFETY · INDIA AND EUROPE',
    title: 'Process contaminants, removed at the source',
    figures: [{ value: '≥\u00A050%', label: 'reduction in 3-MCPD and glycidyl esters', pending: pending('P-6', 'contaminant reduction figure') }],
    challenge: 'Nutrition customers in India and Europe were tightening limits on process contaminants faster than refineries could respond.',
    done: 'Ganeaysh led the development of proprietary technologies to reduce contaminants arising from raw materials, processing and packaging, and scaled them up to commercial production.',
    result: 'Compliance ahead of emerging Indian and European rules, and continuity of supply for global nutrition customers.',
    pillars: ['quality', 'process'], industries: ['Nutrition and specialty ingredients'],
  },
  {
    photo: 'bakery-02',
    id: 'story-bakery', n: 6, tag: 'TECHNOLOGY TRANSFER · THREE CONTINENTS',
    title: 'One bakery playbook, from the Americas to Asia',
    figures: [{ value: '3', label: 'continents' }],
    challenge: 'Bakery customers in different regions were being served with different methods, different standards and different ways of working.',
    done: 'Ganeaysh designed a bakery innovation architecture, from category structure to production-process design, then led technology transfers across the Americas, Asia and EMEA, training local teams and adapting each application to local flours, fats and customers.',
    result: 'A common framework that regional teams could scale.',
    resultMore: { text: 'Transfers completed: X.', pending: pending('P-7', 'number of technology transfers') },
    pillars: ['innovation'], industries: ['Bakery and food service'],
  },
  {
    photo: 'chocolate-01',
    id: 'story-asset-light', n: 7, tag: 'GROWTH · ASIA AND EMEA',
    title: 'Building business without building plants',
    figures: [{ value: '$X\u00A0m', label: 'new business, asset-light', pending: pending('P-8', 'asset-light business value') }],
    challenge: 'New categories needed to grow fast without the time and capital of new factories.',
    done: 'Ganeaysh created asset-light innovation models (tolling, partner manufacturing and quasi-B2B channels) and led the technical set-up of new-to-world product platforms.',
    result: 'Multi-million-dollar businesses with far lower capital intensity, in confectionery, plant-based and specialty fats.',
    pillars: ['strategy'], industries: ['Cocoa, chocolate and confectionery', 'Plant-based'],
  },
  {
    photo: 'develop-pipette',
    id: 'story-product-design', n: 8, tag: 'INNOVATION · GLOBAL',
    title: 'Product design at global scale',
    figures: [{ value: 'X', label: 'new product platforms', pending: pending('P-9', 'number of product platforms') }],
    challenge: 'A global portfolio across confectionery, plant-based, bakery and specialised nutrition needed faster, better-targeted innovation.',
    done: 'As Global Product & Process Design Director, Ganeaysh steered the design of new product platforms. He built a formulation and development pipeline, with sustainability in product and process design from the start.',
    result: 'A multi-million-dollar innovation pipeline, co-created with Fortune 500 customers and start-ups across the Americas, EMEA and Asia-Pacific.',
    pillars: ['innovation', 'capability'], industries: [],
  },
  {
    photo: 'people-03',
    id: 'story-deals', n: 9, tag: 'DEALS · GLOBAL',
    title: 'Seeing what is really behind an acquisition',
    figures: [{ value: 'X', label: 'transactions supported', pending: pending('P-10', 'number of transactions supported') }],
    challenge: 'Acquirers needed to know whether a target’s plants, products and technology would deliver what the business plan assumed.',
    done: 'Ganeaysh carried out technical due diligence and planned post-acquisition integration, covering assets, processes, quality systems and people.',
    result: 'Clear, evidence-based technical findings for decision-makers, and integration plans ready on day one.',
    pillars: ['deals'], industries: [],
  },
  {
    photo: 'food-cream',
    id: 'story-plantbased', n: 10, tag: 'PRODUCT · EMEA AND ASIA-PACIFIC',
    title: 'Plant-based foods that eat like the original',
    figures: [{ value: 'Bench to plant', label: 'scale-up' }],
    challenge: 'Food manufacturers moving into plant-based and dairy-alternative products needed toppings, creams, fillings and spreads that matched the original in taste, texture and mouthfeel. They had to run on existing lines, hold up through distribution and sell at a price the market would accept.',
    done: 'As category R&D leader for confectionery and plant-based, Ganeaysh built ingredient-system platforms in which fats, proteins, emulsifiers and stabilisers were designed together rather than one at a time. He ran application trials with customers on their own equipment and took each platform from bench to commercial scale, with cost-in-use worked out at every step.',
    result: 'New plant-based platforms adopted by food manufacturers across regions, with an eating experience close to the original and a clear cost-in-use case for each customer.',
    pillars: ['innovation', 'process'],
    industries: ['Dairy alternatives, toppings and creams', 'Food and beverage products', 'Plant-based'],
  },
];

export const storyHref = (id: ImpactStory['id']): string => `/impact#${id}`;
export const getStory = (id: string): ImpactStory | undefined => impactStories.find((s) => s.id === id);

/**
 * /impact strip (pack 3, brief "Make 25 years felt" point 3): career figures 1, 2 and 4 (career.ts, draft until
 * Ganeaysh confirms: staging and preview only) and the existing 21%, 15% and −25 °C. The footnote is the page's one
 * footnote, set once at the top (career.ts `careerFootnote`). The P-6 contaminant figure stays on its story only.
 */
export const impactStrip: { label: string; source: string; items: CareerFigure[] } = {
  label: 'Track record',
  source: careerFootnote,
  items: [
    ...impactFigures,
    { id: 'indonesia', value: '21', unit: '%', label: 'business growth from the same plant, Indonesia', status: 'confirmed' },
    { id: 'ukraine-cost', value: '15', unit: '%', label: 'lower cost structure, Ukraine', status: 'confirmed' },
    { id: 'ukraine-cold', value: '−25', unit: '°C', label: 'refinery operating temperature, Ukraine', status: 'confirmed' },
  ],
};

/** /impact page copy (brief items 27, 29, 30). The brief's intro opens with the page title; the H1 carries it once. */
export const impactPage = {
  overline: 'Impact',
  headline: 'Results that started on the plant floor.',
  lead: 'Ten stories from 25\u00A0years of building plants, products and markets: what was at stake, what was done, and what changed.',
  partOne: 'Ten stories',                             // pack 3 (was "From our founder’s career")
  partTwo: 'KoKreaters engagements',
  anonymised: 'Anonymised',
  engagementDateline: 'KoKreaters engagement',
  labels: { challenge: 'The challenge', done: 'What was done', result: 'The result', verify: 'Source' },
  storiesTitle: 'Ten stories',                         // COMPOSED (brief item 27 intro: "Nine stories …")
  filters: { group: 'Filter the stories', service: 'Service', industry: 'Industry', all: 'All' },   // COMPOSED UI labels
  count: '{n} stories', countOne: '1 story',            // COMPOSED live count
  empty: 'No story matches both filters yet.',          // COMPOSED
  clear: 'Show all stories',                            // brief item 29 wording, reused to clear the filters
  showAll: 'Show all stories',                          // brief item 29
  open: 'Read the full story',                          // COMPOSED accordion button
  initial: 6,                                           // brief item 29: show the first six
  tagsLabel: 'Service and industry',                    // aria-label of each story's chips
  testimonialsLabel: 'Testimonials',
  cta: {
    title: 'Your plant, product or market could be the next story.',
    primary: { label: 'Start a conversation', href: '/contact' },
    booking: { label: 'Book a 30-minute call', href: bookingHref() as string | null },   // pack 3: bookingHref() (lib/booking), always shown
  },
};

/** KoKreaters engagements, anonymised (brief 6.5). All held as pending (C-12); flip `consent` to 'cleared' to publish. */
export const engagements: Engagement[] = [
  { id: 'eu-minerals', text: 'Feasibility study and business plan for a European industrial-minerals company entering a new market.', consent: 'pending', pillars: ['strategy'] },
  { id: 'in-specialty-audit', text: 'Multinational-customer pre-approval readiness audit for an Indian specialty fats manufacturer.', consent: 'pending', pillars: ['quality'] },
  { id: 'n-india-contaminants', text: 'Contaminant mitigation and portfolio development programme for a North Indian edible oils company.', consent: 'pending', pillars: ['quality', 'innovation'] },
];

export const testimonials: { quote: string; name: string; role: string; permission: true }[] = [];   // CONFIRM 8: render nothing while empty


/**
 * LEGACY (v3 shape, kept so other units' code keeps compiling until they move to `impactStories`): the home impact
 * row, About credentials, styleguide, the profile PDF and the chatbot knowledge base still read these. Employer
 * names removed (item 8); Indonesia is "Operations" (item 7). New code should use `impactStories` / `getStory`.
 */
export const founderResults: FounderResult[] = [
  { id: 'india', dateline: 'India',
    homeLine: 'India’s first world-class integrated specialty fats facility.',
    emphasis: [],
    context: 'Product and process · India',
    outcome: 'India’s first world-class integrated specialty fats facility',
    challenge: impactStories[0].challenge, done: impactStories[0].done, result: impactStories[0].result,
    pillars: ['innovation', 'process'], sectors: ['Edible oils and specialty fats'] },
  { id: 'indonesia', dateline: 'Indonesia',
    homeLine: '21% business growth after reshaping manufacturing: throughput, yield, quality and cost.',
    emphasis: ['21%'],
    context: 'Operations · Indonesia',
    outcome: '21% growth from the same plant',
    challenge: impactStories[2].challenge, done: impactStories[2].done, result: impactStories[2].result,
    figure: { value: '21%', source: 'Indonesia' },
    pillars: ['process'], sectors: ['Edible oils and specialty fats'] },
  { id: 'ukraine', dateline: 'Ukraine',
    homeLine: `Ukraine’s first cold-climate crude palm oil refinery, at ${minus25}, with a 15% lower cost structure.`,
    emphasis: [minus25, '15%'],
    context: 'Process · Ukraine',
    outcome: 'Ukraine’s first cold-climate crude palm oil refinery',
    challenge: impactStories[1].challenge, done: impactStories[1].done, result: impactStories[1].result,
    figure: { value: minus25, source: 'Ukraine', frost: true },
    pillars: ['process'], sectors: ['Edible oils and specialty fats'] },
  { id: 'tfa', dateline: 'Global',
    homeLine: 'Trans-fat elimination work praised publicly by the WHO Director-General.',
    emphasis: ['WHO'],
    context: 'Food safety · Global',
    outcome: 'Trans-fat work praised by the WHO Director-General',
    challenge: impactStories[3].challenge, done: impactStories[3].done, result: impactStories[3].result,
    pillars: ['quality', 'innovation'], sectors: [] },
];
/** LEGACY: the Ukraine case's second figure. */
export const secondaryFigures: Partial<Record<FounderResult['id'], string>> = { ukraine: '15%' };
/** LEGACY: display figure for results without `figure`. */
export const figureFallback: Partial<Record<FounderResult['id'], string>> = { india: '1st', tfa: 'WHO' };
/** LEGACY: captions keyed by figure. */
export const figureCaptions: Partial<Record<FounderResult['id'], Record<string, string>>> = {
  india: { '1st': 'of its kind in India' },
  indonesia: { '21%': 'business growth' },
  ukraine: { [minus25]: 'operating temperature', '15%': 'lower cost structure' },
  tfa: { WHO: 'Director-General recognition' },
};
