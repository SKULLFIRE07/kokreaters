# Reference dissection: premium consultancy / advisory / ingredients B2B

Date: 4 Nov 2026. Focus: what makes a high-end B2B consultancy site feel world class (type scale, grid, micro-interactions, WebGL restraint, case-study pages), turned into rules for KoKreaters.

## Sites chosen (all rendered in headless Chrome; no bot walls)

| # | Site | Why it is here |
|---|---|---|
| 1 | brunswickgroup.com (home + /our-work/) | Global advisory firm. The most restrained "authority" site in the set: one serif headline, cream ground, one colour. |
| 2 | givaudan.com (home + /taste-wellbeing) | Top flavour house: the scientific-ingredients B2B peer. Ships GSAP 3.15 + ScrollTrigger. Useful as much for what not to do. |
| 3 | ideo.com (home + /case-study/designing-pharmaceutical-excellence-with-eli-lilly) | Consultancy with a line-network hero overlay (close to our node motif) and the best case-study template of the three. |

Probed but not used: mckinsey.com (no response to curl; an earlier bot-wall shot is in shots/mckinsey-botwall-home-1440.png). Bain, Kearney, Teneo, dsm-firmenich, Symrise, Kerry all returned 200 but are more generic corporate.

Measurements come from computed styles in Playwright (playwright-core driving /usr/bin/google-chrome, 1440x900 viewport, scrolled through to fire reveals), plus `--headless=new` CLI shots. "Words per fold" counts visible text nodes in each 900px band.

### Screenshots (research/shots/)
- `premium-consultancy-{brunswick,givaudan,ideo}-fold.png` 1440x900 (CLI)
- `premium-consultancy-{...}-full.png` 1440x6000 window (CLI). **Artefact:** a 6000px-tall window makes 100vh heroes 6000px tall (Givaudan's slider fills the whole shot) and Brunswick's reveal-on-scroll blocks stay invisible. Use the scrolled versions below instead.
- `premium-consultancy-{brunswick,givaudan,ideo}-scrolled-full.png`: 900px viewport, scrolled, full page clipped at 6000px. These are the real ones.
- `premium-consultancy-{...}-mobile.png` (CLI 390x844), `-mobile-clean.png` (Playwright, cookie dismissed). Brunswick's mobile-clean shot is blank cream: after the cookie click the opacity-0 reveal blocks had not fired yet. That is a real risk with their pattern, not only a capture glitch (see Avoid).
- Case/inner pages: `premium-consultancy-ideo-case-scrolled-full.png`, `premium-consultancy-brunswick-work-scrolled-full.png`, `premium-consultancy-givaudan-taste-scrolled-full.png` (+ fold, mobile).

---

## 1. Brunswick Group: restraint as authority

**Tech.** WordPress theme, jQuery 3.7.1 + 29 KB theme script.js, 17 KB CSS. No GSAP, Lenis, Three or Swiper. Reveals are plain CSS classes toggled by an observer: `.reveal-slide{opacity:0;transition:opacity 1s ease,transform 1s ease}` moving 1.47rem (about 23.5px) up; `.reveal-fade` is 0.6s. Has `prefers-reduced-motion` rules. Two self-hosted woff2 files: Petit Serif (custom, 43 KB) and Hellix variable (150 KB). The hero media is a **42.2 MB autoplay MP4** (`Cityscape-04-1.mp4`, 716x668) in a concave-cornered mask. That is the one big mistake on an otherwise exemplary page.

**Hero build.** Static HTML H1 (renders immediately, so a good LCP candidate), centred. Below it is a muted, looping, playsinline `<video>` with explicit width/height and aspect-ratio (so no CLS), clipped to a "cushion" shape with concave corners.

**Fold by fold (home, 3064px tall, about 172 words in total)**
- **Fold 0 (18 words).** Nav 110px tall, not sticky. Wordmark is letterspaced caps (about 0.3em) on the left; five nav items in Hellix around 18px on the right, then a search icon. About 230px of empty space, then the H1 "HIGH-STAKES ISSUES. / HIGH-IMPACT OUTCOMES." in Petit Serif **72/82.8px (1.15), weight 500, all caps**, on two lines about 1000px wide. Colour split: about 96% cream `#F6F6EF`, 4% ultramarine navy `#0B0384`. Nothing else. The cookie card sits bottom right.
- **Fold 1.** The video sits centred at 716px wide (half the 1440 frame), with about 130px of space above it.
- **Fold 2 (54 to 63 words).** Two centred paragraphs at about 28px, Hellix weight 350, line height about 1.2, measure about 880px (about 55 characters). Then one pill CTA: navy fill, radius 100px, padding 10/66/12/24 (extra right padding holds an arrow glyph), 16.6px label, 0.2s transition.
- **Fold 3.** The 32 offices as a centred inline list in 26px navy caps separated by bullets. It reads as "global network" with zero imagery. Footer is periwinkle `#A3B4DC` with navy text, two link columns and 14px tracked-caps labels (letter-spacing 2.88px).
- Mobile: H1 drops to 40/46 caps and stays centred.

**/our-work/ (the closest thing to a capabilities index).** H1 "OUR WORK" 72px caps. Lead 28px centred. A segmented pill toggle (Practices | Sectors). Then **full-width accordion rows**: each practice name in Hellix **64/75px, weight 450**, rows about 187px tall, 1px hairlines full bleed, a tiny 12px "Show +" on the right, and a "Show all" switch. Eight rows and no cards. On mobile the rows drop to 32/37.

**Lesson.** One serif voice at 72px, one ink colour, generous vertical space (about 230px before the H1) and **no card grids anywhere** read as more expensive than any amount of motion.

## 2. Givaudan: the ingredients peer (mostly a cautionary tale)

**Tech.** Drupal 10 with theme `givaudan_dds`, jQuery 4. **GSAP 3.15 + ScrollTrigger + ScrollToPlugin from jsDelivr.** Coveo Atomic search loads about 25 extra ESM chunks on the homepage. Also UserWay accessibility overlay, OneTrust, and Material Symbols (a 274 KB icon font). Fonts are Futura Now Headline / Text (self-hosted woff2, 37 to 50 KB each). The hero is a slider whose slides are autoplay webm videos (`giv_fb_jasmine_noaudio_conv.webm`, **7.0 MB**, `preload="none"`). No WebGL or canvas. In the scrolled capture there is a long black pinned stretch where a scroll-driven video section sits (ScrollTrigger pin; video frames do not paint in headless). Page height is 11,650px.

**Fold by fold (home)**
- **Fold 0 (about 122 words, mostly hidden menu text).** Full-bleed magenta macro-petal video. One centred line, "2026 Nine month sales", in Futura Now about 48px weight 500 white. Two white rectangular buttons (radius 4, padding 5/24/7, 14px). Left and right arrows, four dots, a chevron. The real H1 is screen-reader text at 48/62.4. Fixed nav 82px. A chat bubble and an accessibility widget float on top.
- **Below.** Sections are H2s at 32/41.6, body text is **14/21px** (small for 2026), and "Our news" is a centred single column of 270px cards with 12px meta. On mobile the H1 is 42/54.6.
- **/taste-wellbeing.** Hero photo with a centred white 48px H1 and a 16px lead set straight on the image (weak contrast in places). Then a 32px H2 intro, an olive-green highlighted sentence, an embedded video, and an olive 18px centred paragraph. Then **three identical white cards on a grey band**, then the same five cards again in a carousel, then stacked full-width image banners with centred white text.

**Lesson.** The food-ingredient category's default is magenta macro footage + carousel + small text + repeated card grids. KoKreaters wins by **not** looking like this while still showing real material (fat crystals, oil, plant).

## 3. IDEO: network overlay, editorial cards, best case study

**Tech.** Webflow (IX2 interactions: 26 `data-w-id` hooks), jQuery 3.5.1, **Swiper 12** for the "Featured work" and testimonial rails, HubSpot forms (React 18 island), Google WebFont loader. Fonts are FH Oscar (Light/Regular/Medium/Bold) served as **.otf, not woff2**, plus Manrope and Poppins loaded but barely used. No GSAP, Lenis, Three or canvas. The hero is a static photo with an **SVG line drawing of hexagons**, a dot grid and lime asterisk sparkles laid over it. It is a "network" overlay done as one static SVG, cheap and on brand.

**Fold by fold (home, 7596px)**
- **Fold 0 (4 visible words).** Ink ground `#151F27`. Boxed-letter logo top left (128px). Hamburger and an outlined "Say Hello" button (18px, square corners) top right. Photo 1368x600 inset with a 36px gutter. The H1 starts at the fold line: "Human-centered" in lime `#D9FF00` + "design" in white, FH Oscar **80/78px (0.98), weight 300**, on a dotted-grid band. Colour split: about 70% photo, 25% ink, 5% lime.
- **Fold 1 (105 words).** Two columns: a 20px statement on the left, three lime text links stacked on the right (no buttons).
- **Folds 2 to 4 (Latest, Featured Work).** Section labels at 40px weight 300 in muted slate `#7B92A5`. Cards have 1px borders, no radius and no shadow; titles 40/38.8 weight 300 white, a 20/23 slate summary in a second column inside the card, a lime "Read more" plus a 12px type tag. Featured Work is a Swiper rail with arrows. Then a **full-width lime bar CTA** (30px text, radius 0).
- **Folds 5 and 6 (800 to 1000 words; testimonial rail and FAQ).** Large portraits with quotes. The FAQ is an accordion with lime down-arrows.
- Mobile: H1 56/54.8, the photo becomes a square crop, 20px gutters.

**Case study (Eli Lilly, 9681px, about 1100 words) is the template to study**
1. Breadcrumb at 12px. H1 lime 80/78 weight 300 over two lines. Below it, client name (left) and a one-sentence outcome (right, lime) in two columns.
2. Full-bleed product photograph on white (hand + injector pen), about 600px tall.
3. **Stat column**: "99%" and "$36.5B" at 43/39 lime, each with a 16px caption **and a source link** ("JDST study"). Beside them a 20px narrative paragraph of about 110 words.
4. A white long-form panel. Left column: the "problem" paragraph as a 28px pull statement. Right column: a 30px bold intro, then 14 to 16px body text with bold sub-heads per product, one product photo with a caption.
5. Press stories (two bordered cards), then **an inline enquiry form** that closes the page ("Curious about how this kind of thinking could benefit your organisation?").

**Lesson.** A case study is a document: outcome sentence → proof numbers with sources → problem → approach → artefacts → CTA. No carousel, no parallax.

---

## Cross-site findings

- **Motion is quiet everywhere.** None of the three uses WebGL. Brunswick's whole motion system is a 1s opacity + 23px translate reveal. Givaudan spends GSAP on pinned video and carousels. IDEO uses Webflow IX hovers and Swiper. Premium B2B uses WebGL rarely, so a single, slow, well-made Three.js moment will stand out, but only if everything around it is still. (From the prior Athreix study, not re-captured here: shift.vml.dev runs one WebGL layer + Lenis + SplitText and keeps everything else static.)
- **Display sizes cluster at 72 to 80px on desktop and 40 to 56px on mobile, with a leading of 0.98 to 1.15.** Body or lead text that carries the story is 20 to 28px. Only Givaudan drops to 14px, and it feels like a corporate portal.
- **Word count on the first screen is tiny**: Brunswick 18, IDEO 4. Authority comes from saying one thing.
- **One ink + one ground + at most one accent.** Brunswick: navy on cream. IDEO: ink, white, lime. Givaudan: no system; every module picks its own photo colour.
- **No section is a generic three-card SaaS row on Brunswick.** IDEO's cards are editorial (big title, 2-column summary, hairline border). Givaudan's three white boxes on grey are the cheapest-looking moment in the set.
- **Performance sins in all three:** Brunswick's 42 MB MP4; Givaudan's 25+ search chunks, 274 KB icon font and accessibility overlay; IDEO's .otf fonts, unused Google families and the HubSpot React runtime on the homepage. With the brief's 1.5 MB budget, KoKreaters can beat every one of them.

---

## Borrow for KoKreaters

1. **Brunswick-level hero emptiness.** About 200 to 240px from nav to overline at 1440. H1 (brief display token, Fraunces 300, 72/76) is the only large element. At most about 40 words on the first screen at 1440x900: overline + H1 + sub + two buttons. The node network is the only visual, at no more than 45% of the width on the right.
2. **Type scale.** Keep the brief's scale but tighten display leading to about 1.02 to 1.06 (72/76 is fine; Brunswick is 1.15 in caps, IDEO 0.98 in lowercase). Set the lead at 21/34 (brief) with a measure of 56 to 64 characters (about 600 to 680px at 21px). Never set body copy under 17px (Givaudan's 14px reads as a portal). Section labels as tracked caps: 12 to 13px, letter-spacing 0.16 to 0.2em (Brunswick footer labels are 14px at 2.88px). Fraunces: drive the `opsz` axis (144 at display, about 24 to 36 at h2) and keep `SOFT` at 0 to 50 so it stays crisp, not wonky. Keep the Fraunces + Plus Jakarta Sans pairing from the brief. Brunswick proves a warm serif display + humanist sans is the right register; there is no case for swapping.
3. **One ink + ground discipline.** Cloud `#F8F6FC` as the ground on at least 80% of the page area; Midnight Ink `#121833` for text; Imperial `#3A1C5C` only for full-bleed bands (proof band, footer). Accents (Saffron, Orchid, Sapphire) together under about 5% of pixels per screen, used for wayfinding nodes, never as fills of large areas.
4. **Accordion rows instead of cards for the expertise index** (Brunswick /our-work/): full-width rows, pillar name in Fraunces 48 to 56px, row height 160 to 190px, 1px hairline `#E4E0EE` dividers, a small 13px "Explore +" right-aligned. Hover moves the row's node dot to its pillar colour and slides an arrow 8px over 200ms ease-out.
5. **Pill CTA spec.** Radius 999px, padding about 12/28 (Brunswick reserves extra right padding for the arrow), 16px label weight 600. Hover: background shifts one tone and the arrow moves 4px in 180 to 220ms. Visible 2px focus ring with 3px offset.
6. **Reveal system.** One reveal only: opacity 0→1 + translateY 16 to 24px, 600 to 800ms, `power2.out` (or `cubic-bezier(.2,.7,.2,1)`), stagger 60 to 80ms for line-split headings. Content must be **visible by default** in CSS and hidden only once JS adds a class to `<html>` (`.js .reveal{opacity:0}`), so a no-JS view, a crawler or a late observer never sees a blank page. Under reduced motion, use opacity only and 0ms delays.
7. **Static SVG network overlay as the no-WebGL / reduced-motion / mobile fallback** (IDEO hero): the node cluster as one inline SVG (under 15 KB) drawn at 1px Midnight Ink at 25 to 35% opacity plus the coloured nodes. The animated canvas or Three.js version layers on top only after LCP on desktop.
8. **Offices-as-type pattern for "Where we've worked"** (Brunswick city list): Mundra · Kakinada · Gurugram · Pune · Medan · Odessa · Balikesir · Amsterdam as a centred 24 to 28px line with node dots as separators. It shows breadth with no map weight on mobile; the desktop map can still sit above it.
9. **Case-study ("Impact") template from IDEO, relabelled "From our founder's career":** H1 outcome sentence at 56px → two columns (context | one-line result in accent) → one full-bleed material image (about 560 to 640px tall at 1440) → **stat column with source line under each number** (Fraunces 56 to 64px numbers in Saffron on Imperial, 15px captions) next to a 20/32 narrative of 100 to 130 words → problem as a 28px pull paragraph → approach in a 2-column 17/28 body → a "What it means for you" CTA panel ending in a short enquiry form (3 to 4 fields) inline, not a link away. Use only numbers and facts that are in the brief.
10. **Editorial card spec for Insights** (IDEO Latest): 1px hairline border, radius 0 to 4px, no shadow; title in Fraunces 28 to 32px over a 17px summary; meta at 13px tracked caps; the hover state is a border-colour change only (200ms).
11. **Media hygiene that Brunswick nearly got right:** if any loop video is used, give it explicit width/height + aspect-ratio, `muted playsinline preload="none"`, a poster, under 1.5 MB, 720p H.264 + AV1/WebM, never in the LCP slot, and not autoplayed under reduced motion.
12. **Footer as a colour field** (Brunswick periwinkle): Imperial band, 3 link columns, tracked-caps 12px column labels, about 96px top padding, with the node cluster faint at 8 to 10% opacity in the corner.

## Avoid

1. **Hero video weight.** Brunswick's 42 MB MP4 and Givaudan's 7 MB webm. Our total home budget is 1.5 MB. No hero video at all; the network is code.
2. **Autoplay hero carousels with dots and arrows** (Givaudan): they dilute the message to "news" and add JS. One headline, one message.
3. **Body text at 14/21** (Givaudan) and white text set straight on busy photos without a scrim of at least 4.5:1.
4. **Repeated three-card rows on a grey band** (Givaudan Taste & Wellbeing, twice on one page). This is the exact template look the owner banned. Use rows, lists, a pinned method or an editorial 2-up layout instead.
5. **Opacity-0-until-observed content with no CSS fallback** (Brunswick). Our mobile capture came back blank cream. That risks LCP, SEO snippets and the WCAG 2.2 reflow/zoom criteria.
6. **Third-party bloat on the homepage**: search SDK chunks (Coveo, 25+ files), accessibility overlays (UserWay; overlays do not fix WCAG and often break it), chat bubbles, HubSpot React islands, icon fonts (274 KB Material Symbols; use 1 to 2 KB inline SVGs), **.otf webfonts** (IDEO; ship woff2 subsets only), Google families loaded but unused. Fonts budget: at most 2 variable woff2 files, Latin subset, together under about 120 KB, preload only the display face.
7. **Floating widgets over content** (chat bubble + accessibility shield on Givaudan) and a cookie card covering the hero CTA area at 390px (Brunswick). Use a slim bottom consent bar that leaves the primary CTA visible.
8. **All-caps serif H1 over two lines.** Fine for Brunswick's two-word slogan, but KoKreaters' headline is a sentence ("Where deep expertise meets shared ambition."). Use sentence case, as the brief says.
9. **Neon single accent across everything** (IDEO lime on every link, CTA and H1): it works for a design firm, but for a food-science consultancy it reads loud. Keep the accent under 5% of pixels and colour-code by pillar.
10. **Logo-heavy proof**: IDEO and Givaudan lean on client brands. The brief bans former-employer logos; proof must be founder-career outcomes with plain sources.
11. **WebGL on every section, or on mobile.** None of the premium references needs it. Allow one Three.js scene, desktop only, lazy-loaded after LCP via IntersectionObserver, paused off-screen, DPR capped at 1.5, and replaced by a still image under reduced motion and on mobile.
