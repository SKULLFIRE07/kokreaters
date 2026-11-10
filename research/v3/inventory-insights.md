# Inventory: Insights hub + article template (v3 rebuild input)

Snapshot: `web/` on branch `redesign/v3-editorial`, HEAD `e40a492`, read 10 Nov 2026. Read-only inventory: nothing under `web/src` was changed.
Note: other v3 agents are editing `src/data/*` right now (uncommitted: `microcopy.ts`, `home.ts`, `founder.ts`, `pillars.ts`, `impact.ts`). Line numbers below are from the files as they stood when this was written. `microcopy.ts` already says `data/notes/*` "is deleted in v3".

Files read in full: `src/pages/insights/index.astro`, `src/pages/insights/[slug].astro`, `src/components/insights/{HubHero,Filters,InsightList,ComingSoon,NewsletterFold}.astro`, `src/layouts/ArticleLayout.astro`, `src/components/article/{ArticleHeader,AuthorBox,Exhibit,Note,ProcessChain,ProgressRule,PullQuote,RouteRail,Takeaways}.astro`, all 6 `src/content/insights/*.mdx`, `src/content.config.ts`, `src/lib/{insights,reading-time,mode,format,pillars,seo}.ts`, `src/styles/prose.css`, `src/scripts/pages/{insights,article}.ts`, and these imports: `src/components/shared/{InsightRow,CoverStory,Newsletter,CtaField}.astro`, `src/components/bencho/CardFan.astro`, `src/scripts/bencho/card-fan.ts`, `src/components/ui/{Confirm,DraftRibbon,PillarTag,PillarDot}.astro`, `src/components/brand/FounderPhoto.astro`, `src/components/notes/SpecLabel.astro` (head), `src/components/seo/{schema.ts,SeoHead.astro}`, `src/layouts/BaseLayout.astro`, `src/scripts/motion/index.ts` (page loader), `src/data/{microcopy,home,founder,pillars,seo}.ts`, `src/data/notes/journal.ts`, `src/config/site.ts`, `src/pages/llms.txt.ts`, `scripts/og.mjs` (insight checks), `scripts/csp-hash.mjs`, `public/_headers`.

---

## 0. Status of every insight and how each mode filters them

| File (`src/content/insights/`) | title | pillar | format | status | review | date | words → min | Route? staging / production |
|---|---|---|---|---|---|---|---|---|
| `3-mcpd-glycidyl-esters-playbook.mdx` | 3-MCPD and glycidyl esters: a practical playbook for refiners | quality | point-of-view | **draft** | **pending** | 2026-11-04 | ~935 → 5 | yes / **no** |
| `trans-fat-elimination-inside-a-plant.mdx` | Trans-fat elimination: what it really takes inside a plant | innovation | point-of-view | **draft** | **pending** | 2026-11-04 | ~901 → 5 | yes / **no** |
| `bleaching-earth.mdx` | Bleaching earth: a small input with a big effect on oil quality and cost | process | explainer | coming-soon | pending | none | 0 | no / no (listed, unlinked) |
| `cocoa-butter-equivalents-india.mdx` | Cocoa butter equivalents in India: the opportunity and the traps | innovation | point-of-view | coming-soon | pending | none | 0 | no / no (listed) |
| `passing-pre-approval-audit.mdx` | Passing a multinational customer’s pre-approval audit: what auditors actually look for | quality | field-notes | coming-soon | pending | none | 0 | no / no (listed) |
| `refining-palm-oil-minus-25.mdx` | Refining palm oil at −25 °C: lessons from a cold-climate refinery | process | field-notes | coming-soon | pending | none | 0 | no / no (listed) |

None sets `featured`, `updated`, `image` or `imageAlt`. The 4 coming-soon stubs have `standfirst: ""` and `description: ""`.

**Mode** (`src/lib/mode.ts:7-9`): `mode = site.mode`; `site.mode` (`src/config/site.ts:10`) is `'production'` only when the env var `PUBLIC_SITE_MODE === 'production'`, otherwise `'staging'` (the default). `npm run build` = staging, `npm run build:prod` = production. The GitHub Pages workflow (`.github/workflows/pages.yml:18`) builds **staging**.

**Filters** (`src/lib/insights.ts`):
- `visibleInsights()` (l.15-20): staging keeps `status !== 'coming-soon'` (drafts included); production keeps `status === 'published' && review === 'approved'`. Sorted by `newestFirst` (l.11-12): date desc (no date = 0), tie broken by `title.localeCompare`. Both drafts are dated 2026-11-04, so 3-MCPD comes first.
- `comingSoon()` (l.23-26): `status === 'coming-soon'` in both modes. **Not sorted**: collection order, which renders alphabetically by filename (bleaching, cocoa, passing, refining).
- `featuredInsight()` (l.38-41): first visible entry with `featured: true`, otherwise `list[0]`. Today that is 3-MCPD in staging and `undefined` in production.
- `isDraft(e)` (l.44) = `status === 'draft' || review !== 'approved'`. InsightRow (l.15) and CoverStory (l.27) copy the same check inline as `status === 'draft' || review === 'pending'`.

**Result in production today:** 0 visible insights. The featured section and the filters + list do not render. No `/insights/<slug>` pages are built. Sitemap and `llms.txt` list no articles. Only the HubHero (all counts "00", "In preparation 04"), ComingSoon and the newsletter render. The brief says "Insights must not launch empty". To publish, Ganeaysh must set `status: published` and `review: approved` in the frontmatter (CONFIRM 14 "First two Insights drafts"). `scripts/og.mjs:309-313` fails a production check if an unapproved slug shows up in the sitemap, `llms.txt` or `dist`.

Editorial gap to flag: the brief (6.6) gives Point of view as "1,200–2,000 words". Both drafts are about 900–935 words.

---

## A. Route `/insights` — `src/pages/insights/index.astro`

### A1. Section order (current)
1. BaseLayout chrome: SkipLink, AnnouncementBar (links to `/insights`), Header `page="insights"`. `<main>` has **no visible breadcrumbs** (`showCrumbs={false}`, l.24).
2. **HubHero** (l.25, `components/insights/HubHero.astro`): white paper-grid band. Dateline "Insights" with a saffron dot. H1 `insights.headline` with a Scribble highlight on "plant floor" and a circle on "boardroom". Lead = `seo.description`. Caveat note "field notes, not fluff". On the right, a spinning Stamp holding the logo cluster, plus a taped SpecLabel "What’s inside": per-format counts and "In preparation" count, foot = founder name.
3. **Featured fan** (l.27-38), rendered only if `featured`: lavender band, h2 "Featured insight", note "press one to lift it". Then `CardFan`: the featured card plus up to 4 more as CoverStory `variant="fan"`, padded with in-preparation dummy cards when `padded` (l.22: `list.length < 5 && soon.length > 0`). Below that, a note "the rest of the deck is on its way".
4. **List** (l.40-49), rendered when `list.length > 0`: visually-hidden h2 "Insights", **Filters**, **InsightList** (an `<ol>` of InsightRow). Then **ComingSoon** (l.47) as taped, dashed, tilted index cards.
5. **NewsletterFold** (l.51): butter band. Newsletter (fold variant) plus note "no noise, really", and a paper-plane SVG on a dashed flight path.
6. **CtaField** (added by BaseLayout at the end of `<main>`, `layouts/BaseLayout.astro:70`).
7. Footer, CookieConsent.

### A2. DATA used (import these; do not re-type)
| Import path | Export | Fields used | Where |
|---|---|---|---|
| `@/lib/insights` | `visibleInsights`, `comingSoon`, `featuredInsight` | entry `.id`, `.body`, `.data.{title,standfirst,description,pillar,format,status,review,date,featured,image,imageAlt}` | index.astro:11,18-20 |
| `@/lib/seo` | `pageSeo('insights')` | `.title`, `.description`, `.path`, `.ogImage` (`/og/insights.png`), `.ogType` | index.astro:12,17 |
| `@/data/seo` | `seo.insights` (via pageSeo) | title "Insights on Oils, Fats and Food Ingredients \| KoKreaters"; description "Points of view and field notes on specialty fats, refining, contaminants, audits and growth in food and ingredients." | data/seo.ts:20 |
| `@/data/home` | `insights` | `.overline` ("Insights"), `.headline` ("Ideas from the plant floor and the boardroom.") | index.astro:13, HubHero:15 |
| `@/data/microcopy` | `microcopy` | `featuredInsight`, `inPreparation`, `insightsRunningHead`, `filterGroup`, `filterPillar`, `filterFormat`, `filterAll`, `insightsCount`, `readingTime`, `newsletter`, `newsletterButton`, `emailLabel`, `newsletterConsent`, `newsletterMailtoSubject`, `invalidEmail` (unused so far) | various |
| `@/data/microcopy` | `formatLabels` | `'point-of-view'`→"Point of view", `'field-notes'`→"Field notes", `explainer`→"Explainer" (microcopy.ts:83) | Filters:12, HubHero:30, ComingSoon:22, InsightRow:22, CoverStory:41 |
| `@/data/pillars` | `pillars` | `.key`, `.shortLabel` (Product / Process / Food safety / Strategy / Deals / Capability), `.name` | Filters:7,19-20, InsightRow:13 |
| `@/lib/pillars` | `getPillar`, `pillarTintGround`, `pillarHref` | `.shortLabel`, `.name`, `.slug` | ComingSoon:8, CoverStory:15 |
| `@/lib/format` | `fill`, `formatDate`, `isoDate` | `fill(microcopy.insightsCount,{n})`; `formatDate` gives "4 Nov 2026" (en-GB, UTC); `isoDate` gives "2026-11-04" | Filters:9,33; InsightRow:8 |
| `@/lib/reading-time` | `readingTime` | 220 wpm, `Math.ceil`, min 1, 0 for empty | InsightRow:9,14, CoverStory:18 |
| `@/data/founder` | `founderName` | "Ganeaysh Kulkarni" | HubHero:17 (SpecLabel foot) |
| `@/config/site` | `site` | `.newsletterEndpoint` (env `PUBLIC_NEWSLETTER_ENDPOINT`, default `''`), `.email` (`office@kokreaters.com`, CONFIRM 9) | Newsletter.astro:4,11,16 |
| `@/data/notes/journal` | `journalNotes.hub.{fluff,lift,inside,stamp,deck}`, `journalNotes.newsletter.quiet` | asides (see A4) | index.astro:15, HubHero:18, NewsletterFold:6 |

### A3. Hard-coded copy inside .astro (preserve or move to data)
- `src/pages/insights/index.astro:21` crumb label `'Insights'` (`[{ label: 'Insights', href: '/insights' }]`).
- `src/components/insights/HubHero.astro:25` `const A = 'plant floor', B = 'boardroom';` These are split keys for the scribbles, not copy. Drop them with the scribbles and render `insights.headline` plain.
- `src/components/insights/NewsletterFold.astro:8` `aria-label="Newsletter"`.
- `src/components/shared/Newsletter.astro:26` splits `newsletterConsent` on the literal `'Privacy Policy'` and links it to `href="/privacy"`.
- `src/components/shared/CoverStory.astro:46` byline literal **`Ganeaysh Kulkarni`**. It should use `founderName`, and the rebuild must not re-type it.
- `src/components/insights/ComingSoon.astro:17` and `HubHero.astro:29`: the `padStart(2,'0')` counters ("04"). These are decorative numbering and can go.
- `src/scripts/pages/insights.ts:60` fallback template `'{n}'`.

### A4. Casual asides / toy instructions to DELETE
| Verbatim | Defined | Rendered |
|---|---|---|
| "field notes, not fluff" | data/notes/journal.ts:7 | HubHero.astro:45 (MarginNote) |
| "press one to lift it" (toy instruction) | journal.ts:8 | index.astro:32 |
| "field notes · plant floor · boardroom · " (spinning stamp) | journal.ts:10 | HubHero.astro:50 |
| "the rest of the deck is on its way" | journal.ts:11 | index.astro:35 |
| "no noise, really" (named in the brief) | journal.ts:14 | NewsletterFold.astro:12 |
| "we’re all ears" (named in the brief; CTA band on every hub/article page) | data/notes/chrome.ts:17 | shared/CtaField.astro:30 |
| Scribble highlight/circle on "plant floor" / "boardroom" | HubHero.astro:41 | — |
| Scribble zigzag on "In preparation" | ComingSoon.astro:17 | — |
| Scribble circle on "together" | CtaField.astro:25 | — |

Borderline (flag):
- "What’s inside" (journal.ts:9). This is the honest-label title on the hub (HubHero:56) and the article header (ArticleHeader:63). The label goes, so the string goes too.
- `microcopy.newsletter` (microcopy.ts:13). It is now "Field notes from the plant floor and the boardroom, once a month." because a v3 agent already dropped "No noise." The brief's original bank line was "…Once a month. No noise." Keep the new line.
- `microcopy.draftRibbon` "DRAFT for Ganeaysh’s review" (microcopy.ts:37). It is staging-only, but the brief says to remove visible DRAFT labels. Decide: delete it, or keep it staging-only as a small neutral badge.
- `microcopy.inPreparation` "In preparation" (microcopy.ts:36, COMPOSED). The brief target says "Coming soon". Changing it needs a microcopy edit, and `llms.txt.ts:34` uses the same key.
- `insightsCount` "{n} insights" renders "1 insights" when one result is left. Needs a singular form.

### A5. CONFIRM / DRAFT on the hub
- No `<Confirm>` sits in the hub components themselves. CtaField (BaseLayout) renders `<Confirm id={9} note="free first call" />` (CtaField.astro:26). Footer renders `<Confirm id={11} note="KvK / VAT / registered address" />` (Footer.astro:69).
- `DraftRibbon size="sm"` renders on every draft in InsightRow:23 and CoverStory:40 (so also in the fan), only when `isStaging` (DraftRibbon.astro:8).
- `Confirm.astro:8` renders `<span class="confirm" data-confirm-id>CONFIRM {id}: {note}</span>` only `isStaging`. In production it outputs nothing.
- Staging also forces `<meta name="robots" content="noindex, nofollow">` (SeoHead.astro:17).

### A6. Behaviour that must survive (hub)
**Filters** (`components/insights/Filters.astro` + `scripts/pages/insights.ts` `initFilters`, l.53-128). This is the exact contract:
- Markup: root `<div class="filters" role="group" aria-label="Filter insights" hidden data-filters>` (Filters:14). It is server-rendered **`hidden`**, so without JS no filters show and the full list shows.
- Two rows, each a label span (`id="filter-pillar-label"` / `id="filter-format-label"`) and a `<ul role="list" aria-labelledby=…>` of `<button type="button" aria-pressed data-filter="pillar|format" data-value="…">`.
- Each row starts with "All" (`data-value=""`, `aria-pressed="true"`). Then pillar buttons for **all 6** `pillars` (`data-value={p.key}`, label `p.shortLabel` + PillarDot) and format buttons for **all 3** `formatLabels` keys. Options with zero entries are not hidden.
- Live count: `<p aria-live="polite" data-filter-status data-template="{n} insights">` with initial text `fill(insightsCount,{n: total})`.
- The rows that get filtered are `.insight-row` elements inside `[data-insight-list]`. Each `<li>` carries `data-pillar={d.pillar}` and `data-format={d.format}` (InsightRow:17). **The new card grid must keep `data-insight-list` on the container and `.insight-row` + `data-pillar` + `data-format` on each item, or the script must be updated.**
- Init: reads `?pillar=` and `?format=`, validates each against existing button values (an unknown value becomes `''`), sets `root.hidden = false`, syncs `aria-pressed`, then runs `apply(false)`.
- Click: delegated on the root. If the value already matches it does nothing. Otherwise it sets the state, syncs `aria-pressed` on every button, and calls `syncUrl()`, which uses `history.replaceState`, sets or deletes `pillar`/`format`, and keeps the hash. Then `apply(true)`.
- `apply`: AND logic (`(!pillar || r.dataset.pillar === pillar) && (!format || r.dataset.format === format)`). It toggles `r.hidden` and writes the count into the status with `template.replace('{n}', n)`.
- Animation: GSAP Flip (dynamic `import('gsap/Flip')`) only when not reduced. It ends with `ScrollTrigger.refresh()`. Under the brief this should become a simple fade or nothing; the `hidden` toggling and URL sync must stay.
- Scope: filters touch only the list. The featured card and the coming-soon list are not filtered.
- Known gaps: no empty-state message when 0 match; nothing links into `?pillar=` today (no deep links to preserve).

Other hub behaviour:
- Page script dispatch: BaseLayout puts `data-page="insights"` on `<body>` (BaseLayout:61). `scripts/motion/index.ts:117,130-133` maps that to `scripts/pages/insights.ts`, whose default export runs `initFan`, `initPlane`, `initFilters` (l.9-13). Keep `page="insights"`.
- **Newsletter** (`shared/Newsletter.astro`):
  - With `site.newsletterEndpoint` set: `<form method="post" action={endpoint} novalidate data-newsletter>`, a visually-hidden label "Email address" for `#nl-fold-email` (`type=email`, `autocomplete=email`, `required`, `aria-describedby="nl-fold-email-error"`), a submit Button "Subscribe", `<p class="field-error" id="nl-fold-email-error" hidden>`, and a consent checkbox `name="consent" required` with a Privacy Policy link.
  - With no endpoint (today): `Button href="mailto:office@kokreaters.com?subject=Subscribe%20to%20field%20notes" variant="hand"` "Subscribe".
  - **No script handles `[data-newsletter]`**. `novalidate` turns off native validation, so the error `<p>` is never filled. The brief wants a "real form", which needs a provider endpoint plus client validation (`microcopy.invalidEmail` already exists).
  - CSP (`public/_headers`, generated by `scripts/csp-hash.mjs:62-71`) only allows `form-action 'self' mailto:`. The endpoint origin is added automatically when `PUBLIC_NEWSLETTER_ENDPOINT` is set at build time.
  - The footer uses the same component (`variant="footer"`), and so does home InsightsFold.
- SEO: `pageSeo('insights')`; OG `/og/insights.png`. BaseLayout:40 pushes a JSON-LD `BreadcrumbList` (Home › Insights) from `crumbs` even though the visible crumbs are off. Canonical `https://kokreaters.com/insights`.
- A11y hooks to keep: H1 `#hub-title` is server text and never hidden (it is the LCP element). `section aria-labelledby` on each band. ComingSoon `ul aria-labelledby="soon-h"`. CardFan pad cards use `aria-hidden` + `inert`. Each cover card is clickable through a title link whose `::after` covers the card, and the image link is `tabindex="-1" aria-hidden`.
- Semantic issue to fix: the InsightRow title is a `<span class="t-h3">`, not a heading. New cards should use `<h3>`.
- `llms.txt` (`src/pages/llms.txt.ts:13-34`) lists `visibleInsights()` with `description`, plus an "In preparation" list of coming-soon titles. It is data-only and survives any visual rebuild.

### A7. Hub components/scripts that become dead
- `HubHero.astro`: Scribble, MarginNote, SpecLabel honest label, Stamp + Logo cluster, Tape, `.paper-grid`, saffron dot. The component itself can be rebuilt as a plain page header.
- `components/bencho/CardFan.astro` + `scripts/bencho/card-fan.ts` + `initFan` (insights.ts:15-19), plus the `padded` logic (index.astro:22).
- `NewsletterFold.astro` paper-plane SVG + `initPlane` (insights.ts:21-51), plus the `g-butter grain` ground.
- `ComingSoon.astro`: Tape, tilt array (l.12-13), Scribble zigzag, dashed card style, `data-reveal-group` stagger (optional).
- `Filters.astro` style: hand-circle `::after` SVG mask (l.49-54), butter hover + hard shadow, mono pills. GSAP Flip in the script.
- `InsightRow.astro`: hand-arrow `::after` mask (l.40-46), dashed rule `data-rule`.
- `CoverStory.astro`: Doodle (l.30-34) + `hash` from `notes/paths`. The `fan` variant.
- Data: `journalNotes.hub.*` and `journalNotes.newsletter.quiet` (`data/notes/journal.ts:6-15`).

---

## B. Route `/insights/[slug]` — `src/pages/insights/[slug].astro` + `src/layouts/ArticleLayout.astro`

### B1. Section order (current)
1. `[slug].astro`: `getStaticPaths()` builds from `visibleInsights()` only, so coming-soon stubs never get a page. `related` = other visible entries, **same pillar first, then the rest (newest first), `.slice(0,3)`** (l.10-15). It calls `render(entry)` to get `{ Content, headings }` and `insightReadingTime(entry)` to get minutes (l.21-22). Today each article gets **1** related item (the other draft, which has a different pillar).
2. BaseLayout `page="article"`, `pillar={d.pillar}` (sets `--pillar*` CSS vars + `data-pillar` on `<body>`), `showCrumbs={false}` (ArticleLayout:40).
3. **ProgressRule** (l.41): a fixed 4px saffron bar with a bead, scrubbed to reading progress.
4. `<article class="article" data-article data-minutes={minutes}>` (l.42).
5. **ArticleHeader** (l.43): pillar-tint band with grain.
   - Running head "KoKreaters Insights · {format}" plus "{n} min read" (`data-running-time`).
   - DraftRibbon (staging, when `isDraft`).
   - PillarTag linking to `/expertise/{slug}`.
   - H1 title, standfirst.
   - Byline: 48px avatar, name · date (or Confirm C-14) · reading time, plus note "grab a coffee".
   - Right side (≥1024 only): pillar-colour blob, spark doodle, taped SpecLabel "What’s inside" (Format / Pillar / Reading time / Written by).
6. Body grid (l.44-50): `.article__body.prose[data-article-body]` holds the MDX `<slot/>`. **RouteRail** "On this page" sits in cols 11-12 at ≥1280 and only renders when the article has 3 or more h2s (l.38). **AuthorBox** follows.
7. **Related** (l.52-61) when `related.length > 0`: cloud paper-grid band, h2 "Related insights" (`data-rise`), grid of CoverStory `variant="card" headingLevel="h3"`.
8. CtaField (BaseLayout), Footer, CookieConsent.

MDX body order (3-MCPD): intro paras → Confirm C-14 → "This is the playbook we use." → `## First, name the two problems` (+ Note 1) → `## Agree how you measure before you argue about results` → `## The four places to act` → Exhibit 1 wrapping ProcessChain → 4 bold run-in paragraphs → PullQuote → `## Where to start` → `## Treat it as a system, not a task` → `## What a good programme leaves behind` → Takeaways (5).
MDX body order (trans-fat): intro (+ Note 1) → `## Start with what the old fat was doing` → `## Bring procurement and sales in early` → `## The replacement toolbox` → Exhibit 1 wrapping a GFM table (with Confirm C-14 in one cell) → `## Do not swap one problem for another` → `## What changes on the plant floor` → PullQuote → `## What changes for the customer` → `## Prove it, then keep proving it` (+ Confirm C-14) → `## Judge it on cost-in-use, not price per tonne` → Takeaways (5).
Takeaways currently sit **at the end** of each MDX. The brief/McKinsey target puts them near the top, which needs an MDX edit (move the tag) or a frontmatter field.

### B2. DATA used
| Import path | Export | Fields | Where |
|---|---|---|---|
| `astro:content` | `render` | `{ Content, headings }` (`MarkdownHeading{depth,slug,text}`) | [slug].astro:3,21 |
| `@/lib/insights` | `visibleInsights`, `insightReadingTime`, `type Insight`, `isDraft` | as in §0 | [slug]:5, ArticleHeader:18 |
| `@/lib/seo` | `articleSeo({id,title,description})` | gives `title` (`articleTitle`: "{title} \| KoKreaters Insights" if ≤60 chars, else the bare title; **both current titles fall back to the bare title**, 83/80 chars with the suffix), `description`, `path` `/insights/{id}`, `ogImage` `/og/insights-{id}.png` (from `articleOgPattern`, data/seo.ts:37), `ogType:'article'` | ArticleLayout:15,29 |
| `@/components/seo/schema` | `article` (as `articleNode`), `type SeoProps` | JSON-LD Article: `headline`, `description` (standfirst ‖ description), `datePublished`, `dateModified` (`updated ?? date`), `author` Person `#ganeaysh`, `publisher` org, `image` (OG), `mainEntityOfPage`, `articleSection` (= `pillar.name`), `inLanguage:'en-GB'` | ArticleLayout:14,32-36 |
| `@/lib/pillars` | `getPillar`, `pillarHref`, `pillarTintGround` | `.name` (section, JSON-LD), `.shortLabel`, `.slug` | ArticleLayout:16, ArticleHeader:17 |
| `@/data/microcopy` | `microcopy`, `formatLabels` | `insightsRunningHead`, `readingTime`, `minutesLeft`, `filterFormat`, `filterPillar`, `relatedInsights`, `onThisPage`, `keyTakeaways`, `exhibit`, `source`, `draftRibbon`; new v3 keys `readingTimeLabel` ("Reading time"), `writtenByLabel` ("Written by") replace `journalNotes.article.labelTime/labelBy` | ArticleHeader:19, ArticleLayout:17, RouteRail:8, Takeaways:6, Exhibit:6 |
| `@/data/founder` | `founderName`, `founderRole` ("Founder"), `shortBio` | byline, AuthorBox | ArticleHeader:20, AuthorBox:6 |
| `@/data/home` | `founderQuote.link` | `{ label: 'Meet Ganeaysh', href: '/about' }` (home.ts:34) | AuthorBox:7,15 |
| `@/data/home` | `cta` (via CtaField) | `headline` "Have a challenge worth solving together?", `swooshPhrase`, `body` "Tell us about your product, your plant or your decision. The first conversation is free of charge." (CONFIRM 9), `button` "Book a 30-minute call" | CtaField:7 |
| `@/config/site` | `site.bookingUrl` (env `PUBLIC_BOOKING_URL`, default `/contact#form`), `site.email`, `site.linkedin` (founder profile, for a share/follow link) | CtaField | — |
| `@/lib/format` | `formatDate`, `isoDate`, `fill` | `<time datetime>` | ArticleHeader:22 |
| `@/components/brand/FounderPhoto.astro` | default | `variant="avatar"`, `size`, `ground`, `ring`, `loading`, `alt` | ArticleHeader:48, AuthorBox:10, CoverStory:45 |
| `@/data/notes/journal` | `journalNotes.article.{coffee,short,labelTime,labelBy}`, `journalNotes.hub.inside` | asides + labels | ArticleHeader:21, Takeaways:7 |
| `src/content.config.ts` | collection `insights` schema | `title` string; `standfirst` string; `description` string ≤155; `pillar` enum(innovation, process, quality, strategy, deals, capability); `format` enum(point-of-view, field-notes, explainer); `status` enum(published, draft, coming-soon); `review` enum(pending, approved), default pending; `date` coerce.date optional ("CONFIRM publication date"); `updated` optional; `author` literal 'ganeaysh'; `image` `image()` optional; `imageAlt` optional; `featured` bool, default false | — |

### B3. Hard-coded copy inside .astro
- `ArticleLayout.astro:37` crumbs `[{ label: 'Insights', href: '/insights' }, { label: d.title, href: base.path }]`.
- `ArticleHeader.astro:38` `{microcopy.insightsRunningHead} · {formatLabels[d.format]}` (the " · " separator is literal; l.51 and 53 also use " · ").
- `ArticleHeader.astro:52` `<Confirm id="C-14" note="publication date" />` (the note string is literal).
- `Exhibit.astro:13` "Exhibit " + `String(n).padStart(2,'0')` gives "Exhibit 01". `Exhibit.astro:18` `{microcopy.source}: {source}` gives "Source: KoKreaters".
- `PullQuote.astro:5` literal “ ” Caveat glyphs (aria-hidden, decorative; drop them).
- `Confirm.astro:8` literal "CONFIRM {id}: {note}".
- `src/lib/seo.ts:37` literal suffix `' | KoKreaters Insights'`.
- `scripts/pages/article.ts:56` fallback `'{n} min left'`.
- All article prose, Exhibit titles/subtitles/sources, ProcessChain steps, PullQuote text, Note text and Takeaways items live in **MDX**. That is content and must be kept verbatim (see §C).

### B4. Casual asides to DELETE (article)
| Verbatim | Defined | Rendered |
|---|---|---|
| "grab a coffee" | journal.ts:17 | ArticleHeader.astro:55 |
| "the short version" | journal.ts:18 | Takeaways.astro:13 |
| "What’s inside" (honest-label title) | journal.ts:9 | ArticleHeader.astro:63 |
| "we’re all ears" | notes/chrome.ts:17 | CtaField.astro:30 |
| Prose lead-in: first line of the first paragraph in mono caps (typewriter) | prose.css:18-24 | every article |

The MDX copy contains no jokey lines. Borderline:
- trans-fat:19 "Our founder’s trans-fat elimination work at Cargill was publicly recognised by the Director-General of the World Health Organization." It is factual brief copy; keep it. The "yes, that WHO" aside lives elsewhere (home/impact), not here.
- 3-MCPD:18 "…and everyone is frustrated." is plain and fine.

### B5. CONFIRM / DRAFT in articles
| Where | Markup | Note text |
|---|---|---|
| `3-mcpd-glycidyl-esters-playbook.mdx:22` | `<Confirm id="C-14" note="AUTHOR CHECK: cite the current EU regulation and any India requirement" />` | inline after a paragraph |
| `trans-fat-elimination-inside-a-plant.mdx:43` | `<Confirm id="C-14" note="AUTHOR CHECK" />` | **inside a GFM table cell** ("how the ingredient must be declared") |
| `trans-fat-elimination-inside-a-plant.mdx:75` | `<Confirm id="C-14" note="AUTHOR CHECK: add the limits for India and the European Union" />` | inline |
| `ArticleHeader.astro:52` | `<Confirm id="C-14" note="publication date" />` | only when `d.date` is missing (never today) |
| `CtaField.astro:26` (BaseLayout) | `<Confirm id={9} note="free first call" />` | every hub/article page |
| `Footer.astro:69` | `<Confirm id={11} note="KvK / VAT / registered address" />` | every page |
| `ArticleHeader.astro:43` | `<DraftRibbon class="a-head__draft" />` when `isDraft(entry)` | staging only |
| `CoverStory.astro:40` (related cards) | `<DraftRibbon size="sm" />` | staging only |

C-14 is defined in `DESIGN-SPEC.md` 8.2 as "`[AUTHOR CHECK]` points in the two drafts (regulatory limits, declaration rules) — visible in staging only". `mode.ts:15-30` maps brief ids 1-14 (`confirmItems`; 14 = "First two Insights drafts", 3 = "Professional portrait session", 9 = "Public email address, reply-time promise, booking tool, free first call"). Both `Confirm` and `DraftRibbon` return nothing when `isStaging` is false. The rebuild must keep `@/components/ui/Confirm.astro` with props `{ id: number|string; note?: string }`, or edit the 3 MDX call sites. Keep it inline-safe: it renders a `<span>`, and it sits inside a `<p>` and a `<td>`.

### B6. Behaviour that must survive (article)
- **Static paths and related logic**: [slug].astro:7-18 (above). The slug is `entry.id` (the filename without `.mdx`).
- **SEO** (ArticleLayout:29-37): title, description and canonical `https://kokreaters.com/insights/{id}`. `og:type=article`. `article:published_time`, `article:modified_time` and `article:section` meta tags (SeoHead:49-51). OG image `/og/insights-{id}.png`, which exists for both drafts; SeoHead:22-24 falls back to `/og/default.png` when a card is missing. JSON-LD: `[Article, BreadcrumbList]`. The Article node is passed in, and BaseLayout:40 appends the BreadcrumbList Home › Insights › {title}. `tests/seo.spec.ts:33-38,72` asserts the title rule and `['Article','BreadcrumbList']`. The visible breadcrumb is off (`showCrumbs={false}`); the brief target (a label above the headline) could turn it on with `chrome/Breadcrumbs.astro` (`nav aria-label="Breadcrumb"`, `aria-current="page"`).
- **Page script** `scripts/pages/article.ts`, dispatched by `body[data-page="article"]`:
  - RouteRail active station: an IntersectionObserver on each h2 whose id matches `[data-rail-link]`. A line at header height + 25% of the viewport picks the current one and sets `aria-current="true"` on its link (l.15-43). Under reduced motion it draws a static segment scaleY.
  - Reading progress: `progress()` (l.46-52) from `[data-article-body]`.
  - Reduced motion: `[data-running-time]` text switches to `data-label-left` ("{n} min left") on scroll (l.54-74), and `.progress-rule` is hidden (l.76-79).
  - Full motion: the progress bar `--p` and rail segment are scrubbed by ScrollTrigger (l.81-89), and ProcessChain gets a line wipe plus a node pop (l.90-98).
  - Under the v3 motion rule (fade-up + soft hovers only), the scrub, bead and ProcessChain pop are extras. The rail `aria-current` tracking is a useful, non-decorative behaviour: keep it if the rail stays.
- **Heading ids**: Astro slugs h2s (github-slugger). Examples: `first-name-the-two-problems`, `agree-how-you-measure-before-you-argue-about-results`, `the-four-places-to-act`, `where-to-start`, `treat-it-as-a-system-not-a-task`, `what-a-good-programme-leaves-behind`. RouteRail links `#${h.slug}` (RouteRail:19). The rail only shows depth-2 headings, and only when there are 3 or more (3-MCPD has 6, trans-fat has 8). Takeaways' own h2 (`#takeaways-t`) comes from a component, so it is **not** in `headings`.
- **A11y hooks**:
  - Note: `<sup class="note-ref"><a href="#note-n" id="ref-n" aria-describedby="note-n">` plus `<span id="note-n" class="sidenote" role="note">`, with a word-joiner `⁠` before the sup and `:target` highlighting.
  - Exhibit: `figure aria-labelledby="exhibit-{n}-title"`, and the body is a keyboard-scrollable region `tabindex="0" role="region" aria-labelledby` (needed for wide tables). `.exhibit__body table{min-width:520px}`.
  - RouteRail: `nav aria-label="On this page"`.
  - ProgressRule: `aria-hidden`.
  - AuthorBox: `section aria-labelledby="author-h"` with an `h2`. Related: `section aria-labelledby="related-h"`. Takeaways: `aside aria-labelledby="takeaways-t"`.
  - Article H1 is never hidden or animated (ArticleHeader doc comment). Avatar `alt=""` because the name sits next to it. The header avatar loads `loading="eager"`.
- `data-reveal` on Exhibit, PullQuote, Takeaways, AuthorBox and ComingSoon items gives the R2 fade-up (opacity 0→1, y 28→0, `scripts/motion/reveal.ts`). That matches the brief's "gentle fade-up" and can stay; `data-rise` on the Related h2 is the same.
- **Prose CSS contracts** (`src/styles/prose.css`):
  - `.prose` max-width `var(--measure-article)` (66ch), font size `--fs-article` (18→20px), line-height 1.65.
  - `.prose p > strong:first-child` styles the run-in heads that 3-MCPD:54-60 rely on ("**1. Raw material and crude oil.**").
  - Tables, `.table-wrap` overflow, `figure`/`figcaption`, `abbr[title]`, `sup`, `hr` and `blockquote:not([class])` (a plain markdown blockquote; none is used today).
  - `.prose--legal` (l.121-144) is also used by LegalLayout (out of scope). Keep it when rewriting this file.
- **Site-wide** (`public/_headers`): `img-src 'self' data:`. **Photography must be self-hosted** through `astro:assets`, because remote image hosts are blocked. `script-src` is hash-based, so share buttons must be plain links (LinkedIn share URL, `mailto:`) with no third-party widgets or inline handlers.

### B7. Article components/scripts that become dead (or need a full restyle)
- `ProgressRule.astro` and its scrub (article.ts:81-87). Flag: it is not a toy, but it is beyond the "fade-up + soft hover" rule.
- `RouteRail.astro` progress segment and bead nodes. The sticky TOC itself can stay plain.
- `ArticleHeader.astro`: MarginNote (l.55), blob (l.59), Doodle spark (l.60), Tape + SpecLabel honest label (l.61-64), pillar-tint `g-*` ground + `grain`, dashed running head.
- `PullQuote.astro`: Caveat quote marks (`--font-hand`), orchid bar, imperial colour.
- `Note.astro`: butter sticky-note card, tape `::before`, `rotate:-1deg`. Keep the markup and ARIA; restyle as a quiet footnote/sidenote.
- `Takeaways.astro`: MarginNote and the SpecLabel dependency. It can be rebuilt as a simple boxed `<ol>`, keeping `items: string[]`.
- `ProcessChain.astro`: wobbly SVG line seeded by `hash` from `@/components/notes/paths` (l.7, 12-16), the saffron sticker node and the pop animation (article.ts:90-98). **If `components/notes/` is deleted, `ProcessChain` and `CoverStory` break**: both import `hash` (and CoverStory imports `Doodle`).
- `AuthorBox.astro`: saffron grain block, rotated avatar, `variant="hand"` button.
- `prose.css`: mono lead-in (l.17-24), ringed saffron h2 node (l.37-42), pink hand-tick bullets with `stroke='%23C8457E'` (l.69-79), orchid blockquote (l.83-88), dashed hr (l.90).
- Data: `journalNotes.article.*`. labelTime and labelBy are already duplicated as `microcopy.readingTimeLabel` / `writtenByLabel`.

---

## C. MDX components used inside the six MDX files (names/props the rebuild must keep)

Each MDX imports its components **explicitly by path** (no `components` map is passed to `<Content />`). So the files `@/components/article/{Note,Exhibit,ProcessChain,PullQuote,Takeaways}.astro` and `@/components/ui/Confirm.astro` must keep those paths and prop shapes, or the MDX import lines must be edited.

| Component (import path) | Props (TS) | Children | Call sites |
|---|---|---|---|
| `Note` (`@/components/article/Note.astro`) | `{ n: number \| string }` | slot = note text (inline; it renders spans because it sits inside `<p>`) | 3-MCPD:28 `<Note n={1}>3-MCPD: 3-monochloropropane-1,2-diol. GE: glycidyl esters. DAG: diacylglycerols. FFA: free fatty acids.</Note>`; trans-fat:19 `<Note n={1}>iTFA: industrially produced trans-fatty acids, formed mainly when vegetable oils are partially hydrogenated.</Note>` (C-11 expansions) |
| `Exhibit` (`@/components/article/Exhibit.astro`) | `{ n: number \| string; title: string; subtitle?: string; source: string }` | slot = ProcessChain or a markdown table (blank lines around the table are required) | 3-MCPD:44 `n={1} title="Each lever acts at a different point in the refining chain" subtitle="Where 3-MCPD esters and glycidyl esters can be reduced, in the order we act" source="KoKreaters"`; trans-fat:37 `n={1} title="Every replacement route trades something" subtitle="Common routes to solid fat functionality without partially hydrogenated oils" source="KoKreaters"` |
| `ProcessChain` (`@/components/article/ProcessChain.astro`) | `{ steps: { name: string; note: string; highlight?: boolean }[] }` | none | 3-MCPD:45-51: 5 steps: "Raw material and crude oil" / "Chlorine precursors, FFA and DAG"; "Degumming and neutralisation" / "Washing, acid choice, precursor removal"; "Bleaching" / "Earth type, dose and acidity"; "Deodorisation" / "Temperature and time; most GE forms here" (`highlight: true`); "Post-refining" / "Adsorbents or a second, milder step" |
| `PullQuote` (`@/components/article/PullQuote.astro`) | none | slot = quote text, wrapped in `<p class="t-pull">` | 3-MCPD:64 "A contaminant that forms in the process can be managed like any other process outcome."; trans-fat:65 "A formulation is only finished when it runs on the line and lasts on the shelf." |
| `Takeaways` (`@/components/article/Takeaways.astro`) | `{ items: string[] }` | none | 3-MCPD:82-88 (5 items); trans-fat:81-87 (5 items). The brief says 3-4 points, so this is an editorial cut for Ganeaysh, or the brief allows 5 |
| `Confirm` (`@/components/ui/Confirm.astro`) | `{ id: number \| string; note?: string }` | none | 3-MCPD:22; trans-fat:43 (in a `<td>`), :75 (see B5) |
| Markdown (no component) | — | — | `##` h2s (6 / 8), no `###`; bold run-in heads `**1. …**`–`**4. …**` (3-MCPD:54-60); one GFM table, 3 columns × 5 rows: Route / What it does well / What to watch (trans-fat:39-45); curly quotes “ ” in text |

Not used by any MDX but present: `components/ui/Sidenote.astro`, `components/shared/RunIn.astro`.
Brief items with **no component yet**: wide hero image, share bar, Download PDF, numeric chart. Per spec 4.13 exhibits are qualitative "until the author supplies data".

---

## D. Mapping: brief target → data available → gaps

| Brief target | Data source(s) available | Gap / CONFIRM |
|---|---|---|
| Hub header (label, H1, lead) | `insights.overline`, `insights.headline` (`@/data/home`); `pageSeo('insights').description` | none |
| Hub featured article, large photo | `featuredInsight()`; `data.title/standfirst/description/pillar/format/date`; `getPillar().name/shortLabel`; `formatLabels`; `insightReadingTime` | **No photo**: no MDX sets `image`, and `src/assets` holds no insight photography (only the founder cut-out). No CONFIRM id covers imagery (new item). In production `featuredInsight()` is `undefined`, so the empty state needs a design. `featured: true` is never set |
| Hub card grid: photo, label, title, one-line summary, date, read time | `visibleInsights()`; label = `formatLabels[format]` and/or `getPillar(pillar).shortLabel`; summary = `description` (≤155) or `standfirst`; `formatDate(date)` + `isoDate`; `fill(microcopy.readingTime,{n})` | photo (as above); date missing gives `Confirm C-14` (header only) |
| Pillar + Format filters | `pillars` (`key`, `shortLabel`); `formatLabels`; `microcopy.filterGroup/filterPillar/filterFormat/filterAll/insightsCount`; script contract in A6 | no empty-state copy; "1 insights" plural |
| Newsletter as a real form | `Newsletter.astro` (form markup exists); `site.newsletterEndpoint` (`PUBLIC_NEWSLETTER_ENDPOINT`); `microcopy.newsletter/newsletterButton/emailLabel/newsletterConsent/invalidEmail` | **No provider or endpoint** (mailto fallback today); no validation/submit JS; no success-message copy for the newsletter (only `formSuccess` exists, and that is for the contact form). Nearest CONFIRM is 9 (public email); no id for the newsletter provider |
| Hide In-preparation, or a small "Coming soon" list | `comingSoon()`: `title`, `format`, `pillar` | the label is "In preparation" (`microcopy.inPreparation`); "Coming soon" needs new copy; the list is not sorted |
| Article label | `getPillar(pillar).name` / `.shortLabel` + `pillarHref()` link; `formatLabels[format]`; `microcopy.insightsRunningHead` | none |
| Headline / standfirst | `data.title`, `data.standfirst` | none |
| Byline: small photo, date, read time | `FounderPhoto variant="avatar"` (`src/assets/photos/ganeaysh-cutout-square.png`); `founderName`, `founderRole`; `data.date`; `minutes` | CONFIRM 3 (professional portrait session); date marked "CONFIRM publication date" (content.config.ts:15 / C-14) |
| Wide hero image | `data.image` + `data.imageAlt` exist in the schema (`image()`), and CoverStory renders them | **ArticleHeader does not render `image` at all**; no images supplied |
| Key takeaways box (3-4 points) | `<Takeaways items>` in MDX; `microcopy.keyTakeaways` | 5 items each; placed at the end, not the top |
| Body: subheadings, pull quotes, charts/tables | MDX `##`, `PullQuote`, `Exhibit` + `ProcessChain` / table; `microcopy.exhibit`, `microcopy.source` | no numeric chart data (spec 4.13); 3 × C-14 AUTHOR CHECKs open |
| Share (LinkedIn, email) | canonical URL from `articleSeo().path` + `site.url`; `data.title`, `data.description` | **No component and no microcopy** ("Share", "Share on LinkedIn", "Email"). Must be plain links (CSP) |
| Download PDF | none | **Nothing exists** (no PDF build, no print stylesheet, no copy). Needs a decision |
| Author box | `founderName`, `founderRole`, `shortBio` (`@/data/founder`); `founderQuote.link` ("Meet Ganeaysh" → `/about`); FounderPhoto 96px | CONFIRM 3 portrait |
| Related insights | `related` prop (same pillar first, max 3); `microcopy.relatedInsights` | only 1 related per article today; 0 in production |
| CTA band | CtaField via BaseLayout; `cta.headline/body/button` (`@/data/home`), `site.bookingUrl`, `site.email` | CONFIRM 9 (free first call / booking tool) |
| On-this-page nav (not in the brief, exists) | `headings` (depth 2), `microcopy.onThisPage` | optional in the new design |
| Sidenotes (not in the brief, exist) | `Note` | restyle as footnotes |

Also: pillar colours in `src/data/pillars.ts` (`hex` #2C509E, #5B2A86, #C8457E, #F4C841, #8C5B88, #4C9BE8) feed `--pillar-*`, `PillarDot`, `PillarTag`, the article header tint and the CoverStory ground. Purple, pink and yellow conflict with the v3 palette. In the rebuild the pillar should be a text label, not a colour code. `PillarDot` is used in Filters, InsightRow, CoverStory, ComingSoon and CardFan.

---

## E. Shared components the hub/article rebuild touches outside this scope
- `components/shared/CoverStory.astro` is also used by `components/home/InsightsFold.astro` and `components/expertise/RelatedInsights.astro`. `CardFan` uses it too.
- `components/shared/InsightRow.astro` is used by `components/insights/InsightList.astro` only. ExpertisePanel and home do not import it.
- `components/shared/Newsletter.astro` is used by NewsletterFold, `home/InsightsFold.astro` and `chrome/Footer.astro`.
- `@/lib/insights` is also imported by `components/chrome/ExpertisePanel.astro:14` (`visibleInsights, formatLabel, insightReadingTime, insightHref, isDraft`), `components/home/InsightsFold.astro:15`, `pages/expertise/[slug].astro:23` (`byPillar`, `comingSoonByPillar`) and `pages/llms.txt.ts:6`. **Do not rename these exports.**
- `scripts/og.mjs` reads insight frontmatter with its own YAML subset parser (l.48-63). Keep frontmatter as simple `key: value` lines.
- `@fontsource-variable/inter` and `@fontsource-variable/source-serif-4` are already in `package.json` (added by v3); Caveat and Plex Mono are still installed.

---

## F. Images currently used (hub + article)
| Asset | Path | Used by |
|---|---|---|
| Founder square avatar | `src/assets/photos/ganeaysh-cutout-square.png` (`astro:assets` Picture, AVIF/WebP + PNG) | ArticleHeader (48px, eager), AuthorBox (96px), CoverStory (40px) |
| Founder cut-out (not used here) | `src/assets/photos/ganeaysh-cutout.png` | — |
| Logo node cluster | `src/assets/brand/svg/kokreaters-node-cluster.svg` (Logo `variant="cluster"`) | HubHero stamp (dead); CtaField sticker |
| Grain texture | `src/assets/fx/grain.png` (`.grain::after`, `styles/grounds.css:56-62`) | NewsletterFold, ArticleHeader, AuthorBox, CtaField (dead) |
| OG cards | `public/og/insights.png`, `public/og/insights-3-mcpd-glycidyl-esters-playbook.png`, `public/og/insights-trans-fat-elimination-inside-a-plant.png`, fallback `public/og/default.png` (built by `npm run og`) | og:image, twitter:image, JSON-LD Article `image` |
| Inline SVG / data-URI decoration (dead) | Filters hand-circle mask (Filters:51-52); InsightRow arrow mask (InsightRow:43-44); prose tick bullet `stroke=%23C8457E` (prose.css:78); NewsletterFold plane (l.15-22); ProcessChain line (l.18); paper-grid background | — |
| Frontmatter `image` | none set in any MDX | CoverStory `<Image widths=[480,720,960] sizes="(min-width:1024px) 58vw, 100vw">` if present |
| Fonts tied to toys | Caveat (`--font-hand`) for PullQuote marks + MarginNotes; IBM Plex Mono for prose lead-in, tables, filters, notes | to be replaced by Source Serif 4 + Inter |
