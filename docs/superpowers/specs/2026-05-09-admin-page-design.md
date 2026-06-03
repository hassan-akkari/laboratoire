# Admin page — design spec

**Date:** 2026-05-09
**Owner:** Hassan Akkari
**Status:** Draft v2 (incorporates round-2 corrections — proxy.ts rename, defense in depth, defensive Cal mapping, privacy fields, env-driven CORS, Tailwind in web-next)

## Goal

Build a real, used-daily admin surface on `apps/web-next` that lets Hassan:

1. View and manage inbound leads (contact-form submissions + Cal.com bookings).
2. Edit publicly visible site contact info (phone, email) without redeploying `apps/docs`.
3. Get notified by email when new leads come in.

It also doubles as a portfolio showcase of full-stack work (auth, DB, webhook integration, CRM-style UI).

## Constraints

- Single user (Hassan only).
- Must not break the existing booking-demo `/login` + `/checkout` flow on `apps/web-next`, which is a separate showcase artifact.
- Vercel for hosting, OVH for DNS only.
- Stays in the existing pnpm/Turbo monorepo. No new top-level apps.
- MVP: skip multi-user, password reset, audit log, lead export, 2FA, custom rate limiting.

## Topology

```
itshassan.it          → Vercel project "docs"  → apps/docs        (Vite, existing)
admin.itshassan.it    → Vercel project "admin" → apps/web-next    (Next.js 16)
                          ↓
                       Neon Postgres (EU region)
                          ↑
                       Resend API (transactional email)
```

Two separate Vercel projects in the same repo. Each project's "Root Directory" is set to its app folder; both share the workspace lockfile and `packages/ui`. OVH adds one CNAME: `admin.itshassan.it → cname.vercel-dns.com`.

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router, existing) | `apps/web-next` |
| Auth | iron-session + bcrypt (roll-your-own) | Replaces no existing code; lives alongside booking-demo auth |
| DB | Neon Postgres (free tier) | Serverless, **AWS eu-central-1 (Frankfurt)** — set at project creation, immutable afterward |
| ORM | Drizzle | New dependency in `apps/web-next` |
| Validation | zod (existing) | Reuse |
| Email | Resend | New dependency in `apps/web-next` |
| Cal.com embed | `@calcom/embed-react` | New dependency in `apps/docs` |
| UI primitives | `@laboratoire/ui` (HeroUI) | Existing |

## Two auth systems (intentional)

| System | Login route | Cookie | Middleware match | Module |
|---|---|---|---|---|
| Booking demo (existing, logic untouched) | `/login` | `web_next_session` (sentinel value, per existing `lib/session.ts`) | `/checkout/:path*` | `apps/web-next/lib/session.ts` |
| Admin (new) | `/admin/login` | `admin_session` (iron-session signed) | `/admin/:path*` + admin API mutations | `apps/web-next/lib/adminSession.ts` |

**Defense in depth.** `apps/web-next/proxy.ts` (Next.js 16's renamed `middleware.ts` — runs on Node.js runtime, [release notes](https://nextjs.org/blog/next-16#proxyts-formerly-middlewarets)) is the **bouncer at the door**: it does cheap cookie-presence checks and redirects unauthenticated requests to the right login. It is **not** the security brain.

Every admin page (server component), every Server Action, and every `/api/admin/*` route handler additionally calls `requireAdminSession()` from `lib/adminSession.ts` — which actually verifies the iron-session signature server-side and returns the user — before reading or mutating data. If proxy ever has a bug or is bypassed, the route still fails closed.

Cookie names and validation logic never overlap between the two systems. The booking demo's "fake auth" remains a working showcase; the admin gets real auth.

## Data model (Drizzle, Postgres)

```ts
// apps/web-next/lib/db/schema.ts
users        id (uuid pk), email (unique), password_hash, created_at
leads        id (uuid pk),
             source ('contact_form' | 'cal'),
             source_detail (nullable, free-form e.g. 'hero-cta', 'contact-section'),
             name,
             email,
             phone (nullable),
             message (nullable, contact form only),
             scheduled_at (nullable, Cal bookings only),
             cal_booking_id (nullable, unique when present — idempotency key),
             cal_payload (jsonb nullable, raw Cal webhook payload — debug only),
             status ('new' | 'contacted' | 'closed'),         -- CRM state, owned by Hassan
             booking_status (nullable, 'scheduled' | 'rescheduled' | 'cancelled'), -- Cal lifecycle
             notes (nullable),
             last_notified_at (nullable),
             notification_error (nullable),
             privacy_accepted_at (nullable, timestamp),       -- contact-form leads only
             privacy_version (nullable, text e.g. 'v1-2026-05'),
             created_at,
             updated_at
site_config  singleton row (id = 1):
             phone,
             contact_email,  ← public on itshassan.it (also default notification destination)
             notify_email,   ← optional override; if NULL, notifications go to contact_email
             updated_at
```

Resolved notification destination is computed in **one place only** — a `getNotificationRecipient(config)` helper in `lib/email.ts` returning `config.notify_email ?? config.contact_email`. Every call site (lead intake, Cal webhook, admin "send test email" button) goes through this helper. No hardcoded `contact_email` reads in the email path.

Indexes: `leads.created_at desc`, `leads.status`, `leads.cal_booking_id` (unique partial where not null).

Seed script (`pnpm -F web-next db:seed`):
- Reads `ADMIN_EMAIL` + `ADMIN_PASSWORD` from `.env.local`.
- bcrypts the password (cost 12), inserts the single user row.
- Inserts an initial `site_config` row with placeholder phone/email (Hassan edits via admin afterward).

Migrations live in `apps/web-next/drizzle/` and run via `drizzle-kit generate` (creates SQL files committed to git) + `drizzle-kit migrate` (applies them) against Neon. `push` is fine for local fast iteration but must not run against the production branch.

## Routes

### Public API (CORS allowlist: `https://itshassan.it`)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/leads` | Contact-form submission. Validates with zod, **checks honeypot + min-submit-delay (≥3s)**, inserts lead with `source='contact_form'`, attempts Resend email via `getNotificationRecipient(config)`. **Always returns `{ ok: true }` if the lead row was inserted, even if email failed** — the lead is the truth, email is bonus. Records `last_notified_at` on success or `notification_error` on failure. |
| `POST` | `/api/cal/webhook` | Cal.com webhook receiver. **Reads body as raw text via `await request.text()` first**, validates `request.headers.get('x-cal-signature-256')` HMAC against `CAL_WEBHOOK_SECRET` using `timingSafeEqual`, then `JSON.parse(rawBody)`. Handles `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED` — sets `booking_status` accordingly. Upserts on `cal_booking_id` (`onConflictDoUpdate`). Stores the full payload in `cal_payload` for debug. Sends Resend notification on create only. **Field extraction is defensive** — see Cal mapping below. |
| `GET` | `/api/site-config` | Returns `{ phone, contact_email }` (public fields only — `notify_email` is admin-internal). CORS-allowed for itshassan.it. Response sets `Cache-Control: public, s-maxage=60, stale-while-revalidate=600` so Vercel's CDN serves repeats. |

### Admin (auth requirements per route)

Two distinct gates:

- **Public-with-Origin-check**: `/api/admin/login` only. No session required (you don't have one yet), but Origin must match the admin allowlist. Anything else here would create a login loop or invite credential-stuffing from foreign origins.
- **Session-required + Origin-check**: every other `/api/admin/*` route and every `/admin/*` page.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/admin` | session | Stat cards (counts: New / Contacted / Closed / Cal bookings) + leads list, filterable by `status` and `source`. Sortable by `created_at`. |
| `GET` | `/admin/leads/[id]` | session | Lead detail; edit `status` and `notes`. Shows `booking_status` if Cal source. |
| `GET` | `/admin/site-config` | session | Edit `phone`, `contact_email`, and optional `notify_email`. Includes a "Send test notification" button that triggers `getNotificationRecipient(config)` so misconfigured Resend/DNS surfaces immediately. |
| `PATCH` | `/api/admin/leads/[id]` | session + Origin | Update status/notes. |
| `PUT` | `/api/admin/site-config` | session + Origin | Update site config. |
| `POST` | `/api/admin/login` | **Origin only** | bcrypt-verify credentials, set `admin_session` cookie. Carved out from session check; rate limiting deferred to v2. |
| `POST` | `/api/admin/logout` | session + Origin | Destroy session. |
| `POST` | `/api/admin/test-email` | session + Origin | Send a "this is a test" email via `getNotificationRecipient(config)`. |

**Origin check** on admin mutations: reject if `Origin` header is not in `ADMIN_ALLOWED_ORIGINS`. Lightweight CSRF defense without full token machinery.

**`runtime = "nodejs"`** is set at the top of every admin route, the Cal webhook, and the leads intake. The default route runtime is already Node in Next.js 16, but the explicit export documents intent and prevents accidental Edge migration later.

`apps/web-next/proxy.ts` keeps the existing `/checkout/:path*` matcher (untouched, sentinel cookie) and adds `/admin/:path*` and `/api/admin/:path*` (admin_session cookie, with `/api/admin/login` bypassed). The handler branches on path prefix to pick the correct cookie + redirect target. Real auth verification still happens inside each route handler via `requireAdminSession()`.

### CORS & Origin allowlists (central, env-driven)

No allowlist strings are scattered through routes. Two env vars + four helpers in `lib/origin.ts`:

```
PUBLIC_ALLOWED_ORIGINS=https://itshassan.it,http://localhost:5173
ADMIN_ALLOWED_ORIGINS=https://admin.itshassan.it,http://localhost:3001
```

```ts
// lib/origin.ts
isAllowedPublicOrigin(origin: string | null): boolean   // for /api/leads, /api/site-config
isAllowedAdminOrigin(origin: string | null): boolean    // for /api/admin/*
withCors(response: Response, origin: string | null, kind: 'public' | 'admin'): Response
requireAdminOrigin(request: Request): Response | null   // returns 403 Response if rejected, null if ok
```

Future Vercel preview origins get added via env, never via code edit.

### Cal.com payload mapping (defensive)

Cal.com payloads vary across event types and major versions. The webhook handler uses fallbacks rather than assuming one shape:

```ts
const p = payload.payload ?? payload;        // Cal sometimes wraps in { triggerEvent, payload }

const cal_booking_id = p.uid ?? p.bookingUid;
const scheduled_at   = p.startTime;
const name           = p.responses?.name?.value
                       ?? p.attendees?.[0]?.name
                       ?? null;
const email          = p.responses?.email?.value
                       ?? p.attendees?.[0]?.email
                       ?? null;
const phone          = p.responses?.attendeePhoneNumber?.value
                       ?? p.attendees?.[0]?.phoneNumber
                       ?? null;
const message        = p.responses?.notes?.value
                       ?? p.additionalNotes
                       ?? null;
```

If `cal_booking_id` or `email` ends up null after fallbacks, log a warning, store the raw payload in `cal_payload`, and respond 200 anyway (don't block Cal retries — debug after). Codified as `extractCalLead(payload)` in `lib/cal/extract.ts`, with unit tests against fixtures of each trigger event.

## Data flows

### Contact form → admin

```
itshassan.it ContactForm
  → fetch POST https://admin.itshassan.it/api/leads
       body: { name, email, message,
               company_website,    ← honeypot, must be empty
               started_at }        ← timestamp form was rendered
  → web-next /api/leads
       → zod validate
       → if company_website non-empty: return { ok: true } silently (do not insert)
       → if (now - started_at) < 3000ms: return { ok: true } silently (do not insert)
            (silent 200 in both cases — never give bots a signal to retune)
       → drizzle INSERT lead (source='contact_form', privacy_accepted_at, privacy_version)
       → try Resend send via getNotificationRecipient(config)
            on success: UPDATE leads SET last_notified_at = now()
            on failure: UPDATE leads SET notification_error = err.message (lead still saved)
       → return { ok: true }   ← lead is saved either way
  → ContactForm shows success state
```

CORS preflight: `Access-Control-Allow-Origin: https://itshassan.it`, `Access-Control-Allow-Methods: POST, OPTIONS`, `Access-Control-Allow-Headers: Content-Type`. No credentials needed (anonymous post).

### Cal.com booking → admin

```
Visitor clicks "Book a call" on itshassan.it
  → @calcom/embed-react modal opens
  → Visitor picks slot, fills name/email/phone
  → Cal.com confirms booking
  → Cal.com webhook POST https://admin.itshassan.it/api/cal/webhook
       headers: X-Cal-Signature-256: sha256=...
       body: { triggerEvent: 'BOOKING_CREATED', payload: {...} }
  → web-next /api/cal/webhook
       → const rawBody = await request.text()           ← raw, not JSON.parse'd
       → const sig = request.headers.get('x-cal-signature-256')
       → HMAC verify rawBody with timingSafeEqual; reject 401 on mismatch
       → const json = JSON.parse(rawBody)
       → const fields = extractCalLead(json)            ← defensive mapping with fallbacks
       → if !fields.cal_booking_id: log+store raw payload, respond 200 (don't block retries)
       → switch (json.triggerEvent):
            BOOKING_CREATED:
              upsert lead (source='cal', booking_status='scheduled',
                           cal_payload=rawJson, ...fields)
              try Resend send via getNotificationRecipient(config)
            BOOKING_RESCHEDULED:
              UPDATE leads SET scheduled_at, booking_status='rescheduled', cal_payload
                WHERE cal_booking_id = fields.cal_booking_id
            BOOKING_CANCELLED:
              UPDATE leads SET booking_status='cancelled', cal_payload
                WHERE cal_booking_id = fields.cal_booking_id
              (lead.status untouched — Hassan may still want to contact them)
       → return 200
```

### Site config edit → public site

```
Hassan edits phone in /admin/site-config
  → PUT /api/admin/site-config { phone, contact_email }
  → drizzle UPDATE site_config WHERE id = 1
  → returns 200

Visitor loads itshassan.it
  → React component fetches GET https://admin.itshassan.it/api/site-config
       (on mount, with localStorage 5-minute cache + hard-coded fallback)
  → Renders phone/email
```

Hard-coded fallback in `apps/docs` ensures the portfolio renders even if the admin domain is down.

## File-level changes

### New files

```
apps/web-next/
  lib/
    adminSession.ts            iron-session config + requireAdminSession()
    origin.ts                  CORS / Origin allowlist helpers
    db/
      client.ts                drizzle client (Neon HTTP driver)
      schema.ts                tables defined above
    email.ts                   Resend client + getNotificationRecipient(config)
    cal/
      verifySignature.ts       HMAC verifier (raw-body input)
      extract.ts               extractCalLead(payload) defensive mapping
  drizzle.config.ts
  drizzle/
    0000_init.sql              generated migration
  scripts/
    seed.ts                    pnpm -F web-next db:seed
  app/
    admin/
      layout.tsx               admin shell (nav, logout)
      page.tsx                 leads list
      login/
        page.tsx               login form (Server Action)
      leads/
        [id]/
          page.tsx             lead detail
      site-config/
        page.tsx               config edit form
    api/
      leads/route.ts           POST public
      cal/webhook/route.ts     POST public
      site-config/route.ts     GET public
      admin/
        login/route.ts         POST
        logout/route.ts        POST
        leads/[id]/route.ts    PATCH
        site-config/route.ts   PUT

apps/docs/
  src/components/sections/
    BookACallButton.tsx        Cal.com embed trigger
  src/lib/
    siteConfig.ts              fetch + cache from admin.itshassan.it
```

### Modified files

```
apps/web-next/
  middleware.ts → proxy.ts     RENAME (Next.js 16 deprecates middleware.ts).
                               Add /admin/:path* and /api/admin/:path* matchers (with /api/admin/login bypassed); branch on path.
                               Export must be named `proxy`, not `middleware`.
  package.json                 add deps (drizzle-orm, drizzle-kit, @neondatabase/serverless, iron-session, bcryptjs, resend, @types/bcryptjs).
                               Add db scripts: db:generate, db:migrate, db:seed, db:studio.
  app/globals.css              extend with admin-specific classes (.stat-card, .lead-row, .admin-nav, .admin-table, etc.) — additive only, booking demo classes untouched.
  .env.example                 NEW

apps/docs/
  src/components/sections/ContactForm.tsx       wire onSubmit → POST admin /api/leads;
                                                add hidden honeypot input + form-render timestamp;
                                                add required privacy checkbox + link to /privacy
  src/components/sections/ContactSection.tsx    add <BookACallButton /> next to existing CTA
  src/i18n/messages.ts                          add privacy notice strings (en/it/fr)
  package.json                                  add @calcom/embed-react
```

## Environment variables

```
# admin (apps/web-next)
DATABASE_URL=postgres://...neon.tech/...
ADMIN_EMAIL=h.akkari@sibyllanetwork.com   # used by seed only
ADMIN_PASSWORD=...                         # used by seed only
ADMIN_SESSION_SECRET=...                   # 32+ chars, iron-session signing
CAL_WEBHOOK_SECRET=...                     # from Cal.com webhook config
RESEND_API_KEY=...
RESEND_FROM=Hassan <noreply@itshassan.it>  # must be a verified sending domain in Resend
PRIVACY_VERSION=v1-2026-05                 # bumped any time the privacy notice text changes
PUBLIC_ALLOWED_ORIGINS=https://itshassan.it,http://localhost:5173
ADMIN_ALLOWED_ORIGINS=https://admin.itshassan.it,http://localhost:3001

# docs (apps/docs)
VITE_ADMIN_API_BASE=https://admin.itshassan.it
VITE_CAL_LINK=hassan/discovery             # Cal.com event to be created with slug "discovery"
```

`.env.example` ships in the repo with placeholder values. Real values live in Vercel project settings.

## Security posture

- Passwords: bcrypt cost 12.
- Session cookie: `httpOnly`, `secure`, `sameSite: 'lax'`, signed via iron-session with `ADMIN_SESSION_SECRET`. 7-day fixed TTL.
- Cal.com webhook: HMAC SHA-256 over the **raw request body** (`await request.text()`), `timingSafeEqual` comparison, reject on mismatch. Replay protection via `cal_booking_id` upsert.
- CORS: explicit allowlist of `https://itshassan.it` only.
- CSRF: no token machinery, but admin mutation routes verify `Origin` header is `https://admin.itshassan.it` (or `http://localhost:3001` in dev). Combined with `sameSite: lax` admin cookie that's enough for a single-user admin.
- Anti-spam on public contact form: invisible honeypot field (`company_website`) + min-submit-delay (≥3s between form render and submit). Bot submissions silently get a 200 with no DB insert. No CAPTCHA.
- Rate limiting: relies on Vercel platform defaults for v1. Brute-force protection on `/api/admin/login` is **out of scope**; flagged for v2.
- Session invalidation: rotating `ADMIN_SESSION_SECRET` invalidates every issued cookie. Sufficient for single-user admin; no per-user `session_version` column needed.

## Testing

Lightweight, focused on the security-critical and integration boundaries:

- `lib/cal/verifySignature.test.ts` — HMAC verifier accepts valid, rejects tampered (raw-body path covered).
- `lib/adminSession.test.ts` — round-trip cookie sign/verify.
- `lib/email.test.ts` — `getNotificationRecipient` falls back correctly when `notify_email` is null.
- `app/api/leads/route.test.ts` — zod rejects bad payloads, honeypot rejects non-empty, min-delay rejects fast submits, valid inserts a row.
- `app/api/cal/webhook/route.test.ts` — idempotency on retry; signature rejection; reschedule + cancel update existing row without duplicating.

Vitest, with the Drizzle client mocked for unit tests. No DB integration tests or E2E for v1 — those go on the v2 list if the admin sees real volume.

## Out of scope (v1)

- Multi-user / roles / invites.
- Password reset flow (Hassan can re-run the seed if locked out).
- 2FA.
- Audit log of admin actions.
- Lead CSV export.
- Pagination of leads (added when count > 50).
- Custom rate limiting.
- Brute-force protection on login (accept Vercel defaults).
- Calendar sync outside Cal.com.
- Managing the existing booking-demo orders (`apps/web-next/lib/orders.ts`).
- Localization of the admin UI (English only).
- The "arsenale mentale" reading-dossier page (`resources/arsenale-mentale.html`). **Deferred, but planned as an admin surface**: port to `app/admin/arsenale/page.tsx`, gated by the same admin auth, added once admin pages exist (Phase 2+). Pure static content — no DB dependency. Tracked as F14 in `.claude/_followup.md`.

## Open risks / gotchas

- **Styling: extend existing CSS, don't add Tailwind.** `apps/web-next/app/globals.css` already has a CSS-variable design system with semantic classes (`.card`, `.button`, `.field`, `.notice`, `.form-grid`, `.layout-two`). The admin UI reuses these and extends `globals.css` with admin-specific additions (e.g. `.stat-card`, `.lead-row`, `.admin-nav`). This keeps a single styling source of truth and a coherent visual identity across booking demo + admin.
- **`packages/ui` build before deploy**: per CLAUDE.md gotcha #1, Vercel build for `apps/web-next` must run `pnpm -F @laboratoire/ui build` first. Configure via Vercel "Install Command" or use `turbo run build --filter=web-next...` which respects deps.
- **Two Vercel projects, one repo**: each project sets Root Directory to its app folder. Build command for the admin project: `pnpm -w turbo run build --filter=web-next...` so Turbo respects `^build` deps and rebuilds `@laboratoire/ui` first. Root `package.json` already pins `packageManager: "pnpm@10.0.0"` — verify Vercel respects this rather than substituting an older pnpm. Document the exact Vercel project settings in the repo README on completion.
- **Cal.com plan = Free (assumed)**: Cal.com webhooks may be Teams-only depending on event type. Build order treats step 12 (webhook ingestion) as **deferrable** — if Free doesn't expose webhooks for the `discovery` event when we get there, we ship v1 without it. The embed still works; bookings simply don't auto-flow into the admin until Hassan upgrades or checks Cal manually. Steps 1-11 do not depend on Cal in any way.
- **Cal.com webhooks reject localhost / private IPs**. Local testing of `/api/cal/webhook` requires either a deployed Vercel preview URL (preferred — set up a "preview" webhook in Cal pointing at the latest preview deployment) or a public tunnel (cloudflared / ngrok). Don't waste time pointing Cal at `http://localhost:3001`.
- **Resend domain verification**: Resend will reject sends from unverified domains. Deployment checklist (step 14) must include: create API key in Resend dashboard → add `itshassan.it` (or chosen sending domain) → add the DNS records Resend provides to OVH (SPF, DKIM, DMARC) → wait for verification → set `RESEND_FROM` to an address on that domain. The "Send test email" button in `/admin/site-config` is the verification UI.
- **Next.js 16 proxy.ts**: this app currently has `apps/web-next/middleware.ts` (per CLAUDE.md). Next.js 16 [renamed](https://nextjs.org/blog/next-16#proxyts-formerly-middlewarets) it to `proxy.ts`; `middleware.ts` is deprecated and will be removed. We rename as part of step 4 of the build order. The exported function name changes from `middleware` to `proxy`. Logic stays the same.
- **Proxy is not the security brain**: see "Defense in depth" above. Proxy does cookie-presence redirects only; every admin route handler additionally calls `requireAdminSession()`.
- **OVH DNS propagation**: budget ~1 hour after CNAME add before HTTPS provisions on Vercel.

## Build order (always-shippable increments)

Each step ends with something that works on its own, so partial completion is still useful. Cal.com webhook is last because it's the most fragile and depends on a Cal plan that may need verification first.

1. Drizzle + Neon DB setup in `apps/web-next` (client, schema, migration tooling, env wiring).
2. Seed script + first migration applied; one user row + one site_config row exist.
3. iron-session admin auth (`lib/adminSession.ts`) + `/api/admin/login` + `/api/admin/logout`.
4. Middleware split: existing `/checkout` branch untouched; new `/admin/*` and `/api/admin/*` branch.
5. `/admin` shell + leads list rendering seed/empty data, with stat cards.
6. `/admin/leads/[id]` detail + `PATCH /api/admin/leads/[id]`.
7. `/admin/site-config` + `PUT /api/admin/site-config` + "Send test email" button.
8. `POST /api/leads` (zod, honeypot, delay check, Resend with error capture).
9. `GET /api/site-config` public endpoint with CORS + cache headers.
10. `apps/docs` ContactForm wired to admin endpoint; siteConfig fetcher + fallback.
11. Cal.com embed (`@calcom/embed-react`) + BookACallButton on docs.
12. `POST /api/cal/webhook` (raw body, HMAC, upsert, status mapping).
13. Tests for the security-critical paths.
14. Deployment README + checklist:
    - OVH CNAME `admin.itshassan.it → cname.vercel-dns.com`
    - Vercel project for `apps/web-next` (Root Directory + Build Command from "Two Vercel projects" gotcha)
    - Neon project in `aws-eu-central-1`, get `DATABASE_URL`
    - Run `db:generate` + `db:migrate` against Neon, then `db:seed`
    - Resend: create API key, verify sending domain (add SPF/DKIM/DMARC DNS in OVH), set `RESEND_FROM`
    - Cal.com: create `discovery` event, set up webhook on a preview URL first, copy `CAL_WEBHOOK_SECRET`
    - Smoke test: open `/admin/login`, log in, submit `/admin/site-config` "Send test email", confirm receipt

## Decisions explicitly made (so they don't get re-litigated)

1. Hybrid use case (showcase + real).
2. Cal.com integration is **embedded widget** (`@calcom/embed-react`), not hosted redirect, not native Atoms.
3. Stack as listed above; no Auth.js, no Prisma, no Lucia.
4. Subdomain `admin.itshassan.it`, separate Vercel project.
5. Two auth systems coexist; existing `/login` untouched.
6. `site_config.contact_email` is public; optional `notify_email` overrides where notifications get sent (falls back to `contact_email` when null).
7. Site config fetched live from the admin domain, with localStorage cache and hard-coded fallback in docs.
8. Resend email notifications in v1, with DB-as-truth: the lead row is saved even if Resend fails, with `notification_error` capturing the cause for retry-from-admin later if needed.
9. `lead.status` (CRM: new/contacted/closed) is **separate** from `booking_status` (Cal lifecycle: scheduled/rescheduled/cancelled). A cancelled booking does not automatically close the lead.
10. Single source of truth for notification recipient: `getNotificationRecipient(config)` helper in `lib/email.ts`. No call site reads `contact_email` directly for email purposes.
11. Anti-spam on the public contact form: honeypot field + min-submit-delay only. No CAPTCHA in v1.
12. Admin mutation routes verify `Origin` header instead of full CSRF tokens.
13. `runtime = "nodejs"` mandatory on every route that touches bcrypt, HMAC, or iron-session.
14. Production migrations via `drizzle-kit migrate` (not `push`); generated SQL committed to git.
15. Next.js 16 file convention: `apps/web-next/proxy.ts` (not `middleware.ts`). Exported function name is `proxy`.
16. Defense in depth: proxy does presence-only checks; every admin route additionally calls `requireAdminSession()` server-side.
17. CORS / Origin allowlists are env-driven (`PUBLIC_ALLOWED_ORIGINS`, `ADMIN_ALLOWED_ORIGINS`), checked through one helper module (`lib/origin.ts`). No hardcoded origin strings in routes.
18. Cal.com payload mapping is defensive (`extractCalLead`) with raw payload archived in `cal_payload jsonb` for debug. Webhooks signed with `x-cal-signature-256` over the raw body.
19. Privacy: contact-form leads include a required privacy checkbox + link to `/privacy`. The accepted timestamp + `PRIVACY_VERSION` env are stored on the lead row.
20. **No Tailwind added to `apps/web-next`.** The existing `apps/web-next/app/globals.css` already provides a CSS-variable design system with semantic classes (`.card`, `.button`, `.field`, `.notice`, `.form-grid`, `.layout-two`, etc.). Admin UI reuses these classes and extends `globals.css` with admin-specific additions where needed. Avoids dual-styling-system tension with the booking demo.
