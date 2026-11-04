# W3-tests findings (4 Nov 2026), for W3-polish and the orchestrator

These results come from private builds: staging at `web/node_modules/.cache/kk-dist-w3` and production at `…/kk-dist-w3-prod`. Both builds include W3-globe's scene. Every suite ran against both builds, except Lighthouse, which ran against staging only.

## Results
| Suite | Staging | Production |
|---|---|---|
| smoke (19 routes plus the 404 page, robots, llms and the sitemap) | 21/21 | 21/21 |
| seo | 19/20 (contact) | 19/20 (contact) |
| a11y (axe, WCAG 2.2 A and AA, 1440 and 390) | 39/40 (one article at 390) | not run |
| reduced motion and no-JS | 38/38 | 38/38 |
| responsive (360, 768, 1024, 1280, 1440) | 95/95 | not run |
| keyboard (1440 CTA, 390 Menu then Contact) | 38/38 | not run |
| budget.spec (home transfer, no three.js outside /about) | 5/5: home 286KB at 1440, 275KB at 390 | not run |
| check-budget.mjs | pass. Home JS 62.5KB, others ≤ 60.6KB, CSS ≤ 14.3KB, fonts 174.7/180KB, three.js 133.4KB on about.html only | pass |
| Lighthouse (mobile, 3 runs) | `/` 100/100/100/100, LCP 1.06s. `/about` 99/100/100/100, LCP 2.25s. Article 100×4, LCP 0.90s. CLS is 0 on all three | not run |
| csp-hash `--check` | in sync (1 inline hash) | in sync |

## Findings to fix
1. **/contact has no JSON-LD** (seo, serious for the 3.7 contract). Section 3.7 gives every inner page a BreadcrumbList, but `pages/contact.astro` passes no `breadcrumbs`. The fix is in W2-contact's page, which is outside W3-polish's files, so the orchestrator decides. One option is to pass `breadcrumbs={[{label:'Contact',href:'/contact'}]}` with `showCrumbs={false}`.
2. **axe `scrollable-region-focusable` (serious)** on `/insights/trans-fat-elimination-inside-a-plant` at 390. `.exhibit__body` (the GFM table wrapper) scrolls sideways but keyboard users cannot reach it. Fix in `components/article/Exhibit.astro` (W3-polish): add `tabindex="0" role="region" aria-label="{exhibit title}"`, and give it a visible focus ring.
3. **The LCP element is not the H1** (launch gate 10 says the H1 is the LCP). It passes the 2.5s budget but breaks the rule. On mobile home the LCP is the hero lead paragraph. On /about it is the portrait, at 2.25s, close to the limit. On /about, check that the portrait is eager with `fetchpriority="high"` and has the smallest AVIF width for 390.
4. **Insight-row standfirsts are cut to one line with an ellipsis** (`InsightRow.astro`: `white-space:nowrap; text-overflow:ellipsis`) at every width, on /insights, on home and in related insights. Brief copy is truncated. This is a design call for W3-polish: allow 2 lines with `line-clamp`, or show the full text.

## Notes (no fix needed now)
- **Lighthouse runs on staging with `skipAudits: ["is-crawlable"]`.** Staging is `noindex` on purpose. In production the only article URL (a draft) is not built, so `lighthouserc.json` needs a different article URL once one is approved.
- **Fonts sit at 174.7KB of the 180KB budget.** Any new face or weight will fail the gate.
- `/fonts/*` is cached `immutable` for a year (spec 3.9), but the font file names carry no hash. Rename the files if a font ever changes.
- **Vercel** reads security headers only from `web/vercel.json`, which is static and committed. `scripts/csp-hash.mjs` rewrites `public/_headers` and `vercel.json` from the built HTML. Rerun it (`npm run verify`) and commit whenever an inline script changes or endpoint env vars are set. `node scripts/csp-hash.mjs --check` fails if either file is out of date. Setting a Turnstile key adds `https://challenges.cloudflare.com` to script-src, frame-src and connect-src.
- The open W2-expertise request (Lenis anchor offset stacks with scroll-margin, landing at 168px) is still open and belongs to W1-motion's files.

## How to rerun
```
cd web && npm run build && npm run verify && npm test && npm run lhci
# against another build: KK_DIST=<dir> npx playwright test ; node scripts/check-budget.mjs --dist <dir>
```
Playwright serves with `astro preview` on 127.0.0.1:4413. Reduced-motion screenshots go to `research/shots/build/tests-rm-{route}-1440.png`.
