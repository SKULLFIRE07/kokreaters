/** llms.txt (DESIGN-SPEC 3.9), built only from the data modules. */
import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { pillars } from '@/data/pillars';
import { POSITIONING_STATEMENT } from '@/components/seo/schema';
import { visibleInsights, comingSoon, insightHref } from '@/lib/insights';
import { microcopy } from '@/data/microcopy';

export const prerender = true;

export const GET: APIRoute = async () => {
  const url = (p: string) => `${site.url}${p}`;
  const visible = await visibleInsights();
  const preparing = await comingSoon();
  const pages: [string, string][] = [
    ['Industries', '/industries'], ['Approach', '/approach'], ['Impact', '/impact'],
    ['Insights', '/insights'], ['About', '/about'], ['Contact', '/contact'],
  ];
  const lines = [
    `# ${site.name}`,
    `> ${POSITIONING_STATEMENT}`,
    '',
    `KoKreaters is a techno-commercial consultancy for agri, food, feed, nutrition and specialty-ingredient businesses, led by Ganeaysh Kulkarni (Founder and Principal; former Global Product & Process Design Director, Cargill). ${site.base}. Contact: ${site.email}`,
    'Results listed on this site come from the founder’s 25-year career before KoKreaters, not from KoKreaters engagements.',
    '',
    '## Expertise',
    ...pillars.map((p) => `- [${p.name}](${url(`/expertise/${p.slug}`)}): ${p.promise}`),
    '',
    '## Pages',
    ...pages.map(([label, p]) => `- [${label}](${url(p)})`),
    '',
    '## Insights',
    ...visible.map((e) => `- [${e.data.title}](${url(insightHref(e))}): ${e.data.description}`),
    ...(preparing.length ? ['', `### ${microcopy.inPreparation}`, ...preparing.map((e) => `- ${e.data.title}`)] : []),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
