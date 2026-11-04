/** robots.txt (DESIGN-SPEC 3.9): staging disallows everything; production allows and lists the sitemap. */
import type { APIRoute } from 'astro';
import { isStaging } from '@/lib/mode';
import { site } from '@/config/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const body = isStaging
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
