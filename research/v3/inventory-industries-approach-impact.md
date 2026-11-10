# Inventory: Industries, Approach, Impact (v3 visual rebuild)

Read-only inventory of `web/` on branch `redesign/v3-editorial`, taken 10 Nov 2026. Paths are relative to `web/` unless they start with `research/` or `DESIGN-`.
Every file in scope was read in full, along with every data and lib module it imports.

Files in scope (line counts): `src/pages/industries.astro` 59, `src/components/industries/{SectorIndex 46, SectorSection 46, SectorWheel 130}.astro`, `src/data/industries.ts` 20, `src/pages/approach.astro` 86, `src/components/approach/{acts.ts 20, EngagementTable 36, MethodSteps 121, Principles 60, ReportFold 32}`, `src/data/approach.ts` 33, `src/pages/impact.astro` 102, `src/components/impact/{CaseEntry 113, EngagementRow 53, Testimonials 29}.astro`, `src/components/shared/{ImpactCard 48, ImpactRow 40}.astro`, `src/data/impact.ts` 66.
Supporting files read: `src/data/types.ts`, `src/lib/mode.ts`, `src/config/site.ts`, `src/data/notes/expertise.ts`, `src/data/notes/story.ts`, `src/data/home.ts`, `src/data/founder.ts`, `src/data/pillars.ts`, `src/data/microcopy.ts`, `src/data/seo.ts`, `src/lib/{seo,pillars,format,typography}.ts`, `src/components/seo/{schema.ts,SeoHead.astro}`, `src/layouts/BaseLayout.astro`, `src/components/chrome/Breadcrumbs.astro`, `src/components/ui/{Confirm,PillarTag,PillarDot,DraftRibbon}.astro`, `src/components/bencho/{FaqAccordion,Crumple,CardSwap,FoggyWord}.astro`, `src/scripts/pages/{industries,approach,impact}.ts`, `src/scripts/motion/{index,reveal,countup}.ts`, `src/components/shared/CtaField.astro`, `vercel.json`, `README.md`, `tests/*.spec.ts`, `research/BRIEF.txt`.

---

## A. /industries

### A1. Current section order (`src/pages/industries.astro`)
1. `BaseLayout page="industries" seo={pageSeo('industries')} breadcrumbs={crumbs} showCrumbs={false}` (L22). Because `showCrumbs` is false, the page renders the trail itself.
2. `section.ind-head` (white, `paper-grid`, `has-notes`, L23-33): `<Breadcrumbs items={crumbs}>`, a dateline with a saffron dot plus `industriesPage.overline`, and the h1 `#industries-title`. The h1 is `industriesPage.headline` with its last word, "work", wrapped in `<Scribble kind="circle" tone="orchid">`. Then `<Confirm id="C-15" note="industries intro" />` and the handwritten MarginNote "pick yours".
3. `section.ind-wheel` (imperial, `grain`, `data-wheel-section`, `aria-label={expertiseNotes.industries.wheel}`, L35-37): `<SectorWheel />`, a pinned SVG wheel of the nine sectors. Scrolling turns it; the panel at 3 o'clock shows the pillar tags.
4. `div.ind-body` (white, L39-46), a 3/9 grid. Left: `<SectorIndex />`, a sticky `<nav aria-label="Industries">` with a gliding saffron bar. Right: `industries.map(i => <SectorSection industry={i} />)`, nine sections with id = slug, h2 = name, `.t-lead` copy, an optional image, the label "Relevant expertise" and PillarTag links.
5. `CtaField` is injected by BaseLayout (`showCta`). It is the saffron block with the "we’re all ears" note and `<Confirm id={9}>`.

### A2. DATA used
| Import path | Export | Fields used | Where |
|---|---|---|---|
| `@/data/industries` | `industries: Industry[]` | `n`, `slug`, `name`, `copy`, `pillars: PillarKey[]`, `image?: ImageMetadata`, `imageAlt?` | industries.astro L43, SectorIndex L13-14, SectorSection L15-27, SectorWheel L18-66 |
| `@/data/industries` | `industriesPage` | `overline` 'Industries', `headline` 'Where we work', `relevantExpertise` 'Relevant expertise' (COMPOSED) | industries.astro L19,27; SectorSection L25 |
| `@/data/pillars` (via `@/lib/pillars`) | `pillars` | `key`, `name` (PillarTag label), `slug` | PillarTag, SectorWheel L64 |
| `@/lib/pillars` | `pillarHref(key)` → `/expertise/${slug}`, `pillarGround(key)` | | SectorSection L27, SectorWheel L65 |
| `@/lib/format` | `pad2` | | SectorIndex, SectorSection, SectorWheel |
| `@/data/notes/expertise` | `expertiseNotes.industries.{pick,wheel,turn,sector}` | toy and note copy, to be deleted | industries.astro L31,35; SectorWheel L47,58,70 |
| `@/lib/seo` | `pageSeo('industries')` | | L22 |

`Industry` type (`src/data/types.ts` L16): `{ slug; n; name; copy; pillars: PillarKey[]; image?: ImageMetadata; imageAlt?: string }`.
Nine entries (`industries.ts` L5-13), slug → pillars (mapping C-10):
- `confectionery` [innovation, process]
- `bakery` [innovation, process]
- `dairy-nutrition` [innovation, quality]
- `plant-based` [innovation]
- `snacks-food-service` [innovation, process]
- `edible-oils-specialty-fats` [process, quality]
- `personal-care-oleochemicals` [innovation, process]
- `pet-food-animal-nutrition` [innovation, process]
- `industrial-minerals` [strategy]

Pillar link labels: `pillars[].name`, for example 'Product and Category Innovation', 'Process Design and Plant Performance', 'Food Safety, Quality and Contaminants' and 'Strategy, Feasibility and Market Entry'. The shorter `shortLabel` values (Product / Process / Food safety / Strategy / Deals / Capability) are also available.

Other consumers of `industries` (keep the shape stable): `src/components/home/WhereWeWork.astro` L8-10 (links `/industries#${slug}`) and `src/components/home/IndustryMarquee.astro` L5.
Name clash: `@/data/home` also exports `industries` = `{ overline: 'Where we work', headline: 'Where we work' }`. WhereWeWork imports it as `fold`.

### A3. Hard-coded copy inside .astro (not in data)
- `industries.astro:18`: `const crumbs = [{ label: 'Industries', href: '/industries' }];`. The label is hard-coded; `industriesPage.overline` holds the same string.
- `industries.astro:29`: Confirm note `"industries intro"` (staging only).
- `SectorIndex.astro:10`: `aria-label="Industries"`.
- `SectorSection.astro:18`: `/{pad2(industries.length)}` renders "/09" (aria-hidden, decorative).
- No other literal copy. All sector copy is in data.

### A4. Copy to DELETE
- `src/data/notes/expertise.ts:69` `pick: 'pick yours'`, used at industries.astro:31 (MarginNote).
- `expertise.ts:71` `turn: 'scroll to turn the wheel'`, used at SectorWheel.astro:70 (MarginNote).
- `expertise.ts:70` `wheel: 'Industries wheel'`. This is the aria-label of the wheel section and list (industries.astro:35, SectorWheel.astro:47). It goes dead with the wheel.
- `expertise.ts:72` `sector: 'Sector'`, the wheel panel label (SectorWheel.astro:58). Dead with the wheel.
- The Scribble circle on "work" (industries.astro:28) and the Scribble highlight on each sector h2 (SectorSection.astro:20) are hand-drawn decoration to remove. The words stay.
- Borderline: none. All sector copy is brief section 6.3, verbatim.

### A5. CONFIRM / DRAFT
- `industries.astro:29` `<Confirm id="C-15" note="industries intro" />` renders "CONFIRM C-15: industries intro" in staging. C-15 = "Industries page has no intro lead" (DESIGN-SPEC.md L2149).
- The CtaField (BaseLayout) adds `<Confirm id={9} note="free first call" />`.

### A6. Behaviour to keep
- SEO: `pageSeo('industries')` (`src/lib/seo.ts`, string from `src/data/seo.ts` L23, `composed: true`, `og: '/og/industries.png'`).
- Breadcrumbs: visible `<Breadcrumbs>` (`nav aria-label="Breadcrumb"`, `withHome()` prepends 'Home'). BaseLayout L40 adds a JSON-LD BreadcrumbList from the `breadcrumbs` prop. `tests/seo.spec.ts` requires exactly one h1, one JSON-LD block containing `BreadcrumbList`, one canonical, a title of 60 characters or fewer that contains "KoKreaters", and a description of 155 characters or fewer.
- Deep links: each sector root has `id={i.slug}`, linked from home WhereWeWork `/industries#${slug}`. The rebuilt card must keep `id=slug`. The global `[id] { scroll-margin-top: var(--scroll-offset) }` (`src/styles/layout.css:6`, offset 92px) handles the sticky header.
- `aria-labelledby={`${slug}-title`}` on each sector and `aria-labelledby="industries-title"` on the hero.
- The image hook is already in place: `SectorSection.astro:22-24` renders `<Image src={i.image} alt={i.imageAlt ?? ''} widths={[480,720,960]} sizes="(min-width:1024px) 60vw, 100vw" loading="lazy" decoding="async">` from `astro:assets` when `image` is set. Reuse this pattern for card photos.
- PillarTag links: `<PillarTag pillar={k} href={pillarHref(k)} />`, an `<a>` with a ::after hit-area expansion.
- Sector index (`src/scripts/pages/industries.ts` `initIndex` L11-44): an IntersectionObserver sets `aria-current="true"` on the link to the sector in view and moves `[data-sector-bar]`. It runs in every mode. Optional after the redesign, because a nine-card grid has no long scroll to track.

### A7. Dead after redesign
`SectorWheel.astro` (whole file) and `scripts/pages/industries.ts` `initWheel` (L46-110, GSAP pin, snap and hover-turn) go. `SectorIndex.astro` and `initIndex` probably go too: if they do, `industries.ts` empties and can be deleted (the motion/index.ts glob tolerates a missing module). `SectorSection.astro` is replaced by a card. Also dead: the `ind-head__dot`, `paper-grid`, `grain` and `has-notes` usages; `Scribble`, `MarginNote` and `PillarDot` (wheel); and the `data-sticker` drop on tags (SectorSection L27).

---

## B. /approach

### B1. Current section order (`src/pages/approach.astro`)
1. `BaseLayout page="approach" seo={pageSeo('approach')} breadcrumbs={[{ label: approach.overline, href: '/approach' }]}` (L31). `showCrumbs` defaults to true, so BaseLayout renders `div.page-crumbs.container > Breadcrumbs` above the hero. This differs from industries and impact.
2. `section.ap-hero` (white, `paper-grid`, `has-notes`, L32-53): the dateline (orchid dot + `approach.overline`) and the h1 `#ap-title`. The h1 is `approach.headline` split around `approach.swooshPhrase` ('with you'), which is Scribble-circled, with punctuation kept nowrap. Then the MarginNote "the whole idea, really" and the intro. The intro is cut: its first sentence shows, and the rest sits in `<details class="more">` with the summary "Read the whole truth +". A spinning `<Stamp text={tagline}>` wraps `<NodeCluster size={112} discs={false}>` (`data-parallax="0.12"`). The tagline comes from `name.lockupAlt.split(': ')[1]`, which gives 'Connect · Collaborate · Create'.
3. `<MethodSteps />` (`section.acts[data-acts]`): an `<ol>` of three `li.act` slabs on sapphire, violet and saffron. Each slab has the pill "Step n / 3", an h2 with the name (`id="act-n"`), `.t-lead` copy, a MarginNote, a `SpecLabel` with rows What we do / What you get / Typical duration (staging only, '—' values), `<Confirm id={10}>`, and a mini SVG. At 1024px and up with motion, a pinned 300% scrub morphs the big SVG and tweens the ground. The `li` ids are `connect`, `collaborate` and `create`.
4. `<ReportFold />` (butter, `grain`): an h2 built from the first sentence of `positioning.promise` ("We do not hand over a report" + underlined "and leave" + "."), the second sentence as the lead, and the `<Crumple>` toy ("FINAL_report_v7.pdf").
5. `<Principles />` (white): h2 `principlesHeading` and the MarginNote "the house rules". Five rotated, taped index cards (grounds butter, lavender, blush, ice, white), each with "01–05", an h3 name and the copy in mono, plus `data-sticker` drop.
6. `<EngagementTable />` (ice, sticky head): h2 `modelsHeading`, the MarginNote "pick a shape", staging `<Confirm id={10}>`, and `<FaqAccordion>`. FaqAccordion renders five `<details>`: the summary is model + shape, and the body is a `<dl>` with "Typical shape" and "Good for".
7. CtaField (BaseLayout).

### B2. DATA used
| Import path | Export | Fields | Where |
|---|---|---|---|
| `@/data/approach` | `approach` | `overline` 'Approach', `headline` 'We create with you, not for you.', `swooshPhrase` 'with you', `intro` (two sentences) | approach.astro L21-27,31,35 |
| `@/data/approach` | `steps: MethodStep[]` | `n` 1-3, `name` 'Connect'/'Collaborate'/'Create', `copy`, `whatWeDo`, `whatYouGet`, `duration` (ALL null) | MethodSteps L13-58 |
| `@/data/approach` | `stepLabels` | `whatWeDo` 'What we do', `whatYouGet` 'What you get', `duration` 'Typical duration', `step` 'Step' | MethodSteps L23,36 |
| `@/data/approach` | `principlesHeading` 'Principles', `principles: Principle[]` | `name`, `copy` (5) | Principles L9-28 |
| `@/data/approach` | `modelsHeading` 'Ways to work with us', `modelColumns` | `model` 'Model', `shape` 'Typical shape', `goodFor` 'Good for' | EngagementTable L10-17 |
| `@/data/approach` | `models: EngagementModel[]` | `model`, `shape`, `goodFor` (5) | EngagementTable L12 |
| `@/data/home` | `positioning.promise` | 'We do not hand over a report and leave. We build the answer with your people, so it still works after we have gone.' | ReportFold L8-13 |
| `@/data/founder` | `name.lockupAlt` | 'KoKreaters: Connect · Collaborate · Create' | approach.astro L17,29 (stamp ring only) |
| `@/data/notes/story` | `storyNotes.approach/steps/crumple/principles/models` | toy and note copy, to be deleted | see B4 |
| `@/components/approach/acts` | `NODE_COLOURS, STATES, LINKS, arrowD, HEAD, ARROW_PATH, ACT1-3` | SVG geometry | MethodSteps L16; scripts/pages/approach.ts L9 |

Model names, verbatim (approach.ts L28-32): 'Diagnostic or audit', 'Project', 'Advisory retainer', 'Interim leadership', 'Workshops and training'. The task text's short names ("Diagnostic", "Retainer", "Workshops") must NOT replace these.
Other consumers: `home/MethodFold.astro` L14 (`steps`, `stepLabels`) and `home/PlantPipeline.astro` L12 (`principles`, `principlesHeading`).

### B3. Hard-coded copy inside .astro
- `approach.astro:29`: fallback literal `'Connect · Collaborate · Create'`. It feeds only the stamp ring, so it dies with the stamp.
- `approach.astro:25-27`: the intro is split at the first `'. '`. The rebuild should render `approach.intro` whole.
- `MethodSteps.astro:26`: `aria-label={steps.map(s=>s.name).join(', ')}` gives "Connect, Collaborate, Create".
- `MethodSteps.astro:36`: `{stepLabels.step} {s.n}` + `` ` / ${steps.length}` `` renders "Step 1 / 3".
- `MethodSteps.astro:44`: `'—'` is the value for empty rows (staging).
- `MethodSteps.astro:69`: counter `1 / {steps.length}` (pinned art, aria-hidden).
- `Principles.astro:26`: `String(i + 1).padStart(2, '0')` gives "01"–"05" (aria-hidden).
- `ReportFold.astro:10-18`: the h2 is built from the data with a literal trailing `.`.
- `EngagementTable.astro`: none (labels come from `modelColumns`).

### B4. Copy to DELETE (data file:line, then usage)
- `src/data/notes/story.ts:7` `'the whole idea, really'` (approach.astro:37)
- `story.ts:8` `'Read the whole truth +'`, the `<details>` summary (approach.astro:43). Delete it and show the full intro.
- `story.ts:9` `'three acts, keep scrolling'` (MethodSteps.astro:70)
- `story.ts:12` `'we listen first'`, `:13` `'your people own it'`, `:14` `'then we prove it works'` (MethodSteps.astro:20,39). These restate the brief, but they are handwritten notes, so delete them.
- `story.ts:17` `'FINAL_report_v7.pdf'`, `:18` `'Crumple it'`, `:19` `'Smooth it out'`, `:20` `'much better'` (ReportFold.astro:21)
- `story.ts:23` `'the house rules'` (Principles.astro:19)
- `story.ts:26` `'pick a shape'` (EngagementTable.astro:18)
- Borderline: `positioning.promise` (ReportFold) is real brief copy. It is the home "Our promise" (`home.ts:20-22`) and is not in the v3 target list for Approach. Either keep it as one quiet pull-quote between the three columns and the principles, or drop it from Approach because it lives on Home. Do not lose the string.
- Borderline: the "Step 1 / 3" pill is fine as plain text. The tape, rotations, ink offset shadows and mono card copy are style issues, not copy issues.

### B5. CONFIRM / DRAFT
- `MethodSteps.astro:22-23` `rowsFor(s)` keeps a field when `s[f] !== null || isStaging`. In staging, all three rows show '—'. In production, `rows.length === 0` for every step, so the whole SpecLabel block is skipped (L41) and only the name and copy render.
- `MethodSteps.astro:45`: `{isStaging && rows.some(r => !r.v) && <Confirm id={10} />}`, once per step (3 times).
- `EngagementTable.astro:19`: `{isStaging && <p class="ways__confirm"><Confirm id={10} /></p>}`. CONFIRM 10 = 'Engagement models and durations' (mode.ts:25; brief section 6.4 "[CONFIRM: engagement models and durations]").
- The CtaField adds `Confirm id={9}`.

### B6. Behaviour to keep
- SEO: `pageSeo('approach')` (seo.ts L18, og `/og/approach.png`). Breadcrumb JSON-LD comes from the BaseLayout `breadcrumbs` prop. The visible trail is rendered by BaseLayout `.page-crumbs`.
- Step anchors `id="connect" | "collaborate" | "create"` (MethodSteps L34). No inbound links exist, but they are cheap to keep.
- Heading levels: h1 hero; h2 per step today. In the rebuild, use h2 "Connect / Collaborate / Create" (or a section h2 with h3 columns), h2 'Principles' with h3 per principle, and h2 'Ways to work with us'.
- Table semantics: the brief section 6.4 data is literally a three-column table (`modelColumns.model/shape/goodFor`). Use a real `<table>` with `<th scope="col">` from `modelColumns`. On a phone, stack each row as a `<dl>` card, or let the table scroll inside its own overflow box. `tests/responsive.spec.ts` checks for no horizontal page scroll at 360, 768, 1024, 1280 and 1440.
- `FaqAccordion.astro` is native `<details>/<summary>` with `headingLevel` (h3) inside the summary, and it works with JS off. Its pattern (not its styling) can host the NEW FAQ. The script `scripts/bencho/faq-accordion.ts` is optional; it is only lazy-loaded when not reduced (approach.ts L101-103).
- Keyboard: `approach.ts` L78-85 scrolls the pin to a focused act. This dies with the pin.

### B7. Dead after redesign
`MethodSteps.astro` (rebuild as three plain columns), `acts.ts`, and `scripts/pages/approach.ts` in full: `initActs` L17-94, the Crumple loader L98-100 and the FAQ loader L101-103 (keep the last only if the FAQ animation stays). Also `ReportFold.astro`, `bencho/Crumple.astro` + `scripts/bencho/crumple.ts`, `Principles.astro` (Tape, rotations, `data-sticker`), `EngagementTable.astro` (rebuild as a table), `notes/{Scribble,MarginNote,Stamp,Tape,SpecLabel}` usages, the `NodeCluster` inside Stamp, and `data-parallax`, `data-rise="lines"`, `data-toy`, `data-cursor="press"`, `.grain` and `.paper-grid`.

---

## C. /impact

### C1. Current section order (`src/pages/impact.astro`)
1. `BaseLayout page="impact" seo={pageSeo('impact')} breadcrumbs={crumbs} showCrumbs={false}` (L28), with `crumbs = [{ label: impactPage.overline, href: '/impact' }]`.
2. `section.im-hero` (ink, `grain`, L29-43): `<Breadcrumbs tone="dark">` (the tone prop is ignored), the dateline `impactPage.overline`, and the h1 `#im-title`. The h1 is `impactPage.headline` split on `' on the '`, with "plant floor" highlighted by Scribble and the "." re-added. Then the lead `impactPage.lead` and a spinning `<Stamp text={impactPage.partOne}>` around NodeCluster 128.
3. `section.im-stack` (white, L45-57): h2 `#part-founder` = `impactPage.partOne`, the MarginNote "fling one", and `<CardSwap label={partOne} next="Next card">`. CardSwap holds four `<ImpactCard as="li" size="lg" href="#{id}">`, a draggable or flingable depth stack (a 2×2 grid when static).
4. `div.im-cases` (L59-61): four `<CaseEntry>` full-bleed chapters. Each has its own ground (india sapphire, indonesia sky, ukraine imperial, tfa orchid) and shows `context`, the h2 `outcome`, a big figure (count-up; Ukraine's −25 °C sits behind FoggyWord frost, with "wipe the glass" and "yes, minus twenty-five") and its source. A SpecLabel titled `impactPage.partOne` holds The challenge / What was done / The result, followed by `<Confirm id="C-9">` and the PillarTag and sector tags.
5. `section.im-eng` (L63-76), rendered only if `visible.length > 0`: h2 `#part-engagements` = `impactPage.partTwo`, a rotated stamp `impactPage.anonymised`, the MarginNote "names withheld, on purpose", and a `ul` of `<EngagementRow>` ticket stubs.
6. `<Testimonials />` (L77). It renders nothing because `testimonials` is empty.
7. CtaField (BaseLayout).
The four founder results are shown TWICE today (stack + chapters). v3 should show them once, as four case cards.

### C2. DATA used
| Import path | Export | Fields | Where |
|---|---|---|---|
| `@/data/impact` | `founderResults: FounderResult[]` | `id` ('india','indonesia','ukraine','tfa'), `dateline`, `homeLine`, `emphasis[]`, `context`, `outcome`, `challenge\|null`, `done\|null`, `result\|null`, `figure?: {value, source, frost?}`, `pillars[]`, `sectors[]` | impact.astro L25,52-60; CaseEntry; ImpactCard |
| `@/data/impact` | `secondaryFigures` | `{ ukraine: '15%' }` | impact.astro L53; CaseEntry L39 |
| `@/data/impact` | `figureFallback` (NEW, added 10 Nov by another v3 agent, uncommitted) | `{ india: '1st', tfa: 'WHO' }`. It replaces `storyNotes.impact.indiaFigure` + `emphasis[0]`. Use: `r.figure?.value ?? figureFallback[r.id]` | not yet consumed |
| `@/data/impact` | `routeMapTitle` (NEW, uncommitted) | 'Where the founder’s results happened' | home only |
| `@/data/impact` | `engagements: Engagement[]` | `id` ('eu-minerals','in-specialty-audit','n-india-contaminants'), `text`, `consent` (all 'pending'), `pillars[]` | impact.astro L24,72; EngagementRow |
| `@/data/impact` | `testimonials` | `{ quote, name, role, permission: true }[]` = `[]` | Testimonials L6-7 |
| `@/data/impact` | `impactPage` | `overline` 'Impact', `headline` 'Results that started on the plant floor.', `lead`, `partOne` 'From our founder’s career', `partTwo` 'KoKreaters engagements', `anonymised` 'Anonymised', `engagementDateline` 'KoKreaters engagement', `labels.{challenge 'The challenge', done 'What was done', result 'The result'}` | impact.astro, CaseEntry L24, EngagementRow L23 |
| `@/data/notes/story` | `storyNotes.impact.indiaFigure` '1st' (DERIVED figure: KEEP the value) and `stack/cold/engagements` (to be deleted) | | impact.astro L25,49,51,69; CaseEntry L38,67-68 |
| `@/data/microcopy` | `microcopy.pendingConsent` 'Pending client consent' | staging only | EngagementRow L28 |
| `@/lib/typography` | `minus25` ('−25 °C', U+2212 + U+202F), `abbreviations.iTFA.{title,note}`, `figHtml` | | impact.ts data, CaseEntry L18,29,43; ImpactCard L10-16 |
| `@/lib/pillars` | `pillarHref` | | CaseEntry L79 |

Per-result facts (`impact.ts` L10-41):
- `india`: no `figure` (displays '1st' from storyNotes); challenge **null**; done 'Built and activated the facility.'; result set; sectors ['Edible oils and specialty fats'].
- `indonesia`: figure '21%', source 'From our founder’s career, Wilmar, Indonesia'; challenge **null**.
- `ukraine`: figure `minus25` (frost) + secondary '15%', source '…Wilmar, Ukraine'; all three fields set; sectors ['Edible oils']. That sector tag does not match any `industries[].name`.
- `tfa`: no figure (displays the `emphasis[0]` 'WHO'); challenge **null**; sectors [] (no sector tag).

Stats-strip sources: `@/data/home` `proof` (25 / 5 / 3 / WHO with labels, `count` ints) + `proofSource` 'From our founder’s career'. The other option is the founder figures (1st, 21%, −25 °C, 15%, WHO).
Other consumers: `ImpactCard` is used by `home/ImpactFold.astro` L9,15 and `pages/expertise/[slug].astro` L10,20, so do not delete it. `PillarCard.astro` L14 imports `founderResults`.

### C3. Hard-coded copy inside .astro
- `impact.astro:26,35`: the headline is split on the literal `' on the '`, then re-joined as `{h1a} on the <Scribble>…</Scribble>.`. Render `impactPage.headline` whole.
- `impact.astro:25` and `CaseEntry.astro:38`: figure fallback logic: `r.figure?.value ?? (id === 'india' ? storyNotes.impact.indiaFigure : r.emphasis[0])`.
- `CaseEntry.astro:51`: counter `{n} / {total}` renders "01 / 04" (aria-hidden). It also applies `context.replaceAll(' · ', ' · ')` to keep the dot from starting a line. ImpactCard.astro:24 does the same to `dateline`.
- `CaseEntry.astro:35`: `'—'` for null rows (staging).
- `CaseEntry.astro:25`: the ground map `{ india:'sapphire', indonesia:'sky', ukraine:'imperial', tfa:'orchid' }`. Style only.
- `CaseEntry.astro:76`: Confirm note `"case detail"`.
- `EngagementRow.astro:17`: `confirmId = engagement.id === 'eu-minerals' ? 'C-12' : 6`.
- `Testimonials.astro:16-17`: curly quotes `“{t.quote}”` and `{t.name}, {t.role}`.

### C4. Copy to DELETE
- `story.ts:29` `'fling one'` (impact.astro:49)
- `story.ts:30` `'Next card'`, the CardSwap button (impact.astro:51)
- `story.ts:33` `'wipe the glass'` (CaseEntry.astro:67)
- `story.ts:34` `'yes, minus twenty-five'` (CaseEntry.astro:68)
- `story.ts:37` `'names withheld, on purpose'` (impact.astro:69)
- Scribble highlight on "plant floor" (impact.astro:35), the giant outlined chapter number `case__n` (CaseEntry:50), and the rotated "Anonymised" stamp styling (impact.astro:68). Keep the word "Anonymised" as a plain label; the brief says "KoKreaters engagements (anonymised)".
- Borderline: `story.ts:40` `indiaFigure: '1st'` is DERIVED copy, not a joke, and it is the India stat. It has now been moved into `@/data/impact` `figureFallback` (uncommitted). `src/data/notes/*` is slated for deletion in v3 (microcopy.ts comment, `research/v3/copy-edits.md`). The `<details>` summary "Read the whole truth +" now has a plain replacement, `microcopy.readMore` 'Read more'.
- Borderline: count-up on figures (`data-count`, C-18 "on") is motion beyond "gentle fade-up". Recommend turning it off via `site.motion.proofCountUp` (`config/site.ts:22`) or dropping `data-count`.

### C5. CONFIRM / DRAFT
- `CaseEntry.astro:30-36`: rows keep `v !== null || isStaging`. In staging a null row shows '—'. In production the row is omitted, so india, indonesia and tfa lose "The challenge". `missing` triggers `<Confirm id="C-9" note="case detail" />` (L76), staging only. C-9 = "Case fields the brief does not give (challenge for India, Indonesia and WHO)".
- `impact.astro:24`: `visible = engagements.filter(e => e.consent === 'cleared' || isStaging)`. All three are 'pending', so in production the entire `im-eng` section is not rendered.
- `EngagementRow.astro:15-16`: a second guard, `show = !pending || isStaging`. Pending rows add a hazard label `microcopy.pendingConsent` + `<Confirm id={…}>`: C-12 for `eu-minerals`, 6 for the two Indian rows. CONFIRM 6 = "Client consent for the two anonymised Indian engagements"; C-12 = "All three anonymised engagements held as pending". To publish, flip `consent: 'cleared'` in `impact.ts` L49-51.
- `Testimonials.astro:7`: filters `permission === true` and renders nothing when empty (CONFIRM 8, no visible marker).
- The CtaField adds `Confirm id={9}`.

### C6. Behaviour to keep
- SEO: `pageSeo('impact')` (seo.ts L19, og `/og/impact.png`). Breadcrumb JSON-LD via BaseLayout; visible `<Breadcrumbs>` in the hero.
- Deep links: `<article id={result.id}>` (`#india`, `#indonesia`, `#ukraine`, `#tfa`) is linked from `pages/expertise/[slug].astro:70` `/impact#${result.id}`. Keep these ids on the new case cards.
- A11y figure pattern: the visual figure is `aria-hidden` and the real text sits in `.visually-hidden` (CaseEntry L56-64, ImpactCard L27-29). `aria-labelledby={`case-${id}-title`}`.
- `<abbr title="industrially produced trans-fatty acids">iTFA</abbr>` on first use, plus the footnote `abbreviations.iTFA.note` (CaseEntry L28-29,75; ImpactCard L15-16,33). This is C-11.
- Heading fix: the case outcomes are h2s at the same level as h2 `partOne`. In v3, make them h3s under h2 "From our founder’s career".
- Consent and permission gating (C5) must be copied exactly. Tags: `result.pillars` → `<PillarTag href={pillarHref(k)}>`, and `result.sectors` as plain labels.

### C7. Dead after redesign
`bencho/CardSwap.astro` + `scripts/bencho/card-swap.ts`, `bencho/FoggyWord.astro` + `scripts/bencho/foggy-word.ts`, and `scripts/pages/impact.ts` in full (it only lazy-loads those two). `CaseEntry.astro` and `EngagementRow.astro` are rebuilt (ticket stub, perforation, `PillarDot` row). `Testimonials.astro` keeps its logic and gets new styles. `shared/ImpactRow.astro` is ALREADY dead (zero importers in src). `ImpactCard` on /impact goes, but the component stays for home and expertise. `Stamp`, `NodeCluster`-in-stamp, `MarginNote`, `Scribble` and `SpecLabel` usages go, along with `data-rise`, `data-parallax`, `data-stamp-spin`, `data-toy`, `data-cursor="throw|wipe"` and `.grain`.

---

## D. Shared mechanisms (all three routes)
- Mode: `src/lib/mode.ts` L7-9: `mode = site.mode`, `isStaging`, `isProduction`. `src/config/site.ts:10`: production only if `PUBLIC_SITE_MODE === 'production'` at build time, otherwise staging (the default). `npm run build` gives staging and `npm run build:prod` gives production. `.github/workflows/pages.yml:18` pins staging.
- `Confirm.astro` L8 self-gates on `isStaging`; some callers double-gate it. Staging also sets `<meta name="robots" content="noindex, nofollow">` (SeoHead L17) and `robots.txt` `Disallow: /`.
- There are two CONFIRM id namespaces. Numbers 1-14 are brief section 11 (`mode.ts` `confirmItems`). Strings `C-1`…`C-21` come from DESIGN-SPEC.md 8.2 (L2135-2155). So `12` (trademark) ≠ `C-12` (engagements pending).
- Removing every visible CONFIRM on the live link either needs `build:prod`, which also hides the engagement section and the null rows, or v3 must stop rendering `<Confirm>` entirely.
- BaseLayout: the `page` prop drives `body[data-page]`, which selects the motion page module (`scripts/motion/index.ts` L117-133; a missing file is skipped safely) and the Header nav current state. The `breadcrumbs` prop drives BreadcrumbList JSON-LD (L40). The `showCrumbs` prop controls the visible trail; `cta` adds CtaField. The inline flags script (L49-56: `motion`, `motion-failed` after 3 s, `kk-motion` paused) must stay byte-identical, or `vercel.json` CSP `script-src 'self' 'sha256-5EZi…'` breaks it (`npm run verify` → `scripts/csp-hash.mjs`).
- CSP: `img-src 'self' data:` and `font-src 'self'`. Photography must be self-hosted (src/assets via `astro:assets`), with no CDN fonts. `@fontsource-variable/inter` and `@fontsource-variable/source-serif-4` are already in package.json. BaseLayout L57-58 preloads Bricolage + Plex Mono; replace those globally.
- Motion to keep: `[data-reveal]`, recipe R2 (`scripts/motion/reveal.ts` L17-37: opacity 0→1, y 28→0, 0.8 s, once), is the brief's "gentle fade-up". Under reduced motion or with JS off, nothing may be hidden; `tests/reduced-motion.spec.ts` checks `hiddenInMain` is empty, and `html.motion` is removed under reduce.
- Tests that apply to these routes: seo.spec (above); `a11y.spec` (axe WCAG 2.2 AA at 1440 and 390, zero violations); `responsive.spec` (360/768/1024/1280/1440: no horizontal scroll, no text cut off).

## E. Mapping: brief target → data → gaps
| Target section | Data source(s) | Gap / CONFIRM |
|---|---|---|
| Industries hero | `industriesPage.overline`, `.headline` | — |
| Industries one-paragraph intro | none. The nearest draft is `seo.industries.description` (`data/seo.ts` L23, COMPOSED, a list of sectors) | **Missing: C-15** |
| 9 industry cards: name + one line | `industries[].name`, `.copy` (brief section 6.3, verbatim; some are 2 lines), `.slug` as card id | — |
| "Relevant expertise" links | `industriesPage.relevantExpertise` (also `microcopy.relevantExpertise`); `industries[].pillars` → `pillarHref(k)` + `pillars[].name`/`.shortLabel` | Mapping is COMPOSED (C-10) |
| Card photo (brief section 6.3 says "a photo") | `Industry.image`/`imageAlt` hook exists | **No photos exist** (`industries.ts` L1 "graft 13"; src/assets/photos holds only the founder cutouts) |
| Approach hero | `approach.overline`, `.headline`, `.intro` | — |
| 3 columns Connect/Collaborate/Create | `steps[].name/.copy/.n`, `stepLabels.*` | **whatWeDo / whatYouGet / duration all null (9 cells): CONFIRM 10** |
| 5 principles numbered grid | `principlesHeading`, `principles[].name/.copy` | — |
| Ways to work table (5 models) | `modelsHeading`, `modelColumns`, `models[]` | Values are brief draft: **CONFIRM 10** |
| NEW FAQ (NDAs, fee basis, on-site vs remote, languages, travel) | **No FAQ exists in data, the brief or the docs.** Partial facts: NDAs `principles[4].copy` "We sign NDAs as standard." (approach.ts:22). On-site: `models[0].shape` "2–5 days on site…" (approach.ts:28). Remote/travel: `site.base` "Based in the Netherlands, working worldwide" (config/site.ts:14), `founder.ts:21`. Languages: `languages` in `@/data/founder` L65 ['English','Hindi','Marathi','Bahasa Indonesia (conversational)','Russian (basic)']. Fee basis: nothing; only `home.cta.body` "The first conversation is free of charge." (home.ts:38, CONFIRM 9; edited by another v3 agent on 10 Nov from "is on us") and model shapes (fixed scope, days per month) | **All answers need new copy and client approval. No CONFIRM id exists; one must be added (next free spec id: C-22)** |
| Promise line (current ReportFold) | `positioning.promise` (`@/data/home`) | Not in target: keep as a quote or drop (decision) |
| Impact hero | `impactPage.overline/.headline/.lead` | — |
| Stats strip | `home.proof[]` + `proofSource`; or the founder figures (`figure.value`, `secondaryFigures`, `storyNotes.impact.indiaFigure` '1st', `emphasis[0]` 'WHO') | No dedicated impact stats data. Choose one set; do not invent numbers |
| Section label "From our founder’s career (Wilmar / Cargill)" | `impactPage.partOne` = 'From our founder’s career' (no parenthesis). Per-card `result.context` ends with '(Wilmar)' or '(Cargill)' | The combined "(Wilmar / Cargill)" string is not in data: compose it from the existing strings or add a field |
| 4 case cards: label, headline, C / D / R, tags | `context`, `outcome`, `challenge`/`done`/`result` + `impactPage.labels.*`, `pillars` → PillarTag, `sectors`, `figure.source` | **challenge null for india, indonesia, tfa: C-9**. Ukraine's sector 'Edible oils' ≠ any industry name; tfa has no sector |
| KoKreaters engagements (3 anonymised) | `impactPage.partTwo`, `.anonymised`, `.engagementDateline`, `engagements[].text/.pillars/.consent` | **All pending: CONFIRM 6 (2 Indian) + C-12 (EU). Hidden in production** |
| Testimonials | `testimonials[]` (empty) | **CONFIRM 8** |
| CTA band (every page) | `CtaField` ← `home.cta` (headline, body, button), `site.bookingUrl`, `site.email` | Out of scope: "we’re all ears" (`notes/chrome.ts:17`) + `Confirm 9` live here |

## F. Images currently used
- Raster content images: **none** on any of the three routes. `industries[].image` is unset for all nine entries; impact and approach have no images.
- Texture: `src/assets/fx/grain.png` via the `.grain` class (`src/styles/grounds.css:56-62`), on ind-wheel, acts__stage, report, im-hero, case. Grid: `.paper-grid` (grounds.css:52) on ind-head and ap-hero.
- Inline SVG: SectorWheel (L28-46), the MethodSteps act diagrams (geometry in `acts.ts`), `Stamp` rings, `NodeCluster` (approach.astro:50 size 112; impact.astro:39 size 128; logo colours #2C509E/#306FE0/#4C9BE8/#8DBDF0/#E5494D/#F4C841), and `PillarDot`/`PillarTag` dots.
- Canvas: Crumple (`crumple__canvas`), FoggyWord (`fog__glass`).
- OG cards: `public/og/industries.png`, `public/og/approach.png`, `public/og/impact.png` (fallback `public/og/default.png`). They exist and seo.spec checks them.
- Available photography in repo: only `src/assets/photos/ganeaysh-cutout.png` and `ganeaysh-cutout-square.png`. v3 sector and case photography must be sourced, licensed and self-hosted.
