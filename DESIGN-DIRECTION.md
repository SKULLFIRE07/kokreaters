# KoKreaters.com — Design direction v0.1 (4 Nov 2026)

Source: KoKreaters_Website_Brief.docx v1.0. This file turns the brief into a build plan.

## 1. Assets collected (./assets)

| File | What | Status |
|---|---|---|
| brief/kokreaters-logo-full.png | Full lockup, 2213x604, white bg | Raster only |
| logo/kokreaters-logo-full-transparent.png | Same, white removed | Use for mocks |
| logo/kokreaters-node-cluster.svg | Node cluster rebuilt as SVG, each node its own group | Draft; check vs master |
| logo/kokreaters-node-cluster-raster.png / wordmark-tagline-raster.png | Split crops | Mocks only |
| photos/ganeaysh-portrait-1665x2048.png | Studio headshot, grey wall, navy blazer | Usable for About |
| photos/ganeaysh-avatar-640.png | Square crop | Avatar, quote ring |
| brief/brief-homepage-wireframe.png | Wireframe from the brief | Reference |

Photos came from the SKULLFIRE07/ganeaysh-kulkarni-card repo. Cargill logos in that repo were NOT copied (brief bans former-employer logos).
The lapel pin in the portrait may be a company pin — retouch it out or confirm.
Still missing: vector wordmark (custom rounded type, cannot be retyped), environmental lab/plant portrait, ingredient photography.

## 2. Stack

- **Astro** (static, islands) + **GSAP 3.13+** (free incl. ScrollTrigger, SplitText, DrawSVG, MorphSVG, Flip, Observer since Apr 2025) + **Lenis** smooth scroll.
- **Three.js** for ONE lazy-loaded WebGL scene (golden-oil shader), desktop only, loaded after LCP.
- **Sanity** (free tier) for Insights, Impact, testimonials so Ganeaysh edits alone. Host on Cloudflare Pages or Vercel.
- **Drop Velocity.js**: unmaintained since ~2018, everything it does GSAP does better.
- **Drop Anime.js**: v4 is good, but a second tween engine duplicates GSAP, adds weight and two timing systems. Use only if one effect genuinely needs it.
- Why not Webflow (brief's default): heavy custom WebGL + GSAP choreography fights Webflow; Astro keeps the 1.5 MB / LCP 2.5 s budget.

## 3. The aura, translated into signature moments

Rule: 3–4 "wow" moments, everything else calm (brief: 150–300 ms, ease-out, nothing bounces). Wow lives in the hero, method, impact and the oil scene.

1. **Living network hero.** The logo cluster explodes into 12–20 drifting ringed nodes on a Cloud background with the three soft discs. Lines draw in (DrawSVG). Cursor gently attracts nodes. On scroll the network collapses back into the small cluster in the sticky header (GSAP Flip). Canvas 2D, <150 KB.
2. **Headline reveal.** Fraunces display set with SplitText line masks; the hand-drawn rising arrow draws under "shared ambition".
3. **Proof band.** Imperial band, Saffron Fraunces numbers count up; "WHO" types in last.
4. **Colour wayfinding.** Hover a pillar card and its matching node in the network glows; each pillar page inherits its colour in hero, bullets and tags.
5. **Pinned method.** Connect → Collaborate → Create pinned for ~3 screens; the line and arrow draw between three big nodes, copy swaps per step.
6. **Impact rail.** Horizontal pinned scroll of the four founder results, each with a micro-visual: fat-crystal pattern (India), growth line (Indonesia), frost creeping across the card at −25 °C (Ukraine), WHO seal (trans-fat).
7. **Golden oil scene.** Three.js viscous oil-droplet / fat-crystal shader in amber and violet as the transition into Industries. This is the "food science" signature no generic consultancy has.
8. **About map.** Stylised world map, Sapphire arcs drawing between Mundra, Kakinada, Gurugram, Pune, Medan, Odessa, Balikesir, Amsterdam. Career timeline as a node line.
9. **Insights as McKinsey.** Long-form template, numbered "Exhibit" charts that animate on entry, pull quotes in Fraunces italic.
10. **404.** One node is disconnected; drag it back to reconnect and the page sends you home.

All of it honours prefers-reduced-motion (static network image, fades only).

## 4. What to steal from references (principles, never visuals)

- McKinsey: ideas lead the homepage, serif authority, exhibit charts, white space.
- Google: colour dots as wayfinding, pill buttons, speed, visible focus.
- Unilever: logo-as-story, warm real photography, impact as outcomes.
- Zajno "Foodtech" concept (Dribbble): premium 3D product visuals for food B2B.
- Blendr / Fancy hero (Dribbble): animated network hero.
- shift.vml.dev (Athreix study): one WebGL layer + cursor interaction + Lenis + SplitText polish.

## 5. How to proceed

1. **Day 1 — Decide:** Astro stack, drop Velocity/Anime, headline option A, confirm the portrait.
2. **Days 2–4 — Direction tournament:** build 3 live HTML hero+homepage prototypes (light network, dark Twilight, oil-scene-led). Pick one with Ganeaysh.
3. **Week 2 — System:** tokens from Appendix A, components, all page templates desktop + mobile.
4. **Weeks 3–5 — Build** on a local branch: home → pillar template → about → insights → contact. Sanity schemas.
5. **Week 6 — QA:** Lighthouse 90+, axe clean, reduced-motion pass, real-device scroll test, form + DNS (keep Workspace MX, add SPF/DKIM/DMARC).
6. In parallel, chase Ganeaysh for the open items in brief section 11, starting with the vector logo and photos.
