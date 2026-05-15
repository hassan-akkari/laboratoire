# Handoff — Admin Page Phase 2 (kickoff)

**Date:** 2026-05-15
**Owner:** Hassan
**Branch:** `feat/admin-page` (tagged `phase-1-foundation`)
**Status:** Phase 1 functionally complete and smoke-tested end-to-end against real Neon Frankfurt DB. Phase 2 (admin UI) plan has NOT been written yet — the previous session paused after invoking `superpowers:writing-plans` but before producing the plan file. **This handoff hands the writing task to the next session.**

## TL;DR for the next AI

Read this file + [`docs/superpowers/specs/2026-05-09-admin-page-design.md`](../specs/2026-05-09-admin-page-design.md) (spec, frozen) + [`docs/superpowers/handoffs/2026-05-09-admin-page-phase-1-resume.md`](2026-05-09-admin-page-phase-1-resume.md) (Phase 1 history, including the "Phase 1 close-out" section at the bottom which documents the final state).

Then **invoke `superpowers:writing-plans`** and produce `docs/superpowers/plans/2026-05-15-admin-page-phase-2-ui.md` covering spec build-order steps 5, 6, 7. After the plan exists, ask Hassan to choose subagent-driven vs inline execution, then proceed.

---

## What Phase 1 left behind (do not re-do)

| State | Evidence |
|---|---|
| Branch `feat/admin-page` at HEAD `c0d42cdb` | 19 commits ahead of `main`. Tagged `phase-1-foundation`. |
| DB live in Neon eu-central-1 (Frankfurt) | 3 tables (`users`, `leads`, `site_config`), 1 admin user (`hassan.akkari01@gmail.com`), 1 site_config singleton (id=1) |
| Auth wiring | iron-session cookie `admin_session` (7-day TTL), bcrypt cost 12, origin allowlist, proxy gate on `/admin/*` and `/api/admin/*` with `/api/admin/login` carve-out |
| Tests | 25/25 vitest pass — origin 6, adminSession 4, login 5, logout 3, plus pre-existing session 3, pricing 3, orders 1 |
| Gates | `pnpm check` (lint + typecheck + test) clean |
| Smoke test (Task 12) | All 5 curl probes green: foreign origin → 403, wrong password → 401, correct password → 200 + signed cookie, gated page hit with cookie → 404 (page absent, but proxy let it through), logout → 200 |
| DEV_NO_DB escape hatch | Added and now dormant (`DEV_NO_DB=1` is commented out in `.env.local`). Cleanup decision deferred to Phase 5. Tracked in commit `885e2902` — easy to remove with a manual edit. |

## First decision the next AI must surface

**Merge Phase 1 to `main` now, or continue Phase 2 on `feat/admin-page`?**

- **Recommended: merge Phase 1 first.** Open a PR from `feat/admin-page` → `main` for the 19 commits. Once merged, branch `feat/admin-phase-2` off updated `main`. Reasons: smaller reviewable PRs, clearer milestones, Phase 1 already passes `pnpm check` so the PR has nothing in flight.
- **Alternative: one big PR.** Continue Phase 2 on `feat/admin-page`. Result is a single 30+ commit PR at the end. Faster to start, harder to review.

Ask Hassan once before starting Phase 2. Default to the recommendation if he doesn't care.

If choosing the recommended path: he'll need to push `feat/admin-page` to origin and open the PR via the GitHub web UI (the gh CLI on this machine is unauthenticated — flagged in the original handoff dated 2026-05-09).

## Phase 2 scope (what the plan must cover)

Per the spec's "Build order" section, steps **5, 6, 7**:

- **Step 5:** `/admin` shell + leads list page with stat cards + filters (status, source)
- **Step 6:** `/admin/leads/[id]` detail page + edit form (status + notes) backed by `PATCH /api/admin/leads/[id]`
- **Step 7:** `/admin/site-config` edit page + `PUT /api/admin/site-config` + "Send test email" button + `POST /api/admin/test-email`

Plus the prerequisites that block these:

- `/admin/login` **page** (only the API exists from Phase 1 — Phase 2 must build the form so non-curl auth works in the browser)
- `lib/email.ts` — Resend client wrapper with `getNotificationRecipient(config)` helper, `sendTestEmail()` helper. Per spec: every email path goes through `getNotificationRecipient` — no direct reads of `contact_email` in the email layer.
- `lib/admin/leads.ts` — service layer for `getLeads(filters)`, `getLeadById(id)`, `updateLead(id, patch)`
- `lib/admin/siteConfig.ts` — service layer for `getSiteConfig()`, `updateSiteConfig(patch)`
- `app/admin/not-found.tsx` — admin-specific 404 (currently a hit on `/admin/login` falls through to the booking-demo `not-found` which talks about "in-memory order state" — out of context. Bumped to Phase 2 in chat. Captured in `_followup.md` if it exists, otherwise add it.)
- CSS extensions to `app/globals.css` — additive only (`.stat-card`, `.admin-nav`, `.admin-table`, `.lead-row`, etc.). Spec is explicit: **do not add Tailwind to `apps/web-next`** (decision #20 in the spec, gotcha #4 in CLAUDE.md). Extend the existing CSS-variable design system that already provides `.card`, `.button`, `.field`, `.notice`, `.form-grid`, `.layout-two`.

**Out of scope** (Phase 3+):
- `POST /api/leads` public intake endpoint
- `GET /api/site-config` public read endpoint with CORS
- `apps/docs` ContactForm wiring and Cal embed
- `POST /api/cal/webhook`
- Privacy fields end-to-end (the schema column exists from Phase 1; wiring in the public form is Phase 3)
- Deployment

## Design notes the next AI should keep in mind

1. **Route groups to host `/admin/login` outside the auth gate.** If `app/admin/layout.tsx` calls `requireAdminSession()`, hitting `/admin/login` triggers it, redirects to `/admin/login`, triggers the layout again → infinite loop. Use Next.js route groups: place authed pages under `app/admin/(authed)/...` (route group doesn't add to URL) and let `app/admin/(authed)/layout.tsx` carry the auth check + nav. Keep `app/admin/login/page.tsx` outside the group so it renders against the root `app/layout.tsx` only.

2. **Logout is a client-side fetch.** A `LogoutButton` client component posts to `/api/admin/logout` with default fetch (includes Origin header automatically), then `router.push("/admin/login"); router.refresh()`. Avoid native form POST because handling the redirect + cookie clear is more code than the fetch path.

3. **Form mutations have two options:** Server Actions OR explicit API route + client fetch. The spec lists API routes (`PATCH /api/admin/leads/[id]`, `PUT /api/admin/site-config`, `POST /api/admin/test-email`). Implement those routes per spec **AND** factor the actual drizzle work into the service-layer modules above so both Server Actions and API routes can share the same logic without duplication. For the form pages themselves, Server Actions calling the service layer are simpler than client-side fetch.

4. **Stat cards compute counts in memory.** Spec defers pagination until lead count > 50. For Phase 2: `getLeads()` returns all rows, the page filters in memory based on `searchParams`, stat cards count over the unfiltered set. Two reads if you want stats unaffected by filter — OR one read + two reductions. Either works.

5. **`runtime = "nodejs"` on every admin route**, per spec decision #13. iron-session, bcrypt, and Resend all need the Node runtime.

6. **Defense in depth still holds.** Every authed page calls `requireAdminSession()`. Every admin mutation route calls `requireAdminSession()` (or equivalent helper) AND `requireAdminOrigin(request)`. Don't trust the proxy alone.

7. **`getNotificationRecipient(config)` is the ONLY way to resolve the email-to address.** No hardcoded `config.contactEmail` lookups in any email-sending code path. Spec decision #10.

## Pre-flight Hassan should consider before Phase 2 execution

**Resend account (optional but recommended).** Phase 2 includes a "Send test email" button. To actually exercise it, Hassan needs:

1. Sign up for Resend free tier (https://resend.com)
2. Verify a sending domain — `itshassan.it` is the spec choice. Adds 3-4 DNS records (SPF, DKIM, DMARC) on OVH. **Budget ~30 min for DNS propagation.**
3. Get an API key, put in `.env.local` as `RESEND_API_KEY=re_xxx` and `RESEND_FROM=Hassan <noreply@itshassan.it>`

If he skips this, Phase 2 still builds and the rest works — the test-email button will just return "Resend not configured" until the env vars are set. The plan should make this an explicit graceful fallback in `sendTestEmail()`, not an exception.

Alternative: he can use Resend's sandbox domain (`onboarding@resend.dev`) to send to himself without verifying his domain. Faster for dev, but the same DNS work is needed eventually for prod.

## Approximate task count for the Phase 2 plan

When the next AI writes the plan, expect about **14-16 tasks** following the same TDD-where-applicable pattern as Phase 1:

1. Add Resend env vars to `.env.local` + `.env.example` (no code)
2. `lib/email.ts` (TDD on `getNotificationRecipient`, mock Resend client for `sendTestEmail`)
3. `lib/admin/leads.ts` (TDD with mocked db)
4. `lib/admin/siteConfig.ts` (TDD with mocked db)
5. Extend `app/globals.css` with admin CSS classes
6. `app/admin/(authed)/layout.tsx` + `_components/LogoutButton.tsx`
7. `app/admin/login/page.tsx` (client component form)
8. `app/admin/(authed)/page.tsx` (leads list + stat cards)
9. `app/admin/(authed)/leads/[id]/page.tsx` (detail + edit Server Action)
10. `app/admin/(authed)/site-config/page.tsx` (config edit + test email)
11. `app/api/admin/leads/[id]/route.ts` PATCH (TDD)
12. `app/api/admin/site-config/route.ts` PUT (TDD)
13. `app/api/admin/test-email/route.ts` POST (TDD)
14. `app/admin/not-found.tsx`
15. Manual smoke test — full UI flow (curl + browser)

Optionally consolidate 11-13 into one task if the service layer keeps them tiny.

## Files to read first (next AI, in order)

1. **This file.**
2. [`docs/superpowers/specs/2026-05-09-admin-page-design.md`](../specs/2026-05-09-admin-page-design.md) — frozen spec with all 20 decision points
3. [`docs/superpowers/handoffs/2026-05-09-admin-page-phase-1-resume.md`](2026-05-09-admin-page-phase-1-resume.md) — Phase 1 history (skim the "Phase 1 close-out" section at the bottom for final state)
4. [`docs/superpowers/plans/2026-05-09-admin-page-phase-1-foundation.md`](../plans/2026-05-09-admin-page-phase-1-foundation.md) — Phase 1 plan, useful for matching task granularity + commit-message style
5. `apps/web-next/lib/adminSession.ts` — what `requireAdminSession()` does and where it redirects
6. `apps/web-next/lib/origin.ts` — what `requireAdminOrigin()` returns
7. `apps/web-next/proxy.ts` — current gate behaviour
8. `apps/web-next/app/globals.css` — the design system Phase 2 extends
9. `CLAUDE.md` (root) — gotchas, especially #1 (UI build), #4 (no Tailwind in web-next), #9 (pnpm hoisting)

## Snapshot

```
Branch:                feat/admin-page
HEAD:                  c0d42cdb (docs: Phase 1 close-out)
Tag:                   phase-1-foundation
Commits ahead of main: 19
Tests:                 25/25 passing
Lint:                  clean
Typecheck:             clean
DB:                    live in Neon eu-central-1, migrated and seeded
Phase 1:               COMPLETE
Phase 2 plan:          NOT YET WRITTEN — that's the next AI's job
Phase 2 execution:     blocked on plan being written first
```
