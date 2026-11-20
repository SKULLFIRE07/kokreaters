# PEOPLE-CONTENT → other units (pack 3)

## CHROME-HOME
1. **Chat widget consent** (`src/components/chrome/ChatWidget.astro`): the contact page no longer has a consent tick box
   (required fields are only Name, Email, Company, Message). The `consent` entry stays in `src/data/contact.ts` `fields`
   (now `required: false`) so `fields.find((f) => f.type === 'checkbox')!` still works, and `/api/contact` no longer
   requires it. The widget still hard-codes `required` on its own box; drop it (and the consent check in
   `src/scripts/chat.ts`) if the chat form should match. Chat is off by default, so nothing is broken today.
   The widget now shows Country and Area of interest as optional (it reads `fields`).
2. **Hero title wipe on phones** (`src/styles/motion.css` `kk-line-block`): the clip-path wipe is what made the About
   headline look "cut off mid-animation" on a phone. About now overrides it below 900px (fade + 12px rise, no clip;
   global style in `src/pages/about.astro`). Every other multi-line PageHero H1 on phones has the same wipe; consider
   the same no-clip rise globally.
3. **career.ts credentials**: Education reads "Food Technology / CSIR-CFTRI Mysore"; the brief and about.ts say
   "Postgraduate degree in Food Technology". Consider `main: 'Postgraduate, Food Technology'`.
4. **Stale profile PDF**: `public/downloads/ganeaysh-kulkarni-profile.pdf` (v3 bio, old service names) is no longer
   linked. About now links `/downloads/ganeaysh-kulkarni-short-bio.pdf` and `/downloads/ganeaysh-kulkarni-portrait.jpg`
   (both from `node scripts/make-short-bio.mjs`). The old PDF, `scripts/make-profile-pdf.mjs` and `founder.ts`
   `aboutPage.profilePdf*` can be deleted.
5. **Company line**: Privacy now renders `site.legal.registration` when it is set (same value as the footer line).
