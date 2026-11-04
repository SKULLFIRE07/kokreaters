/** Navigation (DESIGN-SPEC 4.11, 3.2, 3.5). */
import type { Link } from './types';
import { pillars } from './pillars';
import { site } from '@/config/site';

/** Main nav. "Expertise" is the panel disclosure button, not a link (3.2); its `href` is the no-JS fallback. */
export const main: (Link & { panel?: true })[] = [
  { label: 'Expertise', href: '/expertise', panel: true },
  { label: 'Industries', href: '/industries' },
  { label: 'Approach', href: '/approach' },
  { label: 'Impact', href: '/impact' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
];

export const expertiseLinks: Link[] = pillars.map((p) => ({ label: p.name, href: `/expertise/${p.slug}` }));

/** Mobile menu links after the Expertise group (3.4). */
export const mobile: Link[] = [...main.filter((l) => !l.panel), { label: 'Contact', href: '/contact' }];

export const footer = {
  expertise: { heading: 'Expertise', links: expertiseLinks },
  company: {
    heading: 'Company',
    links: [
      { label: 'Approach', href: '/approach' },
      { label: 'Impact', href: '/impact' },
      { label: 'About', href: '/about' },
      { label: 'Insights', href: '/insights' },
      { label: 'Industries', href: '/industries' },   // added; the brief footer omits it (C-5)
    ] as Link[],
  },
  contact: {
    heading: 'Contact',
    email: { label: site.email, href: `mailto:${site.email}` },
    whatsapp: { label: `WhatsApp: ${site.whatsapp.display}`, href: site.whatsapp.href },
    linkedin: { label: 'LinkedIn', href: site.linkedin.href },
    base: site.base,
  },
  newsletter: { heading: 'Newsletter' },
};

export const legal: Link[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Terms', href: '/terms' },
];

export const contactLink: Link = { label: 'Start a conversation', href: '/contact' };
