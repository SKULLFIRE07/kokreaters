# v3 photography: contact sheet and placement plan

Status: **20 photos sourced, graded and wired; all pending client approval** (the brief says "developer to source stock, client to approve").
Visual contact sheet (graded): `research/v3/photos-contact-sheet.jpg`.

| What | Where |
|---|---|
| Raw originals (unedited downloads) | `assets/photos/stock-src/<slug>.jpg` (72 MB, not shipped) |
| Graded, shipped copies | `web/src/assets/photos/stock/<slug>.jpg` (2400px long edge max, mozjpeg q80, 5.5 MB total; Astro makes AVIF/WebP widths) |
| Grade script | `web/scripts/grade-photos.mjs` (`node scripts/grade-photos.mjs [slug...]`, idempotent: unchanged files are not rewritten) |
| Typed records | `web/src/data/photos.ts` (`photos[slug]` = `{ src, file, alt, tags, orientation, focal, position, tone, credit }`, plus `photoList`, `photosByTag(tag)`, `PHOTO_SLUGS`) |
| Credits | `web/THIRD_PARTY_NOTICES.md` → "Stock photography" |

## Licence and content rules applied

- Only **Unsplash License** (11) and **Pexels License** (9) photos. Unsplash+ (premium, `plus.unsplash.com`) excluded; every Unsplash pick served from `images.unsplash.com` and its page reads "Free to use under the Unsplash License". Every Pexels page lists licence "Free".
- No legible brand logos, no named companies, no AI renders, no posed smiles to camera. Rejected on these grounds: brewery tanks with decals, a food line with a "SmartDate" printer logo, a Russian plant with branded helmets, meetings with Apple logos on laptops, a workshop table with printed org logos and a branded T-shirt, a whiteboard with an "Expo" marker and web-design notes, a stock "SWOT analysis" grin, a refinery shot with a container brand (could be cropped, dropped instead).
- Two crops in the grade script: `bakery-02` top 14% (partial emblem on a worker's uniform), `audit-01` top 22% (cut-off face). One hue fix: `refinery-01` -14° (violet dusk sky to blue). One saturation fix: `cold-01` x0.25 on top of the shared grade (pink/mauve sunrise on sky and snow to cool snow light; a hue turn pushed it toward magenta).
- Grade, identical for all: saturation x0.78, cool cast (R x0.97, G x0.99, B x1.025), contrast x1.05, a 25% wash of the photo's own luminance tinted logo blue #2C509E, a 50% screen of navy #0B1B33 so shadows sit on navy. Oil, chocolate and crust stay warm but quiet; food never goes grey.
- Notes the client should know: `lab-02` is a CDC (US public health) photo of a clinical lab (nothing identifies CDC in frame); `people-02` shows a generic spreadsheet on a wall screen; `refinery-01` is a Rotterdam plant and `cold-01` a European tank farm, neither identifiable from the image; `people-01` was shot in a brewery taproom (not visible).

## Contact sheet

Orientation and size are of the graded file. `position` = CSS `object-position` to use for cover crops (checked at 21:9, 16:9, 4:3, 4:5).
Tone: **dark** = takes white type under the navy scrim easily; **mid** = needs the scrim; **light** = use on white/grey grounds or with a strong scrim.

| # | Slug | Subject | Orient. / px | Tone | Position | Photographer (licence) |
|---|---|---|---|---|---|---|
| 1 | `refinery-01` | Process plant, columns + horizontal vessel, lit at deep-blue dusk | landscape 2400×1600 | dark | 50% 70% | Igor Passchier (Pexels) |
| 2 | `refinery-02` | Refinery columns, chimneys, weathered storage tanks, low evening light | landscape 2400×1600 | mid | 50% 55% | Red Shuheart (Unsplash) |
| 3 | `plant-01` | Stainless process vessels and sanitary pipework, indoor plant | landscape 2400×1600 | light | 50% 50% | Crystal Kwok (Unsplash) |
| 4 | `cold-01` | Aerial: tank farm + plant in deep snow at sunrise, steam | portrait 1457×2400 | light | 50% 45% | Kay Mayer (Unsplash) |
| 5 | `texture-01` | Steel roof trusses almost in darkness, band of skylight | landscape 2400×1137 | dark | 50% 60% | Declan Sun (Unsplash) |
| 6 | `texture-02` | Insulated pipework, flow arrows, flanges, dim plant room (near mono) | landscape 2400×1498 | dark | 30% 50% | iSawRed (Unsplash) |
| 7 | `oils-01` | Golden oil running from a stainless spout | landscape 2400×1900 | mid | 45% 35% | Xavier von Erlach (Unsplash) |
| 8 | `oils-02` | A drop of clear golden oil spreading on a pale surface | portrait 1597×2400 | light | 50% 40% | Colin Lloyd (Unsplash) |
| 9 | `oilseeds-01` | Heap of striped sunflower seeds, macro | landscape 2400×1800 | mid | 50% 50% | Engin Akyurt (Pexels) |
| 10 | `lab-01` | Analyst (hairnet, mask) checking glass sample tubes; South Asian woman | landscape 2400×1600 | mid | 50% 45% | Jeetendra Vyas Fashionpfotographer (Pexels) |
| 11 | `lab-02` | Technician in gown, gloves, glasses pipetting into vials; Black woman | portrait 1600×2400 | mid | 50% 40% | CDC (Unsplash) |
| 12 | `chocolate-01` | Dark chocolate bars lifted from metal moulds on a steel bench | landscape 2400×1600 | mid | 45% 60% | Daniel Fazio (Unsplash) |
| 13 | `chocolate-02` | Chocolate centres tumbling in a stainless coating pan | portrait 1600×2400 | mid | 50% 65% | Amine Kübranur Çakıroğlu (Pexels) |
| 14 | `bakery-01` | Unbaked croissants on a steel tray, laminated layers visible | portrait 1351×2400 | mid | 50% 70% | Arda Kaykısız (Pexels) |
| 15 | `bakery-02` | Bakers shaping dough along a floured production line | landscape 2400×1376 | light | 50% 50% | Anna Shvets (Pexels) |
| 16 | `factory-01` | Clean food (dairy) production hall, workers in hairnets/aprons, from behind | landscape 2400×1600 | light | 45% 50% | Anna Shvets (Pexels) |
| 17 | `audit-01` | Gloved hands completing a checklist on a clipboard | portrait 2052×2400 | dark | 50% 40% | cottonbro studio (Pexels) |
| 18 | `people-01` | Colleagues at a long wooden table taking notes (hands, no faces) | landscape 2400×1600 | mid | 35% 60% | Dylan Gillis (Unsplash) |
| 19 | `people-02` | Four colleagues in a meeting room reviewing figures on a screen | landscape 2400×1600 | light | 65% 50% | Beatriz Cattel (Unsplash) |
| 20 | `people-03` | Two people going through printed documents at a table (hands) | landscape 2400×1600 | mid | 40% 45% | Olena Kholina (Unsplash) |

## Placement plan

One rule: never show the same photo twice on one page. Article hero = that article's card image everywhere (home, hub, related).

### Home (8 sections)
| Slot | Photo | Why / note |
|---|---|---|
| 1 Hero background (navy, `lg`) | **`refinery-01`** | Dark blue dusk sits under the navy scrim; plant reads in the right 55% where the gradient is lightest. LCP: `priority`. Alt calmer option: `texture-01`. |
| 4 Featured insights: feature card | **`refinery-02`** → 3-MCPD playbook | Same as the article hero. |
| 4 Featured insights: card 2 | **`bakery-02`** → Trans-fat elimination | Same as the article hero. |
| 4 Featured insights: card 3 | **`cold-01`** → Refining at −25 °C (or **`chocolate-01`** → CBEs if a coming-soon piece should not be featured) | Same as the article hero. |
| 5 Results (navy) | none in cards; optional band background `texture-01` at low opacity | Numbers carry this band. If ResultCards take thumbnails: India `plant-01`, Indonesia `texture-02`, Ukraine `cold-01` (swap card 3 above to `chocolate-01`), WHO `bakery-01`. |
| 6 Industries | none (text tiles in a hairline 3×3 grid per plan) | Photos live on /industries. |
| 7 Founder | founder portrait (not stock) | |
| 8 CTA / newsletter | none, or `texture-01` behind a navy band | |
| OG / social default | `refinery-01` | |

### Expertise detail heroes (navy `split`, image right; stacked 4:3 on mobile)
| Pillar | Photo | Alt option |
|---|---|---|
| Product and category innovation (`product-innovation`) | **`oils-01`** | `chocolate-02` |
| Process design (`process-design`) | **`plant-01`** | `texture-02` |
| Food safety and quality (`food-safety-quality`) | **`lab-01`** | `audit-01` |
| Strategy and feasibility (`strategy-feasibility`) | **`oilseeds-01`** | `refinery-02` |
| Due diligence (`due-diligence`) | **`people-03`** | `people-02` |
| Capability and transformation (`capability`) | **`factory-01`** | `people-01` |
Expertise hub `/expertise` (grey hero, no photo per plan); if cards take images, reuse the six above.

### Insight heroes (21:9 desktop, 4:3 mobile) and their cards
| Article | Photo | Note |
|---|---|---|
| `3-mcpd-glycidyl-esters-playbook` (quality, POV) | **`refinery-02`** | "made in the refinery, step by step". Also the /insights featured article. |
| `trans-fat-elimination-inside-a-plant` (innovation, POV) | **`bakery-02`** | "inside a plant": a production line, not a pastry still life. |
| `cocoa-butter-equivalents-india` (innovation, POV, coming soon) | **`chocolate-01`** | |
| `bleaching-earth` (process, explainer, coming soon) | **`oils-02`** | clarity and colour of the finished oil, which is what bleaching earth controls. |
| `passing-pre-approval-audit` (quality, field notes, coming soon) | **`audit-01`** | |
| `refining-palm-oil-minus-25` (process, field notes, coming soon) | **`cold-01`** | |
Insights hub hero: white, no photo (plan). Newsletter band: none.

### Industries `/industries` (nine `card` tiles, 3:2)
| Industry | Photo |
|---|---|
| Confectionery | **`chocolate-02`** |
| Bakery | **`bakery-01`** |
| Dairy and specialised nutrition | **`factory-01`** (the hall is a dairy plant) |
| Plant-based | **`oilseeds-01`** |
| Snacks and food service | **`oils-01`** (frying oils) |
| Edible oils and specialty fats | **`refinery-02`** |
| Personal care and oleochemicals | **`oils-02`** |
| Pet food and animal nutrition | **gap**: no clean licensed shot found in this pass; use a text-only card, or source one (kibble on a line / extruder) before launch |
| Industrial minerals and process inputs | **`texture-02`** (plant-room pipework; there is no honest bleaching-earth photo yet) |
If one card lacks a photo, render all nine text-only (plan's tile variant) rather than one odd card.

### Impact `/impact`
| Slot | Photo |
|---|---|
| Hero (navy) | **`texture-02`** (or `refinery-02`) |
| Case: India, first integrated specialty fats facility (Wilmar) | **`chocolate-02`** (was `plant-01`, the Process design hero: no photo repeats across Expertise and Impact) |
| Case: Indonesia, 21% growth (Wilmar) | **`people-02`** (was `factory-01`, the Capability hero) |
| Case: Ukraine, first cold-climate CPO refinery, −25 °C (Wilmar) | **`cold-01`** |
| Case: trans-fat elimination, WHO recognition (Cargill) | **`bakery-01`** |
| KoKreaters engagements (anonymised) | none (text only) |

### Other pages
| Page / slot | Photo |
|---|---|
| Approach hero (navy) | **`people-01`** (working session; scrim on the left 45% covers the busiest area) |
| About | founder portrait (not stock); no stock needed. Optional band behind the timeline: `texture-01` |
| Contact | compact white/grey hero, no photo by plan; the "Book a 30-minute call" card or OG image: **`people-02`** |
| 404 | `texture-01` (navy) |

### Usage coverage
Used at least once: all 20. Most reused: `refinery-02` (home feature, 3-MCPD, edible oils), `cold-01` (−25 article, Ukraine case), `bakery-01`/`bakery-02`, `factory-01`. Never on the same page twice in this plan.

## Phone checks
- Background heroes crop to tall on phones: `refinery-01` keeps the plant at `50% 70%`; `people-01` keeps hands and notebooks at `35% 60%`.
- Portrait sources (`cold-01`, `bakery-01`, `lab-02`, `oils-02`, `chocolate-02`, `audit-01`) are best for 4:5 / 4:3 slots; at 21:9 use the listed positions (verified crops).
- Use `<Picture formats={['avif','webp']} widths={[480, 768, 1024, 1600, 2400]}>` with real `sizes`; the 2400px masters keep retina quality without shipping it to phones.

## Open items for the client
1. Approve or swap any of the 20 (slugs are stable; replace the file in `stock-src/`, rerun the script, update credit).
2. Pet food: approve a text-only card or a 21st photo.
3. Optional: real photos of the founder at work (plant, lab, workshop) would outrank any stock for About, Approach and Capability.
