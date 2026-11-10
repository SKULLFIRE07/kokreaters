# v3 foundation: what page builders use (read this, then REDESIGN-V3.md §4 for your page)

**v3.1 update (10 Nov 2026, REDESIGN-V3 §9 "elegant full-screen").** Changed at foundation level: bigger type and spacing tokens, 1440 container with `clamp(20px, 5vw, 96px)` gutters, a true full-screen home hero and tall full-bleed inner heroes, a new `PhotoInterlude`, automatic photo focal points, `BLEED_SAFE` photos, word-split heading reveals, image settle, stat count-up, and lighter cards (no boxes). APIs are backwards compatible. New and changed items are marked **(v3.1)** below.

The foundation is finished and integrated. `npx astro check` passes with 0 errors. `npx astro build` passes in both staging and `PUBLIC_SITE_MODE=preview`.

Everything below lives in `web/src/`. Import with `@/…`. **Do not edit foundation files.** These are `styles/*`, `components/{ui,cards,chrome,brand}/*`, `layouts/BaseLayout.astro`, `scripts/site.ts` and `lib/mode.ts`. If you need a change, put it in your report to the orchestrator. Every component also takes `class`. The live reference is `/styleguide` in staging, which renders every primitive on white, grey and navy.

## 1. Page skeleton

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import PageHero from '@/components/ui/PageHero.astro';
import Section from '@/components/ui/Section.astro';
import SectionHeader from '@/components/ui/SectionHeader.astro';
import { photos } from '@/data/photos';
const p = photos['refinery-01'];
---
<BaseLayout page="impact" seo={seo} breadcrumbs={[{ label: 'Impact', href: '/impact' }]}>
  <PageHero ground="navy" eyebrow="Impact" title={impactPage.headline} lead={impactPage.lead}
    crumbs={[{ label: 'Impact', href: '/impact' }]} image={p.src} imageAlt={p.alt} imagePosition={p.position} />
  <Section ground="white" labelledby="results-h">
    <SectionHeader id="results-h" eyebrow="…" title="…" link={{ label: 'See the impact', href: '/impact' }} />
    …
  </Section>
</BaseLayout>
```

**BaseLayout props:**

| Prop | What it does |
|---|---|
| `page` (required) | `'home'│'expertise'│'pillar'│'industries'│'approach'│'impact'│'insights'│'article'│'about'│'contact'│'legal'│'notfound'` |
| `seo` (required) | Page SEO data. |
| `breadcrumbs?: Crumb[]` | Feeds the JSON-LD only. Visible crumbs come from PageHero's `crumbs`. |
| `cta?` | `false` hides the CtaBand. `true` forces it. An object of CtaBand props customises it, e.g. `{ ground: 'navy' }`. |
| `ground?` | `'white'│'grey'` (body background). |
| `showCrumbs?` | Leave this off. |
| `pillar?` | Has no effect. |

- **Order:** SkipLink, AnnouncementBar, Header, `<main id="main">` (your slot), CtaBand, Footer, CookieConsent.
- **CtaBand** renders inside `<main>` after your content on every page except contact, legal and notfound.
- **Home** gets `{ newsletter: true, ground: 'white' }`. The footer then drops its own form.
- **Your last section** is followed by the CtaBand, which is grey by default. Never end on grey, or pass `cta={{ ground: 'white' | 'navy' }}`.

## 2. Tokens: use role tokens, never hex

**Role tokens** are re-declared by every ground. Your CSS should only use these:

| Token | Use |
|---|---|
| `--bg` | Ground colour. |
| `--fg` | Body text. |
| `--fg-2` | Meta and secondary text. |
| `--head` | Headings. |
| `--label` | Eyebrows and icons. |
| `--link` | Small links. |
| `--accent` | Figures of 24px or more, arrows, hover rules. Once per screen. |
| `--figure` | Stat numbers. |
| `--rule` | 1px hairline. |
| `--rule-strong` | 2px top rule. |
| `--focus` | Focus ring. |
| `--surface`, `--surface-hover` | Cards. |

Palette tokens (`--navy-900`, `--blue-700`, `--grey-50` and the rest) are for the rare fixed-colour case only.

**Type**

| Token | Size, 390 → 1920 (fluid) |
|---|---|
| `--fs-display` | 44 → 96 (≈ 80 at 1440) **(v3.1)** |
| `--fs-h1` | 38 → 72 (≈ 61 at 1440) **(v3.1)** |
| `--fs-h2` | 32 → 56 (≈ 48 at 1440) **(v3.1)** |
| `--fs-h3` | 22 → 28 **(v3.1)** |
| `--fs-h4` | 19 → 22 |
| `--fs-stat` | 52 → 96 (≈ 84 at 1440) **(v3.1)** |
| `--fs-quote` | 26 → 40 **(v3.1)** |
| `--fs-lead` | 19 → 24 (≈ 22 at 1440) **(v3.1)** |
| `--fs-body` | 18 |
| `--fs-small` | 15 → 16 |
| `--fs-meta` | 14 |
| `--fs-label` | 12 → 13 |

Each has matching `--lh-*` and `--tr-*` tokens. Families are `--font-serif` (Source Serif 4) and `--font-sans` (Inter). Measures are `--measure: 68ch` and `--measure-lead: 46ch` **(v3.1;** the lead is bigger now).

**Type classes** (prefer these to hand-set CSS): `.t-display .t-h1 .t-h2 .t-h3 .t-h4 .t-stat .t-quote .t-lead .t-body .t-small .t-meta .t-label .tnum .measure`.
- Bare `h1`–`h4` already get their step at zero specificity.
- `.t-display`, `.t-h1` and `.t-h2` carry max-widths of 18ch, 22ch and 28ch.

**Space:** `--s-1`…`--s-10` = 4 8 12 16 24 32 48 64 96 128.
- **(v3.1)** `--section` is 80 (390) → 148 (1440) → 180 (1920), the band padding. `--section-tight` is 56 → 112.
- **(v3.1)** `--container: 1440px` (default and wide are both 1440 now). `--gutter-x: clamp(20px, 5vw, 96px)` (72 at 1440). `--grid-gap` is 16 → 40. `.card-grid` row gap is 40 → 72 (light cards need air, not boxes).
- **(v3.1)** `--chrome-top` = header height + the announcement bar when it shows (what a full-screen hero subtracts). `--header-h` is 64 / 80 (≥ 1120) / 88 (≥ 1600; compact 72).
- Inside a band, the rhythm is label, then 24, heading, then 24, lead, then 48 → 96 to the content. SectionHeader does this for you.

**Shape:** `--r-sm: 2px` is the only radius. `--shadow-panel` is for the menus only, nothing else.

**Motion:** `--ease-out`, `--ease-in-out`, `--d-1` 160 (hover), `--d-2` 240 (UI), `--d-3` 420 (panels), `--d-4` 800 (reveals). All durations become 0 under reduced motion.

## 3. Layout and utility classes

**Breakpoints** (mobile first, `min-width`): 600, 900, 1200. The header switches at 1120.

| Class | Use |
|---|---|
| `.container` (`--narrow` 760, `--wide` 1440, `--bleed`) | Section/Container already wrap your content in one. |
| `.grid-12` | Children use `style="--col: 1 / 8"` from 900px. `--col-sm` sets the span below 900 (default full width). |
| `.card-grid` | Wrap as `<ul class="card-grid" role="list"><li>card</li></ul>`. Columns go 1, then 2 (600), then 3 (900). `style="--cols:4"` (or 2) sets the desktop count. `.card-grid--xl` stays 2-up until 1199 and reaches the full count at 1200. Use it for home expertise (3×2) and results (4-up). `<li>`s stretch cards to equal height. |
| `.tile-grid` | Hairline grid for IndustryTile `tile`: `<ul class="tile-grid"><li><IndustryTile …/></li></ul>`. Columns go 1, 2 (600), 3 (900). |
| `.stack` / `.cluster` / `.flow` | Vertical gap (`--stack-gap`), a wrapping row (`--cluster-gap`), and flow spacing (`--flow`). |
| `.hairline`, `.hairline--strong` | 1px `--rule` and 2px `--rule-strong` dividers. |
| `.visually-hidden`, `.nowrap` | Accessibility text and no-wrap helper. |
| `.js-only` / `.nojs-only` | JS gates. |
| `.pointer-only` / `.touch-only` | Pointer gates. |
| `.u-draw` | Underline draws in from the left on hover of the element or a parent `a`/`button`/`.u-hover`. |
| `.u-nudge` | Arrow moves 4px on parent hover. |
| `.u-zoom` | Wrapper; its img scales 1.04 on hover. |
| `.u-hover` | Marks a parent as the hover trigger. |
| `.prose` / `.prose.prose--legal` | Long-form baseline. The Insights builder refines it. |

## 4. Components

APIs are exactly as implemented; `?` marks an optional prop.

**Section** (`ui/Section.astro`)
- Props: `ground?: 'white'|'grey'|'navy'` (white), `pad?: 'default'|'tight'|'flush-top'|'none'`, `id?`, `labelledby?`, `width?: 'default'|'narrow'|'wide'|'bleed'`, `rule?: boolean`, and any other attributes.
- When two identical grounds touch, put `rule` on the second one.
- `<Section ground="grey" labelledby="x-h" rule>…</Section>`

**Container**
- Props: `width?: 'default'|'narrow'|'wide'`, `as?`.
- `<Container width="narrow">…</Container>`

**Eyebrow**
- Props: `as?: 'p'|'span'|'div'`.
- `<Eyebrow>Impact</Eyebrow>`

**SectionHeader**
- Props: `eyebrow?`, `title` (required), `lead?`, `level?: 2|3` (2), `id?`, `align?: 'left'|'center'`, `layout?: 'auto'|'stack'` **(v3.1)**, `link?: {label, href}`. Slot `lead` takes rich lead markup.
- `id` goes on the heading. Pair it with Section `labelledby`.
- **(v3.1)** `layout="auto"` (default): from 1200px, a left-aligned h2 with a lead becomes an asymmetric editorial split: eyebrow + title in columns 1–7, lead (+ link) in 8–12, bottom-aligned. `layout="stack"` keeps the classic stack. Without a lead the link sits right-aligned on the title row; on mobile it is below the lead. The lead is now `--fg-2`.
- **(v3.1)** Carries `data-reveal="split"`: the title's words rise line by line, then eyebrow, lead and link fade in. The title must be a plain string.
- `<SectionHeader id="ind-h" eyebrow="Industries" title="Where we work" link={{label:'All industries', href:'/industries'}} />`

**PageHero** (this is where every H1 lives)
- Props:
  - `ground?: 'navy'|'grey'|'white'` (navy), `eyebrow?`, `title` (required, plain string), `lead?`
  - `crumbs?: Crumb[]`, `crumbsLabel?`, `crumbsCurrentShort?`, `crumbsHideCurrentOnPhone?`
  - `image?`, `imageAlt?`, `imagePosition?` (defaults to the photo's tuned focal point), `imageMode?: 'background'|'portrait'|'split'` (background)
  - `actions?: {label, href, variant?}[]` (the first is primary, the rest secondary)
  - `size?: 'lg'|'md'|'sm'` (md) **(v3.1)**, `align?: 'left'|'center'`, `titleId?` (default `page-title`), `leadTone?`, `asideMobile?`, `scrollCue?` **(v3.1)**
- **Sizes (v3.1):**
  - `lg`: the home hero. It fills the first screen: `min-height: max(640px, 100svh − --chrome-top)`. Display type 44 → 96 (also capped at 9.4svh so short laptops fit), text bottom-left, a soft two-way navy gradient, and a scroll cue in the right gutter (`scrollCue`, default on with a background photo).
  - `md` with a background photo: a tall full-bleed inner hero, `clamp(560px, 76svh, 940px)`, text bottom-left. `md` without a photo: an airy band, `clamp(420px, 52svh, 620px)` on desktop, H1 (38 → 72) bottom-aligned.
  - `sm`: md type with no minimum height (contact, legal, utility).
- **Modes:** `background` is full-bleed behind the gradient and must be a **landscape `BLEED_SAFE` photo** (§6; dev logs a warning otherwise). `portrait` is the About mode: text in 7 columns, the whole 4:5 portrait framed in columns 8–12 (up to 560px wide), standing on the band's bottom edge, never cropped. `split` is a half-bleed photo right (pillar pages).
- Slots: default (under the actions) and `aside` (a right column when there is no split photo; 7/5 grid).
- A background photo always gives the navy treatment.
- The image is loaded eager with fetchpriority high. It is the LCP image, so do not add another priority image above the fold.
- **(v3.1)** The H1 is word-split (`SplitText`); its words rise in a stagger on load (CSS only). Lead, actions and the default slot follow (`data-hero-after`).
- Mobile: a background photo becomes a band above the text (lg 200–340px ≈ 34svh, md 200–320px); portrait puts the framed 4:5 photo under the text; split puts the photo under the text at 4:3; actions go full width below 600px.

**PhotoInterlude (v3.1)** (`ui/PhotoInterlude.astro`)
- Props: `slug?: BleedSafeSlug` (or `src?` + `alt?`), `position?`, `caption?` (one serif line), `eyebrow?`, `size?: 'md'|'lg'` (md), `class?`.
- A full-bleed `<figure>` between two sections, one per long page (Home, Approach, Impact, About). Place it **between** `<Section>`s, not inside one.
- Height: md = 40vw (≈ 2.5:1), lg = 46vw (≈ 2.2:1), capped at 86 / 92svh, so a 3:2 photo keeps ≥ 60 % of its height. Mobile: `min(64svh, 100vw)` (about square at 390).
- A caption sits bottom-left on the container grid over a soft bottom gradient (white serif italic, AA).
- Motion: a subtle CSS scroll-driven parallax (±3 % drift, 6 % total), off under reduced motion.
- `<PhotoInterlude slug="refinery-02" caption="From crude oil to customer specification." />`

**SplitText (v3.1)** (`ui/SplitText.astro`)
- Props: `text`. Renders word spans (`.wd`, `--w`) with real spaces between them; no-break spaces keep their pieces together. Use it inside a heading in a `data-reveal="split"` block. PageHero, SectionHeader and CtaBand already use it.
- `<PageHero ground="navy" imageMode="split" image={portrait} imageAlt="…" crumbs={[{label:'About',href:'/about'}]} title="…" lead="…" />`

**Button**
- Props: `href?`, `type?`, `variant?: 'primary'|'secondary'|'tertiary'`, `size?: 'md'|'lg'`, `icon?: 'arrow'|'external'|'download'|'calendar'|null`, `full?`, `disabled?`, `loading?`, and any other attributes.
- Renders `<a>` when there is an `href`. Tertiary shows an arrow by default.
- Heights are 48 (md) and 56 (lg). The `.btn .btn--primary|secondary|tertiary .btn--lg .btn--full` classes are global.
- `<Button href="/contact" size="lg" icon="arrow">Start a conversation</Button>`

**ArrowLink**
- Props: `href?`; the slot is the label.
- Without `href` it renders a `<span>`, for use inside a card that is already a link.
- `<ArrowLink href="/impact">See the impact</ArrowLink>`

**Icon**
- Props: `name`, `size?` (24), `stroke?` (1.75), `label?` (with a label it becomes `role="img"`; otherwise it is aria-hidden).
- Names: arrow-right, arrow-up-right, arrow-left, chevron-down, chevron-right, menu, close, plus, minus, linkedin, mail, whatsapp, phone, download, calendar, check, external, clock, pin, search, error, success.
- `<Icon name="mail" size={20} />`

**ExpertiseIcon**
- Props: `pillar: PillarKey`, `size?` (32).
- `<ExpertiseIcon pillar="process" />`

**Tag**
- Props: `href?`, `size?: 'sm'|'md'`; the slot is the text. Put several in `.cluster`.
- `<Tag href="/expertise/process-design">Process</Tag>`

**Photo**
- Props: `src?`, `alt?`, `slug?` **(v3.1)**, `sizes` (required), `ratio?: '21/9'|'16/9'|'3/2'|'4/3'|'1/1'|'4/5'|'3/4'|'auto'`, `priority?`, `widths?`, `position?`, `fill?`, `settle?` **(v3.1)**.
- **(v3.1)** With no `position`, a stock photo's tuned focal point from `src/data/photos.ts` is applied automatically (matched by `src`). `slug` fills `src`, `alt` and `position` from the record. `ratio="auto"` (or no ratio) keeps the natural proportions, so nothing is cropped. `settle` turns on the 1.06 → 1 scroll scale-in.
- See §6 for usage.

**StatStrip**
- Props: `items: {value, label}[]`, `source?`, `cols?: 3|4`. Items carry `data-reveal`.
- **(v3.1)** No dividing boxes: each item opens with a hairline, figures are 52 → 96px. Numeric figures count up once (`data-count`).
- Use it full width only; labels get cramped in narrow columns.
- `<StatStrip items={proof} source="From our founder’s career." />`

**NumberedList**
- Props: `items: string[]`, `start?`, `cols?: 1|2`.
- `<NumberedList items={pillar.helpWith} />`

**ProcessFlow**
- Props: `steps: string[]`, `caption?`, `title?`.
- Horizontal from 900px, vertical below. Fits up to about 7 steps at 1200px.
- `<ProcessFlow steps={[…]} title="Crude oil in, customer specification out" />`

**Accordion**
- Props: `items: {q, a}[]` (a is plain text), `id?` (default `faq`; use unique ids if there are two).
- `<Accordion id="approach-faq" items={faq} />`

**Breadcrumbs**
- Props: `items: Crumb[]` (Home is added automatically), `label?`, `tone?` (ignored).
- Normally you get this through PageHero `crumbs`.

**Confirm**
- Props: `id: number|string`, `note?`.
- Renders only in staging. Never type "CONFIRM" anywhere else.
- `<Confirm id={10} note="durations" />`

**CtaBand**
- Props: `title?`, `body?`, `primary?: {label, href}`, `secondary?: {label, href}`, `newsletter?`, `ground?: 'grey'|'navy'|'white'` (grey).
- **(v3.1)** Full section padding, with the title at `--fs-h1` in columns 1–7 (or `--fs-h2` beside the newsletter) and a word-split reveal.
- Usually rendered through BaseLayout `cta`. Its h2 has `id="cta-heading"`.

**NewsletterForm**
- Props: `id` (required, unique), `tone?: 'light'|'dark'`, `compact?`, `heading?`.
- `<NewsletterForm id="nl-insights" heading="Newsletter" />`

**InsightCard**
- Props:
  - `href`, `title`, `label` (required)
  - `pillarName?`, `summary?`, `date?: Date`, `readTime?: number`
  - `image?`, `imageAlt?`, `imagePosition?`
  - `size?: 'feature'|'default'|'compact'|'text'`, `level?: 2|3|4` (3), `priority?`
  - Slot `badge`, e.g. `{showDraftLabels && isDraft(e) && <span slot="badge"> · Draft</span>}`.
- A `feature` card goes side by side when the card is at least 880px wide, so put it in a block or grid cell, not a flex row.
- `<InsightCard href={insightHref(e)} title={e.data.title} label={formatLabel(e)} date={e.data.date} readTime={insightReadingTime(e)} image={p.src} imageAlt={p.alt} />`

**Cards (v3.1): lighter.** ExpertiseCard, ResultCard and the IndustryTile `card` no longer have a surface, box or side borders. Each has a 1px hairline on top, open space and the band's own ground. On hover an accent line draws across the hairline. Card images are 3:2 with automatic focal points and settle on scroll; InsightCard images also zoom on hover. ResultCard figures count up.

**ExpertiseCard**
- Props: `pillar: Pillar`, `variant?: 'home'|'hub'` (hub adds deliverables), `level?`.
- `<li><ExpertiseCard pillar={p} variant="hub" /></li>`

**ResultCard**
- Props: `eyebrow`, `title` (required), `figure?`, `body?`, `href?`, `tags?: string[]`, `level?`.
- **(v3.1)** No surface on any ground: a top hairline only.
- `<ResultCard eyebrow={r.dateline} figure="21%" title={r.homeLine} href="/impact" />`

**IndustryTile**
- Props: `href`, `name` (required), `copy?`, `n?`, `image?`, `imageAlt?`, `expertise?: {label, href}[]`, `variant?: 'tile'|'card'` (tile), `level?`, plus attributes such as `id`.
- `tile` goes inside `.tile-grid`; `card` goes inside `.card-grid` with `id={slug}` for the anchors.

**Logo**
- Props: `variant?` (horizontal, horizontal-white, full, full-white, wordmark, wordmark-white, cluster), `href?`, `label?`, `alt?`, `height?`, `width?`, `size?`, `inline?`, `loading?`.
- `<Logo variant="full-white" width={240} />`

**NodeMark**
- Props: `size?` (48), `tone?: 'color'|'white'|'blue'`, `label?`. This is the quiet signature for the 404 and the article end mark.

**Chrome** (Header, MegaMenu, IndustriesMenu, MobileMenu, Footer, AnnouncementBar, SkipLink, CookieConsent) is rendered by BaseLayout. Never import it into a page.

## 5. Motion attributes (CSS + `site.ts`; nothing else allowed)

- **`data-reveal`**
  - A blur-fade once the element is 15% visible: 800ms, translateY 20 → 0, blur 6 → 0.
  - Stagger siblings with `style="--i:n"` (70ms steps, capped at 5).
  - Use it on section blocks, images and card `<li>` wrappers, e.g. `<li data-reveal style="--i:2">`. Cards themselves carry none.
  - Never use it on an h1, on article body paragraphs, or on anything above the fold that is the LCP element.
  - SectionHeader, StatStrip items, NumberedList items and the CtaBand already reveal.
- **`data-reveal="split"` (v3.1)** goes on a block whose heading holds `<SplitText>`. The words rise line by line (site.ts numbers them `--l`), then the block's `[data-part]` children (eyebrow, lead, link; stagger with `--i`) fade in. SectionHeader and CtaBand use it.
- **`data-reveal="lines"`** belongs to the PageHero H1 only (automatic): its words rise in a stagger on load, CSS only. `data-hero-after` (+ `--i`) delays the lead, actions and slot after it. Do not add either yourself.
- **`data-settle`** on a wrapper, or `<Photo settle>` **(v3.1)**: the image scales 1.06 → 1 as it scrolls in. It uses the CSS `scale` property with a scroll-driven animation (no JS), so it combines with `.u-zoom`.
- **`data-parallax` (v3.1)** is PhotoInterlude's own drift. Do not use it elsewhere.
- **`data-count` (v3.1)** on a figure element (StatStrip and ResultCard have it). If the figure starts below the fold, it counts from 0 up to its server-rendered value once, at 60 % visible, over 1.4s. A visually hidden copy keeps the real value for screen readers. Ordinals ("1st") and figures with no number ("WHO") are left alone. Reduced motion and no-JS show the final value.
- All motion is off under `prefers-reduced-motion`.
- **`details[data-smooth]`** gives a smooth height (Accordion has it).
- **Content is never hidden** without JS, under reduced motion, or 3s after a failed boot (`html.motion-failed`).

## 6. Photos

```astro
import Photo from '@/components/ui/Photo.astro';
import { photos, photosByTag } from '@/data/photos';   // slugs: research/v3/photos.md
const p = photos['lab-01'];
<Photo src={p.src} alt={p.alt} position={p.position} ratio="3/2"
  sizes="(min-width: 1200px) 400px, (min-width: 600px) 46vw, calc(100vw - 40px)" />
```

- **Always** go through `Photo` (or a component that uses it), with a `sizes` that matches the column.
- **Ratios:** card 3:2, feature 3:2, portrait 4:5, square 1:1, hero 16:9 or 21:9.
- **Positions (v3.1):** each photo record carries a tuned `position` (object-position) and `focal`. `Photo` applies it automatically, so pass `position` only to override.
- **Orientation (v3.1, §9.2):** portrait photos go in portrait frames (4:5 / 3:4) and landscapes in landscape frames. Never put a portrait photo into a wide background.
- **`BLEED_SAFE` (v3.1):** `refinery-01, refinery-02, plant-01, texture-01, texture-02, oilseeds-01, chocolate-01, bakery-02, oils-01, people-02, people-03`. These are the only photos for PageHero backgrounds and PhotoInterlude. **Not safe:** people-01 (heads cut), lab-01, factory-01, and every portrait photo. Helpers: `isBleedSafe(slug)`, `photoBySrc(src)`.
- **Founder portrait:** `@/assets/photos/ganeaysh-portrait.jpg` (4:5, 1600×2000) for the About hero and the home founder band. `@/assets/photos/ganeaysh-portrait-square.jpg` (1200²) is for bylines and the author box. Never use the cut-out PNG.
- **Priority:** only the LCP image is `priority`. PageHero sets it for its own image.

## 7. Site modes (`@/lib/mode`)

`SiteMode = 'staging'|'preview'|'production'` comes from `PUBLIC_SITE_MODE` (unset means staging).

| Export | staging | preview | production |
|---|---|---|---|
| `showConfirm` | yes | no | no |
| `showDraftLabels` | yes | no | no |
| `includeDrafts` (alias `showDrafts`) | yes | yes | no |
| `showPendingConsent` (engagements with consent 'pending') | yes | no | no |
| `indexable` | no | no | only with `PUBLIC_INDEXABLE=1` |

Also exported: `mode`, `isStaging`, `isPreview`, `isProduction`.

**The gaps rule:** when a fact is missing, render `{showConfirm ? <Confirm id={n} /> : null}` and hide the element outside staging. Never show "—" and never invent a fact. `lib/insights`: `visibleInsights()` already respects `includeDrafts`. Other helpers: `featuredInsight()`, `byPillar(k)`, `comingSoon()`, `formatLabel(e)`, `insightReadingTime(e)`, `insightHref(e)` and `isDraft(e)`. `lib/format` provides `formatDate`, `isoDate`, `pad2`, `fill` and `dotJoin`.

## 8. QA loop (run it for every page at 1440, 1024, 768, 390 and 360)

- **One dev server per project.** Astro 7 refuses a second `astro dev` for the same project. Run `npx astro dev status` first and reuse the running server's URL. If none is running, start one: `npx astro dev --port 4400 --host 127.0.0.1` (it backgrounds itself; `npx astro dev stop` ends it). Never stop a server you did not start.
- **Shoot each page:** `node scripts/qa-shoot.mjs /your-path your-name --base http://127.0.0.1:<port> --widths 1440,1024,768,390,360`.
  - Output goes to `research/v3/shots/<name>-<w>.jpg` and `-fold.jpg`. A `name` containing `/` makes a subfolder.
  - It prints overflow offenders, console errors, failed requests, images without alt, the h1–h3 outline and any visible CONFIRM/DRAFT text.
  - The dev toolbar is disabled.
  - **READ your shots.** "wider than viewport: none" at 360 is mandatory.
- **Check** with `npx astro check` (0 errors), then `npx astro build` and `PUBLIC_SITE_MODE=preview npx astro build`. Preview HTML must contain no "CONFIRM" or "Draft".
- **Axe:** `node research/v3/scripts/integ-axe.mjs http://127.0.0.1:<port> /your-path` (WCAG 2.1 AA plus best practice, at 1440 and 390, with the first 12 tab stops). The target is 0 violations.

## 9. Page builder rules (what not to do)

1. **No new colours or fonts.** No hex values in page CSS. Use role tokens. No purple, pink, yellow or red outside the logo artwork.
2. **Accent once per screen.** `--accent` is only for figures of 24px or more, arrows and hover rules. Small text uses `--link` / `--label`, never `--accent` on grey or navy.
3. **One H1 per page, and it is PageHero's.** Section titles are h2 through SectionHeader. Cards inside a section are h3 (pass `level` when the outline needs it).
4. **Every `<Section>` has an accessible name.** Use `labelledby` set to the SectionHeader `id`. Ids are unique per page.
5. **Grounds alternate** (navy hero, white, grey, …). If two identical grounds touch, add `rule`. Remember the CtaBand (grey) follows your last section.
6. **No re-implementing components.** No one-off cards, buttons, eyebrows or stat blocks. Do not restyle a component's internals from a page. Use the `class` prop only for layout (margins, grid placement).
7. **No shadows, no radius above 2px, no pills, no gradients** (except the PageHero and PhotoInterlude scrims). No drop-shadow cards and **(v3.1)** no boxed cards.
8. **No new dependencies.**
   - No GSAP, Lenis, Three or Framer.
   - No `is:inline` scripts: the CSP allows exactly one hash.
   - The only page scripts allowed are `<script>import '@/scripts/pages/contact.ts'</script>`, insights filters and article share/print, as processed modules.
   - No scroll-jacking, marquees or cursor effects. **(v3.1)** Parallax and counters exist only as the foundation's PhotoInterlude and `data-count`. Do not build your own.
9. **Copy comes from `src/data/*`** or the insights collection; never retype it.
   - Use real characters: ’ “ ” – — · − °C.
   - Bind number and unit with a no-break space (`25 years`) where a headline could break between them.
   - Sentence case, no exclamation marks.
10. **Images only through `Photo`,** with a correct `sizes`. Never a raw `<img>` for content photos. Never upscale.
11. **Design mobile, don't collapse it.** Start each section component with a header comment that states its mobile layout. Tap targets are at least 44px. Body text is at least 17px.
12. **Do not touch** BaseLayout's head script (its CSP hash), the chrome, `astro.config.mjs`, `vercel.json` or `public/_headers`. Never run `npm run build:prod` and never deploy, commit or push.
