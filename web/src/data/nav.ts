/** Navigation and chrome labels (REDESIGN-V3 §3 chrome; DESIGN-SPEC 4.11). Approach stays top-level (client to decide). */
import type { Link } from './types';
import { pillars, expertiseOverview } from './pillars';
import { industries } from './industries';
import { site } from '@/config/site';
import { industries as homeIndustries } from './home';

/**
 * Main nav (pack 3, brief "Navigation"): full top navigation from 1024px — Expertise · Industries · Impact · Insights ·
 * About, plus a solid "Book a call" button. `panel: 'mega'` = the Expertise mega-menu (six services + six industries);
 * its `href` is the no-JS fallback and the hub link inside the panel. Approach is reached from Home, the mega-menu
 * foot, the footer and the mobile menu.
 */
export const main: (Link & { panel?: true | 'mega' | 'list' })[] = [
  { label: 'Expertise', href: '/expertise', panel: 'mega' },
  { label: 'Industries', href: '/industries' },
  { label: 'Impact', href: '/impact' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
];
export const impactLink: Link = { label: 'Impact', href: '/impact' };
export const approachLink: Link = { label: 'How we work', href: '/approach' };

/** The address as the brand spells it (the mailbox itself is case-insensitive). */
export const emailDisplay = 'office@KoKreaters.com';

export const expertiseLinks: Link[] = pillars.map((p) => ({ label: p.name, href: `/expertise/${p.slug}` }));
export const industryLinks: Link[] = industries.map((i) => ({ label: i.name, href: `/industries#${i.slug}` }));
/**
 * The six industries of the mega-menu and the footer (brief: "six services and six industries"): the home tiles, each
 * linking to its Industries card when that anchor exists in industries.ts, else to the Industries page.
 */
const industrySlugs = new Set(industries.map((i) => i.slug));
export const sixIndustries: Link[] = homeIndustries.tiles.map((t) => ({
  label: t.name,
  href: t.anchor && industrySlugs.has(t.anchor) ? `/industries#${t.anchor}` : '/industries',
}));

/** Mobile menu links after the Expertise group. */
export const mobile: Link[] = [
  ...main.filter((l) => !l.panel), { label: 'Approach', href: '/approach' }, { label: 'Contact', href: '/contact' },
];

/** Header labels. */
export const header = {
  homeLabel: 'KoKreaters home',
  navLabel: 'Main',
  menuLabel: 'Menu',
};

/** Expertise mega-menu (desktop ≥ 1024px): six services and six industries. */
export const megaMenu = {
  label: 'Expertise',
  intro: expertiseOverview.intro.split('. ').pop() ?? '',
  all: { label: 'All expertise', href: '/expertise' },
  industriesLabel: 'Industries',
};

/** Industries dropdown (desktop) and the Industries group in the mobile menu. */
export const industriesMenu = {
  label: 'Industries',
  all: { label: 'All industries', href: '/industries' },   // COMPOSED
};

/** Slim navy line above the header: "Latest insight — <title> →". Hidden when no insight is visible in this mode. */
export const announcement = {
  label: 'Latest insight',                                  // COMPOSED
  region: 'Announcement',
};

export const footer = {
  statement: 'Techno-commercial consulting for agri, food, feed, nutrition and specialty ingredients.',   // developer guide homepage design
  expertise: { heading: 'Expertise', links: expertiseLinks },
  /** Pack 3: four columns, Expertise · Industries · Company · Contact and social. */
  industries: { heading: 'Industries', links: sixIndustries },
  company: {
    heading: 'Company',
    links: [
      { label: 'Approach', href: '/approach' },
      { label: 'Impact', href: '/impact' },
      { label: 'Insights', href: '/insights' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ] as Link[],
  },
  insights: { heading: 'Insights', all: { label: 'All insights', href: '/insights' } },   // "All insights" COMPOSED
  contact: {
    heading: 'Contact and social',
    email: { label: 'office@KoKreaters.com', href: `mailto:${site.email}` },
    whatsapp: { label: `WhatsApp ${site.whatsapp.display}`, href: site.whatsapp.href },
    linkedin: { label: 'LinkedIn', href: site.linkedin.href },
    /** Brief item 38: the founder's profile is live; the company page (Part K 14) is a placeholder → hidden until set. */
    linkedinFounder: { label: 'LinkedIn: Ganeaysh Kulkarni', href: site.linkedin.href },
    linkedinCompany: { label: 'LinkedIn: KoKreaters', href: site.linkedinCompany },   // P-14 (src/config/site.ts)
    /** Pack 3: YouTube "when live" → null until the channel exists (placeholder: staging only). */
    youtube: { label: 'YouTube', href: null as string | null },
    base: 'Based in the Netherlands',
  },
  newsletter: { heading: 'Newsletter' },
  copyright: `© ${new Date().getFullYear()} ${site.name}. All rights reserved.`,
  registrationNote: 'KvK / VAT / registered address',
  homeLabel: 'KoKreaters home',
  /**
   * Brief item 10 legal line: "KoKreaters ⟦legal name and legal form⟧ · KvK ⟦00000000⟧ · BTW ⟦NL000000000B01⟧ ·
   * ⟦City⟧, the Netherlands". Every part is unconfirmed (Part K 1) → null; the line renders only when name, KvK and
   * BTW are all set (city optional: "the Netherlands" alone). Staging shows a CONFIRM P-1 marker in its place.
   */
  legalEntity: {
    name: null as string | null,      // P-1 legal name and legal form, e.g. "B.V."
    kvk: null as string | null,       // P-1 e.g. "00000000"
    btw: null as string | null,       // P-1 e.g. "NL000000000B01"
    city: null as string | null,      // P-1
  },
  legalNote: 'legal name and form, KvK, BTW and city',
};

/** The footer legal line from footer.legalEntity, or null while any required part is unconfirmed. */
export const legalLine = (): string | null => {
  const e = footer.legalEntity;
  if (!e.name || !e.kvk || !e.btw) return null;
  return [`${site.name} ${e.name}`, `KvK ${e.kvk}`, `BTW ${e.btw}`, e.city ? `${e.city}, the Netherlands` : 'the Netherlands'].join(' · ');
};

/** Newsletter form strings (ui/NewsletterForm). */
export const newsletterForm = {
  placeholder: 'Email address',                                                   // COMPOSED
  note: 'We use your address only to send the newsletter. See our',               // COMPOSED
  privacy: { label: 'Privacy Policy', href: '/privacy' },
  success: 'Thank you. Please check your inbox to confirm.',                      // REDESIGN-V3 §3
  // error and mailto-fallback lines reuse microcopy.formError / microcopy.mailtoSent
  invalid: 'Please enter a valid email address.',                                 // COMPOSED
  mailtoSubject: 'Subscribe',
};

export const legal: Link[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Terms', href: '/terms' },
];

export const contactLink: Link = { label: 'Start a conversation', href: '/contact' };
