# Reference study: BCG, Roland Berger, Kearney (design system extraction)

Captured 10 Nov 2026 with Playwright 1.64 (Chromium headless, desktop Chrome UA). Viewports 1440x900 @1x and 390x844 @2x (mobile UA, touch). Each page loaded to network idle, consent accepted (BCG "Accept all and close", RB Usercentrics, Kearney Osano hidden), auto-scrolled to trigger lazy content, then measured with `getComputedStyle` in `page.evaluate`. No bot walls were hit; all 7 URLs returned 200.

Pages:
- BCG: `/` (home), `/publications` (insights hub), `/publications/2026/market-leaders-staying-on-top-longer` (article)
- Roland Berger: `/en/` (home), `/en/About/Who-we-are/` (the "Our consulting approach" CTA links here)
- Kearney: `/` (home), `/industry` (Your industry index), plus the "Your industry" and "Your needs" mega panels

Files:
- Screenshots: `research/v3/refs/bcg-rb-kearney-<page>-<desktop|mobile>-<fold|full|scrolled|menu>.jpg` (JPEG q70 to 75), plus `bcg-rb-kearney-rb-mega-expertise-desktop.jpg`, `bcg-rb-kearney-kearney-mega-industry-desktop.jpg`, `bcg-rb-kearney-kearney-mega-needs-desktop.jpg`. BCG full-page shots are wider than 1440 because the carousels overflow horizontally; crop to x 0 to 1440 (or 0 to 780 on mobile) when viewing.
- Raw measurements: `research/v3/data/<page>-<desktop|mobile>.json`, `data/bcg-rb-kearney-extra.json`, `data/bcg-rb-kearney-kmenu.json`
- Scripts: `research/v3/scripts/bcg-rb-kearney-capture.mjs` (main), `bcg-rb-kearney-extra.mjs`, `bcg-rb-kearney-kmenu.mjs`

All px values below are CSS px at 1440 wide unless marked "390". "lh" means line-height.

---

## 1. BCG (bcg.com)

**Overall feel:** editorial and modular. Big light-weight serif headlines, light sans body, tight 56px module padding, many rounded cards and carousels. The serif-plus-light-sans voice is the part to borrow. The glassy cards, carousels and lime buttons are not.

### Measurements

| Item | Desktop 1440 | Mobile 390 |
|---|---|---|
| Page height | home 6,662 / hub 4,263 / article 10,735 | home 8,833 / hub 7,981 / article 10,413 |
| Font families | Proprietary serif for display; proprietary sans for everything else | same |
| H1 | home 44/44 w300 serif; hub 86/86 w300; article 76/76 w300 (max width 960) | 32/38.4 home, 48/52.8 hub, 32/35.2 article |
| H2 (section) | 52/52 or 56/56, w300 serif, letter-spacing normal, colour dark green | 40/48 |
| H3 / card title | 24/28.8 w300 sans (cards); 28/33.6 w300 (lede-size) | 18/21.6 to 22/26.4 |
| Body (article) | 20/26 w300 sans (lh 1.3), colour #212427, column 748px wide (x 80 to 828) | 16/20.8 w300 |
| Lede under H2 | 20/26 w300, max about 780px | 16/20.8 |
| Eyebrow / label | 14px w700 uppercase ("WELCOME TO BCG", "OUR LOCATIONS"); card type 12px w700 uppercase + date 12px w400 uppercase | 10px to 12px |
| Section padding | 56px top and bottom per module (newsletter module 40/40); so about 112px between module contents | 32px |
| Container | 1280 max, x = 80 (80px side gutters); inner 1096 for some modules | 16px gutters |
| Header | Two floating white "pill" groups (menu+logo left, search+login right), 73px tall, offset 40px from top, fixed. Same height after scrolling (no compact state) | 57px, offset 16px; menu button 40x58 |
| Desktop nav | Hamburger only (no visible top-level links) | full-screen sheet |
| Buttons | 48px tall, radius 15px, padding 13px 55px, 16px w700 UPPERCASE, lime fill, 3px transparent border; outline variant 3px dark border | 46px, 14px |
| Filter selects (hub) | 51px tall, radius 15px, padding 12px 32px, 18px w400, 1px #696969 border, each 308px wide = one grid column | stacked full width, 51px each |
| Insights grid (hub) | 4 columns x 308px, 16px gaps; cards 3:4 portrait (308x411) with a frosted text panel over the lower 45% | 1 column 358px wide, still 3:4 (about 478px tall each) |
| Card anatomy | type+date row 12px uppercase, then title 24/28.8 w300, 3 lines clamped with ellipsis | 10px meta, 18 to 22px title |
| Stat | Case card chip: "$4.5b+" 32/38.4 w300 + label 12px uppercase | 14px |
| Dividers | 1px. Article: #DFD7CD (warm) on accordion and author blocks; hub: 1px #696969 on filters | same |
| Article rhythm | paragraph gap 20px; H2 has about 112px above and 32px below; exhibit image module 650 to 724px tall | |
| Exhibit | "EXHIBIT 1" 14px w700 uppercase, then exhibit title 28px serif, chart, then sources/notes 10 to 12px | |
| Footer | Beige band, 714px tall, padding-top 56. Four column starts at x 80 / 271 / 512 / 1064: brand statement 28px light (4 lines), 5 links 24px light in 2 sub-columns, "How can we assist you?" 20px + 16px text + CTA. Then legal links 12px w700 uppercase underlined, logo bottom-left, socials right | 1,025px tall, stacked, links 18px |
| Mobile menu | full-screen white sheet; search row at top; group headings about 24px (Our Services, Our Insights, BCG in India...) separated by 1px rules; child items about 20px indented about 20px; rows about 60px | |
| Colour behaviour | Large dark-green, mint, beige and black bands alternate. Text colour #212427 | |
| Imagery | Mostly saturated stock and 3D renders, 3:4 crops, radius 15 to 20px | |

### Reusable patterns (BCG)

1. **Light serif display + light sans text.** Headlines are serif at weight 300 with line-height 1.0 to 1.1. Body and ledes are sans weight 300 at 20px. This contrast reads as "senior, editorial". *KoKreaters:* Source Serif 4 at 400 (it has no true 300 that holds up) for H1/H2, line-height 1.05 to 1.1. Inter 300 for the 20 to 22px lede, Inter 400 for 18px body.
2. **Section header stack:** eyebrow (14px w700 uppercase) → 16px gap → H2 52px serif → 24px gap → lede 20px light, max width about 780px → optional right-aligned text link ("SEE MORE CLIENT STORIES", 14 to 16px w700 uppercase underlined) on the same line as the grid top. *KoKreaters:* every home section header and the Expertise and Industries index headers. Use the right-aligned "All insights →" link above grids.
3. **Insights hub = H1 + lede + filter row + grid.** H1 86px over 2 lines, lede 20px with the first sentence in w500 as a built-in summary, then a row of 3 dropdowns (each one grid column wide, 51px tall), then a 4-up grid with 16px gaps, then a "VIEW MORE" button bottom-right. *KoKreaters Insights:* keep Pillar + Format as two selects (48px tall, 1 column wide each) or as one row of square chips. Use a 3-up grid at 1440 (KoKreaters has fewer items). Use "Load more" instead of pagination.
4. **Card meta row:** TYPE in bold uppercase plus DATE in regular uppercase, both 12px, 12px apart, above a light-weight title. *KoKreaters Insights cards:* "PERSPECTIVE  ·  6 NOV 2026" over a 22 to 24px title. Clamp titles at 3 lines.
5. **Topic tag above article H1:** a 1px outlined tag with 12px uppercase text and 4px 10px padding sits directly above the H1. *KoKreaters article template:* Pillar tag (radius 2px, not a pill).
6. **Article anatomy:** tag → H1 76px over 3 lines (max 960px) → byline 14px with underlined author names → meta row 12px uppercase ("ARTICLE  NOV 06, 2026  8 MIN READ") → full-width hero image (about 1280x300, very wide crop) → body column. *KoKreaters:* same order. Use an 18/1.65 body in a 680 to 720px column. BCG's 20/26 (lh 1.3) is too tight to copy.
7. **Exhibit convention:** small uppercase "EXHIBIT 1" label, a serif exhibit title that states the finding ("Leadership Has Been Locking In, but the Degree Varies by Sector"), the chart, then 10 to 12px sources. *KoKreaters Impact and Insights:* label every chart or figure this way. It signals rigour with no decoration.
8. **"About our research" accordion:** a 1px rule, a "+" icon and a 28px light title, collapsed by default and placed mid-article. *KoKreaters:* methodology notes on Approach, and the "how engagement models work" detail under the table.
9. **Stat inside a case card:** number 32px light with a 12px uppercase label under it, top-left of the card image. *KoKreaters Impact cards:* one headline result per case card ("38% / REDUCTION IN ..."). Put it on a plain panel, not glass.
10. **Split feature module:** a 50/50 grid with the image left (radius) and eyebrow + H2 + 2-line text on the right, with the CTA pinned to the bottom of the text column. *KoKreaters:* About "Based in India, working across..." block and the Contact office block.
11. **Inline newsletter bar:** one horizontal bar with the line "Get the latest industry insights delivered to you" (28px light) on the left and an email input + Subscribe button joined into one 52px control on the right. *KoKreaters newsletter (real form):* one row on navy: label text, email field, button. Stack on mobile.
12. **Four-column footer:** brand statement | primary links (large, 24px light) | contact prompt + button | then a legal row and logo. *KoKreaters footer:* statement, Expertise/Industries/Firm links, "Talk to us" block. Keep link size 16 to 18px (24px is BCG-specific).
13. **Mobile menu sheet:** full-screen, search field first, group headings with 1px separators, nested items indented, about 60px rows. *KoKreaters mobile nav:* Expertise (6) and Industries (9) as expandable groups. Approach, Impact, Insights, About and Contact as single rows.
14. **Module rhythm:** a fixed 56px padding inside every module, so stacked modules are evenly spaced. *KoKreaters:* use one section-padding token everywhere (96px desktop / 56px mobile, more generous than BCG) so the 8 home sections feel even.

### Do not copy (BCG)
- Henderson BCG Serif and Sans are proprietary. Use Source Serif 4 and Inter only.
- Colours: dark green #0C2B15, lime #96F878, mint #E3FDDB, beige #F1EEEA, #212427 text.
- Frosted-glass text panels over 3:4 portrait images; 15 to 20px corner radii; the floating pill header; lime uppercase bold buttons; auto-advancing carousels with pause controls; the "BCG Answer" AI widget; their stock and 3D render imagery.
- 20px body at lh 1.3: too tight for KoKreaters' 18px Inter.

---

## 2. Roland Berger (rolandberger.com/en)

**Overall feel:** a structured Swiss-style grid. A thin vertical "spine" line runs down the page and links each section. Black square UI, a mosaic of tiles with hairline gaps, and an asymmetric reading column. The most useful reference for layout discipline, square buttons and mega menu structure.

### Measurements

| Item | Desktop 1440 | Mobile 390 |
|---|---|---|
| Page height | home 5,246 / who-we-are 4,390 | 5,007 / 3,823 |
| Font families | Proprietary geometric sans (Light/Regular/Medium/Bold) + proprietary bold-italic serif used only for small section kickers | same |
| H1 (hero) | 64/72 bold, letter-spacing 1px, white on image | 32/35 |
| H2 (section headline) | 45/59 bold, ls 0.5px (lh 1.31) | 24/34 |
| Feature card title | 32/38 medium | 24/30 |
| Card title | 22/30 medium | 14/20 |
| Body | 17 to 18 / 28 (lh 1.6), Light/Regular, colour #000 | 13/23 (too small) |
| Kicker | italic serif 18/28 ("Meet our experts", "Join the team"), centred on the spine, with a 40x3px black bar 8px below | 15px |
| Tag chip | 12px bold uppercase, ls 1px, black on white, about 4px 8px padding, 24px inset from tile corner | same |
| Section spacing | headline wrapper padding 40 top / 50 bottom; empty "separator" blocks 96px; so about 150 to 190px between modules | |
| Container | 1280 max at x = 80 (24 instances), alt 1160 | 20px gutter |
| Reading column | starts x = 627 (about 44% across), width about 630px; left 40% stays empty | indented to x 87 (50px right of spine) |
| Spine | 1px #ACACAC vertical line at x ≈ 558, runs between modules and behind kickers | at x ≈ 37 |
| Header | 48px utility bar (14px links, ls 1px: Newsroom, Magazine, Alumni, Contact Us, Newsletter, EN/DE) + floating black nav box 1,204x104 inset over the hero, logo 100x58, nav links 21px ls 1px white. After scrolling: fixed full-width black bar, 72px | 60px black bar: logo 55x47, search, burger 30x24 |
| Mega menu | opens below the nav box: 3 columns (x 158 / 559 / 961), Industries over 2 columns on dark petrol, Services on teal; group heading 17px bold; links 17px medium, 30px row pitch; close X top-right | full-screen grey sheet: primary 22px rows 47px; 1px white rule; secondary 18px rows 35px; language row |
| Sub-nav strip | 60px light-grey band under the hero: sibling pages 16px ls 1px; active one underlined | stacked, centred, 27px rows |
| Buttons | 48px tall, radius 0, padding 0 20px, 12px bold uppercase ls 0.72px, black fill, white text; pairs sit 4px apart | same |
| Hero CTA tab | black block 56px tall pinned to the hero's bottom-right edge; 18px bold uppercase ls 1.06px + circled-arrow icon | full-width black bar, 2 lines |
| Hero height | home 460px; who-we-are 670px (short heroes) | about 330px |
| Mosaic grid | row 1: text tile (light grey) + image tile, 2 x 640; row 2: 3 x 426; row 3: 2 x 640. 1 to 2px gaps. Image about 1.6 to 1.7:1, then a grey caption area 130 to 160px with the title bottom-aligned | 1 column |
| Quote block | light-grey panel; round greyscale portrait about 225px; quote about 28 to 30px bold over 8 lines; name 13px bold + role/office 13px; two black buttons flush bottom-right | |
| Contact box | tinted band, "Contact us" 45px bold + 1 line + black CONTACT button bottom-right; padding 40 top / 120 bottom | |
| Footer | light-grey band, 478px. 3 zones split by a 1px vertical rule: primary links 16px bold with an underline; HQ block (bold company name, address, then a Phone/Fax/Mail label-value grid) + 4 circular 40px outlined social icons; legal links 14px uppercase, ls about 3px, grey, right-aligned | 804px, stacked |
| Breadcrumb | #FAFAFA band, 108px, centred "Start › About › Who we are", current page underlined | same |
| Dividers | 1px #ACACAC (spine, grid), 2px underlines on links | |

### Reusable patterns (Roland Berger)

1. **Asymmetric reading column:** the H2 and body sit in one column starting about 44% across (5/12 offset, about 630px wide). The left side stays empty and holds nothing but the spine. Calm and confident. *KoKreaters:* long-form intros on About, Approach and each Expertise detail page. Use a 12-col grid with the H2 in cols 1 to 4 and text in cols 6 to 11, or text in cols 6 to 12 with the left side empty.
2. **Body 17 to 18 / 28:** lh 1.55 to 1.65 at 17 to 18px, in a 600 to 650px column. *KoKreaters body token:* Inter 18/29 (1.6), 680px max.
3. **Section kicker with a short rule:** a small label centred above the module with a 40x3px bar under it. *KoKreaters:* use as the home section kicker in 12 to 13px uppercase Inter w600 with a 32x2px navy rule. RB's italic serif kicker is their signature, so leave it.
4. **Mosaic tiles with hairline gaps:** 2-up and 3-up rows, 1 to 2px gaps, image on top, light-grey caption area with the title bottom-aligned and fixed caption heights so rows line up. *KoKreaters home "Latest insights" (3-up) and the Insights hub featured row:* use #F2F2F0 caption areas, title 22/30, 1px gaps or 24px gaps. Choose one and use it site-wide.
5. **Tag chip on image corner:** 12px bold uppercase, ls 1px, white chip, 24px inset. *KoKreaters:* the Format label (Report, Perspective, Case) on Insights card images.
6. **Square black buttons:** 48px tall, radius 0, uppercase 12px with letter-spacing. Paired buttons sit 4px apart, flush to the panel edge. *KoKreaters:* this square geometry with navy fill. Prefer sentence-case 16px w500 over 12px caps for readability.
7. **Mega menu by taxonomy:** a 3-column panel with group headings ("Industries", "Services") and 17px links at a 30px row pitch. Industries spans 2 columns; Services gets its own tinted column. *KoKreaters desktop nav:* one panel with "Industries (9)" over 2 columns and "Expertise (6)" in the third column on a slightly different navy tint. 16 to 17px links, 32px pitch.
8. **Header compaction:** 104px over the hero, then a fixed 72px solid bar once the hero is passed. *KoKreaters:* 80px transparent or white at top, then 64px white with a 1px bottom rule after about 120px of scroll.
9. **Utility bar:** a 48px top strip with 14px secondary links (Newsroom, Newsletter, Contact) above the main nav. *KoKreaters:* optional. If used, 36 to 40px with Newsletter and Contact only. It is cleaner to skip it and put Contact as the last nav item.
10. **Sibling sub-nav strip:** a 60px band under the hero listing the sibling pages, with the current one underlined. *KoKreaters Expertise and Industries detail pages:* a strip of the 6 expertise areas (or 9 industries, which scrolls horizontally on mobile) directly under the page hero.
11. **Short heroes:** 460 to 670px, so the first content block is visible at 900px viewport height. *KoKreaters:* home hero at most about 640px and interior heroes about 420 to 480px. This helps cut the home page from about 16,700px.
12. **Expert quote panel:** a greyscale round portrait, a large quote, a small attribution and buttons flush to the panel corner. *KoKreaters About (founder or partner quote) and Impact (client quote):* greyscale portraits fit the "desaturated cool" photo grade.
13. **End-of-page contact band:** H2 + one line + one button, generous bottom padding (120px). *KoKreaters:* closing CTA on every interior page ("Discuss a mandate"), #F2F2F0 band, navy button.
14. **Footer with an address grid:** a Phone/Mail label-value grid, circular outlined social icons and uppercase spaced legal links. *KoKreaters footer:* the office address block, using a label-value grid for phone and email.
15. **Breadcrumb band:** *KoKreaters detail pages:* put the breadcrumb at the top of the page (12 to 13px, under the header) rather than at the bottom like RB. Same styling: chevrons, current page plain.

### Do not copy (Roland Berger)
- RBDesign and Arnhem fonts. The italic serif kicker is their brand voice.
- The red "Jobs" flag, yellow #F6F600 link underlines, the mint/petrol/teal/aubergine tile colours, the black floating nav box, the "B" monogram hero, the "In like you" campaign art.
- **The vertical spine as a site-wide motif.** It is RB's signature. If KoKreaters wants a connective line, keep it inside the Approach step diagram only, drawn from the node-network signature, not as a page spine.
- Mobile body at 13/23 is too small. KoKreaters keeps 17 to 18px on mobile.

---

## 3. Kearney (kearney.com)

**Overall feel:** sparse and almost austere outside the hero. Narrow 1000px container, plain text-link lists instead of card grids, outline buttons, very thin lede type. The best reference for the Industries/Expertise index pages and for the "Your industry / Your needs" navigation.

### Measurements

| Item | Desktop 1440 | Mobile 390 |
|---|---|---|
| Page height | home 3,345; industry index 1,296 (no cards at all) | 3,862 / 1,809 |
| Font family | Proprietary grotesque sans throughout (Thin 100 to Semibold 600) | same |
| H1 (index) | 66/73 w600, #1E1E1E | 36/40 |
| Hero headline | 66/66 w600 white, centred over a full-bleed 1440x800 image carousel; subtitle 22/28 w300; outline button | 36/44, 16/26 subtitle |
| Section heading in tiles | 44/48 w400 | 24/30 |
| Lede / intro | 22/28 **w100 (thin)**, max 750px | 16/26 |
| Body | 16/24 w400 #1E1E1E | 16/24 |
| Industry list | 2 columns at x 220 and 564 (344px pitch), links 22/28 w400 in accent colour with a 1px light underline (#E6E6E6), 40px row pitch, 7 per column | single column, 24/30 |
| Container | 1000px at x = 220 (220px gutters); one 1140 instance | 20px gutters |
| Header | white, fixed, 101px; logo 232x25 at x 220; 6 links 16px w400 about 24px apart + search icon, right-aligned to x 1220; active item turns accent; height unchanged after scrolling | 51px: logo, search, burger |
| Mega panel ("Your industry") | full-width white panel under the header, about 600px tall, 1px #DBDBDB bottom rule; title "Your industry" 18px w600 accent underlined; 3 columns at x 220 / 550 / 880 (330px pitch); top-level links 16px (41px pitch); sub-sectors 14px indented 15px (31px pitch) | full-screen white sheet: 6 items 24px, 60px pitch, accent X close; level 2 slides in (18px w600 title, 18px w100 items, 16px sub-items) |
| Mega panel ("Your needs") | same panel, about 380px tall; group headings "Services", "Impact Networks" 16px w600 dark; links 16px light | |
| Buttons | outline only: 38px line-height + 1px border (about 40px tall), radius 0, padding 0 30px, 16px w400 sentence case, accent text and border on light; white on dark | full width, 40px |
| Feature tiles | 50/50 half-bleed: image 720x600 to the viewport edge; text side padded so the copy aligns with the container (x 220 or 820); "Article" 22px light → H 44/48 → meta 16px → outline button | stacked, image first |
| Card band | dark #1E1E1E band; 2 cards with 402x336 images (1.2:1), title 22px + 14px meta; about 66px vertical padding | 1 column with 1px #CCC rules between |
| "Read more insights" | #F5F5F5 band, about 270px tall, one centred 44px accent text link | 22px |
| Newsletter strip | #323232 band, 113px: one line 22px + outline "Sign up" button inline | stacked, centred, full-width button |
| Footer | #1E1E1E, centred: link row 16px, social icon row (5 square icons), 2 rows of 12px legal links in #CCC, logo | 2-column centred grid |
| Dividers | 2px focus outlines; 1px #DBDBDB under the mega panel; 1px #CCC between stacked mobile cards | |
| Hero carousel | 4 slides with titled tabs along the bottom; a 3px gradient bar (about 96px) marks the active slide | same |

### Reusable patterns (Kearney)

1. **Reader-centric nav labels:** "Your industry" / "Your needs" rather than "Industries" / "Services". *KoKreaters:* keep the page map and URLs, but consider "Your industry" and "Your challenge" as mega-panel titles, or as nav labels if the client agrees. Flag it to the client; it is a copy decision.
2. **Plain-text index page:** H1 + thin 22px intro + a 2-column list of large text links, no cards and no images. The whole page fits in 1,300px. *KoKreaters Industries index (9) and Expertise index (6):* a 3x3 (or 2x3) grid of name (22px) + one-line descriptor (16px #5A5A5A) + 1px top rule per item. This replaces the sideways card rails.
3. **Link list styling:** 22px links with a light 1px underline (not the text colour) and a 40px row pitch. On hover the underline turns accent. *KoKreaters:* index lists and "Related expertise" lists on detail pages. Use #306FE0 only on hover/underline and keep the text navy.
4. **Mega panel aligned to the container:** columns start exactly at the container edge (x 220) with a 330px pitch; top-level 16px, sub-items 14px indented 15px; a 1px rule closes the panel. *KoKreaters:* if a light (white) mega panel is chosen over RB's dark one, use this geometry: 3 columns of Industries + 1 column of Expertise inside the 1240 container.
5. **Narrow text container:** 1000px with wide 220px margins, so text never stretches. *KoKreaters:* a 1240 to 1280 container for grids and a 760px (or 8/12) inner width for text-led sections.
6. **Half-bleed 50/50 tiles:** the image runs to the viewport edge while the text column aligns with the container grid; sides alternate down the page. *KoKreaters home:* "Approach" teaser (image left) and "Impact" teaser (image right) as 2 alternating half-bleed tiles at about 560 to 600px tall, instead of separate long sections.
7. **Outline buttons in sentence case:** about 40px, radius 0, 1px border, 16px regular, padding 0 30px. *KoKreaters:* the secondary button style (navy outline on light, white outline on navy). Primary = solid navy, same geometry, 48px tall.
8. **Thin lede voice:** a 22px intro at a thin weight makes the page feel quiet. *KoKreaters:* Inter 300 at 21 to 22px / 1.45 for page intros. Inter 200 is too faint on Windows.
9. **Single big "more" link band:** a light-grey band with one centred 44px text link instead of a button. *KoKreaters home:* close the Insights section with "Read all insights →" at 28 to 32px serif.
10. **Compact newsletter strip:** one dark band about 110px tall, one sentence + an inline sign-up control. *KoKreaters:* a compact variant of the newsletter form above the footer on interior pages. The fuller BCG-style bar goes on the home page and Insights hub.
11. **Minimal centred footer:** link row, social row, legal row. *KoKreaters:* not recommended as the main footer (too thin for 6+9 pages). Its 12px legal row styling is reusable.
12. **Mobile menu:** a full-screen white sheet with 24px items at a 60px pitch, no dividers, an accent X, and the second level sliding in with its title in bold. *KoKreaters mobile nav:* level 1 = 7 items at 22 to 24px; tapping Expertise or Industries slides in level 2 (6 or 9 items, 18px).
13. **Card band on a dark field:** 2 large cards with archival greyscale photography on a near-black band. *KoKreaters Impact highlight:* a navy band with 2 or 3 case cards using desaturated photos.

### Do not copy (Kearney)
- Graphik (commercial licence) and the thin-weight-heavy rendering.
- Purple #7823DC accent, the "KEARNEY 100" gradient mark, the particle-globe hero art.
- The full-screen dark auto-rotating hero carousel with the dimming overlay. The KoKreaters brief asks for calm motion, so use a single static hero.
- The Osano consent bar and the floating accessibility widget.

---

## 4. Cross-site synthesis → proposed KoKreaters tokens

| Token | BCG | Roland Berger | Kearney | KoKreaters proposal |
|---|---|---|---|---|
| Container | 1280 @ x80 | 1280 @ x80 | 1000 @ x220 | 1240 max; gutters 80 (≥1440), 48 (1024 to 1439), 32 (768 to 1023), 20 (<768) |
| Reading measure | 748 | about 630 | 750 | 680 to 720 (8/12 cols) |
| H1 | 44 to 86, w300, lh 1.0 | 64/72 bold | 66/73 w600 | Source Serif 4, 60 to 64 / 1.05, w400; mobile 38 to 40 / 1.1 |
| H2 | 52 to 56, lh 1.0 | 45/59 | 44/48 | 44 to 48 / 1.1 w400; mobile 30 to 32 / 1.15 |
| H3 / card title | 24/28.8 light | 22/30 | 22/28 | 22 to 24 / 1.3, serif or Inter 500 (choose one) |
| Lede | 20/26 w300 | n/a | 22/28 w100 | Inter 300, 21 to 22 / 1.45, #5A5A5A or #1A1A1A |
| Body | 20/26 w300 | 17 to 18/28 | 16/24 | Inter 400, 18 / 1.6; mobile 17 / 1.6 |
| Label / eyebrow | 12 to 14 bold uppercase | 12 bold uppercase ls 1px | none | Inter 600, 12 to 13px uppercase, ls 0.08em, navy or #5A5A5A |
| Section padding | 56 + 56 | 40/50 + 96 separators | about 66 to 130 | 104 to 120 desktop, 64 mobile (one token) |
| Header | 73 floating, no compaction | 104 → 72 fixed | 101 fixed / 51 mobile | 80 → 64 on scroll; 60 mobile; 1px rule when compact |
| Button | 48, r15, caps bold | 48, r0, 12px caps | about 40, r0, outline, sentence case | 48 tall, r2, 16px Inter 500 sentence case, padding 0 28; primary navy fill, secondary 1px navy outline |
| Divider | 1px warm or grey | 1px #ACACAC | 1px #DBDBDB / #E6E6E6 | 1px #D9DCE0 (or navy at 12%) |
| Grid gap | 16 | 1 to 2 (mosaic) | about 30 | 24 (cards), 32 (feature tiles) |
| Card image | 3:4 portrait | about 1.6:1 | 1.2:1 | 3:2 for Insights and Impact cards; 16:9 for features; 1:1 or 4:5 for portraits only |
| Mobile menu | sheet, grouped, 1px rules | sheet, 22px + 18px | sheet, 24px, slide-in level 2 | full-screen white sheet; 22px level 1 at 56px rows; slide-in level 2 for Expertise and Industries |
| Footer | 4 col, beige | 3 zones, vertical rule | centred, dark | 4 columns on #F2F2F0 or navy; legal row 13px |
| Home length | 6,662px | 5,246px | 3,345px | ≤ 6,000px across 8 sections (currently about 16,700) |

Gaps these three sites do not cover (take them from McKinsey India/Global): a home **stat strip** (none of the three has one; the nearest is BCG's 32px light stat chip on case cards), and a full-width insight "hero article" treatment.

Motion seen: BCG and Kearney carousels auto-advance. RB and Kearney mega menus open on hover with no visible easing. None uses scroll-driven toys. KoKreaters: fade-up only (opacity 0 → 1, translateY 12px → 0, 400 to 500ms), hover underline and colour shifts, all off under `prefers-reduced-motion`.
