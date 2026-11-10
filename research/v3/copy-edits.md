# KoKreaters v3: copy tone sweep

Branch `redesign/v3-editorial`, swept 10 Nov 2026 against the KoKreaters Website Redesign Brief (9 Nov 2026).
Scope searched: everything under `web/src`: `components`, `data`, `pages`, `layouts`, `scripts`, `lib`, `config`, `content`.

**Verdicts**
- **DELETE**: the string belongs to a removed toy, note or effect. Page builders delete the usage too.
- **REWRITE**: the idea stays, in plain, confident wording.
- **KEEP**: a strong line, or a plain label. "KEEP → x" means the string moves to `x` because `data/notes/*` is being deleted.

**Status column**
- **applied**: already edited in `data/*.ts`.
- **builder**: the change sits in a component, page or script. Page builders own it.
- **moved**: the string now also exists in `data/*.ts`.

No facts, numbers, clients or claims were added. Line numbers in `data/notes/*` are as on disk (those files were not edited). Line numbers in `data/*.ts` are after the v3 edits.

Hit count: **142** strings in `data/notes/*` · **14** in `data/*.ts` · **64** component, page or script sites (copy, scribble splits, hand styling, stamps, cursor labels, script fallbacks) · **26** CONFIRM/DRAFT render sites · **0** prose rewrites needed in the two MDX insights. **246** in total.

Exclamation marks in copy: none. Emoji: none. The one decorative glyph is `✶` in `Hero.astro:20`.

---

## A. `data/*.ts` (applied or decided here)

| file:line | verbatim | verdict | replacement / action | status |
|---|---|---|---|---|
| data/microcopy.ts:13 | Field notes from the plant floor and the boardroom. Once a month. No noise. | REWRITE | `Field notes from the plant floor and the boardroom, once a month.` ("No noise." is the root of the "no noise, really" aside the brief removes) | applied |
| data/home.ts:38 | Tell us about your product, your plant or your decision. The first conversation is on us. | REWRITE | `… The first conversation is free of charge.` (same claim, still CONFIRM 9) | applied |
| data/microcopy.ts:42 | Reconnect the node and go home | REWRITE | `Return to the home page` (was a 404 toy instruction; the key is not used anywhere) | applied |
| data/microcopy.ts:37 | DRAFT for Ganeaysh's review | DELETE (render) | Value kept so the type holds. `DraftRibbon.astro` must render nothing on the live link (see section D) | builder |
| data/microcopy.ts:38 | Pending client consent | DELETE (render) | Value kept. Do **not** just hide the label while still listing pending engagements: that would publish them without consent (see D) | builder |
| data/microcopy.ts:60 · data/contact.ts:12 | You (visitorFallback) | DELETE (render) | Only used by the boarding pass and the connection path (`Ticket.astro:39,44`, `ConnectionMoment.astro:22`, `scripts/pages/contact.ts:65-66`). Field kept | builder |
| data/microcopy.ts:61 | Placeholder text for review by a lawyer before launch. Not legal advice. | KEEP (flag) | The legal pages really are placeholder text. Keep it until a lawyer signs off, restyled as a plain small note. Removing it needs the client's decision | — |
| data/microcopy.ts:22-24 | This page hasn't been created yet. Let's connect you back. | KEEP | Brief section 7 bank. Show it without the `yet` underline or the word pit | — |
| data/microcopy.ts:25 | Take me home | KEEP | Brief section 7 bank | — |
| data/home.ts:5 · data/approach.ts:6 · data/home.ts:37 | swooshPhrase: shared ambition / with you / together | KEEP (data) | Harmless split keys. Components stop wrapping them in `<Scribble>` (see C2) | builder |
| data/microcopy.ts:69-77 | (new) announcement, announcementLink, backToTop, readMore, expertiseAreas, otherExpertise, readingTimeLabel, writtenByLabel | KEEP → new keys | Plain UI labels moved from notes so builders can point at them after `data/notes` goes | moved |
| data/impact.ts:51 | (new) `figureFallback = { india: '1st', tfa: 'WHO' }` | KEEP → new export | Replaces 3× `indiaFigure` in notes and the hard-coded `'WHO'` in `ImpactFold.astro:20` and `expertise/[slug].astro:41` | moved |
| data/impact.ts:54 | (new) `routeMapTitle = 'Where the founder's results happened'` | KEEP → new export | Only if the route map stays as a static figure | moved |
| data/founder.ts:34 | (new) `bioStat = { value: '25', label: 'years of making ingredients work' }` | KEEP → new export | Was `storyNotes.about.years` / `yearsLabel` (`LongBio.astro:21,22,25`) | moved |
| data/pillars.ts:123-130 | (new) `pillarExhibits` (title, steps, from, to per pillar) | KEEP → new export | The six pillar-diagram label sets from `expertiseNotes.diagram`, minus "fig." and "scroll, it draws itself". Use for one static exhibit per pillar page | moved |

**Strong lines checked and kept unchanged:**
- Hero headline "Where deep expertise meets shared ambition." (CONFIRM 2).
- Positioning "Deep expertise, shared ownership, measurable results." and its promise "We do not hand over a report and leave…".
- "Six ways we create value, together."
- "Connect. Collaborate. Create."
- "Results that started on the plant floor."
- "Ideas from the plant floor and the boardroom."
- All six pillar promises and headlines (`pillars.ts:8,24,40,56,72,87`), including "Clear answers for Go/No-Go decisions."
- Principle "Plant floor to boardroom" (`approach.ts:18`).
- "We create with you, not for you."
- "Let's create something together."
- "Built on 25 years of making ingredients work."
- About intro, long bio and name copy.
- Every deliverable and help-with list.
- The engagement-models table (`approach.ts:27-33`).
- Founder quote (CONFIRM 4).
- All SEO strings.

---

## B. `data/notes/*.ts` (the whole folder is deleted in v3; each string's fate and where it is used)

### B1. data/notes/chrome.ts
| file:line | verbatim | verdict | replacement / action | used at |
|---|---|---|---|---|
| chrome.ts:9 | Field notes from the plant floor and the boardroom. | KEEP → microcopy.announcement | only if the announcement bar stays | AnnouncementBar.astro:12 |
| chrome.ts:10 | Read the insights | KEEP → microcopy.announcementLink | " | AnnouncementBar.astro:13 |
| chrome.ts:13 | Pause motion | DELETE | the pause-motion bar goes; motion is fade-up only and respects reduced motion | MotionToggle.astro:11,14 · AnnouncementBar.astro:17 · scripts/motion/pause.ts:39 |
| chrome.ts:14 | Play motion | DELETE | " | MotionToggle.astro:11 · scripts/motion/pause.ts:39 |
| chrome.ts:16 | or just say hello | DELETE | — | MobileMenu.astro:66 |
| chrome.ts:17 | we're all ears | DELETE | — | CtaField.astro:30 |
| chrome.ts:18 | thanks for reading all the way down | DELETE | — | Footer.astro:21 |
| chrome.ts:19 | Back to top | KEEP → microcopy.backToTop | — | Footer.astro:20 |
| chrome.ts:21 | Previous | DELETE | rails become grids (if any carousel survives, use "Previous") | Rail.astro:18 |
| chrome.ts:22 | Next | DELETE | " | Rail.astro:20 |
| chrome.ts:23 | {i} / {n} | DELETE | " | Rail.astro:19 · scripts/motion/rail.ts:23 |
| chrome.ts:26-31 | drag · throw · wipe · press · open · pull (6) | DELETE | cursor follower goes | scripts/motion/index.ts:106 · scripts/motion/cursor.ts:27 · every `data-cursor` attribute (C4) |

### B2. data/notes/expertise.ts
| file:line | verbatim | verdict | replacement / action | used at |
|---|---|---|---|---|
| expertise.ts:8 | they're designed to work together | DELETE | the intro already ends "Our six areas of expertise are designed to work together." | pages/expertise/index.astro:37 |
| expertise.ts:9 | science · plants · strategy (Venn lobes) | DELETE | hand-drawn Venn goes | pages/expertise/index.astro:21,34 |
| expertise.ts:10 | that's us | DELETE | — | pages/expertise/index.astro:34 |
| expertise.ts:11 | Read the full note | REWRITE | `microcopy.readMore` "Read more", or show the intro in full (it is 3 sentences) | IntroMore.astro:19 |
| expertise.ts:14 | hover a pillar | DELETE | — | bencho/HubDiagram.astro:39 |
| expertise.ts:15 | The six areas of expertise | KEEP → microcopy.expertiseAreas | — | bencho/HubDiagram.astro:36 |
| expertise.ts:16 | tap one to dive in | DELETE | — | bencho/HubDiagram.astro:40 |
| expertise.ts:19 | six blocks, one team | DELETE | — | pages/expertise/index.astro:47 |
| expertise.ts:22 | start anywhere | DELETE | — | expertise/PromptRow.astro:18 |
| expertise.ts:25 | you are here | DELETE | — | expertise/PillarMap.astro:49 |
| expertise.ts:26 | the other five | REWRITE | `microcopy.otherExpertise` "Other areas of expertise" | expertise/PillarMap.astro:51 |
| expertise.ts:29 | fig. {n} | REWRITE | use `microcopy.exhibit` ("Exhibit") + number | expertise/PillarDiagram.astro:22 (N.fig) |
| expertise.ts:30 | scroll, it draws itself | DELETE | — | expertise/PillarDiagram.astro:22 (N.scroll) |
| expertise.ts:31 | From unmet need to a product that scales | KEEP → pillarExhibits.innovation.title | — | PillarDiagram.astro:22 |
| expertise.ts:32 | Unmet need · Technical brief · Prototype · Scale-up · Launch | KEEP → pillarExhibits.innovation.steps | — | " |
| expertise.ts:33 | Crude oil in, customer specification out | KEEP → pillarExhibits.process.title | — | " |
| expertise.ts:34 | Degumming · Bleaching · Deodorisation · Fractionation · Interesterification | KEEP → pillarExhibits.process.steps | — | " |
| expertise.ts:35 | Crude · Spec | KEEP → pillarExhibits.process.from/to | — | " |
| expertise.ts:36 | Process contaminants, stopped layer by layer | KEEP → pillarExhibits.quality.title | — | " |
| expertise.ts:37 | 3-MCPD and GE · Trans fats · Mineral oil hydrocarbons | KEEP → pillarExhibits.quality.steps | — | " |
| expertise.ts:38 | Risk · Your brand | KEEP → pillarExhibits.quality.from/to | — | " |
| expertise.ts:39 | Three questions before you commit capital | KEEP → pillarExhibits.strategy.title | — | " |
| expertise.ts:40 | Is the market real? · Does the technology work? · Do the numbers hold? | KEEP → pillarExhibits.strategy.steps | — | " |
| expertise.ts:41 | Your idea · Go · No-Go | KEEP → pillarExhibits.strategy.from/to | — | " |
| expertise.ts:42 | What the spreadsheet shows, and what it does not | KEEP → pillarExhibits.deals.title | iceberg art goes; labels stay | " |
| expertise.ts:43 | What the spreadsheet shows | KEEP → pillarExhibits.deals.from | — | " |
| expertise.ts:44 | A tired refinery · A fragile quality system · A technology that will not transfer | KEEP → pillarExhibits.deals.steps | — | " |
| expertise.ts:45 | Train, transfer, coach: stronger teams | KEEP → pillarExhibits.capability.title | growth-tree art goes | " |
| expertise.ts:46 | Train · Transfer · Coach | KEEP → pillarExhibits.capability.steps | — | " |
| expertise.ts:47 | Stronger teams | KEEP → pillarExhibits.capability.to | — | " |
| expertise.ts:50 | What's inside | DELETE | "nutrition label" idea goes. The list sits under `pillarPage.helpWith` "What we help with" | expertise/HelpList.astro:28 |
| expertise.ts:51 | Nothing hidden | DELETE | — | expertise/HelpList.astro:28 |
| expertise.ts:52 | Contents may vary with your plant. | DELETE | — | expertise/HelpList.astro:28 |
| expertise.ts:55 | Inspect the label | DELETE | inspector toy goes | bencho/SpecInspector.astro:16-17,29 · HelpList.astro:26 |
| expertise.ts:56 | Close the inspector | DELETE | " | bencho/SpecInspector.astro:17 · scripts/bencho/spec-inspector.ts:62 |
| expertise.ts:57 | drag the frame over the label | DELETE | " | bencho/SpecInspector.astro:30 |
| expertise.ts:58 | {n} items | DELETE | " | bencho/SpecInspector.astro:18 |
| expertise.ts:59 | fig. {n} | DELETE | " | bencho/SpecInspector.astro:18 |
| expertise.ts:62 | what lands on your desk | DELETE | heading `pillarPage.deliverables` "Typical deliverables" covers it | expertise/Deliverables.astro:15 |
| expertise.ts:65 | 1st | KEEP → impact.ts figureFallback.india | — | pages/expertise/[slug].astro:41 |
| expertise.ts:66 | one for the record | DELETE | — | pages/expertise/[slug].astro:69 |
| expertise.ts:69 | pick yours | DELETE | — | pages/industries.astro:31 |
| expertise.ts:70 | Industries wheel | DELETE | wheel goes; the index list carries `aria-label="Industries"` | pages/industries.astro:35 · industries/SectorWheel.astro:47 |
| expertise.ts:71 | scroll to turn the wheel | DELETE | — | industries/SectorWheel.astro:70 |
| expertise.ts:72 | Sector | DELETE | wheel panel label | industries/SectorWheel.astro:58 |

### B3. data/notes/home.ts
| file:line | verbatim | verdict | replacement / action | used at |
|---|---|---|---|---|
| home.ts:7 | that's you + us | DELETE | — | home/Hero.astro:26 |
| home.ts:8 | pull a node, it's all connected | DELETE | — | home/Hero.astro:29 |
| home.ts:11 | yes, that WHO | DELETE | — | home/ProofBand.astro:56 |
| home.ts:12 | INDIA · WILMAR / INDONESIA · WILMAR / UKRAINE · −25 °C / TÜRKIYE / THE NETHERLANDS | DELETE | split-flap goes; places stay in `hero.footRight`, datelines in `impact.ts` | home/ProofBand.astro:38 · bencho/FlapBoard.astro:14 |
| home.ts:15 | plant floor · lab · boardroom · the same person | DELETE | Venn goes; `positioning.range` says it in prose | home/Positioning.astro:17,23 |
| home.ts:16 | most consultants pick one circle | DELETE | — | home/Positioning.astro:24 |
| home.ts:17 | Read the whole truth | REWRITE | show `positioning.range` in full (preferred), else `microcopy.readMore` | home/Positioning.astro:29 · home/MethodFold.astro:40 |
| home.ts:20 | From crude oil on the plant floor to a decision in the boardroom | DELETE | the PlantPipeline fold goes (home cut to 8 sections) | home/PlantPipeline.astro:16 · pages/index.astro:27 |
| home.ts:21 | Crude comes in | DELETE | " | home/PlantPipeline.astro:19 |
| home.ts:22 | Refine it right | DELETE | " | home/PlantPipeline.astro |
| home.ts:23 | Split the fractions | DELETE | " | " |
| home.ts:24 | Blend to spec | DELETE | " | home/PlantPipeline.astro:22 |
| home.ts:25 | Product that ships | DELETE | " | " |
| home.ts:26 | Go or No-Go | DELETE | " | home/PlantPipeline.astro:24 |
| home.ts:27 | GO | DELETE | " | " |
| home.ts:28 | one pipe, one person | DELETE | " | " |
| home.ts:29 | and up it goes | DELETE | " | " |
| home.ts:30 | scroll, it flows | DELETE | " | " |
| home.ts:33 | keep scrolling, it moves sideways | DELETE | rail becomes a grid | home/WhatWeDo.astro:44 |
| home.ts:34 | swipe for all six | DELETE | " | home/WhatWeDo.astro:45 |
| home.ts:37 | listening comes first | DELETE | step copy already says "We listen first" | home/MethodFold.astro:32 |
| home.ts:38 | with proof that it works | DELETE | step copy says "the measures to prove it works" | home/MethodFold.astro:33 |
| home.ts:41 | yes, minus twenty-five | DELETE | — | home/ImpactFold.astro:32 |
| home.ts:42 | 1st | KEEP → impact.ts figureFallback.india | — | home/ImpactFold.astro:20 |
| home.ts:43 | Where the founder's results happened | KEEP → impact.ts routeMapTitle | only if the map stays, static | home/RouteMap.astro:43 |
| home.ts:44 | home base | DELETE | — | home/RouteMap.astro:70 |
| home.ts:47 | go on, toss one | DELETE | gravity toy goes; industries become a plain link grid | home/WhereWeWork.astro:16 |
| home.ts:50 | fresh from the notebook | DELETE | — | home/InsightsFold.astro:23 |
| home.ts:53 | no noise, really | DELETE | — | home/InsightsFold.astro:39 |
| home.ts:56 | that's Ganeaysh | DELETE | — | home/FounderFold.astro:35 |

### B4. data/notes/journal.ts
| file:line | verbatim | verdict | replacement / action | used at |
|---|---|---|---|---|
| journal.ts:7 | field notes, not fluff | DELETE | — | insights/HubHero.astro:45 |
| journal.ts:8 | press one to lift it | DELETE | card fan goes | pages/insights/index.astro:32 |
| journal.ts:9 | What's inside | DELETE | label idea goes; Filters already show counts; the article meta becomes one plain line | insights/HubHero.astro:56 · article/ArticleHeader.astro:63 |
| journal.ts:10 | field notes · plant floor · boardroom · | DELETE | spinning stamp goes | insights/HubHero.astro:50 |
| journal.ts:11 | the rest of the deck is on its way | DELETE | — | pages/insights/index.astro:35 |
| journal.ts:14 | no noise, really | DELETE | — | insights/NewsletterFold.astro:12 |
| journal.ts:17 | grab a coffee | DELETE | — | article/ArticleHeader.astro:55 |
| journal.ts:18 | the short version | DELETE | the "Key takeaways" title stays (`microcopy.keyTakeaways`) | article/Takeaways.astro:13 |
| journal.ts:19 | Reading time | KEEP → microcopy.readingTimeLabel | — | article/ArticleHeader.astro:31 |
| journal.ts:20 | Written by | KEEP → microcopy.writtenByLabel | — | article/ArticleHeader.astro:32 |
| journal.ts:23 | Boarding pass | DELETE | boarding pass goes; the booking CTA is a plain button "Book a 30-minute call" | bencho/Ticket.astro:35 · contact/ContactDetails.astro:44 |
| journal.ts:24 | Passenger | DELETE | " | bencho/Ticket.astro:44 |
| journal.ts:25 | With | DELETE | " | bencho/Ticket.astro:45 |
| journal.ts:26 | Length | DELETE | " | bencho/Ticket.astro:46 |
| journal.ts:27 | 30 min | DELETE | " (the fact stays in "Book a 30-minute call") | bencho/Ticket.astro:46 |
| journal.ts:28 | tear here | DELETE | — | bencho/Ticket.astro:55 |
| journal.ts:31 | the more detail, the better | DELETE | — | contact/ContactForm.astro:49 |
| journal.ts:32 | talk soon | DELETE | `microcopy.formSuccess` stands alone | contact/ContactForm.astro:98 |
| journal.ts:33 | Who | DELETE | connection-path toy goes | contact/ConnectionMoment.astro:13 · pages/contact.astro:20 |
| journal.ts:34 | What | DELETE | " | contact/ConnectionMoment.astro:14 |
| journal.ts:37 | the small print, in normal-size print | DELETE | — | layouts/LegalLayout.astro:45 |
| journal.ts:40 | go on, make a mess | DELETE | word pit goes | pages/404.astro:29-30 |

### B5. data/notes/story.ts
| file:line | verbatim | verdict | replacement / action | used at |
|---|---|---|---|---|
| story.ts:7 | the whole idea, really | DELETE | — | pages/approach.astro:37 |
| story.ts:8 | Read the whole truth + | REWRITE | show the intro in full (2 sentences), else `microcopy.readMore` | pages/approach.astro:43 |
| story.ts:9 | three acts, keep scrolling | DELETE | pinned stage goes; 3 steps as a plain grid | approach/MethodSteps.astro:70 |
| story.ts:12 | we listen first | DELETE | restates step copy | approach/MethodSteps.astro:20 |
| story.ts:13 | your people own it | DELETE | " | approach/MethodSteps.astro:20 |
| story.ts:14 | then we prove it works | DELETE | " | approach/MethodSteps.astro:20 |
| story.ts:17 | FINAL_report_v7.pdf | DELETE | crumple toy goes; keep ReportFold's h2/lead as plain text | approach/ReportFold.astro:21 |
| story.ts:18 | Crumple it | DELETE | " | approach/ReportFold.astro:21 · scripts/bencho/crumple.ts:176 |
| story.ts:19 | Smooth it out | DELETE | " | approach/ReportFold.astro:21 · scripts/bencho/crumple.ts:170,194 |
| story.ts:20 | much better | DELETE | " | approach/ReportFold.astro:21 |
| story.ts:23 | the house rules | DELETE | heading "Principles" stays | approach/Principles.astro:19 |
| story.ts:26 | pick a shape | DELETE | heading "Ways to work with us" stays | approach/EngagementTable.astro:18 |
| story.ts:29 | fling one | DELETE | card stack goes → grid | pages/impact.astro:49 |
| story.ts:30 | Next card | DELETE | " | pages/impact.astro:51 · bencho/CardSwap.astro:24 |
| story.ts:33 | wipe the glass | DELETE | frost toy goes; show −25 °C as a plain figure | impact/CaseEntry.astro:67 |
| story.ts:34 | yes, minus twenty-five | DELETE | — | impact/CaseEntry.astro:68 |
| story.ts:37 | names withheld, on purpose | DELETE | `impactPage.anonymised` "Anonymised" already says it | pages/impact.astro:69 |
| story.ts:40 | 1st | KEEP → impact.ts figureFallback.india | — | pages/impact.astro:25 · impact/CaseEntry.astro:38 |
| story.ts:43 | hello from the Netherlands | DELETE | — | about/AboutHero.astro:37 |
| story.ts:44 | INDIA · WILMAR / … / THE NETHERLANDS | DELETE | split-flap goes | pages/about.astro:29 |
| story.ts:45 | 25 | KEEP → founder.ts bioStat.value | — | about/LongBio.astro:21,25 |
| story.ts:46 | years of making ingredients work | KEEP → founder.ts bioStat.label | — | about/LongBio.astro:22,25 |
| story.ts:47 | Read the long version + | REWRITE | show the full bio (it is the About page), else `microcopy.readMore` | about/LongBio.astro:29 |
| story.ts:48 | the long way round | DELETE | — | about/Timeline.astro:31 |
| story.ts:49 | scroll to spin it | DELETE | — | about/GlobeSection.astro:29 · scripts/pages/about.ts |
| story.ts:50 | = together | DELETE | `name.ko` "Ko stands for together…" says it | about/NamePanel.astro:19 |
| story.ts:51 | = the people who make things happen | DELETE | `name.kreaters` says it | about/NamePanel.astro:23 |
| story.ts:52 | and a bit of Russian | DELETE | languages list already says "Russian (basic)" | about/EducationLanguages.astro:21 |

---

## C. Component, page and script strings for page builders (not data; not edited)

### C1. Hard-coded copy
| file:line | verbatim | verdict | action |
|---|---|---|---|
| components/home/Hero.astro:20 | ` ✶ ` (overline separator glyph) | REWRITE | plain ` · ` (or a thin rule) |
| components/home/Hero.astro:24 | `<span>Where deep</span> <span>expertise meets</span> … shared ambition.` (H1 hard-coded) | REWRITE | render `{hero.headline}` from data (CONFIRM 2 may change it); no swoosh |
| components/expertise/PillarMap.astro:50 | aria-label "Other expertise" | REWRITE | `microcopy.otherExpertise` |
| scripts/bencho/crumple.ts:170,176,194 | 'Smooth it out' / 'Crumple it' fallbacks | DELETE | with the crumple toy |
| scripts/motion/pause.ts:39 | 'Play motion' / 'Pause motion' fallbacks | DELETE | with the pause bar |
| scripts/pages/contact.ts:65-66 | 'You' visitor/passenger fallback | DELETE | with the ticket and connection path |
| scripts/pages/about.ts:7 | "scroll to spin it" note logic | DELETE | with the note |
| components/expertise/PillarHero.astro:27 | `{n} of 06 · Expertise` | KEEP | plain |
| components/contact/ContactForm.astro:52,82 | "(required)" | KEEP | plain |

### C2. Handwritten scribbles wrapped around headline phrases (the split strings are hard-coded): render the plain headline
| file:line | hard-coded phrase / effect |
|---|---|
| components/home/Hero.astro:24 | "shared ambition" swoosh |
| components/home/Positioning.astro:15,27 | "We build the answer with your people" highlight |
| components/home/FounderFold.astro:20,44 | "We create with you." underline |
| pages/expertise/index.astro:20,30 | "connects" swoosh |
| pages/impact.astro:26,35 | split on " on the ", highlight "plant floor" |
| components/insights/HubHero.astro:25,41 | "plant floor" highlight + "boardroom" circle |
| components/contact/ContactDetails.astro:15,21 | "together" highlight |
| pages/404.astro:13,22 | "yet" underline |
| pages/industries.astro:19-20,28 | last word circled |
| pages/approach.astro:21-23,36 | `approach.swooshPhrase` circle |
| components/shared/CtaField.astro:19,25 | `cta.swooshPhrase` circle |
| components/insights/ComingSoon.astro:17 | zigzag under "In preparation" |

### C3. Handwritten (Caveat) labels and buttons: set in the sans
- `t-hand`:
  - components/expertise/IntroMore.astro:19
  - components/home/Positioning.astro:29
  - components/home/MethodFold.astro:40
  - pages/approach.astro:43
  - components/about/LongBio.astro:29
  - components/shared/PillarCard.astro:35 ("Learn more" + `<Arrow hand>`)
  - components/bencho/SpecInspector.astro:29
  - components/bencho/CardSwap.astro:24
  - components/ui/Button.astro:36,41 (`handish`)
- `variant="hand"` buttons:
  - components/home/Hero.astro:37
  - components/home/ImpactFold.astro:36
  - components/home/MethodFold.astro:45
  - components/article/AuthorBox.astro:15
  - components/shared/Newsletter.astro:30

### C4. Spinning stamps and cursor-follower labels: DELETE
- Stamp rings:
  - components/home/ProofBand.astro:33 ("From our founder's career · …")
  - pages/impact.astro:39
  - pages/approach.astro:50 (tagline)
  - components/insights/HubHero.astro:50
  - layouts/LegalLayout.astro:53 ("Legal · {title} ·")
  - components/bencho/HubDiagram.astro:64 (pillar shortLabels ring)
- `data-cursor` labels:
  - components/bencho/CardFan.astro:49
  - components/bencho/CardSwap.astro:22
  - components/bencho/Crumple.astro:23
  - components/bencho/FallingText.astro:25
  - components/bencho/FoggyWord.astro:18
  - components/bencho/GravityTags.astro:21
  - components/bencho/Ticket.astro:50
  - components/home/HeroNetwork.astro:35
  - components/home/WhatWeDo.astro:52
- Cursor scripts: scripts/motion/index.ts:106, scripts/motion/cursor.ts:27.

### C5. Toy mount points (their copy is listed in B)
- Split-flap: components/home/ProofBand.astro:38, pages/about.astro:29
- Gravity tags: components/home/WhereWeWork.astro:18
- Crumple: components/approach/ReportFold.astro:21
- Card stack: pages/impact.astro:51
- Card fan: pages/insights/index.astro:34
- Falling text: pages/404.astro:30
- Connection path: pages/contact.astro:20
- Confetti: pages/contact.astro:26
- Boarding pass: components/contact/ContactDetails.astro:44
- Spec inspector: components/expertise/HelpList.astro:26
- Venn: pages/expertise/index.astro:34, components/home/Positioning.astro:23
- Sector wheel: pages/industries.astro:36
- Marquee: pages/index.astro:24
- Plant pipeline: pages/index.astro:27
- Motion toggle: components/chrome/AnnouncementBar.astro:17
- Magnetic dots: components/shared/CtaField.astro:22
- Magnetic letters: components/home/Hero.astro:23
- Foggy word (frost): components/impact/CaseEntry.astro:58
- FAQ accordion: components/approach/EngagementTable.astro:21. The brief says keep the engagement-models **table**, so turn the accordion back into a `<table>` with `modelColumns`.

---

## D. CONFIRM / DRAFT labels visible on the live link

`npm run build` defaults to **staging** (`config/site.ts:10`, unless `PUBLIC_SITE_MODE=production`, i.e. `npm run build:prod`). So every `<Confirm>` and `<DraftRibbon>` below renders on the live link today.

Sites:
- `<Confirm>` in components:
  - components/chrome/Footer.astro:69 (11)
  - components/bencho/Ticket.astro:57 (9)
  - components/article/ArticleHeader.astro:52 (C-14, publication date)
  - components/about/Timeline.astro:44 (13)
  - components/contact/ContactDetails.astro:22 (9)
  - components/shared/CtaField.astro:26 (9)
  - components/home/FounderFold.astro:50 (4)
  - components/approach/MethodSteps.astro:45 (10)
  - components/approach/EngagementTable.astro:19 (10)
  - components/about/LongBio.astro:26 (13)
  - components/about/EducationLanguages.astro:24 (5)
  - components/impact/EngagementRow.astro:28 (C-12)
  - components/impact/CaseEntry.astro:76 (C-9)
  - pages/industries.astro:29 (C-15)
- `<Confirm>` in pages and MDX:
  - pages/terms.mdx:25,37
  - pages/privacy.mdx:13,28,32
  - pages/cookies.mdx:21
  - content/insights/3-mcpd-glycidyl-esters-playbook.mdx:22
  - content/insights/trans-fat-elimination-inside-a-plant.mdx:43,75
- `<DraftRibbon>`:
  - components/article/ArticleHeader.astro:43
  - components/chrome/ExpertisePanel.astro:43
  - components/shared/InsightRow.astro:23
  - components/shared/CoverStory.astro:40

**Recommended:**
- Make `components/ui/Confirm.astro` and `components/ui/DraftRibbon.astro` render nothing in every mode. Their open items stay listed in `lib/mode.ts:56-71`.
- Leave the `<Confirm>` tags in MDX untouched. They carry the author's checks, and the component change hides them.

**Two guards:**
1. `pages/impact.astro:24` lists engagements with `consent: 'pending'` whenever `isStaging` is true. If the label "Pending client consent" goes but staging still lists them, three engagements go public without client consent. Filter to `consent === 'cleared'` unconditionally, or build with `build:prod`.
2. Both MDX insights are `status: draft` with `review: pending`. Production mode lists only `published` + `approved` entries (lib/insights.ts:18). Switching to `build:prod` would leave the Insights page with only the four "In preparation" titles. Decide: hide the ribbon only and keep the drafts listed, or publish them after review.

---

## E. Insight MDX prose (`content/insights/*.mdx`)

Both full articles (3-MCPD playbook, trans-fat elimination) were read in full. The prose is already plain and specific: no asides, no second-person nudges, no exclamations. **No prose edits made.** MDX component use (Note, Exhibit, ProcessChain, PullQuote, Takeaways, Confirm) is untouched. The four `coming-soon` entries have titles only (KEEP).

---

## F. Outside copy scope (for the token / page owners)

- `data/pillars.ts:19,35,51,67,82,98`: `hex` / `colourVar` / `inkText` still carry the purple, pink, yellow and mauve pillar colours (#5B2A86, #C8457E, #F4C841, #8C5B88). Not copy, so not changed.
- `data/types.ts:50-51`: `GroundKey` lists the v2 playful grounds.
- `package.json`: `@fontsource/caveat` and `@fontsource/ibm-plex-mono` remain dependencies once the notes and mono body go.
