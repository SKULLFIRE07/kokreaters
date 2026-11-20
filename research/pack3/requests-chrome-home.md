# CHROME-HOME → other units (pack 3)

Shared contracts are in place:
- `src/data/career.ts`: `careerFigures` (six drafts), `careerFacts`, `homeTrackRecord`, `impactFigures` (figures 1, 2, 4),
  `aboutFigures` (25 years, 8 sites, 5 languages + six), `visible(items)` / `isVisible(f)` (drafts in staging + preview,
  only confirmed in production), `careerFootnote` (exact text), `founderTitles` {name, main, former, flourish},
  `founderLine`, `languages`, `credentials` (groups with `status`; draft groups have no items → staging-only `<Confirm id="P-11">`).
- `src/lib/booking.ts`: `bookingHref()` (bookingUrl ?? '/contact#start'), `hasBooking`, `bookingIsExternal()`,
  `bookingLabel` "Book a 30-minute call", `bookingLabelShort` "Book a call".
- `src/lib/analytics.ts`: add `data-event="book-call" | "form-send" | "playbook-download"` on an element, or call
  `track(name)` from a script (window.plausible guarded; no-op when PUBLIC_PLAUSIBLE_DOMAIN is unset).

## PEOPLE-CONTENT
- `site.bookingUrl` is now `string | null` (default null). `src/components/contact/ContactDetails.astro` line 22
  (`site.bookingUrl.startsWith`) no longer type-checks: switch to `hasBooking` / `bookingHref()` from `@/lib/booking`.
- Every "Book a call" fallback now points at `/contact#start`: please put `id="start"` on the first block of the Contact
  page (booking block when it exists, otherwise the form wrapper).
- Form sends / playbook downloads: add `track('form-send')` / `track('playbook-download')` on success (import from
  `@/lib/analytics`).

## Logo A (all units)
- The K-mark files are deleted: `src/assets/brand/svg/kokreaters-logo-{navy,navy-no-tagline,white}.svg`,
  `kokreaters-mark.svg`, `public/brand/kokreaters-mark-512.png`, and every per-page card in `public/og/`.
  New files: `src/assets/brand/svg/kokreaters-logo-A-{navy,navy-no-tagline,white,white-no-tagline}.svg`,
  `kokreaters-mark-A.svg`; `public/brand/kokreaters-logo-A-navy-{600,1200}.png`, `kokreaters-mark-A-512.png`,
  `kokreaters-avatar-A-400.png`; `public/og/kokreaters-social-share-1200x630.png` (og:image on every page).
- Use `<Logo variant="navy-tagline" | "navy" | "white" | "white-no-tagline" | "mark" />`. Old aliases still compile
  (`full-white` → white with tagline). The alt is "KoKreaters: Connect, Collaborate, Create" by default. For About
  beside "Ko + Kreaters" on a light ground use `variant="navy-tagline"`; on navy use `variant="white"`.
- `scripts/make-profile-pdf.mjs` (owner: PEOPLE-CONTENT, short bio PDF) line 63 reads the deleted
  `kokreaters-logo-white.svg`: point it at `kokreaters-logo-A-white.svg` (the A files share gradient ids, so inline one
  logo per document only).
