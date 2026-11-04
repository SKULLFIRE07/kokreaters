# KoKreaters design DNA, v1 (4 Nov 2026)

Sources: BRIEF.txt sections 2-4 (the source of truth), DESIGN-DIRECTION.md, the four reference dossiers (ref-mckinsey, ref-google, ref-unilever, ref-premium-consultancy) and the screenshots in research/shots/.
Evidence levels: **[M]** measured from a live render or computed style in the dossiers, **[K]** prior knowledge (McKinsey only, because of the Akamai bot wall, which was not bypassed), **[C]** calculated here (contrast ratios, font file sizes fetched from jsDelivr today).
This file decides. Where it departs from the brief, the line says **DEVIATION** and gives the reason. Those lines need the owner's OK.

---

## 1. What the owner is pointing at, in one sentence

**One serif voice, set large and light, on a pale ground with a lot of empty space. One ink colour, one accent used only on things you can press, and very little motion, so that the three or four moments that do move get noticed.** Every reference that feels expensive does this. Every one that feels cheap breaks it.

### 1.1 The shared DNA, trait by trait, with per-site evidence

| # | Trait | McKinsey [K] | Google about/design [M] | Unilever [M] | Brunswick [M] | IDEO [M] | Givaudan [M] (counter-example) |
|---|---|---|---|---|---|---|---|
| 1 | **Few words above the fold** | 25-40 | 30 / 20 | ~30 | **18** | **4** | ~122 (mostly menu) |
| 2 | **Large, light display type** | Bower 56-64, lh 1.1 | 60/72 **wt 400**, -0.5px | 66 Bold, lh 1.09 | Petit Serif **72/82.8 wt 500** | FH Oscar **80/78 wt 300** | 48 wt 500 on video |
| 3 | **Body or lead text that carries the story is 18-28px** | 18-20 / 1.6 | 18/27 | 18 / 1.55, lead 22 | lead ~28 / 1.2 | 20 | **14/21** (feels like a portal) |
| 4 | **One ink plus one ground** | Deep blue on white | #202124 on white/#f8f9fa | Night on Sky (too much) | Navy #0B0384 on cream #F6F6EF (96/4) | Ink #151F27 + lime | No system |
| 5 | **Accent under 5% and only on actions** | <3% blue | ~1% (one pill + nav underline) | n/a, saturated | ~4% | ~5% lime | Every module has its own colour |
| 6 | **Bands and hairlines, not boxes and shadows** | flat cards, one dark band | white / #f8f9fa bands, 1px #dadce0 | full-bleed panels | 1px full-bleed hairlines between accordion rows | 1px borders, radius 0 | three white boxes on grey, twice |
| 7 | **Generous vertical rhythm** | 96-128 between sections | 72-96 bands, ~108 above hero media | tight (fails) | **~230 nav to H1** | 36 gutters | cramped |
| 8 | **Quiet motion** | fades, 1.03 hover zoom | **150-200ms** transitions, no scroll choreography | 200ms UI, 300-450ms reveals, one 1s line draw | one 1s opacity + 23px reveal | hover only | GSAP on pinned video and carousels |
| 9 | **Ideas or outcomes lead, not service lists** | homepage is a publication | one statement per band | purpose paragraph ~50 words | services as 64px rows, no cards | case study = document | news slider |
| 10 | **No WebGL** | none | none (design.google: GSAP, no Three) | none (static aurora bitmap) | none | static SVG network overlay | none |

Two conclusions follow from row 10 and row 8.
- None of the premium references uses WebGL, so **one** slow, well-made Three.js scene will be distinctive. That only holds if everything around it stays still.
- The calm baseline is what makes these sites feel expensive. Our signature motion sits on top of that baseline. It never replaces it.

### 1.2 What separates "premium" from "template" (the measured difference)
1. **Size contrast beats weight contrast.** Google sets every heading at weight 400; IDEO's display is 300; Brunswick's is 500. Hierarchy comes from a 4:1 ratio between display and body (72 vs 18), not from bold.
2. **One layout repeated beats eight layouts.** about.google uses the same text-left / media-right split three times. A reader learns the page once.
3. **Lists and rows beat card grids.** Brunswick's /our-work/ is 8 rows of 64px type separated by hairlines, with no cards. The cheapest-looking moment in the whole set is Givaudan's three identical white cards on a grey band.
4. **Proof carries a source line.** IDEO's "99%" has its study linked underneath. Unilever's stat cards carry a 12px footnote.

---

## 2. Anti-patterns (banned on KoKreaters)

Owner bans, plus what the references showed going wrong.

1. **Gradient-blob soup.** No aurora glows (Unilever), no mesh gradients, no blurred colour fields. The logo's three soft discs are the only soft shapes, they are flat and translucent, and no page has more than 3. **DEVIATION:** the brief's Aurora gradient CTA band and Twilight hero gradient are dropped from UI surfaces (see 5.3).
2. **Generic three-card or four-card rows.** At most one card grid per page. The six pillars become an index of rows, not the wireframe's 3x2 card grid. The four impact results become editorial rows, not four equal cards. Insights on home are 1 lead plus 2 stacked (7/5 columns).
3. **Emoji or clip-art icons, people cartoons, 3D blobs, isometric illustration.** The node motif is the only illustration language.
4. **Stock clichés.** No handshakes, no people pointing at screens, no suits laughing, no AI-generated food or faces.
5. **Content hidden until JS runs.** design.google renders an empty page headless and Brunswick's mobile capture came back blank [M]. Here, content is visible in CSS by default. `.js .reveal` hides it only when JS has loaded and motion is allowed, with a 600ms safety timer. **The H1 and the LCP element are never hidden.**
6. **Hero video, hero carousel.** Brunswick ships a 42.2MB MP4 and Givaudan a 7MB webm with slider dots [M]. Here there is no hero video and no carousel.
7. **Body text under 16px** (Givaudan 14/21). Meta text is 14px at the smallest. Body is 16px minimum on mobile and 17px on desktop.
8. **Hamburger-only desktop nav** (design.google, IDEO), **mega-menus** (McKinsey 30+ links), **pill-filled nav bars** (Unilever).
9. **Theme swapping on scroll** (design.google). Dark bands are fixed.
10. **Bold 800 grotesque display** (design.google), **all-caps serif H1** (Brunswick), **Didone-style hairlines at small sizes** (McKinsey). Headlines are in sentence case.
11. **Template motion clichés.** No magnetic buttons, custom cursor, marquee ticker, text scramble, tilt-on-hover cards, horizontal-scroll card rail, parallax on text, elastic, back or bounce eases, or scroll-snap.
12. **Third-party bloat.** No accessibility overlay (UserWay), no chat bubble, no icon font (Givaudan's Material Symbols is 274KB), no .otf fonts (IDEO), no Google Fonts CDN.
13. **Colour as the only signal.** Pillar names are always written out next to their colour.
14. **Logo walls or former-employer marks.** Proof is "from our founder's career", using only the facts in the brief.
15. **Jargon.** Never "unlock", "next normal", "world-class", "cutting-edge" or "synergy". Copy is plain British English.

---

## 3. Type system

### 3.1 Families (decision)

| Role | Family | Package / file | Weight (Latin woff2) [C] |
|---|---|---|---|
| Display, headlines, stats, pull quotes | **Fraunces Variable** (opsz 9-144, wght 100-900), roman | `@fontsource-variable/fraunces` / `fraunces-latin-opsz-normal.woff2` | **67.3KB** |
| Pull-quote italic (Insights and About only, not loaded on home) | Fraunces Variable italic | `fraunces-latin-opsz-italic.woff2` | lazy |
| Body, UI, labels, numbers in tables | **Instrument Sans Variable** (wght 400-700) | `@fontsource-variable/instrument-sans` / `instrument-sans-latin-wght-normal.woff2` | **30.1KB** |

The home page loads 97KB of fonts, under the 120KB budget. Preload only the Fraunces file. The sans uses `font-display: swap` with a metric-matched fallback: `size-adjust` on Arial for the sans and on Georgia for the serif, to keep CLS near 0.

**Keep Fraunces, but tame it.** The opsz file pins SOFT=0 and WONK=0, so its alternates never appear. Use `font-optical-sizing: auto` so headlines draw at a high optical size and quotes at a medium one, from a single file. Set display at weight 330 and keep it there: at weight 300 and opsz 144 the hairlines go Bodoni-thin, which is the McKinsey look we want to avoid. Never set Fraunces below 22px.

**DEVIATION: Plus Jakarta Sans is replaced by Instrument Sans.** Reasons:
1. **Associations.** Plus Jakarta Sans is the default sans of a large share of current Framer and SaaS templates. Its wide geometric "o" and round "a" are exactly the "AI-made startup" texture the owner wants to avoid.
2. **Pairing.** Instrument Sans is a tighter neo-grotesk with small humanist details. It sits under Fraunces' soft serifs the way Hellix sits under Petit Serif at Brunswick and McKinsey Sans sits under Bower: a neutral worker under an expressive display face.
3. **Practical details.** Instrument Sans has tabular figures for stats and tables, is OFL, and is about 10% narrower than Plus Jakarta Sans, so the same measure fits more words.

The logo's rounded letters do not need to be echoed in the text face, because the logo already carries that roundness. If the client insists on the brief's face, Plus Jakarta Sans (27.3KB) drops into the same scale with tracking +0.005em on body text. No other part of this system changes.

### 3.2 Scale

The display-to-body ratio is about 4.4:1 on desktop and 2.75:1 on mobile. Use one display size per page. Use fluid `clamp()` between 390px and 1440px viewports.

| Token | Family / wght | Desktop size / lh | Mobile size / lh | Tracking | Notes |
|---|---|---|---|---|---|
| display | Fraunces 330 | **76 / 80** (1.05) | **44 / 48** | -0.025em / -0.018em | Home hero only. `clamp(2.75rem, 1.6rem + 4.7vw, 4.75rem)` |
| h1 | Fraunces 360 | 56 / 60 | 38 / 42 | -0.02em / -0.015em | Page titles, case-study outcome |
| h2 | Fraunces 380 | 40 / 46 | 30 / 36 | -0.015em | Section titles |
| h3 | Fraunces 420 | 26 / 32 | 22 / 28 | -0.01em | Pillar row names (index uses h2 size), insight titles. **DEVIATION:** the brief sets h3 in sans 600; the serif reads more editorial at this size |
| h4 | Instrument Sans 600 | 18 / 26 | 17 / 24 | 0 | Small headings, exhibit titles 20/28 |
| lead | Instrument Sans 400 | 21 / 33 | 18 / 28 | -0.005em | Max 34em (about 60 characters) |
| body | Instrument Sans 400 | 17 / 28 | 16 / 26 | 0 | Article body 18 / 30 |
| small / meta | Instrument Sans 500 | 14 / 22 | 14 / 22 | +0.005em | Captions, dates, sources |
| overline | Instrument Sans 600, caps | 12.5 / 16 | 12 / 16 | **+0.14em** | The only uppercase text. Mauve (see 5.2) |
| stat | Fraunces 300, `lnum tnum` | 72 / 72 | 48 / 48 | -0.03em | Saffron on Imperial only |
| quote | Fraunces italic 360 | 34 / 44 | 26 / 34 | -0.01em | Imperial, with a Saffron opening mark |
| button | Instrument Sans 600 | 16 / 1 | 16 / 1 | +0.005em | |
| nav | Instrument Sans 500 | 15 / 1 | 18 / 1 (menu panel) | +0.005em | |

### 3.3 Measure and setting
- Body: `max-width: 66ch` (about 680px at 17-18px). Lead: 34em. Display H1: about 12-14 words over 2 lines at 1440px (the hero headline breaks after "expertise").
- Use `text-wrap: balance` on h1-h3 and `text-wrap: pretty` on paragraphs. Use `hanging-punctuation: first` where it is supported, and hang the opening quote marks.
- Use real typographic quotes and apostrophes, en dashes for ranges, `−` for minus (−25 °C), and a thin no-break space before °C and %.
- Paragraphs are at most about 90 words. Long reads have an exhibit, quote or subhead at least every 350-400 words.
- No text is ever justified.

---

## 4. Space and grid

- **Grid:** 12 columns, content max 1240px (brief), gutter 24px desktop, 16px mobile. Side margin is `clamp(16px, 5vw, 72px)`.
- **Breakpoints (brief):** 360 / 768 / 1024 / 1280 / 1440.
- **Spacing scale (8pt, brief):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, plus **192** for hero headroom.
- **Section padding:** 128px desktop, 96px tablet, 64px mobile. Each band holds one idea.
- **Hero headroom:** about 200px from the top of the viewport to the overline at 1440x900 (Brunswick puts ~230px above its H1 [M]). The fold holds overline + H1 + sub + two buttons, **≤ 45 words**. On mobile the H1 starts above y≈300 and the media goes below the text (Unilever pushed its H1 to y≈530 [M]).
- **Asymmetry:** splits are 7/5 or 5/7, never 6/6, except in the method. Text columns start on column 1 or 2. Media is allowed to bleed past the content edge on one side only.
- **Layouts per page:** the home page uses at most 3 distinct layouts: the text + media split, the index rows and the full-bleed band. Repeat them; do not invent new ones.
- **Radii (brief):** 16px on images and surfaces, 10px on inputs, pill (999px) on buttons and chips. Section panels get one 56px **signature corner** (bottom-right only, done with a CSS mask), borrowed as a principle from Unilever [M] and sized to the node ring.
- **Elevation:** none at rest. Use 1px Hairline `#E4E0EE` rules. The only shadow is on the Expertise menu panel and the mobile menu: `0 12px 32px rgba(58,28,92,.10)`. **DEVIATION:** the brief puts a soft shadow on cards; we drop it, because flat surfaces read as more premium (Google, McKinsey, IDEO).
- **Header:** 72px tall, shrinking to 60px after 80px of scroll. White at 85% with a blur, plus a hairline after `scrollY > 8`. Six text links at 15px/500 plus one pill. The active item gets a 2px Sapphire bar as wide as its label (about.google [M]).

---

## 5. Colour (brief palette only)

### 5.1 Roles (decision)
| Role | Token | Hex |
|---|---|---|
| Ground (about 80% of page area) | White / Cloud | `#FFFFFF` / `#F8F6FC` |
| Headlines | Imperial Purple | `#3A1C5C` (14.0:1 on white) |
| Body text | Midnight Ink | `#121833` |
| Secondary text, meta | Graphite | `#4A5068` |
| **Action colour** (primary pill, text links, active-nav bar, connector lines on light) | KK Sapphire | `#2C509E` |
| Hover / pressed | Imperial | `#3A1C5C` |
| Dark band (proof band, footer, at most 2 per page) | Imperial | `#3A1C5C` |
| Highlight on dark (stats, CTA on dark, focus on dark) | Saffron | `#F4C841` |
| Labels on dark | Lavender Mist | `#EADCFF` (10.8:1 on Imperial) |
| Wayfinding | the six pillar colours | only as node dots, 4px bars and chips |
| Errors | Coral | `#E5494D`, always with an icon and text |

### 5.2 Contrast facts that change the brief's usage [C]
- **Orchid `#C8457E` on Cloud is 4.25:1, which fails AA for normal text** (4.56 on white just passes; 3.54 on Blush fails). **DEVIATION:** overlines are **Mauve `#8C5B88`** (5.29 on white, 4.94 on Cloud). Orchid is kept for pillar dots, chips on white and the Food Safety pillar accent.
- **Cobalt `#306FE0` on Cloud is 4.37:1, which fails for text.** Text links use **Sapphire** (7.12 on Cloud). Cobalt stays only as the focus ring on light grounds, where 3:1 is enough for non-text.
- **Hairline `#E4E0EE` is 1.3:1**, so it is fine for dividers but **fails 1.4.11 as an input border**. Input borders use `#7C8197` (3.86 on white, 3.6 on Cloud).
- **Sapphire on Imperial is 1.83:1**, so network lines on dark bands are Sky `#4C9BE8` (4.77) or Lavender.
- Saffron on Imperial is 8.79:1 and Ink on Saffron is 10.95:1. The CTA on dark is a Saffron pill with Imperial text.

### 5.3 Proportions per viewport (tighter than the brief's 60/25/10/5, which stays as the site-wide ceiling)
- **Light viewport:** ≥ 85% White/Cloud, about 10% Imperial and Ink type, **≤ 3% Sapphire** (one filled pill per fold, at most), ≤ 2% pillar colour, 0% Saffron.
- **Dark band viewport:** about 85% Imperial, ≤ 5% Saffron (numbers only), Lavender labels.
- **Whole home page by area:** about 72% White/Cloud, about 18% Imperial (proof band + footer), about 4% photography, ≤ 4% Sapphire, ≤ 2% jewel and pillar accents. **No more than 2 pillar colours in one viewport**, except on the expertise index.
- **Gradients:** none in the UI. Twilight is allowed only as a 70-85% duotone overlay on photographs. Sunrise is allowed only on the 404 page. Aurora is allowed only on off-site social banners. **DEVIATION** from the brief's Aurora CTA band, which becomes Imperial with a Saffron pill.
- **Soft discs:** Lavender, Ice and Butter at 60% opacity, flat with no blur. Only behind the hero network and the founder portrait.
- **Footer:** **DEVIATION** from the brief's Midnight Ink to Imperial. This makes it one deliberate tonal family, and the proof band and footer bookend the page.

---

## 6. Motion grammar

### 6.1 Tokens
| Token | Duration | Ease | Use | Evidence |
|---|---|---|---|---|
| `ui-in` | 180ms | `cubic-bezier(0,0,.2,1)` | hover, focus, menu open | Google 200ms decel [M] |
| `ui-out` | 140ms | `cubic-bezier(.4,0,1,1)` | menu close, tooltip out | Google 150ms accel [M] |
| `ui-colour` | 200ms | linear-ish `ease` | background, border, colour | Google, Unilever 200ms [M] |
| `reveal` | 560ms | `power3.out` = `cubic-bezier(.22,.61,.36,1)` | opacity 0→1 + `y: 16px`, once only | Unilever 450ms/16px, Brunswick 1s/23px [M] |
| `reveal-lines` | 720ms, stagger 70ms | `power3.out` | SplitText line masks on h2 only (`yPercent: 100`). **Never on the H1** | design.google 40-80% stagger [M] |
| `draw` | 900ms (swoosh) / 1200ms (connector) | `power2.inOut` | DrawSVG lines and swoosh | Unilever 1s stroke draw [M] |
| `count` | 1200ms | `power2.out` | stat count-up. The final number is in the HTML; `tnum` stops width jitter | brief 3.7 |
| `flip` | 640ms | `power3.inOut` | hero network collapsing into the header mark | DESIGN-DIRECTION |
| `scrub` | scroll-tied, `scrub: 0.6` | none | the pinned method only | |
| `ambient` | 18-30s loops | sine | node drift (≤ 6px amplitude), oil shader time | brief 3.4 |

The brief's "150-300ms, ease-out" governs every UI state. Reveals and draws are slower because they are reading-pace, not feedback. Nothing uses overshoot, elastic, back or bounce eases.

### 6.2 The four signature moments (and only four)
1. **Living network hero.** 14 ringed nodes on a canvas, under 150KB with its JS. Lines draw in once at load, nodes drift, and the cursor attracts within 120px by at most 10px. On scroll, Flip collapses the network into the header cluster. It pauses off-screen.
2. **Proof band count-up.** Four Saffron Fraunces numbers count up; "WHO" fades in last (no typing effect).
3. **Pinned method.** Connect → Collaborate → Create, pinned for about 2.5 viewports. The rising arrow draws between three large nodes and the copy cross-fades per step. This is the only scroll-jacked moment on the site.
4. **One Three.js scene.** Golden-oil / fat-crystal shader as the transition into Industries.
   - Desktop ≥ 1024px only, loaded on idle after LCP via IntersectionObserver.
   - DPR capped at 1.5; paused off-screen; under 200KB gzip including three.js core.
   - A still image (AVIF) replaces it on mobile and under reduced motion.

DESIGN-DIRECTION items 6 (impact rail), 8 (map arcs) and 9 (exhibit bars) are **downgraded to the `reveal` and `draw` tokens**:
- Impact: no horizontal pin. Each result is a row that reveals.
- Map arcs: draw once.
- Exhibit bars: grow once, 600ms.

The 404 drag-to-reconnect stays, because it is off the main path.

### 6.3 What moves, what never moves
- **Moves:** nodes, lines, the swoosh, stats (once), section content entering (once), the method (scrubbed), the oil scene, hover arrows (`x: 4px`), insight image hover (`scale 1.03`, 300ms), and the index row dot changing to its pillar colour with the arrow moving 8px.
- **Never moves:**
  - **the H1 and LCP element**
  - body copy after it has revealed
  - the logo and wordmark (no recolour, no morph)
  - the nav (except the height shrink)
  - form fields and labels
  - photographs of the founder (no parallax, no Ken Burns)
  - any text on scroll (no parallax type)
  - buttons (no magnetic pull, no scale)
  - the page background
- **Lenis:** `lerp: 0.12`, `wheelMultiplier: 1`, `syncTouch: false` (native scroll on touch), anchors and `scroll-margin-top` respected. It is **destroyed under reduced motion** and when the keyboard is driving focus. ScrollTrigger syncs through `lenis.on('scroll', ScrollTrigger.update)`.
- **Reduced motion:** every timeline sits in `gsap.matchMedia()` with a `(prefers-reduced-motion: reduce)` branch.
  - Opacity-only at ≤ 200ms, or none.
  - Lines appear already drawn and numbers render final.
  - No pin: the method shows as three static steps.
  - The network is a static inline SVG (under 15KB) and the oil scene is a still.
- **Pause control:** any ambient loop longer than 5s (network, shader) gets a 44x44 pause button (WCAG 2.2.2).
- **JS budget:** home ≤ 150KB gzip before the lazy Three.js chunk (GSAP core + ScrollTrigger + SplitText + DrawSVG + Flip about 70KB, Lenis about 4KB).

---

## 7. Photography and illustration

### 7.1 Photography
- **Register:** real, warm, close, candid (Unilever's crops [M]). Natural side light with a warm grade (about +200-300K) and no vignette.
- **Subjects:**
  - hands holding oil samples
  - golden oil in lab glassware
  - fat-crystal and texture macros (chocolate, bakery)
  - raw materials (palm, soy, sunflower, rice bran, cocoa, shea, sal and mango kernels)
  - plant floors and labs with correct PPE
- **Crop rules:** the subject touches two frame edges, and hands or faces fill 40-60% of the frame. Photos come in 3:2 and 4:5 only (plus a 16:9 full bleed on case studies), with 16px radius unless the photo is full bleed.
- **Founder portrait** (`ganeaysh-portrait-1665x2048.png`):
  - Shown in a ring with a Saffron border (quote block) and in one half-stadium mask on About.
  - Grey wall, navy blazer, striped shirt; it suits Cloud and Lavender grounds.
  - Retouch the lapel pin out or get it confirmed (it may be a former employer's mark).
  - No recolouring of the face and no AI "enhancement".
  - It appears on Home exactly once, in the founder quote block.
- **Never:** handshakes, screen-pointing, posed laughing groups, AI-generated food or people, over-saturated macro footage (the Givaudan default), recognisable former-employer or client sites, labs without PPE, cold blue filters.
- **Duotone:** Twilight (Imperial → Sapphire) at 70-85% is allowed only behind dark-band headers, with a scrim ensuring ≥ 4.5:1 for any text on it.
- **Delivery:** AVIF + WebP `<picture>` with explicit width, height and aspect-ratio. Hero media under 120KB. Every image except the LCP element uses `loading="lazy"`.
- **Gap:** until the commissioned environmental shoot happens, use licensed material photography only. Never fill the gap with people stock.

### 7.2 Illustration and icons
- **The node motif is the only illustration system.** It is used for:
  - ringed nodes (8px dot, 2px white ring, pillar colour) as bullets
  - Sapphire connector lines (1.5px light, Sky on dark)
  - the rising-arrow swoosh under at most one key phrase per page
  - the three soft discs
- **Icons:** as few as possible. The expertise index uses the coloured node instead of icons. Where an icon is unavoidable (form status, external link, arrow, play/pause, menu), use inline SVG on a 24px grid: 1.75px stroke, round caps and joins, Material Symbols Rounded 300 as the drawing reference. Each is under 1KB, and there is no icon font.
- **Charts ("Exhibits"):**
  - The title is a sentence that states the finding.
  - Flat SVG, at most 3 series (Sapphire, Amethyst, Sky), with Saffron only to highlight one bar.
  - Direct labels instead of legends; 1px Hairline gridlines.
  - A source line in 14px Graphite, and the frame width is the measure + 120px.
- **Logo:** use it only as supplied (vector still pending). Never retype the wordmark. The cluster's story is told once, in the hero-to-header Flip, and nowhere else.

---

## 8. Page-level rules that follow from the DNA
- **Home order** (from the brief): hero → proof band (Imperial) → expertise **index rows** → pinned method → impact rows "from our founder's career" → insights (1 lead + 2 stacked) → founder quote → CTA band (Imperial) → footer (Imperial).
  - Total words: 600-900.
  - The two dark bands are separated by at least 3 light bands. The CTA band and footer are adjacent, so merge them into one Imperial field divided by a hairline.
- **Pillar pages** inherit their pillar colour only in the 4px header bar, the node dot, the chips and the list bullets. Headlines stay Imperial.
- **Case study (Impact):** outcome H1 → context | result → one material image → stats with a source line → problem as a 28px pull paragraph → approach → inline 3-field enquiry form. No carousel, no parallax.
- **Performance gates:**
  - LCP ≤ 2.5s on mobile, with the H1 as the LCP element.
  - Home ≤ 1.5MB total, CSS ≤ 60KB with critical CSS inlined, fonts 97KB.
  - CLS < 0.05.
  - axe clean, keyboard path to /contact in ≤ 2 actions.
