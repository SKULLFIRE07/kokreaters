# KoKreaters.com

The KoKreaters website: a static Astro 7 site (no UI framework, plain TypeScript for client code).
The build contract is `../DESIGN-SPEC.md`; every word and fact comes from `../research/BRIEF.txt`.

## Run it

Needs Node 22.23.4 or newer.

```bash
npm install                 # once
npm run assets              # fonts + brand crops + globe data (idempotent)
npm run dev                 # http://127.0.0.1:4321 (staging mode)
npm run build && npm run preview     # http://127.0.0.1:4322
npm run build:prod          # production mode: no CONFIRM markers, no drafts, indexable
npm run check               # astro check (types + templates)
npm run verify && npm test && npm run lhci
```

`npm run dev` and `npm run build` copy the three self-hosted font files into `public/fonts/`
first (`scripts/copy-fonts.mjs`, git-ignored output). No font, script or style is loaded from a
third-party CDN at runtime.

### Hosting

`npm run build` writes a fully static site to `dist/` (one `.html` file per route, base `/`).
Any static host works. On Vercel: framework preset "Astro", build command `npm run build`
(or `npm run build:prod` for the live site), output directory `dist`, and set the env vars below
in the project settings. `www.kokreaters.com` should redirect to the bare domain at the host.

## Site modes

`PUBLIC_SITE_MODE` is `staging` (the default when unset) or `production`.

| Behaviour | staging | production |
|---|---|---|
| `[CONFIRM n]` markers (yellow tags) | visible | not rendered |
| Insights with `review: 'pending'` | listed, with a “DRAFT for Ganeaysh’s review” ribbon | not built, not listed, not in sitemap or llms.txt |
| Impact engagements with `consent: 'pending'` | shown with “Pending client consent” | not rendered |
| `robots.txt` and `<meta name="robots">` | `Disallow: /`, `noindex, nofollow` | allow, plus the sitemap; `index, follow` |

## Environment variables

Copy `.env.example` to `.env`. All are optional.

| Variable | Effect when empty |
|---|---|
| `PUBLIC_SITE_MODE` | `staging` |
| `PUBLIC_FORM_ENDPOINT` | The contact form opens a pre-filled email to office@kokreaters.com |
| `PUBLIC_NEWSLETTER_ENDPOINT` | “Subscribe” opens `mailto:office@kokreaters.com?subject=Subscribe` |
| `PUBLIC_BOOKING_URL` | “Book a 30-minute call” goes to `/contact#form` (CONFIRM 9) |
| `PUBLIC_TURNSTILE_SITEKEY` | No Turnstile; the honeypot and time trap still run |
| `PUBLIC_ANALYTICS` | No analytics and no cookie banner |

The contact form auto-reply and the routing of submissions to office@kokreaters.com are set up at
the form endpoint provider (Formspree, Web3Forms or a small Worker), not in this code.

## How Ganeaysh edits an insight

Insights are MDX files in `src/content/insights/`. To add one:

1. Copy an existing file, for example `src/content/insights/bleaching-earth.mdx`, and give the copy
   a new file name in lower case with hyphens. The file name becomes the web address
   (`/insights/your-file-name`).
2. Change the frontmatter at the top (between the `---` lines): the title, the standfirst, the
   description (155 characters at most), the pillar, the format and the date. The full list of fields is in
   `src/content.config.ts`; `npm run check` reports anything missing or misspelt.
3. Write the article below the frontmatter in Markdown: `## ` for a section heading, a blank line
   between paragraphs.
4. Leave `review: 'pending'` until the text is approved. Pending articles show in staging only.
   To publish it on the live site, set both `status: 'published'` and `review: 'approved'`.
   `status: 'coming-soon'` lists the title under “In preparation” with no page.
5. Run `npm run dev` to read it at `http://127.0.0.1:4321/insights/your-file-name`.

A Git-based editor (Keystatic or Decap) or Sanity can replace this step later (open item C-4).
