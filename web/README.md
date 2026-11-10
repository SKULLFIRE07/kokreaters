# KoKreaters.com

The KoKreaters website, v3 "Editorial": a static Astro 7 site. No UI framework, no animation library; one small
TypeScript module (`src/scripts/site.ts`) plus three page scripts (contact form, insight filters, article share/print).
Every page is plain HTML and CSS that works without JavaScript.

- Build contract: `../REDESIGN-V3.md` (visual system, page compositions, modes, quality bar).
- Component guide for anyone editing pages: `../research/v3/FOUNDATION.md`.
- Tests, CSP and deploy background: `../research/v3/infra.md`.
- Words and facts come from `src/data/*` and the insight MDX files only.

## Run it

Needs Node 22.23.4 or newer.

```bash
npm install                    # once
npm run dev                    # http://127.0.0.1:4321, staging mode (Confirm tags and draft labels visible)
npm run check                  # astro check: types and templates, must be 0 errors
```

Astro 7 allows one dev server per project: `npx astro dev status` shows the running one, `npx astro dev stop` ends it.
To look at the review-link version locally: `PUBLIC_SITE_MODE=preview npx astro dev --port 4321 --host 127.0.0.1`.

| Script | What it does |
|---|---|
| `npm run build` | staging build into `dist/` (fonts are copied first by `prebuild`) |
| `npm run build:preview` | preview build: what the Vercel review link serves |
| `npm run build:prod` | production build for kokreaters.com |
| `npm run preview` | serve `dist/` on http://127.0.0.1:4322 |
| `npm run verify` | after a build: CSP hashes → `vercel.json` + `public/_headers`, budgets, contrast, SEO/OG check |
| `npm run verify:check` | the same gates without writing anything (fails if `vercel.json` is stale) |
| `npm test` | Playwright suite against `dist/` (see Tests) |
| `npm run og` | re-render the Open Graph cards in `public/og/` (run with the mode you deploy, see below) |
| `npm run assets` | fonts + logo/favicons (`prepare-brand.mjs`) + the About map (`build-map.mjs`); outputs are committed |
| `npm run lhci` | Lighthouse CI (mobile, 3 runs) on `/`, `/about`, `/expertise/food-safety-quality`, `/insights` |
| `npm run contrast` | print the role-token contrast table for the white, grey and navy grounds |

Other scripts in `scripts/` (run by hand when their inputs change): `grade-photos.mjs` (stock originals → graded
`src/assets/photos/stock/`), `make-portrait.mjs` (founder cut-out → `ganeaysh-portrait.jpg` + square crop),
`make-profile-pdf.mjs` (→ `public/downloads/ganeaysh-kulkarni-profile.pdf`), `qa-shoot.mjs` (screenshots + overflow,
console and alt-text report: `node scripts/qa-shoot.mjs /path name --base http://127.0.0.1:4321 --widths 1440,390`),
`csp-hash.mjs`, `check-budget.mjs`, `contrast-check.mjs`, `og.mjs`, `copy-fonts.mjs`.

## Site modes

`PUBLIC_SITE_MODE` decides what a build shows. Unset means `staging`. Read through `src/lib/mode.ts`.

| Behaviour | staging (local) | preview (Vercel review link) | production (kokreaters.com) |
|---|---|---|---|
| `CONFIRM n` tags for open client questions | visible | not rendered | not rendered |
| Facts that are still missing (durations, KvK, booking URL, …) | shown as Confirm tags | element hidden | element hidden |
| Insights with `review: pending` | built and listed, with a “Draft” label | built and listed, no label | not built, not listed, not in sitemap or llms.txt |
| Impact engagements with `consent: pending` | shown | not rendered | not rendered |
| Legal “placeholder for lawyer review” note | visible | hidden | hidden |
| `/styleguide` (every primitive on every ground) | built, noindex | redirect to 404 | redirect to 404 |
| `robots.txt` / `<meta name="robots">` | `Disallow: /`, noindex | `Disallow: /`, noindex | noindex unless `PUBLIC_INDEXABLE=1`, then `Allow` + sitemap, `index, follow` |

`dist/build-info.json` records the mode of a build (`{ mode, indexable, includeDrafts, … }`); the tests and
`og.mjs check` read it.

## Environment variables

Copy `.env.example` to `.env` for local work. On Vercel set them in the project settings. All are optional.

| Variable | Effect | When empty |
|---|---|---|
| `PUBLIC_SITE_MODE` | `staging` / `preview` / `production` (table above) | `staging` |
| `PUBLIC_INDEXABLE` | `1` makes a production build indexable | noindex everywhere (safe default) |
| `PUBLIC_FORM_ENDPOINT` | contact form POSTs here (Formspree, Web3Forms or a small Worker) | the form opens a pre-filled email to office@kokreaters.com |
| `PUBLIC_NEWSLETTER_ENDPOINT` | newsletter forms POST `{ email }` as JSON here | “Subscribe” opens `mailto:office@kokreaters.com?subject=…` |
| `PUBLIC_BOOKING_URL` | “Book a 30-minute call” links to this booking page | the booking card is hidden outside staging; CTAs go to `/contact#form` |
| `PUBLIC_TURNSTILE_SITEKEY` | Cloudflare Turnstile on the contact form | honeypot and time trap only |
| `PUBLIC_ANALYTICS` | `1` shows the cookie-consent bar (no analytics script is wired yet) | no analytics, no banner |

An endpoint's origin must also be in the Content Security Policy: `scripts/csp-hash.mjs` adds the origins of
`PUBLIC_FORM_ENDPOINT` / `PUBLIC_NEWSLETTER_ENDPOINT` (and Turnstile) **from the shell environment when it runs**, so
export the same values locally before running it for a deploy.

## Tests

Playwright runs against a built `dist/` served by `astro preview` on 127.0.0.1:4330 (it never touches the dev server).
Routes are discovered from `dist/**.html`; the mode comes from `dist/build-info.json`.

```bash
npm run build:preview && node scripts/csp-hash.mjs --dist-only && npx playwright test
```

| Spec | Checks |
|---|---|
| `smoke` | every route 200, one visible h1, chrome landmarks, site.ts boots, no console errors, no third-party or failed requests, the CSP from `dist/_headers` holds; 404; robots / llms.txt / sitemap |
| `a11y` | axe-core WCAG 2.2 AA, 0 violations, every route + 404 at 1440 and 390 |
| `keyboard` | header CTA within 10 Tab stops with visible focus; skip link; `aria-current`; mega-menu and Industries dropdown (Enter, Tab in, Esc closes and returns focus, outside click); mobile menu (Esc, focus trap, scroll lock released) |
| `responsive` | no horizontal overflow or cut text at 360, 375, 390, 768, 1024, 1280, 1440 on every route |
| `reduced-motion` | nothing hidden and no running animation under `prefers-reduced-motion`; nothing hidden with JS off |
| `seo` | one h1, title ≤ 60, description ≤ 155, unique, canonical, robots per `indexable`, 1200×630 OG card per route, JSON-LD types |
| `budget` | home ≤ 600 KB transferred; every route ≤ 15 KB JS gzip, only the three v3 fonts, no GSAP/Lenis/three |
| `review-marks` | preview/production builds: no visible CONFIRM, DRAFT, “· Draft”, “Pending client consent” or lawyer note |
| `brief-guard` | none of the deleted casual asides or toy hooks; no v2 purple/pink/yellow in built CSS (logo exempt); Source Serif 4 + Inter 18px |
| `home` | exactly 8 home sections: hero, six bands, CtaBand with newsletter; all labelled |
| `chrome` | body order, footer, real newsletter forms with inline validation, header compacts on scroll |
| `iphone` | WebKit iPhone 13: every route loads without overflow; menu open/close keeps the page scrollable; a tap navigates |

`KK_BASE_URL=https://kokreaters-vercel.vercel.app npx playwright test tests/smoke.spec.ts tests/review-marks.spec.ts`
checks the deployed link (build the same mode locally first: routes come from `dist`).

## Deploy (runbook)

The live review link is the Vercel project `kokreaters-vercel` (https://kokreaters-vercel.vercel.app), deployed from a
plain copy of this folder at `/home/aryan-budukh/kokreaters-vercel/`. Vercel runs `npm run build`, so the **mode must
come from a Vercel environment variable**, and Vercel never runs `csp-hash.mjs`: the `vercel.json` you upload must have
been generated from a local build of the same mode.

```bash
cd web
npm run build:preview                 # production launch: npm run build:prod (and PUBLIC_INDEXABLE=1 on Vercel)
PUBLIC_SITE_MODE=preview npm run og   # only if headlines or insight titles changed; commit public/og/*.png
node scripts/csp-hash.mjs             # rewrites vercel.json + public/_headers from THIS build
npm run verify:check                  # budgets, contrast, SEO/OG, and vercel.json is current
npx playwright test                   # all projects
rsync -a --delete --exclude .vercel --exclude node_modules --exclude dist --exclude .astro --exclude test-results \
  --exclude .lighthouseci --exclude public/fonts --exclude .env ./ /home/aryan-budukh/kokreaters-vercel/
cd /home/aryan-budukh/kokreaters-vercel
printf 'preview' | vercel env add PUBLIC_SITE_MODE production     # once; it persists (use 'production' at launch)
vercel --prod --yes
curl -s https://kokreaters-vercel.vercel.app/robots.txt                          # Disallow: / (until launch)
curl -s https://kokreaters-vercel.vercel.app/approach | grep -c 'CONFIRM\|data-draft'    # 0
curl -sI https://kokreaters-vercel.vercel.app/ | grep -i content-security-policy        # hash = vercel.json
```

Any change to the inline head script in `src/layouts/BaseLayout.astro` changes its CSP hash: rebuild, re-run
`csp-hash.mjs`, redeploy, or every page loses its `js` class on the live site. Component scripts are never inlined
(`astro.config.mjs` `assetsInlineLimit`), so editing them does not touch the CSP.

Launch on kokreaters.com: point the domain at the Vercel project, set `PUBLIC_SITE_MODE=production` and
`PUBLIC_INDEXABLE=1`, run `npm run build:prod` + `PUBLIC_SITE_MODE=production npm run og` (removes cards of unapproved
insights) + `csp-hash.mjs` locally, deploy, and redirect `www` and the vercel.app alias to the bare domain.

## How Ganeaysh adds an insight

Insights are MDX files in `src/content/insights/`. The file name becomes the address: `my-topic.mdx` →
`/insights/my-topic`.

1. Copy an existing article, for example `src/content/insights/trans-fat-elimination-inside-a-plant.mdx`, and rename
   the copy (lower case, hyphens).
2. Edit the frontmatter between the `---` lines. All fields are checked by `npm run check` (schema in
   `src/content.config.ts`):
   - `title`, `standfirst` (one or two sentences under the headline), `description` (155 characters at most, for search
     results and link previews)
   - `pillar`: `innovation`, `process`, `quality`, `strategy`, `deals` or `capability`
   - `format`: `point-of-view`, `field-notes` or `explainer`
   - `date` (`2026-11-20`), optional `updated`
   - `image`: a photo from `src/assets/photos/stock/`, written as `"../../assets/photos/stock/lab-01.jpg"`, plus
     `imageAlt` (what the photo shows, one sentence). The slugs and subjects are listed in `src/data/photos.ts`.
   - `featured: true` puts it in the large slot on Insights and Home (the first featured one wins; otherwise the newest).
   - `status` and `review`: keep `status: draft` and `review: pending` while writing. Drafts show on the preview link
     (without a label) and in staging (with a “Draft” label), never on kokreaters.com. To publish, set
     `status: published` **and** `review: approved`. `status: coming-soon` lists only the title under “In preparation”.
3. Write the article in Markdown below the frontmatter: `## ` for a section heading, a blank line between paragraphs.
   Building blocks, imported at the top of the file as in the existing articles:
   - `<Takeaways items={['…', '…', '…']} />` the “Key takeaways” box (3 to 5 points), first in the article
   - `<PullQuote>…</PullQuote>` one sentence worth repeating
   - `<Note n={1}>…</Note>` a numbered side note
   - `<Exhibit n={1} title="…" subtitle="…" source="…">` + a Markdown table + `</Exhibit>` a numbered table/chart
   - `<ProcessChain steps={[{ name: '…', note: '…' }, { name: '…', note: '…', highlight: true }]} />` a step diagram
4. Run `npm run dev` and read it at `http://127.0.0.1:4321/insights/my-topic`. `npm run check` must report 0 errors.
5. Before it goes on the review link: `PUBLIC_SITE_MODE=preview npm run og` renders its link-preview card
   (`public/og/insights-my-topic.png`), then follow the deploy runbook.

A Git-based editor (Keystatic or Decap) or a CMS can replace these steps later (open item C-4).
