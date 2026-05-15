# Handoff — Admin Page Phase 1 (resume)

> **RESOLVED 2026-05-09 (later in the evening).** Hassan got Neon Frankfurt access, the migration was generated + applied, the seed ran successfully, and `pnpm check` (lint + typecheck + test) passes end-to-end. **Phase 1 is functionally complete.** Only manual smoke test (curl flow in Task 12) is left, and it's user-runnable. The history below is preserved for archaeology — see the "Phase 1 close-out" section at the bottom for the final state.

**Date:** 2026-05-09 (evening session, paused mid-execution)
**Owner:** Hassan
**Branch:** `feat/admin-page` (off `main`)
**Status:** Phase 1 ~80% complete. 13 commits ahead of `main` (12 code + 1 handoff). 25/25 tests green. Blocked on Neon Frankfurt setup before Tasks 4, 5 (run step), and 12 can finish.

## TL;DR for the next AI

Read this file, then [`docs/superpowers/specs/2026-05-09-admin-page-design.md`](../specs/2026-05-09-admin-page-design.md) and [`docs/superpowers/plans/2026-05-09-admin-page-phase-1-foundation.md`](../plans/2026-05-09-admin-page-phase-1-foundation.md). All non-blocked Phase-1 tasks are done and committed. Resume at "What the next AI should do" near the bottom.

---

## What got done (commits on `feat/admin-page`, oldest first)

```
db53d9b7  chore: ignore .env*.local and admin smoke-test artifacts
0ee56b2f  chore(web-next): add admin deps + @/* path alias
9df88a3f  feat(web-next): drizzle schema for users, leads, site_config
0a8ea0cb  feat(web-next): drizzle config, neon client, db scripts
22038a95  feat(web-next): origin allowlist helpers (lib/origin.ts) with tests
79bdb8d6  feat(web-next): admin session helpers (iron-session) with tests
5acb25be  feat(web-next): /api/admin/login route (TDD)
4dbb41d9  feat(web-next): /api/admin/logout route (TDD)
febfe5dd  feat(web-next): rename middleware.ts -> proxy.ts + admin matcher
2e7dfa2d  chore(web-next): .env.example for phase 1
f2c545b1  feat(web-next): admin user + site_config seed script
cd61ea67  docs(superpowers): admin Phase 1 mid-execution handoff
9ca08efe  chore(web-next): drop deprecated baseUrl from tsconfig
```

Plan task ↔ commit mapping:

| Plan Task | Status | Commit |
|---|---|---|
| (prep) | ✓ | `db53d9b7` (gitignore — see deviation #1) |
| Task 1 — deps + `@/*` alias | ✓ | `0ee56b2f` |
| Task 2 — Drizzle schema | ✓ | `9df88a3f` |
| Task 3 — drizzle config + db client + scripts | ✓ | `0a8ea0cb` |
| Task 4 — `db:generate` + `db:migrate` | **BLOCKED** | (no commit yet — needs Neon DB) |
| Task 5 — seed script | ½ ✓ | `f2c545b1` (file written; **run still pending**) |
| Task 6 — `lib/origin.ts` (TDD) | ✓ | `22038a95` |
| Task 7 — `lib/adminSession.ts` (TDD) | ✓ | `79bdb8d6` |
| Task 8 — `/api/admin/login` (TDD) | ✓ | `5acb25be` |
| Task 9 — `/api/admin/logout` (TDD) | ✓ | `4dbb41d9` |
| Task 10 — `middleware.ts` → `proxy.ts` | ✓ | `febfe5dd` |
| Task 11 — `.env.example` | ✓ | `2e7dfa2d` |
| Task 12 — manual smoke test | **BLOCKED** | needs DB ready |

## Plan deviations (justified, no need to re-litigate)

1. **Pre-flight gitignore fix (commit `db53d9b7`).** Root `.gitignore` did **not** ignore `.env*.local`. Plan only verifies this at Task 11, which is too late if `.env.local` is created earlier. Fixed up-front in a standalone chore commit. Also added `admin-cookie.txt` (used in Task 12 smoke test).
2. **Task 1 — added `vite-tsconfig-paths` (devDep) + `apps/web-next/vitest.config.ts`.** Vitest 3.x does not auto-resolve tsconfig paths. Tasks 8/9 mock via `@/lib/db/client` — would have failed without this. Config is just `defineConfig({ plugins: [tsconfigPaths()] })`.
3. **Task 3 — `db:*` script paths use `../../node_modules/drizzle-kit/bin.cjs`** (plan said `node_modules/drizzle-kit/bin.cjs`). Reason: `.npmrc` sets `node-linker=hoisted` (CLAUDE.md gotcha #9); `drizzle-kit` is **not** present under `apps/web-next/node_modules`, only at repo-root `node_modules`. Relative path walks up two levels. Survives as long as hoisting policy stays in `.npmrc`.
4. **Task 8 — login test fixtures use `a@b.com` (plan said `a@b.c`).** Reason: zod 4.x `z.string().email()` rejects single-char TLDs. The two passing tests in the plan masked this because they used `unknown@x.com`. Two failing tests returned 400 (zod parse fail) instead of 401/200 until I fixed the fixture. No production code change.
5. **Task 5 — seed script uses ASCII log markers (`OK`, `-`) instead of `✔`/`•`.** Windows PowerShell UTF-8 rendering is fragile; ASCII is cosmetic safety. No behaviour change.

All deviations are documented in their commit messages.

## Working tree right now (uncommitted)

```
modified:   apps/web-next/.env.example   ← see "User edits during the session" below
```

Local-only files (gitignored, not in status):

- `apps/web-next/.env.local` — created during the session with placeholders + a pre-generated `ADMIN_SESSION_SECRET`. Two fields still **empty**: `DATABASE_URL=` and `ADMIN_PASSWORD=`.

## User edits during the session

Hassan edited `ADMIN_EMAIL` from `h.akkari@sibyllanetwork.com` (the value in spec/plan) to `hassan.akkari01@gmail.com` in **both** `.env.local` (gitignored, fine) and `.env.example` (tracked, **uncommitted** — appears in `git status`). The next AI should:

- Confirm with Hassan whether the gmail address is intentional. If yes, also update the spec's "Environment variables" example for consistency, and commit the `.env.example` change.
- The seed script reads `ADMIN_EMAIL` from env, so the runtime value will be whatever's in `.env.local`. No code change needed.

## What's blocking everything

Neon project must be in **AWS eu-central-1 (Frankfurt)**. Region is **immutable** after project creation. The first attempt during this session was created in **us-east-1 (Virginia)** by mistake — it was deleted. Hassan started a re-creation via Vercel's Neon integration:

- Selected **Frankfurt — Fra1** in the region picker (confirmed in screenshot).
- Was told to set Custom Prefix to `DATABASE` (so the env var is `DATABASE_URL`, not `STORAGE_URL`).
- Was told to enable Production + Preview environments, leave Development unchecked, and leave "Database branch for deployment" both unchecked.
- **Hassan paused before finishing**: the 2FA token for Neon/Vercel is on another PC he can't access tonight. Therefore: wizard not finalized, `DATABASE_URL` not pasted into `.env.local`, no DB exists yet.

## What Hassan still needs to do (the unblock list)

1. Finish the Vercel-Neon integration wizard (region: **Frankfurt / Fra1 / eu-central-1**, prefix: `DATABASE`, environments: Production + Preview only).
2. Verify the new project's region in Neon Console → Settings (must show `eu-central-1` / Frankfurt).
3. Open `apps/web-next/.env.local` and fill the two empty fields:
   - `DATABASE_URL=` ← paste the **first** (pooled) `DATABASE_URL` from the Neon Console connection details (NOT `*_UNPOOLED`, NOT `POSTGRES_URL`).
   - `ADMIN_PASSWORD=` ← any strong password Hassan picks; he'll only type it on `/admin/login`.
4. (Optional) Decide whether to commit the `.env.example` email change to `hassan.akkari01@gmail.com`.

`ADMIN_SESSION_SECRET` is already pre-generated and present in `.env.local`. No need to regenerate.

## What the next AI should do (after Hassan unblocks)

Pre-conditions before running anything:

- `git status` shows clean (or only the `.env.example` email change).
- `apps/web-next/.env.local` has both `DATABASE_URL` and `ADMIN_PASSWORD` non-empty.
- Hassan confirms region is Frankfurt.

Then execute, in order:

1. **Task 4 step 1** — generate the migration:
   ```powershell
   pnpm -F web-next db:generate
   ```
   Should create `apps/web-next/drizzle/0000_<some-name>.sql` plus `apps/web-next/drizzle/meta/_journal.json` and `apps/web-next/drizzle/meta/0000_snapshot.json`.

2. **Task 4 step 2** — read the generated SQL and confirm it contains:
   - `CREATE TYPE` for `lead_source`, `lead_status`, `booking_status`
   - `CREATE TABLE` for `users`, `leads`, `site_config`
   - `CREATE INDEX leads_created_at_idx`, `leads_status_idx`
   - `CREATE UNIQUE INDEX leads_cal_booking_id_uq … WHERE cal_booking_id IS NOT NULL` (partial unique)
   - `CHECK (id = 1)` constraint on `site_config`

   If anything is missing, go back to `apps/web-next/lib/db/schema.ts` (do **not** hand-edit the SQL — never edit committed migrations).

3. **Task 4 step 3** — apply the migration:
   ```powershell
   pnpm -F web-next db:migrate
   ```
   Sanity check via the Neon SQL editor:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema='public'
   ORDER BY table_name;
   ```
   Expected: `__drizzle_migrations`, `leads`, `site_config`, `users`.

4. **Task 4 step 4** — commit the migration files:
   ```powershell
   git add apps/web-next/drizzle/
   git commit -m "feat(web-next): initial drizzle migration (users, leads, site_config)"
   ```

5. **Task 5 step 2-3** — run the seed and verify:
   ```powershell
   pnpm -F web-next db:seed
   ```
   Expected output (with the ASCII markers — see deviation #5):
   ```
   OK Created admin user hassan.akkari01@gmail.com
   OK Created site_config singleton row
   ```
   Verify in Neon: `SELECT email FROM users;` and `SELECT * FROM site_config;` (one row each).

   Re-running the seed should be idempotent (updates password, skips config insert).

6. **Task 12 — manual smoke test.** Follow the plan's Task 12 verbatim. Summary:
   - `pnpm -F web-next dev` (port 3001).
   - `curl -i -X POST http://localhost:3001/api/admin/login -H "Origin: http://localhost:3001" -H "Content-Type: application/json" --data '{"email":"hassan.akkari01@gmail.com","password":"<wrong>"}'` → 401.
   - Same with `Origin: https://evil.com` → 403.
   - Same with correct password (`-c admin-cookie.txt`) → 200, `Set-Cookie: admin_session=…`.
   - `curl -i http://localhost:3001/admin/leads` (no cookie) → 307 redirect to `/admin/login?next=/admin/leads`.
   - `curl -i -b admin-cookie.txt http://localhost:3001/admin/leads` → 404 (page not built yet — but the proxy let it through; that's the test).
   - `curl -i http://localhost:3001/checkout` → 307 redirect to `/login` (booking demo, **not** admin login).
   - `curl -i -X POST http://localhost:3001/api/admin/logout -H "Origin: http://localhost:3001" -b admin-cookie.txt` → 200, cookie cleared.

7. **Phase 1 done** — optional `git tag phase-1-foundation`. Then green-light to write the Phase 2 plan (admin UI: shell + leads list + lead detail + site-config + test email button).

## Important gotchas surfaced during execution

These are extras on top of the original spec/plan; capture them into CLAUDE.md or the spec only if Hassan agrees they're worth the durable space.

1. **pnpm hoists everything to repo-root `node_modules` on this repo.** Any future per-app script that wants to run a CLI from a workspace devDep will need `../../node_modules/<pkg>/bin.cjs` paths, not relative-to-app paths. Same trap will hit anyone copying the drizzle pattern for ESLint, Prettier, etc.
2. **Vitest needs `vite-tsconfig-paths` to honour tsconfig `paths`.** If we add path aliases anywhere else (or to other apps), don't assume tests will pick them up.
3. **zod 4.x `email()` rejects single-character TLDs.** Heads-up for any future contact-form / API tests using throwaway emails like `a@b.c`.
4. **Vercel's Neon integration defaults the env-var prefix to `STORAGE`.** Always change to `DATABASE` (or empty) so the var name matches our code.
5. **Vercel's Neon region picker shows Vercel codes (`Fra1`, `Iad1`, etc.).** `Fra1` ↔ `aws-eu-central-1` (Frankfurt). Don't be fooled by the "Recommended" badge on US East — it's based on Vercel function location, not user location.

## Files to read first (next AI, in order)

1. **This file.**
2. [`docs/superpowers/specs/2026-05-09-admin-page-design.md`](../specs/2026-05-09-admin-page-design.md) — frozen spec, all decisions.
3. [`docs/superpowers/plans/2026-05-09-admin-page-phase-1-foundation.md`](../plans/2026-05-09-admin-page-phase-1-foundation.md) — original plan; tasks 1, 2, 3, 5 (file), 6, 7, 8, 9, 10, 11 are done. Resume at task 4.
4. `CLAUDE.md` (root) — gotchas, especially #9 (hoisted pnpm).
5. `apps/web-next/proxy.ts` — current state of the gate (Next.js 16 convention).
6. `apps/web-next/lib/adminSession.ts` and `lib/origin.ts` — the auth + CORS modules the Phase 2 admin pages will call into.

## Snapshot

```
Branch:                 feat/admin-page
Commits ahead of main:  13
Tests:                  25/25 passing (origin 6, adminSession 4, login 5, logout 3, + existing session 3, pricing 3, orders 1)
Typecheck:              clean
Lint:                   not run this session — run before Phase 2 starts
Working tree:           apps/web-next/.env.example (modified, ADMIN_EMAIL change)
Local untracked:        apps/web-next/.env.local (gitignored, two empty fields)
Phase 1 progress:       11 of 12 plan tasks done; Task 4 + Task 5 run-step + Task 12 blocked on Neon DB existing in eu-central-1
```

## What's frozen and what's NOT done yet

**Frozen** (Hassan decided, don't re-litigate): see "Decisions explicitly made" in the spec — all 20 numbered points still hold.

**Not done in Phase 1 — these are Phase 2-5 work**:
- `/admin` shell, leads list, lead detail page, site-config edit page (Phase 2).
- `POST /api/leads` public endpoint (Phase 3).
- `GET /api/site-config` public endpoint + `apps/docs` ContactForm wiring + Cal.com embed (Phase 3-4).
- `POST /api/cal/webhook` (Phase 4 — deferrable, Free plan may not expose webhooks).
- Resend wiring + "Send test email" + privacy fields end-to-end (Phase 2-3).
- Deployment README + Vercel project for `apps/web-next` + `admin.itshassan.it` CNAME on OVH (Phase 5).

---

## Phase 1 close-out (2026-05-09, later same evening)

### What changed since the "BLOCKED" snapshot above

Hassan got 2FA access back, completed the Vercel-Neon integration wizard (Frankfurt / Fra1 confirmed by the host `ep-shiny-truth-aljd5o4s-pooler.c-3.eu-central-1.aws.neon.tech`), pasted `DATABASE_URL` and `ADMIN_PASSWORD` into `.env.local`, and disabled the `DEV_NO_DB` escape hatch by commenting out the line.

Then in the same session we ran:

```
pnpm -F web-next db:generate     # → drizzle/0000_solid_robin_chapel.sql
pnpm -F web-next db:migrate      # → applied to Neon, all 3 enums + 3 tables + 3 indexes + check constraint live
pnpm -F web-next db:seed         # → inserted admin user + site_config singleton
pnpm -F web-next lint            # → 0 errors (after dropping an unused eslint-disable)
pnpm -F web-next typecheck       # → clean
pnpm -F web-next test            # → 25/25 green
```

### Additional commits on top of the BLOCKED snapshot

```
9ca08efe  chore(web-next): drop deprecated baseUrl from tsconfig
885e2902  feat(web-next): DEV_NO_DB escape hatch for admin login pre-Neon
a9ff47ae  chore(web-next): document DEV_NO_DB flag in .env.example
1954d2ec  feat(web-next): initial drizzle migration (users, leads, site_config)
d95c7e27  chore(web-next): drop unused no-console eslint-disable on dev warn
```

### Bonus deviation from the original plan: `DEV_NO_DB` escape hatch

Added so we could exercise the auth wiring before Neon was provisioned. When `DEV_NO_DB=1` and `NODE_ENV !== "production"`, the login route compares `ADMIN_EMAIL` + `ADMIN_PASSWORD` directly against env (no bcrypt, no DB) and seals an iron-session cookie as if a real user matched. Logout already worked DB-free.

This branch is now dormant (DEV_NO_DB is commented out in `.env.local`), but the code remains. It's gated tightly enough that it can't activate in production. Phase 5 (deployment) should decide whether to:

- **Keep it** as a permanent escape hatch for future "DB is wedged, let me in" scenarios. Document in CLAUDE.md.
- **Remove it** before merging Phase 1 to main. ~15 lines in `app/api/admin/login/route.ts` + the small extension in `lib/db/client.ts`. Easy `git revert` of `885e2902` if desired, though some later commits touched the same file so a manual edit is cleaner.

Tracked in `_followup.md` (see entry: "DEV_NO_DB cleanup decision before Phase 5 deploy").

### Final state

- DB exists in Neon Frankfurt with three tables, one admin user (`hassan.akkari01@gmail.com`), one site_config row.
- Re-running `db:seed` is idempotent (updates user's password hash, skips config insert).
- `apps/web-next/proxy.ts` gates `/admin/*` and `/api/admin/*` with the `/api/admin/login` carve-out. Booking demo `/checkout` flow untouched, verified.
- 25/25 vitest tests pass (origin 6, adminSession 4, login 5, logout 3, plus pre-existing session 3, pricing 3, orders 1).
- `pnpm check` (lint + typecheck + test) passes cleanly.

### What Hassan still has to do (manual)

**Task 12 — smoke test** (he can do anytime; the rest of Phase 1 is committed):

```powershell
# Wrong password → 401
curl.exe -i -X POST http://localhost:3001/api/admin/login `
  -H "Origin: http://localhost:3001" `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"hassan.akkari01@gmail.com\",\"password\":\"wrong\"}'

# Foreign origin → 403
curl.exe -i -X POST http://localhost:3001/api/admin/login `
  -H "Origin: https://evil.com" `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"hassan.akkari01@gmail.com\",\"password\":\"whatever\"}'

# Right password → 200 + Set-Cookie admin_session
curl.exe -i -X POST http://localhost:3001/api/admin/login `
  -H "Origin: http://localhost:3001" `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"hassan.akkari01@gmail.com\",\"password\":\"somalia17\"}' `
  -c admin-cookie.txt

# Hit /admin/leads with cookie → 404 (page not built yet — Phase 2)
curl.exe -i -b admin-cookie.txt http://localhost:3001/admin/leads

# Logout → 200, cookie cleared
curl.exe -i -X POST http://localhost:3001/api/admin/logout `
  -H "Origin: http://localhost:3001" `
  -b admin-cookie.txt -c admin-cookie.txt
```

(Dev server must be running: `pnpm dev:next` on port 3001. Must be restarted after the env-var changes from BLOCKED → close-out, since Next.js dev mode caches env at startup.)

### What's next

- **Phase 2 plan** is the next thing to write. Scope: `/admin` shell (nav + logout button), leads list with stat cards + filters, `/admin/leads/[id]` detail page, `/admin/site-config` edit page with "Send test email" button. This pulls in `lib/email.ts` (Resend) since the test-email button needs it. Privacy version env wiring also happens here.

- Once Phase 2 plan is written, the next AI invokes `superpowers:executing-plans` (or `subagent-driven-development`) and resumes the same loop.
