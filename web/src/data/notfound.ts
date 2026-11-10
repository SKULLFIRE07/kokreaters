/**
 * 404 page copy (REDESIGN-V3 §4 Legal and 404). The headline is the redesign brief's own wording; the line under it is
 * brief §7 (microcopy.notFoundLine). Link labels reuse the nav data, so they never drift from the header.
 */
import type { Link } from './types';
import { microcopy } from './microcopy';
import { main, mobile } from './nav';

const navLabel = (href: string, fallback: string) => [...main, ...mobile].find((l) => l.href === href)?.label ?? fallback;

export const notFoundPage = {
  code: '404',
  headline: 'This page could not be found.',          // REDESIGN-V3 §4 (client redesign brief, 9 Nov 2026)
  line: microcopy.notFoundLine,                        // "Let’s connect you back." (brief §7)
  links: [
    { label: microcopy.homeCrumb, href: '/' },
    { label: navLabel('/expertise', 'Expertise'), href: '/expertise' },
    { label: navLabel('/insights', 'Insights'), href: '/insights' },
    { label: navLabel('/contact', 'Contact'), href: '/contact' },
  ] as Link[],
};
