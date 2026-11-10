# Inventory: Expertise hub + six pillar pages (v3 rebuild, read-only)

Repo: `/home/aryan-budukh/Desktop/ganeshkaka-folder/web` (branch `redesign/v3-editorial`). All paths below are relative to `web/`.
Files read in full: `src/pages/expertise/index.astro`, `src/pages/expertise/[slug].astro`, `src/components/expertise/*` (Deliverables, HelpList, IntroMore, PillarDiagram, PillarHero, PillarMap, PromptRow, RelatedInsights, abbr.ts), `src/components/shared/PillarCard.astro`, `src/components/shared/ExpertiseIndex.astro`, `src/data/pillars.ts`, `src/lib/pillars.ts`, `src/lib/mode.ts`, `src/components/ui/Confirm.astro`, plus every module they import (`src/data/notes/expertise.ts`, `src/data/impact.ts`, `src/data/microcopy.ts`, `src/data/types.ts`, `src/lib/insights.ts`, `src/lib/seo.ts`, `src/data/seo.ts`, `src/components/seo/schema.ts`, `src/layouts/BaseLayout.astro`, `src/components/chrome/Breadcrumbs.astro`, `src/components/bencho/HubDiagram.astro`, `src/components/bencho/SpecInspector.astro`, `src/scripts/pages/expertise.ts`, `src/scripts/bencho/spec-inspector.ts`, `src/components/notes/{SpecLabel,MarginNote,Scribble,Venn,Tape,Doodle,Stamp}.astro`, `src/components/shared/{ImpactCard,CoverStory,RunIn,CtaField}.astro`, `src/components/ui/{Sidenote,PillarDot,TextLink,DraftRibbon,Button}.astro`, `src/lib/typography.ts`, `src/lib/format.ts`, `src/content.config.ts`, all 6 insight MDX frontmatters, `src/data/industries.ts`) and `src/components/home/PlantPipeline.astro` + its data.

> **Concurrent v3 data migration (observed in the working tree while this inventory was written, uncommitted):** `src/data/notes/*` is slated for deletion in v3 and its keepers are moving into data modules. New exports to import instead of `expertiseNotes`:
> - `pillarExhibits` in `src/data/pillars.ts` — `Record<PillarKey, { title; steps: string[]; from?; to?: string[] }>`; process = `{ title: 'Crude oil in, customer specification out', from: 'Crude', steps: ['Degumming','Bleaching','Deodorisation','Fractionation','Interesterification'], to: ['Spec'] }` (replaces `expertiseNotes.diagram.*`, minus "scroll, it draws itself").
> - `figureFallback` in `src/data/impact.ts` — `{ india: '1st', tfa: 'WHO' }` (replaces `expertiseNotes.record.indiaFigure` and the hard-coded `tfa: 'WHO'` at `[slug].astro:41`).
> - `microcopy.expertiseAreas: 'The six areas of expertise'` (was `expertiseNotes.hub.label`), `microcopy.otherExpertise: 'Other areas of expertise'` (replaces "the other five"), `microcopy.readMore: 'Read more'` (replaces "Read the full note").
> - `cta.body` in `src/data/home.ts` now ends "The first conversation is free of charge." (was "is on us"; still CONFIRM 9).
> Wherever this file cites `expertiseNotes.*` as a source to keep, read it as the new export above.

---

## 0. Quick facts

| key | slug | n | name | promise (= headline) | helpWith | deliv. | impactId → figure | related insights (staging / production) | coming-soon | industries (via `industries[].pillars`, C-10) |
|---|---|---|---|---|---|---|---|---|---|---|
| innovation | product-innovation | 1 | Product and Category Innovation | From unmet need to a product that scales. | 5 | 5 | `india` → `'1st'` (`expertiseNotes.record.indiaFigure`, DERIVED) | `trans-fat-elimination-inside-a-plant` (draft) / none | `cocoa-butter-equivalents-india` | confectionery, bakery, dairy-nutrition, plant-based, snacks-food-service, personal-care-oleochemicals, pet-food-animal-nutrition |
| process | process-design | 2 | Process Design and Plant Performance | Plants that run better, cost less and grow with you. | 5 | 5 | `ukraine` → `minus25` ('−25 °C') + secondary `'15%'` | none / none | `bleaching-earth`, `refining-palm-oil-minus-25` | confectionery, bakery, snacks-food-service, edible-oils-specialty-fats, personal-care-oleochemicals, pet-food-animal-nutrition |
| quality | food-safety-quality | 3 | Food Safety, Quality and Contaminants | Pass the audit. Protect the brand. Stay ahead of the regulation. | 5 | 5 | `tfa` → `'WHO'` (hard-coded, `[slug].astro:41`) | `3-mcpd-glycidyl-esters-playbook` (draft) / none | `passing-pre-approval-audit` | dairy-nutrition, edible-oils-specialty-fats |
| strategy | strategy-feasibility | 4 | Strategy, Feasibility and Market Entry | Clear answers for Go/No-Go decisions. | 5 | 4 | none (C-8) | none / none | none | industrial-minerals |
| deals | due-diligence | 5 | M&A, Due Diligence and Partnerships | See what is really behind the deal. | **4** | 4 | none (C-8) | none / none | none | **none** |
| capability | capability | 6 | Capability, Leadership and Transformation | Leave stronger teams behind. | 5 | 5 | `indonesia` → `'21%'` (`result.figure.value`) | none / none | none | **none** |

Production rule: `visibleInsights()` keeps only `status==='published' && review==='approved'`; all 6 insights are `draft`/`coming-soon` + `review: pending`, so in production **no pillar page shows a linked insight card**; innovation/process/quality show only unlinked "In preparation" titles; strategy/deals/capability omit the section.

---

## 1. Current section order (what each renders)

### 1a. `/expertise` — `src/pages/expertise/index.astro`
`<BaseLayout page="expertise" seo={pageSeo('expertise')} breadcrumbs={crumbs} showCrumbs={false}>` (`:23`)
1. **Header band** `section.band.fold.g-white.paper-grid.x-head.has-notes` (`:24-39`): `<Breadcrumbs>`; dateline dot + `expertiseOverview.overline` ("Expertise"); `<h1 id="expertise-title">` = headline split on `'connects'` with `<Scribble kind="swoosh" tone="orchid">connects</Scribble>` (`:20,:30`); `<IntroMore html={expertiseOverview.intro}>` (first sentence + `<details>` rest); `<Venn labels={['science','plants','strategy']} centre="that’s us">`; `<MarginNote text="they’re designed to work together">`.
2. **Hub band** `section.g-ink.grain.x-hub` (`:41-43`): `<HubDiagram headingId="hub-title">` — outlined "06", `<h2 id="hub-title">The six areas of expertise</h2>`, hover/tap captions (name + promise per pillar), spinning `<Stamp>` ring of shortLabels around the logo cluster, six disc links `/expertise/{slug}`.
3. **Grid band** `div.g-white.x-grid.has-notes` (`:45-54`): `<MarginNote text="six blocks, one team">`; `ul.x-grid__list` of six `<li data-sticker style="--i:n"><PillarCard pillar={p} variant="rail" /></li>`, 3-col with staggered `translate` on middle column. **No heading** for this section (the hub h2 above is its only label).
4. **Prompt band** `<PromptRow />` (Butter): `<h2 id="prompt-title">Not sure where you fit?</h2>`, `<MarginNote text="start anywhere">`, `<Button href="/contact">Start a conversation</Button>`, `<Doodle kind="star">`.
5. **CtaField** (from BaseLayout, every page except contact/legal/404): h2 "Have a challenge worth solving together?" (Scribble circle on "together"), body + `<Confirm id={9} note="free first call" />`, Button "Book a 30-minute call" → `site.bookingUrl`, mailto link, MarginNote "we’re all ears", logo sticker, MagneticDots canvas.
6. Footer (global).

### 1b. `/expertise/[slug]` — `src/pages/expertise/[slug].astro`
`getStaticPaths = pillars.map(p => ({ params:{slug:p.slug}, props:{pillar:p} }))` (`:28`). `<BaseLayout page="pillar" pillar={pillar.key} seo={pageSeo(pillar.slug)} breadcrumbs={crumbs} showCrumbs={false}>` (`:49`).
1. **Hero** `<PillarHero pillar crumbs introHtml={intro.html} introNotes={intro.notes}>` (`:50`): giant outlined numeral `data-parallax="-0.15"`; `<Breadcrumbs>`; dateline `PillarDot` + "0n of 06 · Expertise"; eyebrow `<p>` = `pillar.name`; `<h1 id="pillar-title">` = `pillar.headline`; `<IntroMore>`; one `<Sidenote>` per abbr note (quality: FSQR); right column `<PillarMap current>` constellation (5 other pillars as links).
2. **Signature diagram** `section.g-ink.grain.p-diag aria-label={pillar.name}` (`:52-54`): `<PillarDiagram>` figure: caption "fig. 0n" + title, scroll-scrubbed SVG (aria-hidden), positioned labels, MarginNote "scroll, it draws itself", `<ol class="pd__steps">` (sr-only ≥768, visible legend <768).
3. **What we help with** `section.g-white.paper-grid.p-help` (`:56-58`): `<HelpList pillar items={help} fig>`: `<h2 id="help-title">What we help with</h2>` (sticky ≥1024), hand-circled count "05", `<SpecInspector>` wrapping `<SpecLabel>` titled "What’s inside" / "Nothing hidden", rows 01..0n = helpWith HTML (+ abbr notes), foot "Contents may vary with your plant.", toggle "Inspect the label", hint "drag the frame over the label".
4. **Typical deliverables** `section.g-{pillarTintGround}.grain.p-deliv` (`:60-62`): `<Deliverables items={pillar.deliverables}>`: `<h2 id="deliverables-title">Typical deliverables</h2>`, MarginNote "what lands on your desk", `<RunIn variant="stickers">` rotated pill per deliverable (first letter capitalised by `cap()`).
5. **From the record** (only if `result`) `section.g-white.p-record` (`:64-77`): `<h2 id="record-title">From our founder’s career</h2>` (dateline style), MarginNote "one for the record", `<TextLink href="/impact#{id}">See the impact</TextLink>`, `<ImpactCard size="lg" border={pillar.key} figure secondary>` rotated −1.5° with hard pillar shadow.
6. **Related insights** (only if `hasRelated`) `section.g-cloud.p-related` (`:79-83`): `<RelatedInsights visible={related} coming={coming}>`: `<h2 id="related-title">Related insights</h2>`; ≤3 `CoverStory variant="card" headingLevel="h3"` rotated; else "In preparation" + taped dashed unlinked titles.
7. **Prompt band** `<PromptRow ground={promptGround}>` (`:85`; Lavender instead of Butter only if no result, no related and tint is butter → i.e. strategy).
8. **CtaField** (BaseLayout) + Footer.

### 1c. Components
- `PillarCard.astro`: single `<a href="/expertise/{slug}" class="pcard pcard--{variant} g-{pillarGround} grain" data-edge-light data-pillar>`; top "0n / 06" + PillarDot; `<h3 class="pcard__promise">{promise}</h3>`; `<p class="pcard__name t-label">{name}</p>`; compact `SpecLabel` rows [variant grid: help-with first 3 + `moreLabel`] + "Typical deliverables: a · b · c" + (if result) "From our founder’s career: {dateline}" strong; faux pill `<span class="t-hand">Learn more</span><Arrow hand>`. Hover lift −6px + rotate ±1°. Also used on **home** `src/components/home/WhatWeDo.astro:49` (`variant="rail"`).
- `ExpertiseIndex.astro`: **orphan (imported nowhere)**. v1 `<ol class="x-index" data-reveal-group>` of rows: `pad2(n)`, PillarDot, `name` (t-h1 overview / t-index home), `promise`, optional first 2 helpWith, Arrow; hover top rule in pillar colour. Calm index-row pattern; candidate to revive or delete.
- `PillarHero`, `PillarMap`, `PillarDiagram`, `HelpList`, `Deliverables`, `RelatedInsights`, `PromptRow`, `IntroMore`: as above.

---

## 2. DATA exports the rebuild must import (do not re-type copy)

### `@/data/pillars` (`src/data/pillars.ts`)
- `pillars: Pillar[]` — fields: `key`, `slug`, `n`, `name`, `promise`, `headline` (identical to `promise` on all six), `intro`, `helpWith: string[]`, `deliverables: string[]` (sentence-continuation case: only item 1 capitalised; capitalise with `cap()` as `Deliverables.astro:11` does), `colourVar`, `hex`, `inkText`, `impactId?`, `shortLabel` (used by /insights filters, CoverStory format line, PillarMap/Hub labels).
- `expertiseOverview` — `overline: 'Expertise'`, `headline: 'Expertise that connects science, plants and strategy.'`, `intro` (3 sentences), `prompt: { text: 'Not sure where you fit?', link: { label: 'Start a conversation', href: '/contact' } }`.
- `pillarPage` — `helpWith: 'What we help with'`, `deliverables: 'Typical deliverables'`, `fromTheRecord: 'From our founder’s career'`.
- `heroNodeLabels` — not used on these routes (home HeroNetwork only).

### `@/lib/pillars` (`src/lib/pillars.ts`)
- `pillarNumber(p)` → "01".."06" (used: PillarHero, PillarMap, HubDiagram, PillarCard, PillarDiagram, `[slug].astro:57`).
- `pillarHref(key)` → `/expertise/{slug}` (use for links instead of template strings).
- `getPillar(key)`, `getPillarBySlug(slug)`, `isPillarKey(v)`, `pillarKeys`, re-export `pillars`.
- `pillarStyle(key)` / `pillarVars(key)` → `--pillar`, `--pillar-tint`, `--pillar-text` on `<body>` (BaseLayout `:42,:61`).
- `pillarGround(key)` (sapphire/violet/orchid/saffron/mauve/sky) and `pillarTintGround(key)` (ice/lavender/blush/butter/blush/ice) — colour-block grounds; become dead under the navy/grey palette.

### `@/data/impact`
- `founderResults: FounderResult[]` — fields `id` ('india'|'indonesia'|'ukraine'|'tfa'), `dateline`, `homeLine`, `emphasis`, `context`, `outcome`, `challenge|null`, `done|null`, `result|null`, `figure?{value,source,frost?}`, `pillars`, `sectors`. Page looks up `founderResults.find(r => r.id === pillar.impactId)` (`[slug].astro:40`).
- `secondaryFigures` — `{ ukraine: '15%' }`.
- `engagements` (not used here; anonymised, `consent: 'pending'` C-12): `eu-minerals` → strategy; `in-specialty-audit` → quality; `n-india-contaminants` → quality+innovation. Only potential future proof for **strategy**.

### `@/data/microcopy`
- `microcopy.pillarLink: 'Learn more'`, `impactLink: 'See the impact'`, `relatedInsights: 'Related insights'` (COMPOSED), `inPreparation: 'In preparation'` (COMPOSED), `notSureWhereYouFit: 'Not sure where you fit?'` (duplicate of `expertiseOverview.prompt.text`), `primaryCta: 'Start a conversation'`, `bookingCta`, `allExpertise: 'All expertise'` (COMPOSED, unused here; good label for a back link), `relevantExpertise`, `exhibit: 'Exhibit'` (COMPOSED; calmer replacement for "fig. {n}"), `readingTime`, `draftRibbon`, `homeCrumb: 'Home'`.
- `formatLabels` — insight format labels.

### `@/data/notes/expertise` (`expertiseNotes`) — keys worth KEEPING
- `diagram.processTitle: 'Crude oil in, customer specification out'`, `diagram.processEnds: ['Crude','Spec']`, `diagram.process: ['Degumming','Bleaching','Deodorisation','Fractionation','Interesterification']` → exactly the brief's static refining flow.
- Other diagram data (DERIVED restatements of pillar copy): `innovationTitle` + `innovation[5]`; `qualityTitle` + `quality[3]` + `qualityEnds['Risk','Your brand']`; `strategyTitle` + `strategy[3]` + `strategyEnds['Your idea','Go','No-Go']`; `dealsTitle` + `dealsTop` + `deals[3]`; `capabilityTitle` + `capability[3]` + `capabilityEnd`.
- `record.indiaFigure: '1st'` (DERIVED figure for India card).
- `hub.label: 'The six areas of expertise'` (UI; usable as the grid's h2 or visually hidden heading).
- `industries.*` — used by `/industries` (out of scope; do not delete the group).
- Everything else in this file is NOTE/toy copy → section 4.

### `@/lib/insights`
- `byPillar(key)` (visible = staging: all non-coming-soon incl. drafts; production: published+approved), `comingSoonByPillar(key)`, `insightHref(e)`, `isDraft(e)`, `formatLabel(e)`, `insightReadingTime(e)`; type `Insight = CollectionEntry<'insights'>` (fields `title, standfirst, description, pillar, format, status, review, date?, updated?, author, image?, imageAlt?, featured`).

### `@/data/industries`
- `industries: Industry[]` fields `slug, n, name, copy, pillars, image?, imageAlt?` — filter `i.pillars.includes(pillar.key)`; link target `/industries#{slug}` (anchor id at `src/components/industries/SectorSection.astro:15`). Mapping is COMPOSED (C-10). `industriesPage.relevantExpertise`.

### SEO / schema
- `pageSeo(key)` from `@/lib/seo` (keys `'expertise'` and each pillar slug) → `{title, description, path, ogImage, ogType}`; strings in `src/data/seo.ts:17,24-29` (length-asserted at import: title ≤60, description ≤155). Pillar entries are `composed: true`.
- `breadcrumbs()`, `withHome()`, `type Crumb` from `@/components/seo/schema`.

### Abbreviations
- `createAbbreviator()` from `@/components/expertise/abbr` (returns `(text) => { html, notes }`; first use per page of `3-MCPD`, `FSQR` (with note), `CBE` (abbr only)); `abbreviations` from `@/lib/typography` (FSQR, CBE, iTFA, 3-MCPD, GE, DAG, FFA; C-11 COMPOSED titles).

---

## 3. Hard-coded copy inside .astro (not in data) — preserve or move to data

| file:line | verbatim | note |
|---|---|---|
| `src/pages/expertise/index.astro:19` | `{ label: 'Expertise', href: '/expertise' }` | crumb label (= `expertiseOverview.overline`; use that) |
| `src/pages/expertise/index.astro:20` | `.split('connects')` | headline split for Scribble; drop, render headline whole |
| `src/pages/expertise/[slug].astro:34` | `{ label: 'Expertise', href: '/expertise' }` | crumb label |
| `src/pages/expertise/[slug].astro:41` | `tfa: 'WHO'` | ImpactCard figure override for tfa; move to data (e.g. `expertiseNotes.record`) |
| `src/components/expertise/PillarHero.astro:27` | `<span class="tnum">{pillarNumber(pillar)}</span> of <span class="tnum">06</span> · Expertise` | " of 06 · Expertise"; 06 hard-coded (derive from `pillars.length`) |
| `src/components/shared/PillarCard.astro:31` | `{pillarNumber(p)} / 06` | " / 06" hard-coded |
| `src/components/expertise/PillarMap.astro:50` | `aria-label="Other expertise"` | nav accessible name |
| `src/components/expertise/PillarMap.astro:56` | `<span class="visually-hidden">, {n.p.name}</span>` | ", " + full name for SR |
| `src/components/bencho/HubDiagram.astro:35` | `06` (aria-hidden) | dead |
| `src/components/bencho/HubDiagram.astro:44` | ` / 06` | dead |
| `src/components/shared/CoverStory.astro:46` | `Ganeaysh Kulkarni` | byline name (should come from `founderName` in `@/data/founder`) |
| `src/components/chrome/Breadcrumbs.astro:10,17` | `aria-label="Breadcrumb"`, separator `/` | keep |
| `src/pages/expertise/[slug].astro:52` | `aria-label={pillar.name}` on diagram section | keep pattern if diagram stays |

No other user-visible strings are hard-coded in scope; all headings/labels come from data modules.

---

## 4. Casual asides / jokey captions / toy instructions to DELETE

Source of truth `src/data/notes/expertise.ts` (strict line format parsed by `scripts/notes-copy.mjs`; keep format valid if editing).

| verbatim | data line | rendered at | action |
|---|---|---|---|
| `they’re designed to work together` | `notes/expertise.ts:8` | `index.astro:37` MarginNote | DELETE |
| `['science', 'plants', 'strategy']` (Venn lobes) | `:9` | `index.astro:21,34` Venn | DELETE (Venn removed per brief) |
| `that’s us` | `:10` | `index.astro:34` Venn centre | DELETE (same register as banned "that's you + us") |
| `Read the full note` | `:11` | `IntroMore.astro:19` (t-hand) | DELETE with the fold; BORDERLINE if a toggle is kept ("note" is the casual frame) |
| `hover a pillar` | `:14` | `HubDiagram.astro:39` | DELETE |
| `tap one to dive in` | `:16` | `HubDiagram.astro:40` | DELETE |
| `six blocks, one team` | `:19` | `index.astro:47` | DELETE |
| `start anywhere` | `:22` | `PromptRow.astro:18` | DELETE |
| `you are here` | `:25` | `PillarMap.astro:49` | DELETE |
| `the other five` | `:26` | `PillarMap.astro:51` (mobile label) | BORDERLINE → replace with "Other expertise" if a cross-link list is kept |
| `fig. {n}` | `:29` | `PillarDiagram.astro:89` | BORDERLINE → "Exhibit {n}" (`microcopy.exhibit`) or nothing |
| `scroll, it draws itself` | `:30` | `PillarDiagram.astro:167` | DELETE (brief names it) |
| `What’s inside` | `:50` | `HelpList.astro:28` SpecLabel title | DELETE |
| `Nothing hidden` | `:51` | `HelpList.astro:28` SpecLabel sub | DELETE (brief names it) |
| `Contents may vary with your plant.` | `:52` | `HelpList.astro:28` SpecLabel foot | DELETE (packaging pun) |
| `Inspect the label` | `:55` | `SpecInspector.astro:29` toggle | DELETE (brief names it) |
| `Close the inspector` | `:56` | `spec-inspector.ts` label swap | DELETE |
| `drag the frame over the label` | `:57` | `SpecInspector.astro:30` | DELETE (brief names it) |
| `{n} items`, `fig. {n}` (inspector) | `:58-59` | blueprint captions | DELETE |
| `what lands on your desk` | `:62` | `Deliverables.astro:15` | DELETE |
| `one for the record` | `:66` | `[slug].astro:69` | DELETE |
| `we’re all ears` | `src/data/notes/chrome.ts:17` | `CtaField.astro:30` (on every expertise page) | DELETE (brief names it) |
| `Learn more` in `t-hand` (Caveat) | `microcopy.pillarLink` | `PillarCard.astro:35` | KEEP text, drop handwritten font + hand arrow |
| `The first conversation is on us.` (now `… is free of charge.` in the working tree) | `src/data/home.ts:38` (CONFIRM 9) | `CtaField.astro:26` | BORDERLINE: tone fixed by the v3 edit; the free-call claim is still unconfirmed (CONFIRM 9) |
| Diagram PROP labels `Your idea`, `Your brand`, `Risk` | `:38,:41` | PillarDiagram | BORDERLINE (fine if a static diagram is kept for that pillar) |
| `Train, transfer, coach: stronger teams` | `:45` | PillarDiagram capability title | BORDERLINE (acceptable) |
| `record.indiaFigure: '1st'` | `:65` | India ImpactCard figure | BORDERLINE: DERIVED figure, not brief copy; keep only if approved |

Visual toys to remove on these routes (not copy): Scribble swoosh on "connects" (`index.astro:30`), Scribble circle on the item count (`HelpList.astro:23`), Stamp spinning ring (`HubDiagram.astro:64`), Doodle star (`PromptRow.astro:21`), Tape on coming-soon cards (`RelatedInsights.astro:30`) and on Sidenote (`Sidenote.astro:8`), Doodle in CoverStory (`CoverStory.astro:34`), Scribble circle on "together" + Sticker + MagneticDots in CtaField, giant outlined numeral (`PillarHero.astro:20`), rotations (`--rot`, `rotate:` on record card, RelatedInsights, RunIn stickers, SpecLabel).

---

## 5. CONFIRM / DRAFT handling

- Mechanism: `src/config/site.ts:10` `mode = PUBLIC_SITE_MODE === 'production' ? 'production' : 'staging'` (default **staging** when unset; `.env.example:1`; `npm run build:prod` sets production). `src/lib/mode.ts` exports `mode`, `isStaging`, `isProduction`, `confirmItems` (ids 1–14 with titles). `src/components/ui/Confirm.astro:8` renders `<span class="confirm" data-confirm-id>CONFIRM {id}: {note}</span>` **only if `isStaging`**; production renders nothing. `DraftRibbon.astro:8` same gate ("DRAFT for Ganeaysh’s review"). Staging also forces `robots: noindex, nofollow` (`SeoHead.astro:17`) and shows draft insights (`lib/insights.ts:18`).
- **No `<Confirm>` is rendered by any expertise component.** Markers visible on these routes in staging come from the shared shell:
  - `CtaField.astro:26` → `<Confirm id={9} note="free first call" />` (every expertise page).
  - `Footer.astro:69` → `<Confirm id={11} note="KvK / VAT / registered address" />` while `site.legal.registration` is null.
  - `CoverStory.astro:40` → `DraftRibbon` on the staging-only related cards (innovation: trans-fat draft; quality: 3-MCPD draft).
  - `ExpertisePanel.astro:43` (header disclosure) → `DraftRibbon` on featured insight in staging.
- Code-comment-only CONFIRMs (not rendered, but are the gap ledger): `pillars.ts:12` `// CONFIRM 7` (CBE / specialty-fats wording, innovation helpWith[0]) — **no staging marker exists for CONFIRM 7**; `pillars.ts:67,82,98` C-8 (pillar→impact mapping; strategy/deals none); `impact.ts:4` C-9 (null case fields); `impact.ts:47` C-12 (engagement consent); `impact.ts:54` CONFIRM 8 (testimonials empty); `industries.ts:1` C-10 (industry→pillar mapping, no images "until licensed photography exists (graft 13)"); `typography.ts:59-63` C-11; `schema.ts:65` CONFIRM 13; `content.config.ts:15` publication date; `data/seo.ts:24-29` `composed: true` SEO strings.
- Rebuild rule: keep using `<Confirm>`/`DraftRibbon` (they self-hide in production). The brief's "remove all visible DRAFT/CONFIRM labels" is satisfied by building the client link with `PUBLIC_SITE_MODE=production` (or by a separate review flag) — decide which; do not delete the gate logic.

---

## 6. Behaviour that must survive

| behaviour | mechanism | file |
|---|---|---|
| Six static routes at brief slugs | `getStaticPaths` from `pillars` | `[slug].astro:28` |
| Per-page SEO | `pageSeo('expertise')` / `pageSeo(pillar.slug)` → title/description/canonical/og (`/og/{slug}.png`, fallback `/og/default.png`) | `lib/seo.ts`, `data/seo.ts:17,24-29`, `SeoHead.astro` |
| BreadcrumbList JSON-LD | BaseLayout pushes `breadcrumbs(crumbs)` into the single `@graph` when `breadcrumbs` prop given | `BaseLayout.astro:38-41`, `schema.ts:165` |
| Visible breadcrumbs | page passes `showCrumbs={false}` and renders `<Breadcrumbs items={crumbs}>` inside hero; `withHome()` prepends "Home"; `nav aria-label="Breadcrumb"`, last item `aria-current="page"` | `index.astro:26`, `PillarHero.astro:22`, `Breadcrumbs.astro` |
| Body pillar context | `page="pillar"` + `pillar={key}` → `body[data-page][data-pillar]` + `--pillar*` vars; `data-page` selects the motion page module (`pillar`/`expertise` → `pages/expertise.ts`) | `BaseLayout.astro:42,61`, `motion/index.ts:131` |
| One h1 per page; JSON-LD block count = 1; og image exists; title ≤60 incl. "KoKreaters"; desc ≤155; no horizontal scroll; axe; reduced-motion + no-JS renders | Playwright over every built route | `tests/seo.spec.ts`, `tests/responsive.spec.ts`, `tests/a11y.spec.ts`, `tests/reduced-motion.spec.ts` |
| Section landmarks | `aria-labelledby` ids: `expertise-title`, `hub-title`, `pillar-title`, `help-title`, `deliverables-title`, `record-title`, `related-title`, `prompt-title`, `cta-heading` | each component |
| First-use acronym expansion | `createAbbreviator()` shared across intro + helpWith on one page → `<abbr title>`; FSQR/3-MCPD notes rendered visibly (hero Sidenote / "(…)" after the help item). Pages affected: innovation (CBE abbr), quality (FSQR note in intro, 3-MCPD note in help 1), capability (FSQR note in help 1) | `abbr.ts`, `[slug].astro:37-39`, `HelpList.astro:18`, `PillarHero.astro:32` |
| Whole-card link, no nested links | PillarCard is one `<a>`; CoverStory title `a::after` overlay | `PillarCard.astro:30`, `CoverStory.astro:60` |
| Cross-pillar navigation | PillarMap `<nav aria-label="Other expertise">` with 5 links + sr-only full names (only per-page link to sibling pillars besides header) | `PillarMap.astro:50-61` |
| Accessible diagram text | SVG aria-hidden; `<ol class="pd__steps">` equivalent | `PillarDiagram.astro:169-171` |
| Impact deep link | `/impact#{result.id}` (target `CaseEntry.astro:47` `article id={result.id}`) | `[slug].astro:70` |
| Figure a11y | ImpactCard count-up span aria-hidden + visually-hidden real value; iTFA abbr + note | `ImpactCard.astro:27-33` |
| Related insights rules | ≤3 visible; if none, coming-soon titles unlinked; section omitted if both empty | `RelatedInsights.astro:14-17`, `[slug].astro:42-44,79` |
| Prompt ground rule | `promptGround` avoids adjacent same grounds (will be moot) | `[slug].astro:47` |
| CTA field on every page | BaseLayout `showCta` | `BaseLayout.astro:34,70` |
| Header Expertise disclosure + mobile menu list pillars | `chrome.ts` toggles `#expertise-panel`; reads `pillars` | `chrome/ExpertisePanel.astro`, `chrome/MobileMenu.astro` (global, keep) |
| Reduced motion | inline head script sets `html.motion` only without `prefers-reduced-motion`; `motion-paused` from localStorage `kk-motion`; markup = final state | `BaseLayout.astro:49-56` |
| Gentle fade-up to reuse | R2 `[data-reveal]` (opacity 0→1, y 28→0, once; `data-reveal-group` 70ms stagger) | `scripts/motion/reveal.ts` |
| CSP constraints | `font-src 'self'` (self-host Source Serif 4 / Inter via fontsource + `scripts/copy-fonts.mjs`; update `<link rel=preload>` in `BaseLayout.astro:57-58`); `img-src 'self' data:` (photos must be local); inline-script sha256 in `vercel.json` (re-run `scripts/csp-hash.mjs` / `npm run verify` if the head script changes) | `vercel.json`, `BaseLayout.astro` |
| llms.txt lists pillars | `pillars` import | `src/pages/llms.txt.ts` |

---

## 7. Dead after the redesign

Only used by these routes (safe to delete once rebuilt):
- `src/components/bencho/HubDiagram.astro` + `src/scripts/bencho/hub-diagram.ts` (hover Venn/hub; brief says remove).
- `src/components/bencho/SpecInspector.astro` + `src/scripts/bencho/spec-inspector.ts` (drag/inspect toy).
- `src/components/expertise/PillarMap.astro` (constellation; keep only its link list idea).
- `src/components/expertise/PillarDiagram.astro` scroll-scrub version (replace with a static diagram; markup already ships the finished state, `data-pd-*` attrs become dead).
- `src/components/expertise/IntroMore.astro` (details fold of intro; brief wants two plain paragraphs).
- `src/components/ui/Sidenote.astro` (only PillarHero; render abbr notes as plain text instead).
- `src/components/shared/RunIn.astro` (only Deliverables; stickers variant).
- `src/scripts/pages/expertise.ts` entirely (hub chunk, inspector chunk, constellation draw + bob, diagram scrub, `.is-live` flow).
- `src/components/shared/ExpertiseIndex.astro` (already orphan; revive or delete).
- `src/components/notes/Venn.astro` only if home `Positioning.astro` also drops it.
- `expertiseNotes` keys: `overview.*`, `hub.hover`, `hub.tap`, `grid.*`, `prompt.*`, `pillar.here`, `diagram.fig`, `diagram.scroll`, `label.*`, `inspector.*`, `deliverables.*`, `record.proof`.
- `pillars[].colourVar`, `hex`, `inkText`; `pillarGround`/`pillarTintGround`/`pillarStyle` usage on these routes; `promptGround` logic.

Shared, become unused on these routes but still used elsewhere (remove usage, not file): `MarginNote`, `Scribble`, `Doodle`, `Tape`, `Stamp`, `SpecLabel` (8 importers), `PillarDot`, `Button` magnetic + sweep hover (`initSweep`, R7 magnetic), `data-edge-light` (EdgeLight lazy chunk), `data-sticker` drop (R4, `motion/notes.ts:103`), `data-parallax` (`motion/parallax.ts`), `data-rise` TextRise SplitText (`bencho/text-rise.ts`), `.grain` (`styles/grounds.css:56-62`, `assets/fx/grain.png`), `.paper-grid` (`grounds.css:52`), CtaField's MagneticDots/Sticker/Scribble. `PillarCard` is also the home WhatWeDo rail card — restyle affects home.

---

## 8. Mapping: brief target → data source → gaps

### Hub `/expertise`
| target | source | gap |
|---|---|---|
| Grey hero "Expertise that connects science, plants and strategy." | `expertiseOverview.headline` (+ `overline` as eyebrow, crumbs) | none |
| Two-sentence intro | `expertiseOverview.intro` | **is 3 sentences** ("Most problems … lines." / "A texture defect … business model." / "Our six areas … together."); trimming = copy change, needs approval (no CONFIRM id) |
| Six cards: title, promise, typical deliverables, link | `pillars[].name`, `.promise`, `.deliverables` (label `pillarPage.deliverables`), `pillarHref(key)` + `microcopy.pillarLink` | none. Grid needs an h2 (reuse `expertiseNotes.hub.label` 'The six areas of expertise', visible or visually hidden). Current card h3 is the promise; brief title = name |
| Band "Not sure where you fit?" + contact button | `expertiseOverview.prompt.text`, `.prompt.link {label:'Start a conversation', href:'/contact'}` | none |
| Remove hover Venn | delete Venn + HubDiagram | — |

### Detail `/expertise/[slug]`
| # | target | source | gap |
|---|---|---|---|
| 1 | Breadcrumb + hero title + promise | `crumbs` (Expertise / `pillar.name`), `pillar.name`, `pillar.promise` (`headline` duplicate) | decide H1 = `name` (matches SEO titles) with promise as dek, or keep H1 = headline/promise + name eyebrow |
| 2 | "The challenge we solve", two short paragraphs | only `pillar.intro` (single paragraph, 2 sentences; quality 3). Split at first sentence (regex `/\.\s(?=[A-Z])/` in `IntroMore.astro:11`) gives 2 paragraphs | **heading "The challenge we solve" not in data** (new COMPOSED string, add to `pillarPage`). Intros for innovation/process/capability describe what KoKreaters does, not a challenge; real challenge copy missing (no CONFIRM id) |
| 3 | "What we help with", five items, numbered | `pillarPage.helpWith`, `pillar.helpWith` via `createAbbreviator()`; number with `pad2(i+1)` | **deals has 4 items** (no 5th in brief). Innovation item 1 is CONFIRM 7 (CBE wording) |
| 4 | One static diagram where useful | Process: `expertiseNotes.diagram.processTitle` + `processEnds[0]` + `process[0..4]` + `processEnds[1]` = Crude → Degumming → Bleaching → Deodorisation → Fractionation → Interesterification → Spec. Others: DERIVED step lists in `expertiseNotes.diagram` | choose which pillars get one; process is exact. "3-MCPD and GE" label has no GE expansion |
| 5 | Typical deliverables as tags/list | `pillarPage.deliverables`, `pillar.deliverables` (+ `cap()`) | none (4–5 each) |
| 6 | Proof: matching career result card | `pillar.impactId` → `founderResults`, `secondaryFigures`, figure override (`india: expertiseNotes.record.indiaFigure`, `tfa: 'WHO'` hard-coded), heading `pillarPage.fromTheRecord`, link `microcopy.impactLink` → `/impact#{id}` | **strategy + deals have none (C-8)**; strategy could use `engagements.eu-minerals` once consent cleared (C-12 / CONFIRM 6). Deals: nothing exists. India '1st' is DERIVED |
| 7 | Related insights (2–3) + related industries | `byPillar(key)`, `comingSoonByPillar(key)`, `microcopy.relatedInsights`, `microcopy.inPreparation`; industries: `industries.filter(i => i.pillars.includes(key))` → `/industries#{slug}` | **Production: 0 linked insights on all six pages** (all draft/coming-soon; CONFIRM 14 first two drafts, C-14 dates). Max 1 visible even in staging. Strategy/deals/capability have no insights at all. **Related-industries heading not in data** (COMPOSED needed). **Deals + capability map to zero industries** (C-10) |
| 8 | CTA band | `PromptRow` data (`expertiseOverview.prompt`) and/or global `CtaField` (`cta` in `src/data/home.ts:36-40`: headline, body (CONFIRM 9), button 'Book a 30-minute call' → `site.bookingUrl`, empty → `/contact#form`) | currently two CTA bands back to back; merge or keep one + the global CtaField |
| — | Remove "Inspect the label / drag the frame", "scroll, it draws itself", "Nothing hidden" | section 4 | — |

---

## 9. Images currently used

- No photography on any expertise route. Repo has only `src/assets/photos/ganeaysh-cutout.png` and `ganeaysh-cutout-square.png` (the square one renders as the 40px byline avatar in `CoverStory` via `FounderPhoto variant="avatar"`, only when a related insight card shows, i.e. staging). Insights have no `image` frontmatter. `industries.ts:1`: "No images until licensed photography exists (graft 13)". The brief's desaturated cool photography must be sourced and stored locally (CSP `img-src 'self' data:`).
- Texture: `src/assets/fx/grain.png` via `.grain::after` (`src/styles/grounds.css:56-62`) on hub band, pillar hero, deliverables band, PillarCard, CtaField.
- Logo node cluster: `src/assets/brand/svg/kokreaters-node-cluster.svg` via `<Logo variant="cluster">` (HubDiagram size 96, CtaField sticker). Header/footer logos via `src/assets/brand/svg/derived/*` (global). Keep one quiet node-cluster signature per brief.
- OG cards: `public/og/expertise.png`, `product-innovation.png`, `process-design.png`, `food-safety-quality.png`, `strategy-feasibility.png`, `due-diligence.png`, `capability.png` (generated by `npm run og` / `scripts/og.mjs`; old palette, regenerate).
- Inline SVG only (no files): PillarDiagram drawings, PillarMap, HubDiagram, Venn, Scribble/Doodle/MarginNote arrows (`src/components/notes/paths.ts`).

---

## 10. PlantPipeline (home) — contents, for the brief's move to /expertise/process-design

`src/components/home/PlantPipeline.astro` (used only `src/pages/index.astro:27`); motion `initPipeline` in `src/scripts/pages/home.ts` (~L120-190: pinned ~2.5×vh (mobile 2.2×) GSAP scrub with DrawSVG, stations light `.is-lit`, mobile horizontal pan, `.is-flowing` dash animation, agitator stir).
- Section `section.pipeline.band.fold.g-ice[data-pipeline]`, `aria-labelledby="pipeline-heading"`.
- Folio label `principlesHeading` ('Principles', `src/data/approach.ts:16`); h2 = `principles[0].name` 'Plant floor to boardroom' + Sapphire "."; lead = `principles[0].copy` 'We are as comfortable in a control room as in a board meeting, and we connect the two.'
- SVG `role="img"`: `<title>` = `homeNotes.pipeline.title` 'From crude oil on the plant floor to a decision in the boardroom'; `<desc>` = numbered station list joined by " → ".
- Six stations (`homeNotes.pipeline`, `src/data/notes/home.ts:19-31`), each coloured by an arbitrary pillar: tank 'Crude comes in' (capability), refine 'Refine it right' (process), fraction 'Split the fractions' (quality), blend 'Blend to spec' (innovation), product 'Product that ships' (deals), board 'Go or No-Go' (strategy); sign text 'GO'. Drawings: crude tank, refining column, two crystallisers, blending tank + agitator, tin on pallet, boardroom table + sign, rising arrow.
- Notes to delete: `same: 'one pipe, one person'`, `up: 'and up it goes'`, `scroll: 'scroll, it flows'`.
- A11y: visually hidden `<ol>` of station labels; mobile viewport `tabindex="0" role="group"`.
- Verdict: it is a casual-labelled plant-to-boardroom story, **not** the brief's refining chain. The brief's static flow for Process Design should be built from `expertiseNotes.diagram.processEnds` + `expertiseNotes.diagram.process` (+ `processTitle`, echoing `industries[5].copy` "from crude oil to customer specification"); none of PlantPipeline's strings or GSAP code is needed for it. The current process `PillarDiagram` branch (`PillarDiagram.astro:39-44,105-116`) already draws exactly that chain as a static-capable SVG (vessels at x 250/430/610/790/970, Crude tank, Spec circle + tick).
