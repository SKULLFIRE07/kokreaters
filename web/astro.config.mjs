import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Read at build time; src/lib/mode.ts is the runtime reader (import.meta.env.PUBLIC_SITE_MODE).
const MODE = process.env.PUBLIC_SITE_MODE ?? 'staging';
void MODE;

export default defineConfig({
  site: 'https://kokreaters.com',          // bare domain canonical; www → bare at the host. C-3
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: { responsiveStyles: false },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      // drafts are not built in production, so they never reach the sitemap
    }),
  ],
  vite: { build: { assetsInlineLimit: 2048 } },
});
