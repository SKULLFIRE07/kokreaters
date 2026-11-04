# Bencho (bencho.dev) blocks for KoKreaters v2

Owner request (4 Nov 2026): "use components from bencho.dev as well".
Licence: free blocks are MIT (Copyright (c) 2026 Lorenzo Cabra). All blocks below are FREE (checked in bencho's catalog: only 2 of 177 are Pro, none used here). Pro blocks must NOT be used.
Do not use the Bencho name/goat mark, its demo pictures, or its sounds.

## How to use them
- Bencho blocks are React + motion. This site has NO React. PORT each block to vanilla TypeScript + GSAP (+ CSS) as an Astro component in `src/components/bencho/<Name>.astro` with its script in `src/scripts/bencho/<name>.ts`. Keep the physics/feel, restyle to the KoKreaters v2 tokens.
- Source: open `https://bencho.dev/blocks/<slug>` in headless Chrome (Playwright, /usr/bin/google-chrome) and read the Code pane, or read the component in the site's JS chunks. Watch the live demo (screenshots/frames) to match the feel.
- MIT condition: put the MIT notice in a header comment of each ported file and list every ported block in `web/THIRD_PARTY_NOTICES.md` with the full MIT text.
- Every block: content must exist as real HTML first (lists, links, headings) and the block enhances it; lazy-init with IntersectionObserver; pointer effects only on (hover:hover) and (pointer:fine); keyboard alternative for anything draggable; prefers-reduced-motion = static; per-page added JS <= 35KB gzip; no layout shift.

## Mapping (slug → where)
| Bencho block (slug) | Where on KoKreaters | Notes |
|---|---|---|
| magnetic-letters | Home hero H1 | Letters lean toward pointer, desktop only. H1 stays real text. |
| flap-board | Home proof band + About | Split-flap cycling the datelines: INDIA · WILMAR → INDONESIA → UKRAINE −25 °C → TÜRKIYE → THE NETHERLANDS. Mono, Saffron on Imperial. |
| gravity-tags | Home "Where we work" | The 9 industries as pill tags that fall and pile, tossable. Real `<ul>` of links underneath for a11y/SEO. |
| hub-diagram | /expertise overview | KoKreaters node in the centre, six pillar nodes on spokes with packets running; hover lights a pillar. |
| spec-inspector | Pillar pages "spec label" | Drag a frame over the What's inside / Typical deliverables label and it turns to a blueprint with measurements. Fits the honest-label idea. |
| crumple | /approach | A generic "200-page report" card: press and it crumples into a ball — caption "We do not hand over a report and leave." (brief promise copy). |
| faq-accordion | /approach engagement models | Five ways to work with us as an accordion (semantic `<details>` underneath). |
| foggy-word | /impact Ukraine case | "−25 °C" behind steamed/frosted glass, wipe to reveal. |
| card-swap | /impact founder results | The four results as a depth stack of cards you can fling. Static list fallback. |
| card-fan | /insights hub | Article covers fanned; press to lift. |
| text-rise | Section headings site-wide | Line/word rise reveal (replace current reveal where the v2 spec says). |
| edge-light | About portrait frame, pillar cards | Rim light following pointer. |
| ticket | /contact | "Book a 30-minute call" as a boarding-pass with a tear-off stub; tearing (or Enter) goes to the booking link / form. |
| confetti | /contact form success | Paper confetti in the six pillar colours, once. |
| falling-text | 404 | "This page hasn't been created yet." words tumble into a pile you can throw. |
| sweep-button | Primary CTA pills | Colour sweep round the edge on hover. |
| magnetic-dots | CTA band / footer background | Subtle dot field leaning to the cursor. |

Nice-to-have if budget allows: line-sphere (alternative About globe; keep existing Three.js globe as primary), stacked-bars / price-chart patterns for article Exhibits.
