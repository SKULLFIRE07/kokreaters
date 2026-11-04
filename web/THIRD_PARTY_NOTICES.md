# Third-party notices

## Bencho blocks (bencho.dev)

Several interactive blocks on this site are ports of free blocks from [Bencho](https://bencho.dev), rewritten from
React + motion to vanilla TypeScript + GSAP + CSS and restyled to the KoKreaters v2 tokens (DESIGN-SPEC v2 section 9).
No Bencho name, mark, demo images or sounds are used. Only free (MIT) blocks are ported; no Pro block is used.
Each ported file carries the MIT notice in its header comment.

```
MIT License

Copyright (c) 2026 Lorenzo Cabra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Each unit appends rows **only** under its own heading below (append-only).

## FOUNDATION

| Block (slug) | Source | Ported files | Used on |
|---|---|---|---|
| text-rise | https://bencho.dev/blocks/text-rise | `src/components/bencho/TextRise.astro`, `src/scripts/bencho/text-rise.ts` | site-wide headings (R1, `data-rise`) |
| sweep-button | https://bencho.dev/blocks/sweep-button | `src/components/ui/Button.astro` (CSS), `src/scripts/bencho/sweep-button.ts` | every primary pill |
| magnetic-dots | https://bencho.dev/blocks/magnetic-dots | `src/components/bencho/MagneticDots.astro`, `src/scripts/bencho/magnetic-dots.ts` | CTA field background |
| edge-light | https://bencho.dev/blocks/edge-light | `src/components/bencho/EdgeLight.astro`, `src/scripts/bencho/edge-light.ts` | PillarCards, About photo frame |
| flap-board | https://bencho.dev/blocks/flap-board | `src/components/bencho/FlapBoard.astro`, `src/scripts/bencho/flap-board.ts` | Home proof band, About |

`src/scripts/bencho/physics.ts` is an original KoKreaters helper (no Bencho code), used by the gravity-tags and
falling-text ports.

## P-home

| Block (slug) | Source | Ported files | Used on |
|---|---|---|---|
| magnetic-letters | https://bencho.dev/blocks/magnetic-letters | `src/components/bencho/MagneticLetters.astro`, `src/scripts/bencho/magnetic-letters.ts` | Home hero H1 (desktop, fine pointer) |
| gravity-tags | https://bencho.dev/blocks/gravity-tags | `src/components/bencho/GravityTags.astro`, `src/scripts/bencho/gravity-tags.ts` (on `physics.ts`) | Home "Where we work" |

Home route map (`src/components/home/RouteMap.astro`): land outline from `world-atlas` 110m (ISC, Mike Bostock), derived from Natural Earth (public domain), projected at build time with `d3-geo` (ISC) and `topojson-client` (ISC). No map code ships to the browser.

## P-expertise

| Block (slug) | Source | Ported files | Used on |
|---|---|---|---|
| hub-diagram | https://bencho.dev/blocks/hub-diagram | `src/components/bencho/HubDiagram.astro`, `src/scripts/bencho/hub-diagram.ts` | `/expertise` hub (F2) |
| spec-inspector | https://bencho.dev/blocks/spec-inspector | `src/components/bencho/SpecInspector.astro`, `src/scripts/bencho/spec-inspector.ts` | pillar pages, over the "What’s inside" SpecLabel (F2) |

## P-story

| Block (slug) | Source | Ported files | Used on |
|---|---|---|---|
| crumple | https://bencho.dev/blocks/crumple | `src/components/bencho/Crumple.astro`, `src/scripts/bencho/crumple.ts` | `/approach` F3 (the report) |
| faq-accordion | https://bencho.dev/blocks/faq-accordion | `src/components/bencho/FaqAccordion.astro`, `src/scripts/bencho/faq-accordion.ts` | `/approach` F5 (ways to work with us) |
| foggy-word | https://bencho.dev/blocks/foggy-word | `src/components/bencho/FoggyWord.astro`, `src/scripts/bencho/foggy-word.ts` | `/impact` Ukraine case, −25 °C |
| card-swap | https://bencho.dev/blocks/card-swap | `src/components/bencho/CardSwap.astro`, `src/scripts/bencho/card-swap.ts` | `/impact` F2 (results stack) |

## P-journal

| Block (slug) | Source | Ported files | Used on |
|---|---|---|---|
| card-fan | https://bencho.dev/blocks/card-fan | `src/components/bencho/CardFan.astro`, `src/scripts/bencho/card-fan.ts` | `/insights` featured fan |
| ticket | https://bencho.dev/blocks/ticket | `src/components/bencho/Ticket.astro`, `src/scripts/bencho/ticket.ts` | `/contact` boarding pass |
| confetti | https://bencho.dev/blocks/confetti | `src/components/bencho/Confetti.astro`, `src/scripts/bencho/confetti.ts` | `/contact` form success |
| falling-text | https://bencho.dev/blocks/falling-text | `src/components/bencho/FallingText.astro`, `src/scripts/bencho/falling-text.ts` (on `physics.ts`) | 404 word pit |


## Fonts

Bricolage Grotesque, IBM Plex Mono, Caveat and Instrument Sans are self-hosted from the Fontsource npm packages and
licensed under the SIL Open Font License 1.1.
