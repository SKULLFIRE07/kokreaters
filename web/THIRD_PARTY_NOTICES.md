# Third-party notices

What ships in, or is used to build, the KoKreaters website (v3 "Editorial"). Runtime code is our own: no third-party
JavaScript, font, image or style is loaded from another origin (enforced by the CSP and by `tests/smoke.spec.ts`).

v3 removed every v2 dependency and port that used to be listed here: the Bencho block ports (MIT), GSAP, Lenis, three.js,
the Bricolage Grotesque / IBM Plex Mono / Caveat / Instrument Sans fonts and the home route map.

## Fonts

Source Serif 4 (Adobe, `@fontsource-variable/source-serif-4`: `source-serif-4-latin-opsz-normal.woff2` and
`…-italic.woff2`) and Inter (Rasmus Andersson, `@fontsource-variable/inter`: `inter-latin-opsz-normal.woff2`) are
self-hosted from the Fontsource npm packages (copied to `public/fonts/` by `scripts/copy-fonts.mjs`) and licensed under the
SIL Open Font License 1.1.

## Stock photography

Twenty photographs from [Unsplash](https://unsplash.com/license) and [Pexels](https://www.pexels.com/license/), each used
under that site's own free licence (commercial use allowed, attribution not required; we credit anyway). No photo shows a
legible brand logo or names a company; two were cropped to remove a partial uniform emblem and a cut-off face. Originals
are kept unedited in `../assets/photos/stock-src/`; `scripts/grade-photos.mjs` writes the graded copies to
`src/assets/photos/stock/` (resize to 2400px, saturation x0.78, cool cast, 25% logo-blue luminance wash, navy shadow lift).
Typed records with alt text and these credits: `src/data/photos.ts`. All twenty are pending client approval (brief).

| Slug | Subject | Photographer | Source | Licence |
|---|---|---|---|---|
| refinery-01 | Process plant at dusk | Igor Passchier | https://www.pexels.com/photo/industrial-facility-in-zuid-holland-at-dusk-32399139/ | Pexels License |
| refinery-02 | Refinery columns and tanks | Red Shuheart | https://unsplash.com/photos/industrial-refinery-with-storage-tanks-Wb4vcBqyGT8 | Unsplash License |
| plant-01 | Stainless process vessels and pipework | Crystal Kwok | https://unsplash.com/photos/xD5SWy7hMbw | Unsplash License |
| cold-01 | Tanks and plant in snow at sunrise | Kay Mayer | https://unsplash.com/photos/industrial-tanks-in-a-snowy-landscape-at-sunrise-qvCvkdiHXZU | Unsplash License |
| texture-01 | Steel roof trusses in low light | Declan Sun | https://unsplash.com/photos/steel-beams-of-an-industrial-buildings-roof-Jfr7YZWcyVY | Unsplash License |
| texture-02 | Pipework in a plant room | iSawRed | https://unsplash.com/photos/a-large-machine-with-pipes-WB9HyqF8lKA | Unsplash License |
| oils-01 | Oil running from a steel spout | Xavier von Erlach | https://unsplash.com/photos/golden-oil-pouring-from-a-metal-spout-into-a-container-dDWVq_XEhus | Unsplash License |
| oils-02 | A drop of golden oil | Colin Lloyd | https://unsplash.com/photos/clear-glass-bottle-with-yellow-liquid-OacW0FPpNMw | Unsplash License |
| oilseeds-01 | Sunflower seeds | Engin Akyurt | https://www.pexels.com/photo/close-up-of-sunflower-seeds-in-bulk-34313442/ | Pexels License |
| lab-01 | Analyst checking sample tubes | Jeetendra Vyas Fashionpfotographer | https://www.pexels.com/photo/scientist-checking-test-tubes-in-laboratory-machine-9408640/ | Pexels License |
| lab-02 | Technician pipetting samples | CDC | https://unsplash.com/photos/scientist-using-pipette-in-laboratory-_N7I1JyPYJw | Unsplash License |
| chocolate-01 | Chocolate bars in metal moulds | Daniel Fazio | https://unsplash.com/photos/chocolate-bar-on-gray-container-JBN6FHP5VXk | Unsplash License |
| chocolate-02 | Centres in a coating pan | Amine Kübranur Çakıroğlu | https://www.pexels.com/photo/truffle-coating-in-industrial-chocolate-machine-38594567/ | Pexels License |
| bakery-01 | Unbaked croissants on a tray | Arda Kaykısız | https://www.pexels.com/photo/close-up-of-raw-croissants-lying-on-a-baking-tray-20002816/ | Pexels License |
| bakery-02 | Dough on a production line | Anna Shvets | https://www.pexels.com/photo/dough-on-tape-6291408/ | Pexels License |
| factory-01 | Food production hall, hygiene wear | Anna Shvets | https://www.pexels.com/photo/woman-working-machinery-5953714/ | Pexels License |
| audit-01 | Checklist on a clipboard | cottonbro studio | https://www.pexels.com/photo/man-with-black-gloves-looking-at-checklist-5532844/ | Pexels License |
| people-01 | Working session at a table | Dylan Gillis | https://unsplash.com/photos/people-sitting-on-chair-in-front-of-table-while-holding-pens-during-daytime-KdeqA3aTnBY | Unsplash License |
| people-02 | Meeting-room review | Beatriz Cattel | https://unsplash.com/photos/business-meeting-with-people-around-a-conference-table-3tCLyPBSQ5k | Unsplash License |
| people-03 | Reviewing documents | Olena Kholina | https://unsplash.com/photos/two-people-reviewing-documents-at-a-table-MhqUBTxQ3Hw | Unsplash License |

### v4 "Delft" photographs (client-selected, 20 Nov 2026)

Fourteen photographs chosen and checked by the client on their Unsplash pages on 20 Nov 2026, used under the
[Unsplash License](https://unsplash.com/license) (commercial use allowed, attribution not required; credited anyway). No
readable brands and no identifiable faces. Originals (ungraded): `../assets/photos/unsplash-v4/`; site copies:
`src/assets/photos/stock/`; records: `src/data/photos.ts`. Photographer names were not recorded in the client's guide;
the photo pages below carry them.

| Slug | Subject | Photographer | Source | Licence |
|---|---|---|---|---|
| hero-rapeseed | Rapeseed field under a blue sky | Unsplash contributor | https://unsplash.com/photos/yellow-flower-field-under-blue-sky-during-daytime-DVeUvOEUwNA | Unsplash License |
| agri-fields | Patchwork of farm fields | Unsplash contributor | https://unsplash.com/photos/orange-and-green-abstract-painting-0U7xx2X60YE | Unsplash License |
| develop-pipette | Gloved hand with a pipette (US CDC, public domain) | Unsplash contributor | https://unsplash.com/photos/person-using-pipette-in-laboratory-wDxFn_dBEC0 | Unsplash License |
| scale-tanks | Stainless steel tanks and pipework | Unsplash contributor | https://unsplash.com/photos/gray-industrial-machine-xD5SWy7hMbw | Unsplash License |
| access-ship | Bulk carrier at sea at dawn | Unsplash contributor | https://unsplash.com/photos/red-and-white-cargo-ship-at-middle-of-ocean-sfjS-FglvU4 | Unsplash License |
| feed-silos | Grain silos behind a maize field | Unsplash contributor | https://unsplash.com/photos/a-field-of-corn-and-silos-with-a-red-building-in-the-background-u0rXTqnUEgs | Unsplash License |
| oils-pour | Golden oil pouring between spoons | Unsplash contributor | https://unsplash.com/photos/a-glass-of-liquid-2srLXVFaOJs | Unsplash License |
| bakery-dough | Hands holding dough | Unsplash contributor | https://unsplash.com/photos/person-holding-dough-4yzEtTQLdL4 | Unsplash License |
| cocoa-pods | Cocoa pods on a branch | Unsplash contributor | https://unsplash.com/photos/cocoa-pods-hanging-from-a-tree-branch-sFCOat9rphk | Unsplash License |
| nutrition-spices | Spice powders on black | Unsplash contributor | https://unsplash.com/photos/brown-and-white-beans-on-white-ceramic-plate-NL02eAwtkmM | Unsplash License |
| nl-polder | Dutch polder and canal | Unsplash contributor | https://unsplash.com/photos/a-river-with-grass-on-the-side-ZmO1wsr_3mY | Unsplash License |
| spare-hall | Clean food-processing hall | Unsplash contributor | https://unsplash.com/photos/white-and-green-metal-stand-KR9j7uqFhnI | Unsplash License |
| spare-wheat | Wheat field | Unsplash contributor | https://unsplash.com/photos/wheat-field-y4xZxzN754M | Unsplash License |
| spare-maize | Maize kernels | Unsplash contributor | https://unsplash.com/photos/green-grass-field-during-daytime-5m37cx0D-wI | Unsplash License |


## Icons: Lucide (v3)

UI and expertise icons are inlined at build time from `lucide-static` 1.70.0 (https://lucide.dev), by
`src/components/ui/Icon.astro` and `src/components/ui/ExpertiseIcon.astro`. Used: arrow-right, arrow-up-right, arrow-left,
chevron-down, chevron-right, menu, x, plus, minus, mail, message-circle, phone, download, calendar, check,
external-link, clock, map-pin, search, circle-alert, circle-check, flask-conical, factory, shield-check, split,
file-search, users. The LinkedIn "in" glyph is drawn by hand (not from Lucide).

ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Some Lucide icons (among those used: arrow-right, arrow-up-right, arrow-left, calendar, check, chevron-down,
chevron-right, download, external-link, clock, minus, plus, search, x) derive from Feather
(https://feathericons.com):

The MIT License (MIT) (for the Feather-derived icons listed above)

Copyright (c) 2013-present Cole Bemis

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

## About: places map (build time only)

`src/assets/map/places-map.svg` and `src/data/map/places-map.json` are generated by `scripts/build-map.mjs` from
`world-atlas` 2.0.2 `countries-50m.json` (ISC, Mike Bostock; geometry from Natural Earth, public domain), projected with
`d3-geo` (ISC) and decoded with `topojson-client` (ISC). The three packages are dev dependencies; no map code ships to the
browser.

```
ISC License (world-atlas, d3-geo, topojson-client)

Copyright 2013-2019 Michael Bostock (world-atlas); Copyright 2012-2019 Michael Bostock (topojson-client);
Copyright 2010-2026 Mike Bostock (d3-geo)

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```


## V5 food photography (23 November 2026)

Natural, ungraded photographs used under the Pexels or Unsplash licence.

- food-cream: Soumia Photography, https://www.pexels.com/photo/chocolate-mousse-and-whipped-cream-dessert-topped-with-strawberry-14668476/
- food-croissant: Amanda Hemphill, https://www.pexels.com/photo/close-up-of-chocolate-croissant-7440383/
- food-creamer: Eiliv Aceron, https://www.pexels.com/photo/cream-pouring-into-glass-with-iced-coffee-on-table-6895939/
- food-icecream: Anastasia Belousova, https://www.pexels.com/photo/ice-cream-in-bowls-8807333/
- food-spread: Darya Grey_Owl, https://www.pexels.com/photo/artistic-shot-of-bread-with-chocolate-spread-29808181/
- food-fries: Pexels, https://www.pexels.com/photo/close-up-photo-of-fried-french-fries-beside-a-white-dip-10024104/
- food-mithai: Gaurav Kumar, https://www.pexels.com/photo/traditional-indian-sweets-18488301/
- food-plantbased: Pexels, https://www.pexels.com/photo/bowl-of-salad-1484522/
- food-sauce: Demian Grygorchuk, https://www.pexels.com/photo/a-flatlay-of-a-white-sauce-in-a-glass-bowl-8053728/
- food-chocolate: Daniel Fazio, https://unsplash.com/photos/chocolate-bar-on-gray-container-JBN6FHP5VXk
