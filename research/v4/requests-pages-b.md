# Requests from unit PAGES-B (insights, articles, about, contact, 404, legal)

## 1. RESOLVED by HOME (base.css `font-variation-settings: "opsz" 11`): Bodoni Moda dropped hyphens at display sizes
With `font-optical-sizing: auto` the variable Bodoni Moda picks its display cut (opsz = font size). From about opsz 28
up, that cut draws the hyphen, en dash and other hairlines so thin they **vanish**: "3-MCPD" reads "3 MCPD",
"Trans-fat" reads "Trans fat", "pre-approval" reads "pre approval", "−25 °C" loses its minus, and the left stem of M
and the bar of T fade. Checked at DPR 1 and 2 in Chrome (test strip: opsz 6 and 11 show the hyphen; 28 and 96 do not).
The client's design PNG shows the hyphens (e.g. "Trans-fat elimination") and a heavier, lower-contrast cut.
Suggested fix in `base.css`: `body { font-optical-sizing: none; }` (Bodoni then uses its default text cut, opsz 11),
or `font-variation-settings: "opsz" 11` on the Bodoni rules. Every Bodoni use on the site inherits from body, including
the PAGES-B scoped styles (they only set `font-family`, never an opsz). PAGES-B has not overridden it locally so the pages stay consistent with Home.

## 2. ArticleLayout (layouts/ArticleLayout.astro, owner HOME)
- Photo credit line: with the v4 photos `credit.name` is "Unsplash", so the caption reads "Photo: Unsplash, Unsplash".
  Suggest: print `Photo: Unsplash` when `credit.name` equals the source.
- `HERO_POSITION` still lists `bakery-02` / `refinery-02`; the articles now use `scale-tanks` and `bakery-dough`
  (frontmatter changed by PAGES-B). `bakery-dough` is portrait: `'bakery-dough': '50% 40%'` keeps the dough ball and
  both hands in the 2:1 frame; `scale-tanks` is fine at its default.
- Motion: please add `data-gsap="parallax"` (or `kenburns`) to `.a-media__frame` (it already has overflow hidden).
- Related insights now render as v4 photo cards through `InsightList` (same props; nothing to change). With one
  related insight the grid uses 2 columns so the card is not lost in a third of the width.

## 3. PhotoInterlude / BLEED_SAFE (data/photos.ts)
About now uses `nl-polder` through `PhotoInterlude src=…` (the `slug` prop only accepts BLEED_SAFE slugs, and the v4
photos are not on that list yet). The 404 hero uses `spare-wheat` (PageHero warns in dev only). If the owner of
photos.ts adds `nl-polder`, `spare-wheat`, `hero-rapeseed`, `agri-fields` (after the rename), `scale-tanks` and
`spare-hall` to BLEED_SAFE, the dev warnings go away.
