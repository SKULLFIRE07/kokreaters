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
  devToolbar: { enabled: false },          // keeps the dev overlay out of QA screenshots (scripts/qa-shoot.mjs)
  integrations: [
    mdx(),
    sitemap({
      // 404 and the staging-only styleguide never belong in the sitemap; drafts are not built in production.
      filter: (page) => !page.includes('/404') && !/\/styleguide\/?$/.test(page),
    }),
  ],
  vite: {
    build: {
      // REDESIGN-V3 §8.6: never inline processed scripts (each inline module would need its own CSP hash);
      // only the tiny is:inline head script stays inline. Other assets keep the 2 KB inline threshold.
      assetsInlineLimit: (file, content) => (/\.(?:[cm]?js|[cm]?ts)$/.test(file) ? false : content.length < 2048),
    },
  },
});
