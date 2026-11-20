# Pack 3 (Ganeaysh's v3 review, 20 Nov 2026): lead brief for the build units

Client brief: `research/pack3/developer-brief.txt` (14 pages; the PDF's rendered pages are `page-01.png` … `page-14.png`,
read pages 3–4 for the logo in use). Logo files: `research/pack3/kokreaters-logo-A/` (svg, png, favicon).
**Read the whole brief.** It is the source of truth for copy and decisions.

**Owner's instruction on top: "keep it very sharp, not too much text, good visuals."** Cut words wherever the brief
allows. Prefer icons, diagrams, photos, numbers and short lines over paragraphs. Every section must earn its place.

The site is the "v3 Delft" Astro 7 build in `web/` (branch `redesign/v3-delft`) with pack 2 already in. Keep the design
system: navy / Deep Delft / saffron / Porcelain / Ice, Bodoni Moda + Manrope, photos with navy gradient, square
corners, GSAP depth motion that never hides content. Earlier briefs: `research/v4/BUILD-BRIEF.md`, `research/pack2/LEAD-BRIEF.md`
(ownership pattern, placeholder rule `showConfirm` + `<Confirm id>`, working rules) — the same rules apply.

## Lead decisions (apply them, don't re-ask)
1. **Draft career figures** (brief "Make 25 years felt" point 3: 3,000 t/day, 500 t/day, 100 t/day, 100 people,
   40 people, 30 people): editable content in `src/data/career.ts` with `status: 'draft'`. Render in staging and
   preview (Ganeaysh reviews them there); in production render only items with `status: 'confirmed'`.
   No counting animation on any figure.
2. **Booking link**: `site.bookingUrl` (env `PUBLIC_BOOKING_URL`, default null). Every "Book a 30-minute call"
   button uses `bookingHref()` = bookingUrl ?? '/contact#start'. Contact shows the calendar block only when the URL exists.
3. **Grid**: content max width 1200px (brief), backgrounds and photos stay full-bleed, heroes stay full-screen.
4. **Typography**: Bodoni Moda only at 28px and up; Manrope for labels, buttons, table numbers and anything under 28px.
   Body 18px / 1.6, max 70ch. Big numbers: Bodoni lining figures, one size 72–80px desktop, unit in Manrope beside it.
5. **Chat assistant**: off by default (`PUBLIC_CHAT` default "off"; "on" turns it back on).
6. **One social share image** for every page: `kokreaters-logo-A/png/kokreaters-social-share-1200x630.png`.
7. **Footnote** (exact): "Results delivered by Ganeaysh Kulkarni in senior roles at global agri-food companies. Client
   and employer details are kept confidential." At most once per page; remove every "From our founder's 25-year career,
   before KoKreaters." Never show a founding year.
8. **Titles** (exact order everywhere): "Founder and Principal, KoKreaters" / "Former Global Product & Process Design
   Director, Cargill" / "Chief Catalyst" only as a small italic flourish in the home founder block and on About.
9. **Logo alt**: "KoKreaters: Connect, Collaborate, Create"; header link aria-label "KoKreaters home". Never on a photo.
10. Placeholders (KvK, VAT, booking, testimonials, memberships, talks, LinkedIn company, YouTube, founder email, photos,
    capability-statement PDF): build the slot, render only in staging with `<Confirm>`, hidden on preview/production.
11. Newly composed copy (where the brief asks for a line but gives no words, e.g. "questions we help answer"): short,
    factual, no claims or numbers that are not in the brief or data; mark it `// COMPOSED` in data files.

## Ownership (three units in parallel, same tree)
- **CHROME-HOME**: `src/components/{chrome,brand,home,seo}/*`, `src/components/ui/*` (except NewsletterForm, Playbook*),
  `src/pages/index.astro`, `src/data/{home,nav,microcopy,seo,founder,career}.ts` (career.ts new: the six figures +
  credentials + languages, used by Home and About), `src/layouts/*`, `src/lib/*`, `src/config/site.ts`, `src/env.d.ts`,
  `public/`, `scripts/og*`, `scripts/prepare-brand.mjs`, `src/scripts/{site,chat,motion}.ts`, `src/styles/*` (except prose.css),
  `src/components/chrome/CookieConsent.astro` + `src/scripts/consent.ts`.
  Items: bugs 1–4, 6; logo A + favicons + OG (delete the K-mark files); header (full nav from 1024px: Expertise ·
  Industries · Impact · Insights · About + solid "Book a call"; mega-menu under Expertise with six services and six
  industries; shrinks to the no-tagline logo on scroll; desktop logo 60–64px, mobile/scrolled 36–40px); footer (four
  columns, white logo with tagline, company line slot); floating WhatsApp button on mobile only; cookie banner
  "Reject all" as prominent as "Accept"; type/number/grid tokens; motion (no counters); Home in the brief's nine-section
  order with founder strip, six-tile track record (no "8 sites · 5 countries" line break: split as the brief says),
  services with icons, impact three + footnote, credentials strip + testimonial slot, industries, insights + playbook,
  CTA; "Where we help now" line; hero eyebrow and buttons; optional Plausible (env `PUBLIC_PLAUSIBLE_DOMAIN`, off by
  default, events: book-call, form-send, playbook-download); JSON-LD per the brief.
- **STORY**: `src/components/{expertise,industries,approach,impact,cards}/*`, `src/pages/{expertise/*,industries.astro,
  approach.astro,impact.astro}`, `src/data/{pillars,industries,approach,impact,types}.ts`, `vercel.json` redirects.
  Items: Expertise overview (who it is for, typical engagement per service); six service pages (one specific offer +
  Book a call at the end, hide "In preparation" cards, the per-page additions in the brief); Industries (fold the five
  "Also" into cards or give them cards; three "questions we help answer" each; one linked story where one exists);
  Approach ("How we engage" as the main section with duration and outcome per model; the FAQ fees answer verbatim);
  Impact (footnote once at the top; one photo per story from `src/data/photos.ts`; WHO "Verify" as a proper source
  link; strip with career figures 1, 2, 4 from `career.ts` + 21%, 15%, −25 °C; fix the duplicated filter rows so one
  set shows per screen size).
- **PEOPLE-CONTENT**: `src/components/{about,contact,insights,article}/*`, `src/pages/{about.astro,contact.astro,
  insights/*,*.mdx}`, `src/content/*`, `src/data/{about,contact,insights}.ts`, `src/styles/prose.css`,
  `src/components/ui/{NewsletterForm,Playbook*}.astro`, `src/scripts/{forms.ts,pages/*}`, `web/api/*`.
  Items: About (fix the phone hero headline cut off mid-animation; timeline starts at 2001 with one achievement line
  per step; education as a separate small block; new logo beside Ko + Kreaters; credentials strip and languages from
  `career.ts`; "Who he has worked alongside" naming organisation types; downloadable short bio PDF + high-res portrait
  link); Contact (booking first when the URL exists; required fields only Name, Email, Company, Message — update
  `api/contact.js` validation and its tests; Country and Area optional; show "CET, the Netherlands" and the reply
  promise); Insights (hide "coming soon" cards; byline with photo and title on every article; "Related service" box at
  the end); legal pages (processor named; company details slot).

If you need a change in a file you don't own, write it in `research/pack3/requests-<unit>.md`.

## Working rules
- No git commands that change the tree. The lead commits.
- Build into your own dir with `npm run build -- --outDir dist-<unit>` is NOT supported; use
  `node scripts/copy-fonts.mjs && node scripts/build-knowledge.mjs && npx astro build --outDir dist-<unit>` and serve
  with `python3 -m http.server <port> -d dist-<unit>`. Ports: CHROME-HOME 4811, STORY 4812, PEOPLE-CONTENT 4813.
  Kill servers by PID.
- Self-check: `npx astro check` 0 errors (yours); Playwright screenshots (web/node_modules/playwright, Chrome at
  /usr/bin/google-chrome) at 1440, 1030 (the width Ganeaysh reviewed at), 390 and 360 for every route you own, read
  them and fix. Screenshots under the scratchpad in a subfolder named after your unit.
- Return a short report: items done, files touched, deviations, open issues, screenshot paths.
