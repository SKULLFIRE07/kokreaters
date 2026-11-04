# Verdict: direction tournament (4 Nov 2026)

Judged: `direction-network.md`, `direction-editorial.md` and `direction-material.md`, all read against `DNA.md`, `BRIEF.txt` (the brief's 40/30/30 blend of McKinsey, Google and Unilever, the copy and the SEO rules) and `DESIGN-DIRECTION.md`.
Each direction gets a score from 1 to 10 under each of three separate lenses. A score is a judgement, not a measurement.

## Scores

| Direction | Client gut | Target buyer | Build lead | Total |
|---|---|---|---|---|
| **Editorial** | 7 | 9 | 9 | **25** |
| Network | 8 | 7 | 6 | 21 |
| Material | 7 | 6 | 4 | 17 |

**Winner: THE EDITORIAL**, built as the base, with the grafts listed below. Two of them do most of the work: the hero opens into the six pillar nodes, borrowed from Network, and the founder appears warm and at a real size on home.

---

## Lens 1: client gut (Ganeaysh, plus the owner's "cleanest, subtle, world-class")

- **Network, 8.** This is the direction most likely to feel like *his* brand. The logo opens into the six pillar colours and then docks into the header. That is the brief's own line "our logo is a story of connections, and the site animates it". It also uses the coloured nodes as wayfinding, the way Google uses its dots, and makes the founder a node on the line. It loses points for subtlety: there is a Spine on every page, nodes drift, the cursor pulls them, and the page has two pins. The owner's "most subtle" is at risk because there is always a line moving somewhere.
- **Editorial, 7.** It meets the owner's ask best. It is the cleanest of the three: the type does the work, the page goes still after 2.1s, and there are no count-ups and no pins. It is also the strongest version of the brief's 40% McKinsey share (Insights as a journal, sidenotes, exhibits). It is weakest on the brief's 30% Unilever share. The soft discs become hairline outlines, the jewel colours shrink to 6px dots, the founder is a 72px byline avatar on home, and nothing on home uses WebGL. As written, Ganeaysh may find it cool. The grafts below fix that.
- **Material, 7.** Its idea is the strongest of the three, because fat crystals form a network and that network becomes the logo. A 25-year oils technologist would love it on sight. But the whole site depends on one shader looking right, and a golden blob with caustics that is even slightly wrong reads as stock 3D. That is the opposite of "subtle". The specimen labels (`PLATE 01 · OIL, LIQUID`) and the hero parallax also add new wording and motion that the owner did not ask for.

## Lens 2: target buyer (an Indian edible-oils MD and a Cargill-level R&D head)

- **Editorial, 9.** It earns trust in the first 5 seconds: the headline is visible at once, the masthead line names the five countries, and the proof is set as facts with datelines ("INDIA · WILMAR", "−25 °C") and the source line "From our founder's career". There are no pins and no scroll-jacking, so an MD on a phone can scan the page, and the "Book a call" pill is never more than one fold away. The serif articles with numbered exhibits on 3-MCPD and bleaching earth are exactly what an R&D head reads before getting in touch. One point is lost because the only human face on home is a 72px avatar, and these buyers hire a person.
- **Network, 7.** The proof band, the index rows and the terminal node at the CTA all lead clearly to "Book a call". But a 2.5-viewport method pin followed by a 1.5-viewport 3D crane makes four or more screens of scrubbing between proof and contact. A busy MD will feel that. The pillar "you are here" map is strong navigation.
- **Material, 6.** The first glance is the strongest of the three: an oils MD recognises the oil at once. After that it pins for 250vh, then shows a full-bleed photo with no copy (fold 6), and both slow the route to the call. Its photo plates (one for home, six for pillars, about nine for sectors and four for impact) do not exist yet. Without them, the pages would show gaps or the stock imagery the brief bans.

## Lens 3: build lead (Astro, GSAP and Lenis in one pass by agents; budget, reduced motion, accessibility, SEO)

- **Editorial, 9.** It is the simplest to build:
  - motion is a set of DrawSVG strokes, SplitText on h2 only and one scrubbed line, with no pins
  - home is about 320KB with 66KB of JS, and no Flip or Three.js loads on home
  - the hero SVG ships already drawn, so the reduced-motion and no-JS versions come almost for free
  - the line-work globe (LineSegments, an orthographic camera, rendering only when scrolled, an `<ol>` equivalent) is the lowest-risk WebGL scene of the three
  - semantic furniture: `<aside>` sidenotes, a real `<table>` and one H1 on every page

  One gap: home comes to about 620 words, under the 800+ server-rendered target. Adding the brief's own positioning copy fixes it (see graft 9).
- **Network, 6.** It can be built, but some parts are fragile:
  - The Spine is one path measured from the DOM and recomputed on resize. Every page's layout depends on it, and fonts, images and the CMS move the anchors.
  - The Three.js chips have to land pixel-aligned with the real DOM chips.
  - There are two pins on home.
  - The hero drift and cursor pull need a pause button.

  Agents can do all of this, but each item needs several rounds of fixes. The budget is fine: about 420KB, rising to about 580KB once the scene loads.
- **Material, 4.** Its main risk is quality, not size.
  - The SDF raymarched sessile drop needs refraction, Beer-Lambert absorption, Voronoi caustics, a three-phase crystallisation and a seed-to-logo-coordinate lerp. That is a specialist shader job, and an agent's first pass will not look premium.
  - It also needs an offline Puppeteer render pipeline for its still images, a fixed canvas re-positioned between two stages, and about 20 photographs that nobody holds yet.
  - The 0.85x hero parallax and the pointer light-follow both go against the DNA's calm baseline.

---

## Specific grafts into the Editorial base

From **Network**:
1. **Hero bloom and dock** (Network 3.3, beats B1 to B4, plus the scroll-exit Flip). This replaces Editorial's static 14-node engraving.
   - The five logo nodes light up in sequence, then six labelled pillar nodes draw out of the Saffron centre in their own colours.
   - On scroll, the cluster docks into the header with Flip, 640ms.
   - Keep Editorial's rules: **no ambient drift and no cursor attraction**, everything is still after about 2s, so no pause button is needed.
   - This brings back the brief's "site animates the logo" and Google-dots wayfinding without the subtlety cost.
2. **Proof band, line through Saffron-ringed station nodes** (Network fold 2). One Sky line draws across the band and each stat node lights as the line passes. Keep Editorial's no-count-up default, and offer the 600ms count on 25 / 5 / 3 only if Ganeaysh asks.
3. **Terminal node beside "Book a 30-minute call"**, so the hero line and the method line visibly end at the conversation. It replaces Editorial's arrowhead, does the same job and reads more clearly.
4. **"You are here" pillar map** on each `/expertise/[slug]` hero (Network 5.1). Five real links in `<nav aria-label="Other expertise">`. It replaces Editorial's single-ring engraving and the compact row at the bottom of the pillar page.
5. **The contact "connection moment"** (Network 5.7). On a successful submit, a line draws from the visitor's typed name to Ganeaysh's person node, in an `aria-live` region; under reduced motion the line simply appears. It costs little and adds warmth exactly where it converts.
6. **Article route rail** at 1280px and wider: Editorial's sticky table of contents, drawn as station nodes on a progress line.

From **Material**:
7. **Founder at real size on home.** A 280-320px portrait in a circle with a Saffron ring, behind it **filled** Lavender and Butter discs at 60%, and the ring drawn once (1200ms). This partly reverses Editorial's "discs as hairlines" deviation, but only here, to carry the brief's 30% Unilever share of human presence. The quote stays in Editorial's 40/50 roman-to-italic setting.
8. **The "−25 °C" frost tick.** A 1px Ice underline draws under that figure in the impact rows, 900ms. That is the only flourish there.
9. **Positioning copy on home**, to reach 800+ words. Add the brief's "What makes KoKreaters different is range..." paragraph as a short fold between proof and the index. All of it is brief copy, so nothing is invented.
10. **Non-text contrast fix.** Saffron and Sky bullets and dots get a 1px Ink ring, because Saffron on white is 1.6:1 and fails 3:1. Use this on pillar pages and the index.
11. **Keyboard-operable 404 node** (`role="button"`, arrow keys move it), added to Editorial's hover-slide and drag.
12. **One offline still-render path** for the globe: a Puppeteer render of the same scene produces the mobile and reduced-motion SVG or AVIF, so fallback users see the same art.
13. **Material photography as an upgrade, not a dependency.** Sector and article plates appear only when licensed images exist. The oil and crystal shader is kept on file as the alternative WebGL scene if Ganeaysh wants food science over the globe. Only one scene ships.

## What stays exactly as Editorial wrote it
- Fraunces plus Instrument Sans, with the article body in Fraunces at opsz 14.
- Folios and datelines, sidenotes, index rows, industries as typeset links, and a scrubbed method line with no pin.
- No gradients in the UI. The CTA and footer are one Imperial field.
- The engraved-globe Three.js scene on About: CSS sticky rather than a GSAP pin, rendering only when scrolled, and Three.js loaded only on About.
- The performance gates: home JS ≤ 80KB (≤ 95KB with Flip for the dock graft), home total ≤ 600KB, Lighthouse CI, axe, and a Playwright reduced-motion pass.

## Owner decisions this verdict needs
1. Is the one WebGL moment on About acceptable, rather than on home? Fallback: Editorial's small home globe beside "5 countries", about 135KB, loaded lazily.
2. No count-up, or a 600ms count on the integers?
3. Filled discs behind the founder portrait (graft 7), while everywhere else they stay hairline outlines.
4. All the inherited DNA deviations: Instrument Sans, index rows instead of cards, no Aurora or Twilight gradients, footer in Imperial.
