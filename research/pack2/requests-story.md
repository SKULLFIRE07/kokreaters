# Requests from STORY (pack 2)

## Done by STORY outside its list (please keep)
- `src/data/seo.ts` (CHROME-HOME): the `capability` row had to become `'technology-leadership'` because `SeoKey`
  includes `PillarSlug`; without it the build and `astro check` fail. One line changed only: key, `og`
  (`/og/technology-leadership.png`), `path`, title "Technology and R&D leadership, on demand | KoKreaters" (53 chars),
  description "A seasoned CTO or Head of R&D in your leadership team, for the days and months you need, plus training,
  technology transfer and coaching." (137 chars). CHROME-HOME: adjust the wording if you like, keep the key.
- `public/og/capability.png` renamed to `public/og/technology-leadership.png`. CHROME-HOME regenerates it with
  `npm run og` (the card title comes from `pillars.ts`).

## Service 06 (item 6): ready
- `pillars.ts` key stays `capability`; slug `technology-leadership`; name "Technology and R&D leadership, on demand";
  promise "A seasoned CTO or Head of R&D in your leadership team, for the days and months you need.";
  `shortLabel` "R&D leadership". 301 `/expertise/capability` → `/expertise/technology-leadership` is in `vercel.json`.
- The contact-form option follows automatically (`contact.ts` maps `pillars` names).
- Grep of `web/src` for "capability" slug links / "Fractional" / "fractional" after the change: no hits left in
  `src/`. Remaining hits outside my files:
  - `api/_lib/knowledge.js` (generated): old name, `/expertise/capability`, "Fractional CTO …", "Fractional and interim
    leadership roles", "Expertise: Fractional CTO …". **Lead:** run `npm run knowledge` (or any build) to regenerate it.

## CHROME-HOME
- **Home impact, item 17** (three cards): data is in `src/data/impact.ts` → `impactStories` / `getStory(id)` /
  `storyHref(id)`. Use stories `story-indonesia`, `story-ukraine`, `story-who`: `tag` (e.g. "OPERATIONS · INDONESIA"),
  `figures[0].value` (21% / −25 °C / WHO) and `homeLine` (the item 17 line, verbatim). The WHO card links to
  `storyHref('story-who')` = `/impact#story-who`; that opens and scrolls to story 4 (tested).
  `founderResults` / `figureFallback` are kept as LEGACY exports (datelines are now neutral: "India", "Indonesia",
  "Ukraine", "Global") so `HomeResults.astro` keeps compiling; please move it to `impactStories` and drop the
  "From our founder’s career at Wilmar and Cargill." source line in `home.ts` (item 8; use the item 15 footnote).
- **Home "How we engage" strip, item 16**: `import { engage } from '@/data/approach'` → `engage.items[].title`
  (Diagnostic sprint, Defined project, Leadership on demand, Expert review) and `engage.href` (`/approach#engage`).
  `#engage` exists on /approach.
- **Chat button (item 1)**: /impact no longer uses BaseLayout's CtaBand (it needs two buttons and a staging-only
  Confirm, item 30). Its own band is `src/components/impact/ImpactCta.astro`, a `<section class="band band--delft
  cta-band impact-cta">` with `h2#cta-heading`, so a hide-while-in-view check on `.cta-band` or `#cta-heading` also
  covers /impact. At 360px the "Ask" button sits over the right edge of the first heading below a hero on pillar pages
  (e.g. /expertise/technology-leadership "The challenge we solve" row); smaller button per item 1 will fix it.
- **Optional:** if `CtaBand` ever gets a second-button prop (`booking?: Link`), /impact can go back to it.

## PEOPLE-CONTENT
- `src/components/about/Credentials.astro` reads `founderResults` `tfa.dateline` for "From our founder’s career
  (…)" — it now reads "(Global)" instead of "(Cargill)". On About, Cargill is allowed (item 8), so write that line
  literally, or move to `getStory('story-who')`.
- `PlaybookCard` band: please give the title an id (e.g. `${id}-title`) so a wrapping `<Section labelledby>` can name
  the section. On /expertise/food-safety-quality it is placed at the end of the content, before the Previous/Next
  pager, inside a white `Section pad="tight"`. At 1440 the button sits under the text (not at the right as the
  component comment says); your call.

## Lead
- `scripts/build-knowledge.mjs` (unowned): reads `approach.ts` `models` (now a LEGACY 4-row restatement of the new
  "How we engage" ways) and `impact.ts` `founderResults`. Better: list `engage.items` (title + copy) and
  `engage.confidential`, and `impactStories` (tag, title, challenge, done, result; skip `pending` figures and
  `resultMore`) instead. `impactPage.lead` still exists (now the item 27 intro minus its first sentence).
- `scripts/make-profile-pdf.mjs` and `src/pages/styleguide.astro` still read `founderResults` (kept, neutral datelines).
- `src/pages/llms.txt.ts` line 24 and `api/chat.js` line 51 name Wilmar and Cargill (internal/LLM-facing text, not page
  copy). Item 8 is about the visible site; leaving them is defensible, but `llms.txt` is public: suggest "from the
  founder’s 25-year career, before KoKreaters".
