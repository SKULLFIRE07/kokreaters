# Reference dissection: Unilever (unilever.com)

Captured 4 Nov 2026. Pages: Home `/`, Our company `/our-company/`, Brands `/brands/`.
Shots: `research/shots/unilever-{home,purpose,brands}-{1440,full,390}.png`.

**Access note:** a plain `curl` of the HTML returns an Akamai "Access Denied" page (bot wall). I did not try to get around it. Everything below comes from what headless Chrome rendered (screenshots plus `--dump-dom`) and the public `/assets/*.css` and `/assets/*.js` files, which load normally. Where I rely on my own knowledge rather than the capture, the text is marked **[knowledge]**.

**Capture caveat:** the "full-page" shots use a 1440x6000 *viewport*. Sections sized in `100vh` therefore stretch to 6000px. The home page's video-loop band is the clearest case: it fills about 3,500px of blur. The cookie banner covers the bottom 130px of every shot. So use the full-page shots for section order and colour proportion, not for real heights.

## 1. Visual, fold by fold

### Global chrome (every page)
- **Utility bar:** 42px tall. Theme switch, "Unilever Global" and "Change location", 14px regular, right-aligned.
- **Primary nav:** a floating pill, 52px tall, radius 26px, about 1096px wide, starting at x=312. Fill is Sky `#0066CC`, and the active item draws a 3px white underline. Search sits in a darker Night `#133062` end-cap inside the same pill. Labels are 17px semi-bold.
- **Logo:** the new script "Unilever" wordmark, 185x42px, white, at x=32, y=84. The 25-icon "U" mark appears only in the footer, at about 30px.
- **Background:** the "aurora", a fixed, static Night `#133062` field with magenta/violet glow at the bottom-left and a cyan glow at the top-right. CSS: `uol-c-aurora-static`, `min-block-size:100vh`, plus a fixed `Aurora-footer.webp` image. It is a bitmap, not WebGL.
- **Sections:** large blue panels (Sky `#0066CC`) that sit on the aurora. Each has one rounded *bottom-right* corner (about 64px) made with `mask: radial-gradient(circle at 0 0, transparent var(--section-radius), black ...)`. This asymmetric corner is their main structural motif.
- **Typeface:** one proprietary family, **Unilever Desire**, self-hosted woff2 in Light 300, Regular 400, SemiBold 600 and Bold. It is a humanist grotesque with soft terminals. Every page uses only this family.

### Type scale (from CSS tokens; desktop / mobile)
| Token | Desktop | Mobile | Line height |
|---|---|---|---|
| heading-giant | 75px (4.6875rem) | 54px | 1.12 |
| heading-1 | 66px (4.125rem) | 42px | 1.09 |
| heading-2 | 42px | 28px | about 1.14 |
| heading-3 | 25px | 20px | |
| body | 18px | 16px | about 1.55 |
| small and meta | 14px (the most-used size: 42 rules) | | |
- Headings are Bold, close to 0 tracking, sentence case. The giant size is reserved for number displays (for example "€12.0bn").
- Radii: 8 / 16 / 32px, and 50% for the round icon buttons.
- Motion tokens: `--transition-easing: cubic-bezier(.25,.46,.45,.94)` (easeOutQuad). Interface transitions run 200ms; story reveals run 300ms ease-in-out (`--story-animation-speed:.3s`); a single fade-and-translate runs 450ms; one stroke-dasharray draws over 1s.

### Home `/`
1. **Hero (0 to 770px):** a 50/50 split.
   - Left column, text at x=48: 16px bold eyebrow "Welcome to Unilever", an H1 of about 66px Bold on 2 lines ("Q3 2026 Trading Statement"), a 2-line body at 18px, and a white pill CTA 48px tall.
   - Right column: a muted, looping product **video** (Rexona can, cyan and teal) at 600x560. It sits in a **"D"/half-stadium clip-path**: flat left edge, a large curve on the right (`--title-banner-media-mask-radius:65.625rem`, SVG `#title-banner-clippath`). Info and pause buttons, 44x44, sit at the top-left of the video.
   - About 30 words on screen.
   - Colour: roughly 70% Night navy, 15% aurora violet glow, 15% saturated cyan from the video.
2. **Investors panel:** Sky blue, about 940px. A 42px H2. Three share prices in 38px numerals with a 1px divider line. Two image cards (portrait and event photo, 8px radius, about 3:2) and a "Quick links" list. Roughly 120 words.
3. **Video band:** full width, looping, with a pause control.
4. **"Business Groups":** four cards in a row, each about 300x500px. The photo takes the top 60%: warm, close, candid human moments (a woman applying lotion, a man using deodorant, a girl smiling into a lilac jumper, a man biting a sandwich). Under each photo: an underlined 20px title and 3 lines of 14px text. This is the "warm human photography" signature: real skin tones and natural light, cropped tight on faces and hands, no posed handshakes.

### Our company `/our-company/`
1. **Hero:** "We are Unilever", H1 at about 66px. One purpose paragraph of 5 lines at **22px**, roughly 50 words, measure about 590px (≈ 60–65 characters a line). On the right, a product group shot (about 720x405) in the same D-mask, flipped so the curve faces left.
2. **Proof strip:** three stat cards with a dark-teal fill (`#00606C`) and a 1px light border. Number at 26px Bold, then a label, then a 12px footnote ("190 countries", "3.7 billion people", "€50.5 billion turnover"). The strip sits in a Sky panel.
3. Three cards (At a glance, Our leadership, Our strategy), each with a person photo.
4. "Latest news": one large lead story (photo 50%, title 25px) followed by a 4-up row.
5. Two big cards for Sustainability Hub and Careers (a wind turbine and a candid smiling woman), then a "Connect / Contact" pair and the footer.

### Brands `/brands/`
1. **Hero:** the D-mask flipped again, with the video on the left (a warm kitchen, hands, a plate of fajitas) and "Our brands" in about 66px on the right. About 2 words.
2. "Household names": a 4x3 grid of brand tiles. Each tile has a packshot on a pale gradient wash, about 300x180px, 16px radius on the top-left, top-right and bottom-left corners, and a rounded bottom-right. Below the image, the brand name in 17px bold underline and a one-line tagline.
3. Stat strip ("3.7bn", "78%", "190").
4. **"Four Business Groups":** the only giant-type moment, four turnover figures set in about 75 to 90px Light/Regular ("€11.7bn"). Hero packshots underneath bleed out of the panel.
5. Editorial pair (a surreal bedroom photo, a lab scientist), then a 3-up of leadership, strategy and IR, then the footer.

### Mobile 390x844
- The nav collapses into a white "Menu" pill (96x38, radius 19).
- The D-masked media stacks *above* the H1 at 358x360, so the hero headline starts at y=530 and is pushed below the fold by the cookie banner.
- Body text 16px, side gutters 24px.

### Logo as story
- **[knowledge]** The 2004 Wolff Olins "U" is built from 25 icons (a hand, a heart, DNA, a spoon, a lips/ice-cream shape, and so on). For 20 years it was the brand's storytelling device: each icon stood for one way Unilever touches everyday life, and older versions of the site had an explorable "our logo" page.
- **What the capture shows now:** after the 2025–26 "Desire at Scale" identity, the header uses a flowing *script wordmark*. The icon-U is shrunk to a footer sign-off of about 30px. The story the logo used to tell has moved into photography and the business-group colours.
- Lesson: a logo built from meaningful parts only works as a story if the site explains it once, in one deliberate place.

## 2. Tech
- **Framework:** **Astro**. Script names follow `*.astro_astro_type_script_index_0_lang.*.js`, and components are named Ush*/Uol*/Ucb*.
- **Hosting:** **Vercel** (`x-vercel-cache: HIT`, region `dub1`) behind Akamai.
- **Images:** served from `/content-images/<project>/production/<hash>-WxH.jpg?rect=&w=&h=&fit=crop&auto=format`. This URL pattern and the `92ui5egz` project id match a proxied **Sanity** image CDN, and the `/files/.../production/*.mp4` paths are Sanity file assets. (The pattern is my reading; the site does not say.) Responsive `<picture>` sets run from 150w upwards.
- **Animation libraries:** **no GSAP, ScrollTrigger, Lenis, Three.js, Framer, Swiper or Lottie** found in the rendered DOM or `page.*.js`. The "three." matches are cookie-banner strings. Motion is CSS transitions plus one IntersectionObserver for reveals, and there are `prefers-reduced-motion: reduce` blocks. Scrolling is native.
- **Hero build:** a server-rendered `uol-c-title-banner` with a 50/50 flex split. The media side is a `<video loop muted playsinline preload="none">` at 1600x900, with its poster passed as a CSS variable (`--video-poster-url`). It is clipped by an inline SVG `clipPath#title-banner-clippath` (the D shape). Pause and info buttons give WCAG 2.2.2 pause control. The H1 has a soft `text-shadow: 0 0 16px` in the aurora colour, so it stays legible over the glow. The background is a static aurora bitmap, not a shader.
- **Fonts:** UnileverDesire Light/Regular/SemiBold/Bold, woff2 plus woff fallback, `font-display: swap`, self-hosted under `/assets/`.
- **Colour system:** named brand ramps (sky, aqua, clover, lilac, magma, earth `#F6F7F0`, night `#133062`), each in pale/light/mid/base/dark. A Theme switch supports light and dark. CSS totals about 640KB unminified across many per-component files, which is heavy.

## 3. Borrow for KoKreaters
1. **One asymmetric "signature corner" on panels.** Round only the bottom-right corner of each section panel, at 48–64px, made with a CSS `radial-gradient` mask. It is quiet, recognisable, and costs no JavaScript. Adapt it to our node motif: the corner radius matches the node ring radius.
2. **A D/half-stadium media mask for the founder portrait.** On the About hero, put `ganeaysh-portrait` in a clip-path with a flat inner edge and a large outer curve (radius of at least 50% of height). Use it once on Home and once on About only.
3. **A strict type scale with few steps.** Display 72–76px with line height 1.08–1.12; H2 42px; H3 24px; body 18px with line height 1.55; meta 14px. Mobile: display 44px, H2 28px, body 16px. Only one display size per page.
4. **Purpose paragraph at a lead size.** On the About and approach hero, set a 20–22px lead in about 50 words, measure 560–620px (≈ 60–65 characters a line), next to the image. That is how they tell the purpose story: one paragraph, no bullet soup.
5. **Proof numbers as their own type moment.** Set 3 stats in 38–48px numerals with a 12–14px footnote that states the source, inside bordered cards with a 1px border. Ours carry the label "from our founder's career". Brief numbers only.
6. **Warm, close, candid photography rules** for future commissioned shots: natural light, faces and hands at 40–60% of the frame, crops tight enough that the subject touches two edges, no logos. Apply this to the missing lab/plant environmental portrait: Ganeaysh at a bench, side light, hands in frame.
7. **Motion budget the same as theirs:** interface 200ms with easeOutQuad `cubic-bezier(.25,.46,.45,.94)`, reveals 300–450ms with an 8–16px translate, one SVG line draw of about 1s. Our GSAP moments sit on top of this calm base; we should not add more.
8. **Accessible media:** every looping video or animated canvas gets a 44x44 pause button (WCAG 2.2.2), `preload="none"`, and a poster image as the LCP element.
9. **Stack confirmation.** Astro, Sanity images with `auto=format` plus a `rect` crop, and self-hosted woff2 with `font-display: swap` is the same stack that runs a 190-country corporate site. The direction we chose is proven at scale.
10. **Logo as story, done once.** Explain the KoKreaters node cluster (each node a pillar colour) in a single short sequence (for example the hero network collapsing into the header mark). Do not repeat it elsewhere; the rest of the site uses the mark only as a sign-off.

## 4. Avoid
1. **Saturated blue on everything.** About 85% of each page is `#0066CC` or `#133062` and every section is the same full-bleed blue panel. There is no rhythm and no white space. KoKreaters should be at least 60% Cloud/off-white, Imperial navy below 20%, and jewel tones below 10% as accents.
2. **Aurora gradient-glow backgrounds:** the magenta-to-cyan blur behind the hero. This is exactly the gradient-blob look the owner bans.
3. **Uniform 4-up and 3-up card grids** on every page (4 business groups, 12 brand tiles, 4 news cards, 3 company cards). This is the generic-section problem. Use at most one card grid per page, and prefer editorial asymmetric layouts such as 7/5 column splits.
4. **Underlined link-style card titles at 17–20px,** which read as utility, not premium. Use the display serif or a tracked label instead.
5. **A 52px pill nav with 8 items and dropdowns.** Too heavy for a 6-page consultancy. Use 4–5 text links at 15px, no fill, and a hairline on scroll.
6. **Hero media above the H1 on mobile,** which pushes the H1 to y≈530. On a 390px screen our H1 must start above y≈300, so the image goes below the text or is cropped to 40vh or less.
7. **Video as the default hero.** A 1600x900 MP4 loop is a large weight for our ≤1.5MB home budget. Use a still image or SVG plus canvas, and at most one optional, lazy, small clip.
8. **Business announcements as the hero headline** ("Q3 Trading Statement"). The H1 should carry the brand promise from the brief, not news.
9. **640KB of per-component CSS.** Keep ours under 60KB total, and inline the critical CSS.
10. **No smooth scroll or scroll choreography at all.** Fine for them, but we need the 3–4 signature GSAP moments. Their site shows the calm baseline, not the high point.
