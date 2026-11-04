# Direction: THE NETWORK (4 Nov 2026)

Pitch for KoKreaters.com. It builds on BRIEF.txt (the source of truth for copy and facts), DESIGN-DIRECTION.md and DNA.md (which sets type, colour, motion tokens and the banned list). Wherever this file says "DNA x.y", that section applies unchanged.
All copy in quotation blocks is copied from the brief. Anything not in the brief is labelled **[COPY NEEDED]** or **[CONFIRM]**. No claims, numbers or client names are added.

---

## 0. The idea in one sentence

**The five nodes of the KoKreaters logo grow into one quiet line that runs down every page, from the plant floor to the boardroom, and every section, pillar, result and button is a node on that line.**

The site does not decorate itself with a network. It *is* a network: one continuous Sapphire hairline (the **Spine**) and a strict node grammar. The calm comes from having one motif and one line weight. What moves is the line connecting things, never the content.

### 0.1 The node grammar (the whole illustration system)

| Node | Size | Fill / ring | Means | Where |
|---|---|---|---|---|
| **Logo node** | as drawn | the five logo colours, never recoloured | the brand | hero cluster, header, 404 only |
| **Pillar node** | 12px dot + 2px white ring + 1px pillar-colour outer ring | one of the six pillar colours | a field of expertise | expertise rows, pillar pages, insight tags, hero bloom |
| **Station node** | 9px, white fill, 1.5px Sapphire ring | none | a section / a step / a fact | on the Spine at every overline, timeline points, bullets |
| **Terminal node** | 14px, Sapphire fill (Saffron on dark) | | a conversation | the end of every Spine, next to the primary CTA |
| **Person node** | portrait in a ring, 3px Saffron border | | Ganeaysh | founder quote, About, Contact |

Lines: **1.5px Sapphire `#2C509E` on light, 1.5px Sky `#4C9BE8` on dark** (Sapphire on Imperial is 1.83:1, see DNA 5.2). Caps are round and there are no arrowheads, except the **rising arrow** (the swoosh from the wordmark), which is used once per page.

---

## 1. Type pairing and scale

**Fraunces Variable (roman, opsz auto, display at weight 330) + Instrument Sans Variable**, as decided in DNA 3.1. Fonts total 97KB on home, and only Fraunces is preloaded.

Why this pairing suits this direction in particular:
- **The network is geometric.** Circles and straight lines need a text face that does not also try to be round. Plus Jakarta Sans repeats the circles, so the page turns soft and app-like. Instrument Sans is a tight neo-grotesk with tabular figures, which gives the line diagrams a firm caption voice.
- **Fraunces carries the warmth.** Its soft serifs are the only curved letterforms on the page apart from the logo.
- **If the owner keeps Plus Jakarta Sans,** it drops into the same scale with +0.005em tracking on body text. Nothing else changes.

Scale: DNA 3.2, with one addition for this direction.

| Token | Spec | Use |
|---|---|---|
| `node-label` | Instrument Sans 500, 13/16, +0.04em, `tnum`, Graphite | The small labels beside station nodes (place names, years, step numbers). Sentence case. Never smaller than 13px. |

Display is 76/80 on desktop and 44/48 on mobile, with one display size per page. Overlines are Mauve `#8C5B88` (DNA 5.2). Each overline sits level with its station node on the Spine, so the line connects the overlines down the page like stops on a route.

---

## 2. Colour use

Use the brief palette with the DNA 5 proportions. These rules are specific to this direction:
- **Ground:** White, with Cloud `#F8F6FC` for alternate bands. Imperial `#3A1C5C` for the proof band and for the merged CTA + footer field (no more than 2 dark fields per page).
- **Sapphire is the line.** Lines take up about 1% of the area, and Sapphire stays at 3% or less per viewport. Spine, buttons and text links all use the same Sapphire, so the eye reads "the line leads to the action".
- **The pillar colours appear only on pillar nodes, 4px bars and chips,** and there are never more than 2 in one viewport. The two exceptions are the six-row expertise index and the hero bloom, where all six appear together once. Every coloured node also has its pillar name written next to it.
- **The five logo colours (including Coral) appear only inside the logo cluster.** Coral is used elsewhere only for errors.
- **Saffron appears only on dark fields:** stats, the terminal node, the CTA pill and the focus ring on dark.
- **The soft discs** (Lavender, Ice, Butter at 60%, flat, no blur) appear only in the hero, behind the founder portrait and on the 404 page.
- **No gradients in the UI.** The one exception is Sunrise on the 404 page (DNA 5.3). The brief's Aurora CTA band becomes Imperial (DNA deviation).

---

## 3. The hero

### 3.1 Composition (1440 x 900)

```
| header 72px: [cluster slot, empty] KoKreaters wordmark . Expertise Industries Approach Impact Insights About [Start a conversation] |
|                                                                                               |
|  col 1-7                                         col 8-12, bleeds 72px past right edge        |
|  (200px headroom)                                     o  Process (violet)                     |
|  o--- OVERLINE (Mauve, 12.5px caps)                      \                                    |
|  Where deep expertise                       o-----------( LOGO CLUSTER )------o Strategy      |
|  meets shared ambition.                      Innovation   5 nodes, 3 discs     (saffron)      |
|         ~~~~~~~~~~~~~~~~~~~~~~~~~~> (rising arrow)       /         \                         |
|  Sub-headline, lead 21/33, max 34em            o Quality            o Capability              |
|  [Start a conversation ->]  Explore our expertise ->                 o Deals (mauve)          |
|  |                                                                                            |
|  | <- the Spine starts here, below the buttons, and runs down the page                        |
```

- **Left, columns 1-7.** The overline is preceded by a station node at x = column 1 start. That node is the first stop on the Spine. Below it come the H1 (display), the sub-headline (lead) and the buttons: a primary Sapphire pill, plus a secondary text link with an arrow instead of the brief's outline pill. A second pill would double the Sapphire area.
- **Right, columns 8-12.** An inline SVG `viewBox` about 640x640, `aria-hidden="true"`. In the centre sits the **logo cluster at 1:1 geometry from `assets/logo/kokreaters-node-cluster.svg`**, about 300px, with its three discs. Around it, **six pillar nodes** sit on 1.5px Sapphire lines that branch from the yellow centre node. Each line is 140-220px long, at angles chosen so no label collides. Three unlabeled station nodes on secondary lines make 14 nodes in total, inside the brief's 12-20.
  - The pillar nodes carry `node-label` text (for example "Process design"), set at 60% opacity. The labels are decorative, because the real names are in the index two folds down.
- **The Spine** begins as a 1.5px vertical line from the hero's first station node. It runs at x = left content edge minus 32px (in the side margin) down the whole page.
- **Mobile (390):**
  - The H1 starts above y≈300.
  - The network sits *below* the buttons at full width, 320px tall, as the cluster plus 6 pillar nodes with no labels.
  - The Spine is hidden under 768px. Each overline keeps its station node inline.

### 3.2 Copy (brief 6.1, option A)

> Overline: Independent technical and strategy consulting · Food, feed and specialty ingredients
> Headline: Where deep expertise meets shared ambition.
> Sub-headline: KoKreaters helps food, nutrition and specialty-ingredient businesses design better products, run better plants and make bolder decisions, with 25 years of plant-to-boardroom leadership behind every recommendation.
> Primary: Start a conversation → /contact
> Secondary: Explore our expertise → /expertise

This comes to about 45 words above the fold (DNA 4 ceiling).

### 3.3 Motion, beat by beat

Rule: the **H1, sub and buttons are painted by HTML/CSS at first paint and never animate** (the H1 is the LCP element, DNA 2.5).
- An inline `<head>` script adds `.js` only when `prefers-reduced-motion: no-preference`.
- `.js` hides only the decorative SVG parts the intro will draw: pillar nodes, branch lines, the swoosh path and the Spine. A 600ms safety timer removes `.js-pending` if GSAP fails to load.
- Without JS, the SVG shows the finished network.

Times are measured from `document.fonts.ready` (capped at 400ms after DOMContentLoaded).

| Beat | Start | Duration | What happens | Ease |
|---|---|---|---|---|
| B0 | 0 | none | Cluster and discs are already visible (static, as in the logo). Text is already visible. | |
| B1 "the logo lights up" | 0ms | 5 x 220ms, stagger 90ms (about 580ms) | The five logo nodes' inner dots go from opacity 0.35 to 1 in the order Sapphire, Cobalt, Yellow, Sky, Coral. This is the brief's loader idea ("nodes lighting up in sequence"). Colour and geometry are unchanged. | `ui-in` |
| B2 "the bloom" | 420ms | lines 700ms, stagger 80ms (about 1.1s) | Six branch lines draw out of the yellow centre node (DrawSVG 0→100%). As each line arrives, its pillar node scales from 0.6 to 1 and fades in (220ms), then its label fades in (200ms, +80ms). Order: Innovation, Process, Quality, Strategy, Deals, Capability. | `power2.inOut` / `ui-in` |
| B3 "the swoosh" | 1150ms | 900ms | The rising arrow (the wordmark swoosh, re-pathed to the width of "shared ambition.") draws under those two words, left to right. The arrowhead appears at the end (120ms). | `power2.inOut` |
| B4 "the Spine starts" | 1500ms | 600ms | The Spine draws down from the hero's first station node to the bottom of the viewport. After that it is scroll-driven (see 4.0). | `power2.out` |
| B5 ambient | 1900ms onward | 22-30s loops | Pillar and station nodes drift by at most 6px (sine, random phases). Line endpoints follow on the same ticker. **The logo cluster does not drift.** Cursor within 120px of a node pulls it by at most 10px (`gsap.quickTo`, 0.6s). Everything pauses when the hero is off-screen (IntersectionObserver) or the tab is hidden. | sine |
| B6 hover | on hover/focus of "Explore our expertise" | 6 x 180ms, stagger 60ms | The six pillar nodes pulse their ring from 1px to 2.5px in sequence. This is a quiet preview of the six pillars. | `ui-in` |

**The whole intro is over by 2.0s.** Nothing loops visibly except the 6px drift. A 44x44 pause button sits bottom-right of the SVG (WCAG 2.2.2), labelled "Pause animation".

**Scroll exit (the dock).** This is scrubbed from hero top to 60% of hero height, `scrub: 0.6`.
1. The pillar nodes retract along their lines (DrawSVG 100→0, reversed stagger).
2. At 60%, a **GSAP Flip moves the logo cluster into the empty cluster slot in the header** (640ms `power3.inOut`, not scrubbed, triggered once in each direction). The header lockup is then complete.
3. Scrolling back to the top reverses both.

The brand story is told once: the logo opens into the six pillars, then gathers back into the masthead.

---

## 4. Homepage, fold by fold

### 4.0 The Spine (runs through every fold)

- **Geometry.** One SVG `<path>` in an absolutely positioned layer (`pointer-events:none; aria-hidden`), measured from the DOM on load and on resize (debounced 150ms).
- **Route.** It runs vertically in the left margin. At each section it puts a station node beside the overline. At four points it *turns into* a fold:
  - it becomes the proof band's horizontal line
  - it becomes the method's rising arrow
  - it threads the impact rows
  - it ends in the terminal node beside the CTA button
- **Motion.** The drawn length is scrubbed to scroll (`scrub: 0.6`, DrawSVG), so the line arrives at each station just before its overline enters. Each station node scales from 0.6 to 1 and fades in (220ms) when the line reaches it.
- **Weight.** It is the only scrubbed element apart from the method.
- **Under 768px.** No continuous Spine. Each overline gets an inline station node and a 24px stub line.

### Fold 1. Hero

See section 3.

### Fold 2. Proof band (Imperial, full bleed)

> 25 | years in oils, fats and food ingredients
> 5 | countries of plant and operational leadership
> 3 | regions of teams led: Americas, EMEA, Asia-Pacific
> WHO | Director-General recognition for trans-fat elimination work

- **Layout.** The Spine enters the band from the top-left and turns 90° into a **horizontal Sky line** across the four columns. Each stat sits on a Saffron-ringed station node. Numbers are Fraunces 300 stats (72px, Saffron, `lnum tnum`) and labels are Lavender, 15/22.
- **Motion** (band 40% in view, once):
  - The line draws left to right over 1200ms (`power2.inOut`).
  - Each node pops as the line passes it (220ms).
  - Its number counts up over 1200ms, `power2.out`; the final value is in the HTML.
  - "WHO" does not count. It fades in (400ms) after the line reaches it.
- **Mobile.** A 2x2 grid with short line stubs, and count-up only.
- **Source line** (14px, Lavender at 80%): **[COPY NEEDED]** "From our founder's career at Wilmar and Cargill, 2001-2026". This is a factual paraphrase of brief 6.1 and the bio, and it follows the DNA 1.2 "proof carries a source line" rule. It needs owner sign-off.

### Fold 3. What we do (White), the expertise index

> Overline: What we do
> Headline: Six ways we create value, together.
> Intro: From the first idea to the last audit, we work wherever technology and business meet.

The six rows are as in brief 6.1:
1. **Product and Category Innovation** — From unmet need to a product that scales.
2. **Process Design and Plant Performance** — Plants that run better, cost less and grow with you.
3. **Food Safety, Quality and Contaminants** — Pass the audit. Protect the brand. Stay ahead of the regulation.
4. **Strategy, Feasibility and Market Entry** — Clear answers for Go/No-Go decisions.
5. **M&A, Due Diligence and Partnerships** — See what is really behind the deal.
6. **Capability, Leadership and Transformation** — Leave stronger teams behind.

- **Layout.** This is an **index of rows, not cards** (DNA 2.2).
  - Each row is 112px tall with a 1px Hairline between rows. Each row is one `<a>` to its pillar page.
  - From left to right: the pillar node on a vertical connector that joins all six dots (a branch off the Spine); the name in Fraunces at h3 size (26/32), across columns 2-7; the promise in Instrument Sans 17/28, Graphite, across columns 8-11; and "Learn more →" in column 12.
- **Motion.**
  - On entry: the h2 reveals with SplitText lines (720ms, stagger 70ms). The vertical connector draws top to bottom (900ms). The rows reveal (fade + 16px, 560ms, stagger 60ms).
  - On hover or focus:
    - the node ring grows from 12 to 16px and fills (180ms)
    - a 1.5px line in the pillar colour draws from the node to the arrow (300ms `power2.out`)
    - the arrow moves 8px
    - nothing else moves, and there is no row background change apart from a Cloud tint (200ms)
- **Below the rows:** a text link, "Not sure where you fit? Start a conversation" (brief 6.2 copy), with a terminal node.

### Fold 4. The KoKreaters way (Cloud), pinned method

> Overline: The KoKreaters way
> Headline: Connect. Collaborate. Create.
> Step 1 · Connect: We start where the problem lives: on your plant floor, in your lab, with your customers. We listen first, then diagnose.
> Step 2 · Collaborate: We design the answer with your teams, not around them, so the people who will run it own it.
> Step 3 · Create: We build, test and scale the solution, then hand it over with the measures to prove it works.
> Link: How we work → /approach

This is the centre of the direction. **The logo's rising arrow becomes the plant-floor-to-boardroom axis.**

- **Layout** (pinned, about 2.5 viewports of scroll, desktop ≥1024 only).
  - A full-width SVG holds three large ringed nodes (56px), each placed *higher* than the last on a gently rising arrow.
    - Connect sits at bottom-left, in Sapphire.
    - Collaborate sits mid-centre, in Cobalt.
    - Create sits top-right, in Sapphire. These are the tagline's own colours from the logo.
  - Two `node-label` captions anchor the axis: "Plant floor" at the far left baseline and "Boardroom" at the top right. Both words come from the brief's positioning line, so no claim is added.
  - The step copy (h3 + body, 21/33 lead) sits in a fixed text panel on columns 1-5 and changes per step.
- **Motion** (scrubbed).
  - 0-15%: the Spine turns and becomes the start of the arrow.
  - 15-40%: the arrow draws to Connect; Connect fills; step 1 copy is in.
  - 40-70%: the arrow draws to Collaborate; step 1 copy cross-fades to step 2 (opacity only, 300ms, triggered at the threshold rather than scrubbed, so text is never half-visible).
  - 70-95%: the arrow draws to Create and the arrowhead appears; step 3 copy shows.
  - 95-100%: hold, then unpin. The Spine continues down from Create's node.
  - **The three texts are all in the DOM in reading order** (not swapped by JS). Screen readers and no-JS users get all three as a normal `<ol>`.
- **Mobile / tablet.** No pin. A vertical `<ol>`: three station nodes on a vertical line, with the copy beside each. The line draws once on entry (1200ms).

### Fold 5. Impact highlights (White), "from our founder's career"

> Overline: Impact · From our founder's career
> Headline: Results that started on the plant floor.
> 1. India's first world-class integrated specialty fats facility, built and activated. (Wilmar, India)
> 2. 21% growth in Indonesia by reshaping manufacturing operations. (Wilmar, Indonesia)
> 3. Ukraine's first cold-climate crude palm oil refinery, commissioned at –25 °C, cost structure improved by 15%. (Wilmar, Ukraine)
> 4. Trans-fat (iTFA) elimination work publicly recognised by the WHO Director-General. (Cargill)
> Link: See the impact → /impact

- **Layout.** Four editorial rows, with no cards and no horizontal rail (DNA 2.2 and 6.2).
  - The Spine threads down the left of the rows, with a station node per row.
  - Beside each node, a `node-label` gives the place: India, Indonesia, Ukraine, and **[CONFIRM]** a place for the WHO result (the brief gives none; leave the label empty rather than guess).
  - The outcome text is Fraunces 30/38 across columns 2-9. The context "(Wilmar, India)" is 14px Graphite underneath, as text only and never a logo.
  - Where a number exists (21%, 15%, −25 °C), it is pulled into column 10-12 as a Fraunces 300 numeral at 56px in Imperial. The numbers are not duplicated in the sentence copy.
- **Motion.** Rows reveal (560ms, stagger 80ms) and numerals count once (1200ms). −25 °C does not count; it fades in, because counting a temperature reads as a gimmick.

### Fold 6. Where we work (White → Imperial edge), the Three.js moment

> Headline: Where we work
> Chips: Confectionery · Bakery · Dairy and specialised nutrition · Plant-based · Snacks and food service · Edible oils and specialty fats · Personal care and oleochemicals · Pet food and animal nutrition · Industrial minerals and process inputs

This fold holds the site's one WebGL scene, specified in section 6.
- **Final resting state, and the DOM for everyone:** nine pill chips in a wrapped row, each with a small station node, each linking to `/industries#slug`. The chips are always in the HTML.
- **On desktop with motion allowed,** the chips are the *landing* state of the 3D scene (see 6).

### Fold 7. Insights teaser (Cloud)

> Overline: Insights
> Headline: Ideas from the plant floor and the boardroom.

- **Layout.** One lead article on columns 1-7 (image 3:2, pillar tag, Fraunces 30/38 title, reading time · date) and two stacked articles on columns 8-12, separated by a hairline. Each pillar tag is a pillar node plus its name.
- **Content.** Until the CMS has posts, titles come from the brief's suggested list (for example "Refining palm oil at –25 °C: lessons from a cold-climate refinery"). **The block is hidden until at least 2 real articles exist**, because the brief says Insights must not launch empty.
- **Motion.** Reveal on entry. Images scale to 1.03 on hover (300ms). The pillar node fills on hover (180ms).

### Fold 8. Founder (White)

> "Co-creation and creativity are at the soul of everything we do. We do not just advise. We create with you."
> Ganeaysh Kulkarni, Founder
> Meet Ganeaysh → /about
> [CONFIRM: quote wording]

- **Layout.**
  - The **person node** sits on columns 1-4: `ganeaysh-avatar-640.png` in a 280px circle with a 3px Saffron ring, on two soft discs (Lavender, Butter, 60%).
  - The Spine arrives at the ring from above and touches it at 12 o'clock. The founder is literally a node on the network.
  - The quote sits on columns 6-12: Fraunces italic 34/44 in Imperial, with a hung Saffron opening mark.
  - **[CONFIRM]** The lapel pin needs retouching or approval (it may be a former-employer mark).
- **Motion.** The Spine meets the ring, and the ring stroke draws 0→100% (900ms). The quote reveals with lines (720ms). The portrait never moves (DNA 6.3).

### Fold 9. Call to action + footer (one Imperial field)

> Headline: Have a challenge worth solving together?
> Body: Tell us about your product, your plant or your decision. The first conversation is on us. [CONFIRM: free first call]
> Button: Book a 30-minute call

- **Layout.**
  - The Spine (now Sky on dark) enters from the top and runs to a **Saffron terminal node** placed immediately left of the Saffron pill.
  - The headline is Fraunces h2 in white, and the body is Lavender.
  - A hairline (Lavender at 20%) separates the CTA from the footer, inside the same Imperial field (DNA 8).
- **Motion.** The line reaches the terminal node, which pulses once: ring 14→22px, opacity 1→0, 600ms, **once only**. Every line on the page ends at a conversation.
- **Footer** (brief 5):
  - reversed full lockup **[CONFIRM: reversed vector logo]**
  - Expertise column (6 pillars, each with its node), Company column, Contact column (office@kokreaters.com, WhatsApp, LinkedIn, base location)
  - newsletter: "Field notes from the plant floor and the boardroom. Once a month. No noise." [Subscribe]
  - bottom row: © 2026 KoKreaters™ · Privacy · Cookies · Terms · **[CONFIRM: KvK / VAT]**

The home page has about 750 words, 2 dark fields and 3 layouts (split, rows, full-bleed band), within DNA 4.

---

## 5. Inner pages

### 5.1 Pillar page template (`/expertise/[slug]`, six instances)

The pillar's colour token is passed as `--pillar` (for example Process `#5B2A86`). The Saffron and Sky pillars take Ink text on chips. Headlines stay Imperial (DNA 8).

1. **Hero (light, Cloud).**
   - Left, columns 1-7: an overline with the pillar node and pillar name (for example "Process Design and Plant Performance"), the H1 = the pillar promise (for example "Plants that run better, cost less and grow with you."), then the intro as lead.
   - Right, columns 8-12: the **"you are here" map**. The six pillar nodes keep their positions from the home hero bloom. This pillar's node is 48px, filled and labelled. The other five are 12px, ringed, labelled at 60%, and **each is a real link** to its pillar page (`<nav aria-label="Other expertise">`). Lines join this node to the other five.
   - Motion: lines draw out from the current node (700ms, stagger 80ms). Hovering another node draws its line in that node's colour (300ms).
   - Mobile: the map becomes a horizontal chip row of the other five pillars.
   - A 4px bar in `--pillar` runs along the top edge of the hero.
2. **What we help with.**
   - The brief's bullets for that pillar, as a list with **ringed bullets in `--pillar` on a vertical connector** (one station per bullet), 19/30.
   - Acronyms are expanded on first use (CBE, FSQR, iTFA, 3-MCPD), as brief 7 requires.
   - Motion: the connector draws (900ms) and the bullets reveal (stagger 60ms).
3. **Typical deliverables.**
   - The brief's "·" list becomes a **horizontal chain**: station nodes on one line, with a `node-label` under each (for example Process design basis — plant assessments — debottlenecking plans — commissioning support — technology transfer packages).
   - On mobile it wraps to a vertical chain. It is semantically a `<ul>`.
4. **Related.**
   - One impact row (the matching founder result where one exists; for example, Process pairs with the Ukraine refinery).
   - Two or three insights tagged with this pillar.
   - Hidden when there are none.
5. **CTA field.** The terminal node, as on home. The brief copy is reused: "Have a challenge worth solving together?" / Book a 30-minute call.

`/expertise` overview:
- H1: "Expertise that connects science, plants and strategy." plus the brief intro.
- The same six-row index as home, at larger size (rows 144px, with the promise and the first two "What we help with" bullets).
- Then "Not sure where you fit? Start a conversation".
- **DEVIATION:** the brief asks for a 2x3 card grid. This uses index rows, per DNA 2.2.

### 5.2 About (`/about`)

1. **Hero.** H1 "Built on 25 years of making ingredients work." and the intro as lead, on columns 1-7. The portrait (`ganeaysh-portrait-1665x2048.png`, 4:5, half-stadium mask) on columns 8-12, with two soft discs behind it. The person node ring is drawn on load (900ms).
2. **Long bio** (260 words, brief 6.7) at 66ch, body 18/30. The first sentence is set as lead.
3. **Career timeline.** A horizontal station line on desktop, vertical on mobile:
   - CFTRI Mysore (1999–2001)
   - Wilmar (2001–2012)
   - Cargill (2012–2026)
   - KoKreaters (2026), shown as the terminal node
   - Names are text only, never logos. **[CONFIRM] dates (brief item 13).**
   - Motion: the line draws on entry over 1600ms, and each node lights as the line reaches it.
4. **Map.**
   - A pre-baked flat SVG world in an Equal Earth projection, about 40KB, drawn as a dot grid in Hairline.
   - Station nodes at Mundra, Kakinada, Gurugram, Pune, Medan, Odessa, Balikesir and Amsterdam, with `node-label` place names.
   - Sapphire arcs draw once in chronological order (India → Indonesia → Ukraine → Türkiye → Netherlands; the exact sequence needs **[CONFIRM]**), 600ms each with a 120ms stagger.
   - Under it, the places are also listed as a visually hidden list.
5. **The name.**
   - Two station nodes labelled **Ko** ("together: co-creation, collaboration, community") and **Kreaters** ("the people who make things happen"), joined by one line.
   - Under them, the tagline as three nodes on the rising arrow: Connect · Collaborate · Create. The words are brief 1.
   - The logo itself is shown here as the full lockup, untouched.
6. **Education and languages.** A compact two-column list with ringed bullets.
7. **CTA field.**

### 5.3 Approach (`/approach`)

1. H1 "We create with you, not for you." and the intro (brief 6.4).
2. **The method, expanded.** The same rising-arrow diagram as home, but **static and not pinned**. The three nodes are buttons (`aria-expanded`). Each opens a panel with "what we do / what you get / typical duration". The panel opens by height with Flip, 300ms `power3.out`.
   - "What we do" is the brief step copy.
   - **"What you get" and "typical duration" per step are [COPY NEEDED]**, because the brief gives durations only per engagement model.
3. **Principles.** Five rows, with a station node, the principle name in Fraunces 26/32 and its copy, all from brief 6.4.
4. **Ways to work with us.** A real `<table>` (Model / Typical shape / Good for) with the five brief rows. On mobile it stacks to definition lists. Each model name is preceded by a node whose ring thickness grows with commitment, from Diagnostic to Interim leadership. This is purely decorative. **[CONFIRM: engagement models and durations].**
5. CTA field.

### 5.4 Impact (`/impact`)

1. **Hero.** Light. Overline "Impact · From our founder's career". The H1 reuses the brief's "Results that started on the plant floor." **[COPY NEEDED if a separate H1 is wanted].**
2. **Founder track record.** Four case blocks, each using the brief template:
   - context label, outcome headline (h2)
   - The challenge / What was done / The result as three labelled columns joined by one horizontal line with three station nodes (challenge → action → result)
   - tags as pillar chips
   - Only Card 3 (Ukraine) has full copy in the brief. **Cards 1, 2 and 4 need challenge / done / result text: [COPY NEEDED from Ganeaysh, no invention].** Until then they show the outcome headline and context only.
   - Motion: the three-node line draws on entry (1200ms).
3. **KoKreaters engagements (anonymised).** Three rows from brief 6.5. Rows 2 and 3 are **hidden until [CONFIRM: client consent]**.
4. **Testimonials.** The slot is hidden until 2-4 quotes with permission exist (brief).
5. CTA field.

### 5.5 Insights hub (`/insights`)

1. **Hero.** Light. H1 "Ideas from the plant floor and the boardroom." (brief home copy, reused). **[COPY NEEDED** for a hub intro line**]**.
2. **Featured article.** A 7/5 split, as on home.
3. **Filters.**
   - A row of six **pillar node chips** plus "All", and a format segmented control (Point of view / Field notes / Explainer).
   - Filtering uses **GSAP Flip** on the article grid (480ms `power3.inOut`), and is instant under reduced motion.
   - The chips are `<button aria-pressed>`, and the filter state is reflected in the URL query.
4. **Article list.** Two columns of rows (not cards): image 3:2 at 160px, pillar tag, Fraunces title, meta.
5. **Newsletter** (brief microcopy), with the consent line.

### 5.6 Article (`/insights/[slug]`)

- **Hero:**
  - an overline with the pillar node, pillar name and format
  - the H1 in Fraunces 56/60
  - reading time · date
  - an author row (person node 40px + "Ganeaysh Kulkarni, Founder")
- **The route rail.** This is the network as a table of contents.
  - Desktop ≥1280: a sticky rail in the left margin, where the Spine becomes the progress line.
  - Each h2 in the article is a station node with a `node-label` of its heading. The line fills to scroll position (scrub). The current station is filled Sapphire.
  - The nodes are links (`<nav aria-label="On this page">`).
  - Mobile: a 2px progress hairline under the header, with no rail.
- **Body.** 18/30 at 66ch, with pull quotes in Fraunces italic 34/44 Imperial and a Saffron mark.
- **Numbered Exhibits** (DNA 7.2): flat SVG with at most 3 series and a source line. Bars grow once (600ms).
- **Key takeaways box.** Cloud with a 4px `--pillar` bar. The takeaways are a ringed-bullet list on a connector.
- **Related.** Two related article rows, then the CTA field.
- **Structured data:** Article + BreadcrumbList.

### 5.7 Contact (`/contact`)

1. **Layout.**
   - Columns 1-5: H1 "Let's create something together.", the intro, then a "direct details" list as station nodes (Email: office@kokreaters.com · WhatsApp: +31 6 2215 7910 · LinkedIn: linkedin.com/in/ganeayshkulkarni · Based in the Netherlands, working worldwide), then "Book a 30-minute call" as a secondary pill.
   - Columns 7-12: the form.
   - **[CONFIRM: email, reply promise, booking tool].**
2. **Form.**
   - Fields exactly as brief 6.8, with labels above and inputs with a `#7C8197` border (DNA 5.2).
   - Area of interest is a `<select>` whose options start with each pillar node's colour as a 10px swatch (in a custom listbox only if it passes a11y review; otherwise a native select with no swatches).
   - Honeypot + Turnstile.
   - Errors in Coral with an icon and the brief text "Please fill this in so we can reply."
3. **The connection moment, the page's one motion beat.**
   - Above the form, a small 2-node diagram: a station node labelled with the visitor's typed **Name** (live, falls back to "You"), and Ganeaysh's 48px person node, unconnected.
   - On a successful submit, the line between them draws (900ms `power2.inOut`), and the success message appears: "Thank you. Your message is with us and Ganeaysh will reply within one working day."
   - The diagram is `aria-hidden`, and the message is in an `aria-live="polite"` region.
   - Under reduced motion the line simply appears.
   - On an error, the brief's error text appears and the line does not draw.

### 5.8 404

- **Visual.** A Sunrise gradient field (the only gradient on the site, per DNA 5.3), with the logo cluster on white discs at 320px, as the brief specifies.
- **The disconnected node.** One node (the Sky node) sits 120px away from the cluster, its line broken.
- **Copy:**
  > H1: This page hasn't been created yet.
  > Body: Let's connect you back.
  > Button: Take me home
- **Interaction.**
  - The node is draggable (GSAP Draggable). Releasing it within 40px of its socket snaps it back (300ms `power3.out`). The line redraws, and after 600ms the page navigates to `/`.
  - Keyboard and screen-reader users get a real button, "Reconnect and go home", which does the same thing.
  - "Take me home" is always present as a plain link.
- **Contrast.** Text on Sunrise is white Fraunces at 56px or larger. Check the contrast over the Orchid stop, add an Imperial scrim at 30% if it falls under 3:1, and keep body text on a white card.

---

## 6. The Three.js moment: "the field rises" (home, fold 6, Where we work)

**Why here, and why not in the hero.**
- The hero must be instant and crisp, so it is SVG and its LCP is text.
- The network's one *spatial* idea is the brand line itself, "from the plant floor to the boardroom": the same connections seen from the floor and from above.
- The industries fold has nine discrete things to connect, a natural place between proof (impact) and ideas (insights), and no LCP risk.
- This replaces DESIGN-DIRECTION's golden-oil shader. Oil is a food-science idea and this direction's protagonist is the network. Keep the shader as the alternative if the owner prefers it; both cannot ship.

**What it is.**
- About 140 nodes (9 labelled industry nodes + about 130 small unlabeled station nodes) laid out on a large horizontal plane, like the floor of a plant seen at eye level.
- Nodes are instanced ringed discs: one `InstancedMesh` with a 2-ring SDF fragment shader, so it renders crisp at any zoom, in Sapphire, Ice and Lavender. Only the nine industry nodes are white with a Sapphire ring.
- Lines are one `LineSegments` geometry (about 220 segments) at 1.5px-equivalent, Sapphire at 35% opacity, with nearest-neighbour links precomputed at build time into a JSON of about 6KB.
- The ground is Cloud `#F8F6FC`. There is no fog colour shift and no bloom.

**Scroll choreography** (pinned 1.5 viewports, `scrub: 0.8`):

| Progress | Camera | What you see |
|---|---|---|
| 0% | Perspective, eye height, looking along the plane (pitch about 8°) | A low, dense horizon of nodes and lines. A `node-label` reads "Plant floor" at bottom-left. The fold H2 "Where we work" is in the DOM, top-left, static. |
| 0-60% | Camera cranes up and pitches toward −90° (top-down), dolly back. Ease `power2.inOut` mapped onto the scrub. | The plane tilts into view and the connections untangle. The nine industry nodes brighten from 0.4 to 1 as the camera passes them. |
| 60-85% | Top-down, FOV narrows (orthographic feel) | The nine industry nodes slide (shader-side lerp) into the exact screen positions of the nine DOM chips' station nodes. The small nodes fade to 0. A `node-label` reads "Boardroom" at top-right. |
| 85-100% | Fixed | **Handoff:** the canvas fades out (300ms) while the DOM chips fade in (300ms), pixel-aligned. The chips stay as real links. Unpin. |

**Rules.**
- Desktop ≥1024px, `prefers-reduced-motion: no-preference`, `navigator.connection.saveData !== true`, and WebGL2 available. Otherwise the chips are simply shown (they are the default DOM).
- Loaded **after LCP and on idle**, via `requestIdleCallback`, and only when the fold is within 1.5 viewports (IntersectionObserver). The module is `import()`ed.
- `three` is imported per class (WebGLRenderer, PerspectiveCamera, InstancedMesh, LineSegments, BufferGeometry, ShaderMaterial), tree-shaken. **Budget ≤ 160KB gzip including the scene code** (measured in the build; fail the build above that).
- DPR is capped at 1.5. Rendering happens only while the fold is in view and only on scroll change (no idle rAF loop), so a static scroll costs 0 frames.
- Labels are DOM, not WebGL text. The canvas is `aria-hidden`. A pause is implicit, because nothing animates without scroll.

---

## 7. Reduced-motion fallbacks

Everything lives in `gsap.matchMedia()` with two branches. Lenis is not created under reduced motion. The `.js` class is not added, so nothing is ever hidden.

| Element | Full motion | Reduced motion |
|---|---|---|
| Hero network | B1-B6 + drift + dock Flip | Static full SVG with all 14 nodes. Header cluster always visible. No drift and no pause button needed. |
| Swoosh / rising arrows | DrawSVG | Drawn |
| The Spine | Scrubbed draw | Fully drawn, static (still a useful wayfinding line) |
| Proof band | Line draw + count-up | Final numbers, line drawn |
| Expertise rows | Reveal + hover line draw | No reveal. Hover = node fill + colour change only (200ms opacity/colour is allowed). |
| Method | Pinned, scrubbed | Static `<ol>` diagram with all three steps visible |
| Impact numerals | Count | Final values |
| Three.js field | Pinned 3D crane | Not loaded. The nine chips are shown. |
| Founder ring | Ring draw | Drawn |
| Insights filter | Flip | Instant re-render |
| Article rail | Scrub fill | Fill updates without transition |
| Contact connection | Line draw 900ms | Line appears |
| 404 | Drag + snap | Button "Reconnect and go home" + link |
| Section reveals | Fade + 16px, 560ms | None (content is visible) |

In addition:
- Keyboard focus moving inside a pinned section (method, field) scrolls the section to the state that shows the focused element.
- `scroll-margin-top: 88px` is set on all anchors.

---

## 8. Performance plan

**Targets** (brief 9 / DNA 8): LCP ≤ 2.5s on mobile (the H1 is the LCP element), INP ≤ 200ms, CLS < 0.05, home ≤ 1.5MB first load, Lighthouse 90+ ×4.

| Budget item | Home first load (gzip/br) |
|---|---|
| HTML (with inlined critical CSS ≤ 14KB) | 28KB |
| CSS rest | ≤ 45KB |
| Fonts: Fraunces Variable roman latin 67KB (preload) + Instrument Sans Variable 30KB | 97KB |
| Hero SVG (inline, hand-optimised; logo cluster + 14 nodes + paths) | ≤ 12KB |
| JS: GSAP core + ScrollTrigger + DrawSVG + SplitText + Flip, Lenis, site code (Spine, hero, reveals) | ≤ 95KB |
| Images: founder avatar 280px AVIF@2x (about 28KB) + 3 insight thumbs AVIF (about 3x35KB), lazy | ≤ 140KB |
| **Subtotal before idle** | **≈ 420KB** |
| Idle / in-view: three.js + field scene + links JSON (desktop only) | ≤ 160KB |
| **Worst case** | **≈ 580KB, well under 1.5MB** |

**Tactics:**
- **Astro static output.** Islands only for the hero (`client:idle`), the Spine (`client:idle`), the method (`client:visible`), the field (custom idle + visible loader), the filter (`client:visible`) and the 404 drag (`client:visible`). Each GSAP plugin is registered only in the island that uses it.
- **Fonts.** Self-hosted from `@fontsource-variable/*`, with a `size-adjust` fallback (DNA 3.1) and a preload of the Fraunces file only.
- **The Spine** is one path, recomputed on `ResizeObserver` (debounced). Draws use `stroke-dashoffset` via DrawSVG, so they are compositor-cheap. There is no filter or blur anywhere, and no `backdrop-filter` except the header.
- **Drift** runs on a single `gsap.ticker` callback that writes `transform` attributes to 14 groups. It pauses off-screen and on `visibilitychange`.
- **Lenis:** `lerp 0.12`, `syncTouch: false` (native touch), destroyed under reduced motion.
- **Images:** `<picture>` AVIF/WebP with width and height set, and `loading="lazy"` everywhere on home (the hero has no image).
- **CI gate.** Run Lighthouse CI on `/` and one article, plus `size-limit` on the JS chunks. The build fails if the field chunk exceeds 160KB or the home total exceeds 1.5MB.
- **Accessibility gate.** axe in CI, a keyboard-only walkthrough (reach /contact in 2 actions), and 200% zoom with no loss.

---

## 9. Why this is unmistakably KoKreaters, not a template

1. **The motif is already theirs.** Every graphic on the site comes from the logo's own geometry: its five nodes, its ring construction (dot, white ring, coloured ring), its line weights and its rising arrow. No stock illustration, no icon set, no blob.
2. **The brand line is drawn, not stated.** "Plant floor to boardroom" appears *as geometry* twice: the method's rising arrow climbs from "Plant floor" to "Boardroom", and the Three.js field cranes from floor level to the top-down view. A generic consultancy has no axis like this to draw.
3. **One line holds the whole site together.** The Spine connects every section and ends at a conversation (the terminal node beside the CTA). Visitors follow it without being told. It turns "Connect · Collaborate · Create" from a tagline into the way the page is read.
4. **Colour is information, not decoration.** The six pillar colours are born out of the logo in the hero bloom, then reappear only as wayfinding: index, pillar pages, insight tags and the "you are here" map. This follows the brief's Google-dots principle, without colour soup.
5. **Ganeaysh is a node, not a stock face.** The founder portrait sits on the network (the line touches his ring). Contact ends with the visitor's own name connected to his. Proof is real places and numbers from his career, labelled "From our founder's career".
6. **It avoids every template move.** No card grids (rows and hairlines only), no gradients except the 404, no hero video, no carousel, no magnetic buttons, no marquee, no custom cursor, no parallax type. There are four motion moments (bloom-and-dock, method arrow, field crane, connection) and a calm baseline everywhere else.

---

## 10. Open items this direction adds (on top of brief section 11)

1. A source line under the proof band ("From our founder's career at Wilmar and Cargill, 2001-2026"): owner approval.
2. "Plant floor" / "Boardroom" axis labels in the method and the Three.js field: owner approval (the words come from the brief).
3. A place label for the WHO result (or leave it blank).
4. Challenge / done / result copy for impact cards 1, 2 and 4.
5. Per-step "what you get / typical duration" for the Approach stepper.
6. An Insights hub intro line, and an Impact H1 if it should differ from the home headline.
7. The chronological order of the About map arcs.
8. The Three.js field replaces the golden-oil shader as the one WebGL scene: owner to choose.
9. Instrument Sans in place of Plus Jakarta Sans (DNA deviation, carried over).
10. The expertise overview as index rows in place of the 2x3 card grid (DNA deviation, carried over).
