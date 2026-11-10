/** robots.txt (§8.5): disallow everything unless the build is `indexable` (production + PUBLIC_INDEXABLE=1). */
import type { APIRoute } from 'astro';
import { indexable } from '@/lib/mode';
import { site } from '@/config/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const body = indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
