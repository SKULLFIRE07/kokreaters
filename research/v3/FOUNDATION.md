# v3 foundation: what page builders use (read this, then REDESIGN-V3.md §4 for your page)

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

| Token | Size, 390 → 1440 |
|---|---|
| `--fs-display` | 40 → 64 |
| `--fs-h1` | 36 → 56 |
| `--fs-h2` | 30 → 42 |
| `--fs-h3` | 21 → 26 |
| `--fs-h4` | 19 → 21 |
| `--fs-stat` | 48 → 76 |
| `--fs-quote` | 24 → 34 |
| `--fs-lead` | 18 → 21 |
| `--fs-body` | 18 |
| `--fs-small` | 15 → 16 |
| `--fs-meta` | 14 |
| `--fs-label` | 12 → 13 |

Each has matching `--lh-*` and `--tr-*` tokens. Families are `--font-serif` (Source Serif 4) and `--font-sans` (Inter). Measures are `--measure: 68ch` and `--measure-lead: 52ch`.

**Type classes** (prefer these to hand-set CSS): `.t-display .t-h1 .t-h2 .t-h3 .t-h4 .t-stat .t-quote .t-lead .t-body .t-small .t-meta .t-label .tnum .measure`.
- Bare `h1`–`h4` already get their step at zero specificity.
- `.t-display`, `.t-h1` and `.t-h2` carry max-widths of 18ch, 22ch and 28ch.

**Space:** `--s-1`…`--s-10` = 4 8 12 16 24 32 48 64 96 128.
- `--section` is 72 → 120 (the band padding). `--section-tight` is 48 → 80.
- `--grid-gap` is 16 → 32. `--gutter-x` is 20 → 48.
- Inside a band, the rhythm is label, then 16, heading, then 48, content. SectionHeader does this for you.

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
- Props: `eyebrow?`, `title` (required), `lead?`, `level?: 2|3` (2), `id?`, `align?: 'left'|'center'`, `link?: {label, href}`. Slot `lead` takes rich lead markup.
- `id` goes on the heading. Pair it with Section `labelledby`.
- The link sits right-aligned on desktop and below the lead on mobile. The component carries `data-reveal`.
- `<SectionHeader id="ind-h" eyebrow="Industries" title="Where we work" link={{label:'All industries', href:'/industries'}} />`

**PageHero** (this is where every H1 lives)
- Props:
  - `ground?: 'navy'|'grey'|'white'` (navy), `eyebrow?`, `title` (required), `lead?`
  - `crumbs?: Crumb[]`, `crumbsLabel?`
  - `image?`, `imageAlt?`, `imagePosition?`, `imageMode?: 'background'|'split'` (background)
  - `actions?: {label, href, variant?}[]` (the first is primary, the rest secondary)
  - `size?: 'lg'|'md'` (md), `align?: 'left'|'center'`, `titleId?` (default `page-title`)
- Slots: default (under the actions) and `aside` (a right column when there is no split photo; 7/5 grid).
- A background photo always gives the navy treatment.
- The image is loaded eager with fetchpriority high. It is the LCP image, so do not add another priority image above the fold.
- Mobile: a background photo becomes a band above the text; split puts the photo under the text at 4:3; actions go full width.
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
- Props: `src`, `alt`, `sizes` (required), `ratio?: '21/9'|'16/9'|'3/2'|'4/3'|'1/1'|'4/5'`, `priority?`, `widths?`, `position?`, `fill?`.
- See §6 for usage.

**StatStrip**
- Props: `items: {value, label}[]`, `source?`, `cols?: 3|4`. Items carry `data-reveal`.
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

**ExpertiseCard**
- Props: `pillar: Pillar`, `variant?: 'home'|'hub'` (hub adds deliverables), `level?`.
- `<li><ExpertiseCard pillar={p} variant="hub" /></li>`

**ResultCard**
- Props: `eyebrow`, `title` (required), `figure?`, `body?`, `href?`, `tags?: string[]`, `level?`.
- Navy band: navy-800 surface. Light band: white surface with a hairline.
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
- **`data-reveal="lines"`** belongs to the PageHero H1 only (automatic). Do not add it yourself.
- **`data-settle`** on a wrapper (or on a `<Photo>` via attributes): the image scales 1.08 → 1 as it scrolls in. This uses CSS scroll-driven animation, so there is no JS.
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
- **Positions:** each photo record carries `position` (object-position) and `focal`. Pass `position`.
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
7. **No shadows, no radius above 2px, no pills, no gradients** (except the PageHero scrim). No drop-shadow cards.
8. **No new dependencies.**
   - No GSAP, Lenis, Three or Framer.
   - No `is:inline` scripts: the CSP allows exactly one hash.
   - The only page scripts allowed are `<script>import '@/scripts/pages/contact.ts'</script>`, insights filters and article share/print, as processed modules.
   - No scroll-jacking, parallax, counters, marquees or cursor effects.
9. **Copy comes from `src/data/*`** or the insights collection; never retype it.
   - Use real characters: ’ “ ” – — · − °C.
   - Bind number and unit with a no-break space (`25 years`) where a headline could break between them.
   - Sentence case, no exclamation marks.
10. **Images only through `Photo`,** with a correct `sizes`. Never a raw `<img>` for content photos. Never upscale.
11. **Design mobile, don't collapse it.** Start each section component with a header comment that states its mobile layout. Tap targets are at least 44px. Body text is at least 17px.
12. **Do not touch** BaseLayout's head script (its CSP hash), the chrome, `astro.config.mjs`, `vercel.json` or `public/_headers`. Never run `npm run build:prod` and never deploy, commit or push.
