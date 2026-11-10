/** Navigation and chrome labels (REDESIGN-V3 §3 chrome; DESIGN-SPEC 4.11). Approach stays top-level (client to decide). */
import type { Link } from './types';
import { pillars, expertiseOverview } from './pillars';
import { industries } from './industries';
import { site } from '@/config/site';

/**
 * Main nav. `panel` items are disclosure buttons on desktop (≥ 1120px): 'mega' = the Expertise mega-menu,
 * 'list' = the Industries dropdown. Their `href` is the no-JS fallback and the hub link inside the panel.
 * `panel: true` (v2) is still read as 'mega'.
 */
export const main: (Link & { panel?: true | 'mega' | 'list' })[] = [
  { label: 'Expertise', href: '/expertise', panel: 'mega' },
  { label: 'Industries', href: '/industries', panel: 'list' },
  { label: 'Approach', href: '/approach' },
  { label: 'Impact', href: '/impact' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
];

export const expertiseLinks: Link[] = pillars.map((p) => ({ label: p.name, href: `/expertise/${p.slug}` }));
export const industryLinks: Link[] = industries.map((i) => ({ label: i.name, href: `/industries#${i.slug}` }));

/** Mobile menu links after the Expertise and Industries groups. */
export const mobile: Link[] = [...main.filter((l) => !l.panel), { label: 'Contact', href: '/contact' }];

/** Header labels. */
export const header = {
  homeLabel: 'KoKreaters home',
  navLabel: 'Main',
  menuLabel: 'Menu',
};

/** Expertise mega-menu (desktop). The intro is the closing sentence of expertiseOverview.intro, not new copy. */
export const megaMenu = {
  label: 'Expertise',
  intro: expertiseOverview.intro.split('. ').pop() ?? '',
  all: { label: 'All expertise', href: '/expertise' },
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
  statement: 'Independent technical and strategy consulting for food, feed and specialty ingredients.',   // COMPOSED from hero.overline
  expertise: { heading: 'Expertise', links: expertiseLinks },
  company: {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Approach', href: '/approach' },
      { label: 'Impact', href: '/impact' },
      { label: 'Industries', href: '/industries' },   // the brief footer omits it (C-5)
      { label: 'Contact', href: '/contact' },
    ] as Link[],
  },
  insights: { heading: 'Insights', all: { label: 'All insights', href: '/insights' } },   // "All insights" COMPOSED
  contact: {
    heading: 'Contact',
    email: { label: site.email, href: `mailto:${site.email}` },
    whatsapp: { label: `WhatsApp ${site.whatsapp.display}`, href: site.whatsapp.href },
    linkedin: { label: 'LinkedIn', href: site.linkedin.href },
    base: 'Based in the Netherlands (CET), working worldwide',   // site.base + time zone (REDESIGN-V3 §3)
  },
  newsletter: { heading: 'Newsletter' },
  copyright: `© 2026 ${site.name}`,
  registrationNote: 'KvK / VAT / registered address',
  homeLabel: 'KoKreaters home',
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
