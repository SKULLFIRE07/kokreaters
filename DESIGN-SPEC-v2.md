# KoKreaters.com v2: "Nothing hidden. Notes from the plant floor." (DESIGN-SPEC v2.0, DELTA, 4 Nov 2026)

This is a **delta** on `DESIGN-SPEC.md` (v1). Read v1 only for what this file does not restate: routes, the content
layer (section 4), SEO and JSON-LD (3.7–3.9), staging/production modes (0.3), the `[CONFIRM]` mechanism (0.4),
the contact form behaviour (5.10), the globe mechanics (6.8) and the open-items log (8). **Where v1 and v2 disagree on
design, layout, type, colour or motion, v2 wins.** Where either disagrees with `research/BRIEF.txt` on a fact or a
piece of core copy, the brief wins.

Contents
0. What changed, what still binds
1. Art direction and the signature moves
2. Fonts
3. Tokens (`src/styles/tokens.css`, final) and the ground system
4. Type scale and type classes
5. Assets: vector logo and the founder cut-out
6. The annotation kit (`src/components/notes/*`)
7. Shared UI and chrome restyle
8. Motion v2 (recipes, hooks, budgets)
9. Bencho ports
10. Routes, fold by fold (every page, every note with its exact words)
11. New copy register (`v2-new-copy.md`)
12. Build split: FOUNDATION + 4 PAGES units, file ownership, gates

---

## 00. OWNER FEEDBACK — 4 Nov 2026, 22:10 (OVERRIDES everything below where they conflict; every unit and QA must satisfy this)

The owner reviewed the live v1 and said: "too much text, add some diagrams, some scroll things, GSAP and all, make it a very crazy good visual website; what you did is very simple, plain and basic, no wow factor." And: "when I open the sidebar it gets stuck."

### 00.1 Less text, more visual (hard limits)
- Visible words per fold: <= 25 (headline + one line). A section's longer copy moves into a collapsed `<details>` ("Read the whole truth +"), a hover/tap card back, or the dedicated inner page. Keep it in the DOM (SEO), never `display:none` cloaking.
- Every fold LEADS with a visual: an animated diagram, a toy, big type set as image, or the portrait. No fold may be "heading + paragraph + link" only.
- Lists of 4+ items become a diagram, rail, grid of tiles or toy, never a bulleted text list on first view.

### 00.2 Scroll-driven diagrams (GSAP ScrollTrigger scrub + pin, DrawSVG, MorphSVG, Flip, SplitText)
Build these as inline SVG diagrams with real `<title>`/`<desc>` and an equivalent `<ol>`/`<table>` for screen readers. Each one scrubs with scroll (pinned where noted), draws its strokes, labels pop in with stagger, numbers count, and it ends fully drawn under reduced motion.
- HOME — "Plant floor → boardroom" (PINNED ~250vh): one continuous Sapphire pipe draws left-to-right through a stylised oils plant (crude tank → refining column → fractionation → blending → finished product → a boardroom table with a Go/No-Go sign). Each station lights in its pillar colour and a 3-word label pops; at the end the pipe becomes the logo's rising arrow. This is the home's centrepiece.
- HOME — the six pillars as a hub-and-spoke diagram that assembles as you scroll (nodes fly in from the edges, spokes draw, then it Flip-morphs into the sideways rail).
- HOME/IMPACT — the four founder results as a world route map (India → Indonesia → Ukraine → Netherlands) with arcs drawing and the −25 °C frost node, scrubbed.
- APPROACH — Connect → Collaborate → Create as a PINNED 3-act morph: three scattered nodes (Connect) → nodes linked into a network (Collaborate) → network collapses into one rising arrow (Create). Copy per act <= 12 words.
- PILLAR PAGES — one signature diagram per pillar (scrubbed, not pinned unless noted):
  innovation = funnel "unmet need → brief → prototype → scale-up → launch";
  process = refining process-flow line (degumming → bleaching → deodorisation → fractionation → interesterification) with flowing particles;
  food-safety = contaminant shield / layered barrier diagram (3-MCPD & GE, trans fats, MOH) with risk dots stopped at each layer;
  strategy = Go/No-Go decision tree that grows branch by branch;
  due-diligence = iceberg "what the spreadsheet shows / what's really behind the deal" with the waterline as scroll position;
  capability = team growth curve / tree of nodes that multiplies.
- ABOUT — career journey line CFTRI → Wilmar → Cargill → KoKreaters as a scrubbed path across the globe/map, years counting up.
- INDUSTRIES — radial sector wheel; scroll rotates it, the active sector expands with its pillars linking out.
- CONTACT — the form as a 3-step node path (who → what → send) that draws as fields complete.

### 00.3 More GSAP set pieces (use them all somewhere; quality over quantity, never janky)
Pinned horizontal sections; scrubbed SplitText line/char reveals on big headlines; scroll-velocity skew on the big type and marquees; image/portrait mask reveals (clip-path circle/inset) on scroll; parallax depth layers (portrait cut-out over colour block over node motif); number scramble/count-ups; cursor-reactive magnetic elements; section-to-section colour morphs of the page ground as you scroll (body background tweened per section). Target 60fps: animate transform/opacity/clip-path only, `will-change` only while active.

### 00.4 Mobile menu must never "stick" (bug found on the live site)
Cause in v1: opening called `lenis.stop()` (which puts `overflow: clip` on `<html>`) plus `body{overflow:hidden}`, so the page jumped to the top, lost its position and touch scrolling could freeze on iOS.
Required pattern (already hot-fixed in the live v1 build, see git log "Mobile menu: scroll lock"; port it into the v2 chrome):
- On open: `y = scrollY`; `html.menu-open`; `body{position:fixed; top:-${y}px; left:0; right:0; width:100%}`; header `position:fixed; top:0; inset-inline:0` while open; menu `position:fixed`, below the header, `height: calc(100dvh - header)`, `overflow-y:auto`, `overscroll-behavior:contain`, `-webkit-overflow-scrolling:touch`, `data-lenis-prevent`. Do NOT call `lenis.stop()`.
- On close: clear those styles, `window.scrollTo(0, y)` then `lenis?.scrollTo(y, {immediate:true})`, restore focus.
- QA must test on Playwright WebKit (iPhone 13) and Chrome (Pixel 7): open after scrolling 1500px, scroll inside the menu, close (position restored within 2px), open again, tap a link (navigates), open the Expertise group; plus an early tap during a throttled load.

## 0. What changed, what still binds

### 0.1 Released (the owner, 4 Nov 2026: "No need to follow the rules given by Ganesh. Go wild … the most premium and most beautifully designed.")
These v1 rules **no longer apply**: serif headlines; Fraunces; palette proportions and "accent < 10%"; "coral only for errors"
(Coral may now be used as a colour block accent, never for body text on white); "no gradients" (allowed in the emulsion
shader, the 404 and OG images); the 150–300ms motion restraint; "nothing bounces" (back/elastic eases are now allowed
for stickers, magnets and springs); the bans on marquees, magnetic buttons, cursor followers, pins/scroll-jacking,
horizontal rails, carousels-as-rails and tilt; "one boxed element per page"; "no chips on home"; the "after 2 s the
page is still" rule.

### 0.2 Still binding (non-negotiable)
1. **Facts and core copy** come only from `BRIEF.txt` via `src/data/*` and `src/content/*`. No invented claims,
   numbers, clients, testimonials or dates. New playful strings (notes, asides, button labels, props) are allowed only
   if they add **no factual claim**; every one lives in `src/data/notes/*.ts` and is listed in
   `research/v2-new-copy.md` (section 11).
2. Past results are always labelled **"From our founder’s career"**. Wilmar/Cargill as plain words, never logos.
3. **WCAG 2.2 AA**: text contrast (table 3.3), keyboard access for every interaction, focus visible on every ground,
   target size ≥ 24px (we use ≥ 44px), a working **reduced-motion** fallback (everything static and visible), and a
   **Pause motion** control for anything that moves on its own for more than 5 s (WCAG 2.2.2, see 7.1).
4. **Content in HTML, visible with JS off.** The H1 and the LCP element are never hidden. One H1 per page.
5. **Performance**: Lighthouse mobile performance ≥ 90 on every audited route, **home ≥ 95** (currently 100),
   LCP ≤ 2.5 s, CLS ≤ 0.1. Initial JS per page stays inside the v1 gates (home ≤ 95KB gzip, others ≤ 85KB); every new
   effect is a **lazy chunk ≤ 35KB gzip** loaded near the viewport. Fonts ≤ 240KB total (new gate).
6. **The logo mark is never distorted**: no recolouring of the mark, no stretching, no moving its nodes relative to
   each other, no re-typesetting of the wordmark. The whole mark may be moved, scaled uniformly, rotated as a
   sticker (≤ 8°) and docked. The *pillar network* around it (not part of the mark) may move freely.
7. British English, real typography (’ “ ” · – −, U+202F inside "−25 °C"), "KoKreaters" spelling, ™ in the footer only.
8. Keep: routes, `src/data/*` shapes, SEO/JSON-LD, staging/production, CONFIRM markers, GitHub Pages base path
   (`BASE_PATH` + `scripts/pages-base.mjs`: never build a URL string the rewrite cannot see; internal links stay
   root-relative `href="/…"` literals or come from `data/nav.ts`; new static files go through `astro:assets` or
   existing `public/` folders only, never a new `public/` folder), and the tests in `web/tests` (update only
   expectations the design legitimately changed; never weaken an a11y or perf assertion).
9. Do **not** copy The Whole Truth's assets, logo, illustrations, copy, slogans or hashtags. We borrow principles:
   condensed heavy grotesk, typewriter mono, handwritten margin notes, outlined hand pills, colour blocks, candour.

---

## 1. Art direction and the signature moves

### 1.1 The idea
v1 was "published, not marketed". v2 is **"Nothing hidden. Notes from the plant floor."** The site reads like a
senior food technologist's working notebook pinned open on a bench: huge confident statements, honest
label-like facts set in typewriter mono, and Ganeaysh's handwritten margin notes that circle, underline and point at
the things that matter. It is louder and warmer than v1, but every loud thing is *true*, and every playful thing is
optional to the reader.

Three voices, never mixed inside one line:
| Voice | Face | Job | Example |
|---|---|---|---|
| **The statement** | Bricolage Grotesque, condensed 75%, 760–800 | headlines, stats, pillar promises | "Plants that run better, cost less and grow with you." |
| **The label** | IBM Plex Mono 400/500 | leads, short body (≤ 50 words), datelines, spec labels, nav meta | "INDIA · WILMAR" |
| **The margin** | Caveat 600, berry/saffron | decorative notes, hand pills, doodle captions | "that’s you + us" |
Long reading (articles, the bio, legal, anything > 50 words) is set in **Instrument Sans**, the fourth, quiet voice.

### 1.2 Colour attitude
The brief palette, used as **big flat blocks**: the six pillar colours become full-bleed bands and slab cards; Saffron is
the highlighter and the CTA block; Ink is the announcement bar, the footer and the marquee; white pages are crisp
(`#FFFFFF`), sometimes with a faint lab-notebook grid. A subtle print grain sits on colour blocks. Gradients appear only
inside the emulsion shader (home proof band), the 404 and OG images.

### 1.3 The eight signature moves (these are what make it "Site of the Day")
1. **Elastic network hero**: the logo cluster as a die-cut sticker; the six pillar nodes hang off it on elastic strings.
   Grab a node, pull, let go: it springs back and the strings wobble. The H1 letters lean toward the pointer.
2. **Margin notes that write themselves**: hand-drawn arrows, underlines and circles draw on as you scroll, then the
   Caveat note settles with a tiny rotation.
3. **The sideways pillar rail**: home pins and scrolls six colour-blocked pillar cards sideways, each carrying an
   "honest label" (a nutrition-panel spec of what's inside).
4. **Emulsion**: the dark proof band is a live WebGL field of droplets in the pillar colours that merge and split
   (Ko = together; oils and fats); the pointer stirs it. Static disc art without WebGL.
5. **Gravity industries**: the nine industries fall into a box as tags; toss them.
6. **The Saffron CTA**: a full Saffron block with a dot field that leans to the cursor and a hand-circled "together".
7. **Page turns**: cross-document View Transitions (CSS only) between pages; the header persists; a cursor follower
   grows into a hand label ("drag", "throw", "wipe") over interactive toys.
8. **Toys with a point**: tear the boarding-pass to book a call; crumple "the report"; wipe frost off "−25 °C";
   fling the result cards; pull a spec inspector over a pillar label; kick the 404 words around.

### 1.4 New anti-slop rules (v2)
- No glassmorphism, no neon glows, no generic 3D blobs, no stock photos, no emoji, no AI-illustration.
- No centred-everything hero. Asymmetric, left-anchored, big.
- No two adjacent bands on the same ground (except white → white-with-grid).
- Every toy has a static, readable state; every note can be deleted without losing information.
- Rotation budget: at most 3 rotated elements visible in one viewport.
- Notes budget: at most **2 notes per viewport** at 1440, **1 per viewport** at 390 (others use `show="lg"`).

---

## 2. Fonts

### 2.1 Files (self-hosted, copied by `scripts/copy-fonts.mjs` into `public/fonts/`)
| Family | npm package (exact) | File | Bytes | Axes | Preload |
|---|---|---|---|---|---|
| Bricolage Grotesque | `@fontsource-variable/bricolage-grotesque@5.3.0` | `bricolage-grotesque-latin-wdth-normal.woff2` | 78,156 | wght 200–800, wdth 75–100 (opsz fixed at its 96 display master) | **yes**, every page |
| IBM Plex Mono 400 | `@fontsource/ibm-plex-mono@5.3.0` | `ibm-plex-mono-latin-400-normal.woff2` | 14,708 | static | **yes**, every page |
| IBM Plex Mono 500 | same | `ibm-plex-mono-latin-500-normal.woff2` | 14,888 | static | no |
| Caveat 600 | `@fontsource/caveat@5.3.0` | `caveat-latin-600-normal.woff2` | 51,220 | static | no |
| Instrument Sans | `@fontsource-variable/instrument-sans` (already installed) | `instrument-sans-latin-wght-normal.woff2` | 30,092 | wght 400–700 | no (articles, bio, legal, forms only) |
| **Total** | | | **189,064 ≈ 185KB** | | ≤ 240KB gate |

- **Fraunces is dropped**: remove `@fontsource-variable/fraunces` from `package.json`, both Fraunces files from
  `copy-fonts.mjs` FILES and from `public/fonts/`, and every `font-family: var(--font-serif)` use (the token is
  deleted; `scripts/og.mjs` moves to Bricolage + Plex Mono).
- The `wdth` file was chosen over `standard` (131KB, adds opsz) because its fixed master *is* opsz 96 (the display cut),
  and Bricolage is never set below 16px on this site, so the text optical sizes are not needed.
- None of these fonts contain U+2192 (→) or U+202F (narrow no-break space). Arrows stay `<Arrow/>` SVG (v1 0.2.9).
  U+202F falls through to the fallback face; that is fine visually and must not be "fixed" by swapping in a normal
  space (the no-break is the point).
- `font-display: swap` for Bricolage, Plex Mono and Instrument Sans; `font-display: swap` for Caveat too, because every
  note is absolutely positioned or in a reserved box (a swap cannot shift layout).
- Preload in `BaseLayout.astro` head, after the flags script:
  `<link rel="preload" href="/fonts/bricolage-grotesque-latin-wdth-normal.woff2" as="font" type="font/woff2" crossorigin>`
  and the same for `ibm-plex-mono-latin-400-normal.woff2`. (Literal `/fonts/…` `href` so `pages-base.mjs` rewrites it.)

### 2.2 `src/styles/fonts.css` (final shape)
```css
@font-face { font-family: "Bricolage Grotesque"; src: url("/fonts/bricolage-grotesque-latin-wdth-normal.woff2") format("woff2-variations");
  font-weight: 200 800; font-stretch: 75% 100%; font-style: normal; font-display: swap; unicode-range: /* v1 Latin range */; }
@font-face { font-family: "IBM Plex Mono"; src: url("/fonts/ibm-plex-mono-latin-400-normal.woff2") format("woff2"); font-weight: 400; font-display: swap; unicode-range: …; }
@font-face { font-family: "IBM Plex Mono"; src: url("/fonts/ibm-plex-mono-latin-500-normal.woff2") format("woff2"); font-weight: 500; font-display: swap; unicode-range: …; }
@font-face { font-family: "Caveat"; src: url("/fonts/caveat-latin-600-normal.woff2") format("woff2"); font-weight: 600; font-display: swap; unicode-range: …; }
@font-face { font-family: "Instrument Sans"; /* unchanged from v1 */ }
/* Metric fallbacks: measured, not guessed (FOUNDATION measures in Chrome on this machine, as v1 W3-polish did). */
@font-face { font-family: "Bricolage Fallback Narrow"; src: local("Arial Narrow Bold"), local("ArialNarrow-Bold"), local("Liberation Sans Narrow Bold"), local("Liberation Sans Narrow"), local("Nimbus Sans Narrow Bold");
  size-adjust: /*measure*/ 100%; ascent-override: /*measure*/ 92%; descent-override: 24%; line-gap-override: 0%; }
@font-face { font-family: "Bricolage Fallback"; src: local("Arial Bold"), local("Arial-BoldMT"), local("Liberation Sans Bold"), local("Arial");
  size-adjust: /*measure, expect ≈ 80%*/; ascent-override: …; descent-override: …; line-gap-override: 0%; }
@font-face { font-family: "Plex Mono Fallback"; src: local("Courier New"), local("Liberation Mono"), local("DejaVu Sans Mono"); size-adjust: /*measure ≈ 100%*/; }
@font-face { font-family: "Instrument Sans Fallback"; /* unchanged */ }
```
Measuring rule: render `.t-mega` "Where deep expertise meets shared ambition." at 390 and 1440 with the webfont and
with each fallback; tune `size-adjust` until the **line count and total block height match** (width may differ). Record
the measured numbers in a comment like v1. This is what keeps CLS < 0.05 on the hero.

---

## 3. Tokens and the ground system

### 3.1 `src/styles/tokens.css` (replace the v1 file with this; brand values unchanged)
```css
:root {
  /* ── Brand colour (brief Appendix A, unchanged) ── */
  --kk-sapphire:#2C509E; --kk-cobalt:#306FE0; --kk-sky:#4C9BE8; --kk-saffron:#F4C841; --kk-coral:#E5494D;
  --kk-imperial:#3A1C5C; --kk-violet:#5B2A86; --kk-amethyst:#7B4BC4; --kk-mauve:#8C5B88; --kk-orchid:#C8457E;
  --kk-lavender:#EADCFF; --kk-ice:#D6E2FA; --kk-butter:#FFEEB0; --kk-blush:#F6DCE8;
  --kk-ink:#121833; --kk-graphite:#4A5068; --kk-cloud:#F8F6FC; --kk-white:#FFFFFF; --kk-hairline:#E4E0EE;
  --kk-field-border:#7C8197;
  /* ── v2 additions ── */
  --kk-berry:#A2335F;      /* Orchid darkened (was --pillar-quality-text): notes on Cloud/Butter/Blush/Lavender/Saffron */
  --kk-plum:#6F4470;       /* Mauve darkened (was --pillar-deals-text) */
  --kk-grid:rgba(76,155,232,.16);   /* lab-notebook grid lines on white */
  --kk-white-20:rgba(255,255,255,.20); --kk-ink-12:rgba(18,24,51,.12);

  /* ── Default roles (white ground). Grounds (3.2) override these locally. ── */
  --bg:#FFFFFF; --fg:var(--kk-ink); --fg-2:var(--kk-graphite); --head:var(--kk-ink);
  --note:var(--kk-orchid); --accent:var(--kk-sapphire); --link:var(--kk-sapphire);
  --line:var(--kk-ink); --rule:var(--kk-hairline); --focus:var(--kk-cobalt);
  --pill-bg:var(--kk-ink); --pill-fg:#FFFFFF; --pill-sweep:var(--kk-saffron); --pill-sweep-fg:var(--kk-ink);
  --pill-line:var(--kk-ink); --chip-bg:var(--kk-ink); --chip-fg:#FFFFFF;
  /* v1 role names kept as aliases so untouched components keep working */
  --c-ground:var(--bg); --c-ground-alt:var(--kk-cloud); --c-heading:var(--head); --c-text:var(--fg); --c-meta:var(--fg-2);
  --c-dateline:var(--fg-2); --c-line:var(--accent); --c-line-dark:var(--kk-sky); --c-rule:var(--rule);
  --c-action:var(--kk-ink); --c-action-hover:var(--kk-sapphire); --c-link:var(--link); --c-focus:var(--focus);
  --c-focus-dark:var(--kk-saffron); --c-dark:var(--kk-imperial); --c-on-dark:#FFFFFF; --c-on-dark-muted:var(--kk-lavender);
  --c-highlight-dark:var(--kk-saffron); --c-error:var(--kk-coral); --c-success:var(--kk-sapphire);
  --ring-ink:0 0 0 1.5px var(--kk-ink);

  /* ── Pillars: colour, tint, and the ground key used for their blocks ── */
  --pillar-innovation:var(--kk-sapphire); --pillar-innovation-tint:var(--kk-ice);
  --pillar-process:var(--kk-violet);      --pillar-process-tint:var(--kk-lavender);
  --pillar-quality:var(--kk-orchid);      --pillar-quality-tint:var(--kk-blush);
  --pillar-strategy:var(--kk-saffron);    --pillar-strategy-tint:var(--kk-butter);
  --pillar-deals:var(--kk-mauve);         --pillar-deals-tint:var(--kk-blush);
  --pillar-capability:var(--kk-sky);      --pillar-capability-tint:var(--kk-ice);
  --pillar-innovation-text:var(--kk-sapphire); --pillar-process-text:var(--kk-violet); --pillar-quality-text:var(--kk-berry);
  --pillar-strategy-text:var(--kk-ink); --pillar-deals-text:var(--kk-plum); --pillar-capability-text:var(--kk-ink);

  /* Gradients: emulsion fallback art, 404, OG only */
  --kk-aurora:linear-gradient(100deg,#2C509E 0%,#5B2A86 50%,#C8457E 100%);
  --kk-sunrise:linear-gradient(135deg,#7B4BC4 0%,#C8457E 55%,#F4C841 100%);

  /* ── Families ── */
  --font-display:"Bricolage Grotesque","Bricolage Fallback Narrow","Bricolage Fallback","Arial Narrow",Arial,sans-serif;
  --font-mono:"IBM Plex Mono","Plex Mono Fallback",ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;
  --font-hand:"Caveat","Segoe Print","Bradley Hand",cursive;
  --font-sans:"Instrument Sans","Instrument Sans Fallback",system-ui,"Segoe UI",Arial,sans-serif;

  /* ── Type scale (fluid 390 → 1440; see 4.1 for weight/stretch/leading) ── */
  --fs-mega:    clamp(3.5rem, 1.364rem + 8.762vw, 9.25rem);   /* 56 → 148  home H1 */
  --fs-display: clamp(3rem, 1.514rem + 6.095vw, 7rem);        /* 48 → 112  page H1s, CTA h2 */
  --fs-h2:      clamp(2.5rem, 1.479rem + 4.19vw, 5.25rem);    /* 40 → 84 */
  --fs-h3:      clamp(1.625rem, 1.3rem + 1.333vw, 2.5rem);    /* 26 → 40 */
  --fs-h4:      clamp(1.25rem, 1.157rem + 0.381vw, 1.5rem);   /* 20 → 24 */
  --fs-stat:    clamp(4.5rem, 1.529rem + 12.19vw, 12.5rem);   /* 72 → 200 */
  --fs-quote:   clamp(1.875rem, 1.086rem + 3.238vw, 4rem);    /* 30 → 64 */
  --fs-lead:    clamp(1rem, 0.93rem + 0.2857vw, 1.1875rem);   /* 16 → 19 mono */
  --fs-mono:    clamp(0.875rem, 0.851rem + 0.0952vw, 0.9375rem); /* 14 → 15 mono */
  --fs-label:   0.8125rem;                                    /* 13 mono caps */
  --fs-micro:   0.75rem;                                      /* 12 mono caps */
  --fs-note:    clamp(1.5rem, 1.268rem + 0.952vw, 2.125rem);  /* 24 → 34 Caveat (never below 24px: large-text rule) */
  --fs-note-lg: clamp(2rem, 1.536rem + 1.905vw, 3.25rem);     /* 32 → 52 */
  --fs-body:    clamp(1.0625rem, 1.039rem + 0.0952vw, 1.125rem); /* 17 → 18 Instrument Sans */
  --fs-article: clamp(1.125rem, 1.078rem + 0.1905vw, 1.25rem);   /* 18 → 20 Instrument Sans */
  --fs-button:  1.0625rem;  /* 17 Bricolage 700 */
  --fs-hand-button: 1.625rem; /* 26 Caveat 600 */
  --fs-nav: 1rem;
  --measure: 64ch; --measure-lead: 46ch; --measure-article: 66ch;

  /* ── Space ── */
  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px; --s-5:24px; --s-6:32px; --s-7:48px; --s-8:64px; --s-9:96px; --s-10:128px; --s-11:192px;
  --section: clamp(5rem, 2.771rem + 9.143vw, 11rem);      /* 80 → 176 */
  --gutter: clamp(1rem, 0.629rem + 1.524vw, 2rem);        /* 16 → 32 */
  --side: clamp(1rem, -0.3rem + 5.333vw, 4.5rem);         /* 16 → 72 */
  --content-max: 1296px;
  --ann-h: 36px; --header-h: 76px; --header-h-compact: 64px; --scroll-offset: 92px;

  /* ── Shape ── */
  --r-chip:999px; --r-pill:999px; --r-card:24px; --r-block:36px; --r-input:14px; --r-sticker:999px;
  --bw:2px; --bw-card:3px; --bw-heavy:10px;     /* spec-label heavy rule */

  /* ── Depth ── */
  --shadow-sticker: 0 1px 0 rgba(18,24,51,.06), 0 14px 28px -10px rgba(18,24,51,.38);
  --shadow-lift: 0 24px 48px -16px rgba(18,24,51,.35);
  --shadow-hard: 5px 5px 0 var(--kk-ink);       /* hand pills + toys on hover */
  --shadow-panel: 0 24px 64px -12px rgba(18,24,51,.30);

  /* ── Motion (CSS side; GSAP mirror in src/scripts/motion/tokens.ts) ── */
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-inout: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: linear(0, 0.38 7%, 0.88 16%, 1.08 24%, 1.12 30%, 1.06 40%, 0.99 52%, 1.004 68%, 1);
  --d-fast:160ms; --d-ui:240ms; --d-panel:320ms; --d-page:360ms; --d-draw:700ms; --d-rise:900ms;
}
@media (prefers-reduced-motion: reduce) { :root { --d-fast:0ms; --d-ui:0ms; --d-panel:0ms; --d-page:0ms; --d-draw:0ms; --d-rise:0ms; } }
```
`--font-serif` and every v1 Fraunces-only token (`--wght-*`, `--fs-standfirst`, `--fs-pull`, `--fs-index`,
`--fs-figure`, `--fs-cta`, `--lh-*`) are deleted. FOUNDATION greps `src/` and fixes every reference in files it owns;
page units fix references in their own files.

### 3.2 The ground system (`src/styles/grounds.css`, new; imported by `global.css` after tokens)
Every band, slab, card or toy that has a background sets **one ground class**. A ground re-declares the role tokens,
so text, notes, links, pills and focus rings are correct automatically. Never set text colour by hand on a ground.

| Class | `--bg` | `--fg` / `--head` | `--fg-2` | `--note` | `--link` / `--accent` | `--focus` | primary pill (bg / fg / sweep) |
|---|---|---|---|---|---|---|---|
| `.g-white` | White | Ink | Graphite | Orchid | Sapphire | Cobalt | Ink / White / Saffron(Ink) |
| `.g-cloud` | Cloud | Ink | Graphite | **Berry** | Sapphire | Cobalt | Ink / White / Saffron |
| `.g-ink` | Ink | White | Lavender | Saffron | Saffron | Saffron | Saffron / Ink / White |
| `.g-imperial` | Imperial | White | Lavender | Saffron | Saffron (text) · Sky (line-work) | Saffron | Saffron / Ink / White |
| `.g-sapphire` | Sapphire | White | Ice | Saffron | Saffron | Saffron | White / Sapphire / Saffron(Ink) |
| `.g-violet` | Violet | White | Lavender | Saffron | Saffron | Saffron | Saffron / Ink / White |
| `.g-orchid` | Orchid | White | White | White | White (underlined) | Ink | Ink / White / Butter(Ink) |
| `.g-mauve` | Mauve | White | Butter | Butter | White (underlined) | White | Ink / White / Saffron |
| `.g-saffron` | Saffron | Ink | Imperial | Berry | Ink (underlined) | Ink | Ink / White / White(Ink) |
| `.g-sky` | Sky | Ink | Ink | Imperial | Ink (underlined) | Ink | Ink / White / Saffron |
| `.g-butter` | Butter | Ink | Graphite | Berry | Sapphire | Ink | Ink / White / Saffron |
| `.g-lavender` | Lavender | Ink | Imperial (`--head`: Imperial) | Berry | Sapphire | Ink | Ink / White / Saffron |
| `.g-blush` | Blush | Ink | Imperial | Berry | Imperial | Ink | Ink / White / Saffron |
| `.g-ice` | Ice | Ink | Imperial | Sapphire | Sapphire | Ink | Ink / White / Saffron |

Also on every ground: `--line` (2px ink on light, white on dark/colour), `--rule` (Hairline on light, `--kk-white-20`
on dark/colour), `--chip-bg/--chip-fg`, `--pill-line` (outline pill border = `--fg`).
Modifiers: `.paper-grid` (lab-notebook grid: `background-image: linear-gradient(var(--kk-grid) 1px, transparent 1px),
linear-gradient(90deg, var(--kk-grid) 1px, transparent 1px); background-size: 28px 28px;` white grounds only),
`.grain` (an `::after` overlay, `background: url(../assets/fx/grain.png)` 160px tile, `mix-blend-mode: multiply`,
`opacity: .10` on light / `.18` with `mix-blend-mode: soft-light` on dark, `pointer-events: none`), `.slab` (inset
block: `margin-inline: max(8px, calc(var(--side) / 2)); border-radius: var(--r-block); overflow: clip`).
`lib/pillars.ts` gains `pillarGround(key)`: innovation→`sapphire`, process→`violet`, quality→`orchid`,
strategy→`saffron`, deals→`mauve`, capability→`sky`; and `pillarTintGround(key)`: ice, lavender, blush, butter, blush, ice.

### 3.3 Contrast proof (computed 4 Nov 2026; FOUNDATION adds `scripts/contrast-check.mjs` that recomputes this table from `tokens.css`/`grounds.css` and fails under 4.5 for text roles, 3.0 for `--note` (Caveat ≥ 24px = large text) and `--focus`)
| Pair | Ratio | Use |
|---|---|---|
| Ink on White / Cloud | 17.44 / 16.26 | text |
| Orchid on White | 4.56 | notes (passes even as normal text) |
| Orchid on Cloud | 4.25 ✗ normal | **never**: Cloud takes Berry (6.17) |
| White on Sapphire | 7.64 | text · Saffron on Sapphire 4.80 notes |
| White on Violet | 9.90 | text · Saffron on Violet 6.22 |
| White on Orchid | 4.56 | text and notes · Ink focus 3.83 |
| White on Mauve | 5.29 | text · Butter on Mauve 4.56 |
| Ink on Saffron | 10.95 | text · Imperial 8.79 · Berry ≈ 4.8 |
| Ink on Sky | 5.95 | text · Imperial notes 4.77 · **White on Sky 2.93 ✗ never** |
| White / Lavender / Saffron on Imperial | 13.99 / 10.78 / 8.79 | text · Sky line-work 4.77 · Orchid 3.07 ✗ text |
| White / Lavender / Saffron on Ink | 17.44 / 13.44 / 10.95 | text · Orchid on Ink 3.83 ✗ text |
| Berry on Butter / Blush | 5.70 / 5.14 | notes |
| Sapphire on Ice | 5.86 | notes and links |
| Cobalt on White | 4.69 | focus ring (non-text 3:1) · links only on White, never on Cloud (4.37) |
Coral may be a block accent or a doodle colour on Ink (4.96) but never body text on white (3.89).

---

## 4. Type scale and classes

### 4.1 Classes (`src/styles/base.css`; v1 class names are kept and restyled so existing markup inherits v2)
| Class | Face | Size | Weight / stretch | Leading / tracking | Notes |
|---|---|---|---|---|---|
| `.t-mega` (new) | Bricolage | `--fs-mega` | 800 / 75% | 0.9 / −0.025em | home H1 only |
| `.t-display` | Bricolage | `--fs-display` | 780 / 75% | 0.92 / −0.022em | page H1s, CTA h2 (was Fraunces) |
| `.t-h1` | Bricolage | `--fs-display` | 780 / 75% | 0.92 / −0.022em | alias of .t-display |
| `.t-h2` / `h2` | Bricolage | `--fs-h2` | 760 / 78% | 0.95 / −0.02em | |
| `.t-index` | Bricolage | `--fs-h3` × 1.25 | 720 / 82% | 1.0 / −0.015em | kept for impact outcome lines |
| `.t-h3` / `h3` | Bricolage | `--fs-h3` | 700 / 85% | 1.02 / −0.01em | |
| `.t-h4` | Bricolage | `--fs-h4` | 650 / 100% | 1.15 / 0 | |
| `.t-stat`, `.t-figure` | Bricolage | `--fs-stat` (figure: 0.6×) | 800 / 75% | 0.85 / −0.03em | `font-variant-numeric: lining-nums tabular-nums` |
| `.t-quote`, `.t-pull` | Bricolage | `--fs-quote` (pull: 0.7×) | 650 / 85% | 1.0 / −0.015em | hand-drawn quote marks, never italic |
| `.t-lead` | Plex Mono | `--fs-lead` | 400 | 1.6 / 0 | max `--measure-lead`; ≤ 50 words, else use `.t-body` |
| `.t-mono` (new) | Plex Mono | `--fs-mono` | 400 | 1.6 | short body, captions, table cells |
| `.t-meta` | Plex Mono | `--fs-mono` | 400 | 1.5 | was sans |
| `.t-dateline`, `.t-label` | Plex Mono | `--fs-label` | 500 caps (CSS) | 1.3 / +0.08em | colour `--fg-2` |
| `.t-micro` (new) | Plex Mono | `--fs-micro` | 500 caps | 1.3 / +0.1em | chips, stamps |
| `.t-body` | Instrument Sans | `--fs-body` | 400 | 1.62 | long body (bio, range paragraph) |
| `.t-standfirst` | Instrument Sans | clamp(20px→26px) | 450 | 1.4 | article standfirst |
| `.t-note` (new) | Caveat | `--fs-note` | 600 | 1.0 / 0 | colour `--note`; `.t-note--lg` uses `--fs-note-lg` |
| `.t-hand` (new) | Caveat | `--fs-hand-button` | 600 | 1 | hand pills, filter pills |

Rules:
- Headlines are sentence case (source text), `text-wrap: balance`, colour `--head`. Never uppercase a Bricolage line.
- Datelines and labels are the only uppercase (CSS `text-transform`).
- `font-stretch` is set with the property (the `@font-face` declares `75% 100%`), not `font-variation-settings`.
- `font-kerning: normal; font-optical-sizing: auto;` stay. `-webkit-font-smoothing: antialiased`.
- `strong` inside mono = 500; inside Instrument Sans = 600.
- Big numerals: `.t-stat` with a `.unit` span at 0.42em, top-aligned (`vertical-align: 0.9em`), e.g. "21" + "%".
- The hero H1 at ≥ 1024px is split into explicit lines by markup (`<span class="l">` per line, `display:block;
  white-space:nowrap`) so fallback → webfont swaps keep the same line count (CLS). Below 768px it wraps naturally.

### 4.2 Measures and layout
- `.container` max `--content-max` (1296) + 2×`--side`. 12-col grid unchanged (4-col below 768).
- Bands: `.band { padding-block: var(--section) }`; colour bands default full-bleed; use `.slab` for inset rounded
  blocks (pillar cards rail, method stickers, CTA on mobile).
- `html, body { overflow-x: clip }` stays; pinned rails must not create horizontal page scroll.

---

## 5. Assets

### 5.1 Vector logo (replaces every raster logo)
Source: `assets/logo/vector/`. FOUNDATION copies all seven files to `web/src/assets/brand/svg/` and deletes
`src/assets/brand/{wordmark.png, wordmark-white.png, lockup-tagline.png, lockup-tagline-white.png, logo-full.png}`.
`scripts/prepare-brand.mjs` is rewritten to read the SVGs (it no longer crops rasters).

`Logo.astro` (FOUNDATION) imports the SVG text with `?raw`, strips the XML comment, and inlines it. Variants:
| Variant | Source | Size | Where |
|---|---|---|---|
| `horizontal` | rendered as **two inline SVGs side by side** cut from `kokreaters-logo-horizontal.svg`: the cluster (`viewBox="20 15 570 570"`, the exact cluster markup) inside `<span data-dock-slot>`, and the wordmark part (`viewBox="590 15 1610 575"`, the wordmark paths only), both at the same height. This renders pixel-identical to the single file and lets the home dock move the cluster. | 44px tall desktop (≈ 167px wide), 36px mobile | Header, every page |
| `horizontal-white` | same, from `-horizontal-white.svg` | 44px | Mobile menu (Ink), view-transition snapshot on dark |
| `full` | `kokreaters-logo-full.svg` | 320px wide | About "The name" (on white) |
| `full-white` | `kokreaters-logo-full-white.svg` | 260px | Footer row 1 |
| `wordmark-white` | `kokreaters-wordmark-white.svg` | full container width | Footer giant sign-off (`aria-hidden`) |
| `cluster` | `kokreaters-node-cluster.svg` | any | Hero sticker, stamps, favicon, CTA, 404 |
- Put `isolation: isolate` on every logo `<svg>` so the discs' `mix-blend-mode: multiply` blends only inside the mark
  and renders the same on every ground (the mark itself is untouched).
- Accessible name: inside a labelled link the SVGs get `aria-hidden="true"`; standalone `full` gets
  `role="img" aria-label="KoKreaters: Connect · Collaborate · Create"`.
- Clear space: ≥ 0.19 × cluster height on every side (v1 rule). Never on photos. Never on a ground where the
  wordmark colour fails 3:1 (positive mark: White, Cloud, Butter, Lavender, Ice, Blush only; white mark: Ink,
  Imperial, Sapphire, Violet only).
- Favicons (`prepare-brand.mjs`): `public/favicon.svg` = node-cluster SVG minus comment/role/aria;
  `favicon-32.png`, `apple-touch-icon.png` (180, White square, 12% padding), `icon-512.png`,
  `public/brand/kokreaters-logo-512.png` (JSON-LD logo, same path) rendered with sharp at density 384.
- OG (`scripts/og.mjs` + `scripts/og/template.html`): Bricolage + Plex Mono, inline `kokreaters-logo-horizontal-white.svg`
  on Ink, a Saffron pillar bar, page title in `.t-display`, one Caveat note-free. Regenerate all `public/og/*.png`.

### 5.2 Founder photo (replaces both old crops)
Source: `assets/photos/ganeaysh-cutout-clean.png` (1665×2048 RGBA; alpha bbox x 0–1665, y 140–2048). **The bottom
row is a hard crop (fully opaque) and the right edge is cut through the right shoulder** (507 opaque px on the last
column); the left edge touches the left shoulder too.
`prepare-brand.mjs` writes:
| Output | Processing | Used by |
|---|---|---|
| `src/assets/photos/ganeaysh-cutout.png` | copy as-is (RGBA) | Home founder fold, About hero (`<FounderPhoto variant="cutout">`) |
| `src/assets/photos/ganeaysh-cutout-square.png` | `extract({ left: 160, top: 40, width: 1200, height: 1200 })`, keep alpha. Head centred (face centre ≈ x 760, hair top ≈ y 152, chin ≈ y 1048). Verify with Read and adjust. | Avatars (40, 48, 72, 96px), contact ticket, article byline, author box, mobile founder |
Delete `src/assets/photos/ganeaysh-portrait.png` and `ganeaysh-square.png`; nothing may import them (FOUNDATION adds a
grep check to `npm run verify`: no `ganeaysh-portrait|ganeaysh-square|wordmark\.png|lockup-tagline|logo-full\.png` in `src/`).

`src/components/brand/FounderPhoto.astro` (FOUNDATION):
```ts
interface Props {
  variant: 'cutout' | 'avatar';
  size?: number;                 // avatar px (default 48); cutout: CSS-driven
  ground?: GroundKey;            // avatar disc colour (default 'saffron'); cutout: none (transparent)
  ring?: boolean;                // avatar: 3px ring in --fg (default true)
  loading?: 'lazy' | 'eager'; fetchpriority?: 'high' | 'auto';
  sizes?: string; class?: string; alt?: string;   // default alt: portraitAlt.founder
}
```
- `cutout`: `<Picture src={cutout} formats={['avif','webp']} widths={[480, 720, 960, 1280]} fallbackFormat="png">`,
  `alt` from `founder.ts portraitAlt`, explicit width/height. **Placement rule**: the image's bottom edge must sit on a
  container edge with `overflow: clip` (flush-bottom), and its right edge must either sit on a container/viewport
  edge or be masked (arch, circle or block edge). Never float the cut-out in open space where the cut shoulder shows.
- `avatar`: the square crop in a circle (`border-radius: 50%`) on the ground colour, `widths=[size, size*2]`.
- Full colour only (no duotone). Never mirrored. No logo on the photo.

### 5.3 Other generated assets
- `src/assets/fx/grain.png`: 160×160 monochrome noise tile, ≤ 6KB, generated by `prepare-brand.mjs` with sharp
  (seeded random, so it is reproducible).
- `src/assets/globe/globe-static.svg`: unchanged.

---

## 6. The annotation kit (`src/components/notes/*`, FOUNDATION)

Everything in this kit is **decorative by default**: `aria-hidden="true"`, no links inside, never the only carrier of
information. All words come from `src/data/notes/*.ts` (never typed inline in a component). Each component ships
**fully drawn and visible** in its markup; motion only hides it while `html.motion:not(.motion-failed)` is set.

### 6.1 Files
| File | What |
|---|---|
| `notes/paths.ts` | the hand-drawn path library (6.3) and `pick(kind, seed)` |
| `notes/MarginNote.astro` | a Caveat note with an optional doodle arrow |
| `notes/Scribble.astro` | wraps a phrase: underline, double, zigzag, swoosh, circle, box, highlight, strike |
| `notes/Doodle.astro` | a standalone doodle: arrows, star, spark, tick, asterisk, bracket, node, squiggle |
| `notes/Venn.astro` | three hand-drawn circles with Caveat labels and a centre label |
| `notes/Sticker.astro` | die-cut sticker container (circle / pill / rect / burst), drop-in + peel |
| `notes/Stamp.astro` | circular text-on-path stamp (mono caps) around a centre slot, optional slow spin |
| `notes/SpecLabel.astro` | the honest label (nutrition-panel spec) |
| `notes/Tape.astro` | a masking-tape strip for pinning photos/cards |
| `notes/notes.css` | kit styles (imported once by `global.css`) |
| `scripts/motion/notes.ts` | the draw-on / settle / sticker / stamp motion (8.3) |

### 6.2 Component APIs
```ts
// shared
type Tone = 'auto' | 'orchid' | 'berry' | 'saffron' | 'white' | 'ink' | 'imperial' | 'sapphire' | 'butter';  // auto = var(--note) of the ground
type Show = 'all' | 'md' | 'lg' | 'pointer';      // md/lg = from 768/1024 up; pointer = (hover:hover) and (pointer:fine) only
type DoodleKind = 'arrow-curve' | 'arrow-loop' | 'arrow-straight' | 'arrow-bounce' | 'star' | 'spark' | 'tick'
                | 'asterisk' | 'bracket' | 'node' | 'squiggle' | 'heart-node';
type ScribbleKind = 'underline' | 'double' | 'zigzag' | 'swoosh' | 'circle' | 'box' | 'highlight' | 'strike';

// MarginNote.astro
interface MarginNoteProps {
  text: string;                 // from data/notes/*
  tone?: Tone;                  // default 'auto'
  size?: 'md' | 'lg';           // md = --fs-note (24→34), lg = --fs-note-lg
  rotate?: number;              // deg, default −4, clamp −12…12
  arrow?: DoodleKind | null;    // default 'arrow-curve'; null = no arrow
  arrowAt?: 'start' | 'end' | 'above' | 'below';  // default 'end'
  arrowAngle?: number;          // extra rotation so the head points at the target (deg)
  flip?: boolean;               // mirror the arrow
  place?: string;               // inline style for anchor="abs", e.g. "top:-2.2em; right:6%"
  anchor?: 'abs' | 'inline' | 'block';  // abs = absolutely positioned inside the nearest `.has-notes`
  show?: Show;                  // default 'md'
  delay?: number;               // s after its trigger, default 0
  trigger?: string;             // selector of the trigger element, default: closest `.has-notes` or section
  order?: number;               // sequence inside one trigger (stagger 0.18 s)
  seed?: number;                // path variant
  decorative?: boolean;         // default true. false → rendered as <p class="note" > visible to AT (rare; only if the words are real content)
}
// Scribble.astro  — <Scribble kind="circle">with you</Scribble>
interface ScribbleProps { kind: ScribbleKind; tone?: Tone; seed?: number; delay?: number; trigger?: string;
  thickness?: number /* px, default 3 */; pad?: string /* extra reach for circle/box, default '0.18em 0.3em' */ }
// Doodle.astro
interface DoodleProps { kind: DoodleKind; tone?: Tone; size?: number /* px width */; rotate?: number; place?: string;
  show?: Show; delay?: number; trigger?: string; seed?: number }
// Venn.astro
interface VennProps { labels: [string, string, string]; centre: string; tone?: Tone; size?: number /* px, default 360 */ }
// Sticker.astro (slot = content; as="a" makes the whole sticker a link and drops aria-hidden)
interface StickerProps { shape?: 'circle' | 'pill' | 'rect' | 'burst'; ground?: GroundKey; rotate?: number;
  size?: string; drop?: boolean /* data-sticker */; peel?: boolean; edge?: boolean /* 6px white die-cut edge, default true */;
  decorative?: boolean /* default true → aria-hidden; false when the sticker holds real content, e.g. heading words */;
  as?: 'div' | 'span' | 'a'; href?: string; label?: string /* aria-label when as=a */ }
// Stamp.astro
interface StampProps { text: string /* repeated round the ring, mono caps */; size?: number /* px, default 160 */;
  ground?: GroundKey; spin?: boolean /* 30 s per turn, pausable */ }   // slot = centre (e.g. the node cluster)
// SpecLabel.astro
interface SpecLabelProps {
  title: string;                         // e.g. 'What’s inside', 'Career facts', 'Key takeaways'
  sub?: string;                          // mono line under the title, e.g. 'Nothing hidden'
  rows: { k: string; v: string | string[]; strong?: boolean; html?: boolean }[];
  foot?: string;                         // mono footnote under the heavy rule
  ground?: GroundKey;                    // default 'white'
  headingLevel?: 2 | 3 | 4 | 'none';     // default 3; 'none' renders the title as <p> (use when the fold h2 already says it)
  rotate?: number;                       // default 0; ≤ 2°
  inspect?: boolean;                     // adds data-spec-inspect for the spec-inspector toy
  id?: string; class?: string;
}
// Tape.astro
interface TapeProps { tone?: 'butter' | 'blush' | 'ice' | 'lavender'; rotate?: number; width?: number; place?: string }
```

### 6.3 Markup and SVG approach
- **MarginNote** renders:
  `<span class="note note--md note--show-md" data-note data-note-delay="0" data-note-order="0" aria-hidden="true" style="--rot:-4deg; top:…">`
  `<span class="note__text t-note">that’s you + us</span>`
  `<svg class="note__arrow" viewBox="0 0 120 80" fill="none"><path data-note-draw pathLength="1" d="…"/><path data-note-draw data-note-head pathLength="1" d="…"/></svg></span>`.
  `.has-notes { position: relative }` on the parent. Notes never take part in layout flow when `anchor="abs"`, so
  they cannot cause CLS and can safely swap fonts.
- **Paths are strokes**, `stroke: currentColor` (= the tone), `stroke-width: var(--note-stroke, 3px)`,
  `stroke-linecap: round; stroke-linejoin: round`. Every path carries **`pathLength="1"`**, so CSS and GSAP can draw
  it with `stroke-dasharray: 1; stroke-dashoffset: 1 → 0` (no DrawSVG needed; DrawSVG stays available).
- Scribbles wrap the phrase: `<span class="scribble scribble--circle" data-scribble><span class="scribble__txt">{slot}</span><svg aria-hidden="true" preserveAspectRatio="none" …>`.
  Underline/double/zigzag/swoosh/strike/highlight SVGs use `preserveAspectRatio="none"` + `vector-effect:
  non-scaling-stroke` so the stroke stays 3px at any phrase length. Circle/box overshoot the phrase by `pad`.
  `highlight` is a filled rough rectangle under the text (z-index −1) in `--pill-sweep` (Saffron on light grounds;
  ink text on it is 10.95:1); it animates by `clip-path: inset(0 100% 0 0) → inset(0)` instead of a stroke draw.
- **Variants**: each kind has 2–3 hand-drawn variants in `paths.ts`; `pick(kind, seed)` chooses one (default seed =
  hash of the wrapped text), so two underlines on one page never look identical.
- Starting path data (author more variants in the same style: slight overshoot, uneven curvature, open ends):
```ts
export const PATHS = {
  underline:   [{ vb: '0 0 300 20', d: ['M3 13 C 60 8, 140 15, 200 10 S 280 9, 297 12'] },
                { vb: '0 0 300 20', d: ['M2 10 C 70 15, 150 6, 230 11 C 260 13, 285 10, 298 8'] }],
  double:      [{ vb: '0 0 300 24', d: ['M4 9 C 90 5, 200 12, 296 7', 'M12 17 C 100 13, 210 19, 290 15'] }],
  swoosh:      [{ vb: '0 0 400 24', d: ['M2 18 C 120 21, 260 16, 384 6'], head: ['M372 2 L 386 6 L 376 16'] }],  // the logo's rising arrow, hand-drawn
  circle:      [{ vb: '0 0 200 80', d: ['M150 10 C 190 14, 200 50, 160 68 C 120 84, 40 80, 14 60 C -6 42, 20 12, 80 8 C 120 5, 170 8, 186 24'] }],
  box:         [{ vb: '0 0 200 80', d: ['M6 8 C 70 4, 140 6, 194 9 C 197 30, 196 52, 193 73 C 130 77, 60 76, 8 72 C 5 50, 4 28, 9 5'] }],
  strike:      [{ vb: '0 0 300 20', d: ['M2 12 C 80 9, 200 13, 298 8'] }],
  highlight:   [{ vb: '0 0 300 24', fill: ['M2 6 C 80 2, 200 4, 298 3 L 297 21 C 200 23, 90 19, 3 22 Z'] }],
  'arrow-curve':    [{ vb: '0 0 120 80', d: ['M8 10 C 30 60, 70 72, 108 58'], head: ['M92 50 L 109 58 L 96 72'] }],
  'arrow-loop':     [{ vb: '0 0 140 90', d: ['M6 20 C 40 6, 70 30, 56 46 C 44 60, 26 40, 46 30 C 74 18, 100 52, 130 70'], head: ['M114 68 L 131 71 L 124 55'] }],
  'arrow-straight': [{ vb: '0 0 120 30', d: ['M4 16 C 40 13, 80 18, 112 14'], head: ['M100 6 L 114 14 L 101 23'] }],
  'arrow-bounce':   [{ vb: '0 0 120 80', d: ['M6 60 C 20 10, 40 10, 50 50 C 58 76, 76 20, 112 28'], head: ['M98 18 L 113 28 L 99 38'] }],
  star:     [{ vb: '0 0 60 60', d: ['M30 4 L 34 26 L 56 30 L 34 34 L 30 56 L 26 34 L 4 30 L 26 26 Z'] }],
  spark:    [{ vb: '0 0 60 60', d: ['M30 6 V 20', 'M30 40 V 54', 'M6 30 H 20', 'M40 30 H 54', 'M13 13 L 22 22', 'M38 38 L 47 47'] }],
  tick:     [{ vb: '0 0 50 40', d: ['M6 22 L 18 34 L 44 6'] }],
  asterisk: [{ vb: '0 0 40 40', d: ['M20 4 V 36', 'M6 12 L 34 28', 'M34 12 L 6 28'] }],
  bracket:  [{ vb: '0 0 20 80', d: ['M14 4 C 4 20, 4 60, 14 76'] }],
  node:     [{ vb: '0 0 60 60', d: ['M30 10 C 42 10, 50 20, 50 30 C 50 42, 40 50, 30 50 C 18 50, 10 40, 10 30 C 10 20, 20 9, 33 11', 'M30 24 C 34 24, 36 27, 36 30 C 36 34, 33 36, 30 36 C 26 36, 24 33, 24 30 C 24 27, 27 24, 31 25'] }],  // the logo's ringed node, sketched
  squiggle: [{ vb: '0 0 120 20', d: ['M2 10 C 12 2, 22 18, 32 10 S 52 2, 62 10 S 82 18, 92 10 S 112 2, 118 10'] }],
};
```
- **Venn**: three `node`-style loose circles (r≈ 0.36·size) at 120° offsets, drawn in sequence; labels in Caveat at
  each outer lobe; the centre label in Caveat `lg`. `<figure aria-hidden="true">` (the words restate visible copy).
- **Sticker**: `edge` = `outline: 6px solid #fff` for rect/pill, or a white `::before` disc 12px larger for circle;
  `box-shadow: var(--shadow-sticker)`; `rotate: var(--rot)`. `peel` adds a folded corner (`::after` triangle) that
  lifts 6px on hover. Burst shape = 12-point polygon `clip-path`.
- **Stamp**: SVG `<textPath>` on a circle path (r = size/2 − 14), `font: 500 11px var(--font-mono)`, uppercase,
  `letter-spacing: .24em`, text repeated to fill. `aria-hidden`; the same words exist as visible text elsewhere.
- **SpecLabel** (the honest label, our nod to food packaging):
  `<section class="spec g-{ground}" aria-labelledby="{id}-t">` → `<h3 id="{id}-t" class="spec__title">` (Bricolage
  800/75%, 40px) → `<p class="spec__sub t-micro">` → `<div class="spec__rule spec__rule--heavy">` (10px `--fg`) →
  `<dl class="spec__rows">` each row `<div class="spec__row"><dt class="t-label">…</dt><dd class="t-mono">…</dd></div>`
  separated by 1px `--fg` rules (rows with `strong` get a 4px rule above) → heavy rule → `<p class="spec__foot t-micro">`.
  Box: `border: 2px solid var(--fg); padding: 16px 20px 18px; max-width: 460px;` radius 6px (packaging, not app).
  `dd` arrays render as `<ul class="spec__list">` with hand `tick` bullets. On narrow widths rows stack (`dt` above `dd`).
- **Show gating** is pure CSS: `.note--show-lg { display:none } @media (min-width:1024px){ .note--show-lg { display:… } }`;
  `.note--show-pointer` only inside `@media (hover:hover) and (pointer:fine)`.

### 6.4 Motion hooks owned by the kit (all set by markup; `scripts/motion/notes.ts` reads them)
| Hook | On | Meaning |
|---|---|---|
| `data-note` | MarginNote root | settle-in after its arrow draws |
| `data-note-draw` | any kit `<path>` | stroke draw (`pathLength=1`) |
| `data-note-head` | arrow heads | start at 85% of the shaft |
| `data-scribble` | Scribble root | draw (or wipe, for highlight) when its trigger enters |
| `data-note-delay` / `data-note-order` / `data-note-trigger` / `data-note-start` | any kit root | timing; `start` default `'top 75%'` |
| `data-sticker` | Sticker / any element | drop-in (8.3 R4) |
| `data-sticker-peel` | Sticker | hover peel |
| `data-stamp-spin` | Stamp | slow spin, pausable |
| `data-spec-inspect` | SpecLabel | target of the spec-inspector toy (P-expertise) |
CSS gate in `notes.css`:
```css
html.motion:not(.motion-failed) [data-note] { opacity: 0; }
html.motion:not(.motion-failed) [data-note-draw] { stroke-dasharray: 1; stroke-dashoffset: 1; }
html.motion:not(.motion-failed) [data-scribble="highlight"] .scribble__fill { clip-path: inset(0 100% 0 0); }
html.motion:not(.motion-failed) [data-sticker] { opacity: 0; }
@media (prefers-reduced-motion: reduce) { html [data-note], html [data-sticker] { opacity: 1 !important; } html [data-note-draw] { stroke-dashoffset: 0 !important; } html .scribble__fill { clip-path: none !important; } }
```

---

## 7. Shared UI and chrome restyle (FOUNDATION)

### 7.1 Announcement bar (`chrome/AnnouncementBar.astro`, new) + Pause motion (`chrome/MotionToggle.astro`, new)
- First element in `<body>` after `SkipLink`, **not sticky**: `<div class="ann g-ink" role="region" aria-label="Announcement">`,
  height `--ann-h` (36px; wraps to 2 lines ≤ 44px at 390), `t-mono` 13px.
- Left: `chromeNotes.ann.lead` ("Field notes from the plant floor and the boardroom.") + link
  `chromeNotes.ann.link` ("Read the insights") → `/insights`, Saffron, underlined.
- Right (≥ 768): `hero.footLeft` ("Based in the Netherlands, working worldwide") · then `MotionToggle`.
- `MotionToggle`: `<button type="button" class="motion-toggle" aria-pressed="false" data-motion-toggle>` with the
  pause/play icon + visually present label "Pause motion" / "Play motion" (mono 13px; at 390 icon-only with the
  label visually hidden, hit area 44×44). It is rendered **only when `html.motion`** is set (`.js-motion-only`), because
  under reduced motion nothing loops. Pressing it sets `html.motion-paused`, persists `localStorage['kk-motion']='paused'`
  (try/catch), and calls every registered `onPause` handler (marquee, stamp spin, emulsion, hub packets, magnetic dots).
  It never disables scroll-driven or user-driven motion (that is not auto-playing).
- **Every loop on the site** (marquee, stamp spin, emulsion, hub packets, flap-board cycling, magnetic-dots idle)
  must stop on `html.motion-paused`, stop when off-screen (IntersectionObserver), and stop when `document.hidden`.

### 7.2 Header (`chrome/Header.astro`)
- White (`.g-white`), `height: var(--header-h)` (76) → 64 compact; 1px Hairline bottom border when `.is-scrolled`.
- Left: `<Logo variant="horizontal">` 44px tall (36px below 1024), link `aria-label="KoKreaters home"`. Keep
  `data-dock-slot` on the cluster `<span>` and the v1 home rule that hides it on home ≥ 1024 until the dock runs.
- Nav (≥ 1024): Bricolage 600 / 100% 16px Ink, gaps 28px (20 at 1024–1279). Current page: a static hand
  `underline` Scribble in Orchid under the label (no animation). Hover/focus: the same underline draws over 300ms.
  Expertise disclosure button unchanged in behaviour (v1 3.2/3.3).
- Right: `<Button href="/contact" variant="primary" size="sm">Start a conversation</Button>` (keep `a.btn`; the
  keyboard test selects `header a.btn[href="/contact"]`). Magnetic (8.3 R7).
- Below 1024: logo, CTA (hidden < 480), and the menu button: a 44×44 outline pill, mono "Menu"/"Close" label + icon.
  Keep `data-menu-toggle`, `aria-expanded`, `aria-controls="mobile-menu"`.
- **Hide on scroll**: after `scrollY > max(600, hero bottom + 200)` scrolling down translates the header `-100%`
  (240ms `--ease-quart`); any upward scroll, any focus inside the header, an open panel/menu, or `prefers-reduced-motion`
  keeps it shown. On home the dock forces it shown for 1.2s. Space stays reserved (the outer `<header>` keeps its height in
  flow; only the inner bar moves), so no CLS.
- `view-transition-name: site-header` on the inner bar (7.9).

### 7.3 Expertise panel (`chrome/ExpertisePanel.astro`)
- Full container width, `.g-white`, 2px Ink border, radius 0 0 24px 24px, `--shadow-panel`, padding 32.
- Left 8 cols: the six pillars as a 3×2 grid of **mini colour blocks** (each `.g-{pillarGround}` radius 16, padding
  20): mono `0{n}`, name in Bricolage 650 20/24, promise in mono 13. Hover/focus: block lifts 4px with
  `--shadow-hard`, rotates −1°. "All expertise" TextLink below.
- Right 4 cols: "Featured insight" label + the newest visible insight as a small `CoverStory variant="card"`.
- Open: `clip-path: inset(0 0 100% 0) → inset(0)` 320ms `--ease-expo`, tiles rise 12px with 40ms stagger; close 160ms
  fade. Reduced: instant. All v1 keyboard/hover-intent behaviour stays.

### 7.4 Mobile menu (`chrome/MobileMenu.astro`)
- Full-screen `.g-ink`, `data-lenis-prevent`, internal scroll. Top row: `Logo variant="horizontal-white"` + Close.
- Links (`a.m-menu__link`, keep the class) in Bricolage 780/75% at 44px White, each preceded by a 12px pillar-colour
  ringed dot cycling the six colours; the "Expertise" disclosure opens six colour chips (pillar ground pills, mono 12).
- Saffron primary pill "Start a conversation"; details in mono Lavender; MarginNote `chromeNotes.menu` ("or just say
  hello", Saffron, arrow to the email) `show="all"`.
- Open: `clip-path: circle(0 at <menu-button-centre>) → circle(150% …)` 420ms `--ease-expo`; links rise 24px,
  stagger 50ms. Close: reverse 260ms. Reduced: instant. Keep `inert` on `main`/`footer`, focus first link, Esc, focus
  return (keyboard.spec).

### 7.5 CTA field (`shared/CtaField.astro`) — the Saffron block (every page except contact, legal, 404)
- `.g-saffron .grain`, full-bleed, `padding-block: var(--section)`, `has-notes`.
- Background: **magnetic-dots** (bencho, 9) in Imperial at 18% opacity, `aria-hidden`.
- Grid 8/4. Left: h2 `.t-display` Ink "Have a challenge worth solving together?" with `<Scribble kind="circle"
  tone="imperial">together</Scribble>`; body `cta.body` in `.t-lead` Imperial; actions: primary pill (Ink, sweep White)
  "Book a 30-minute call" → `site.bookingUrl`; plus a mono link `office@kokreaters.com` (mailto). MarginNote
  `chromeNotes.cta` ("we’re all ears", Berry, `arrow-loop` pointing at the button, `show="md"`).
- Right: a big `Sticker shape="circle"` holding the node cluster (true colours, 220px), rotated 6°, `data-sticker`,
  magnetic on pointer-fine.
- Mobile: one column; the sticker sits top-right at 120px, overlapping the h2's first line (decorative).

### 7.6 Footer (`chrome/Footer.astro`)
- `.g-ink .grain`. Row 1: `Logo variant="full-white"` 260px (link home) and a MarginNote `chromeNotes.footer`
  ("thanks for reading all the way down", Saffron, arrow up) next to a mono "Back to top" link (`chromeNotes.top`,
  `href="#main"`).
- Row 2: the v1 four columns (Expertise, Company, Contact, Newsletter) with mono Lavender column heads; links
  Bricolage 600 17px White, hover Saffron with a hand underline.
- Row 3: **the giant sign-off**: `Logo variant="wordmark-white"` at 100% container width, `aria-hidden`, bottom-aligned
  so its descent is clipped by the band edge by ~10% (it is not distorted, only cropped by the band; if the owner
  objects, set `--signoff-crop: 0`).
- Bottom row (mono 13 Lavender): `© 2026 KoKreaters™ · Privacy · Cookies · Terms · Cookie settings` + `Confirm 11`.
- All v1 links, `rel` and LinkedIn labelling unchanged.

### 7.7 UI components (`src/components/ui/*`)
| Component | v2 |
|---|---|
| `Button.astro` | Props unchanged + `variant: 'primary'\|'secondary'\|'on-dark'\|'ghost-on-dark'\|'ground'\|'hand'`, `magnetic?: boolean` (default true for primary/on-dark). **primary**: `--pill-bg` fill, `--pill-fg` text, Bricolage 700/95% 17px, 52px tall (sm 44), padding 0 26px, arrow 18px; hover = **sweep-button** (bencho, 9): a `--pill-sweep` fill sweeps round the edge then floods, text turns `--pill-sweep-fg`, arrow nudges 4px; 420ms `--ease-expo`. **secondary/hand**: 2px `--pill-line` outline, transparent, label in `.t-hand` (Caveat 26px), arrow hand-drawn; hover = fill `--kk-butter` on light / `--kk-white-20` on dark, `--shadow-hard`, rotate −1°. **on-dark**: Saffron/Ink. **ghost-on-dark**: White outline + hand label. **ground**: uses the ground's pill tokens. Keep the `btn` class, loading state and disabled state from v1. |
| `TextLink.astro` | label (Bricolage 650 17px, `--link`) + Arrow; hover/focus draws a hand `underline` (300ms) and nudges the arrow. |
| `Arrow.astro` | unchanged geometry; adds `hand?: boolean` → the `arrow-straight` doodle path, 2.5px. |
| `Icon.astro` | + `pause`, `play`, `arrow-up`, `drag`. |
| `PillarDot.astro` | 12px (8/10/12/16 sizes) fill + 2px white ring + 1.5px Ink outer ring on every pillar (sticker look). |
| `PillarTag.astro` | chip 32px, `.g-{pillarGround}` colours, mono 12 caps + PillarDot; hover rotate −2° + lift 2px. |
| `Dateline.astro` | mono label with a leading 8px ringed node; on grounds uses `--fg-2`. |
| `Folio.astro` | "notebook tab": `[01]` in a 28px ringed circle + mono label + a **dashed** 1.5px `--fg` rule (perforation) + right running head. |
| `Section.astro` | `ground?: GroundKey \| 'dark'` ('dark' → imperial), `paper?: 'grid' \| null`, `grain?: boolean`, `slab?: boolean`, `notes?: boolean` (adds `has-notes`). |
| `Sidenote.astro` | a Butter sticky note (Instrument Sans meta, `Tape` on top), rotate −1°. |
| `Confirm.astro` | staging only: hazard tape (Saffron/Ink 45° stripes 6px) pill with Ink-on-Butter text "CONFIRM n". |
| `DraftRibbon.astro` | staging only: a hazard-tape band across the top of the article header, mono caps. |
| `Breadcrumbs` (chrome) | mono 12 caps, `/` separators, current in `--fg`. |

### 7.8 Shared components (`src/components/shared/*`, FOUNDATION; used by several page units)
| Component | v2 |
|---|---|
| `PillarCard.astro` (new) | `{ pillar, variant: 'rail'\|'grid', headingLevel?: 2\|3, moreLabel?: string }`. One `<a href="/expertise/{slug}" class="pcard g-{pillarGround} grain">` (whole card is the link; no nested links) with: mono `0{n} / 06` + PillarDot; the **promise** in Bricolage (`rail`: `--fs-h3` × 1.2; `grid`: `--fs-h3`) inside the heading; the pillar **name** as a mono label under it; a compact `SpecLabel` (`headingLevel='none'`, `ground` = the pillar tint) with rows `Typical deliverables` = deliverables joined by " · ", and `pillarPage.fromTheRecord` ("From our founder’s career") = the impact dateline when `impactId` (e.g. "India · Wilmar"); `grid` adds a first row `pillarPage.helpWith` = first 3 `helpWith` items + the caller's `moreLabel` prop (P-expertise passes `expertiseNotes.card.more` = "+{n} more"); a faux hand pill "Learn more" + Arrow (a `<span>`, the card is the link). Size: rail 440×600 desktop / 82vw×520 mobile; grid auto. Radius `--r-card`. Hover: edge-light (bencho) + lift 6px + rotate ±1° (alternating). Focus: 3px `--focus` outline offset 4. |
| `ImpactCard.astro` (new) | `{ result: FounderResult, figure?: string, secondary?: string, border?: PillarKey, size?: 'md'\|'lg' }`. White card, `--bw-card` border in the pillar colour, radius 24, padding 28: mono dateline; big `.t-figure` (count-up via `data-count` when numeric); `homeLine` in `.t-h4` with `emphasis` substrings in `.fig` (Bricolage 800, Sapphire, nowrap); `data-frost` kept on −25 °C. The caller passes `figure`/`secondary`: india = the DERIVED "1st" from the caller's own notes file (display of the brief's "India’s first", section 11), indonesia "21%", ukraine "−25 °C" + secondary "15%" (`secondaryFigures`), tfa "WHO". |
| `CoverStory.astro` | adds `variant: 'feature'\|'card'\|'fan'`. Typographic cover (no images exist): `.g-{pillarTintGround}` block, a pillar `Doodle` (seeded) large in the corner at 30% `--fg`, format label mono, title Bricolage `.t-h3` (feature: `.t-h2`), standfirst Instrument Sans, byline with `FounderPhoto variant="avatar" size={40}`. DraftRibbon in staging. |
| `InsightRow.astro` | notebook row: date mono, title `.t-h3`, pillar chip, reading time; hover: row shifts 8px right and a hand arrow draws at the end. |
| `ImpactRow.astro` | kept for compact uses; restyled mono dateline + `.t-index` line. |
| `MethodLine.astro` | restyled: a hand-drawn dashed path (`stroke-dasharray: 2 10`, round caps) between three ringed `node` doodles; scrub stays. |
| `Newsletter.astro` | mono line + Caveat MarginNote slot + hand pill "Subscribe" (or the form as v1). |
| `RunIn.astro` | adds `variant: 'run-in'\|'stickers'`: stickers = each item a rotated pill sticker (tints cycling), still a `<ul>`. |
| `Marquee.astro` (new) | `{ items: string[]; ground?: GroundKey; speed?: number /* px/s, default 60 */; separator?: 'node'\|'star' }`. The marquee is always `aria-hidden`: it may only repeat content that exists as real text elsewhere on the same page. Two copies of the track for the loop. Bricolage 800/75% `--fs-h2`, separators are 28px ringed dots cycling the 5 logo node colours. |
| `Rail.astro` (new) | `{ label: string; pin?: boolean; id: string }` + slot of `<li>` items. `<section aria-label={label}>` → `<ul class="rail__track" role="list">`. Desktop + `pin` → pinned horizontal scrub (8.3 R5); otherwise native `overflow-x: auto; scroll-snap-type: x mandatory` with prev/next buttons ("Previous"/"Next", visually hidden labels + arrow icons) and a mono counter "1 / 6". |
| `ExpertiseIndex.astro` | left in place for any remaining use; no v2 page uses it. |

### 7.9 Page transitions and the cursor (FOUNDATION)
- In `motion.css`: `@media (prefers-reduced-motion: no-preference) { @view-transition { navigation: auto; } }`.
  `::view-transition-old(root)` fades to 0 and moves up 24px; `::view-transition-new(root)` rises from 24px; both
  `--d-page` `--ease-expo`. `.site-header__bar { view-transition-name: site-header }` (no animation on it).
  Browsers without support simply navigate. No JS.
- `scripts/motion/cursor.ts`: on `(hover:hover) and (pointer:fine)` only, a 12px Ink dot follows the pointer
  (`gsap.quickTo`, 0.35s `power3.out`) with `mix-blend-mode: difference` off (it is Ink, simple). Over any
  `[data-cursor]` it grows to 84px and shows the Caveat label from `data-cursor` (`drag`, `throw`, `wipe`, `press`,
  `open`, `pull`, from `chromeNotes.cursor`). **The native cursor is never hidden.** `aria-hidden`, `pointer-events: none`.

---

## 8. Motion v2

### 8.1 Principles
- **Cinematic, not busy.** Big moves are scroll-driven or user-driven; auto-playing loops are few, slow and pausable.
- **Ease palette**: entrances `expo.out`; draws `power2.inOut`; stickers `back.out(1.7)`; notes settle `back.out(2)`;
  magnets `power3.out` in, `elastic.out(1, 0.35)` out; springs are physical (8.3 R12); scrubs `none`.
- **Never animated at load**: the H1 text and the LCP element (no hiding, no transform). The home H1 only reacts to the
  pointer (magnetic letters) after load. Form fields never move.
- **Reduced motion** (`prefers-reduced-motion: reduce`, or `motion-failed`): Lenis off, no pins, no scrubs, no loops,
  no physics; every note drawn, every sticker placed, every rail a native scroll list, every toy in its static
  readable state. Toys that are purely user-initiated (drag, tear, crumple, wipe) may still respond, instantly.
- **JS off**: identical to reduced motion; all content and all links work.
- **Everything scrubbed reaches its final state** once its section is fully above the viewport (axe runs after
  `scrollThrough`; nothing may be left at partial opacity).

### 8.2 `src/scripts/motion/tokens.ts` (replace)
```ts
export const D = { fast: .16, ui: .24, panel: .32, rise: .9, draw: .7, head: .16, note: .45, sticker: .7,
  count: 1.4, marquee: 60 /* px/s */, magnetIn: .4, magnetOut: .9, scrub: 1 };
export const E = { rise: 'expo.out', draw: 'power2.inOut', note: 'back.out(2)', sticker: 'back.out(1.7)',
  magnet: 'power3.out', release: 'elastic.out(1, 0.35)', count: 'expo.out', ui: 'power3.out' };
export const START = 'top 80%';
export const NOTE_START = 'top 75%';
```
`MotionContext` (context.ts) gains: `fine: boolean` (`(hover:hover) and (pointer:fine)`), `paused: boolean`,
`onPause(cb: (paused: boolean) => void): () => void`, and `whenNear(el, load: () => Promise<unknown>, margin = '50% 0px')`
(IntersectionObserver → dynamic import once; returns a disposer). Every bencho/FX module is loaded through `whenNear`.

### 8.3 Recipes (FOUNDATION implements R1–R11 and R13 in `src/scripts/motion/*` / `src/scripts/bencho/*`; pages only add markup hooks)
| # | Recipe | Hook | Spec | Reduced |
|---|---|---|---|---|
| R1 | **Text rise** (bencho text-rise) | `data-rise="lines"\|"words"`; `data-reveal="lines"` is an alias | SplitText (`mask: 'lines'`, `autoSplit`), lines `yPercent: 110, rotate: 2.5 → 0`, 0.9s `expo.out`, stagger 0.08, once at `top 80%`. Never on an H1. | not split |
| R2 | **Block reveal** | `data-reveal`, `data-reveal-group` | `opacity 0→1, y 28→0`, 0.8s `expo.out`, group stagger 0.07 | visible |
| R3 | **Note draw-on** | kit hooks (6.4) | For each trigger group in `order`: shafts `strokeDashoffset 1→0` 0.7s `power2.inOut`; heads at 85% 0.16s; then `[data-note]` `opacity 0→1, rotate (rot−8°)→rot, scale .9→1` 0.45s `back.out(2)`; scribbles draw 0.6s (highlight wipe 0.6s `expo.out`); group stagger 0.18s; once at `NOTE_START` + `delay`. | drawn |
| R4 | **Sticker drop** | `data-sticker` (`data-sticker-from="top\|left\|right"`) | from `y: −80, rotate: rot ± 14°, scale: 1.18, opacity 0` → set, 0.7s `back.out(1.7)`; shadow grows from 0. Siblings stagger 0.09. | placed |
| R5 | **Pinned sideways rail** | `Rail pin` (`data-rail`, `data-rail-track`) | ≥ 1024 + motion: `ScrollTrigger.create({ trigger: rail, pin: true, start: 'top top+=' + header, end: () => '+=' + (track.scrollWidth − innerWidth + side*2), scrub: 1, invalidateOnRefresh: true })` tweening `x` of the track; cards get a subtle `rotate` from velocity (`±3°`, `quickTo`). **Focus mapping**: when focus enters a card, scroll the window to that card's x position (`st.start + cardOffset/trackDistance × (st.end − st.start)`) so it is on screen. Below 1024 or reduced: native scroll-snap rail + prev/next buttons. | native rail |
| R6 | **Marquee** | `data-marquee` (`data-marquee-speed`, `-dir`) | GSAP ticker moves `x` at `speed` px/s, wraps at one track width; scroll velocity adds up to ±3× speed and a `skewX` ≤ 6°; hover slows to 0.2×; `onPause` and off-screen stop it. | static, wrapped (still aria-hidden) |
| R7 | **Magnetic pill / sticker** | `data-magnetic="0.35"` (strength) | pointer-fine only; within the element's box + 40px, translate toward the pointer × strength (max 14px), inner label × 1.4; `quickTo` 0.4s `power3.out`; leave: `elastic.out(1, .35)` 0.9s. | none |
| R8 | **Count-up** | `data-count`, `data-count-from`, `data-count-suffix` | `{v: from}` → target, 1.4s `expo.out`, snapped integers, `tabular-nums`; the real value stays in a `visually-hidden` sibling (v1 pattern). Negative targets (−25) count from 0 down. | final value |
| R9 | **Scrubbed big type** | `data-scrub-words` | SplitText words; `opacity .14 → 1` across the words, `scrub: true`, `start: 'top 80%'`, `end: 'bottom 60%'`. Final state at section end. | full opacity |
| R10 | **Parallax** | `data-parallax="0.15"` (decorative only: stickers, notes, photos' backing discs, never text blocks) | `y: −speed × 100%` of travel, scrubbed. | none |
| R11 | **Edge light** (bencho) | `data-edge-light` | pointer position → `--mx/--my` custom props; a 1.5px rim gradient masked to the border, 0.25s lerp; on PillarCards and the About photo frame. | none |
| R12 | **Springs** (hero network, page toys) | page modules | semi-implicit Euler, `k = 140`, `damping = 16`, mass 1, 60Hz fixed step; rest when energy < 0.01; never runs when idle. | static |
| R13 | **Header hide/show, cursor, page transitions** | chrome | 7.2, 7.9 | off |

`motion.css` v1 gates stay (`data-reveal`, `data-rule`, `data-hero-hide`) and gain `data-rise` (visibility hidden
until split) and `data-sticker` (6.4).

### 8.4 Lenis
`lerp: 0.1`, `wheelMultiplier: 1`, `syncTouch: false`, `anchors: { offset: −92 }`, `prevent` on `[data-lenis-prevent]`
and on every toy root (`[data-toy]`) so drags do not scroll. Everything else as v1 6.3.

### 8.5 JS budget (gzip; `scripts/check-budget.mjs` enforces the initial graph)
| Scope | Gate |
|---|---|
| Home initial graph (static closure + page module) | ≤ 95KB (unchanged) |
| Every other page initial graph | ≤ 85KB (unchanged) |
| Each lazy chunk (a bencho block, emulsion, physics, Flip, Draggable) | ≤ 35KB, loaded via `whenNear` or on interaction |
| three.js | About only (unchanged, ≤ 170KB lazy) |
| CSS per page | ≤ 60KB (unchanged) |
| Fonts total in `public/fonts` | **≤ 240KB** (was 180; raised by the orchestrator for the new type system) |
| Home total transfer (budget.spec) | ≤ 600KB (unchanged) |
Keep GSAP plugins out of the initial graph unless every page needs them: ScrollTrigger + SplitText core stay;
`Draggable`, `InertiaPlugin` (free in 3.15), `Flip`, `Observer` are dynamic imports where used.

---

## 9. Bencho ports (MIT, Copyright (c) 2026 Lorenzo Cabra)

Rules from `research/ref-bencho.md` apply to every port: vanilla TS + GSAP + CSS, an Astro component in
`src/components/bencho/<Name>.astro` with its script in `src/scripts/bencho/<name>.ts`; the MIT notice in a header
comment of **both** files; every ported block listed in `web/THIRD_PARTY_NOTICES.md` with the full MIT text (FOUNDATION
creates the file with the licence text and the header list; each unit appends its own rows **only** to the section
marked for it, see 12.4); real HTML first, the block enhances it; lazy via `whenNear`; pointer effects only on
pointer-fine; a keyboard alternative for anything draggable; reduced motion = static; no layout shift; no Bencho name,
mark, demo images or sounds. Read each block's code at `https://bencho.dev/blocks/<slug>` with headless Chrome
(Playwright, `/usr/bin/google-chrome`), and watch the demo to match the feel. Restyle to v2 tokens.

| Slug | Component / script | Owner | Route and spot | HTML underneath | Keyboard / touch | Static state |
|---|---|---|---|---|---|---|
| text-rise | `TextRise.astro` (optional wrapper) / `text-rise.ts` (powers R1) | FOUNDATION | site-wide h2s | the heading | n/a | plain heading |
| sweep-button | (inside `ui/Button.astro`) / `sweep-button.ts` (CSS-first; JS only for edge-entry direction) | FOUNDATION | all primary pills | `<a>`/`<button>` | focus-visible = sweep | solid pill |
| magnetic-dots | `MagneticDots.astro` / `magnetic-dots.ts` (canvas 2D, DPR ≤ 2, dot grid 22px, lean ≤ 8px toward pointer within 180px, idle breathing pausable) | FOUNDATION | CtaField background | none (`aria-hidden` canvas) | none | CSS radial-dot background |
| edge-light | `EdgeLight.astro` (wrapper) / `edge-light.ts` (R11) | FOUNDATION | PillarCards, About photo frame | the card | none | no light |
| flap-board | `FlapBoard.astro` / `flap-board.ts` | FOUNDATION (used by P-home and P-story) | Home proof band, About under hero | `<p class="visually-hidden">` with all entries joined by " · "; the board is `aria-hidden` | none (auto-cycles 3.2s per entry; pausable; stops after one full cycle unless hovered) | first entry shown |
| — (helper) | `scripts/bencho/physics.ts` (tiny 2D rigid body: circles + rounded boxes, gravity, walls, pointer grab/throw, sleep; ≤ 6KB) | FOUNDATION | used by gravity-tags and falling-text | — | — | — |
| magnetic-letters | `MagneticLetters.astro` / `magnetic-letters.ts` | P-home | Home H1 | the server-rendered H1 text. After `load` + idle, on ≥ 1024 + pointer-fine only, the script rebuilds the H1's inner markup as `<span class="visually-hidden">{full text}</span><span aria-hidden="true" class="ml">{per-line, per-word, per-letter spans}</span>`, keeping the same `.l` line spans so layout is identical (no CLS, the H1 block keeps its size so no new LCP entry). Letters lean ≤ 10px toward the pointer within 140px, 0.5s `power3.out`, return `elastic.out(1,.4)`. | none | static H1 (no split at all) |
| gravity-tags | `GravityTags.astro` / `gravity-tags.ts` | P-home | Home "Where we work" | `<ul>` of 9 `<a href="/industries#{slug}">` pills | pills are real links in DOM order; Tab focuses them (focus ring visible, physics pauses that body); touch drag works | flex-wrap pill list |
| hub-diagram | `HubDiagram.astro` / `hub-diagram.ts` | P-expertise | `/expertise` | `<ul>` of 6 pillar links positioned on spokes | links focusable; focus = hover state | static diagram, no packets |
| spec-inspector | `SpecInspector.astro` / `spec-inspector.ts` | P-expertise | Pillar pages, over the SpecLabel | the SpecLabel | button "Inspect the label" toggles the frame; arrow keys move it (16px steps), Esc closes; touch: tap toggles blueprint on the whole label | label only |
| crumple | `Crumple.astro` / `crumple.ts` | P-story | `/approach` | the caption h2 + a `<button>` "Crumple it" | Enter/Space on the button crumples; "Smooth it out" restores | flat card with a hand `strike` across |
| faq-accordion | `FaqAccordion.astro` / `faq-accordion.ts` | P-story | `/approach` ways to work | `<details><summary>` per model | native | all closed, native |
| foggy-word | `FoggyWord.astro` / `foggy-word.ts` | P-story | `/impact` Ukraine case, "−25 °C" | the figure text | auto-clears 1.2s after entering view for keyboard/touch users or on focus of the case; pointer wipes | no fog |
| card-swap | `CardSwap.astro` / `card-swap.ts` (Draggable lazy) | P-story | `/impact` results stack | `<ol>` of 4 ImpactCards linking to `#{id}` | "Next card" button; arrow keys when focused | ordered list |
| card-fan | `CardFan.astro` / `card-fan.ts` | P-journal | `/insights` hub | `<ul>` of CoverStory cards | Tab lifts the focused card | grid |
| ticket | `Ticket.astro` / `ticket.ts` | P-journal | `/contact` | an `<a class="btn">` "Book a 30-minute call" inside the ticket | Enter activates (tear animation then navigate); pointer drags the stub along the perforation | ticket with link |
| confetti | `Confetti.astro` / `confetti.ts` (canvas, the six pillar colours, paper rectangles, 1.6s, once) | P-journal | `/contact` success | none (`aria-hidden`) | n/a | none |
| falling-text | `FallingText.astro` / `falling-text.ts` (uses physics.ts) | P-journal | 404 | the H1 stays as real, static text; the toy is an `aria-hidden` pit of word tiles below it | none needed (decorative) | tiles stacked statically |
Nice-to-have (only if budget allows, P-story): `line-sphere` is **not** used; the Three.js globe stays.

---

## 10. Routes, fold by fold

Conventions for this section: **G** = ground class; **N** = a MarginNote/Scribble/Doodle with its exact words (all
decorative, `aria-hidden`, from `src/data/notes/<unit>.ts`); **M** = motion; **K** = keyboard/touch/static notes.
Copy not quoted here is the v1 copy from `src/data/*`, unchanged. Every page: AnnouncementBar → Header → main →
(CtaField) → Footer. Folios become notebook tabs (7.7) on folds that had them.

### 10.1 Home `/` (P-home) — ground rhythm: white → ink → imperial → white grid → white → lavender → white → blush → white → sapphire → saffron (CTA) → ink (footer)

**F1 · Hero** (`Hero.astro`, `HeroNetwork.astro`; G `.g-white`, `min-height: min(100svh − ann − header, 960px)`, `has-notes`)
- Top row: mono dateline `hero.overline` (wraps at its middle dot).
- **H1** `.t-mega` Ink, three explicit lines at ≥ 1024: "Where deep" / "expertise meets" / "shared ambition."
  (spans `.l`), natural wrap below 1024 (FOUNDATION's fallback tuning keeps the line count stable there). `<Scribble kind="swoosh" tone="orchid">shared ambition</Scribble>` replaces the
  v1 RisingArrow. MagneticLetters (9) on desktop.
- N1 `homeNotes.hero.shared` = **"that’s you + us"**: `arrow-curve` from the note (placed under line 3, right of
  "ambition", rotate −6°) pointing up-left at "shared"; `show="md"`, order 0, delay 0.6 s (after the swoosh).
- Row below H1, grid 6/6: left `hero.sub` in `.t-lead` (mono) Graphite, max 46ch; right actions bottom-aligned:
  primary pill "Start a conversation" (sweep Saffron, magnetic) + **hand pill** (`variant="hand"`) "Explore our
  expertise" (`data-hero-explore`, kept).
- **HeroNetwork** (decorative, `aria-hidden`, `data-toy`, `data-cursor="pull"`): absolutely placed in the empty space
  right of line 1 ("Where deep"), cols 8–12, overlapping lines 1–2 by up to 15% (z-index below the H1 text).
  - `viewBox 0 0 640 600`. Centre: a **Sticker** (white die-cut circle r=150, `--shadow-sticker`, rotate −6°) holding
    the **logo node cluster** at true colours, 230px (nested svg, viewBox `20 15 570 570`), with its discs.
  - Six **pillar nodes** (36px pillar-colour discs, 6px white ring, 1.5px Ink ring) on a ring r≈255 at angles
    innovation 200°, process 255°, quality 315°, strategy 15°, deals 75°, capability 135°; each with a mono 12px
    caps label on a white pill (`heroNodeLabels`, unchanged COMPOSED strings).
  - **Elastic strings**: 3px Ink quadratic curves from the cluster's Saffron centre node (hero space ≈ (320, 300)) to
    each pillar node; the control point lags the node (spring R12), so strings bend and wobble.
  - **Pull**: pointer-fine and touch: grab a pillar node (pointer capture), drag up to 160px, release → spring back;
    neighbours twitch (coupled springs, 0.2). Proximity lean: nodes within 160px of the pointer lean 8px toward it.
  - The five **logo** nodes never move relative to each other (0.2.6). The sticker as a whole may tilt ±3° with the
    pull (rotation of the whole sticker only).
  - N2 `homeNotes.hero.pull` = **"pull a node, it’s all connected"**: under the network, `arrow-loop` up to the
    process node; `show="pointer"`, order 1.
  - Bloom (M, `hero.ts`, after fonts or 600 ms): pillar nodes `scale 0 → 1` `back.out(2.2)` stagger 0.08 in pillar
    order, strings draw 0.5s `power2.inOut` just before each node; labels fade 0.2s. Marked `data-hero-hide` (v1 gate).
    The cluster and sticker are never hidden.
  - Mobile (< 768): the network sits below the actions, 300px tall, labels hidden, pull still works on touch
    (Lenis-prevented root).
- Foot row (mono 13, Graphite) with a dashed perforation rule: left `hero.footLeft`; right `hero.footRight` joined " · ".
- **Dock** (`dock.ts`, ≥ 1024, motion): as v1 6.5, the cluster svg flies from the sticker into the header
  `[data-dock-slot]` when the hero leaves (Flip, 0.64 s `power3.inOut`); the sticker disc and pillar layer shrink and
  fade (0.36 s). Undock reverses. It forces the header shown (7.2).
- LCP = the H1. Nothing in the H1 is hidden or moved at load.

**F2 · Industry marquee** (`IndustryMarquee.astro`; G `.g-ink`, 120px tall, full-bleed)
- `Marquee` of the nine industry names (`industries.ts`) in Saffron, separators = ringed dots in the 5 logo colours.
  `aria-hidden` (the real list is F8). Speed 60 px/s, reverses with scroll direction, skew ≤ 6°. Pausable.

**F3 · Proof band "Career facts"** (`ProofBand.astro`; G `.g-imperial .grain`, `has-notes`)
- Background: **Emulsion** (WebGL, `scripts/pages/home-emulsion.ts`, lazy via `whenNear`, ≥ 768 + motion + WebGL2 +
  `!saveData`): a full-bleed canvas, `aria-hidden`, `opacity .55`, of 7 metaball droplets in Sapphire, Violet,
  Orchid, Saffron, Mauve, Sky and Cobalt over Imperial, drifting (0.04 units/s), merging and splitting; pointer adds a
  repelling force (radius 0.25). Fragment shader ≤ 60 lines, DPR ≤ 1.5, renders only while on screen and not paused;
  ≤ 8KB gzip. Fallback (and first paint): a static inline SVG of three large soft discs (the logo discs, Lavender/Ice/
  Butter at 18%), drawn as radial gradients that fade to transparent (a soft edge without any runtime `filter: blur`).
- Left: a `Stamp` "From our founder’s career · From our founder’s career ·" (spin, pausable) around the node cluster
  (120px), plus the visible mono dateline `proofSource` ("From our founder’s career") (the stamp is decorative).
- Four stats (grid 4, 2×2 below 768): `.t-stat` Saffron numerals with R8 count-up (25, 5, 3; "WHO" fades), labels
  in mono Lavender, max 22ch. A thin Sky line with Saffron station nodes above the stats, drawn left → right
  (v1 proof line timing, 1.2 s) and each stat counts as the line passes it.
- N3 `homeNotes.proof.who` = **"yes, that WHO"** (Saffron, `arrow-curve` down to "WHO", rotate 5°), `show="md"`.
- Under the stats: **FlapBoard** (9) cycling `INDIA · WILMAR` → `INDONESIA · WILMAR` → `UKRAINE · −25 °C` →
  `TÜRKIYE` → `THE NETHERLANDS` (mono, Saffron tiles on Ink, 14 characters wide; strings composed from
  `founderResults[].dateline` + `hero.footRight`, listed in 11). Visually hidden text alternative (9).

**F4 · Positioning** (`Positioning.astro`; G `.g-white .paper-grid`, `has-notes`)
- Notebook tab `Our promise`.
- h2 `.t-display` "Deep expertise, shared ownership, measurable results." with **R9 scrubbed words**.
- Grid 5/7. Left: **Venn** (`homeNotes.positioning.venn`): labels **"plant floor"**, **"lab"**, **"boardroom"**,
  centre **"the same person"** (all words from the brief copy), Berry, 380px, drawn in sequence on enter.
  N4 `homeNotes.positioning.circle` = **"most consultants pick one circle"** (Orchid, `arrow-bounce` into the Venn),
  `show="md"`.
- Right: `positioning.promise` in `.t-lead` Ink, with `<Scribble kind="highlight">We build the answer with your
  people</Scribble>`; then `positioning.range` in `.t-body` (Instrument Sans, > 50 words) Graphite, max 60ch.

**F5 · What we do: the pillar rail** (`WhatWeDo.astro` (new) uses `Rail pin` + `PillarCard variant="rail"`; G `.g-white`)
- Rail item 0 (an intro panel, 420px): notebook tab `01 · What we do`; h2 `.t-h2` "Six ways we create value,
  together." (R1); `whatWeDo.intro` in `.t-lead`; N5 `homeNotes.whatWeDo.sideways` = **"keep scrolling, it moves
  sideways"** (Orchid, `arrow-straight` pointing right, `show="lg"`) / below 1024 N5m `homeNotes.whatWeDo.swipe` =
  **"swipe for all six"** (`show="all"` but hidden ≥ 1024).
- Items 1–6: the six `PillarCard` (rail) in pillar order, alternating rotation ±1° at rest (straighten on hover).
- Item 7: an Ink end card `<a href="/expertise">` "All expertise" (`microcopy.allExpertise`) in `.t-h2` White +
  Arrow, `data-cursor="open"`.
- M: R5 pinned sideways scrub at ≥ 1024; native snap rail below. K: focus mapping (R5); the end card is reachable.

**F6 · The KoKreaters way** (`MethodFold.astro`; G `.g-lavender`, `has-notes`)
- Notebook tab `02 · The KoKreaters way`. The h2 "Connect. Collaborate. Create." is rendered as **three giant
  stickers**: `<h2>` containing three `Sticker shape="pill"` spans ("Connect." G sapphire, rotate −5°; "Collaborate."
  G violet, rotate 3°; "Create." G saffron, rotate −2°) in `.t-display`, `decorative={false}`, laid out in a staggered diagonal; R4 drop
  in sequence. The h2's accessible text is exactly "Connect. Collaborate. Create.".
- `MethodLine` (hand-drawn dashed, scrubbed) runs under the stickers; three columns of step copy in `.t-lead` Ink,
  each under a "Step 1 · Connect" style mono label.
- N6 `homeNotes.method.connect` = **"listening comes first"** (Berry, under step 1, `arrow-curve` to its copy).
  N7 `homeNotes.method.create` = **"with proof that it works"** (Berry, under step 3), both `show="md"`.
- Hand pill "How we work" → /approach.

**F7 · Impact** (`ImpactFold.astro`; G `.g-white`, `has-notes`)
- Notebook tab `03 · Impact · From our founder’s career`; h2 "Results that started on the plant floor." (R1) with a
  `Sticker shape="burst" ground="saffron"` holding mono "From our founder’s career" at the h2's right (rotate 8°, R4).
- 2×2 grid (1 col < 768) of `ImpactCard`: india (border innovation), indonesia (capability), ukraine (process), tfa
  (quality); count-ups on 21 and 15 and −25.
- N8 `homeNotes.impact.cold` = **"yes, minus twenty-five"** (Orchid, `arrow-curve` to the −25 °C figure), `show="md"`.
- TextLink "See the impact" → /impact.

**F8 · Where we work** (`WhereWeWork.astro` + `GravityTags`; G `.g-blush`, `has-notes`)
- Notebook tab `04 · Where we work`; h2 "Where we work" (R1).
- **GravityTags** box (white, 2px Ink border, radius 28, 480px tall desktop / 420px mobile, `data-toy`,
  `data-cursor="throw"`): the nine industry links as pills (Bricolage 700/85% 20px, padding 14×22, grounds cycling
  `sapphire, saffron, violet, sky, orchid, mauve, ice, butter, lavender`), dropped from above when the box enters
  view (once), piling; drag and throw; double-click a pill = follow its link. Without the toy: flex-wrap list.
- N9 `homeNotes.industries.toss` = **"go on, toss one"** (Berry, `arrow-bounce` into the box), `show="pointer"`.

**F9 · Insights** (`InsightsFold.astro`; G `.g-white`, `has-notes`)
- Notebook tab `05 · Insights`; h2 "Ideas from the plant floor and the boardroom." (R1).
- `Rail` (not pinned) of `CoverStory variant="card"` for the newest visible entries (≤ 4), then up to three
  "In preparation" cards (dashed 2px border, mono label `microcopy.inPreparation`, title, unlinked).
- N10 `homeNotes.insights.fresh` = **"fresh from the notebook"** (Orchid, `arrow-curve` to the first card), `show="md"`.
- Newsletter strip (fold variant) with N11 `homeNotes.newsletter.quiet` = **"no noise, really"** (Orchid, `show="md"`).
- Production with no approved articles: h2 + In-preparation cards + Newsletter (v1 rule).

**F10 · Founder** (`FounderFold.astro`; G `.g-sapphire .grain`, `has-notes`, **padding-bottom 0** on the photo column)
- Notebook tab `06 · Founder` (White).
- Grid 6/6 (photo left). **Photo**: `FounderPhoto variant="cutout"`, height `clamp(440px, 72vh, 780px)`, **flush to
  the band's bottom edge** and to the left of the right column; behind it a Saffron disc (65% of photo height,
  centred on the head, R10 parallax 0.08) and two hand-drawn `node` doodles in White; Tape strip on the disc.
  `loading="lazy"`, `sizes="(min-width: 1024px) 40vw, 90vw"`. The right shoulder cut is hidden by the column gap:
  the photo's right edge is clipped by its own column (`overflow: clip` on the photo column).
- N12 `homeNotes.founder.him` = **"that’s Ganeaysh"** (Saffron, `arrow-loop` to the face), `show="md"`.
- Right: giant hand-drawn quote marks (Saffron `Doodle`), the quote in `.t-quote` White (one block, never split; R2
  fade only), `<Scribble kind="underline" tone="saffron">We create with you.</Scribble>`; attribution mono Ice;
  `Confirm 4`; ghost-on-dark hand pill "Meet Ganeaysh" → /about.
- Mobile: quote first, photo below at 420px tall, still flush-bottom.

**F11 · CtaField** (7.5) → Footer.

### 10.2 Expertise overview `/expertise` (P-expertise)
**F1 · Header** (G `.g-white .paper-grid`, `has-notes`): breadcrumbs; dateline "Expertise"; H1 `.t-display`
"Expertise that connects science, plants and strategy." with `<Scribble kind="swoosh">connects</Scribble>`;
intro `.t-lead` max 46ch. N1 `expertiseNotes.overview.together` = **"they’re designed to work together"** (Orchid,
`arrow-curve` down toward F2), `show="md"`.
**F2 · Hub** (`HubDiagram`; G `.g-ink`): the node cluster sticker at the centre; six pillar nodes on spokes as **real
links** (`<ul>` positioned), each a pillar-colour disc with the pillar short label (mono White) and, on hover/focus,
the full name + promise in a caption panel under the diagram (`aria-hidden` caption; the cards below carry the text).
Packets (Saffron dots) run along the spokes for 6 s after entering view and while hovered (pausable). N2
`expertiseNotes.hub.hover` = **"hover a pillar"** (Saffron, `show="pointer"`). Mobile: the hub shrinks to 340px; tap =
link.
**F3 · Six blocks** (G `.g-white`): 3×2 grid (2 cols at 768, 1 col < 768) of `PillarCard variant="grid"` with R4
sticker drops (stagger 0.09) and edge-light.
**F4 · Prompt row** (G `.g-butter`, `has-notes`): `.t-h2` "Not sure where you fit?" + primary pill "Start a
conversation"; N3 `expertiseNotes.prompt.anywhere` = **"start anywhere"** (Berry, `arrow-straight` to the pill).
**F5 · CtaField**.

### 10.3 Pillar template `/expertise/[slug]` (P-expertise; six pages)
**F1 · Pillar hero** (G `.g-{pillarGround} .grain`, full-bleed, `has-notes`): breadcrumbs (ground colours); dateline
"0{n} of 06 · Expertise" with PillarDot; eyebrow = pillar name in `.t-h4`; **H1** = pillar headline in `.t-display`
(`--fg` of the ground), cols 1–8; intro `.t-lead` `--fg`. Right cols 9–12: **PillarMap as a constellation**: the
current pillar as a 120px Sticker in its colour, the other five as ringed nodes with mono labels = the real
`<nav aria-label="Other expertise">` links (v1 structure kept), hand-drawn strings between them. N1
`expertiseNotes.pillar.here` = **"you are here"** (`--note`, `arrow-curve` to the big node), `show="md"`.
Mobile: the nav becomes a wrapped row of PillarTags.
**F2 · What we help with: the honest label** (G `.g-white .paper-grid`, `has-notes`): grid 5/7. Left: h2 "What we help
with" (`.t-h2`, sticky at ≥ 1024). Right: `SpecLabel` (`headingLevel='none'`, `inspect`, rotate −1°) with title
`expertiseNotes.label.title` = **"What’s inside"**, sub `expertiseNotes.label.sub` = **"Nothing hidden"**, rows =
`helpWith` items (k = "01"…"05", v = item verbatim, `<abbr>` expansions kept), foot `expertiseNotes.label.foot` =
**"Contents may vary with your plant."** **SpecInspector** (9) over it: a draggable 220×160 frame (Sapphire 2px,
corner ticks) that turns the area under it into a blueprint (Sapphire ground, White 1px grid, the label lines in
White) with `aria-hidden` mono measurement captions `expertiseNotes.inspector.items` = **"{n} items"** and
`expertiseNotes.inspector.fig` = **"fig. {n}"**; toggle button `expertiseNotes.inspector.open` = **"Inspect the
label"** / `.close` = **"Close the inspector"**. N2 `expertiseNotes.inspector.hint` = **"drag the frame over the
label"** (Orchid, `show="pointer"`).
**F3 · Typical deliverables** (G `.g-{pillarTintGround}`, `has-notes`): h2 "Typical deliverables"; `RunIn
variant="stickers"` (each deliverable a rotated pill sticker, R4 drop). N3 `expertiseNotes.deliverables.desk` =
**"what lands on your desk"** (`--note`, `show="md"`).
**F4 · From the record** (only with `impactId`; G `.g-white`): mono dateline "From our founder’s career" + one
`ImpactCard size="lg"` (border = this pillar) + TextLink "See the impact" → `/impact#{id}`.
**F5 · Related insights** (G `.g-cloud`): h2 "Related insights"; up to three `CoverStory variant="card"` or the
In-preparation cards; omitted if neither exists (v1 rule).
**F6 · Prompt row** as 10.2 F4 (same note string). **F7 · CtaField.**

### 10.4 Industries `/industries` (P-expertise)
**F1 · Header** (G `.g-white .paper-grid`, `has-notes`): breadcrumbs, dateline "Industries", H1 `.t-display` "Where we work",
`Confirm C-15`. N1 `expertiseNotes.industries.pick` = **"pick yours"** (Orchid, `arrow-bounce` down to the index).
**F2 · Body** (G `.g-white`): grid 3/9 at ≥ 1024. Left: sticky `SectorIndex` (mono 14, current sector gets a Saffron
`highlight` behind its label instead of the v1 bar; `aria-current` logic unchanged). Right: nine `SectorSection`:
mono `0{n}`, h2 sector name `.t-h2` with a `<Scribble kind="highlight">` in the **tint** of the first mapped pillar
(Ink text stays ≥ 13:1) wiped on enter; copy in `.t-lead`; "Relevant expertise" label + PillarTags (ground chips).
Each section separated by a dashed perforation rule. Sticker-drop the PillarTags.
**F3 · CtaField.**

### 10.5 Approach `/approach` (P-story)
**F1 · Header** (G `.g-white .paper-grid`, `has-notes`): dateline "Approach"; H1 `.t-display` "We create with you, not
for you." with `<Scribble kind="circle" tone="orchid">with you</Scribble>` (replaces the swoosh); intro `.t-lead`.
N1 `storyNotes.approach.idea` = **"the whole idea, really"** (Orchid, `arrow-curve` to the circle), `show="md"`.
**F2 · Three steps as stacking cards** (`MethodSteps.astro`): three full-width slabs, `min-height: 88svh` desktop,
`position: sticky; top: calc(var(--header-h-compact) + 16px)`: Connect G `.g-sapphire`, Collaborate G `.g-violet`,
Create G `.g-saffron`, each `.grain .slab`. Inside: mono "Step {n}"; the step name in `.t-mega` (it is an `<h2>`);
copy `.t-lead`; the `<dl>` (CONFIRM 10 staging / omitted production, v1 rule) as a `SpecLabel` on the slab
(`headingLevel='none'`, title = step name). Notes (all `--note`, `show="md"`): N2 `storyNotes.steps.connect` = **"we
listen first"**, N3 `storyNotes.steps.collaborate` = **"your people own it"**, N4 `storyNotes.steps.create` = **"then
we prove it works"**. M (≥ 1024, motion): as the next slab arrives, the previous scales to 0.94 and dims (`filter:
brightness(.8)`), scrubbed; a mono "1 / 3" counter in the top-right of each. Reduced / mobile: slabs stack normally
(no sticky below 768).
**F3 · The report** (`Crumple`; G `.g-butter`, `has-notes`): grid 6/6. Left: h2 `.t-h2` = `positioning.promise`'s
first sentence "We do not hand over a report and leave." (brief copy, reused verbatim) + the second sentence in
`.t-lead`. Right: a paper card (White, 2px Ink border, mono header `storyNotes.crumple.file` = **"FINAL_report_v7.pdf"**,
grey placeholder lines, `aria-hidden`) and the button `storyNotes.crumple.button` = **"Crumple it"**; pressing (or
pointer press-and-hold) crumples it into a ball (canvas mesh fold, 0.9 s) that drops and rolls off; the button
becomes `storyNotes.crumple.reset` = **"Smooth it out"**. N5 `storyNotes.crumple.after` = **"much better"** (Berry,
appears after the crumple; static state shows it with a hand `strike` across the card).
**F4 · Principles** (`Principles.astro`; G `.g-white`, `has-notes`): h2 "Principles"; five **index cards** in a loose
3+2 grid, grounds butter / lavender / blush / ice / white, rotations −2°, 1.5°, −1°, 2°, −1.5°, each with Tape; mono
"01"; name `.t-h3`; copy `.t-mono`. R4 drop, stagger 0.1. N6 `storyNotes.principles.rules` = **"the house rules"**
(Orchid, next to the h2, `arrow-curve` to card 1).
**F5 · Ways to work with us** (`EngagementTable.astro` → `FaqAccordion`; G `.g-ice`, `has-notes`): h2 "Ways to work
with us"; five `<details>` rows: summary = model in `.t-h3` + mono "Typical shape" preview; body = `<dl>` "Typical
shape" / "Good for" (labels `modelColumns`). The open row gets a pillar-colour left bar cycling the six. `Confirm 10`.
N7 `storyNotes.models.shape` = **"pick a shape"** (Sapphire, `show="md"`). (The v1 `<table>` is replaced; the column
labels survive as `<dt>`s.)
**F6 · CtaField.**

### 10.6 Impact `/impact` (P-story)
**F1 · Header** (G `.g-ink .grain`, `has-notes`): dateline "Impact"; H1 `.t-display` White "Results that started on the
plant floor."; lead Lavender; a spinning `Stamp` "From our founder’s career ·" (180px) around the node cluster,
right side (decorative; the label is also the F2 h2).
**F2 · The stack** (`CardSwap`; G `.g-white`, `has-notes`): grid 5/7. Left: h2 `.t-h2` "From our founder’s career" (`impactPage.partOne`)
and the "Next card" button (`storyNotes.stack.next` = **"Next card"**); the lead is already in F1. Right: the four `ImpactCard`s as a depth stack (offset 18px,
rotate ±3°, scale 0.94 per depth); fling (Draggable + Inertia, lazy) or press "Next card" to send the top card to the
back. Each card links to its case `#{id}`. N1 `storyNotes.stack.fling` = **"fling one"** (Orchid, `show="pointer"`).
Static: an `<ol>` of the four cards in a 2×2 grid.
**F3 · Four cases** (`CaseEntry.astro`): each `<article id={id}>` is a full-bleed chapter on its ground: india
`.g-sapphire`, indonesia `.g-sky`, ukraine `.g-imperial`, tfa `.g-orchid`, each `.grain`. Grid 7/5. Left: context as
mono dateline; h2 outcome `.t-h2`; the figure `.t-stat` (R8 count where numeric; ukraine adds the secondary "15%" at
0.5×); source line mono. Right: a `SpecLabel` (ground white, rotate 1°, `headingLevel='none'`, title = "From our
founder’s career") with rows "The challenge" / "What was done" / "The result" (labels `impactPage.labels`; null →
`Confirm C-9` in staging, row omitted in production); tags below (PillarTags + mono sector tags).
Ukraine: the −25 °C figure sits in a **FoggyWord** (9) panel: frosted glass over it, wipe to clear.
N2 `storyNotes.cold.wipe` = **"wipe the glass"** (Saffron, `show="pointer"`); N3 `storyNotes.cold.yes` = **"yes, minus
twenty-five"** (Saffron, shown when not pointer-fine: `.note--show-touch`, a kit modifier FOUNDATION adds:
`@media not ((hover:hover) and (pointer:fine))`).
**F4 · KoKreaters engagements** (G `.g-white`; staging only while all are pending): h2 "KoKreaters engagements" + a
rotated mono stamp "Anonymised"; each `EngagementRow` as a ticket-stub card (dashed perforation, `.t-h3` text) with the
hazard "Pending client consent" label. N4 `storyNotes.engagements.withheld` = **"names withheld, on purpose"** (Orchid).
Omitted in production when none is cleared (v1).
**F5 · Testimonials**: renders nothing (CONFIRM 8).  **F6 · CtaField.**

### 10.7 About `/about` (P-story; not `scripts/globe/*`)
**F1 · Hero** (`AboutHero.astro`): a split band. Left (G `.g-white`, cols 1–7): dateline "About"; H1 `.t-display`
"Built on 25 years of making ingredients work." with `<Scribble kind="underline" tone="orchid">25 years</Scribble>`;
intro `.t-lead`. Right: a **Lavender block** (G `.g-lavender .grain`) that bleeds to the right viewport edge and to the
band's bottom; the **cut-out** sits in it flush to the bottom and the right edge (its own cut edges land exactly on
the block edges), `height: min(82svh, 820px)`, `loading="eager" fetchpriority="high"` at ≥ 1024 (it may be the desktop
LCP; keep the AVIF ≤ 90KB at 960w), `lazy` below 1024. Behind him: a Saffron disc (head), the node-cluster
`Engraving` in Imperial 1.5px at 25%, two `node` doodles; **EdgeLight** on the block. N1 `storyNotes.about.hello` =
**"hello from the Netherlands"** (Berry, `arrow-loop` to the face), `show="md"`. Mobile: the block follows the text,
420px tall, photo flush-bottom-right.
**F2 · FlapBoard strip** (G `.g-ink`): the same five entries as home F3 (shared component, same strings).
**F3 · Long bio** (`LongBio.astro`; G `.g-white`, `has-notes`): grid 3/9; paragraph 1 in `.t-h3` Ink; the rest in
`.t-body` (Instrument Sans 19/31) max 64ch; `Confirm 13` after paragraph 1. The three `bioSidenotes` become margin
notes in the left column (MarginNote, Berry, `arrow-straight` toward their paragraph, `show="lg"`, **text = the
sidenote strings verbatim**, decorative because the same dates are in the paragraphs); below 1024 they render as
mono datelines above their paragraph (visible, not aria-hidden, as v1).
**F4 · Timeline** (`Timeline.astro`; G `.g-cloud`): four sticker tiles on a hand-drawn line (scrubbed draw at
≥ 768; vertical below): CFTRI Mysore `.g-butter`, Wilmar `.g-ice`, Cargill `.g-lavender`, KoKreaters `.g-saffron` (the
last holds the node cluster at 40px); label `.t-h3`, years mono `tnum`; R4 drop as the line reaches each. `Confirm 13`.
**F5 · The map** (`GlobeSection.astro`; G `.g-white .paper-grid`; globe mechanics unchanged, scene untouched):
dateline "The map"; h2 `.t-h2`; lead `.t-lead`; the places `<ol>` in mono two columns with ringed-node bullets. N2
`storyNotes.about.spin` = **"scroll to spin it"** (Orchid, `arrow-curve` to the globe, `show="lg"`, only when the globe
loaded: add `.has-globe` on the section from `about.ts` and gate the note on it).
**F6 · The name** (`NamePanel.astro`; G `.g-sapphire .grain`, `has-notes`): h2 "The name"; two giant stickers: "Ko"
(G saffron, `.t-mega`) with N3 `storyNotes.about.ko` = **"= together"** (Saffron, `show="all"`), and "Kreaters" (G
white, `.t-display`) with N4 `storyNotes.about.kreaters` = **"= the people who make things happen"** (Saffron).
(The stickers are `aria-hidden`; the real sentences `name.ko`, `name.kreaters`, `name.quote`, `name.tagline` follow as
`.t-lead` White paragraphs.) Then the full lockup: `Logo variant="full"` (the positive mark) on a White Sticker, 320px, `role="img"`,
alt `name.lockupAlt`, rotated −3°.
**F7 · Education and languages** (G `.g-white`, `has-notes`): h2 "Education and languages"; two `SpecLabel`s side by
side: title "Education" (rows = the four items, k = "01"…), title "Languages" (rows = the five). N5
`storyNotes.about.russian` = **"and a bit of Russian"** (Orchid, `arrow-curve` to "Russian (basic)"). Then
`workedWith` in `.t-lead` + `Confirm 5`.
**F8 · CtaField.**

### 10.8 Insights hub `/insights` (P-journal)
**F1 · Header** (G `.g-white .paper-grid`, `has-notes`): dateline "Insights"; H1 `.t-display` "Ideas from the plant
floor and the boardroom."; lead `.t-lead`. N1 `journalNotes.hub.fluff` = **"field notes, not fluff"** (Orchid,
`show="md"`).
**F2 · The fan** (`CardFan`; G `.g-lavender`, `has-notes`): the featured entry + up to four more visible entries as
`CoverStory variant="fan"` covers fanned from a bottom pivot (−12° … +12°); hover/focus lifts a card 40px and
straightens it; click opens. N2 `journalNotes.hub.lift` = **"press one to lift it"** (Berry, `show="pointer"`).
Static / mobile: a 1-column (2 at 768) list of covers.
**F3 · Filters** (`Filters.astro`; G `.g-white`; F3–F5 share one white band): two rows of pills (`aria-pressed`, keep v1 behaviour, hidden until
JS): mono 13 labels in 2px outline pills; the pressed pill gets a hand `circle` Scribble (static) and Ink fill.
**F4 · List** (`InsightList.astro`): `InsightRow`s (7.8). Flip filtering unchanged (6.7 v1).
**F5 · In preparation** (`ComingSoon.astro`): dashed cards with mono format + PillarDot, unlinked.
**F6 · Newsletter** (G `.g-butter`): fold variant + N3 `journalNotes.newsletter.quiet` = **"no noise, really"**
(the same words as home, under P-journal's own key). **F7 · CtaField.**

### 10.9 Article `/insights/[slug]` (P-journal; `ArticleLayout.astro`)
- **ProgressRule**: 4px Saffron bar under the header with a 10px ringed "bead" at its head; reduced = v1 "{n} min left".
- **ArticleHeader** (G `.g-{pillarTintGround}`, full-bleed, `has-notes`): DraftRibbon (staging); PillarTag link; H1
  `.t-display` (cols 2–11, max 18ch); standfirst `.t-standfirst`; byline `FounderPhoto variant="avatar" size={48}` +
  mono "Ganeaysh Kulkarni · {date or CONFIRM} · {n} min read". N1 `journalNotes.article.coffee` = **"grab a coffee"**
  (`--note`, `arrow-curve` to the reading time), `show="md"`.
- **Body** (`prose.css`, FOUNDATION restyles to): Instrument Sans `--fs-article`/1.65, max 66ch; h2 Bricolage 760/85%
  clamp(28→40) with 80px top margin and a small ringed node before it; h3 Bricolage 700 24/28; first-line lead-in in
  Plex Mono caps (replaces the v1 sans caps rule); lists with hand `tick` bullets (SVG background); links Sapphire
  underlined 1.5px offset .2em; `strong` 600; tables mono 14/20 with 1px Ink rules; `abbr` dotted.
- **Note.astro** (real sidenotes, content): Butter sticky-note card in the left margin at ≥ 1280 (Tape on top, rotate
  −1°), inline indented below. Not Caveat (they are content).
- **Exhibit**: a SpecLabel-style frame (2px Ink border, heavy rule under the title) with "Exhibit {n}" mono.
- **ProcessChain**: ringed nodes on a hand-drawn line (draw on enter); highlighted step = Saffron sticker node.
- **PullQuote**: `.t-pull` Imperial with Orchid hand quote marks; left 4px Orchid bar.
- **Takeaways**: `SpecLabel` title "Key takeaways" (`microcopy.keyTakeaways`), ground butter, rows = items with ticks;
  N2 `journalNotes.article.short` = **"the short version"** (Berry, `show="md"`).
- **AuthorBox**: `FounderPhoto avatar size={96}` on Saffron, `shortBio` in `.t-mono`, hand pill "Meet Ganeaysh".
- **Related**: three `CoverStory variant="card"`. **RouteRail**: mono links on a vertical dashed line with ringed
  beads; current bead fills Saffron. **CtaField.**

### 10.10 Contact `/contact` (P-journal; no CtaField)
**F1** (G `.g-white .paper-grid`, `has-notes`), grid 5/7.
- Left: dateline "Contact"; H1 `.t-display` "Let’s create something together." with `<Scribble kind="highlight">together</Scribble>`;
  intro `.t-lead`; `<address>` rows: mono label + `.t-lead` value (email, WhatsApp, LinkedIn, base). Then the
  **Ticket** (9): a boarding-pass card (G `.g-saffron`, radius 20, perforated stub on the right), title
  `journalNotes.ticket.title` = **"Boarding pass"**; fields (mono, `aria-hidden`): `journalNotes.ticket.passenger` =
  **"Passenger"** → the visitor's typed Name or `contact.visitorFallback` ("You"); `journalNotes.ticket.with` =
  **"With"** → "Ganeaysh Kulkarni"; `journalNotes.ticket.length` = **"Length"** → `journalNotes.ticket.minutes` =
  **"30 min"**; the real `<a class="btn">` "Book a 30-minute call" (→ `site.bookingUrl`, or focuses the form if it is
  `/contact#form`, v1 rule) lives in the stub. Tear (drag the stub or press the link): the stub rips off (0.6 s) then
  navigates. N1 `journalNotes.ticket.tear` = **"tear here"** (Berry, along the perforation, `show="pointer"`). `Confirm 9`.
- Right: `ConnectionMoment` (two nodes "You" ↔ Ganeaysh avatar on a hand-drawn line; draws on success, v1) above the
  form. **Form** restyle: labels Bricolage 600 16px; inputs 56px, 2px Ink border, radius 14, White; focus = 3px Cobalt
  outline + border Ink; errors Coral border + icon + text (v1). Submit = primary pill "Send". N2
  `journalNotes.form.detail` = **"the more detail, the better"** (Orchid, next to the Message label, `show="md"`).
  On success: **Confetti** (once) + N3 `journalNotes.form.soon` = **"talk soon"** (Orchid, appears beside the brief
  success message). The form itself never animates (v1).

### 10.11 Legal `/privacy`, `/cookies`, `/terms` (P-journal; `LegalLayout.astro`)
G `.g-white`; breadcrumbs; dateline `microcopy.legalDateline`; H1 `.t-display` at 0.8× (`--fs-h2` size is fine: it is
still the only h1); "Last updated" mono; the review banner as hazard tape; body in `prose.css` legal mode (Instrument
Sans 17/28, h2 Bricolage 700 28/32). N1 `journalNotes.legal.print` = **"the small print, in normal-size print"**
(Orchid, next to the H1, `show="md"`). No CtaField.

### 10.12 404 (P-journal; `pages/404.astro`, noindex)
G `.g-white .paper-grid`, `min-height: calc(100svh − ann − header)`, `has-notes`. H1 `.t-display` "This page hasn’t
been created yet." (static, real text, centred left-aligned block); "Let’s connect you back." `.t-lead`; primary pill
"Take me home" → `/`. Below: **FallingText** pit (9): 520×300 box (2px Ink border, radius 28) where the six H1 words
plus a ringed node tile fall as colour tiles (grounds cycling the six pillars) and pile; drag/throw (`data-cursor="throw"`).
N1 `journalNotes.notfound.mess` = **"go on, make a mess"** (Orchid, `arrow-bounce` into the pit, `show="pointer"`).
The v1 `Reconnect` toy is retired (delete `components/notfound/Reconnect.astro` and its code in `notfound.ts`).

### 10.13 Cookie settings dialog (FOUNDATION, chrome)
The `<dialog>` becomes a SpecLabel-styled panel (2px Ink border, heavy rules, mono rows "Essential: always on" /
"Analytics: not in use on this site"), close = secondary pill. Behaviour unchanged.

---

## 11. New copy register (`src/data/notes/*.ts` → `research/v2-new-copy.md`)

### 11.1 Where the strings live
Five dependency-free files (no imports), one per owner, created by FOUNDATION with **every string below** and then owned
by their unit: `src/data/notes/chrome.ts` (FOUNDATION), `home.ts` (P-home), `expertise.ts` (P-expertise), `story.ts`
(P-story), `journal.ts` (P-journal). Each exports one `as const` object (`chromeNotes`, `homeNotes`, `expertiseNotes`,
`storyNotes`, `journalNotes`). **Strict line format** (the generator parses it): one string per line,
`  key: 'text', // ROUTE · where · TYPE` with `TYPE` ∈ `NOTE` (decorative Caveat), `UI` (a real control label, read by
AT), `PROP` (text inside a decorative toy), `DERIVED` (a display form of a brief fact). Nested objects open with
`  group: {` and close with `  },` on their own lines.
`scripts/notes-copy.mjs` (FOUNDATION) reads the five files and writes `research/v2-new-copy.md`: a table per route
with key, text, type, placement, and a "Ganeaysh: ok / change to" column. Any unit that adds or changes a string
re-runs `node scripts/notes-copy.mjs` (deterministic, so concurrent runs agree).

### 11.2 The strings (all new; none adds a factual claim)
| Key | Text | Type | Where |
|---|---|---|---|
| chromeNotes.ann.lead | Field notes from the plant floor and the boardroom. | UI (brief newsletter words) | announcement bar |
| chromeNotes.ann.link | Read the insights | UI | announcement bar |
| chromeNotes.motion.pause / .play | Pause motion / Play motion | UI | announcement bar |
| chromeNotes.menu | or just say hello | NOTE | mobile menu |
| chromeNotes.cta | we’re all ears | NOTE | CTA field |
| chromeNotes.footer | thanks for reading all the way down | NOTE | footer |
| chromeNotes.top | Back to top | UI | footer |
| chromeNotes.rail.prev / .next / .count | Previous / Next / {i} / {n} | UI | rails |
| chromeNotes.cursor.* | drag · throw · wipe · press · open · pull | PROP | cursor follower |
| homeNotes.hero.shared | that’s you + us | NOTE | home F1 |
| homeNotes.hero.pull | pull a node, it’s all connected | NOTE | home F1 |
| homeNotes.proof.who | yes, that WHO | NOTE | home F3 |
| homeNotes.proof.flap | INDIA · WILMAR / INDONESIA · WILMAR / UKRAINE · −25 °C / TÜRKIYE / THE NETHERLANDS | DERIVED | home F3 (About F2 uses its own `storyNotes.about.flap`, same words) |
| homeNotes.positioning.venn | plant floor · lab · boardroom · the same person | NOTE (brief words) | home F4 |
| homeNotes.positioning.circle | most consultants pick one circle | NOTE (restates the brief's "range" sentence) | home F4 |
| homeNotes.whatWeDo.sideways | keep scrolling, it moves sideways | NOTE | home F5 ≥ 1024 |
| homeNotes.whatWeDo.swipe | swipe for all six | NOTE | home F5 < 1024 |
| homeNotes.method.connect | listening comes first | NOTE (brief: "We listen first") | home F6 |
| homeNotes.method.create | with proof that it works | NOTE (brief: "measures to prove it works") | home F6 |
| homeNotes.impact.cold | yes, minus twenty-five | NOTE | home F7 |
| homeNotes.impact.indiaFigure | 1st | DERIVED (brief: "India’s first …") | ImpactCard figure (passed as prop from P-home; the same string is duplicated as `storyNotes.impact.indiaFigure` and `expertiseNotes.record.indiaFigure`) |
| homeNotes.industries.toss | go on, toss one | NOTE | home F8 |
| homeNotes.insights.fresh | fresh from the notebook | NOTE | home F9 |
| homeNotes.newsletter.quiet | no noise, really | NOTE (brief: "No noise.") | home F9 |
| homeNotes.founder.him | that’s Ganeaysh | NOTE | home F10 |
| expertiseNotes.overview.together | they’re designed to work together | NOTE (brief) | /expertise F1 |
| expertiseNotes.hub.hover | hover a pillar | NOTE | /expertise F2 |
| expertiseNotes.prompt.anywhere | start anywhere | NOTE | /expertise F4, pillar F6 |
| expertiseNotes.pillar.here | you are here | NOTE | pillar F1 |
| expertiseNotes.label.title / .sub / .foot | What’s inside / Nothing hidden / Contents may vary with your plant. | UI | pillar F2 SpecLabel |
| expertiseNotes.inspector.open / .close | Inspect the label / Close the inspector | UI | pillar F2 |
| expertiseNotes.inspector.hint | drag the frame over the label | NOTE | pillar F2 |
| expertiseNotes.inspector.items / .fig | {n} items / fig. {n} | PROP | pillar F2 blueprint |
| expertiseNotes.deliverables.desk | what lands on your desk | NOTE | pillar F3 |
| expertiseNotes.card.more | +{n} more | UI | PillarCard grid (passed as prop) |
| expertiseNotes.industries.pick | pick yours | NOTE | /industries F1 |
| storyNotes.approach.idea | the whole idea, really | NOTE | /approach F1 |
| storyNotes.steps.connect / .collaborate / .create | we listen first / your people own it / then we prove it works | NOTE (brief step copy, paraphrased) | /approach F2 |
| storyNotes.crumple.file | FINAL_report_v7.pdf | PROP | /approach F3 |
| storyNotes.crumple.button / .reset | Crumple it / Smooth it out | UI | /approach F3 |
| storyNotes.crumple.after | much better | NOTE | /approach F3 |
| storyNotes.principles.rules | the house rules | NOTE | /approach F4 |
| storyNotes.models.shape | pick a shape | NOTE | /approach F5 |
| storyNotes.stack.fling | fling one | NOTE | /impact F2 |
| storyNotes.stack.next | Next card | UI | /impact F2 |
| storyNotes.cold.wipe / .yes | wipe the glass / yes, minus twenty-five | NOTE | /impact F3 |
| storyNotes.engagements.withheld | names withheld, on purpose | NOTE (brief: "Anonymised") | /impact F4 |
| storyNotes.about.hello | hello from the Netherlands | NOTE (brief: based in the Netherlands) | /about F1 |
| storyNotes.about.flap | (same five entries as home) | DERIVED | /about F2 |
| storyNotes.about.spin | scroll to spin it | NOTE | /about F5 |
| storyNotes.about.ko / .kreaters | = together / = the people who make things happen | NOTE (brief name copy) | /about F6 |
| storyNotes.about.russian | and a bit of Russian | NOTE (brief: basic Russian) | /about F7 |
| journalNotes.hub.fluff | field notes, not fluff | NOTE | /insights F1 |
| journalNotes.hub.lift | press one to lift it | NOTE | /insights F2 |
| journalNotes.newsletter.quiet | no noise, really | NOTE | /insights F6 |
| journalNotes.article.coffee | grab a coffee | NOTE | article header |
| journalNotes.article.short | the short version | NOTE | article takeaways |
| journalNotes.ticket.title / .passenger / .with / .length / .minutes | Boarding pass / Passenger / With / Length / 30 min | PROP (from "Book a 30-minute call") | /contact ticket |
| journalNotes.ticket.tear | tear here | NOTE | /contact ticket |
| journalNotes.form.detail | the more detail, the better | NOTE | /contact form |
| journalNotes.form.soon | talk soon | NOTE | /contact success |
| journalNotes.legal.print | the small print, in normal-size print | NOTE | legal pages |
| journalNotes.notfound.mess | go on, make a mess | NOTE | 404 |
FlapBoard (FOUNDATION) takes its entries as a prop: P-home passes `homeNotes.proof.flap`, P-story passes
`storyNotes.about.flap` (identical words). The same applies to `indiaFigure`. No unit imports another unit's notes file.

---

## 12. Build split

### 12.1 Order
**Wave A: FOUNDATION** (1 unit) must finish and pass its gate before **Wave B: P-home, P-expertise, P-story, P-journal**
(4 units in parallel, disjoint files). Page units build against the APIs in sections 3–9 exactly as written; if an API
is missing or wrong, a page unit does **not** edit FOUNDATION files: it works around locally inside its own files and
reports the gap in its return summary.

### 12.2 FOUNDATION (1 unit) — owns
- **Config and scripts**: `package.json` (+ `@fontsource-variable/bricolage-grotesque@5.3.0`, `@fontsource/ibm-plex-mono@5.3.0`,
  `@fontsource/caveat@5.3.0`; − `@fontsource-variable/fraunces`), `package-lock.json`, `astro.config.mjs` (only if needed),
  `scripts/copy-fonts.mjs`, `scripts/prepare-brand.mjs`, `scripts/og.mjs`, `scripts/og/template.html`,
  `scripts/check-budget.mjs` (fonts gate 240KB + the old-asset grep), `scripts/contrast-check.mjs` (new, wired into
  `npm run verify`), `scripts/notes-copy.mjs` (new), `scripts/csp-hash.mjs` (only if needed), `public/*` (fonts,
  favicons, brand, og, `_headers` via csp-hash), `web/THIRD_PARTY_NOTICES.md` (create: MIT text + one section per unit:
  `## FOUNDATION`, `## P-home`, `## P-expertise`, `## P-story`, `## P-journal`; each unit appends rows only under its own heading).
- **Styles**: all of `src/styles/*` (fonts, tokens, new grounds.css, reset, base, layout, utilities, prose, motion, global).
- **Assets**: `src/assets/brand/**` (SVGs in, PNGs out), `src/assets/photos/**` (cutout + square in, old crops out),
  `src/assets/fx/grain.png`.
- **Components**: `src/components/notes/*` (kit), `src/components/ui/*`, `src/components/chrome/*` (+ AnnouncementBar,
  MotionToggle), `src/components/brand/*` (+ FounderPhoto; RisingArrow re-implemented as a Scribble swoosh wrapper so
  old imports keep working), `src/components/shared/*` (+ PillarCard, ImpactCard, Marquee, Rail), `src/components/seo/*`,
  `src/components/bencho/{TextRise,MagneticDots,EdgeLight,FlapBoard}.astro`.
- **Scripts**: `src/scripts/motion/*` (+ notes, magnetic, marquee, rail, scrub-words, parallax, cursor, pause, lazy),
  `src/scripts/chrome.ts`, `src/scripts/consent.ts`, `src/scripts/bencho/{text-rise,sweep-button,magnetic-dots,edge-light,flap-board,physics}.ts`.
- **Layout, lib, data**: `src/layouts/BaseLayout.astro`, `src/lib/*` (+ `pillarGround`, `pillarTintGround`),
  `src/data/microcopy.ts`, `src/data/nav.ts`, `src/data/types.ts` (+ `GroundKey`), `src/data/seo.ts`, `src/config/site.ts`,
  and the **seed** of all five `src/data/notes/*.ts` files (then it keeps only `chrome.ts`).
- **Tests**: `web/tests/*` (update only what the redesign legitimately changes; keep every a11y/perf assertion; add a
  test that every page renders `.ann` and that `[data-motion-toggle]` toggles `html.motion-paused`).
- **research/v2-new-copy.md** (generated).
- **Keeps v1 pages compiling**: after its restyle the v1 pages must still build and pass tests (they will look half-v2
  until Wave B); fix any page markup that breaks the build with the *minimum* edit (e.g. a removed import) and list it.
- **Acceptance (FOUNDATION)**: `npm run build`, `npm run check`, `npm run verify` (budgets, contrast, old-asset grep)
  green; `npx playwright test` green; header logo crisp at 2x (screenshot at DPR 2, Read it); favicons and OG
  regenerated and checked visually; a **kit gallery page is NOT shipped**, but FOUNDATION screenshots each kit
  component in a scratch test page under the scratchpad (not in `src/pages`) to prove it renders, then removes it.

### 12.3 PAGES (4 units, disjoint files)
| Unit | Owns (only these) | Bencho | Notes file |
|---|---|---|---|
| **P-home** | `src/pages/index.astro`; `src/components/home/*` (+ `IndustryMarquee.astro`, `WhatWeDo.astro`); `src/scripts/pages/home.ts`, `hero.ts`, `dock.ts`, `home-emulsion.ts` (new; matches `home*`); `src/data/home.ts` (copy unchanged) | `bencho/MagneticLetters.astro`, `GravityTags.astro`; `scripts/bencho/magnetic-letters.ts`, `gravity-tags.ts` | `src/data/notes/home.ts` |
| **P-expertise** | `src/pages/expertise/index.astro`, `src/pages/expertise/[slug].astro`, `src/pages/industries.astro`; `src/components/expertise/*`, `src/components/industries/*`; `src/scripts/pages/expertise.ts`, `industries.ts`; `src/data/pillars.ts`, `src/data/industries.ts` (copy unchanged) | `HubDiagram`, `SpecInspector` (+ scripts) | `src/data/notes/expertise.ts` |
| **P-story** | `src/pages/approach.astro`, `impact.astro`, `about.astro`; `src/components/approach/*`, `impact/*`, `about/*`; `src/scripts/pages/approach.ts`, `impact.ts`, `about.ts` (**not** `src/scripts/globe/*`); `src/data/approach.ts`, `impact.ts`, `founder.ts`, `places.ts` (copy unchanged) | `Crumple`, `FaqAccordion`, `FoggyWord`, `CardSwap` (+ scripts) | `src/data/notes/story.ts` |
| **P-journal** | `src/pages/insights/index.astro`, `insights/[slug].astro`, `contact.astro`, `404.astro`, `privacy.mdx`, `cookies.mdx`, `terms.mdx`; `src/layouts/ArticleLayout.astro`, `LegalLayout.astro`; `src/components/insights/*`, `article/*`, `contact/*`, `notfound/*`; `src/scripts/pages/insights.ts`, `article.ts`, `contact.ts`, `notfound.ts`; `src/data/contact.ts`; `src/content/insights/*` (frontmatter only if a component needs it; body copy unchanged) | `CardFan`, `Ticket`, `Confetti`, `FallingText` (+ scripts; FallingText uses FOUNDATION `physics.ts`) | `src/data/notes/journal.ts` |
- P-story must drop the v1 `import { initMethodLine } from './home'` in `approach.ts` (approach no longer uses the
  method line; no cross-unit imports between page scripts).
- Each page unit appends its bencho rows under its own heading in `web/THIRD_PARTY_NOTICES.md` (the one shared file;
  append-only, own section only).
- Page units do **not** edit `tests/*`; if an expectation must change for a legitimate design reason, say which and
  why in the return summary.

### 12.4 Every unit's working rules
- Write files with Bash heredocs. Never `git push` (commit only if the orchestrator asks).
- Dev/preview servers on a unique port, killed by PID only: FOUNDATION 4601/4602, P-home 4611/4612,
  P-expertise 4621/4622, P-story 4631/4632, P-journal 4641/4642 (`astro dev --port N`, `astro preview --port N+1`).
- Facts: copy only from `src/data/*`/`src/content/*`; new words only through the unit's notes file (11).
- Before returning: `npm run build` + `npm run check` + `npm run verify` green; run the Playwright specs for the
  unit's routes (`npx playwright test --grep "<route>"`); screenshots of every owned route at 1440 and 390, plus
  `-reduced` and `-nojs` variants, saved to `research/shots/v2/<unit>-<route>-<width>[-variant].png`, each one
  **looked at** with the Read tool (fix overlaps, clipped text, notes covering copy, cut-out shoulders showing).
- Lighthouse mobile (lhci or `npx lighthouse` against `astro preview` on the unit's port): P-home `/` ≥ 95; the others
  ≥ 90 on their heaviest route (`/expertise/process-design`, `/about`, `/insights/3-mcpd-glycidyl-esters-playbook`).
- Return a short summary: files changed, deviations from this spec and why, test/Lighthouse numbers, open gaps.

### 12.5 Definition of done (whole site)
1. Every route renders the v2 treatment in section 10 with its exact note words, at 1440 and 390, no horizontal scroll.
2. No raster logo or old founder crop anywhere (`npm run verify` grep).
3. axe: zero violations on every route at 1440 and 390 after scroll-through; keyboard path to every interactive toy
   or its alternative; focus visible on every ground.
4. Reduced motion and JS-off: all content visible, no pins, no loops, notes drawn.
5. Lighthouse mobile ≥ 90 everywhere audited, home ≥ 95; CLS ≤ 0.1; LCP ≤ 2.5 s.
6. `research/v2-new-copy.md` lists every new string; `web/THIRD_PARTY_NOTICES.md` lists every ported bencho block.
