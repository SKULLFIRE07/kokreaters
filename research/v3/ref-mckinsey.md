# McKinsey reference study: design system extraction for KoKreaters v3

Date: 10 Nov 2026. Method: Playwright 1.64 (Chromium, desktop 1440x900 @1x, mobile 390x844 @2x), `getComputedStyle` measurements, full-page and first-fold screenshots, visual review of sliced captures.
Raw data: `research/v3/scripts/mck/mck-measure-*.json`. Scripts: `research/v3/scripts/mck/` (kept separate from the shared `scripts/capture.mjs`, which another agent overwrote mid-run).

## 0. Capture notes (read first)

| Page | Source | Status |
|---|---|---|
| McKinsey India overview `/in/overview` (main ref) | live | OK desktop + mobile, menu, footer, hover + motion probe |
| India Our Work `/in/our-work` (capability/industry index template) | live | OK |
| India Our Insights `/in/our-insights` (insights listing template) | live | OK |
| Article `/in/our-insights/wired-for-growth-indias-electrical-equipment-opportunity` | live | OK (the India-hosted copy of a global `/industries/.../our-insights/...` article, same template; body is visually gated after ~2 screens but the DOM is fully measurable) |
| McKinsey Global `/` | Wayback snapshot 30 Oct 2026 | Live = Akamai 403 "Access Denied" (4 attempts). The Wayback render has real CSS (measurements valid), but the header shows blank, many images are missing and the cookie modal sits on top. Treat the screenshot as layout only |
| `/industries/agriculture/our-insights` | Wayback 12 Jun 2026 | Live = 403. Wayback copy has no CSS (unstyled HTML), so it gives structure only: H1 "Agriculture Insights", a featured article (title, date, dek, "Read the article"), a blog promo, and "Connect with our Agriculture Practice" + Contact. The styled stand-in is `/in/our-insights` (same listing component) |

Akamai lets headless Chromium through on `/in/*` with `--disable-http2` and a Windows Chrome UA. Every global path (`/`, `/industries/*`, `/featured-insights/*`, `/about-us/*`) returns 403.

Screenshots (`research/v3/refs/`): `mckinsey-india-{desktop,mobile}-{fold,full,scrolled,menu,footer}.jpg`, `mckinsey-in-work-*`, `mckinsey-in-insights-*`, `mckinsey-article-*`, `mckinsey-global-wayback-*`, `mckinsey-agri-wayback-unstyled-*`. All are JPEG, q60 to q70.

---

## 1. Shared system: measured tokens (desktop 1440 / mobile 390)

| Token | Desktop 1440 | Mobile 390 | Notes |
|---|---|---|---|
| Content width | **1224px** (x 108 to 1332) | **351px** (x 20 to 371) | max-width 1440 wrapper; the gutter is **108px = 7.5vw** on desktop and **20px** on mobile |
| Grid gap | **32px** | n/a (1 col) | 2-up = 596+32+596; 3-up = 387 (x 108/527/945); 4-up = 282 (x 108/422/736/1050) |
| Narrow text column | 811 to 872px (article body x 315, intro x 284) | 351 | about 65 to 70 characters at 20px |
| Module gap (same background) | **64px** margin-top | **64px** (unchanged) | every module is `margin-top:64px` |
| Tinted / dark band padding | **64px** top and bottom | **32px** | grey, navy and blue bands |
| Section label to content | about 40px (24px label line, then content) | same | |
| Header height | **90px** | **83px** | `position:relative`. **Not sticky.** It does not reappear on scroll-up (checked at 1400px scroll and after a 400px scroll-up) |
| Display serif (Bower, proprietary) | weight **300** (light) everywhere; 500 only on people names | same | letter-spacing normal |
| Body sans (McKinsey Sans, proprietary) | weight **300** for body, 400 for links and buttons, 500 for labels and titles | same | body colour #000 on home, #333 in articles |
| H1 hero | **76/92** serif 300 (India home); 64/76.8 (Our Work hero); 52/62.4 (article hero); 44/52.8 (listing page title) | **36/44** (home, listing, article); 44/52.8 (Our Work) | mobile H1 caps at 36 to 44 |
| H2 feature title | **44/52** serif 300 | **36/44** | blue chevron icon after linked titles |
| Statement / promo H3 | 52/62.4 serif 300 (centred, max-w 918) and 44/52.8 (navy bands) | 36/43.2 | |
| Article H3 | 36/44 serif 300 | 36/44 | |
| Card title (sans) | **24/28** 500 (grid cards); 24/36 500 (2-up list) | 24/28 | colour #000. Hover turns it blue #2251FF (no underline) |
| Body / lead | **20/32** 300 (default body!); 18/28 300 (secondary, hero lead); article dek **28/40** 300 #333 | **20/32** (body does NOT shrink on mobile) | paragraph margin-bottom 16px |
| Small / meta | 14/20 300 (type label "Report", "Article"); 14/20 500 (people role); 12/16 (article action labels) | same | dates are **italic** 20/32 or 18/28, followed by " - " and the dek |
| Section label | **16/24, 500, uppercase, letter-spacing 1.2px (0.075em)**, #000 | same | centred on the home page; left-aligned under a full-width 1px #000 rule on index and listing pages |
| Stat number | **72/87** serif 300, electric blue | **64/77** | label 28/40 300; sub-label 18/28 300 |
| Buttons | **48px** tall, **radius 0**, padding 8px 24px, 18/28 400 | 48 (wraps to 74 when the label is long) | primary: solid blue + white. Secondary: 1px blue outline + blue text, which fills blue on hover (0.12s linear). On dark: white solid + black text, or 1px white outline |
| Text CTA | 16/24 **500** + 16px arrow icon in blue ("Learn more ->", "Get started ->", "Watch ->") | same | |
| Inline link | text stays black; **2px solid blue border-bottom** with 2px side padding | same | in articles: 2px #333 underline |
| Inputs | **48px**, 1px solid #000, radius 0, 16px text, white | 48 | footer: input 240 wide + blue Submit button. Global: 443 wide, white on navy |
| Rules | 1px #000 (section-top rules, footer top); 1px #D0D0D0 (header bottom on inner pages, CTA-bar rule); **1px #757575** (stat dividers, `::before` pseudo, 315px tall); 1px #B3B3B3 (article list rules) | same | no shadows anywhere except the card hover lift |
| Radius | **0 everywhere**. Exceptions: people portraits (50%) and round icon buttons | | |
| Images | **16:9** (596x335, 387x217, 282x158), **1:1** (insight list 596x596, blog 286x286, people 200 circle), article exhibit 4:3 (811x607) | 16:9 at 351x197; 1:1 at 351x351; blog 1.68:1 | no radius, no border, `object-fit: fill/cover` |
| Colours (DO NOT reuse values) | bg #FFF; grey band **#F0F0F0**; deep navy **#051C2C**; deeper blue band #042A76 (Global only); electric blue **#2251FF** (CTA, stats, chevrons, link rule, hover); cyan #00A9F4 (active nav only); text #000 / #333; rules #D0D0D0 / #757575 | | the area split on India home is roughly 50% white, 50% #F0F0F0, then navy and blue in small doses |
| Motion | card `box-shadow 0.4s ease-in-out`; links `all 0.12s linear`; buttons `0.2s ease-in-out`; only 4 running animations (hero line art) | | `scroll-behavior:auto`, **0 `prefers-reduced-motion` rules**, no scroll-triggered reveals seen |

---

## 2. McKinsey India: page anatomy (main reference)

### 2a. `/in/overview`: 9,714px desktop, 16,263px mobile, 15 modules

| # | Module | y (desktop) | Height | Background | Anatomy |
|---|---|---|---|---|---|
| 1 | Hero | 0 | **900** (full fold) | photo + brand gradient | Transparent header on top (white links). Text bottom-left at x108: kicker 14/20 "Welcome to", H1 76/92 serif light, lead 18/28 about 550px wide. Line-art overlay |
| 2 | Intro paragraph | 900 | 304 | #F0F0F0 | pad 64; a single 20/32 paragraph in an about 870px centred column; one inline link with a 2px blue underline |
| 3 | Our impact (stat strip) | 1268 | 371 | white | centred label; 3 columns with 1px #757575 vertical dividers about 240 to 315px tall; centred number 72 blue + label 28 + sub 18 |
| 4 | Featured insight split | 1703 | 399 | white | label; image 16:9 596 left; right: H2 44 + chevron, 20/32 body |
| 5 | Navy promo split | 2166 | 341 | #051C2C | full-bleed 50/50; left text (H3 44 white, 18/28 body, "Get started ->"); right photo edge to edge |
| 6 | Our view (video split) | 2507 | 527 | #F0F0F0 | pad 64; same split as #4 with a play button (74px circle, 2px white ring) |
| 7 | Community split + 3 columns | 3098 + 3561 | 399 + 308 | white | split, then 3 text columns: h5 24/28 500, 20/32 body, external-link 16/24 blue link |
| 8 | Centred navy CTA band | 3933 | **277** | #051C2C | pad 64; H3 44 centred, 20/32 sub, "Watch ->" |
| 9 | Our people grid | 4274 | 1848 | #F0F0F0 | 3x3 white cards 405x520 with about 4px gaps; 200px circle portrait; name serif 28/40 500; role 14/20 500; short centred rule; bio 14/20 300 #333, 3 lines; mail icon; secondary "Meet our people" button |
| 10 | Careers overlap card | 6186 | 496 + 366 | photo + white | full-container photo; white panel overlaps it by **-80px**, about 170px inset each side; H3 52/62.4; 20/32 body; "Learn more ->" |
| 11 | Notice | 7032 | 144 | white | centred label + italic 20/32 paragraph in the narrow column |
| 12 | Blog 2x2 | 7240 | 721 | white | 1px #000 top rule + left label; 2 columns, each row = 286 square image + text (24/36 500 title + chevron, italic date + 18/28 dek) |
| 13 | Locations | 8025 | 593 | white / navy | label; tab row (56px tabs, 16/24 500, active tab grey); navy panel 1/3 (h4 28/32 500, address 18/28) + map 2/3 |
| 14 | Global link button | 8682 | 48 | white | centred solid blue button |
| 15 | CTA bar + footer | 8794 | 305 + 615 | #F0F0F0 then white | see 2d |

Rhythm observations from the screenshots:
- Content is calm because nearly every module is **one idea**, with a label, one headline, one paragraph and one link.
- Colour bands, not borders, separate modules. White modules only get a rule when they are list or index modules.
- Headline weight is light (300). The pages read as senior and quiet because nothing is bold, except sans 500 for small labels and card titles.
- The page is long (15 modules). KoKreaters should take the module vocabulary, not the length.

### 2b. `/in/our-work` (capability and industry index): 3,809px

- Hero: 64/76.8 serif light, **right-aligned** text block over an abstract 3D render, 14px kicker "Our Work in India", 24/36 300 lead. There is a small round pause button bottom-right (motion control on the video hero).
- **Featured practices**: 1px #000 rule above, left label, then 4-up cards (282 wide): 16:9 image, 24px gap, title 24/28 500 + blue chevron, 16px gap, 20/32 300 description. No borders, no backgrounds.
- **Industries / Capabilities index**: 1px rule + left label, then a **3-column link list** (column x 108/522/936, so 414 pitch) of 18/28 300 links in electric blue, each with a small grey chevron. Row pitch is about 46px. There are 27 industries in 9 rows.
- Two-up "network" cards (square image left 286, title 24/36 500, 18/28 body), then the CTA bar.

### 2c. `/in/our-insights` (insights listing): 17,137px

- Page title H1 serif 44/52.8, then a **1px #000 full-width rule**.
- **Insight list rows**: image **1:1, 596px** on the left; text column on the right (x 736): type label 14/20 300 ("Report", "Article", "Interview"); **7px** to the title; title serif **44/52** light + blue chevron; 20/32 meta: *italic date* + " - " + dek. About 24px between rows.
- **Hover**: the row becomes a white card with a soft shadow (`box-shadow` 0.4s ease-in-out), padding about 12px around it, and the title turns electric blue **with an underline**.
- After the list: navy CTA band, then 4-up cards (16:9, type label 14px, title 24/28 500, date 20/32), then a secondary "View More" button (48px, 1px blue outline).
- Mobile: each row stacks as a **351x351 square image**, then 34px, then label, then title 36/44, then date and dek.

### 2d. Header, menu, footer

- **Header (desktop)**: 90px. Hamburger at the far left (89x90 hit area, separate cell), logo (about 143x46) at x 96, a section name ("India" 12/16 500) above the primary nav (16/24 **300**, gaps about 24px). The active item is cyan text plus a **3 to 4px blue bar** pinned to the header's bottom edge. Utility links (16px "Sign In | Subscribe") sit top-right above a 32px search icon. Over the hero the header is transparent with white text and a dark gradient behind it. On inner pages it is white with a **1px #D0D0D0** bottom border.
- **Desktop menu**: a 360px **navy drawer** on the left with 18/28 500 white items and right chevrons, 60px row pitch. The active row has a lighter navy fill and underline. Next to it a white mega-panel shows the section title 24/36 500 + blue arrow and a 3-column 16/24 link grid. The page behind stays visible and dimmed.
- **Mobile header**: 83px; hamburger 56x83 at the left; logo about 143x52, with the "India" label under it; search on the right. There are no visible nav links.
- **Mobile menu**: full screen. A navy top bar with the close X, then a grey "< Main Menu" back row, then the section title "India ->" on a light-blue band, then links (16/24, **48px row pitch**, 24px left inset). The active link is blue and underlined on a pale-blue row.
- **CTA bar** (before the footer): #F0F0F0, pad 64. Left: serif **36/43.2** "Connect with McKinsey India". Right: solid blue **Contact** button (200x48) with a mail icon. Then a 1px #D0D0D0 rule and a social row (32px black circle icons + 16/24 300 labels).
- **Footer**: 615px desktop, 920px mobile. It starts with a 1px #000 top border. Left: a 2-column link list (20/32 **400**, 48px row pitch, columns at x 108 and 284). Right (x 983, 349 wide): "Subscribe" 20/32 500, a 16/24 300 line, a **48px email input (1px #000, radius 0) + blue Submit**. Then a legal links row (14/20 **500**) and a copyright row (14/20 300 #333). On mobile the 2-column link list is kept and everything else stacks.

### 2e. Article template (`/in/our-insights/...`)

- Hero: full-bleed photo **552px** tall (y 90 to 642) with a dark bottom gradient; H1 serif **52/62.4** white at bottom-left (x 108, max about 1017w); meta 14/20 "May 21, 2026 | Article".
- Under the hero: an action row (Share / Print / Download / Save) of 24px icons with 12px labels at x 315.
- Dek: **28/40 300 #333** in an 811px column.
- Body: **811px column at x 315** (about columns 3 to 10 of 12). 20/32 300 #333, paragraph margin 16px. The first paragraph has an italic drop cap and a **bold lead-in phrase** (500). Footnote refs are blue superscripts.
- Left floats (405px, #F0F0F0): "Byline / About the authors" and "Sidebar / ..." expandable boxes, each with a 14px label, a 20/32 title and a black 40px round "+" button.
- Right rail (x 1028, 304 wide): 1px #000 top rule, then label "DOWNLOADS", then a blue 16/24 link with a download icon; later "MOST POPULAR INSIGHTS".
- In-body H2 is serif **44/52**, H3 serif **36/44**; exhibits are 811 wide.
- End of article: "How relevant and useful is this article?" (18/28 500), "ABOUT THE AUTHOR(S)" label, then a 3-up related grid (title 24/36 500).
- **Mobile**: the image sits on top with **no text over it**. Title and meta go in a **#F0F0F0 panel below** (H1 36/43.2 **#333**, meta 16px), then the action row, then the dek and the 20/32 body at 20px gutters.

---

## 3. McKinsey Global `/` (Wayback, 30 Oct 2026): 5,682px desktop, 7,190px mobile, 8 sections

| # | Section | Height | Background | Anatomy |
|---|---|---|---|---|
| 1 | Hero + insight bento | 1297 | navy #051C2C, pad 64 | Serif display headline with a **staggered second-line indent** (signature lockup, do not copy). 18/28 lead. Round 72px arrow button on mobile. Bento of 5 dark tiles: uppercase 14px type label ("CASE STUDY", "PODCAST", "ARTICLE"); titles sans 24/36 **500** white + chevron; one large tile with a sans **light 44/52** title + white solid button. Then a subscribe card (#FFF 15% tint) with a 48px input + 48px square cyan arrow button and "Or continue with" outline buttons |
| 2 | Featured newsletter | 410 | navy + photo right | label; sans light **64/76.8** "Insights to navigate what's next >"; 20/32 dek; inline form = input 443x48 + white "Subscribe" button |
| 3 | Podcast | 1139 | deeper blue #042A76 gradient | sans light **76/91** title; 24/36 lead; outline "Listen here ->"; a white episode card (36/43 500 title) next to the player; **4 progress tabs**, each with a 4px top bar (active cyan) + 14px title |
| 4 | How we help clients | 730 | navy, pad 64 | centred label -> centred serif **52/62.4** statement (max-w 918) -> **3-up cards** (387, gap 32): 16:9 image, title 24/28 500 + chevron, 20/32 300 desc |
| 5 | Careers | 300 | white | label; 2 columns: serif 44/52 **blue** headline + 20/32 body + solid "Explore Careers"; video right with an offset blue block behind it |
| 6 | Societal impact | 762 | **electric blue #2251FF**, pad 64 | same intro stack as #4 + 3-up cards with white text |
| 7 | App promo | 500 | white | centred serif 52 statement; device mock + QR left, sans 36/44 title + store badges right |
| 8 | Legal accordion | 198 | #F0F0F0 | 28/32 500 title row between 1px rules, chevron right |

Global vs India: Global is darker and more editorial (3 of 8 sections are navy or blue). It uses **sans light at display sizes** (64 to 76px) for media titles next to the serif, and it puts more cards above the fold. India is lighter (white and #F0F0F0 dominant) and module-by-module. **India is the closer fit for KoKreaters' "calm, senior" brief.** From Global, borrow the **centred intro stack + 3-up grid** and the **newsletter band**, and skip its colour intensity.

---

## 4. Reusable PATTERNS -> where KoKreaters uses them

KoK tokens assumed from the brief: navy #0B1B33, logo blue #2C509E, accent #306FE0, grey #F2F2F0, text #1A1A1A / #5A5A5A, Source Serif 4 headlines, Inter 18px body.

### From McKinsey India (main)
1. **Section label.** 14px Inter 600 uppercase, tracking 0.08em, #1A1A1A, 40px above the content. Centred on Home modules; left-aligned under a full-width 1px #1A1A1A rule on index and list pages. *Use:* every Home section, Expertise and Industries index, Insights, About. It replaces all the handwritten margin notes.
2. **Stat strip.** 3 items, centred, separated by **1px #5A5A5A-ish vertical dividers about 240px tall**. Number in Source Serif 4 at **64 to 72px, weight 300 to 400, accent #306FE0**; label Inter 22/30; sub-label 16/24 #5A5A5A. Band height about 370px. **Mobile:** stack vertically, turn the dividers into full-width 1px horizontal rules, number 56 to 64px. *Use:* Home "Impact" and the Impact page header.
3. **Feature split 50/50.** 16:9 image (596 at 1440) on the left, text on the right: serif H2 44/52 + accent chevron, then a 20/32 paragraph, then a text CTA. The image is always on the left (McK does not zig-zag). Mobile: image on top, text below. *Use:* Approach teaser on Home, the featured insight, each Expertise page intro.
4. **Navy split band.** Full-bleed 50/50: text half on navy (pad 64, serif 44 white, 18/28 body, white text CTA), photo half edge to edge. About 340px tall. Mobile: photo on top, navy text panel below. *Use:* Home "Our approach" or "How we work" (one per page, maximum).
5. **Centred CTA band.** Navy, pad 64, serif 44 centred, one 20/32 sentence, one text CTA, about 280px tall. *Use:* mid-page CTA on Expertise and Industry detail pages ("Discuss a [sector] brief").
6. **Card grid (no chrome).** 16:9 image, 24px gap, Inter title 22 to 24/1.2 weight 500 to 600 + accent chevron, 16px gap, 18/30 description. **No border, no radius, no shadow, no background.** Grid gap 32. 4-up at 282 or 3-up at 387 on 1224. *Use:* **Expertise x6 = 3x2**, **Industries x9 = 3x3**. This replaces the horizontal rails.
7. **Index link list.** 3 columns at 414px pitch, Inter 18/28 in logo blue #2C509E with a small grey chevron, about 46px row pitch, under a rule + label. *Use:* compact Industries x9 list on Home, deliverable lists on Expertise pages, footer sitemap.
8. **Insight list row.** 1:1 image (about 41% width) left; type label 14px; 7px gap; serif title 40 to 44/1.18 + chevron; date (italic) and dek 18/30. **Hover:** soft shadow lift (0.3 to 0.4s ease) and title turns accent. Mobile: full-width square image, then text. *Use:* Insights listing, under the **Pillar + Format filters** (filters sit between the H1 rule and the list).
9. **Compact 2x2 insight rows.** Square 286px image + Inter 22/32 600 title + date and dek 16/26. *Use:* Home "Latest insights" (4 items) and related insights on articles.
10. **People grid on grey.** #F2F2F0 band, white cards with **4px gutters** (hairline grid effect), 160 to 200px circular portrait (desaturated, cool grade), serif name 26 to 28, role 14px 500, short 32px rule, 3-line bio 14/20 #5A5A5A centred. *Use:* About leadership / team.
11. **Overlap card.** Full-container photo; a white text panel overlaps it by **80px**, inset about 14% each side; serif 44 to 52 + 20/32 body + text CTA. *Use:* About "Who we are" or one Impact case study.
12. **Tabbed locations panel.** 56px text tabs (active = grey fill); navy panel 1/3 (city 28/32, address 18/28, phone, "Open in Maps ->") + map 2/3. *Use:* Contact page, if KoK lists more than one office; otherwise a navy address panel next to the form.
13. **CTA bar + footer.** #F2F2F0 bar: serif 36 "Talk to KoKreaters" left, solid accent button 48px tall right, 1px rule, social row. Then the footer: 1px #1A1A1A top rule, 2-column links (18 to 20/32), **newsletter = 48px input (1px border, radius 0) + accent submit**, legal row 14px 500, copyright 14px #5A5A5A. *Use:* site-wide. This is the "newsletter real form".
14. **Article template.** Hero photo about 550px with serif 52 title bottom-left + 14px meta. Mobile: photo then a **grey panel with dark title** (no text on images on phones). Action row; dek 26 to 28/1.43 #5A5A5A; body column **about 720 to 810px** at 18/30; serif H2 40 to 44, H3 32 to 36; right rail 300px with a rule + label ("Download", "Related"). *Use:* Insight detail pages.
15. **Buttons and links.** 48px, radius 0, padding 0 24px, Inter 16 to 18 / 500. Primary: accent fill. Secondary: 1px accent outline that fills accent on hover (about 120ms). Text CTA: Inter 16/500 + 16px arrow in accent. Inline link: 2px accent underline (border-bottom) with the text kept #1A1A1A. *Use:* everywhere; this replaces the boarding-pass and toy CTAs.

### From McKinsey Global
16. **Centred intro stack.** Label, then a centred serif statement **48 to 52/1.2 in max-w about 920px**, then a 3-up grid. *Use:* Home Expertise section ("How we help"), Industries hub header.
17. **Newsletter band.** Photo on one half; on the other, headline + 20/32 dek + inline **input + button on one line** (48px). *Use:* Insights page footer band and Home section 8 (if not merged into the footer).
18. **Type-labelled tiles.** Every insight tile carries an uppercase 14px format label (CASE STUDY / ARTICLE / PODCAST). *Use:* map directly to KoK's **Format** taxonomy on all insight cards.
19. **Accordion rows.** 24 to 28px 500 title between 1px rules, chevron at the right, no boxes. *Use:* engagement-models table detail on mobile, FAQ on Approach and Contact.
20. **Progress tabs with a 4px top bar.** *Use, optional:* the Insights Format filter as tabs (active = 3 to 4px accent top or bottom bar), consistent with the header's active-nav bar.

### Engagement-models table (no direct McK equivalent; derived from their rule system)
Header row in label style (14px uppercase, tracking 0.08em). Rows Inter 18/28 with 1px #D9D9D6 rules, no zebra, no vertical lines, first column Inter 500. Below 768px each model becomes an accordion row (pattern 19).

---

## 5. KoKreaters translation: proposed scale (derived from the measurements, adapted to Source Serif 4 + Inter)

| Role | Desktop | Mobile (390) | McK measured |
|---|---|---|---|
| Hero H1 | Source Serif 4, 64/72, 400 (opsz display), -0.01em | 38/44 | 76/92 to 36/44 |
| H2 section / feature | 44/52, 400 | 32/40 | 44/52 to 36/44 |
| Statement H3 (centred) | 48/58 | 30/38 | 52/62.4 to 36/43 |
| Article H3 / CTA bar | 34/42 | 28/36 | 36/44 |
| Card title | Inter 22/30, 600 | 20/28 | 24/28 500 |
| Lead / dek | Inter 22/34, 400, #1A1A1A | 20/30 | 20/32 to 28/40 (300) |
| Body | Inter **18/30**, 400 | 18/30 (do not shrink) | 20/32 300 |
| Label | Inter 14/20, 600, uppercase, 0.08em | 13/20 | 16/24 500, 1.2px |
| Meta | Inter 14/20, 400, #5A5A5A | 14/20 | 14/20 300 |
| Stat number | Source Serif 4, 68/76, 300 to 400, #306FE0 | 56/64 | 72/87 to 64/77 |
| Container / gutter | 1224 max; gutter clamp(20px, 7.5vw, 108px) | 20px | 1224 / 108 / 20 |
| Grid gap | 32 | 24 (when 2-up) | 32 |
| Section spacing | 64 between same-bg modules; 80 to 96 padding inside colour bands | 48 to 64 / 40 to 48 | 64 / 64, mobile 64 / 32 |
| Header | 80 to 90 static; optional 64px compact sticky-on-scroll-up (white, 1px #D9D9D6) | 64 to 72 | 90 / 83, never sticky |
| Button | 48px, radius 0 to 2, padding 0 24, Inter 16/500 | 48, full width under 480 | 48 / 0 / 8px 24px |

Notes:
- Inter at weight 300 reads thin and grey on screens, so use 400 for body. McK gets its "light" voice from a proprietary light grotesque; Inter 400 at 18/30 with #1A1A1A gives the same calm with better legibility.
- Home at 8 sections with these spacings lands at about 5,500 to 6,500px desktop (McK India home is 9,714 with 15 modules; McK Global is 5,682 with 8).
- Motion to match McK: only colour and shadow transitions, 120 to 400ms ease. Add the fade-up (12 to 16px, 400ms, once) that the brief allows, and wrap all of it in `prefers-reduced-motion: reduce`. McK ships **zero** reduced-motion rules; KoK should do better.

---

## 6. DO NOT COPY

- **Fonts:** Bower (serif) and McKinsey Sans are proprietary McKinsey typefaces; mck-icons is their icon font. Use Source Serif 4 + Inter + an open icon set (Lucide or Phosphor, 1.5px stroke).
- **Exact colours:** #051C2C navy, #2251FF electric blue, #00A9F4 cyan, #042A76 band blue, #F0F0F0 grey. KoK uses its own #0B1B33 / #306FE0 / #2C509E / #F2F2F0. No full-bleed electric-blue sections (Global's "Societal impact" band); the KoK accent is for buttons, stats, chevrons and link rules only.
- **Imagery and art direction:** the Taj Mahal hero, the blue line-wave and "glowing threads" overlays, the abstract chrome-sphere and glass-ribbon 3D renders, partner portraits, and the McKinsey photography. KoK should use its own or licensed real photography with a desaturated cool grade.
- **Signature lockups:** the staggered-indent hero headline ("What's your next brilliant move?"), the "McKinsey & Company" wordmark stack, the offset blue block behind the careers video, and the floating chat bubble.
- **Copy:** all headlines, labels like "Our View", "Harness the Power of Digital", "Connect with McKinsey India". KoK keeps its own copy per the brief.
- **Structure to avoid copying literally:** the 15-module home length, the non-sticky header with its two-tier hamburger + mega-drawer (too heavy for an 8-page-type site; a simple top nav + full-screen mobile menu is enough), and the visual gate on article bodies.

---

## 7. Gaps and caveats

- Global and agriculture pages are Akamai-blocked from this machine. Global numbers come from the Wayback CSS, which is valid for computed styles, but its screenshot is missing the header and images. The agriculture page is structure only.
- Stat dividers are `::before` pseudo-elements (1px #757575, 315px tall), measured separately.
- Hover states were measured on India: the secondary button goes transparent to #2251FF fill with white text; card titles go #000 to #2251FF; list rows get a box-shadow over 0.4s.
- The Wayback global page reported `header` as Wayback-rendered. Its 90px / 1px #D0D0D0 border matches the live inner pages.
