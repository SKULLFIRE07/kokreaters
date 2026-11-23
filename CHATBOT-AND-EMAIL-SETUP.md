# Ask KoKreaters chatbot + contact email: setup

Two Vercel Functions sit next to the static Astro build (root `web/api/`, picked up by Vercel's zero-config
builder alongside the "Astro" framework preset; checked with `vercel build`: the output contains
`functions/api/chat.func` and `functions/api/contact.func`, Node 24, every page still static, CSP unchanged):

| Function | What it does |
|---|---|
| `POST /api/contact` | The "Start a conversation" form (contact page + the chat's inline form). Validates, honeypot `company_website`, time trap `started_at`, per-IP rate limit, then sends with **Resend**. If Resend fails (for example the domain is not verified yet) or no Resend key is set, it forwards the same enquiry to **FormSubmit** so mail always reaches office@. |
| `POST /api/chat` | The chatbot. **OpenRouter** first (`OPENROUTER_API_KEY`), **Claude** (Anthropic SDK) only as a fallback when there is no OpenRouter key. Streams the answer to the widget. The system prompt is strict rules + a knowledge base generated at build time from the site's own content (`scripts/build-knowledge.mjs` → `web/api/_lib/knowledge.js`). |

The site form posts to `/api/contact` by default (same origin, so the CSP stays `connect-src 'self'`). Without
JavaScript it still opens a pre-filled email to office@ (mailto fallback).

## 1. Environment variables on Vercel (project `kokreaters-vercel`)

All server-side; none are `PUBLIC_`, none reach the browser. Set them for **production** (the review link is the
production deployment of this project):

```bash
cd ~/kokreaters-vercel
vercel env add OPENROUTER_API_KEY production      # chatbot (already set)
vercel env add CHAT_MODEL production              # e.g. google/gemini-2.5-flash-lite (already set; that is also the default)
vercel env add RESEND_API_KEY production          # contact email (already set)
# optional
vercel env add RESEND_FROM production             # default: KoKreaters website <website@kokreaters.com>
vercel env add CONTACT_TO production              # default: office@kokreaters.com (comma-separated list allowed)
vercel env add ANTHROPIC_API_KEY production       # only used if OPENROUTER_API_KEY is removed
vercel env add ANTHROPIC_MODEL production         # Claude fallback model, default claude-sonnet-5-5
vercel env add ANTHROPIC_WORKSPACE_ID production  # sent as header anthropic-workspace-id (user-scoped keys need it)
vercel env add CHAT_DAILY_CAP production          # max chat requests per warm instance per day, default 1000
```

**`PUBLIC_FORM_ENDPOINT` must be removed** (it currently holds the FormSubmit URL, so the browser would bypass
`/api/contact` and the CSP would need formsubmit.co):

```bash
vercel env rm PUBLIC_FORM_ENDPOINT production --yes     # empty = /api/contact (recommended)
# or, equivalently: printf '/api/contact' | vercel env add PUBLIC_FORM_ENDPOINT production
```

Every env change needs a redeploy. `PUBLIC_*` values are baked in at build time; the server-side ones are read at
request time.

| Variable | Default | Effect |
|---|---|---|
| `OPENROUTER_API_KEY` | none | Chatbot via `https://openrouter.ai/api/v1/chat/completions` (headers `HTTP-Referer: https://kokreaters.com`, `X-Title: KoKreaters website`; `temperature 0.3`, `max_tokens 400`, streamed). |
| `CHAT_MODEL` | `google/gemini-2.5-flash-lite` | OpenRouter model id. |
| `ANTHROPIC_API_KEY` | none | Fallback provider, used only when `OPENROUTER_API_KEY` is not set. |
| `ANTHROPIC_MODEL` | `claude-sonnet-5-5` | Claude model for the fallback (a `claude-*` value of `CHAT_MODEL` also works). Effort `low`, thinking `between_tools` (no extended thinking), prompt caching on the ≈ 8k-token system prompt, server-side refusal fallback `fallbacks: "default"` (beta `server-side-fallback-2026-07-01`; `CHAT_FALLBACKS=0` turns it off). |
| `ANTHROPIC_WORKSPACE_ID` | none | Adds `anthropic-workspace-id: <value>` to every Claude request. |
| none of the chat keys | | `/api/chat` answers 503; the widget shows "The assistant is not available just now…" and the form. |
| `RESEND_API_KEY` | none | Contact email via Resend: the enquiry to `CONTACT_TO` (reply-to = the visitor, subject `New enquiry: <name>, <company>`, HTML + text table), then a short confirmation to the visitor ("Thank you for getting in touch with KoKreaters. We have received your message and will reply by email."; no visitor text is echoed in it; `CONTACT_CONFIRMATION=0` turns it off). |
| `RESEND_FROM` | `KoKreaters website <website@kokreaters.com>` | Sender; its domain must be verified in Resend. |
| `CONTACT_TO` | `office@kokreaters.com` | Recipient(s). |
| `CONTACT_FORMSUBMIT_FALLBACK` | on | `0` = do not fall back to FormSubmit when Resend fails (return an error instead). |
| `PUBLIC_FORM_ENDPOINT` | `/api/contact` | `none` = mailto only; an absolute URL = post there directly. |

Local test switches (never set on Vercel): `CHAT_MOCK=1` (canned streamed answer, no API call),
`CONTACT_DRY_RUN=1` (validate and log, send nothing).

## 2. Deploy

```bash
cd /home/aryan-budukh/Desktop/ganeshkaka-folder/web
npm run build:preview                 # also regenerates api/_lib/knowledge.js (preview mode)
node scripts/csp-hash.mjs             # vercel.json + public/_headers (connect-src 'self' only, no formsubmit.co)
npm run verify:check && npm run test:api
rsync -a --delete --exclude .vercel --exclude node_modules --exclude dist --exclude .astro --exclude test-results \
  --exclude .lighthouseci --exclude public/fonts --exclude .env ./ /home/aryan-budukh/kokreaters-vercel/
cd /home/aryan-budukh/kokreaters-vercel
vercel env rm PUBLIC_FORM_ENDPOINT production --yes
vercel --prod --yes
```

The rsync copies `api/` (functions + `api/_lib/`), `package.json` / `package-lock.json` (new dependency
`@anthropic-ai/sdk`, dev dependency `yaml`) and `scripts/build-knowledge.mjs`. Vercel's `npm run build` runs
`prebuild`, which regenerates the knowledge base in the mode set by `PUBLIC_SITE_MODE` on Vercel.

Smoke test after the deploy (no email is sent by these):

```bash
curl -s -X POST https://kokreaters-vercel.vercel.app/api/chat -H 'content-type: application/json' \
  -H 'origin: https://kokreaters-vercel.vercel.app' -d '{"messages":[{"role":"user","content":"What does KoKreaters do?"}]}'
# → {"t":"d","v":"…"} lines, then {"t":"end"}
curl -s -X POST https://kokreaters-vercel.vercel.app/api/contact -H 'content-type: application/json' -d '{"company_website":"x"}'
# → {"ok":true} (honeypot: nothing sent)
```

Function logs (`vercel logs` or the dashboard) show one line per chat answer (`chat: openrouter <model> finish=stop`,
or for Claude the cache read / write token counts) and any `contact: … failed` reason.

## 3. Resend: verify kokreaters.com (DNS at GoDaddy)

Until this is done, Resend rejects `website@kokreaters.com` and the function falls back to FormSubmit automatically.

1. resend.com → **Domains → Add domain** → `kokreaters.com` (region: EU, Ireland, is closest to the Netherlands).
2. Resend shows the records to add. In GoDaddy: **My Products → kokreaters.com → DNS → Manage DNS → Add new record**,
   one per row Resend lists, copying name and value exactly (GoDaddy appends `.kokreaters.com` to the name itself, so
   enter only the part before it):
   - **MX** `send` → `feedback-smtp.eu-west-1.amazonses.com`, priority 10 (bounce handling; it does not touch the
     MX records that receive office@ mail).
   - **TXT** `send` → `v=spf1 include:amazonses.com ~all` (SPF for the `send` subdomain only).
   - **TXT** `resend._domainkey` → the long `p=…` DKIM key.
   - Recommended: **TXT** `_dmarc` → `v=DMARC1; p=none;` if no DMARC record exists yet (do not add a second one).
3. Back in Resend press **Verify DNS records**; GoDaddy usually propagates within minutes (allow up to an hour).
4. Create an API key with **Sending access** for that domain only and set it as `RESEND_API_KEY` (already set).
5. Send one real test from the live form; check office@ receives it with reply-to = the address typed, and that the
   confirmation arrives. Check the Resend dashboard **Emails** log for both.

FormSubmit fallback: the first submission through FormSubmit sends an activation email to office@kokreaters.com;
click it once, otherwise FormSubmit holds the messages (the visitor sees an error with the email address).

## 4. Cost and abuse guards

Chat (`/api/chat`):
- 1,000 characters per question; at most 8 questions per conversation (the widget then closes the composer and
  offers the form; the server rejects a 9th with 429); only the last 12 messages go to the model; body ≤ 32 KB.
- `max_tokens` 400 per answer; answers instructed to ≤ 120 words.
- Per IP: 20 requests per 10 minutes and 60 per day; per warm instance: `CHAT_DAILY_CAP` (default 1,000) per day.
  These counters live in memory (best effort: each warm instance has its own).
- Same-origin only (requests with a foreign `Origin` get 403). No third-party script in the browser.
- After the 5th answer the widget hands over to the form ("For more detail, the best next step is a direct
  conversation. Please share your details and Ganeaysh will reply by email.").
- Rough cost: the system prompt is ≈ 8k tokens; with `google/gemini-2.5-flash-lite` on OpenRouter a full
  conversation of 8 questions is a fraction of a cent. **Set a credit limit on the OpenRouter key** (OpenRouter →
  Keys → edit → Credit limit, e.g. USD 10/month) as the hard ceiling. For the Claude fallback, set a monthly spend
  limit in the Anthropic Console; the system prompt is cached, so repeat questions read it at a tenth of the input price.

Contact (`/api/contact`):
- Required fields, email format, length caps (from `src/data/contact.ts` `maxLength`), select options, consent.
- Honeypot and 3-second time trap answer `{ ok: true }` and send nothing; 5 submissions per IP per 10 minutes.
- The confirmation email has fixed text only (no visitor-supplied content), so the form cannot be used to send
  arbitrary text to third parties.

## 5. Where things live

| Path | |
|---|---|
| `web/api/chat.js`, `web/api/contact.js` | the functions (Web-standard `export async function POST(request)`) |
| `web/api/_lib/http.js` | JSON, IP, origin guard, rate limiter, body parsing |
| `web/api/_lib/knowledge.js` | GENERATED knowledge base + contact field list (do not edit; committed so the function always has one) |
| `web/scripts/build-knowledge.mjs` | generator (runs in `prebuild`, `build:preview`, `build:prod`; `npm run knowledge`) |
| `web/src/components/chrome/ChatWidget.astro` | launcher + panel markup and styles (mounted in BaseLayout; not on /contact) |
| `web/src/scripts/chat.ts` | widget behaviour, a separate chunk loaded on first hover / focus / click of the launcher |
| `web/src/data/chat.ts` | widget copy |
| `web/tests/api.test.mjs` | `npm run test:api`: functions with mocked fetch (no network, no email) |
| `web/tests/chat.spec.ts` | Playwright: widget open / close / keyboard / stream / form with mocked routes |
