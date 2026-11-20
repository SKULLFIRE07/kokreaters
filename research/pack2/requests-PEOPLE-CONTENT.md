# Requests from PEOPLE-CONTENT

Shared components are ready to place (both import their own script, `src/scripts/forms.ts`; nothing to wire in site.ts):

- `<NewsletterForm id="nl-footer" variant="compact" tone="dark" />` — `src/components/ui/NewsletterForm.astro`.
  Copy is the brief's item 33, from `src/data/forms.ts` (`newsletter`). The legacy `heading` / `compact` props still
  compile (a `heading` of "Newsletter" is ignored, so the footer shows "The KoKreaters Note"). The consent tick box is
  required and always rendered (one small line under the field in compact).
- `<PlaybookCard variant="tile" />` (home Insights row, third tile; it fills its grid cell, Ice panel like the
  "In preparation" card) and `<PlaybookCard variant="band" />` (navy panel, Food safety service page). Optional props:
  `id` (default `playbook`; give each instance on one page its own id), `headingLevel` ('h2' | 'h3'). The modal
  `<dialog>` is rendered by the card itself.

## To CHROME-HOME

1. **site.ts newsletter handler is now dead code.** The new form is `form[data-nl]` (not `[data-newsletter]`), and its
   submit logic lives in `src/scripts/forms.ts`. Please delete `initNewsletter()` and its call from
   `src/scripts/site.ts` (and the "newsletter forms" line in its header comment). Nothing breaks if it stays; it just
   never matches.
2. **Footer** (item 38): `<NewsletterForm id="nl-footer" variant="compact" tone="dark" />` (drop the `heading` prop or
   leave it, both work).
3. **CtaBand**: still compiles unchanged (`<NewsletterForm id="nl-cta" tone=… heading=…>` → full panel). /insights no
   longer asks for `cta={{ newsletter: true }}` (the full block now sits at the top of the page), so no page uses it.
4. **ArticleLayout.astro** (items 32, 35) — the photo credit is already gone (thanks). One edit left, please:
   - replace `<AuthorBox />` (inside `.a-body__col`) **and** the whole `{related.length > 0 && (<Section … class="a-related">…)}`
     block with one line inside `.a-body__col`, after `<ShareRow … />`:
     ```astro
     <ArticleEnd entry={entry} related={related} />
     ```
     with `import ArticleEnd from '@/components/article/ArticleEnd.astro';` (and drop the AuthorBox, SectionHeader,
     InsightList imports if unused). `ArticleEnd` renders, in order: the author box (photo, "Ganeaysh Kulkarni ·
     Founder and Principal, KoKreaters · Former Global Product & Process Design Director, Cargill"), the full
     newsletter block, then "Related" with exactly two items (other articles first, then an impact story chosen in
     `src/data/insights.ts`). Until this lands the old AuthorBox still renders (with the new lines) and
     `[slug].astro` passes at most two related articles.
5. **founder.ts** (item 19, item 21):
   - `founderRole = 'Founder and Principal'` (no company: components render `${founderRole}, KoKreaters`; they also
     cope if you include ", KoKreaters").
   - add `export const founderFormer = 'Former Global Product & Process Design Director, Cargill';` and
     `export const founderFlourish = 'Chief Catalyst';` (AuthorBox reads `founderFormer` if it exists, with the same
     string as fallback).
   - `portraitAlt.founder`: 'Ganeaysh Kulkarni, Founder and Principal of KoKreaters'.
   - The About page copy now lives in **`src/data/about.ts`** (PEOPLE-CONTENT: headline, intro, short and long bio,
     timeline, places line, strip, sectors, credentials, testimonials). `founder.ts` still exports the old `about`,
     `longBio` (with "founded KoKreaters in 2026"), `shortBio` (names Wilmar and Cargill), `timeline` (last stop
     "2026") and `timelineRoles` ("Chief Catalyst and Founder"), which `schema.ts`, `scripts/og.mjs`,
     `scripts/build-knowledge.mjs` (chat knowledge) and `scripts/make-profile-pdf.mjs` still read. Please either
     re-export from `@/data/about` (e.g. `export { shortBio, longBioText as longBio, timeline } from './about';` —
     `about.ts` has no Astro-only imports, so Node's loader in the scripts can read it) or update those strings to the
     item 21/22 copy. The JSON-LD Person `description` should become `about.shortBio`.
6. **Profile PDF** (`public/downloads/ganeaysh-kulkarni-profile.pdf`): it still says "KoKreaters 2026", the old
   service names and the old bio. The About page now hides the button outside staging (`aboutPage.profilePdfCurrent`
   in `src/data/about.ts` is `false`). Once founder/about data is final, re-run `node scripts/make-profile-pdf.mjs`
   and flip that flag to `true` (or tell me and I will).
7. **site.ts config** (`src/config/site.ts`, no owner): a single source for the LinkedIn company page would help
   (item 37/38/40, Part K 14). I keep `linkedinCompany: null` in `src/data/contact.ts` for the contact page; if you add
   `site.linkedinCompany`, tell me and I will read it from there.

## To the lead

- `npx astro build` does not run `prebuild`; run `npm run build` (or `node scripts/build-knowledge.mjs`) so
  `api/_lib/knowledge.js` picks up STORY's renamed service list: `/api/contact` validates the "Area of interest"
  option against it. `api/_lib/knowledge.js` has since been regenerated, so I updated the two old service names in
  `tests/api.test.mjs` ("Process Design and Plant Performance" → "Process development and plant performance");
  `node --test tests/api.test.mjs` passes again (20/20).
- New env vars (Vercel, all optional): `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`,
  `BREVO_REDIRECT_URL` (default https://kokreaters.com/insights), `PLAYBOOK_URL` (https only), `FORMS_DRY_RUN=1` for
  tests. Tests: `node --test tests/api-forms.test.mjs` (21 checks, fetch mocked, no email sent).
- `api/chat.js` system prompt mentions Wilmar and Cargill (as an instruction not to present those results as client
  work). It is not page copy, so I left it.
