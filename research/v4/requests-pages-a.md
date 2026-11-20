# Requests from unit PAGES-A (expertise, industries, approach, impact)

## 1. URGENT: three photo files carry the wrong content (affects HOME too)
The originals in `assets/photos/unsplash-v4/` (and the copies in `web/src/assets/photos/stock/`) are mislabelled:

| file name              | what the picture actually shows          | should be named      |
|------------------------|------------------------------------------|----------------------|
| `agri-fields.jpg`      | spice powders on black (2400 × 1600)     | `nutrition-spices.jpg` |
| `nutrition-spices.jpg` | heap of maize kernels (2400 × 3601)      | `spare-maize.jpg`    |
| `spare-maize.jpg`      | aerial patchwork of farm fields          | `agri-fields.jpg`    |

Fix: rotate the three file names (in both folders), then update `orientation` in `src/data/photos.ts`
(`nutrition-spices` → landscape, `spare-maize` → portrait) and check the Unsplash credit URLs follow the right picture.
PAGES-A code uses the semantic slugs (`agri-fields` for the agri tile, `nutrition-spices` for nutrition), so it becomes
correct the moment the files are renamed. Until then the agri tile shows spices and the nutrition tile shows maize.

## 2. Slugs: KEPT (no redirects needed)
The six expertise pages keep their v3 slugs (`/expertise/product-innovation`, `process-design`, `strategy-feasibility`,
`food-safety-quality`, `due-diligence`, `capability`). Renaming would touch seo.ts, the OG images in `public/og/`, the
insights collection and vercel.json, all outside PAGES-A, for no visitor benefit. No vercel.json change is needed.

## 3. seo.ts: titles and descriptions still carry the v3 service names (lead / owner of `src/data/seo.ts`)
Proposed (facts from pillars.ts only):
- `product-innovation`: title `Product development | KoKreaters`; description `From unmet need to a product that scales: specialty fats, reformulation, plant-based and nutrition applications, and lab-to-plant scale-up.`
- `process-design`: title `Process development and plant performance | KoKreaters` (description fine).
- `strategy-feasibility`: title `Market access and strategy | KoKreaters`; description `Clear Go/No-Go decisions and a clear route to market: market entry including India and Asia, feasibility studies, business plans and investor-grade reports.`
- `food-safety-quality`: title `Food safety, quality and regulatory | KoKreaters` (description fine).
- `due-diligence`: title `Deals, due diligence and partnerships | KoKreaters` (description fine).
- `capability`: title `Fractional CTO and Head of R&D | KoKreaters`; description `Senior technical leadership, part-time, for as long as you need it: R&D steering, board advisory, organisation design, technical training and technology transfer.`
The OG images in `public/og/<slug>.png` probably still show the old names too.

## 4. For HOME (nav / home industries)
- `src/data/industries.ts` now exports `featuredIndustries` (the guide's six, with `industryPhoto[slug]`),
  `otherIndustries` (five, for the "Also:" text line, label `industriesPage.otherLabel`) and `industries` (all eleven,
  featured first). `nav.ts industryLinks` maps all eleven; consider `featuredIndustries` for the menus.
- Industry slugs changed with the new names (anchors on /industries): `agri-oilseeds`, `edible-oils-specialty-fats` (same),
  `feed-animal-nutrition`, `bakery-food-service`, `cocoa-chocolate-confectionery`, `nutrition-specialty-ingredients`,
  `dairy-nutrition`, `plant-based`, `snacks`, `personal-care-oleochemicals`, `industrial-minerals`.
- `IndustryTile` has a new `variant="photo"` (home-design tile: 4:3 photo, navy gradient, Bodoni name) and a global
  `.photo-tiles` grid; `ExpertiseCard` now matches the design's "What we do" card ("01", Bodoni 28, line, Learn more).
- `pillars.ts`: `shortLabel` for strategy is now "Market access" and capability "Fractional CTO" (insights filters/labels).
- `home.ts proof` still says "25 years in oils, fats…" and "3 regions…"; /impact no longer reads it (it uses
  `impactRecord` in impact.ts with the design's 25 · 14 · 5 · WHO), but the home strip should match.
- `Section` has no `ice` ground; PAGES-A passes `class="band--ice"` (layout.css order makes it win). An `ice` ground
  prop would be cleaner.
