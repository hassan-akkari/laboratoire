# Handoff — Admin Page Phase 3 close-out + Phase 4 kickoff

**Date:** 2026-05-15
**Owner:** Hassan
**Branches in flight:**
- `feat/admin-phase-3-plan` (HEAD `9a6f811c`) — Phase 3 implementation, pushed, awaiting PR + manual smoke.
- `fix/portfolio-followups-2026-05` (HEAD `51aa95e5`) — small a11y + docs fixes (A10/A15/A16), rebased on new main, pushed, awaiting PR.
- `main` (HEAD `27b6f1c5`) — Phase 1 + Phase 2 admin merged via PR #6.

**Status:** Phase 3 (public surface) functionally complete. Lint + typecheck + 96 tests green (80 web-next + 16 docs). Manual browser smoke (plan Task 12) NOT yet run. Phase 4 plan NOT yet written — that's the next session's job.

---

## TL;DR for the next AI

Read this file + [`docs/superpowers/specs/2026-05-09-admin-page-design.md`](../specs/2026-05-09-admin-page-design.md) (frozen spec, build-order items 11 + 12 remain) + [`docs/superpowers/plans/2026-05-15-admin-page-phase-3-public.md`](../plans/2026-05-15-admin-page-phase-3-public.md) (Phase 3 plan, all 12 tasks committed).

Two open PRs need landing before Phase 4: `feat/admin-phase-3-plan` and `fix/portfolio-followups-2026-05`. Surface the merge order question to Hassan. After both merge, branch off updated `main` as `feat/admin-page-phase-4` and **invoke `superpowers:writing-plans`** to produce `docs/superpowers/plans/2026-05-15-admin-page-phase-4-cal.md` covering spec build-order steps **11 + 12** (Cal.com embed + webhook).

If Hassan wants to skip the merge and stack Phase 4 directly on `feat/admin-phase-3-plan`, that works too — Phase 4 doesn't touch any Phase 3 files. State the trade-off (smaller PRs vs. one bigger PR) and let him pick.

---

## What Phase 3 left behind (do not re-do)

| State | Evidence |
|---|---|
| `feat/admin-phase-3-plan` at `9a6f811c` | 14 commits ahead of `main`, all pushed to origin. PR-ready. |
| `fix/portfolio-followups-2026-05` at `51aa95e5` | 3 commits ahead of `main` (rebased clean), pushed. PR-ready. |
| Public lead intake | `POST https://admin.itshassan.it/api/leads` (dev: `localhost:3001`). zod + honeypot (`company_website`) + 3s min-delay + Resend notification + privacy fields. DB-as-truth (always 200 once row inserted; Resend failure captured in `notification_error`). Silent 200 on honeypot/delay reject. |
| Public site-config read | `GET https://admin.itshassan.it/api/site-config`. Strict-projects `{phone, contactEmail}` only (never leaks `notifyEmail`). CORS allowlisted to `https://itshassan.it` + `http://localhost:5173`. `Cache-Control: public, s-maxage=60, stale-while-revalidate=600`. |
| Service-layer additions | `lib/admin/leads.ts` exports `createLead`, `recordLeadNotification` (preserves `lastNotifiedAt` on failure — Phase 4 retry-safe). `lib/email.ts` exports `sendLeadNotification` (HTML-escapes every user field via existing `escapeHtml`). |
| Portfolio ContactForm | Wired to admin endpoint via `fetch(${VITE_ADMIN_API_BASE}/api/leads)`. Localized error messages (closes followup A17). Honeypot input (off-screen + `aria-hidden` + `tabIndex=-1`). Required privacy checkbox linking to `/privacy`. SubmitState union drives button label + inline notice. |
| Portfolio siteConfig overlay | `apps/docs/src/lib/siteConfig.ts` fetches the public endpoint with 5-min localStorage cache + hard-coded fallback. `ContactSection.tsx` overlays admin-saved email. Phone block deferred (FaPhone not imported). |
| `/privacy` page | Renders `Messages["privacy"]` for active locale. EN/IT/FR all carry intro + 5 sections + back link. |
| Tests | 80/80 vitest pass on `apps/web-next` (66 from Phase 1+2 + 14 new: 4 leads-service, 3 email, 9 POST /api/leads, 7 GET /api/site-config including the null-resolve path). 16/16 on `apps/docs` (3 portfolio-content + 7 contactForm.schema + 6 siteConfig). |
| Gates | `pnpm -F web-next lint/typecheck/test` clean. `pnpm -F docs lint/typecheck/test` clean. |
| Code review applied | 1 HIGH (`getSiteConfig` null deref, typecheck-breaker) + 1 MEDIUM (`recordLeadNotification` wiping history on failure) + 1 LOW (CORS coverage gap) — all fixed in commit `9a6f811c`. NIT not fixed: `x-pathname` proxy header forgeable on non-matcher routes (cosmetic only — flagged in Phase 2 review). |

## First decisions the next AI must surface

### Decision A — merge order

Two PRs are open. Both are merge-clean (rebased / no file overlap between branches). Three sensible orderings:

1. **Recommended: merge both before Phase 4 starts.** Land `fix/portfolio-followups-2026-05` first (it's tiny — 3 commits, a11y + docs fixes), then `feat/admin-phase-3-plan` (14 commits, public surface). Phase 4 branches off the resulting `main`. Clean history, small reviewable PRs.
2. **Merge Phase 3, skip the small followup until later.** The followup branch has no time pressure. Same outcome as (1) for Phase 4's perspective.
3. **Stack Phase 4 on `feat/admin-phase-3-plan`.** No file conflict (Phase 4 only touches new files). Faster start, but the PR for Phase 3 + Phase 4 becomes 25+ commits and harder to review.

Default to (1). Ask Hassan once.

### Decision B — manual smoke test before merge

Plan Task 12 hasn't been run yet (needs both dev servers + a browser + ideally Resend credentials). Three flavors:

1. **Smoke before merge** — safest. Hassan runs `pnpm dev:next` + `pnpm dev:docs`, walks the flow per plan Task 12 step 3. If anything breaks, fix on the branch.
2. **Smoke after merge** — riskier, but the Phase 3 surface is well-tested (80 unit tests + the code review caught the real bug). Could also be done on a Vercel preview if Phase 5 deploys early.
3. **Skip smoke entirely until Phase 5 prep** — only viable if no users hit the portfolio in the meantime.

Recommend (1). The plan's Task 12 step 3 has the full browser checklist.

### Decision C — Resend credentials

Phase 3 ships graceful Resend fallback: missing `RESEND_API_KEY` or `RESEND_FROM` → lead is still inserted, `notification_error` records the missing-config reason, the form still shows success to the user. So Phase 3 works WITHOUT Resend keys.

To exercise the email path end-to-end, Hassan needs:
1. Resend account + API key.
2. A verified sending domain (long term: `itshassan.it` with SPF/DKIM/DMARC DNS on OVH) OR the sandbox `onboarding@resend.dev` for dev.
3. Set `RESEND_API_KEY=...` + `RESEND_FROM=Hassan <noreply@itshassan.it>` (or sandbox sender) in `apps/web-next/.env.local`. Restart `pnpm dev:next`.

Deferring this to Phase 5 (deployment) is fine if the smoke test passes the lead-insert + admin-list path without needing a real email delivery.

## Phase 4 scope (what the plan must cover)

Per the spec's "Build order" section, steps **11 + 12**:

- **Step 11:** Cal.com embed (`@calcom/embed-react`) on `apps/docs`. A `BookACallButton` component placed in `ContactSection` (next to the existing CTAs) and optionally in `FinalCTASection`. Inline embed vs modal vs floating button — spec leaves to taste; the brainstorm in followup F12 suggests inline on `/audit` follow-up step + modal on the homepage CTA.
- **Step 12:** `POST /api/cal/webhook` on `apps/web-next`. Reads body via `await request.text()` BEFORE parsing — HMAC over the raw bytes (`x-cal-signature-256` header) using `timingSafeEqual` against `CAL_WEBHOOK_SECRET`. Then `JSON.parse(rawBody)`. Handles `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`. Upserts via `cal_booking_id` (`onConflictDoUpdate`) — idempotent against Cal retries. Stores full payload in `cal_payload jsonb` for debug. Sends Resend notification on `BOOKING_CREATED` only.
- **`extractCalLead(payload)` defensive mapping** at `apps/web-next/lib/cal/extract.ts`. Cal payloads vary across event types and versions — the spec lists the fallback chain (`p.uid ?? p.bookingUid`, `p.responses?.name?.value ?? p.attendees?.[0]?.name`, etc.). Unit-tested against fixture JSON.
- **`verifySignature(rawBody, signatureHeader, secret)`** at `apps/web-next/lib/cal/verifySignature.ts`. HMAC-SHA256 with `timingSafeEqual`. Tested with valid + tampered fixtures.
- **`createLead` extended** to accept `source: 'cal'` with `calBookingId`, `calPayload`, `scheduledAt`, `bookingStatus`. Phase 3 only set up the `contact_form` path; Phase 4 wires the `cal` branch.
- **`POST /api/leads` source extension is NOT in scope** — `cal` leads come exclusively from the webhook, not the public form.

**Out of scope** (Phase 5+):
- New Vercel project for `apps/web-next` + `admin.itshassan.it` CNAME on OVH
- Resend domain verification + SPF/DKIM/DMARC DNS records
- Cal.com event-type creation in the Cal dashboard (manual Hassan setup; the plan should call this out as pre-flight)
- DEV_NO_DB cleanup decision
- Lead CSV export, audit log, rate limiting on login

## Design notes the next AI should keep in mind

1. **Cal.com Free tier webhook risk.** The spec explicitly flags step 12 as deferrable — Cal Free may not expose webhooks for the `discovery` event type. The plan should make the webhook path graceful: if Cal Free turns out not to support webhooks for the event Hassan is using, ship the embed (step 11) without the webhook (step 12) and document manual reconciliation. Cal's docs change frequently — verify webhook availability with a 5-minute manual test in the Cal dashboard before sinking days into the webhook code.

2. **Local webhook testing is impossible without a tunnel.** Cal won't deliver webhooks to `localhost:3001`. Options: (a) `cloudflared tunnel` (free, no signup beyond cloudflare account), (b) `ngrok` (free tier, requires account), (c) skip local + test only against a Vercel preview deployment. Plan should pick one and stick with it.

3. **Raw body before JSON.parse.** This is a spec-critical detail. `request.text()` MUST come before any `request.json()` or the HMAC will mismatch — Next.js streams the body and you only get one read. The spec section "Cal.com booking → admin" has the exact sequence. Test it explicitly.

4. **Idempotency via `cal_booking_id` partial unique index.** The Phase 1 migration already ships `CREATE UNIQUE INDEX leads_cal_booking_id_uq … WHERE cal_booking_id IS NOT NULL`. Phase 4's webhook handler uses `.onConflictDoUpdate({ target: schema.leads.calBookingId, set: {...} })` — drizzle's standard upsert. Verify the partial-unique-index quirk doesn't require special handling.

5. **`bookingStatus` is separate from `status`.** Spec decision #9: `lead.status` is the CRM lane (new/contacted/closed), `bookingStatus` is the Cal lifecycle (scheduled/rescheduled/cancelled). A cancelled booking does NOT close the lead. Keep them independent in the webhook handler and the admin UI.

6. **`runtime = "nodejs"` on the webhook route.** HMAC verification needs `node:crypto`. Edge runtime doesn't have it. Spec decision #13.

7. **No new Tailwind in apps/web-next.** Spec decision #20 + CLAUDE.md gotcha #4. Any admin-side UI tweaks for the Cal status pill go through `app/globals.css` extensions.

8. **`getNotificationRecipient(config)` is still the only allowed read path.** Phase 4 webhook calls `sendLeadNotification` via the same helper. Spec decision #10.

9. **PrivacyPage line width.** Hassan highlighted `maxWidth: "70ch"` on line 14 — that's a typography choice (~65-75 chars per line). If he wants narrower or wider, swap. Not blocking.

## Pre-flight Hassan should consider before Phase 4 execution

**Cal.com setup (the slow part):**

1. Sign up at `cal.com` if not already.
2. Create an event type — e.g. "Free 20-min intro call" with slug `discovery` (matches the spec's `VITE_CAL_LINK=hassan/discovery` env). Set availability + buffer + reminder emails.
3. (Optional but recommended) Verify whether your tier exposes webhooks for THIS event. Go to event settings → "Webhooks". If you see `BOOKING_CREATED` etc. — you're good. If it's grayed out — Phase 4 ships the embed only and webhook stays deferred.
4. If webhooks are available: create a webhook with URL = `https://<preview-or-prod>.vercel.app/api/cal/webhook`, copy the signing secret to `apps/web-next/.env.local` as `CAL_WEBHOOK_SECRET=...`.

**Frontend env (small):**

Add `VITE_CAL_LINK=hassan/discovery` (or whatever slug you picked) to `apps/docs/.env.local`. The plan will spell this out.

**Webhook signing key budgeting:**

If you rotate `CAL_WEBHOOK_SECRET` in Cal, the next webhook delivery will fail HMAC. Make this a documented runbook item in Phase 5's deploy README.

## Approximate task count for the Phase 4 plan

Expect about **8-10 tasks**, smaller than Phase 3:

1. `apps/docs` env: add `VITE_CAL_LINK` to `.env.example`.
2. `apps/docs`: install `@calcom/embed-react` (via `pnpm -F docs add`).
3. `apps/docs/src/components/sections/BookACallButton.tsx` — modal or inline embed component, takes the Cal link from env.
4. `apps/docs/src/components/sections/ContactSection.tsx` — render `<BookACallButton />` alongside email/CTAs.
5. `apps/web-next/lib/cal/verifySignature.ts` (TDD) + `lib/cal/verifySignature.test.ts`.
6. `apps/web-next/lib/cal/extract.ts` (TDD) — fixtures of each trigger event under `lib/cal/__fixtures__/` + `extract.test.ts`.
7. `apps/web-next/lib/admin/leads.ts` — extend `createLead` (or add `upsertCalLead`) to support the `cal` source with `calBookingId` partial unique index.
8. `apps/web-next/app/api/cal/webhook/route.ts` (TDD) — raw body, HMAC verify, switch on `triggerEvent`, upsert, Resend on create only.
9. `apps/web-next/.env.example` — uncomment `CAL_WEBHOOK_SECRET`.
10. Manual smoke — book a real Cal slot from a Vercel preview, verify the admin lead detail page shows the booking with `bookingStatus: scheduled`.

Optionally collapse 5+6 into one task if the helpers stay tiny.

## Files to read first (next AI, in order)

1. **This file.**
2. [`docs/superpowers/specs/2026-05-09-admin-page-design.md`](../specs/2026-05-09-admin-page-design.md) — frozen spec with the Cal.com payload mapping section + decision #18.
3. [`docs/superpowers/plans/2026-05-15-admin-page-phase-3-public.md`](../plans/2026-05-15-admin-page-phase-3-public.md) — Phase 3 plan, useful for matching task granularity and commit-message style.
4. `apps/web-next/lib/admin/leads.ts` — current shape of `createLead` (you'll extend it for the `cal` source).
5. `apps/web-next/lib/db/schema.ts` — `leads` table has `calBookingId` (unique partial idx) + `calPayload jsonb` + `bookingStatus` enum already from Phase 1.
6. `apps/web-next/lib/email.ts` — `sendLeadNotification` already accepts `source: 'cal'`.
7. `apps/web-next/app/api/leads/route.ts` — pattern reference for how Phase 3 wired the route (CORS + zod + service-layer + Resend); the webhook is structurally similar but with HMAC instead of CORS.
8. `_followup.md` entry **F12** — original direction note (Cal.com hybrid, Free tier).
9. `CLAUDE.md` (root) — gotchas, especially #1 (UI build), #4 (no Tailwind in web-next).

## Snapshot

```
Branches:
  main                                @ 27b6f1c5  (Phase 1+2 admin live)
  fix/portfolio-followups-2026-05     @ 51aa95e5  (3 commits ahead, PR-ready)
  feat/admin-phase-3-plan             @ 9a6f811c  (14 commits ahead, PR-ready)

Phase 3 commits ahead of main:        14
Tests:                                80 web-next + 16 docs = 96 passing
Lint:                                 clean both apps
Typecheck:                            clean both apps
DB:                                   live in Neon eu-central-1, migrated and seeded (Phase 1)
Resend:                               OPTIONAL (graceful fallback if keys missing)
Manual smoke test:                    NOT YET RUN (plan Task 12)
Phase 3:                              CODE COMPLETE
Phase 4 plan:                         NOT YET WRITTEN — that's the next AI's job
Phase 4 execution:                    blocked on plan + Cal.com event-type setup
```
