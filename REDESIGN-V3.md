# KoKreaters v3 — "Editorial" redesign: the build contract

Status: authoritative for the v3 rebuild (branch `redesign/v3-editorial`). Supersedes DESIGN-SPEC.md / DESIGN-SPEC-v2.md for
everything VISUAL. Content, facts, routes, SEO and site-mode behaviour from v1/v2 stay unless this file says otherwise.
Source of truth for intent: the client's "KoKreaters Website — Redesign Brief for Developer" (9 Nov 2026), summarised in §0.

---------------------------------------------------------------------------------------------------------------------------
## 0. Intent in one paragraph

Keep the words and the page map, rebuild the look. Calm, senior, editorial, insight-led — the feeling of McKinsey India /
McKinsey Global, but ours: no borrowed fonts, colours, layouts or images. Dark navy hero bands, white and warm-grey content
bands, one serif headline face, one clean sans, real photography in one cool, quiet grade, big numbers with hairline
dividers, small uppercase labels, almost no motion. Confident, plain, specific copy. It must be just as good on a 390 px
phone as on a 1440 px desktop. Nothing playful survives: no handwriting, no monospace body, no purple/pink/yellow UI, no
toys, no rails, no scroll-jacking, no visible CONFIRM/DRAFT on the public link.

What makes it "the best", not "a template": (1) typographic discipline — optical-size serif, tight display tracking,
real hierarchy, 60–70ch measure; (2) rhythm — generous, consistent band spacing and alternating grounds; (3) one quiet
signature drawn from the logo: the **ringed node** (a small circle with a white ring and a hairline connector), used only
in diagrams, the timeline, numbered steps and the footer mark; (4) photography treated as one set; (5) details — hairlines,
tabular numerals, focus states, hover states, image crops, mobile layouts designed rather than collapsed.

---------------------------------------------------------------------------------------------------------------------------
## 1. Tokens (src/styles/tokens.css — replace the whole file)

### 1.1 Colour
```
--navy-900: #0B1B33;   /* primary dark: hero bands, footer, dark sections, primary buttons */
--navy-800: #13284A;   /* raised surface on navy (cards on dark bands), hover of primary button */
--navy-700: #1D3660;   /* hairlines/borders that must read on navy at 3:1 when needed */
--blue-700: #2C509E;   /* brand blue (logo): links, section labels, icons, chart lines */
--blue-500: #306FE0;   /* ACCENT — one highlight per screen: big numbers, arrows, hover states, focus ring */
--blue-300: #8DB2F7;   /* accent on navy (labels, arrows, small text on dark: >= 7:1 on navy-900) */
--grey-50:  #F2F2F0;   /* warm light grey: alternate bands */
--grey-100: #E7E7E3;   /* card hover on grey, skeleton */
--grey-200: #D9D9D4;   /* hairline on white/grey */
--grey-500: #8A8A85;   /* input borders (3:1 vs white), disabled */
--ink:      #1A1A1A;   /* body text */
--ink-2:    #5A5A5A;   /* secondary text (meta, captions) — 6.9:1 on white, 6.3:1 on grey-50 */
--white:    #FFFFFF;
--on-navy:  #FFFFFF;  --on-navy-2: rgba(255,255,255,.74);  --rule-on-navy: rgba(255,255,255,.18);
--danger:   #B42318;  --success: #1F6F43;
```
Role tokens used by components (re-declared by `.band--navy` so components work on any ground):
`--bg, --fg, --fg-2, --head, --label, --link, --accent, --rule, --focus`.
- white/grey grounds: fg ink, fg-2 ink-2, head navy-900, label blue-700, link blue-700, accent blue-500, rule grey-200, focus blue-500.
- navy ground: fg on-navy, fg-2 on-navy-2, head white, label blue-300, link white, accent blue-300, rule rule-on-navy, focus white.
Purple, pink, yellow, red appear ONLY inside the logo/node-cluster artwork. Pillar colours are retired: every pillar uses
brand blue. (`Pillar.hex/colourVar/inkText` stay in the data type but are not used for styling.)

Accent discipline: `--blue-500` is for large figures (>= 24px), arrows, the focus ring, hover underlines, and at most one
emphasised element per viewport. Small text links are `--blue-700` (7.4:1).

### 1.2 Type
Families (self-hosted, @fontsource-variable, both already npm-installed):
- `--font-serif: "Source Serif 4", "Source Serif Fallback", Georgia, "Times New Roman", serif;` — headlines, big numbers,
  pull quotes, card titles. File: `source-serif-4-latin-opsz-normal.woff2` (wght + opsz axes) + italic opsz file for quotes.
  `font-optical-sizing: auto` everywhere (display sizes get the finer display cut automatically).
- `--font-sans: "Inter", "Inter Fallback", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;` — body, nav,
  labels, buttons, forms, meta. File: `inter-latin-opsz-normal.woff2` (wght + opsz).
- Define metric-matched fallbacks (`@font-face { font-family:"Source Serif Fallback"; src: local("Georgia"); size-adjust; ascent-override; ... }`
  and Inter Fallback on local Arial) to keep CLS ~0. Preload the two normal woff2 files in BaseLayout. Remove Bricolage,
  Plex Mono, Caveat, Instrument Sans everywhere (fonts.css, copy-fonts.mjs, package.json, preloads).

Scale (fluid between 390 and 1440 with clamp; mobile → desktop):
| token | use | size | line-height | weight | tracking |
|---|---|---|---|---|---|
| `--fs-display` | home H1 | 40 → 64 | 1.06 | 420 serif | -0.02em |
| `--fs-h1` | page H1 | 36 → 56 | 1.08 | 420 serif | -0.018em |
| `--fs-h2` | section title | 30 → 42 | 1.14 | 430 serif | -0.012em |
| `--fs-h3` | card/feature title | 21 → 26 | 1.25 | 500 serif | -0.005em |
| `--fs-h4` | small card title, list heading | 19 → 21 | 1.3 | 560 serif | 0 |
| `--fs-stat` | big numbers | 48 → 76 | 1.0 | 380 serif, `font-variant-numeric: lining-nums tabular-nums` | -0.02em |
| `--fs-quote` | pull/founder quote | 24 → 34 | 1.3 | 400 italic serif | -0.01em |
| `--fs-lead` | hero sentence, intros | 18 → 21 | 1.5 | 400 sans | -0.005em |
| `--fs-body` | body | 17 → 18 | 1.6 | 400 sans | 0 |
| `--fs-small` | card summaries, footer | 15 → 16 | 1.55 | 400 sans | 0 |
| `--fs-meta` | dates, read time, captions | 14 | 1.45 | 400 sans | 0 |
| `--fs-label` | uppercase section labels/eyebrows | 12 → 13 | 1.3 | 600 sans, uppercase | 0.12em |
| `--fs-nav` | header nav | 15 | 1 | 500 sans | 0 |
| `--fs-button` | buttons | 15 → 16 | 1 | 600 sans | 0.005em |
Headlines are sentence case, `text-wrap: balance`; body `text-wrap: pretty`. Measure: `--measure: 68ch` for body,
`--measure-lead: 52ch`, headings max ~18ch (display) / 22ch (h1) / 28ch (h2) via max-width in ch.
Numbers in running text use lining figures. Use real typographic characters (’ “ ” – — · →, the minus sign −, °C).

### 1.3 Space, grid, layout
- 4-px base: `--s-1:4 --s-2:8 --s-3:12 --s-4:16 --s-5:24 --s-6:32 --s-7:48 --s-8:64 --s-9:96 --s-10:128`.
- Section padding `--section: clamp(72px, 4.5rem + 4.6vw, 120px)` top and bottom (72 mobile → 120 desktop). Tight
  variant `--section-tight: clamp(48px, … , 80px)`.
- Container: max content width **1200px** (`--container`), side gutter `--gutter-x: clamp(20px, 1.25rem + 2.4vw, 48px)`.
  Narrow container 760px (text pages, articles). Wide 1440px (full-bleed media frames).
- 12-column grid utility: `.grid-12 { display:grid; grid-template-columns: repeat(12, minmax(0,1fr)); column-gap: var(--grid-gap) }`
  with `--grid-gap: clamp(16px, 1rem + 1vw, 32px)`; below 900px most layouts collapse to 1 column (cards 2-col 600–900).
- Breakpoints (mobile-first, min-width): 600, 900, 1200. Header switches to full nav at >= 1120px.
- Header height 80px desktop → 64px compact on scroll; 64px mobile. Announcement line 36px.
- `scroll-margin-top` for anchors = header + 16px.

### 1.4 Shape, lines, depth
- Corner radius: `--r-sm: 2px` for buttons, inputs, tags, cards, images (crisp, senior). Never pills, never 24px cards.
- Hairlines: 1px `--rule`. Strong rule (section dividers on articles, top of cards): 2px `--navy-900` (or white on navy).
- No drop shadows except the mega-menu panel and mobile menu (`--shadow-panel: 0 24px 48px -24px rgba(11,27,51,.28)`).

### 1.5 Motion — "Apple-grade polish, McKinsey-grade restraint"
The owner asked for Apple-quality animation; the client brief asks for almost no motion. Resolution: few motions, each one
perfect — precise easing, short distances, nothing that moves on its own, nothing to play with. Patterns are ported from
apple.com and from the MIT React libraries listed on layro.dev/libraries (Motion Primitives `TextEffect`/`InView`/
`AnimatedBackground`, Magic UI `BlurFade`, Smoothui accordions) as **framework-free CSS + tiny vanilla TS** — no React, no
Framer Motion, no GSAP. Every motion is disabled under `prefers-reduced-motion: reduce` and content is fully visible
without JS.
Easing tokens: `--ease-out: cubic-bezier(.22,1,.36,1)` (Apple-like expo-out), `--ease-in-out: cubic-bezier(.65,0,.35,1)`.
Durations: `--d-1: 160ms` (hover), `--d-2: 240ms` (UI), `--d-3: 420ms` (panels), `--d-4: 800ms` (reveals).
1. **Blur-fade reveal** (`data-reveal`): opacity 0→1, translateY 20px→0, `filter: blur(6px)→0`, 800ms `--ease-out`,
   once, when 15% visible (IntersectionObserver adds `.is-in`). Stagger children with `style="--i:n"` (70ms steps, cap
   5). Section headers, cards, stats, images. Never on the LCP hero H1 or on article body paragraphs.
2. **Headline line reveal** (`data-reveal="lines"` on hero H1s on load, not scroll): the server splits nothing — CSS
   masks the whole H1 with a short upward fade (opacity + 12px + blur 4px, 900ms, 120ms delay). Must not delay LCP:
   the H1 is painted at full opacity for no-JS/reduced-motion and the animation starts from `animation-fill-mode:
   backwards` only under `html.js`.
3. **Image settle** (Apple product-shot feel): media inside `[data-settle]` scale 1.08→1.0 as they enter the viewport
   using CSS scroll-driven animations (`animation-timeline: view(); animation-range: entry 0% cover 40%`), wrapped in
   `@supports (animation-timeline: view())` — browsers without support simply show the image. No JS.
4. **Frosted sticky header**: `background: rgba(255,255,255,.82); backdrop-filter: saturate(180%) blur(20px)`, compacts
   80→64px on scroll (240ms), hairline appears. Mega-menu opens Apple-style: panel height eases open (420ms), its
   items blur-fade in with a 40ms stagger, and the page behind gets a soft scrim (`rgba(11,27,51,.18)` + blur 6px).
5. **Sliding hover highlight** (Motion Primitives `AnimatedBackground` idea): on desktop nav items and insight filter
   chips, one shared highlight pill/underline glides between hovered/active items (vanilla: position one absolutely
   positioned element via `getBoundingClientRect`, transition transform/width 240ms). Optional enhancement; plain hover
   state without it.
6. **Smooth accordion**: `<details>` content animates height with `interpolate-size: allow-keywords` +
   `::details-content` transition (progressive; instant elsewhere); plus→minus icon rotates.
7. **Hovers**: arrow links translate the arrow 4px; link underlines draw from left (background-size 0→100%); card image
   scale 1.04 over 700ms; card title → `--link`; buttons darken/lighten 160ms; ExpertiseCard top rule turns accent.
8. **Page transitions**: cross-document View Transitions (`@view-transition { navigation: auto; }`) with a 220ms
   crossfade of `main` (header/footer stay put via `view-transition-name`). Zero JS; reduced motion → none.
Banned: smooth-scroll libraries, scroll-jacking, parallax backgrounds, auto-moving tickers/marquees, animated number
counters, cursor effects, drag/toss toys, letter scrambles, WebGL. Delete GSAP, Lenis and Three from the bundle and
package.json. Remove the Pause-motion bar (reduced-motion is respected instead).

---------------------------------------------------------------------------------------------------------------------------
## 2. Imagery
- Photos: `src/assets/photos/stock/*.jpg` (licensed Unsplash/Pexels, pre-graded cool + desaturated by
  `scripts/grade-photos.mjs`), described in `src/data/photos.ts` (slug → import, alt, tags, credit). Founder portrait:
  `assets/photos/ganeaysh-portrait-1665x2048.png` (studio, grey wall, navy blazer) → copy into `src/assets/photos/` and
  use for About hero, Home founder band, author byline/box (square crop). Do NOT use the cut-out PNG any more.
- Always via `ui/Photo.astro` (astro:assets `<Picture>`, avif+webp, responsive widths, explicit `sizes`, lazy except
  the LCP hero image which is `loading="eager" fetchpriority="high"`). Ratios: hero 16:9 / 21:9 background, feature 3:2,
  card 3:2, portrait 4:5, square 1:1.
- Navy photo heroes: photo as background with an overlay `linear-gradient(90deg, rgba(11,27,51,.94) 0%, rgba(11,27,51,.86) 45%, rgba(11,27,51,.45) 100%)`
  (mobile: vertical gradient, stronger) — text contrast must stay >= 4.5:1 everywhere on the text column.
- Icons: **Lucide** (`lucide-static@1.70.0`, ISC licence, npm-installed; 2,300 thin-line SVGs in
  `node_modules/lucide-static/icons/<name>.svg`) — the icon set the layro.dev libraries use. Inline them at build time
  (import `?raw`, strip width/height, set `stroke-width`), zero runtime JS. UI icons (`ui/Icon.astro`): 24px box, stroke
  1.75. Expertise icons (`ui/ExpertiseIcon.astro`): 32px box, stroke 1.5, brand blue: innovation `flask-conical`,
  process `factory`, quality `shield-check`, strategy `split` (or `signpost`), deals `file-search`, capability `users`
  (pick the best-looking alternative from Lucide if one reads poorly). Lucide has no LinkedIn mark — draw a simple "in"
  square glyph by hand. Add Lucide's ISC notice to THIRD_PARTY_NOTICES.md.
- Diagrams (refining flow, timeline, method): clean static line drawings with the ringed-node signature; SVG/CSS, no
  animation, readable on mobile (vertical stack below 900px).
- The logo is never recoloured; on navy use the white variants that exist (`Logo` variants `horizontal-white`, `full-white`).

---------------------------------------------------------------------------------------------------------------------------
## 3. Shared building blocks (foundation — exact APIs; page builders import these, never re-implement)

All in `src/components/ui/`, `src/components/cards/`, `src/components/chrome/`, `src/components/brand/`. Every component
is ground-aware through role tokens (works inside `.band--navy` without props unless noted).

| Component | Props | Notes |
|---|---|---|
| `ui/Section.astro` | `ground?: 'white'\|'grey'\|'navy'` (white), `pad?: 'default'\|'tight'\|'flush-top'\|'none'`, `id?`, `labelledby?`, `width?: 'default'\|'narrow'\|'wide'\|'bleed'`, `rule?: boolean` (top hairline inside container), `class?` | `<section class="band band--{ground}">` + container. Default slot. |
| `ui/Container.astro` | `width?: 'default'\|'narrow'\|'wide'`, `as?`, `class?` | |
| `ui/Eyebrow.astro` | `as?: 'p'\|'span'\|'div'` (p), `class?` | Uppercase label, `--label` colour. |
| `ui/SectionHeader.astro` | `eyebrow?`, `title`, `lead?`, `level?: 2\|3` (2), `id?` (heading id), `align?: 'left'\|'center'`, `link?: {label, href}` | Title left, optional "View all →" link aligned right on desktop, below on mobile. Bottom margin `--s-7`. Slot `lead` allowed. |
| `ui/PageHero.astro` | `ground: 'navy'\|'grey'\|'white'`, `eyebrow?`, `title`, `lead?`, `crumbs?: Crumb[]` (visible breadcrumb row), `image?: ImageMetadata`, `imageAlt?`, `imageMode?: 'background'\|'split'` (background), `actions?: {label, href, variant?}[]`, `size?: 'lg'\|'md'` (md), `align?: 'left'\|'center'`, `titleId?` | `lg` = home-style (display size, min-height ~ 620px desktop / auto mobile). `split`: text left 6 cols, image right 6 cols full-height (stacked image-below on mobile at 4:3). Slot `aside` for extra right-column content, default slot for content under actions. The H1 lives here. |
| `ui/Button.astro` | `href?`, `type?`, `variant?: 'primary'\|'secondary'\|'tertiary'` (primary), `size?: 'md'\|'lg'`, `icon?: 'arrow'\|'external'\|'download'\|'calendar'\|null`, `full?: boolean`, `class?`, rest attrs | primary: navy fill/white text (on navy ground: white fill/navy text). secondary: 1px outline in `--fg`. tertiary: text + arrow. Height 48 (lg 56), padding 0 24px, radius 2px, min tap 44px. Renders `<a>` when href. |
| `ui/ArrowLink.astro` | `href`, `class?`, slot = label | "Learn more →" style; arrow moves 4px on hover; colour `--link`. |
| `ui/Icon.astro` | `name: 'arrow-right'\|'arrow-up-right'\|'arrow-left'\|'chevron-down'\|'menu'\|'close'\|'plus'\|'minus'\|'linkedin'\|'mail'\|'whatsapp'\|'phone'\|'download'\|'calendar'\|'check'\|'external'\|'clock'\|'pin'\|'search'\|'error'\|'success'`, `size?`, `label?` | aria-hidden unless label. Keep existing names used by forms if any (map old → new). |
| `ui/ExpertiseIcon.astro` | `pillar: PillarKey`, `size?: number` (32) | bespoke thin-line icons (§2). |
| `ui/Tag.astro` | `href?`, `size?: 'sm'\|'md'`, slot | 1px `--rule` border, radius 2, 13–14px. |
| `ui/Photo.astro` | `src: ImageMetadata`, `alt`, `ratio?: '21/9'\|'16/9'\|'3/2'\|'4/3'\|'1/1'\|'4/5'`, `sizes`, `priority?: boolean`, `widths?`, `position?: string` (object-position), `class?` | `<Picture formats={['avif','webp']}>`, cover crop in a ratio box. |
| `ui/StatStrip.astro` | `items: {value: string; label: string}[]`, `source?: string`, `cols?: 3\|4` | Big serif numbers (accent colour on light, white on navy), label under in sans 15px, 1px vertical dividers between items (desktop), 2×2 with horizontal hairlines on mobile. Source line in `--fs-meta` under the strip. |
| `ui/NumberedList.astro` | `items: string[]`, `start?`, `cols?: 1\|2` | "01" serif numerals in accent, hairline between rows, generous rows. Use for "What we help with", principles. |
| `ui/ProcessFlow.astro` | `steps: string[]`, `caption?`, `title?` | Static ringed-node line diagram, horizontal ≥ 900px (wraps cleanly), vertical below. Accessible as an `<ol>`. |
| `ui/Accordion.astro` | `items: {q: string; a: string}[]`, `id?` | Native `<details>`/`<summary>`, plus/minus icon, hairlines, no JS needed. |
| `ui/Breadcrumbs.astro` | `items: Crumb[]`, `tone?` | Small sans, `/` separators, current page `aria-current`. |
| `ui/Confirm.astro` | unchanged API `{id, note?}` | Staging only (as today) but restyled as a quiet dashed-outline tag; NOTHING in production or preview modes (§6). |
| `ui/NewsletterForm.astro` | `tone?: 'light'\|'dark'`, `id: string`, `compact?: boolean`, `heading?` | Real `<form>`: label + email input + Subscribe button + honeypot + consent micro-line linking /privacy. POSTs JSON to `PUBLIC_NEWSLETTER_ENDPOINT` via fetch with inline success ("Thank you. Please check your inbox to confirm.") / error states (aria-live). If the env var is empty, the form still renders and on submit falls back to `mailto:office@kokreaters.com?subject=Subscribe&body=<email>` (documented gap: provider to be chosen). |
| `ui/CtaBand.astro` | `title?`, `body?`, `primary?: {label, href}`, `secondary?: {label, href}`, `newsletter?: boolean`, `ground?: 'grey'\|'navy'\|'white'` (grey) | Default copy from `src/data/home.ts` `cta` (headline "Have a challenge worth solving together?", button "Book a 30-minute call" → booking URL or /contact#form). With `newsletter`, a second column holds the newsletter form. BaseLayout renders it on every page except contact, legal, 404 (as today's CtaField). |
| `cards/InsightCard.astro` | `href`, `title`, `label` (format label e.g. "Point of view"), `pillarName?`, `summary?`, `date?: Date`, `readTime?: number`, `image?: ImageMetadata`, `imageAlt?`, `size?: 'feature'\|'default'\|'compact'\|'text'`, `level?: 2\|3\|4`, `priority?` | feature: large 3:2 image + h3 at `--fs-h2`-ish; default: 3:2 image, label, h3, summary, meta; compact: small thumb left; text: no image (hairline top). Whole card clickable via stretched link on title; meta line "12 Nov 2026 · 6 min read". |
| `cards/ExpertiseCard.astro` | `pillar: Pillar`, `variant?: 'home'\|'hub'`, `level?` | Icon, number "01", serif title, promise line, (hub: deliverables as small list), "Learn more →". White card on grey band, 2px navy top rule, hover: top rule → accent, title → link colour. Whole card clickable. |
| `cards/ResultCard.astro` | `eyebrow` (e.g. "India · Wilmar"), `figure?` (e.g. "21%"), `title`, `body?`, `href?`, `tags?: string[]` | On navy band: navy-800 surface, white text, figure in blue-300 serif. On light: white surface with hairline. |
| `cards/IndustryTile.astro` | `href`, `name`, `copy?`, `n?: number`, `image?`, `imageAlt?`, `expertise?: {label, href}[]`, `variant?: 'tile'\|'card'` | tile: text-only cell in a hairline 3×3 grid (home); card: Kearney-style card with optional photo, one-line description and "Relevant expertise" links (Industries page). |
| `brand/Logo.astro` | keep current API | Simplify: drop the dock/fly code path; header uses `horizontal` (white header) — height 36 desktop / 30 mobile. Footer uses `horizontal-white` or `full-white`. |
| `brand/NodeMark.astro` | `size?`, `tone?: 'color'\|'white'\|'blue'` | The node cluster alone, used as the quiet signature (footer, 404, article end mark). |

Chrome (`src/components/chrome/`):
- `AnnouncementBar.astro`: slim navy line (36px) "Latest insight — <title> →" linking the newest insight visible in the
  current mode; hidden when there is none. Single line, ellipsis on mobile.
- `Header.astro`: sticky white header, hairline bottom once scrolled (`.is-scrolled`), compacts 80 → 64px. Logo left.
  Nav (≥ 1120px): **Expertise ▾** (mega-menu), **Industries ▾** (dropdown list of the nine, Kearney "your industry"
  idea), **Approach**, **Impact**, **Insights**, **About**; right: navy button "Start a conversation" → /contact.
  `aria-current` on the active section. Below 1120px: logo + "Menu" button (icon + visible word on ≥ 400px).
  (Approach stays a top-level item — the brief lets Ganeaysh decide; flag it in the hand-off.)
- `MegaMenu.astro` (Expertise): full-width white panel under the header, container-aligned: left column (3 cols) label
  "Expertise", one-line intro, "All expertise →"; right (9 cols) 3×2 grid of the six areas: icon, title, one-line
  promise, linking to /expertise/<slug>. Opens on click (button with `aria-expanded`/`aria-controls`) and hover-intent
  (150ms) on fine pointers; closes on Esc, outside click, focus leaving; Esc returns focus to the trigger. Same mechanics
  for the Industries dropdown (simple 1-column list of nine + "All industries →").
- `MobileMenu.astro`: full-screen white sheet below the header bar (header stays visible with a close button), body
  scroll locked (no layout jump), sections: Expertise (accordion → six links), Industries (accordion → nine), Approach,
  Impact, Insights, About, Contact; big serif links (24px), hairlines between; bottom: "Start a conversation" full-width
  primary button + email + LinkedIn. Focus trapped while open; Esc closes; returns focus.
- `Footer.astro`: navy-900. Top row: white logo (horizontal-white) + one line "Independent technical and strategy
  consulting for food, feed and specialty ingredients." left; newsletter form (dark tone) right. Middle: four columns
  — Expertise (six links), Company (About, Approach, Impact, Industries, Contact), Insights (latest 3 titles + "All
  insights"), Contact (office@kokreaters.com, WhatsApp if in data, "Based in the Netherlands (CET), working worldwide",
  LinkedIn icon link). Bottom row hairline: "© 2026 KoKreaters", KvK number ONLY if present in data (it is a CONFIRM 11
  gap — omit in non-staging modes when empty), Privacy · Cookies · Terms. Mobile: columns stack 2×2 then 1, newsletter
  full width.
- `SkipLink.astro` keep. `CookieConsent.astro` only renders when `PUBLIC_ANALYTICS` is set (as today); restyle plain.
- Delete `MotionToggle.astro`, `ExpertisePanel.astro` (replaced by MegaMenu) and anything they import.

Layout:
- `layouts/BaseLayout.astro`: keep the props signature (`page, seo, pillar?, breadcrumbs?, ground?, showCrumbs?, cta?`)
  so pages keep compiling; `pillar` no longer styles anything; visible breadcrumbs are now rendered by `PageHero`
  (`crumbs`), so BaseLayout only uses `breadcrumbs` for JSON-LD (default `showCrumbs` false). Order: SkipLink,
  AnnouncementBar, Header, main, CtaBand (unless contact/legal/notfound or `cta={false}`), Footer, CookieConsent, one
  module script `src/scripts/site.ts`. Tiny inline head script: `html.no-js → js` only (recompute CSP hash).
- `src/scripts/site.ts`: header scroll state (passive listener + rAF), mega-menu/dropdown/mobile-menu controller,
  reveal observer, newsletter form handler (delegated by `data-newsletter`). No dependencies. < 6 KB gzipped.
- Styles: `src/styles/{reset,tokens,fonts,base,layout,utilities,prose,motion}.css` imported by `global.css`. `grounds.css`
  replaced by `.band--white/.band--grey/.band--navy` in layout.css. `prose.css` (articles, legal) is rewritten by the
  Insights builder; foundation provides a sensible baseline.
- Dev/QA helpers: `src/pages/styleguide.astro` (renders every primitive on white, grey and navy; only built in staging,
  `noindex`, excluded from sitemap) and `scripts/qa-shoot.mjs` (Playwright: `node scripts/qa-shoot.mjs <path> [name]` →
  full-page screenshots at 1440 and 390 into `../research/v3/shots/`, prints horizontal-overflow offenders (elements
  wider than the viewport), console errors, failed requests, and missing alt attributes).

---------------------------------------------------------------------------------------------------------------------------
## 4. Page compositions (sections in order; grounds alternate; never two identical grounds touch without a hairline)

Every page: data comes from `src/data/*` and the insights collection — import, never retype copy. Every H1 lives in a
PageHero. Every section has an accessible name (`aria-labelledby` its heading). Mobile layout is designed for each
section (state it in a comment in the component).

### Home `/` (8 sections, target < 6,000px tall at 1440)
1. Hero — PageHero `size="lg" ground="navy"` with background photo (calm industrial/plant), eyebrow = hero overline,
   H1 "Where deep expertise meets shared ambition.", one sentence (hero.sub, may be trimmed to one sentence only if it is
   the brief's own wording — otherwise keep), actions "Start a conversation" (primary) / "Explore our expertise"
   (secondary). Bottom of hero: thin line "Based in the Netherlands, working worldwide · India · Indonesia · Ukraine ·
   Türkiye · the Netherlands" in on-navy-2.
2. Credibility strip — white: StatStrip 25 years · 5 countries · 3 regions · WHO (Director-General recognition) with
   source "From our founder’s career." Eyebrow "Our track record" (or similar plain label).
3. What we do — grey: SectionHeader (whatWeDo) + six ExpertiseCards 3×2 (2×3 at 600–1199, 1 col mobile).
4. Featured insights — white: SectionHeader "Insights" + link "All insights"; one feature card (left 7 cols) + two
   default cards stacked (right 5 cols); labels POINT OF VIEW / FIELD NOTES (format). Mobile: feature then two compact.
5. Results — navy: SectionHeader (impact overline/headline, "See the impact" link) + four ResultCards (India first
   facility, Indonesia 21%, Ukraine −25 °C / 15%, WHO recognition) 4-up desktop, 2×2 tablet, 1 col mobile. Small line
   "From our founder’s career (Wilmar / Cargill)".
6. Industries — white: SectionHeader "Where we work" + nine IndustryTiles in a hairline 3×3 grid, each → /industries#<slug>.
7. Founder — grey: portrait (4:5) left 5 cols, quote right 7 cols in serif italic, attribution, ArrowLink "Meet Ganeaysh".
8. Closing CTA — handled by BaseLayout CtaBand with `newsletter` on home (white or navy ground, decide for rhythm).
Removed: split-flap board, "Our promise" circles, animated refinery pipe (static version → Process Design page),
sideways rail, "toss one" toy, marquee, route map, where-we-work globe, method fold (Approach page has it).

### Expertise hub `/expertise`
PageHero grey: "Expertise that connects science, plants and strategy." + two-sentence intro. Grid of six ExpertiseCards
`variant="hub"` (with deliverables). Band (navy or white with rule): "Not sure where you fit?" + one line + "Start a
conversation" button. Remove the Venn.

### Expertise detail `/expertise/[slug]` (one template, six pages)
1 PageHero navy `split` with the pillar's photo: crumbs (Expertise / <name>), eyebrow "Expertise · 0n", H1 = pillar
promise/headline, lead = intro (first sentences). 2 "The challenge we solve" — two short paragraphs (existing text),
narrow measure, grey or white. 3 "What we help with" — NumberedList of the five items. 4 Diagram where useful — Process
Design gets ProcessFlow Crude → Degumming → Bleaching → Deodorisation → Fractionation → Interesterification → Spec;
other pillars only if a truthful diagram exists in the data (otherwise skip). 5 Typical deliverables — Tags or short
list. 6 Proof — the matching ResultCard (from founder career, labelled as such). 7 Related insights (2–3 InsightCards,
same pillar; hide section if none) + related industries (links). 8 CtaBand. Prev/next pillar links at the bottom.

### Industries `/industries`
PageHero white or grey with the one-paragraph intro (CONFIRM C-15 when missing — staging only). Grid of nine
IndustryTile `variant="card"` with id anchors (`#<slug>`) for the home links: name, one-line description, "Relevant
expertise" links to pillars. 3-col desktop, 2-col tablet, 1-col mobile. Remove the wheel.

### Approach `/approach`
PageHero navy "We create with you, not for you." Three columns Connect / Collaborate / Create (number with ringed node
on a hairline connector across the three on desktop): each with What we do / What you get / Typical duration — rows whose
value is null render only in staging (with Confirm 10); in other modes hide the empty row, never show "—". Five
principles as a numbered grid. "Ways to work with us" — the five engagement models as a clean table (Model / Shape /
Good for), stacked definition-cards below 700px. FAQ (Accordion): NDAs, fee basis, on-site vs remote, languages, travel —
answers only from facts in data/brief; if a fact is unknown write a careful generic answer that commits to nothing
specific (e.g. "We are happy to sign your NDA before the first detailed conversation.") and mark it with Confirm in
staging. Remove the crumpled report.

### Impact `/impact`
PageHero navy + StatStrip (same four as home, in-hero or directly below on white). "From our founder’s career (Wilmar /
Cargill)" — four case entries in case-study format: eyebrow (context), headline (outcome), Challenge / What was done /
Result in a 3-column definition layout (stacked on mobile), tags (pillars + sectors). Null fields: staging shows
Confirm; other modes omit the row (the case still reads well). "KoKreaters engagements": rendered only for entries with
consent 'cleared' (or staging). Testimonials only if data has approved ones. Remove fling/wipe toys.

### Insights hub `/insights`
PageHero white, centred serif headline (BCG feel). One featured article (large photo left, text right). Filters: Pillar
and Format (keep the existing filter mechanism and URL/query behaviour; restyle as two rows of small toggle buttons or
selects on mobile; wraps, never horizontal scroll). Grid of InsightCards (3-col, 2, 1). "Coming soon" — small text list
for `coming-soon` items. Newsletter band (NewsletterForm).

### Insight article `/insights/[slug]`
Label (format · pillar), H1, standfirst, byline (small round author photo, name, date, read time). Wide hero image (21:9
desktop, 4:3 mobile). "Key takeaways" box (3–4 points; reuse the existing Takeaways component/data). Body in narrow
measure with clear h2/h3, pull quotes (serif italic, accent rule), Exhibits as simple charts/tables, ProcessChain as the
ProcessFlow style. Share row (LinkedIn share URL, email mailto) + "Download PDF" (print stylesheet + `window.print()` is
acceptable; label "Download PDF"). Author box, related insights (3), CtaBand. Keep every MDX component name/prop the
six MDX files use (restyle, do not rename).

### About `/about`
PageHero navy `split` with the professional portrait: "Built on 25 years of making ingredients work." + short story
lead. Short story (current text), "Read the long version" (disclosure that expands the long bio, or anchor). Horizontal
timeline (ringed nodes on a hairline): CFTRI Mysore 1999–2001 → Wilmar 2001–2012 → Cargill 2012–2026 → KoKreaters 2026
(vertical on mobile). Static map of the eight locations (SVG, from the existing globe data projected flat or a simple
equirectangular world outline + 8 ringed nodes with labels; no WebGL). The name: Ko + Kreaters and Connect · Collaborate
· Create. Education, languages, recognition (WHO) as three tidy columns. LinkedIn button + "Download one-page profile
(PDF)" (generate the PDF at build/dev time from founder data into `public/`, see About task). Remove letter-scramble and
spin-the-globe.

### Contact `/contact`
PageHero white/grey compact ("Start a conversation" + one line). Two columns: left — email (office@kokreaters.com),
WhatsApp, LinkedIn, "Based in the Netherlands (CET), working worldwide", plus a "Book a 30-minute call" card (booking URL
env, else hidden or → form); right — the form with the existing fields + consent checkbox, existing submission logic
(endpoint env, honeypot, time trap, Turnstile when configured, mailto fallback), proper inline validation messages and a
real thank-you state. Remove boarding pass / tear-here. No CtaBand on this page.

### Legal `/privacy` `/cookies` `/terms` and `/404`
Plain text pages: grey compact hero with H1 + "Last updated", narrow measure prose in the same type style, a small
in-page contents list for long pages. Placeholders/CONFIRM lines visible only in staging. 404: navy band, NodeMark,
"This page could not be found." + links to Home, Expertise, Insights, Contact.

---------------------------------------------------------------------------------------------------------------------------
## 5. Copy rules
Keep every strong line and all facts. Delete casual asides, toy instructions and jokey captions (see
`research/v3/copy-edits.md`). Sentence case. No exclamation marks. No emoji. Do not invent clients, numbers, dates,
testimonials or claims. Where a fact is missing, hide the element outside staging rather than inventing it.

---------------------------------------------------------------------------------------------------------------------------
## 6. Site modes (public link must never show CONFIRM/DRAFT)
- `staging` (default, local dev): Confirm tags visible, drafts listed with a small "Draft" label.
- `preview` (NEW — the Vercel review link): no Confirm tags, no draft labels, empty/null facts hidden, drafts that are
  `review: 'pending'` still listed and built so Ganeaysh can review the full design, site-wide `noindex, nofollow` +
  `robots.txt Disallow: /`.
- `production` (kokreaters.com): as today — no Confirm, pending drafts not built, indexable.
Implement in `src/lib/mode.ts` (`isStaging`, `showConfirm`, `showDrafts`, `indexable`) and keep `isStaging/isProduction`
exports working. Confirm.astro renders only when `showConfirm`.

---------------------------------------------------------------------------------------------------------------------------
## 7. Quality bar (checked per page at 1440, 1024, 768, 390, 360)
- No horizontal scroll at 360px. Tap targets ≥ 44px. Body text ≥ 17px on mobile. No text over busy image areas without
  the overlay. Images never upscale; crops keep the subject.
- Contrast AA everywhere (axe clean). Visible focus states (2px outline, offset 3px). Keyboard: menu, mega-menu,
  accordions, filters, forms all operable; Esc closes overlays.
- Lighthouse mobile ≥ 90 performance, 100 accessibility/best-practices/SEO target. LCP image eager + preloaded;
  everything else lazy. JS total < 15 KB gzipped (no GSAP/Lenis/Three).
- Every page has a unique title + meta description, OG image, JSON-LD as today.
- `npm run check` and `npm run build` pass with zero errors; no console errors.

---------------------------------------------------------------------------------------------------------------------------
## 8. Decisions taken after the research pass (10 Nov 2026) — these override earlier sections where they differ

Research files (READ the one for your area before building): `research/v3/inventory-*.md` (exact data exports, behaviour
hooks, strings to delete, gaps), `research/v3/copy-edits.md` (tone register, component-level strings to delete),
`research/v3/infra.md` (CSP, tests, deploy), `research/v3/ref-mckinsey.md` + `ref-bcg-rb-kearney.md` (measured
patterns; screenshots in `research/v3/refs/`), `research/v3/photos.md` (photo slugs → placements; `src/data/photos.ts`).

1. **Contrast.** `--blue-500 #306FE0` is 4.69:1 on white but only 4.19 on grey-50 and 3.67 on navy: use it for text only
   at ≥ 24px (large text) or on white. Small links/labels: `--blue-700` on white/grey, `--blue-300 #8DB2F7` on navy.
2. **Measured rhythm (from the refs).** Container 1200 (+ gutters), side gutter 20px mobile → 48px tablet → auto desktop.
   Section padding 72 mobile / 120 desktop; inside a band, label → heading → content gaps 16 / 48. Body 18px also on mobile
   (17 minimum). Buttons 48px, radius 2px, sentence case. Card images 3:2. Home ≈ 5,500–6,500px tall at 1440.
3. **Positioning copy** (`home.ts positioning`: headline, promise "We do not hand over a report and leave…", range
   paragraph) moves to the **Approach** page as a statement section right after the hero (serif statement + range
   paragraph). It is no longer on Home.
4. **Founder portrait.** Build `src/assets/photos/ganeaysh-portrait.jpg` (4:5, ≥ 1600px tall) by compositing the retouched
   cut-out `src/assets/photos/ganeaysh-cutout.png` (lapel pin already removed) onto a calm, very subtle warm-grey studio
   gradient (#ECECE9 → #DCDCD7, soft vignette), plus a square crop `ganeaysh-portrait-square.jpg` for bylines. Use these
   everywhere (About hero, Home founder band, author byline/box, JSON-LD Person image). Do NOT use the raw portrait PNG
   (it shows a former-employer pin).
5. **Modes (§6) concretely.** `PUBLIC_SITE_MODE = staging | preview | production`. `src/lib/mode.ts` exports
   `mode, isStaging, isPreview, isProduction, showConfirm (= staging), showDraftLabels (= staging),
   includeDrafts (= staging || preview), indexable (= production && PUBLIC_INDEXABLE === '1')`. Engagements with consent
   'pending' render ONLY in staging (consent!). Legal "placeholder/review" banner: staging only. `lib/insights.ts`
   `visibleInsights()` uses `includeDrafts`. SeoHead robots + robots.txt use `indexable`. The Vercel review link is built
   with `PUBLIC_SITE_MODE=preview`.
6. **Scripts and CSP.** Astro inlines small processed scripts (< assetsInlineLimit) as inline modules → each would need a
   CSP hash. Set `vite.build.assetsInlineLimit` to a function returning `false` for `.js`/`.ts` so only the tiny head
   script is inline; re-run `node scripts/csp-hash.mjs` after the final build. `initConsent()` must move into
   `src/scripts/site.ts` (it lived in the deleted motion bundle). The contact page loads `src/scripts/pages/contact.ts`
   itself (`<script>import '@/scripts/pages/contact.ts'</script>`), as do insights (filters) and article pages.
7. **Chrome hooks to keep** (tests + behaviour): skip link → `main#main`; `aria-current` on active nav; header
   `.is-scrolled`; mobile menu: scroll lock, `inert` on main/footer/skip link, focus trap, Esc, label swap; no-JS
   fallbacks (`.js-only`/`.nojs-only`, Menu link → `#site-footer`); early-tap menu capture in the head script
   (`__kkMenuPending`). Header CTA carries `data-header-cta`.
8. **Gaps rule.** Missing facts (C-15 industries intro, CONFIRM 10 approach cells, C-9 challenges, KvK, booking URL,
   testimonials, FAQ facts) → Confirm in staging, element hidden in preview/production. Never "—", never invented facts.
   FAQ answers may only restate facts that exist in data (NDA "We sign NDAs as standard", on-site days from the models,
   languages from founder.ts, "Based in the Netherlands, working worldwide"); the fee-basis answer is a plain
   non-committal line ("Fees are agreed per engagement: fixed for defined projects, monthly for retainers." is NOT allowed
   unless data supports it — instead: "We agree the scope and fee with you before any work starts.").
9. **Industries photos.** Industries cards are text-first (name, description, relevant expertise); a small photo only where
   `photos.md` maps a good one — or all text-only for consistency (builder's call, but consistent).
