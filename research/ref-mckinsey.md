# Reference dissection: McKinsey (mckinsey.com)

Date: 4 Nov 2026. Brief weighting: McKinsey = 40% of the blend (structure, typography, Insights section, copy tone). Brief line: "Borrow principles, not looks."

## 0. Access status: BOT WALL (not bypassed)

- `curl` (HTTP/2): `HTTP/2 stream 1 was not closed cleanly: INTERNAL_ERROR` on `/`, `/featured-insights` and even `/robots.txt`.
- `curl --http1.1`: connection held open, 0 bytes, timeout at 30 s.
- Headless Chrome (`--headless=new`): `ERR_HTTP2_PROTOCOL_ERROR`. Evidence: `research/shots/mckinsey-botwall-home-1440.png`.
- Wayback Machine `id_` snapshot: `403 Access Denied`, Akamai edgesuite reference (McKinsey's edge refuses archive fetches too); the availability API returned 429.
- Conclusion: Akamai Bot Manager rejects this client by fingerprint. Per instructions, no evasion was attempted (no UA spoofing beyond a plain browser UA, no proxies, no using the owner's logged-in browser).
- Therefore **no 1440x900 / 1440x6000 / 390x844 captures of the real site exist**, no word counts were measured and no bundle grep was possible. Everything below in sections 1 to 3 is **from prior knowledge of the site (2021 rebrand onwards), labelled [K]**. Pixel values are close estimates from memory, not measurements. Re-run the captures from a normal desktop browser if exact numbers matter.

## 1. Brand system [K]

- **Type:** two proprietary families. *Bower*, a high-contrast display serif (Bodoni/Didone lineage, sharp hairlines, ball terminals) used only for headlines. *McKinsey Sans*, a neutral grotesque used for nav, deks, body, labels and charts. The serif is never used below roughly 24 px; the sans does all the work under that.
- **Colour:** near-black "Deep Blue" ink (about `#051C2C`) as the anchor, white as the field, one electric accent blue (about `#2251FF`) for links/CTAs/arrows, a cyan (about `#00A9F4`) and a short blue ramp for exhibits, cool light grey (about `#F0F0F0`) for alternating bands. Rough proportion: 75% white, 15% deep blue (text plus a few full-bleed dark bands), 7% imagery, under 3% accent blue.
- **Imagery:** commissioned editorial illustration and abstract photography (crowds from above, architecture, macro textures) cropped hard; almost never people shaking hands or posing at desks. On the homepage one big hero image sits next to a lot of type.
- **Graphic device:** a thin diagonal "slash" or arrow derived from the logo, used sparingly as a link affordance.

## 2. Fold-by-fold [K]

### Homepage (1440 wide)
1. **Nav (about 72 px tall, white):** wordmark left; primary links in sans 15-16 px/500 (Industries, Capabilities, Featured Insights, Locations, Careers, About us, Blog), each opening a full-width mega-panel; search icon, "Sign in" and "Subscribe" on the right. A thin hairline under it. Sticky, condenses on scroll.
2. **Hero:** an *idea*, not a slogan. A Bower headline about 56-64 px / 1.1 line-height, a one-sentence sans dek about 20 px, a text link with arrow, beside or over a single large image. Often a slow carousel (3-5 stories) with small dot/number controls. Roughly 25-40 words on screen.
3. **Featured insight grid:** an asymmetric grid, one large lead card plus 3-4 smaller ones. Cards are flat: image, small uppercase or regular eyebrow (content type: Article, Interactive, Podcast), sans or serif title 20-28 px, no borders, no shadows, no buttons. Gutters about 24-32 px.
4. **Themed rows:** "Our latest thinking", research institute (MGI) items, podcasts, the quarterly magazine, each a horizontal row or 3-up with large type and generous vertical padding (about 96-128 px between sections).
5. **Dark band:** a full-bleed deep-blue section (careers, or a flagship report) with white Bower type. This is the one moment of tonal contrast on the page.
6. **Footer:** deep blue, dense link columns in 14 px sans, newsletter sign-up, social icons, legal row.

### Featured Insights hub
- Page title in Bower about 48-64 px; a sub-navigation of topics and content types (filter chips/tabs).
- A lead story strip, then a long list/grid mixing articles, interactives, podcasts and the magazine. Cards carry content-type label, title and sometimes a date; images are consistent in ratio (about 16:9 and 1:1).
- "Load more" pagination rather than numbered pages.

### Long-form article template
- **Header:** content-type eyebrow ("Article"), Bower headline about 44-56 px, sans dek about 20-22 px, date, and a byline row of author names (linked), then a share/download/save rail. Hero image or illustration at full content width.
- **Body:** single column, measure about 640-720 px (roughly 65-75 characters), sans about 18-20 px with line-height about 1.6, paragraph spacing about 1 line. H2s in sans bold (or Bower at about 28-32 px in newer templates). A sticky left table of contents on wide screens for long reports.
- **Pull quotes:** large Bower italic or roman, set wider than the body measure, with hairline rules.
- **Exhibits (the signature):** a label "Exhibit 1", a full-sentence chart title that states the finding (the "so what" is the title, not "Chart of X"), a short sans subtitle with units, a flat 2-D chart in the blue ramp only (no 3-D, no gradients, no gridline clutter, direct labels instead of legends where possible), a source/notes footnote in about 12-13 px grey, and "McKinsey & Company" credit bottom right. The exhibit sits in a slightly wider frame than the text and can be enlarged or downloaded. Interactive exhibits use the same frame.
- **End matter:** author bios in small sans, "About the authors" block, related articles row, newsletter prompt.

### Mobile (390) [K]
- Hamburger nav, full-screen menu. Hero headline drops to about 32-36 px. Cards stack single-column with images on top. Article body about 17-18 px. Exhibits get a "View full exhibit" or horizontal pan on wide charts.

## 3. Tech [K, unverified because of the bot wall]

- The front end is a React app (Next.js-style `_next` assets) in front of a headless CMS, served through Akamai. Fonts are self-hosted WOFF2 for the two proprietary families.
- **Motion is close to none:** subtle fades/slide-ups as content enters, carousel transitions, hover underline on links, image zoom about 1.03 on card hover. No evidence of GSAP, Lenis smooth scroll, Three.js or Swiper-style showpieces on the core pages; interactives (data stories) are separate builds using D3-type libraries.
- **Hero build:** a server-rendered CMS block of headline, dek, link and responsive `<img>`/`<picture>`; any carousel is a small client component. No video background on the homepage as standard.
- The lesson: the authority comes from typography, editing and exhibits, not from motion.

## 4. What makes it work

1. **Ideas are the content.** The homepage is a front page of a publication, not a services brochure. Services sit in the nav.
2. **One serif, used only big.** The display serif marks hierarchy; everything functional is sans. Two families, two jobs, no overlap.
3. **Chart titles are sentences.** Each exhibit tells you the finding before you read the chart.
4. **Colour restraint.** One dark anchor plus one accent; jewel colours are absent, so the accent actually signals.
5. **Flat cards.** No borders, shadows or buttons; the title is the link. This makes a grid of 10 items calm.

## 5. Where it fails (for KoKreaters' purpose)

- Cold and corporate: blue-grey everywhere, almost no human presence on the homepage (the brief explicitly avoids "cold, grey, corporate tone").
- Density: mega-menus with 30+ links and hub pages with dozens of cards are right for 1,000+ articles, wrong for a one-founder firm with perhaps 3-10 insights at launch.
- Jargon-heavy deks ("unlock value", "next normal"); the brief asks for plain British English.
- Carousels hide 80% of hero content; low engagement past slide 1.
- The bot wall itself: aggressive edge protection blocks archives and some tools. Not relevant at KoKreaters' scale, but note that a consultancy site should stay crawlable for AI answer engines (brief's SEO section).

## Borrow for KoKreaters

1. **Homepage leads with an idea.** Hero headline is a point of view from the brief copy, one H1, about 8-14 words, Fraunces 300 at `clamp(44px, 5.2vw, 76px)`, line-height 1.04, letter-spacing -0.02em. Dek in sans 19-20 px / 1.5, max 60ch. One text CTA plus the "Start a conversation" pill. 35-45 words above the fold, maximum.
2. **Serif only at 24 px and up.** Fraunces for H1-H3, pull quotes, proof numbers and insight-card titles; sans for everything at 20 px and below (nav, labels, body, chart text). Type scale ratio 1.25 (body 18, 22.5, 28, 35, 44, 55, 69).
3. **Article template, McKinsey-grade:** body measure 66ch (about 680 px at 18 px), body 18 px / 1.65 (mobile 17 / 1.6), paragraph gap 1em, H2 Fraunces 32 px with 72 px space above / 16 px below, eyebrow in 13 px semibold pillar-colour chip, dek 21 px Graphite `#4A5068`, byline row with 40 px ringed avatar, reading time and date. Optional sticky ToC at 1280 px and wider for articles over 1,500 words.
4. **Numbered Exhibits:** label "Exhibit 1" in 13 px semibold Mauve `#8C5B88`; title is a sentence stating the finding in sans 20 px/600 Midnight Ink; subtitle with units 15 px Graphite; flat SVG chart, direct labels, at most 3 series from Sapphire `#2C509E`, Amethyst `#7B4BC4`, Sky `#4C9BE8` (Saffron only to highlight one bar); gridlines 1 px Hairline `#E4E0EE`; source note 13 px Graphite; frame width = measure + 120 px; KoKreaters credit small, bottom right. Bars draw in once on enter (600 ms, power2.out), static under reduced motion. Results labelled "from our founder's career".
5. **Pull quotes** wider than the measure (measure + 160 px), Fraunces italic 30-36 px / 1.25, 1 px Hairline rule above and below, 64 px vertical margin.
6. **Flat insight cards:** image 3:2, pillar chip, Fraunces title 22-26 px, 13 px meta (reading time · date), no border or shadow, whole card is the link, hover = title underline (offset 4 px) plus image scale 1.03 over 300 ms. Insights teaser on home: 1 lead (7 of 12 columns) plus 2 stacked (5 of 12), not three equal cards.
7. **Calm section rhythm:** 128 px between sections desktop, 80 px mobile; 12-col grid, 1200-1280 px container, 24 px gutters, 16 px mobile side gutter. One full-bleed dark Imperial `#3A1C5C` band per page maximum (the proof band), mirroring McKinsey's single dark band.
8. **Colour restraint as a rule, not a mood:** keep the brief's 60/25/10/5 and add McKinsey's discipline that the accent appears only on interactive things (links, focus, CTA) and in data.
9. **Nav simplicity:** 6 links plus one pill, 15 px sans/500, 72 px header shrinking to 60 px after 80 px scroll; one Expertise panel (six pillars + one featured insight), never a multi-column mega-menu.
10. **Plain titles everywhere:** headlines and exhibit titles say the conclusion ("Most 3-MCPD overruns start at the deodoriser, not the crude"-style, but only with facts the founder supplies).

## Avoid

1. **Carousel heroes.** One static idea; the motion is the node network, not slide rotation.
2. **Mega-menu sprawl** (30+ links) and hub pages with more than 12 cards at launch; with under 10 insights, show a curated list with pillar filters, no "load more".
3. **Cold blue-grey everything.** Use Cloud `#F8F6FC` warm-violet white, not grey `#F0F0F0`; keep the founder's portrait on the homepage (McKinsey has no people above the fold).
4. **High-contrast Didone imitation.** Do not push Fraunces' optical axis to a Bodoni look at small sizes; use `opsz` auto, SOFT 0-50, WONK 0 to keep it warm, and never below 24 px.
5. **Consultant jargon** in deks ("unlock", "next normal", "value creation levers"). Brief: plain British English.
6. **Legends and 3-D or gradient charts;** no more than 3 series per exhibit; no pie charts with more than 4 slices.
7. **Walls of text:** cap paragraphs at about 90 words, insert an exhibit, quote or subhead at least every 350-400 words.
8. **Long share/download rails, sign-in, subscribe walls.** One newsletter field in the footer, one share link at the end.
9. **Borrowing the look.** No deep-navy-plus-electric-blue scheme, no slash arrow motif, no "Exhibit" frame that copies their credit line styling; the brief says borrow principles only, no names or assets.
10. **Copying their low-motion stance wholesale:** keep McKinsey's calm for 90% of the site (150-300 ms ease-out UI), but KoKreaters still gets its 3-4 signature moments from DESIGN-DIRECTION.md.
