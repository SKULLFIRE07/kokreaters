# Direction: THE MATERIAL

KoKreaters.com, creative direction pitch, 4 Nov 2026.
Inputs: `research/BRIEF.txt` (source of truth for copy and facts), `research/DNA.md` (type, colour, motion and anti-pattern decisions this direction inherits), `DESIGN-DIRECTION.md` (stack), assets in `assets/`.
All page copy below is quoted from the brief. Where a line is not in the brief, it is marked **[NEW: needs owner OK]**. Lines needing Ganeaysh's sign-off keep the brief's **[CONFIRM]**. Nothing here adds a claim, number or client name.

---

## 0. The idea in one sentence

**A single drop of golden oil, lit like a specimen on white paper, cools as you scroll until its fat crystals knit into a network, and that network settles into the KoKreaters node cluster. The science of the material becomes the mark, and everything around it stays white and quiet.**

Why this is the right story, not just a pretty effect:
- Fat crystallises into a **network**. The logo is a **network**. The two visual languages are the same thing at different scales, so the WebGL scene is the logo explained, not decoration beside it.
- Liquid → nucleation → crystal network maps onto **Connect → Collaborate → Create** without forcing it: separate parts meeting, structure forming together, a solid thing that holds.
- It is the one thing no generic consultancy can show, and it is exactly where the founder's 25 years sit: oils, fats and specialty ingredients.

The rule that keeps it premium: **the material appears in exactly three places** (the hero drop, the pinned method, and a handful of licensed macro photographs). Every other pixel is white, Cloud, ink and hairline.

---

## 1. Type

### 1.1 Pairing: Fraunces Variable + Instrument Sans Variable (inherits DNA §3)

| Role | Family | Package / file | Weight (Latin woff2) |
|---|---|---|---|
| Display, h1-h3, stats, quotes | Fraunces Variable, roman, `font-optical-sizing: auto`, SOFT 0, WONK 0 | `@fontsource-variable/fraunces` → `fraunces-latin-opsz-normal.woff2` | 67.3 KB |
| Pull-quote italic (About, Insights articles only) | Fraunces Variable italic | `fraunces-latin-opsz-italic.woff2` | lazy, never on Home |
| Body, UI, labels, figures | Instrument Sans Variable | `@fontsource-variable/instrument-sans` → `instrument-sans-latin-wght-normal.woff2` | 30.1 KB |

Total on Home: about 97 KB. Preload Fraunces only.

**Why keep the DNA's swap of Plus Jakarta Sans for Instrument Sans (DEVIATION from the brief, needs owner OK):**
1. The material direction is a laboratory register: specimen, sample, micrograph. Instrument Sans is a tight neo-grotesk with tabular figures. It reads like a lab label and an instrument readout. Plus Jakarta Sans reads like a SaaS landing page.
2. Fraunces at high optical size has the softness of a meniscus, with round terminals and gentle contrast. It is the "warm liquid" voice. The sans is the "measured" voice. That pairing is the whole brand in two faces: warm expertise, precise method.
3. The fallback is clean. If Ganeaysh prefers the brief's face, Plus Jakarta Sans (27.3 KB) drops into the same scale with tracking +0.005em, and nothing else changes.

I considered and rejected:
- **Newsreader / Source Serif 4.** They are cleaner but colder, and they lose the soft roundness that echoes the logo's lettering.
- **A mono for lab labels.** A third family adds weight and reads as "tech startup". Instrument Sans in caps with `tnum` does the job.

### 1.2 Scale (DNA §3.2, unchanged; listed here so this file stands alone)

| Token | Setting | Desktop | Mobile |
|---|---|---|---|
| display | Fraunces 330, -0.025em | 76/80 | 44/48 |
| h1 | Fraunces 360 | 56/60 | 38/42 |
| h2 | Fraunces 380 | 40/46 | 30/36 |
| h3 | Fraunces 420 | 26/32 | 22/28 |
| h4 | Instrument 600 | 18/26 | 17/24 |
| lead | Instrument 400 | 21/33, measure 34em | 18/28 |
| body | Instrument 400 | 17/28 (article 18/30), 66ch | 16/26 |
| meta | Instrument 500 | 14/22 | 14/22 |
| overline | Instrument 600 caps +0.14em, Mauve `#8C5B88` | 12.5/16 | 12/16 |
| stat | Fraunces 300, `lnum tnum` | 72/72 | 48/48 |
| quote | Fraunces 360 roman on Home / italic elsewhere | 34/44 | 26/34 |
| **specimen label** (new to this direction) | Instrument 500 caps +0.1em `tnum`, Graphite, 12/16 | the only place a "lab" register shows | same |

**Specimen label** is the material direction's one typographic signature. It is a tiny caption set beside the drop and each macro plate, like a slide label under a microscope. It carries only true, non-claim words: plate numbers and the subject. For example, `PLATE 01 · OIL, LIQUID`, `PLATE 02 · CRYSTALS FORMING`, `PLATE 03 · NETWORK`. **[NEW: needs owner OK]** These labels describe the picture; they claim nothing.

Setting rules (DNA §3.3):
- `text-wrap: balance` on headings.
- Use a real minus and a thin no-break space in "−25 °C".
- Headlines in sentence case.
- Never set Fraunces under 22px.

---

## 2. Colour

The palette is the brief's palette, with the proportions from DNA §5.3. The material direction changes **where the warmth comes from**: Saffron and gold are not painted onto UI. They arrive as *light through oil*, inside the render and the photographs.

| Role | Token | Hex | Share of a light viewport |
|---|---|---|---|
| Ground | White, Cloud for alternate bands | `#FFFFFF` / `#F8F6FC` | ≥ 85% |
| Headlines | Imperial Purple | `#3A1C5C` | type only |
| Body | Midnight Ink | `#121833` | type only |
| Meta, specimen labels | Graphite | `#4A5068` | type only |
| Action (primary pill, links, active nav bar) | KK Sapphire | `#2C509E` | ≤ 3% |
| Overlines | Mauve | `#8C5B88` (Orchid fails on Cloud) | type only |
| Dark bands (proof band, CTA+footer) | Imperial | `#3A1C5C` | 2 per page max |
| Numbers on dark, CTA on dark | Saffron | `#F4C841` | ≤ 5% of a dark viewport |
| Wayfinding | six pillar colours | brief §3.2 | dots, 4px bars, chips only |
| Errors | Coral | `#E5494D` | with icon and text |

**Material colours (render and photo grade only, never UI tokens).** These are defined for the shader so the oil's colour is controlled and matches the brand:

| Shader uniform | Value | Derivation |
|---|---|---|
| `uOilThin` (thin path, edges) | `#FFEEB0` | brief Butter |
| `uOilMid` | `#F4C841` | brief Saffron |
| `uOilDeep` (long path through the drop, absorption) | `#B9821A` | **[NEW: needs owner OK]** a darker Saffron for Beer-Lambert absorption; never used for text or surfaces |
| `uCrystal` (crystal highlights, cool rim light) | `#EADCFF` / `#D6E2FA` | brief Lavender and Ice, the logo's soft discs |
| `uNode*` (final cluster) | Sapphire, Coral, Saffron, Sky, Cobalt | the logo's five node colours, exactly |

This means the three soft discs of the logo appear in the render as cool rim light, and the five nodes appear as the final crystal sites. The brand palette is *inside* the material.

There are no gradients in the UI: no Aurora band and no Twilight hero (DNA §2.1).

**Photo grade:**
- Neutral white balance plus 200 K warm.
- Whites stay white, so the photo melts into the page.
- No vignette and no duotone on material plates.
- Photos sit on `#FFFFFF`, so they are shot or retouched on a white or very pale ground.

---

## 3. The hero

### 3.1 Composition (1440 × 900)

```
| 72px header: horizontal logo (cluster+wordmark) · Expertise Industries Approach Impact Insights About · [Start a conversation] |
|                                                                                                                           |
|   ~200px headroom                                                              ┌──────────────── cols 8-12 + bleed ──┐ |
|   OVERLINE (Mauve, caps)                                                       │                                     │ |
|   Independent technical and strategy consulting ·                             │        ( the drop )                 │ |
|   Food, feed and specialty ingredients                                         │      golden, refractive,            │ |
|                                                                                │      resting on white               │ |
|   Where deep expertise                                                         │   caustic light pooled beneath      │ |
|   meets shared ambition.        ← display 76/80, Imperial, cols 1-7            │                                     │ |
|            ‿‿‿‿‿‿‿‿‿‿‿‿‿‿‿→     ← rising-arrow swoosh under "shared ambition"  │   PLATE 01 · OIL, LIQUID  (label)   │ |
|                                                                                └─────────────────────────────────────┘ |
|   Sub (lead 21/33, Ink, 34em)                                                                                             |
|   [Start a conversation →]  Explore our expertise →                                                                       |
|                                                                                          ⏸ (44×44 pause, bottom right)   |
```

- **Left, columns 1-7.** Text block, top-aligned to about y = 200. The H1 breaks after "expertise".
- **Right, columns 8-12, bleeding 72px past the right content edge.**
  - A single drop of golden oil, about 420px across. It rests on the white ground, slightly flattened as a sessile drop would be (contact angle about 40°).
  - The drop is refractive: the white page behind it bends through it.
  - Beneath it, a pool of **caustic light** in Butter → Saffron falls on the "paper" to the lower left, as if lit from upper right.
  - This is **"refining light"**: light concentrated and cleaned by the oil.
  - There is no frame, no box and no background colour. The canvas is transparent over `#FFFFFF`, so the drop sits *on the page itself*.
- **Specimen label** `PLATE 01 · OIL, LIQUID` sits under the caustic in 12px Graphite caps, with a 24px hairline tick leading to the drop.
- **The soft discs.** The brief calls for them behind the hero. Here they become the *coloured rim reflections* on the drop (Lavender, Ice, Butter). There are no flat discs on the page. **DEVIATION (light):** the discs are expressed as light, not shapes. Needs owner OK.

**Copy (brief §6.1, option A):**
- **Overline:** Independent technical and strategy consulting · Food, feed and specialty ingredients
- **H1:** Where deep expertise meets shared ambition.
- **Sub:** KoKreaters helps food, nutrition and specialty-ingredient businesses design better products, run better plants and make bolder decisions, with 25 years of plant-to-boardroom leadership behind every recommendation.
- **Primary:** Start a conversation → `/contact` (Sapphire pill, 48px)
- **Secondary:** Explore our expertise → `/expertise` (text link with arrow, Sapphire)

Word count above the fold: 11 + 6 + 30 + 6 = 53, which is 8 over the DNA's 45 because the brief's sub is 30 words. I keep the brief's copy and recover the calm through space.

**Mobile (390 × 844):**
1. Overline, then H1 at 44/48 (top at y ≈ 120), then sub, then the buttons stacked full width.
2. Below the buttons, a 4:3 **AVIF still** of the drop and its caustic (about 45 KB), with the specimen label under it.
3. No WebGL under 1024px.

### 3.2 LCP rule

The H1 is the LCP element, painted from server HTML in the preloaded Fraunces (with a Georgia `size-adjust` fallback). It is **never hidden or animated**. The drop's AVIF poster (about 60 KB at desktop size, `fetchpriority="low"`) is in the HTML from the start. WebGL replaces it only after `load` + `requestIdleCallback`.

### 3.3 Motion, beat by beat (desktop, motion allowed)

| t (ms) | Beat | Duration / ease | Notes |
|---|---|---|---|
| 0 | H1, sub, buttons, overline are already painted. Nothing moves. | n/a | LCP stays clean |
| 0 | AVIF poster of the drop visible at full opacity | n/a | the first frame equals the poster, so there is no flash |
| 200 | Swoosh under "shared ambition" draws (DrawSVG 0 → 100%) | 900ms, `power2.inOut` | the only hero text motion |
| idle (~600-1200) | three.js chunk loads; shader compiles off-screen; the first rendered frame is matched to the poster's camera and light | n/a | cross-fade poster → canvas 400ms linear, invisible if matched |
| +0 | **Settle.** The drop's surface does one slow wobble as if just placed: a 3px vertical squash recovering | 1400ms, `sine.out` | one time, nothing elastic |
| +1400 → ∞ | **Breathe.** The surface micro-undulates, ≤ 1.5% amplitude, 9s period. The caustic shimmers in step. | ambient, sine | 30 fps cap |
| on pointer move | **Light follows.** The key light rotates ±8° toward the cursor (damped, lerp 0.06). The caustic and the highlight slide accordingly. The drop itself does not move. | continuous | no cursor attraction on the object, no custom cursor |
| scroll 0 → 1 viewport | **Recede.** The canvas translates up at 0.85 of scroll speed (a slight lag, the only parallax on the site) and fades to 0 between 60% and 100% of the hero exit | scrubbed, `scrub: 0.6` | renderer pauses at opacity 0 |
| hover on primary pill | Fill Sapphire → Imperial, arrow `x: 4px` | 180ms `ui-in` | DNA tokens |

A pause button (44 × 44, bottom right of the canvas area, `aria-pressed`) stops the breathe and light-follow loops (WCAG 2.2.2). The choice persists in `localStorage`, wrapped in try/catch.

---

## 4. Homepage, fold by fold

Order follows brief §6.1 and DNA §8: hero, proof, what we do, method, impact, **material plate**, industries, insights, founder, CTA + footer. The material plate is a pause, not a section with copy. About 800 words in total.

### Fold 1. Hero
See §3.

### Fold 2. Proof band (Imperial, 1 of 2 dark fields)
- **Layout:** 4 columns on a 12-column grid (3 cols each), 128px vertical padding, 1px Lavender-at-20% hairlines between stats on desktop. Mobile is 2 × 2.
- **Copy (brief):**
  - **25**, years in oils, fats and food ingredients
  - **5**, countries of plant and operational leadership
  - **3**, regions of teams led: Americas, EMEA, Asia-Pacific
  - **WHO**, Director-General recognition for trans-fat elimination work
- Numbers are Fraunces 300, 72px, Saffron. Labels are Lavender, 17/26.
- **Material touch.** The top edge of the band is not a straight cut. It is a very slight **meniscus**: an SVG curve 10px deep across 1440px, as if the Imperial were a liquid meeting the wall of its glass. It is drawn once (static); nothing animates on it. **[NEW]**
- **Motion:**
  - 25, 5 and 3 count up from 0, 1200ms `power2.out`, staggered 120ms. The final values are in the HTML.
  - "WHO" fades in last (opacity, 400ms).
  - Labels reveal (`y: 16 → 0`, 560ms).
  - Once only.

### Fold 3. What we do (White)
- **Overline:** What we do
- **H2:** Six ways we create value, together.
- **Intro:** From the first idea to the last audit, we work wherever technology and business meet.
- **Layout:** an index of six **full-width rows** (DNA §2.2: no 3 × 2 card grid). Each row is 112px tall with a 1px Hairline divider and contains:
  - col 1: an 8px ringed node in the pillar colour
  - cols 2-7: the pillar name, Fraunces 380, 32px
  - cols 8-11: the one-line promise, Instrument 17px, Graphite
  - col 12: an arrow
- **Rows (brief):**
  1. Product and Category Innovation: From unmet need to a product that scales.
  2. Process Design and Plant Performance: Plants that run better, cost less and grow with you.
  3. Food Safety, Quality and Contaminants: Pass the audit. Protect the brand. Stay ahead of the regulation.
  4. Strategy, Feasibility and Market Entry: Clear answers for Go/No-Go decisions.
  5. M&A, Due Diligence and Partnerships: See what is really behind the deal.
  6. Capability, Leadership and Transformation: Leave stronger teams behind.
- The whole row is the link (`Learn more →` is visually hidden text for screen readers).
- **Motion:**
  - The H2 reveals with SplitText line masks, 720ms, stagger 70ms.
  - Rows fade up 16px, staggered 60ms, once.
  - **On hover or focus:** the node dot grows from 8 to 12px (180ms), the hairline under the row turns the pillar colour (200ms), and the arrow moves `x: 8px`. Nothing else changes, and there is no image reveal under the cursor.

### Fold 4. The KoKreaters way (pinned, the Three.js scene's second stage)
- **Overline:** The KoKreaters way
- **H2:** Connect. Collaborate. Create.
- **Layout:** pinned for 250vh.
  - **Left (cols 1-5):** the overline, the H2, then a step panel showing one step at a time, plus a vertical 3-node progress line (ringed nodes joined by a 1.5px Sapphire line that fills as you scroll).
  - **Right (cols 6-12, bleeding):** the **same WebGL scene** as the hero, the drop now seen closer and from above. Under it is the specimen label, which updates per step.
- **Steps (brief copy):**

| Scroll % of pin | Step copy (brief) | What the material does | Specimen label [NEW] |
|---|---|---|---|
| 0-33 | **Connect.** We start where the problem lives: on your plant floor, in your lab, with your customers. We listen first, then diagnose. | **Liquid.** The drop is clear gold and still. Light passes cleanly through it. Then a few faint points of turbidity appear inside: nuclei, the first sites. | `PLATE 02 · LIQUID, FIRST NUCLEI` |
| 33-66 | **Collaborate.** We design the answer with your teams, not around them, so the people who will run it own it. | **Crystallising.** Around each nucleus, fine needle crystals grow outward in spherulites, which look like soft white sunbursts under polarised-looking light. The gold goes from clear to pearly and translucent. Neighbouring spherulites reach each other and touch. | `PLATE 03 · CRYSTALS FORMING` |
| 66-100 | **Create.** We build, test and scale the solution, then hand it over with the measures to prove it works. | **Network.** The spherulites draw together into **five sites joined by bridges**, positioned exactly on the logo cluster's node coordinates (from `kokreaters-node-cluster.svg`). The crystal sites take on the five node colours. At 100% the canvas cross-fades (300ms) to the crisp SVG cluster, so the material has become the mark. | `PLATE 04 · NETWORK` |

- **Link after the pin:** How we work → `/approach`
- **Motion:**
  - The scene phase is `uPhase` 0 → 3, driven by ScrollTrigger with `scrub: 0.6`. It is the only scroll-jacked moment on the site.
  - Step copy cross-fades (opacity + `y: 12px`, 400ms) at 33% and 66%.
  - The progress line fills with scrub.
  - The H2 words light up in step: the current word is Imperial, the others are Graphite at 50%. Colour change only, 200ms.
- **Accessibility:**
  - All three steps are in the DOM as an `<ol>`. The visible-step swap uses `aria-hidden` only on visual duplicates, so screen readers read the whole list in order.
  - Keyboard users tabbing past are not trapped. The pin is plain scroll.

### Fold 5. Impact highlights (White)
- **Overline:** Impact · From our founder's career
- **H2:** Results that started on the plant floor.
- **Layout:** four editorial rows (DNA: no four equal cards). Each row has:
  - **Left (cols 1-3):** the place in Fraunces 26px (India / Indonesia / Ukraine / the WHO line), with the context in a specimen label under it (for example `WILMAR · INDIA`).
  - **Right (cols 4-11):** the result sentence in Fraunces 380, 30/38, Imperial.
  - 1px hairlines between rows, 48px padding.
- **Rows (brief, verbatim):**
  1. India's first world-class integrated specialty fats facility, built and activated. (Wilmar, India)
  2. 21% growth in Indonesia by reshaping manufacturing operations. (Wilmar, Indonesia)
  3. Ukraine's first cold-climate crude palm oil refinery, commissioned at −25 °C, cost structure improved by 15%. (Wilmar, Ukraine)
  4. Trans-fat (iTFA) elimination work publicly recognised by the WHO Director-General. (Cargill)
- Former employers appear as **text in the context label only**, never as logos (brief §6.1 rule).
- "World-class" in row 1 is the brief's own copy describing a fact. Keep it as written; it is the client's wording. **[CONFIRM]**
- On first use, "iTFA" gets `<abbr title="industrial trans fatty acids">` (brief §7: explain acronyms).
- **Link:** See the impact → `/impact`
- **Motion:**
  - Rows reveal once (fade + 16px, staggered 80ms).
  - In each row, the numbers (21%, −25 °C, 15%) are wrapped in `<span class="figure">` with `tnum`. They do **not** count up; one count-up per page is enough (the proof band).
  - The only flourish is on row 3: the "−25 °C" figure gets a hairline frost tick, a 1px Ice-coloured underline that draws in 900ms. That is the whole effect. **[NEW]**

### Fold 6. The material plate (full bleed, no copy)
- A single licensed **macro photograph**, full bleed, 16:7 on desktop and 4:5 on mobile: golden oil being poured or resting in clear lab glassware, lit from the side so the light refracts gold onto a white surface.
- It is the photographic twin of the hero drop.
- Its only text is a specimen label bottom-left, `PLATE 05 · REFINED OIL, LABORATORY GLASS`, plus a photo credit as required by the licence.
- `alt` describes it plainly: "Golden refined oil in a glass laboratory beaker, side-lit on a white bench."
- **Motion:** none. No parallax and no zoom. It is a breath between proof and the lighter sections. AVIF, lazy, about 140 KB at 1440w with `srcset`.
- **Asset status:** to source (Adobe Stock / Getty licence, or a commissioned macro shoot). Never AI-generated (DNA §7.1).

### Fold 7. Where we work (Cloud band)
- **H2:** Where we work
- **Chips (brief):** Confectionery · Bakery · Dairy and specialised nutrition · Plant-based · Snacks and food service · Edible oils and specialty fats · Personal care and oleochemicals · Pet food and animal nutrition · Industrial minerals and process inputs
- **Layout:** not chips. The nine sectors are set as a **flowing line of Fraunces 380, 30/44, Imperial**, separated by Mauve middots and wrapping like a sentence across cols 1-10. Each sector links to `/industries#slug`.
- **Motion:** the line reveals as one block (560ms). On hover or focus, the swoosh underline draws under the sector (300ms) and the arrow appears.

### Fold 8. Insights teaser (White)
- **Overline:** Insights
- **H2:** Ideas from the plant floor and the boardroom.
- **Layout (7/5):**
  - **Lead article, left:** a 3:2 macro plate, then pillar chip, title in Fraunces 32px, a 17px standfirst and meta (reading time · date).
  - **Right:** two stacked text-only rows, each with chip, title in Fraunces 24px and meta, separated by a hairline.
- The data comes from the content collection, newest three.
- **Launch-candidate titles (brief §6.6):** 3-MCPD and glycidyl esters: a practical playbook for refiners · Refining palm oil at −25 °C: lessons from a cold-climate refinery · Trans-fat elimination: what it really takes inside a plant. Insights must not launch empty (brief §11.14).
- **Link:** Read the insight →
- **Motion:** reveal once. Image hover is `scale 1.03` over 300ms inside a 16px-radius mask. Title underline on hover.

### Fold 9. Founder (Cloud band)
- **Layout (5/7):**
  - **Left:** the portrait (`ganeaysh-portrait-1665x2048.png` → AVIF 480w) in a circle with a 4px Saffron ring. The lapel pin must be retouched or confirmed (DNA §7.1). **[CONFIRM]**
  - **Right:** the quote, Fraunces roman 360, 34/44, Imperial, with a hanging Saffron opening mark at 64px.
- **Quote (brief):** "Co-creation and creativity are at the soul of everything we do. We do not just advise. We create with you." **[CONFIRM: quote wording]**
- **Attribution:** Ganeaysh Kulkarni, Founder
- **Link:** Meet Ganeaysh → `/about`
- **Motion:** the Saffron ring draws around the portrait once (DrawSVG, 1200ms `power2.inOut`). The quote reveals by lines (720ms). The portrait does not move.

### Fold 10. CTA + footer (one Imperial field, 2 of 2 dark)
- **CTA (brief):**
  - **H2:** Have a challenge worth solving together?
  - **Body:** Tell us about your product, your plant or your decision. The first conversation is on us. **[CONFIRM: free first call]**
  - **Button:** Book a 30-minute call (Saffron pill, Imperial text)
- It sits on Imperial, not Aurora (DNA deviation).
- A **hairline** separates it from the footer.
- **Footer (brief §5):**
  - The full reversed lockup (pending the vector file), then three columns: Expertise (six pillars) / Company (Approach, Impact, About, Insights) / Contact (office@kokreaters.com, WhatsApp +31 6 2215 7910, LinkedIn, Based in the Netherlands, working worldwide).
  - **Newsletter:** "Field notes from the plant floor and the boardroom. Once a month. No noise." with a Subscribe button.
  - **Bottom row:** © 2026 KoKreaters™ · Privacy · Cookies · Terms · registration details **[CONFIRM]**.
- **Motion:** the H2 reveals by lines. Nothing else moves.

---

## 5. The pillar page template (`/expertise/[slug]`, six instances)

Each pillar page has one material plate chosen for its subject. That is how the material carries through without a second WebGL scene.

| Block | Content (brief §6.2.x) | Design and motion |
|---|---|---|
| Breadcrumb | Expertise / {Pillar} | 14px Graphite |
| Hero (White) | **Overline:** {Pillar name}. **H1:** the pillar headline. **Lead:** the pillar intro. | A 4px pillar-colour bar sits above the overline (48px wide). H1 at 56/60 on cols 1-7. Right (cols 8-12): the pillar's **material plate** at 4:5 with a 16px radius and a specimen label. The plate fades in 560ms; the H1 is static. |
| What we help with | the brief's bullet list | Two-column list on desktop, **ringed node bullets** in the pillar colour, 17/28 |
| Typical deliverables | the brief's middot line | Set as one Fraunces 26px line, wrapping, with middots in the pillar colour. For example: "Innovation roadmaps · technical briefs · formulation and prototype plans · lab-to-plant scale-up plans · launch support" |
| From our founder's career | one impact row (the matching result) | the same row component as Home fold 5 |
| Insights | 2-3 tagged articles | text rows, as on the right side of Home fold 8 |
| Not sure where you fit? | "Not sure where you fit? Start a conversation" (brief §6.2) | one line plus a link |
| CTA + footer | as Home fold 10 | |

Headlines stay Imperial. Pillar colour appears only in the bar, the bullets, the chips and the middots (DNA §8).
Saffron (Strategy) and Sky (Capability) bars and bullets are non-text, so they need 3:1 against white. **Saffron is 1.6:1 and fails that.** So the Strategy bullets are Saffron fills with a 1px Ink ring, and the Sky bullets get the same treatment. Chips use Ink text on a tint (brief: "with Ink text").

**Material plate shot list per pillar** (licensed or commissioned, none AI-generated):
- **Product and Category Innovation:** a cross-section of snapped chocolate showing fine texture and gloss, macro.
- **Process Design and Plant Performance:** a thin stream of clear refined oil falling, backlit gold, against a white ground.
- **Food Safety, Quality and Contaminants:** a rack of oil sample vials in graded colours from crude to refined, side-lit.
- **Strategy, Feasibility and Market Entry:** raw materials in sample dishes (palm kernel, soy, sunflower, shea, sal or mango kernel) on white, top-down.
- **M&A, Due Diligence and Partnerships:** a tank-farm or refinery-column detail at golden hour. Abstracted and cropped, with no recognisable site or logo (brief §3.5).
- **Capability, Leadership and Transformation:** gloved hands holding a sample against the light, with correct PPE.

Pillar copy, deliverables and slugs come from brief §6.2.1-6.2.6. The overview at `/expertise` uses the H1 "Expertise that connects science, plants and strategy." and the intro "Most problems in food and ingredients do not respect departmental lines. A texture defect may start in the refinery; an audit failure may start in the business model. Our six areas of expertise are designed to work together." It shows the six pillars as **the Home index rows at a larger size** (row height 160px, names in Fraunces 48px, promise under the name), not the brief's 2 × 3 cards (DNA deviation). It ends with "Not sure where you fit? Start a conversation".

---

## 6. Other pages

### 6.1 Industries (`/industries`)
- **Layout:** one long page with anchors. Each sector is a 5/7 split: a material plate on the left (4:5) and, on the right, an h2 with the sector name, the brief's 2-3 lines, and links to the relevant pillars as chips. The split alternates sides every second sector.
- **Sector copy (brief §6.3, verbatim).** For example, Confectionery: "Cocoa butter equivalents, filling and coating fats, bloom resistance and cost-in-use for chocolate and sugar confectionery."
- **Colour-tint panels:** the brief asks for colour-tint panels. Here the "tint" is the photograph's own warmth; the panels stay White and Cloud alternately. **DEVIATION (light)**
- **Sticky sub-nav:** a sticky jump list on the left on desktop (sector names, 15px) with a 2px Sapphire active bar that follows the scroll.
- **Motion:** plates fade in once. No parallax.

### 6.2 Approach (`/approach`)
- **H1:** We create with you, not for you.
- **Lead:** The best answers come from people who know the plant, the product and the market. Our role is to connect that knowledge, add 25 years of global experience, and help your teams create something that lasts.
- **Method:** three static steps in a 3-column layout. The three columns are equal, the one 4/4/4 exception the DNA allows. Each step has:
  - the **pre-rendered AVIF still** of that phase of the scene (Plate 02 / 03 / 04, rendered offline from the same shader, so there is no WebGL on this page)
  - a ringed node and the step name in h3
  - the brief's step copy
  - "What we do / what you get / typical duration" (brief §6.4). The duration needs **[CONFIRM: engagement models and durations]**.
- A Sapphire connector line draws between the three nodes once (1200ms).
- **Principles:** five hairline rows, with the principle name in Fraunces 26px on the left and the copy on the right:
  - Plant floor to boardroom
  - Your team owns the result
  - Global playbook, local execution
  - Evidence before opinion
  - Confidential by default
- **Ways to work with us:** a real `<table>` with columns Model / Typical shape / Good for, `tnum` figures and hairline rows. It holds the brief's five models: Diagnostic or audit; Project; Advisory retainer; Interim leadership; Workshops and training. **[CONFIRM]**
- Ends with CTA + footer.

### 6.3 Impact (`/impact`)
- **H1:** Results that started on the plant floor. The brief gives no page H1, so this reuses the Home H2. **[CONFIRM]**
- **Lead:** none, or the meta description line "From India's first integrated specialty fats facility to a refinery at −25 °C: the results behind KoKreaters." **[CONFIRM]**
- **Part 1, From our founder's career.** Four case blocks, each using the brief's template:
  - context label (a specimen label, e.g. `PROCESS DESIGN · UKRAINE · FROM OUR FOUNDER'S CAREER (WILMAR)`)
  - outcome headline (h2)
  - three sub-blocks: The challenge / What was done / The result, in a 4/4/4 grid on desktop and stacked on mobile
  - tags as chips
  - one material plate per case (for example, the Ukraine case uses a winter refinery-column detail, abstracted)
- **Copy:** only Card 3's long form exists in the brief: "Design and build a continuous refinery able to operate in extreme winter conditions, down to −25 °C." / "Full design-to-execution leadership of the facility, from process design to commissioning." / "The first refinery of its kind in Ukraine; overall cost structure improved by 15%." **The other three cases need long-form copy from Ganeaysh. Do not invent it.** Until it arrives, they show the outcome headline and the one-line result only.
- **Part 2, KoKreaters engagements (anonymised).** Three hairline rows using the brief's text. Two of them need **[CONFIRM: client consent, even anonymised]** and are hidden behind a content flag until cleared.
- **Testimonials:** a slot for 2-4 quotes, hidden while empty (no placeholder quotes).
- **Header:** Twilight hero from the brief → **White hero** (DNA). Motion: reveals only.

### 6.4 Insights hub (`/insights`)
- **H1:** Ideas from the plant floor and the boardroom.
- **Featured:** the lead article as a 7/5 split (plate | title + standfirst + meta).
- **Filters:** pillar chips (colour dot plus name, never colour alone) and format chips (Point of view · Field notes · Explainer). These are client-side filters on static data with URL query sync, `aria-pressed` on the chips and a live region: "Showing 4 articles".
- **List:** hairline rows, not a card grid. Each row has a date (`tnum`, Graphite), the title in Fraunces 26px, the pillar chip, the format and the reading time. A plate thumbnail appears only on the featured article.
- **Newsletter:** "Field notes from the plant floor and the boardroom. Once a month. No noise." with a Subscribe button and a consent line.
- **Motion:** filtering uses GSAP Flip to reorder the rows (400ms `power3.inOut`). Under reduced motion it is an instant swap.

### 6.5 Article (`/insights/[slug]`)
- **Header:** overline (pillar in Mauve, with a pillar dot), H1 at 56/60 on 10 columns, standfirst (lead), then meta (author avatar 32px · Ganeaysh Kulkarni · reading time · date).
- **Hero plate:** optional, 16:9, full content width.
- **Body:** 720px, 18/30, with h2 and h3 in Fraunces.
- **Pull quote:** Fraunces **italic** (lazy-loaded here), 34/44, Imperial, with a hanging Saffron mark. It breaks out to 880px.
- **Exhibits:**
  - Numbered "Exhibit 1" in a specimen label, a title that states the finding (h4 20/28), then a flat SVG chart with at most three series (Sapphire, Amethyst, Sky) and Saffron to highlight one value.
  - Direct labels, a source line in 14px Graphite, and the chart width is the measure plus 120px.
  - Bars grow once, 600ms.
  - Every exhibit has an accessible data table in a `<details>` element below it.
- **Key takeaways:** a Cloud panel with a 16px radius and ringed-node bullets.
- **Author box:** the short bio (brief §6.7, about 60 words) and avatar.
- **Related:** two hairline rows, then CTA + footer.
- **SEO:** Article + BreadcrumbList JSON-LD.
- **Material touch:** none beyond the plate. Long reads stay paper-quiet.

### 6.6 About (`/about`)
- **H1:** Built on 25 years of making ingredients work.
- **Lead:** KoKreaters is the consultancy Ganeaysh Kulkarni wished he could call when he was running plants and R&D teams: someone who has done the work, understands the business and builds the answer with you.
- **Portrait:** right, cols 8-12, in a half-stadium mask (rounded top), on Cloud. The lapel pin must be resolved **[CONFIRM]**. Static; no parallax.
- **Long bio:** the brief's text, about 260 words, verbatim, at 720px.
- **Career timeline:** "CFTRI Mysore (1999–2001) → Wilmar (2001–2012) → Cargill (2012–2026) → KoKreaters (2026)".
  - A horizontal line of four ringed nodes on desktop, vertical on mobile.
  - The Sapphire line draws once (1200ms) and each node label reveals as the line reaches it.
  - The KoKreaters node uses the Saffron centre node from the logo.
  - Names are text only, with no employer logos.
  - **[CONFIRM: founded in 2026 and the career dates]**
- **Map:** a stylised world outline (a single path, about 8 KB, Hairline stroke) with nodes at Mundra, Kakinada, Gurugram, Pune, Medan, Odessa, Balikesir and Amsterdam. Sapphire arcs draw once (900ms each, staggered 150ms). Place names are given as an accessible list.
- **The name:** a short panel explaining "Ko stands for together... Kreaters are the people who make things happen", using the brief §1 text, plus the tagline Connect · Collaborate · Create. The panel shows the SVG node cluster at 160px next to the copy. **This is the one place the logo's story is told in words.**
- **Education and languages:** a compact two-column list drawn from the bio.
- **Client names:** sectors only. **[CONFIRM]**
- **Data:** Person JSON-LD. Ends with CTA + footer.

### 6.7 Contact (`/contact`)
- **H1:** Let's create something together.
- **Lead:** Tell us a little about your challenge. Ganeaysh reads every message personally and replies within one working day. **[CONFIRM]**
- **Layout (7/5):**
  - **Left:** the form.
  - **Right:** "Book a 30-minute call" as a secondary pill (booking tool **[CONFIRM]**), then the direct details (Email: office@kokreaters.com · WhatsApp: +31 6 2215 7910 · LinkedIn: linkedin.com/in/ganeayshkulkarni · Based in the Netherlands, working worldwide), then the small avatar.
- **Form fields (brief):** Name* · Company* · Role · Email* · Phone or WhatsApp · Country* · Area of interest* (the six pillars + "Not sure yet") · Message* · How did you hear about us? · Consent* ("I agree to KoKreaters storing my details to respond to this enquiry, as described in the Privacy Policy.")
  - Labels sit above the fields. Inputs have a 10px radius and a `#7C8197` border (DNA: 3:1).
  - Focus is a 3px Cobalt ring with a 2px offset.
  - Errors are Coral with an icon and the text "Please fill this in so we can reply."
- **Spam protection:** a honeypot plus Cloudflare Turnstile.
- **Success:** "Thank you. Your message is with us and Ganeaysh will reply within one working day." It replaces the form in place, focus moves to it, and it is announced in an `aria-live` region.
- **Error:** "Something went wrong. Please try again, or email office@kokreaters.com."
- **Motion:** none beyond the 180ms UI states. Forms never animate.

### 6.8 404
- **H1:** This page hasn't been created yet.
- **Body:** Let's connect you back.
- **Button:** Take me home
- **Visual:**
  - The SVG node cluster at 280px, centred above the H1. One node (Coral) has drifted 120px away and is drawn as a **liquid drop**, its outline softened and its fill the Sunrise gradient. This is the brief's Sunrise, confined to one small object. The page ground stays white, a light deviation from the brief's full Sunrise page.
  - **Interaction:** drag the drop, with pointer or keyboard (arrow keys while it is focused, `role="button"`, label "Reconnect the node"), back to its socket. When it is within 24px it snaps, the bridge line draws (300ms), and after 600ms the page navigates home.
  - The "Take me home" button is always there; the game is optional.
- **Reduced motion:** the node is shown detached, there is no drag, and the button is the action.

### 6.9 Legal pages
- Privacy, Cookies and Terms use the article body template with no plates.
- The cookie banner uses the brief's copy, with equal-weight "Accept all" and "Reject non-essential" pills and a Settings link. No analytics load before consent.

---

## 7. The Three.js moment

### 7.1 One scene, two stages, one canvas
- **One fixed `<canvas>`** (`position: fixed`, `pointer-events: none` except within the hero, `aria-hidden="true"`) owned by a single Astro island, `MaterialScene`, loaded with `client:idle`. It only mounts at ≥ 1024px with WebGL2 available and motion allowed.
- **Two stages:**
  1. **Hero:** the sessile drop with caustics.
  2. **Method pin:** the closer view, crystallising.
- Between the stages, ScrollTrigger sets `opacity: 0`, the render loop **stops** (`renderer.setAnimationLoop(null)`), and `visibility: hidden`.
- One WebGL context, one shader program and one compile, reused. The canvas rect is positioned by ScrollTrigger to match a placeholder `<div data-stage>` in each fold, so layout stays in CSS.

### 7.2 How it is made (small and buildable)
- **No meshes, no models, no textures.** The scene is a full-screen quad with one fragment shader using **SDF raymarching**. three.js provides `WebGLRenderer`, `OrthographicCamera`, `Mesh(PlaneGeometry, ShaderMaterial)` and the uniforms. That keeps the payload to three's core plus about 6 KB of GLSL.
- **Drop:** a flattened sphere SDF (sessile), smoothed into the ground plane with `smin`. The surface is perturbed by low-amplitude 3D noise on `uTime` for the breathe.
- **Optics (cheap and believable):**
  - Fresnel reflection of a studio environment: a procedural white softbox gradient plus Lavender, Ice and Butter rim lights, which carry the logo's soft discs.
  - Refraction via a single bent ray that samples a procedural "paper" plane.
  - **Beer-Lambert absorption** along the path length, from `uOilThin` → `uOilMid` → `uOilDeep`, so thick centres are deeper gold and edges are pale butter.
- **Caustic:** computed on the ground plane by projecting the drop's refracted light. It is approximated with a radial focus term plus animated Voronoi-style cell brightening (the classic real-time caustic trick), tinted Butter → Saffron and blended `multiply`-free (additive on white is clamped to a warm pool).
- **Crystallisation (uPhase 0 → 3):**
  - **0 → 1 (nuclei):** about 24 seeded points inside the drop gain density (scattering term, the gold turns slightly turbid).
  - **1 → 2 (spherulites):** each nucleus grows a spherulite. Radial needle density uses polar-coordinate noise around each seed, rendered as bright, fine, slightly blue-white highlights (Ice), and opacity rises toward pearly translucency.
  - **2 → 3 (network):** the seeds are lerped onto five target positions taken from the cluster SVG's node centres (normalised from `viewBox 20 15 570 570`), with the remaining 19 absorbed into them. Capsule SDFs grow between the same pairs as the SVG's five paths. Each site's colour lerps to its node colour.
  - At 3.0 the camera is top-down and the cluster aligns pixel-for-pixel with an absolutely positioned SVG cluster, which fades in while the canvas fades out (300ms). The handover is invisible.
- **Light follow:** `uLight` lerps toward the pointer at 0.06 per frame within the hero only.
- **Quality controls:**
  - DPR capped at 1.5.
  - Render scale 0.75 with CSS upscale. The oil is soft, so this does not show.
  - Raymarch at most 64 steps.
  - 30 fps cap during ambient play; 60 fps only while scrubbing.
  - An adaptive step that drops to scale 0.6 if three consecutive frames exceed 22ms.
- **Versions:** `three@0.170.0` (pinned, ES module, tree-shaken through Astro/Vite).

### 7.3 Stills and posters (the same art everywhere)
A small build script renders the shader offline with Puppeteer and headless Chrome at fixed uniforms. It exports AVIF and WebP for:
- the hero poster at phase 0 (desktop 900w, mobile 780w)
- Plates 02, 03 and 04 at phases 0.6, 1.6 and 2.8 (used on Approach, on mobile in the method, and under reduced motion)
- the OG share image background

That gives one source of truth: what users without WebGL see is the same drop, not a stand-in.

---

## 8. Reduced motion and fallbacks

Everything runs inside `gsap.matchMedia()`:

| Condition | Behaviour |
|---|---|
| `prefers-reduced-motion: reduce` | Lenis is not started. No WebGL mount. The hero shows the AVIF poster. The method is **unpinned**: three static steps, each with its Plate still, as on Approach. The swoosh, rings, arcs and lines render already drawn. Count-ups show the final numbers. Reveals are opacity-only at 200ms, or none. Flip filtering is an instant swap. The 404 has no drag. |
| < 1024px | No WebGL, native scroll (Lenis `syncTouch: false`), the method stacked with stills, everything else identical |
| No WebGL2, `saveData`, `deviceMemory < 4` or `hardwareConcurrency < 4` | Same as < 1024px |
| JS fails or is blocked | All content is visible by default. `.js .reveal` hides content only after JS boots, with a 600ms safety timer (DNA §2.5). The method is a plain `<ol>`. |
| User presses the pause button | The ambient loops stop and the renderer idles. Scroll-scrubbed phase changes still respond, because they are user-driven, not autoplay. |
| Keyboard focus moves into the content | Lenis is destroyed while focus navigation is active, and scrolling into view uses native `scrollIntoView`. |

---

## 9. Performance plan

**Budget (Home, first load, mobile):**

| Item | Budget |
|---|---|
| HTML (with inlined critical CSS) | ≤ 30 KB gzip |
| CSS total | ≤ 40 KB |
| Fonts | 97 KB (Fraunces opsz roman + Instrument Sans) |
| JS before idle | ≤ 80 KB gzip (GSAP core + ScrollTrigger + SplitText + DrawSVG ≈ 60, Lenis ≈ 4, app ≈ 12; Flip only on Insights) |
| Hero poster (mobile AVIF) | ≤ 45 KB |
| Below-fold images (lazy) | portrait 35 KB, material plate 110 KB (mobile 4:5), insight lead 40 KB |
| **Mobile total** | **≈ 500 KB**, against a 1.5 MB budget |
| Desktop extra: three.js chunk + shader | ≤ 170 KB gzip, after `load` + idle, never on mobile |
| **Desktop total** | **≈ 850 KB** |

**LCP plan:**
1. The H1 is the LCP element.
2. Fraunces is preloaded with `font-display: swap` and a metric-matched Georgia fallback (`size-adjust`, `ascent-override`).
3. Nothing that blocks rendering sits above the H1.
4. The poster has `fetchpriority="low"`, explicit width and height, and `decoding="async"`.
5. Target LCP ≤ 1.8 s on a Moto G Power profile (Lighthouse mobile).

**Other rules:**
- **CLS:** every image has an aspect ratio, and the canvas is fixed and out of flow. Target < 0.05.
- **INP:** no long tasks on interaction. Shader compile happens during idle, before the canvas becomes visible. If `KHR_parallel_shader_compile` is available, poll for it.
- **Hosting:** Astro static output on Cloudflare Pages, immutable cache for hashed assets, Brotli, and HTTP early hints for the font.
- **Verification:** Lighthouse mobile ≥ 90 on all four categories for Home and one article, axe clean, and WebPageTest on a 4G profile.

---

## 10. Build notes (Astro + GSAP + Lenis)

- `src/components/`:
  - `Header.astro`, `Hero.astro`, `ProofBand.astro`, `PillarIndex.astro`, `Method.astro` (holds the `<ol>` and the `data-stage` placeholder), `ImpactRows.astro`, `MaterialPlate.astro`, `SectorLine.astro`, `InsightsTeaser.astro`, `FounderQuote.astro`, `CtaFooter.astro`, `SpecimenLabel.astro`, `RingedNode.astro`, `Swoosh.astro`
  - `MaterialScene.ts` (island, `client:idle`, dynamic `import('three')`)
- `src/content/`: `insights/` (MDX), `impact/`, `pillars/`, `sectors/` (Astro content collections). Sanity can replace them later without changing the templates.
- `src/scripts/motion.ts`: one `gsap.matchMedia()` and one Lenis instance (`lerp 0.12`), with ScrollTrigger synced via `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker`.
- `scripts/render-plates.mjs`: renders the shader stills offline (§7.3).
- Pinned versions: `gsap@3.15.0`, `lenis@1.1.x` (pin an exact patch at install), `three@0.170.0`, `astro@5`.

---

## 11. What makes it unmistakably KoKreaters, not a template

1. **The hero object is their actual subject.** Generic consultancies show abstract gradients, handshakes or city skylines. This shows a drop of oil, lit properly. A refiner, a confectionery R&D head or an investor reading "specialty fats" recognises it in a second.
2. **The WebGL scene ends as the logo.** The fat-crystal network settles onto the exact five node coordinates of the KoKreaters cluster, in its five colours. The brand mark is shown as an outcome of the science and of Connect → Collaborate → Create. A template cannot do that, because it does not know what the logo means.
3. **Specimen labels.** A tiny lab-plate caption system that only makes sense for a food-science practice. It gives the site a register (laboratory, evidence, observation) that matches "Evidence before opinion".
4. **The brand palette lives inside the material.** Saffron is the colour of the oil. Lavender, Ice and Butter, the logo's soft discs, are the rim lights. The node colours are the crystal sites. The UI itself stays white, ink and Sapphire.
5. **Restraint around the signature.**
   - There is one WebGL scene, used in two places.
   - Material photography is limited to plates.
   - There are no cards on Home, and rows and hairlines everywhere else.
   - There is one count-up per page.
   - There is no hover-image trail, magnetic button, marquee, custom cursor or scroll-snap.
   - Every fold except the hero and the method could sit in a printed annual report.
6. **Proof written as fact, with places and degrees.** "Commissioned at −25 °C" set in Fraunces with a hairline frost tick, and no adjectives added. Former employers appear only as text in labels, under "From our founder's career".
7. **British English, the brief's exact copy, and every open claim flagged [CONFIRM].**

---

## 12. Open items this direction adds

1. Approve Instrument Sans in place of Plus Jakarta Sans (DEVIATION, §1.1).
2. Approve specimen labels as a device and their exact wording (§1.2).
3. Approve the shader-only colour `#B9821A` (§2).
4. Approve the soft discs expressed as rim light in the hero (§3.1), and the 404 using Sunrise on one drop only (§6.8).
5. Source the licensed or commissioned **macro photography**: one Home plate, six pillar plates, about nine sector plates and four impact plates. Budget it as one commissioned studio-macro day plus licensed stock for plant and raw-material shots. No AI-generated imagery.
6. Long-form copy for impact cases 1, 2 and 4 (only case 3 exists in the brief).
7. An H1 for `/impact` (§6.3).
8. Inherited items: vector logo, portrait lapel pin, quote wording, free first call, engagement durations, anonymised client consent, and legal details (brief §11).
