# Reference dissection: Google (about.google, design.google)

Captured 4 Nov 2026. Headless Chrome 1440x900, 1440 full-page and 390x844.
Shots: `research/shots/google-about-{desktop,full,mobile}.png`, `research/shots/google-design-{desktop,full,mobile}.png`.

No bot wall on either site. **design.google renders a blank dark page in plain `--screenshot` mode**: every block starts at `opacity:0; transform: translate(0, 40|60|80%)` and is only revealed by GSAP after scroll and intersection events, which a static headless capture never fires. I captured it through a small Chrome DevTools Protocol script (`scratchpad/cdp.mjs`) that loads the page, scrolls in 400 px steps, then takes the screenshot. That is ordinary page use, not a bot-wall bypass. Type values below are computed styles read from the live DOM. Anything marked *(knowledge)* comes from what I already knew, not from this capture.

---

## 1. about.google: the "clarity" half

### Fold 1 (1440x900)
- **Header** 64 px tall, white, 1 px `#dadce0` hairline. Colour logo at left (x=16), then 4 nav items in Google Sans **16 px / 500**, colour `#5f6368`. The active item is `#202124` with a **2 px `#1a73e8` underline** that spans the label width and sits on the header's bottom edge. No CTA in the header. Nothing else.
- **Hero**: a 2-column split on a 1296 px content width (72 px side margins). Left: H1 in Google Sans **60/72, weight 400, letter-spacing -0.5 px**, `#202124`, 2 lines. Deck in Google Sans Text **18/27**, `#5f6368`, 2 lines, max ~620 px. **Pill button** 139x49 px, `#1a73e8` fill, white 16 px/500 label, radius 32 px (fully round). Right: a 616x345 (16:9) media tile. The hero block is vertically centred, with ~108 px from the header to the top of the image and ~115 px below it before the next band.
- **Colour proportion in the fold**: about 85% white, about 10% the hero image (a blue crystal render), and about 1% UI blue (one button plus the nav underline). Text is neutral grey. **Colour is used as a signal, not as a surface.**
- **Words on screen**: about 30 (nav 6, H1 6, deck 17, CTA 2).

### Lower folds (full page, about 4,000 px of content, 258 words in total)
- The page alternates **white and `#f8f9fa` / about `#f3f4f8` bands**. Each band is one idea. Vertical padding is ~72–96 px.
- Band 2: 3 cards (389 px wide, ~64 px gutters). Each is an image on top with a 16 px/400 caption of 2–3 lines and a small blue external-link glyph at bottom right. Cards have an 8 px radius and a white fill on the grey band, with no shadow, or only a hairline.
- Band 3: the hero pattern repeated (H2 Google Sans **48/56** at left, video thumbnail with a YouTube play button at right, pill CTA).
- Band 4: centred "around the globe": a colour G icon, H2 36–48 px, one line of copy, and a *tonal* pill (light-blue `#e8f0fe`-type fill with blue text). This is the secondary button style.
- Band 5: the hero pattern again.
- Newsletter: a rounded (≈24 px) `#f8f9fa` container 1060 px wide, with a headline, 1 line of copy and a tonal pill.
- Footer: `#f8f9fa`, 4 columns of 14 px links with 13 px/500 headings, then a bottom bar (logo, Privacy, Terms, Help, language).
- **Rhythm**: the same 2-column template repeats 3 times, so the reader learns the page once. The only typographic hierarchy is size (60 → 48 → 36 → 18 → 16). **Every heading is weight 400**, with no bold display type.

### Mobile (390x844)
- 64 px header: hamburger at 24 px, logo centred-left.
- Hero is **stacked with the image first** (310x174), then the H1 at ~36/44 over 3 lines, the deck at 16/24 over 3 lines, and a **full-width 48 px pill CTA** (334 px). Side margin 28 px.

### Tokens extracted from All.min.css (657 KB, counted)
- Neutrals: `#202124` (128 uses), `#5f6368` (59), `#dadce0` (72), `#f8f9fa` (56), `#f1f3f4`, `#e8eaed`. Accent: `#1a73e8` (56), with `#174ea6` and `#185abc` as hover/pressed states.
- Radii: 4 px (39 uses), 8 px (27), 16 px (7), 32 px for pills (12), and 50% for dots.
- Motion: **transitions of 150–200 ms only**. Enter is `transform/opacity .2s cubic-bezier(0,0,.2,1)` and exit is `.15s cubic-bezier(.4,0,1,1)`, with `.2s` for background and box-shadow on buttons. Standard is `cubic-bezier(.4,0,.2,1)`.
- Focus: `:focus-visible { box-shadow: 0 0 0 2px #1a73e8; outline: 2px solid transparent }`, plus an inset 3 px ring with an 8 px radius on cards. That gives a visible, on-brand ring that still works in forced-colours mode.
- Breakpoints: 599 / 1023 / 1439 px.

### Tech (about.google)
- Google "Glue" marketing-CMS: server-rendered HTML (137 KB) plus `All.min.js` (52 KB) and the GTM, YouTube iframe API and cookie-bar scripts.
- **No GSAP, ScrollTrigger, Lenis, Three.js, Framer or Swiper.** Lottie is referenced in the bundle. There is one IntersectionObserver and one requestAnimationFrame.
- Fonts come from fonts.googleapis.com: Google Sans, Google Sans Text, Google Sans Display and Product Sans, with `display=swap`.
- Hero = plain `<img>` (or a poster image) inside a 16:9 tile. The video bands use a YouTube iframe behind a play-button poster, so the player loads only on click.
- Only 1 `prefers-reduced-motion` query exists, because there is almost nothing to reduce.

---

## 2. design.google: the "expressive editorial" half

### Fold 1 (1440x900)
- 64 px header on **`#12110C` warm near-black**, with the "Google Design" wordmark at x=60 and search plus a 2-line hamburger at right. A 1 px low-contrast hairline sits below the header. **There is no visible nav and everything is behind the menu.**
- Hero: a 2-column split. Left: headline in **Roboto Flex 800, ~62/68 (line-height 1.1)**, white, 3 lines. Deck in Roboto **16/24 weight 500 +0.5 px tracking**, 1 line. Right: a **645x645 square looping MP4** (a 3D emoji render from storage.googleapis.com). There is no CTA button, and the whole tile is the link.
- Words on screen: about 20.

### Scroll behaviour (full page, 7,139 px tall)
- **The theme swaps on scroll.** The body background goes from `#12110C` to `#FDFDF5` (warm off-white), the text goes to `#10120E`, and the link accent goes from **yellow `#FAE366` to green `#386A1F`**. The full-page capture landed in the light state.
- The second feature repeats the hero layout. Then come sections headed "Recent", "Typography", "UX", "Guides" and "Archive", each with a heavy H2 at ~36–48 px, a 3-column card grid (~410 px images in 16:9 or 4:3) with an 18 px/800 title, a 14 px deck, and **outlined pill tags** (1 px border, ~28 px tall, 12 px label) such as "Guides" and "Typography".
- The large section gaps (~200 px) make the page feel like a magazine. The illustrations are in very saturated colours.
- Mobile: H1 36/40 over 3 lines, then the deck, then a full-bleed 326 px square video. The side margin is 32 px.

### Tech (design.google)
- **Next.js** (`/_next/static/chunks/*`, 1.26 MB of JS across 10 chunks), with fonts from Google Fonts: Roboto, plus **Roboto Flex variable (opsz 8–144, wdth 64–150, wght 500–900)**.
- **GSAP and ScrollTrigger present** (61 / 26 hits in the bundles), plus 36 IntersectionObserver references. **No Lenis**, so scrolling is native. **No Three.js**: the only "three" hit is an error-message string. No Framer or Swiper.
- Reveal pattern seen in the DOM: line groups start at `translate(0, 40%)`, `(0, 60%)` and `(0, 80%)` with `opacity: 0`, so they rise in a stagger. Tweens are mostly **`duration: .15–.3`**, with `ease: "expo"` and `"power4"` showing once each. A custom `cubic-bezier(.165,.84,.44,1)` (quartOut) also appears.
- Hero = an autoplaying, muted, looping `<video>` MP4 in a square tile. No canvas or WebGL.
- Only **1 `prefers-reduced-motion`** reference in 1.26 MB of JS.
- **Failure mode:** content is hidden until JS runs and scroll fires. With no JS, or for a crawler, a screenshot or print, it is an empty dark page. LCP depends on JS.

---

## 3. What makes the "Google clarity" feel (synthesis)
1. **One accent, used for actions only.** On about.google the blue appears only on things you can press or on the current state. Everything else is `#202124` / `#5f6368` on white or `#f8f9fa`.
2. **Regular-weight headlines** at 60 px with −0.5 px tracking. Calm comes from size and space, not from weight.
3. **One layout per page, repeated.** The text-left / media-right split appears 3 times on about.google.
4. **Bands, not boxes.** Hierarchy comes from alternating white and `#f8f9fa` full-width bands and hairlines, not from shadows.
5. **Micro-motion only.** Transitions are 150–200 ms and there is no scroll choreography. Motion confirms an action; it never performs.
6. **The navigation shows everything.** 4 top-level items with a 2 px active underline. One glance tells you where you are.

---

## Borrow for KoKreaters
1. **Accent discipline (≤3% of fold pixels).** Sapphire `#2C509E` goes only on the primary pill, the active-nav underline, focus rings and text links. Pillar colours appear only as wayfinding: the 4 px top bar on a card, the 8 px node bullet and the tag. Never use them as a section background. Measure it: at 1440x900, no more than one filled colour CTA per fold.
2. **Active-nav indicator**: a 2 px Sapphire bar under the current item, as wide as the label and sitting on the header's bottom edge. Nav labels 15–16 px / 500, Ink `#121833` active and Slate `#4A5068` idle, with 24–32 px between items. Keep it to ≤5 top-level items plus "Start a conversation".
3. **Header**: 64 px desktop / 56 px mobile, following the brief (white at 85% with blur, 1 px `#E4E0EE` hairline only after `scrollY > 8`).
4. **Hero layout from about.google, typeset our way**: a 12-column grid with the text in columns 1–6 and media or the node scene in columns 7–12. H1 at 56–64 px desktop / 36–40 px mobile, line-height 1.1–1.15, tracking −0.5 to −1 px, **in a light display weight (Fraunces ~350–400, opsz high)** rather than bold. Deck 18/28 Slate, max 600 px (about 60–70 characters). About 30 words in the fold, matching Google's count.
5. **Pill button sizes**: 48 px tall (49 px on about.google), 24–28 px horizontal padding, 16 px/600 label. On mobile it goes **full-width under the hero copy** at 48 px. Secondary = a **tonal pill** (Mist `#D6E2FA` fill + Sapphire text) for low-stakes actions such as "Read the insight" or "Subscribe", rather than a second solid colour.
6. **Band rhythm**: alternate White `#FFFFFF` and Cloud `#F8F6FC` full-width bands, with 96–128 px vertical padding desktop and 64 px mobile. One idea per band. Use the hairline `#E4E0EE` between equal-tone bands instead of a shadow.
7. **Repeat one feature template.** Use the text-plus-media split for Approach, Founder and Featured insight so the home page has 2–3 layouts in total, not 8.
8. **Micro-interaction timing (lifted directly)**: enter `200ms cubic-bezier(0,0,.2,1)`, exit `150ms cubic-bezier(.4,0,1,1)`, colour and background `200ms`. Buttons: background Sapphire to Imperial in 200 ms, arrow `translateX(4px)` in 200 ms. Use these for all hover and focus states. GSAP is reserved for the few signature moments.
9. **Focus ring**: `:focus-visible { outline: 2px solid #2C509E; outline-offset: 2px }`, an inset 3 px ring at the 16 px radius on cards, and Saffron `#F4C841` rings on Imperial bands. Never remove outlines; use a transparent outline plus box-shadow so the ring survives forced-colours mode.
10. **Click-to-load video** (about.google pattern): a poster image with a pill play button, and the iframe or MP4 loaded only on click. This protects the home page's 1.5 MB budget and LCP.
11. **Outlined pill tags** (design.google): 28 px tall, 1 px border in the pillar colour, 12–13 px / 600 label, pillar name always written out (WCAG: never colour alone). Use them in Insights cards.
12. **Variable-font optical sizing** (the design.google idea): Fraunces variable with `opsz` lets the 60 px headings and 20 px pull quotes share one file but draw differently. Self-host one woff2 subset per family (Latin, ≈40–60 KB each).
13. **A short, plain footer**: 4 columns of 14 px links with 13 px/600 column headings on Cloud, then a bottom bar with © 2026 KoKreaters, Privacy, Cookies and LinkedIn.

## Avoid
1. **design.google's `opacity:0` gating.** Content must be visible in the HTML before JS runs. Run reveals only when `html.js` is set and `prefers-reduced-motion: no-preference` matches, start them from `opacity: 0.001` at most with a 0.6 s fallback timer, and never hide the H1 or LCP element. design.google renders an empty page to headless Chrome, which is bad for SEO, previews and printing.
2. **A hamburger-only desktop nav** (design.google). A consultancy buyer needs Expertise / Approach / Impact / Insights / About visible at 1440.
3. **Heavy 800-weight grotesque display** at 62 px. It reads as a design blog. KoKreaters' authority comes from a lighter serif.
4. **Theme-swapping on scroll** (dark to light, with the accent going yellow to green). It is disorienting and creates contrast edge cases. Use fixed bands: Imperial `#3A1C5C` for at most 1–2 emphasis bands per page.
5. **Saturated multi-colour illustration grids** (design.google archive). They conflict with the brief's "too many bright colours at once". Show no more than 2 pillar colours in one viewport except in the Expertise overview.
6. **about.google's generic 3-card band** (image, 2-line caption, link icon). This is exactly the "three-card SaaS" look the brief warns against. Show the 6 pillars as a list or an asymmetric index (number, colour node, name, one-line promise) instead.
7. **Too little copy**: 258 words is fine for Google's brand, but KoKreaters must earn trust. Keep the fold to about 30 words, but give the home page 600–900 words of real substance.
8. **1.26 MB of JS** (design.google). The KoKreaters home page budget is ≤1.5 MB *total*. Target ≤150 KB of gzip JS before the lazy Three.js chunk, and load Three.js only on idle or when visible.
9. **Google Fonts CDN loading** (both sites). The brief requires self-hosting via @fontsource.
10. **Autoplaying hero MP4** (design.google). Use a static poster plus a lazy node scene instead. If any video autoplays, it must be muted, under 8 s, under 600 KB, and paused under `prefers-reduced-motion`.
11. **Treating reduced motion as an afterthought.** Each site has exactly one media query for it. KoKreaters needs every GSAP timeline wrapped in `gsap.matchMedia()` with a reduced branch (fade ≤200 ms or none), and Lenis disabled under reduce.
