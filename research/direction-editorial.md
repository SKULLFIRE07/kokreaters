# Direction: THE EDITORIAL

KoKreaters.com · creative direction pitch · 4 Nov 2026
Inputs: research/BRIEF.txt (source of truth for every word and fact), research/DNA.md (tokens, bans, contrast facts), DESIGN-DIRECTION.md (stack), assets/ (logo, node-cluster SVG, founder portrait, brief wireframe).
Every headline, paragraph, stat and label below is quoted from the brief. Where this direction departs from the brief it says **DEVIATION** and gives the reason; those lines need Ganeaysh's sign-off. Anything marked [CONFIRM] carries over from brief section 11.

---

## 0. The idea in one sentence

**KoKreaters is published, not marketed: every page is set like an issue of a serious ideas journal written from the plant floor, where the argument and the type do the work, the network survives only as a 1px engraving drawn from the logo's own geometry, and motion is so quiet you notice it only when it finishes.**

What it is: a journal with a consultancy inside it. Datelines instead of icons, folios instead of section badges, sidenotes instead of tooltips, exhibits instead of illustrations, one rising arrow per page instead of decoration.
What it is not: a landing page. No cards on the home page, no gradients, no blobs, no count-ups, no scroll-jacking, no canvas in the hero.

---

## 1. Type pairing and scale

### 1.1 Pairing (keeps the DNA decision, adds one editorial move)

| Role | Face | File | Weight |
|---|---|---|---|
| Display, headlines, outcomes, numerals, quotes | **Fraunces Variable**, opsz axis, roman | `@fontsource-variable/fraunces` → `fraunces-latin-opsz-normal.woff2` | 67.3 KB, preloaded |
| **Long-form article body** (Insights only) | **the same Fraunces file at opsz 14, wght 380** | no extra bytes | 0 KB |
| Italic (pull quotes, standfirsts on articles, founder quote) | Fraunces Variable italic | `fraunces-latin-opsz-italic.woff2` | lazy, about 70 KB, never on the home critical path; the home founder quote is set in roman with a hanging Saffron mark until the italic has loaded, then swaps (no layout change: same metrics) |
| UI, labels, datelines, body on marketing pages, tables, forms | **Instrument Sans Variable** | `@fontsource-variable/instrument-sans` → `instrument-sans-latin-wght-normal.woff2` | 30.1 KB |

Why this pairing (and why not the brief's Plus Jakarta Sans): DNA 3.1 already makes the case; the editorial angle sharpens it. A journal needs a text face that disappears beside an expressive serif. Plus Jakarta's wide round geometry reads as "SaaS template"; Instrument Sans is a narrow, quiet neo-grotesk with tabular figures, so datelines, exhibit labels and the Approach engagement table align like a real ledger. **DEVIATION (inherited from DNA):** Plus Jakarta Sans → Instrument Sans. If refused, Plus Jakarta drops into the same scale at +0.005em tracking and nothing else changes.

The editorial move: **Insights articles are set in serif.** Fraunces' optical-size axis draws a sturdy, low-contrast text cut at opsz 14 from the file we already ship, so long reads feel like a journal, not a blog, at zero cost. Marketing pages stay sans-bodied for scanning. Considered and rejected: Newsreader + Inter (Inter is the most over-used UI face of the decade), Source Serif 4 (excellent but a second serif file, about 60 KB, for no visible gain over Fraunces' own text cut).

Fraunces rules: `font-optical-sizing: auto`; SOFT and WONK pinned at 0 by the file; display weight 330 (never 300 at opsz 144, which goes Bodoni-thin); never below 22 px except as article body (opsz 14). `font-feature-settings: "lnum","tnum"` on all numerals in proof and impact; `"onum"` on numerals inside article body text.

### 1.2 Scale (fluid, `clamp()` between 390 px and 1440 px)

| Token | Face / wght | Desktop | Mobile | Tracking | Used for |
|---|---|---|---|---|---|
| display | Fraunces 330 | 80 / 84 | 44 / 48 | -0.025em | Home H1 only |
| h1 | Fraunces 360 | 60 / 64 | 38 / 42 | -0.02em | Page titles, article titles |
| h2 | Fraunces 380 | 40 / 46 | 30 / 36 | -0.015em | Fold titles |
| index | Fraunces 360 | 44 / 50 | 28 / 34 | -0.015em | Pillar index rows, impact outcomes |
| h3 | Fraunces 420 | 26 / 32 | 22 / 28 | -0.01em | Insight titles, sub-sections |
| h4 | Instrument Sans 600 | 18 / 26 | 17 / 24 | 0 | Exhibit titles (20/28), small heads |
| standfirst | Fraunces italic 360 | 26 / 36 | 21 / 30 | -0.005em | Article dek only |
| lead | Instrument Sans 400 | 21 / 33 | 18 / 28 | -0.005em | Fold intros, hero sub |
| body | Instrument Sans 400 | 17 / 28 | 16 / 26 | 0 | Marketing pages |
| article-body | Fraunces 380, opsz 14 | 19 / 31 | 18 / 29 | 0 | Insights body, measure 64ch |
| dateline | Instrument Sans 600 caps | 12 / 16 | 12 / 16 | +0.14em | Datelines, folios, overlines. Mauve `#8C5B88` on light, Lavender on Imperial |
| meta / sidenote | Instrument Sans 500 | 14 / 22 | 14 / 22 | +0.005em | Captions, sources, sidenotes, reading time |
| stat | Fraunces 300 | 96 / 96 | 56 / 56 | -0.035em | Proof band numerals, Saffron on Imperial |
| quote | Fraunces italic 360 | 40 / 50 | 26 / 34 | -0.012em | Founder quote, pull quotes |

Ratio display:body is 4.7:1 desktop, so hierarchy comes from size, never from bold. One display size per page. `text-wrap: balance` on all headings, `pretty` on paragraphs, `hanging-punctuation: first` with a manual hang for the opening quote mark. Real typography in copy: ’ “ ”, – for ranges, U+2212 minus and a no-break thin space in "−25 °C"; percentages written as the brief writes them ("21%") and kept on one line with `white-space: nowrap`.

### 1.3 The editorial furniture (built from the type, not from graphics)
- **Folio:** each home fold opens with a dateline row: left, a number and the brief's overline (`01 · WHAT WE DO`); right, a running head in meta Graphite (`KoKreaters · Home`). A 1px Hairline runs the full content width above it. This replaces section badges and coloured overline chips.
- **Sidenote column:** a 3-column left margin (desktop ≥ 1280) carries sources and context in 14 px Graphite, e.g. beside each impact row: "From our founder's career · Wilmar, India". On smaller screens the sidenote moves above its paragraph.
- **The rising arrow:** the swoosh from the wordmark, redrawn as one 1.5 px Sapphire stroke, appears under **one** phrase per page, never more.
- **Ringed node bullets:** 8 px dot, 2 px white ring, pillar colour (brief 3.4). The only bullet on the site.

---

## 2. Colour use

Palette is the brief's, unchanged. Usage is stricter than the brief, inside DNA 5.3.

| Surface | Share of home by area | Token |
|---|---|---|
| Paper (main ground) | ~70% | White `#FFFFFF` |
| Second paper (hero, insights fold) | ~10% | Cloud `#F8F6FC` |
| Ink: headlines | — | Imperial `#3A1C5C` |
| Ink: body | — | Midnight Ink `#121833` |
| Ink: meta, sidenotes, running heads | — | Graphite `#4A5068` |
| Datelines and overlines | — | Mauve `#8C5B88` (Orchid fails on Cloud, DNA 5.2) |
| Line-work (all engraving, rules that mean something) | — | Sapphire `#2C509E` at 1 px; on Imperial use Sky `#4C9BE8` |
| Rules that only divide | — | Hairline `#E4E0EE` |
| Action: primary pill, links, active nav bar | ≤ 3% | Sapphire; hover Imperial |
| Two dark fields (proof band; CTA+footer merged) | ~16% | Imperial |
| Numerals and CTA on dark | ≤ 1% | Saffron `#F4C841` |
| Pillar colours | ≤ 1% | only as 8 px node dots, 2 px rules on hover, chips |
| Coral | 0% outside the logo and form errors | `#E5494D` |

Rules specific to this direction:
1. **The only saturated colour above the fold is inside the logo and five 6 px node dots.** Everything else is ink on paper.
2. **No gradients anywhere in the UI.** **DEVIATION** (brief: Aurora CTA band, Twilight dark hero, Sunrise 404). Aurora survives on off-site social banners; Sunrise survives as the 12 px fill of the single disconnected node on the 404; Twilight survives only as a photographic duotone on Impact case headers.
3. **Soft discs become line-work.** The three discs from the logo are drawn as 1 px circles stroked in Hairline `#E4E0EE` (Lavender, Ice and Butter are too pale to read as strokes), with a single 8% Lavender fill on the largest so the logo's warmth is still felt. **DEVIATION** from brief 3.4 (translucent filled discs); the editorial reading is that the discs are geometry, not glow.
4. No more than two pillar colours visible in one viewport except on the expertise index, where all six appear as dots beside their names (never colour alone; the name is always written).

---

## 3. The hero

### 3.1 Composition (1440 × 900, Cloud ground)

```
y=0     ┌ header 72px: logo (horizontal lockup, 160px) · Expertise Industries Approach Impact Insights About · [Start a conversation]
y≈200   │ INDEPENDENT TECHNICAL AND STRATEGY CONSULTING · FOOD, FEED AND SPECIALTY INGREDIENTS   ← dateline, Mauve, cols 1–9
y≈236   │ Where deep expertise                                                ┌──────── cols 9–12 ────────┐
        │ meets shared ambition.                                               │  1px engraving of the logo │
        │        ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾  ← rising arrow under "shared ambition"   │  cluster (5 rings, 5 lines)│
y≈440   │ KoKreaters helps food, nutrition and specialty-ingredient            │  extended into a 14-node   │
        │ businesses design better products, run better plants and make       │  sparse lattice, 3 hairline│
        │ bolder decisions, with 25 years of plant-to-boardroom leadership    │  disc outlines behind      │
        │ behind every recommendation.         ← lead, cols 1–6, max 34em      └─ bleeds 72px past right ───┘
y≈600   │ [Start a conversation →]   Explore our expertise →  ← pill + text link (not two pills)
y≈820   ├─ hairline ─────────────────────────────────────────────────────────────────────────────────
        │ BASED IN THE NETHERLANDS · WORKING WORLDWIDE            India · Indonesia · Ukraine · Türkiye · the Netherlands
```

- **Copy (brief 6.1, headline option A):** overline "Independent technical and strategy consulting · Food, feed and specialty ingredients"; H1 "Where deep expertise meets shared ambition."; sub "KoKreaters helps food, nutrition and specialty-ingredient businesses design better products, run better plants and make bolder decisions, with 25 years of plant-to-boardroom leadership behind every recommendation."; primary "Start a conversation" → /contact; secondary "Explore our expertise" → /expertise.
- **Foot rule (dateline):** left "Based in the Netherlands, working worldwide" (brief 6.8 direct details); right, the five countries from the brief positioning paragraph, set in meta Graphite. No numbers, no client names. This is the journal's masthead line.
- H1 breaks after "expertise" (balanced). The secondary action is a Sapphire text link with the rising-arrow underline, not a second pill: one filled shape per fold.
- **The engraving:** coordinates taken from `assets/logo/kokreaters-node-cluster.svg` (nodes at 144,184 · 416,135 · 291,316 · 480,431 · 211,500), scaled into a 520 px square, then extended with nine further rings on the same angles so the cluster reads as the visible corner of a larger network. Every stroke is 1 px Sapphire at 55% opacity; rings are 1px circles r=10 with a 2px white knockout; only the original five centres get a 6 px dot in their logo colours (Sapphire, Coral, Saffron, Sky, Cobalt). It is inline SVG, about 3 KB, `aria-hidden="true"`, with the header logo carrying the accessible name.
- **Mobile (390 × 844):** dateline at y≈112, H1 44/48 on three lines, lead, pill full-width, text link below. The engraving moves below the buttons at 100% width, 280 px tall, cropped to the five logo nodes plus four neighbours. H1 starts above y≈160; nothing pushes it down.

### 3.2 Motion, beat by beat

The H1, dateline, lead and buttons are **never animated**: they are the LCP and are painted in the first frame. Only the line-work moves.

| t (ms, from `document.fonts.ready`, capped at 600 ms after DOMContentLoaded) | What | Duration / ease |
|---|---|---|
| 0 | The three hairline disc outlines draw (DrawSVG 0→100%), from 12 o'clock, together | 1200 · `power2.inOut` |
| 150 | The five logo lines draw from the Saffron centre node outwards, stagger 70 ms | 700 each · `power2.inOut` |
| 500 | The nine extension lines draw, stagger 50 ms, outermost last | 600 each · `power2.inOut` |
| 300 → 1100 | Rings fade 0→1 opacity as their first line arrives (no scale) | 240 each · `power1.out` |
| 1100 | The rising arrow draws under "shared ambition" left to right; its head appears at 90% | 900 · `power2.inOut` |
| 1500 | The five centre dots fill to 6 px in their logo colours, stagger 80 ms: colour arrives last, like ink settling | 200 each · `power1.out` |
| 2100 | Done. **Nothing loops.** No drift, no cursor attraction, no Flip into the header. The page is still. | — |

Scroll: after `scrollY > 8` the header gains its hairline and shrinks 72→60 px over 180 ms (`ui-in`). The engraving does not parallax. Total hero motion: 2.1 s, once.

Why no ambient drift: with no loop over 5 s there is nothing to pause (WCAG 2.2.2 satisfied by design), no rAF cost after 2.1 s, and the stillness is the luxury.

---

## 4. The homepage, fold by fold

Order is the brief's (6.1). Layouts used on home: three only (split, index rows, full-width field). Each fold opens with a folio row (1.3). Section padding 128 desktop / 64 mobile.

**Reveal grammar for every fold below (`reveal`):** the fold's h2 rises by masked lines (SplitText `lines`, `yPercent: 100 → 0`, 720 ms, stagger 70 ms, `power3.out`), then its body block fades `opacity 0→1, y 12→0`, 480 ms, 120 ms after. Once only, triggered at `top 80%`. Content is visible without JS (`.js.motion .reveal` gates hiding; 600 ms safety timer).

### Fold 1 · Hero
As section 3.

### Fold 2 · Proof band (Imperial field)
- Folio: `02 · THE RECORD` left (dateline, Lavender) · right "From our founder's career".
- Layout: four columns divided by 1 px Sky-at-30% vertical rules. Each column: numeral in Fraunces 300 96 px Saffron, `tnum`; label in Instrument Sans 16/24 Lavender, max 22ch.
- Copy (brief): "25" · years in oils, fats and food ingredients | "5" · countries of plant and operational leadership | "3" · regions of teams led: Americas, EMEA, Asia-Pacific | "WHO" · Director-General recognition for trans-fat elimination work.
- Motion: **no count-up.** The four vertical rules draw top to bottom (DrawSVG, 900 ms, stagger 90 ms, `power2.inOut`), then numerals and labels fade 0→1 in 400 ms with them. **DEVIATION** from brief 3.7 ("Big numbers count up"): a count-up is the most template motion on the web, and "WHO" cannot count; a journal states its figures. Fallback if Ganeaysh wants it: a 600 ms count on the three integers only.

### Fold 3 · What we do (index rows, not cards)
- Folio: `03 · WHAT WE DO`.
- Split 5/7: left, h2 "Six ways we create value, together." and the intro "From the first idea to the last audit, we work wherever technology and business meet." Right, the index.
- The index: six rows, each 1 px Hairline top rule, 28 px padding. Row anatomy: `01` in meta Graphite · 8 px ringed node in pillar colour · pillar name in Fraunces `index` 44 px Imperial · promise in lead Graphite below (cols aligned) · "Learn more →" arrow right-aligned, visible always (not hover-only).
  - 01 Product and Category Innovation: From unmet need to a product that scales.
  - 02 Process Design and Plant Performance: Plants that run better, cost less and grow with you.
  - 03 Food Safety, Quality and Contaminants: Pass the audit. Protect the brand. Stay ahead of the regulation.
  - 04 Strategy, Feasibility and Market Entry: Clear answers for Go/No-Go decisions.
  - 05 M&A, Due Diligence and Partnerships: See what is really behind the deal.
  - 06 Capability, Leadership and Transformation: Leave stronger teams behind.
- Whole row is the link. Hover/focus: the top rule thickens to 2 px in the pillar colour (scaleX from left, 240 ms `ui-in`), the node gains a 1 px outer ring, the arrow moves 8 px. Saffron and Sky rules sit beside Ink text, never as text colour.
- Motion on enter: rules draw left to right, stagger 60 ms (500 ms each); text fades with them. **DEVIATION** from the brief's 3×2 pillar card grid (DNA anti-pattern 2).

### Fold 4 · The KoKreaters way
- Folio: `04 · THE KOKREATERS WAY`. h2 "Connect. Collaborate. Create."
- Layout: the one 4/4/4 split on the site. Above the three columns, a single 1 px Sapphire line runs across with three 24 px rings on it at each column start; the line ends in the rising arrow head at the right. Under each ring: step label (dateline) and the brief copy in lead.
  - Step 1 · Connect: "We start where the problem lives: on your plant floor, in your lab, with your customers. We listen first, then diagnose."
  - Step 2 · Collaborate: "We design the answer with your teams, not around them, so the people who will run it own it."
  - Step 3 · Create: "We build, test and scale the solution, then hand it over with the measures to prove it works."
  - Link: "How we work →" /approach.
- Motion: **no pin.** The line is scrubbed to scroll across the fold's height (`scrub: 0.6`, from `top 70%` to `bottom 60%`): as the reader moves down, the line travels from Connect to Create and each ring fills Sapphire when the line reaches it. The copy itself is static. This is the one scroll-tied effect on home, and it never holds the page. **DEVIATION** from DNA 6.2.3 (pinned method): pinning interrupts reading, which an editorial site must not do.
- Mobile: line becomes vertical down the left edge, same scrub.

### Fold 5 · Impact (from our founder's career)
- Folio: `05 · IMPACT · FROM OUR FOUNDER'S CAREER`. h2 "Results that started on the plant floor."
- Layout: four rows, set like a journal's contents page. Left sidenote column (cols 1–3): dateline, e.g. "INDIA · WILMAR". Main column (cols 4–12): the outcome in Fraunces `index` 44 px Imperial. Each row has a Hairline rule above. No images, no tint cards.
  - INDIA · WILMAR — "India's first world-class integrated specialty fats facility, built and activated."
  - INDONESIA · WILMAR — "**21%** growth in Indonesia by reshaping manufacturing operations."
  - UKRAINE · WILMAR — "Ukraine's first cold-climate crude palm oil refinery, commissioned at **−25 °C**, cost structure improved by **15%**."
  - CARGILL — "Trans-fat (iTFA) elimination work publicly recognised by the **WHO** Director-General."
  - Figures in bold are set in Fraunces 300 `lnum` at the same size, Sapphire. iTFA gets an `<abbr>` with "industrial trans-fatty acids" expanded on first use in a sidenote, per brief 7 (explain acronyms).
  - Link: "See the impact →" /impact.
- Former employers appear as words in datelines only, exactly as the brief writes them in brackets; never logos (brief 6, DNA 14).
- Motion: per row, the rule draws (500 ms), then the dateline and outcome fade up 12 px (480 ms). Nothing else.

### Fold 6 · Where we work (industries)
- Folio: `06 · WHERE WE WORK`. h2 "Where we work".
- Layout: the nine sectors set as one run-in paragraph in Fraunces h3 26/40 Imperial, separated by Hairline-coloured interpuncts, measure 22 em, like an index entry: "Confectionery · Bakery · Dairy and specialised nutrition · Plant-based · Snacks and food service · Edible oils and specialty fats · Personal care and oleochemicals · Pet food and animal nutrition · Industrial minerals and process inputs". Each sector is a link to `/industries#slug`, underline on hover/focus (offset 6 px, 1 px Sapphire).
- **DEVIATION:** chips become typeset links (brief 6.1 says "chips"). Chips are a UI pattern; a list of words is a sentence.
- Motion: none beyond the standard fade.

### Fold 7 · Insights (Cloud ground, the largest fold)
- Folio: `07 · INSIGHTS`. h2 "Ideas from the plant floor and the boardroom."
- Layout 7/5: left, the lead article as a cover story: format label (dateline, Mauve: "POINT OF VIEW"), pillar node + name, title in Fraunces h1 60 px, standfirst, byline "Ganeaysh Kulkarni · 8 min read · date". Image only if the CMS entry has one (3:2, 16 px radius); otherwise none, never a placeholder tint. Right, two stacked entries: format, title in h3, meta. Hairline between them.
- Content: automated from the CMS (brief 6.1). Launch content is the brief's first six suggested titles; at least two must be written before launch (brief open item 14). If fewer than three exist the fold shows what exists plus the newsletter line, never dummy cards.
- Newsletter strip at the foot of the fold: "Field notes from the plant floor and the boardroom. Once a month. No noise." · email field · "Subscribe".
- Motion: standard reveal; image hover `scale 1.03`, 300 ms; title underline on hover.

### Fold 8 · Founder
- Folio: `08 · FROM THE FOUNDER`.
- Layout: the quote across cols 2–11 in Fraunces quote 40/50 Imperial with a Saffron opening mark hung in the margin: "Co-creation and creativity are at the soul of everything we do. We do not just advise. We create with you." [CONFIRM: quote wording]. Below, an op-ed byline: 72 px circular portrait (`ganeaysh-avatar-640.png`, AVIF) with a 2 px Saffron ring · "Ganeaysh Kulkarni, Founder" · "Meet Ganeaysh →" /about. This is the portrait's only appearance on home.
- Note: lapel pin must be retouched or confirmed before use (DESIGN-DIRECTION 1).
- Motion: the opening mark fades in, then the quote fades as one block (no word-by-word splitting of the founder's words). 600 ms.

### Fold 9 · Call to action + footer (one Imperial field)
- h2 in Fraunces 48 px White: "Have a challenge worth solving together?"; body in Lavender: "Tell us about your product, your plant or your decision. The first conversation is on us." [CONFIRM: free first call]; Saffron pill with Imperial text "Book a 30-minute call".
- Behind the headline on the right, the logo cluster engraving again in 1 px Sky at 30%, static. Book-ends the hero.
- A Hairline-at-20% rule then the footer: reversed full lockup (pending vector, brief 3.1), three columns (Expertise six pillars · Company: Approach, Impact, About, Insights · Contact: office@kokreaters.com, WhatsApp +31 6 2215 7910, LinkedIn, "Based in the Netherlands, working worldwide"), bottom row "© 2026 KoKreaters™ · Privacy · Cookies · Terms · [CONFIRM: KvK / VAT]".
- **DEVIATION:** Aurora band → Imperial (DNA 5.3); footer Midnight Ink → Imperial.
- Motion: the rising arrow draws under "together" (900 ms) on enter. That is the page's second and last swoosh (hero, then close); the article template allows only one.

Home word count: about 620 words. Within DNA's 600–900.

---

## 5. Pillar page template (/expertise/[pillar])

Same skeleton for all six; the pillar colour appears in four places only: a 4 px rule across the top of the page header, the node beside the overline, the ringed bullets, and the chips in Related.

1. **Header (White):** breadcrumb "Expertise / Process Design and Plant Performance" (meta) · dateline "03 OF 06 · EXPERTISE" · h1 = the pillar headline, e.g. "Plants that run better, cost less and grow with you." · intro as lead in cols 1–7. Right margin (cols 9–12): a small engraving specific to the pillar, drawn from the node grammar only: one ring in the pillar colour with its line extending to the five-node cluster, showing where this pillar sits in the network. Draws once, 900 ms.
2. **What we help with:** h2 "What we help with", list with ringed bullets in the pillar colour, body 19/30, each item a single line where possible. Technical terms exactly as the brief (e.g. "3-MCPD and glycidyl esters").
3. **Typical deliverables:** set as a run-in line of nouns separated by interpuncts in Fraunces h3 (same device as Industries): "Process design basis · plant assessments · debottlenecking plans · commissioning support · technology transfer packages".
4. **From the record:** one related impact row in the home Impact style (sidenote dateline + outcome), e.g. Process Design gets the Ukraine refinery row, Food Safety gets the trans-fat row. Mapping proposed: Innovation → India facility; Process → Ukraine; Food Safety → WHO/iTFA; Strategy → Indonesia 21%; Due diligence → none until a KoKreaters engagement is cleared (render nothing rather than stretch a claim); Capability → none (same rule). [CONFIRM mapping]
5. **Related insights:** two or three entries tagged with this pillar, set as a list (format · title · reading time), not cards.
6. **Pillar-to-pillar line:** "Not sure where you fit? Start a conversation" and a compact row of the other five pillars with their nodes, so the network is always visible as navigation.
7. **CTA + footer field** (as home).

Pillar colour rules: Saffron (Strategy) and Sky (Capability) never become text; their header rule and bullets are the colour, their labels stay Ink (brief 3.2).

**/expertise overview:** h1 "Expertise that connects science, plants and strategy." · intro (brief) · the six index rows at full width (the home index, larger: name 56 px, promise and the first two "What we help with" items as a sidenote) · "Not sure where you fit? Start a conversation". **DEVIATION:** brief asks for a 2×3 card grid; the index does the same job with more authority.

**/industries:** one long page, nine anchored sections. Each section: dateline (sector number), h2 sector name, the brief's two-line copy as lead, links to relevant pillars as node + name. A sticky left index on desktop lists the nine sectors; current one marked with a 2 px Sapphire bar. Photo per sector only from licensed material photography (raw materials, textures, never people stock); until sourced, no image. Tint panels from the brief become Hairline-ruled sections. **DEVIATION** (tint panels).

---

## 6. About (/about)

1. **Header:** dateline "ABOUT" · h1 "Built on 25 years of making ingredients work." · intro lead (brief). Right: the studio portrait (`ganeaysh-portrait-1665x2048.png`, 4:5, AVIF ~90 KB at 720 w) in a half-stadium mask (DNA 7.1), with the three disc outlines in hairline behind it. No parallax.
2. **The long bio** (brief, ~260 words) set as an article: Instrument Sans 19/31, measure 64ch, with sidenotes in the margin carrying the dates and places the bio already names (2001 Wilmar; 2012 Cargill; 2023–2026 Global Product and Process Design Director). Drop the opening "Ganeaysh Kulkarni founded KoKreaters in 2026…" as a Fraunces 26 px first paragraph. [CONFIRM 13: founding year and dates]
3. **Career timeline:** a single horizontal 1 px Sapphire line with four rings: CFTRI Mysore (1999–2001) → Wilmar (2001–2012) → Cargill (2012–2026) → KoKreaters (2026). Vertical on mobile. Line draws on enter, 1200 ms; rings fill as reached. Organisation names as text only, no logos.
4. **The map: home of the site's one Three.js moment** (section 11). Caption: the eight places from the brief.
5. **The name:** a short panel: "Ko stands for together: co-creation, collaboration, community. Kreaters are the people who make things happen." and the tagline Connect · Collaborate · Create, with the full logo lockup at 220 px (its minimum size, brief 3.1). This is the only place the full lockup appears in the page body.
6. **Education and languages:** two-column list (brief): CFTRI Mysore, University of Pune, IIM Ahmedabad, UC Berkeley EDGE; English, Hindi, Marathi, conversational Bahasa Indonesia, basic Russian.
7. **Client names:** sectors only by default [CONFIRM 5].
8. CTA + footer.

---

## 7. Approach (/approach)

1. Header: h1 "We create with you, not for you." with the rising arrow under "with you" (the page's one swoosh). Intro lead (brief).
2. **Method, expanded:** the home line-and-three-rings device at full width, then each step as a section: step name in Fraunces h2, the brief step copy as lead, then a three-row definition list "What we do / What you get / Typical duration". The brief asks for these fields but gives no copy for them beyond the step sentence, so they ship as [CONFIRM] placeholders in the CMS, visibly marked in staging and hidden in production until filled. Nothing is invented.
3. **Principles:** five numbered rows (index style): "Plant floor to boardroom", "Your team owns the result", "Global playbook, local execution", "Evidence before opinion", "Confidential by default", each with the brief copy as a sidenote-aligned paragraph.
4. **Ways to work with us:** a real table, the only `<table>` on marketing pages: Model / Typical shape / Good for, five rows from the brief, Instrument Sans `tnum`, Hairline rows, no zebra, no borders on columns. On mobile each row becomes a stacked definition block. [CONFIRM 10]
5. CTA + footer.

---

## 8. Impact (/impact)

1. Header (Imperial field, the page's dark moment instead of a gradient): dateline "IMPACT" · h1 in White "Results that started on the plant floor." · lead in Lavender. **DEVIATION:** brief's dark hero uses Twilight gradient + duotone photo; here flat Imperial, plus a Twilight duotone photo only if a licensed material photograph is sourced.
2. **Part one: From our founder's career.** Four case entries, each a full-width editorial block using the brief's card template fields (6.5), set as a document, not a card:
   - context line (dateline): e.g. "PROCESS DESIGN · UKRAINE · FROM OUR FOUNDER'S CAREER (WILMAR)"
   - outcome as h2: "Ukraine's first cold-climate crude palm oil refinery"
   - three labelled paragraphs in a 3/9 grid: "The challenge" / "What was done" / "The result" (brief copy for card 3; the other three cards are built from the brief's facts only, with any field the brief does not supply left [CONFIRM] rather than written)
   - tags as pillar node + name.
   - One figure per case, where the brief gives one, set as a stat in Fraunces 300 72 px Sapphire with a 14 px source line "From our founder's career, Wilmar, Ukraine": "15%", "21%", "−25 °C".
3. **Part two: KoKreaters engagements (anonymised).** Three rows, brief text verbatim, each with dateline "KOKREATERS ENGAGEMENT". Two carry [CONFIRM 6: client consent]; ship only the cleared ones.
4. **Testimonials:** slot exists, hidden until two to four quotes with written permission exist (brief 6.5). No placeholder quotes.
5. CTA + footer.

---

## 9. Insights hub (/insights) and article (/insights/[slug])

### 9.1 Hub
- Header: dateline "INSIGHTS" · h1 "Ideas from the plant floor and the boardroom." · one-line description (brief SEO meta: "Points of view and field notes on specialty fats, refining, contaminants, audits and growth in food and ingredients.").
- **Featured:** the newest Point of view as a cover story (as home fold 7, larger).
- **Filters:** two rows of plain text toggles, not chips: "Pillar: All · Product · Process · Food safety · Strategy · Deals · Capability" (each with its node) and "Format: All · Point of view · Field notes · Explainer". `aria-pressed`, URL query state, works without JS (links to `?pillar=`), filtered with Flip on JS (list reorders in 400 ms, `power2.inOut`).
- **List:** a chronological contents list, one row per article: date (meta, `tnum`) · format (dateline) · title (Fraunces h3) · standfirst one line · reading time · pillar node. Hairline rules. No thumbnails in the list; an image belongs to the article.
- **Newsletter:** "Field notes from the plant floor and the boardroom. Once a month. No noise." + Subscribe, consent recorded (brief 9).

### 9.2 Article template (the heart of the direction)
1. Running head: "KoKreaters Insights · Point of view" left; reading time right.
2. Header: pillar node + name, h1 title (Fraunces 60), standfirst in Fraunces italic 26/36 Graphite, byline row: 40 px ringed avatar · "Ganeaysh Kulkarni" · date · reading time. A 1 px Hairline, then the body.
3. **Body:** Fraunces opsz 14, 19/31, measure 64ch, `onum`, the first four words of the first paragraph set in Instrument Sans 600 caps at 0.08em tracking (a journal lead-in, no ornamental drop cap). H2 in Fraunces 32 with 72 px above. Paragraphs ≤ 90 words; an exhibit, quote or subhead every 350–400 words (DNA 3.3).
4. **Sidenotes** (desktop ≥ 1280, left margin): numbered, Instrument Sans 14/22 Graphite, aligned to their reference; footnotes at the end on smaller screens. Acronyms expanded on first use (CBE, FSQR, iTFA, 3-MCPD).
5. **Exhibits:** "Exhibit 1" label (dateline, Mauve) · title as a sentence stating the finding (h4 20/28) · units subtitle · flat SVG, max three series (Sapphire, Amethyst, Sky), Saffron to highlight one bar · direct labels · 1 px Hairline gridlines · source line 14 px · frame = measure + 120 px. Data only from the author; no exhibit is ever drawn from invented numbers. Bars grow once on enter, 600 ms `power2.out`.
6. **Pull quote:** Fraunces italic 34/44 Imperial, Saffron mark hung, 1 px Sapphire rule left. Max one per 1,000 words.
7. **Key takeaways:** a Hairline-bordered box (16 px radius, the one "box" on the page) with up to five ringed bullets.
8. **Author box:** short bio (brief, ~60 words) + "Meet Ganeaysh →".
9. **Related:** three articles as a contents list.
10. CTA + footer.
- Reading progress: a 1 px Sapphire rule under the header, `scaleX` tied to article scroll. Hidden under reduced motion (the running head shows "x min left" instead).
- Sticky table of contents at ≥ 1280 px for articles over 1,500 words, in the right margin, meta size.
- JSON-LD Article + BreadcrumbList (brief 8).

---

## 10. Contact (/contact) and 404

### 10.1 Contact
- Split 5/7. Left: h1 "Let's create something together." · intro "Tell us a little about your challenge. Ganeaysh reads every message personally and replies within one working day." [CONFIRM 9] · direct details as a typeset address block: office@kokreaters.com · WhatsApp +31 6 2215 7910 · linkedin.com/in/ganeayshkulkarni · "Based in the Netherlands, working worldwide" · the booking link "Book a 30-minute call" as the page's one Sapphire pill.
- Right: the form, labels above fields (brief 6.8 field list verbatim), inputs 10 px radius with `#7C8197` borders (DNA 5.2: Hairline fails 1.4.11), Cobalt 3 px focus ring offset 2 px, 48 px tall, inline errors in Coral with icon + "Please fill this in so we can reply.", success "Thank you. Your message is with us and Ganeaysh will reply within one working day." Consent checkbox text verbatim. Honeypot + Turnstile (invisible). No motion on the form ever.
- The page is reachable in one click from every page (header pill).

### 10.2 404
- White page. Centre: the five-node logo engraving in 1 px Sapphire, with one node (the Coral one, top right) displaced 48 px outward, its line drawn as a 1 px dashed stroke; the displaced node's dot is the site's only Sunrise fill (12 px). Headline "This page hasn't been created yet." · line "Let's connect you back." · pill "Take me home".
- Motion: on hover or focus of "Take me home", the displaced node slides back along its line (480 ms, `power2.inOut`) and the dash becomes solid. Drag-to-reconnect (DNA) is kept as a progressive extra on pointer devices: dragging within 24 px of its socket snaps it home and navigates to /. Keyboard users get the button; the drag is never required.
- **DEVIATION:** Sunrise gradient page background → a single Sunrise dot.

---

## 11. The Three.js moment, and why it lives on About, not Home

**Placement: About, section 4, "The map".** **DEVIATION** from DESIGN-DIRECTION/DNA (golden-oil shader into Industries on home).

Why: the editorial home earns its authority by being still. A shader between Impact and Insights would be the loudest thing on the page and would sit between the proof and the ideas, exactly where the reader is deciding to trust us. The About map, by contrast, is already in the brief, already about connection, and is the one place where a third dimension carries meaning: a career that literally travelled around the globe. It also takes Three.js entirely off the home page's weight budget.

The scene, "The engraved globe":
- An orthographic sphere drawn only as line-work: 18 meridians and 9 parallels as 1 px Hairline `LineSegments`, and continental coastlines as a low-poly 1 px Graphite-at-40% outline (Natural Earth 110m, simplified to ~6 KB of coordinates). No textures, no lighting, no bloom.
- Eight ringed nodes (sprites drawn from the logo ring) at Mundra, Kakinada, Gurugram, Pune, Medan, Odessa, Balikesir, Amsterdam (brief 6.7), each labelled in HTML (CSS2D-style overlay, real text, selectable, translated by the screen reader as a list).
- Great-circle arcs in 1.5 px Sapphire between them in career order (India sites → Medan → Odessa → Balikesir → Amsterdam), each lifted slightly off the surface.
- **Scroll-scrubbed, not autoplayed:** the section is 160 vh tall with the canvas `position: sticky` (CSS sticky, not a GSAP pin, so Lenis and keyboard scroll stay native). As the reader scrolls, the globe rotates from India to the Netherlands (about 85° of longitude, `scrub: 0.8`) and each arc draws as its endpoint faces the reader. The timeline beside it highlights the matching chapter of the bio. Stopping scroll stops everything; no loop, no pause button needed.
- Pointer: none. No drag-to-spin (it hijacks scrolling on trackpads).
- Budget: three.js r16x core imported as named ES modules (`OrthographicCamera`, `BufferGeometry`, `LineSegments`, `LineBasicMaterial`, `Sprite`), tree-shaken to ≈ 120 KB gzip + 10 KB scene code + 6 KB coastline. Loaded by `IntersectionObserver` at 1.5 viewports before the section, after `requestIdleCallback`, desktop and tablet ≥ 768 px with `navigator.hardwareConcurrency ≥ 4`. DPR capped at 1.5. Rendered on demand only (render on scroll tick; zero rAF when idle). Disposed on route change.
- Accessible equivalent always in the DOM: an `<ol>` of the eight places in career order, visually the labels.
- Fallback (mobile < 768, reduced motion, WebGL unavailable, or JS off): a static inline SVG of the same globe at the Amsterdam-facing angle with all arcs drawn (~14 KB). Visually the same engraving, just still.

Home keeps a quiet echo: the CTA field's static cluster engraving. If Ganeaysh insists on a home-page WebGL moment, the fallback proposal is the same globe, small (360 px), in the proof band beside "5 countries", static until scrolled and scrubbed through 40°; it would still load after LCP and add ≈ 135 KB lazily.

---

## 12. Reduced-motion fallbacks

All timelines live inside `gsap.matchMedia()` with two branches: `(prefers-reduced-motion: no-preference)` and `reduce`. Lenis is not instantiated under `reduce` (and is destroyed if the preference flips), and is bypassed when focus is keyboard-driven (`:focus-visible` on a link triggers native `scrollIntoView`).

| Element | Default | `reduce` |
|---|---|---|
| H1, LCP, body copy | never animated | never animated |
| Hero engraving (lines, discs, arrow, dots) | draws over 2.1 s | rendered complete in the HTML (the SVG ships drawn; JS sets dash offsets only in the default branch) |
| Fold h2 SplitText lines | masked rise 720 ms | no split at all; opacity 0→1 in 200 ms, or none if JS is late |
| Body fade-ups | 480 ms, 12 px | opacity only, 200 ms |
| Proof band rules | draw 900 ms | drawn |
| Index row hover | 240 ms rule + 8 px arrow | colour change only, instant |
| Method line scrub | scrubbed to scroll | line drawn, all three rings filled |
| Impact rules | draw 500 ms | drawn |
| Swooshes | draw 900 ms | drawn |
| Insights filter Flip | 400 ms reorder | instant reorder |
| Article progress rule | scroll-linked | hidden; "x min left" text in running head |
| Exhibit bars | grow 600 ms | final values |
| About globe | WebGL, scroll-scrubbed | static SVG globe |
| About timeline | draws 1200 ms | drawn |
| 404 node | slides home on hover | snaps home on hover; drag still works (user-initiated) |
| Header shrink | 180 ms | instant |

Without JS at all: every page is complete and readable, all lines drawn, all content visible, filters work as links, the form posts.

---

## 13. Performance plan

Targets (brief 9): LCP ≤ 2.5 s mobile, INP ≤ 200 ms, CLS ≤ 0.1 (we aim < 0.05), home ≤ 1.5 MB, Lighthouse 90+.

**LCP element:** the H1 text, painted with Fraunces preloaded (`<link rel="preload" as="font" type="font/woff2" crossorigin>` for the 67 KB file only) and a metric-matched Georgia fallback (`size-adjust`, `ascent-override`) so swap causes no shift. No hero image exists to compete.

**Home budget (gzip/brotli transfer):**

| Item | KB |
|---|---|
| HTML (Astro static, includes inline SVG engravings ~6 KB) | 22 |
| Critical CSS inlined; rest of CSS deferred | 14 + 18 |
| Fraunces opsz roman (preloaded) | 67 |
| Instrument Sans variable | 30 |
| JS: GSAP core 27 · ScrollTrigger 18 · SplitText 6 · DrawSVG 3 · Lenis 4 · site code 8 | 66 |
| Founder avatar AVIF 144 px @2x | 12 |
| Logo (SVG once supplied; PNG fallback 200 w AVIF meanwhile) | 6–18 |
| Insight lead image (lazy, AVIF 3:2, 960 w), if present | 70 |
| **Total** | **≈ 320 KB** (budget 1.5 MB: 21% used) |

No Flip, no Three.js, no italic font, no analytics before consent on home. Flip loads only on /insights; three.js only on /about; Fraunces italic only on /insights/* and /about.

Rules:
- Astro islands: one `motion.ts` module, loaded `type="module"` with `defer` semantics, initialised after `document.fonts.ready` (capped at 600 ms). Page-specific motion via dynamic `import()` keyed on `data-page`.
- GSAP plugins registered per page; ScrollTriggers killed on Astro view-transition `astro:before-swap` (or no view transitions at all: plain multi-page navigation is preferred for simplicity and bfcache).
- Lenis `lerp: 0.12`, `syncTouch: false` (native touch), `ScrollTrigger.update` on `lenis.on('scroll')`, `gsap.ticker.lagSmoothing(0)`. Anchor links and `scroll-margin-top: 84px` respected.
- Images: `<picture>` AVIF → WebP, explicit `width`/`height`, `loading="lazy"` and `decoding="async"` below the fold, `fetchpriority="high"` on nothing (the LCP is text).
- Fonts subset to Latin plus `−` `°` `’` `“` `”` `·` `→` `ü` (Türkiye) and `₹`/`€` reserve; checked with glyphhanger in CI.
- CI gates: Lighthouse CI (mobile, simulated 4G) on /, /about, one article; bundle-size check fails the build if home JS > 80 KB or total > 600 KB; axe-core on every route; a Playwright pass with `reducedMotion: 'reduce'` screenshots each route.
- Hosting: static on Cloudflare Pages, Brotli, `Cache-Control: immutable` on hashed assets. Sanity optional later for Insights/Impact (brief requires self-edit; Astro content collections + a Git-based editor such as Decap/Keystatic is the zero-cost interim).

---

## 14. Accessibility notes specific to this direction
- Contrast: every text pairing is from DNA 5.2's passing list. Datelines in Mauve (5.29 white / 4.94 Cloud). Lavender on Imperial 10.8. Saffron on Imperial 8.79. Sapphire links on Cloud 7.12.
- Index rows and insight rows are single links with the whole title as the accessible name; arrows `aria-hidden`.
- Sidenotes are real `<aside>` elements referenced by `aria-describedby` from their anchor in the text; on mobile they sit inline in reading order.
- Focus: Cobalt 3 px ring on light, Saffron on Imperial, always visible, never removed for mouse users only via `:focus-visible`.
- Touch targets ≥ 44 × 44 (index rows are 96 px+ tall).
- Engravings `aria-hidden`; the globe has its `<ol>` equivalent; exhibits have a visually hidden data table.
- Text resizes to 200%: all type in `rem` via `clamp()`; the sidenote column collapses into flow at 200%.

---

## 15. What makes it unmistakably KoKreaters, not a template

1. **The only drawing on the site is the logo's own geometry.** Hero engraving, method line, timeline, pillar diagrams, 404, the globe's rings: all built from the five node coordinates and ring proportions in `kokreaters-node-cluster.svg`. No stock icon set, no illustration style borrowed from anywhere.
2. **The rising arrow from the wordmark** is the site's only flourish, used once or twice per page, always under a phrase about togetherness ("shared ambition", "with you", "together").
3. **Datelines carry real places from the brief:** India, Indonesia, Ukraine, Türkiye, the Netherlands; Mundra to Amsterdam on the globe. A template cannot have these; they are the founder's career.
4. **Numbers set like evidence, not decoration:** "−25 °C" with a true minus and thin space, "21%", "15%", "WHO", each with a source line saying "From our founder's career". No count-ups, no superlatives.
5. **The journal is the product:** Insights is the largest fold on home, articles are set in serif with sidenotes and numbered exhibits about 3-MCPD, CBEs and bleaching earth. Nobody else in oils-and-fats consulting publishes like this.
6. **Connect · Collaborate · Create structures the site**, not just the method fold: the hero engraving connects, the index and method collaborate, the CTA creates; the line that starts in the hero ends in the arrowhead above "Book a 30-minute call".
7. **Colour behaves like the logo:** jewel colours exist only as small nodes, exactly as they do in the mark, on a page of ink and paper.
8. **What is absent:** gradients, blobs, cards on home, chips on home, stock people, logo walls, carousels, video, cursor effects, marquee, magnetic buttons, count-ups, pins. Restraint you can measure.

---

## 16. Deviations needing Ganeaysh's sign-off (summary)
1. Plus Jakarta Sans → Instrument Sans (inherited from DNA).
2. Insights article body in Fraunces text optical size.
3. Proof band: no count-up; rules draw instead.
4. Pillars and Expertise overview: index rows, not card grids.
5. Method: scroll-scrubbed line, no pin.
6. Industries: typeset links, not chips; ruled sections, not tint panels.
7. No gradients in UI: Aurora CTA → Imperial; Twilight hero → flat Imperial; Sunrise 404 → one Sunrise dot.
8. Soft discs drawn as hairline outlines, not translucent fills.
9. Footer Midnight Ink → Imperial, merged with the CTA field.
10. The single Three.js scene moves from home to About (engraved globe), with a home fallback proposal.
11. Hero network: static after a 2.1 s draw; no drift, no cursor attraction, no Flip into the header.
