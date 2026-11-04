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

## P-expertise

| Block (slug) | Source | Ported files | Used on |
|---|---|---|---|

## P-story

| Block (slug) | Source | Ported files | Used on |
|---|---|---|---|

## P-journal

| Block (slug) | Source | Ported files | Used on |
|---|---|---|---|

## Fonts

Bricolage Grotesque, IBM Plex Mono, Caveat and Instrument Sans are self-hosted from the Fontsource npm packages and
licensed under the SIL Open Font License 1.1.
