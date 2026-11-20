# Pack 2 (Ganeaysh, 20 Nov 2026): lead brief for the build units

The client's brief is `research/pack2/KoKreaters_Website_v4_Developer_Brief.md` (42 numbered items, Parts A–K).
**Read it fully. It is the source of truth for copy.** Brand files: `research/pack2/brand/`. Snippets: `research/pack2/snippets/`.
The current site is "v3 Delft" (branch `redesign/v3-delft`, Astro 7 in `web/`, preview at kokreaters-v3.vercel.app).
Keep the design system exactly (navy, Bodoni Moda headings ≥ 24px, Manrope, photos with navy gradient, square corners,
GSAP depth motion that never hides content). Pack 2 is copy, structure, brand files and a few new features.

Also from Ganeaysh: "I only reviewed the desktop layout. Check phone layouts, especially the floating chat button."
→ Every unit checks every route it owns at 390×844 and 360×740 as well as 1440, and fixes anything cramped,
overflowing or covered.

## Placeholder rule (brief: "Nothing in brackets goes live")
- Text in ⟦brackets⟧ is unconfirmed. Model it in data as `null` (or an object with `confirmed: false`).
- Render a placeholder element ONLY when `showConfirm` (from `@/lib/mode`, true in local staging only), and then
  together with a `<Confirm id="P-n" note="…" />` marker (`@/components/ui/Confirm.astro`), using the Part K number
  as `P-n`. In preview and production the element (or the whole sentence/row/section that depends on it) is
  not rendered at all. Never print bracket text.
- Sections whose content is all placeholder (testimonials, memberships/speaking rows, booking button, LinkedIn company
  link, KvK legal line) are hidden in preview/production.

## Ownership (three units run in parallel in the same tree)
- **CHROME-HOME** owns: `src/components/chrome/*`, `src/components/brand/*`, `src/components/home/*`, `src/pages/index.astro`,
  `src/data/home.ts`, `src/data/nav.ts`, `src/data/microcopy.ts`, `src/data/seo.ts`, `src/data/founder.ts`, `src/layouts/*`,
  `src/lib/*` (JSON-LD lives here or in layouts), `public/` (favicons, manifest), `scripts/og.mjs` + `scripts/og/*`,
  `scripts/prepare-brand.mjs`, `src/scripts/site.ts`, `src/scripts/chat.ts`, `src/scripts/motion.ts`, `src/styles/*` (except prose.css),
  `src/components/ui/*` EXCEPT `NewsletterForm.astro` and the new `Playbook*.astro`.
- **STORY** owns: `src/components/impact/*`, `src/components/approach/*`, `src/components/expertise/*`,
  `src/components/industries/*`, `src/components/cards/*`, `src/pages/impact.astro`, `src/pages/approach.astro`,
  `src/pages/expertise/*`, `src/pages/industries.astro`, `src/data/impact.ts`, `src/data/approach.ts`,
  `src/data/pillars.ts`, `src/data/industries.ts`, `src/data/types.ts`, `vercel.json` (redirects only; never hand-edit
  the CSP hashes), `public/og/` renames for the new slug.
- **PEOPLE-CONTENT** owns: `src/components/about/*`, `src/components/contact/*`, `src/components/insights/*`,
  `src/components/article/*`, `src/pages/about.astro`, `src/pages/contact.astro`, `src/pages/insights/*`,
  `src/pages/*.mdx` (legal), `src/content/*`, `src/data/contact.ts`, `src/data/insights.ts`, `src/styles/prose.css`,
  `src/components/ui/NewsletterForm.astro`, NEW `src/components/ui/PlaybookCard.astro` + `PlaybookModal.astro` (or one
  component), `src/scripts/pages/*`, `web/api/*` (new `subscribe.js`, `playbook.js`; keep `contact.js` and `chat.js`
  behaviour).

If you need something in a file you don't own, write it in `research/pack2/requests-<unit>.md`; the lead merges.

## Shared contracts (so units can build against each other now)
- `<NewsletterForm id="…" variant="compact" | "full" tone="light" | "dark" />` (PEOPLE-CONTENT). Footer uses compact
  (CHROME-HOME), article end and top of Insights use full. Copy from brief item 33. Endpoint `/api/subscribe`:
  Brevo double opt-in when `BREVO_API_KEY` + `BREVO_LIST_ID` + `BREVO_DOI_TEMPLATE_ID` are set; otherwise it forwards
  the sign-up to office@ through the same Resend → FormSubmit path as `/api/contact`, and the UI shows the brief's
  confirmation line. Consent tick box required.
- `<PlaybookCard variant="tile" | "band" />` (PEOPLE-CONTENT): opens the modal form (brief item 34). Endpoint
  `/api/playbook`: forwards the lead to office@ (Resend → FormSubmit) and, when `PLAYBOOK_URL` is set, emails the
  visitor the PDF link; without `PLAYBOOK_URL` the visitor email says the playbook will be sent as soon as it is
  published, and the UI still shows the brief's thank-you line. Placements: home Insights row third tile
  (CHROME-HOME), Insights page and end of 3-MCPD article (PEOPLE-CONTENT), Food safety service page (STORY).
  If the component is not there yet when you place it, finish your other work first and place it at the end.
- Service 06 (STORY, item 6): `pillars.ts` key `capability`, slug `technology-leadership`, name
  "Technology and R&D leadership, on demand", promise "A seasoned CTO or Head of R&D in your leadership team, for the
  days and months you need." 301 redirect `/expertise/capability` → `/expertise/technology-leadership` in vercel.json.
  Do this FIRST: other units link to it through `pillars`. Never hard-code the old name or slug anywhere.
- Reply-time sentence (item 2), verbatim everywhere: "Ganeaysh reads every message personally and replies within two
  working days." (home CTA band = CHROME-HOME, contact page = PEOPLE-CONTENT, chat form = CHROME-HOME.)
- Company names (item 8): Cargill and Wilmar ONLY in the founder line "Former Global Product & Process Design Director,
  Cargill" (home founder block, article author box) and on the About page. Every unit greps its own files for
  "Cargill", "Wilmar" and "Figures from our founder" and removes the rest.
- Founder lines (item 19): "Founder and Principal, KoKreaters" / "Former Global Product & Process Design Director,
  Cargill" / italic flourish "Chief Catalyst". Replace "Chief Catalyst and Founder" everywhere you own.

## Facts discipline
Use the brief's copy verbatim where it gives copy. Invent no numbers, clients or claims. British English.

## Working rules
- No git commands that change the tree (no commit/checkout/stash/reset/clean). The lead commits.
- Build into your own dir: `npx astro build --outDir dist-<unit>`; serve it with `python3 -m http.server <port> -d dist-<unit>`
  (astro preview is a shared daemon). Ports: CHROME-HOME 4711, STORY 4712, PEOPLE-CONTENT 4713. Kill by PID when done.
- Self-check: `npx astro check` 0 errors; Playwright screenshots (web/node_modules/playwright, Chrome /usr/bin/google-chrome)
  of each route you own at 1440, 390 and 360, read them, fix. Write screenshots under the scratchpad in your own
  subfolder named after your unit.
- Return a short report: done items by number, files touched, deviations, open issues, screenshot paths.
