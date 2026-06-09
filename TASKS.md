# Post-launch tasks — web-next / admin.itshassan.it

> Pick-up doc. Working branch: **`feat/post-launch-tasks`** (off `main`).
> Last updated: 2026-06-08. Companion to `HANDOVER.md` (deploy history) and
> `apps/web-next/RESEND_SETUP.md` (email).

---

## What's LIVE now ✅

- **`admin.itshassan.it`** → `apps/web-next` **production** on Vercel, backed by the
  **prod** Neon DB. `/admin/login` works; admin reads/writes prod-db (verified).
- **`itshassan.it`** → `apps/docs` portfolio. Overlays phone + contact email
  **live from the admin API** (`/api/site-config`) — verified the value comes
  from prod-db, not the hard-coded fallback.
- Preview deploys of web-next use the **testing** Neon DB.
- DBs are isolated (different Neon hosts) and both migrated + seeded.

## Architecture quick-ref

| Thing | Value |
| --- | --- |
| Vercel team | `hassans-projects-9cc8617f` |
| Vercel project (web-next) | **`admin`** (renamed from `web-next`), ID `prj_1jzlN6SQ98QdFwqhK4QRSBeH8EHQ` → `admin.itshassan.it` |
| Vercel project (docs) | **`laboratoire`** → `itshassan.it` |
| prod DB | Neon `laboratoire-prod-db`, host `ep-delicate-sun-...` → Production env |
| testing DB | Neon `laboratoire-testing-db`, host `ep-shiny-truth-...` → Preview + local |
| Deploy mechanism | **`git push`** (NOT CLI `vercel deploy` — partial upload misses the monorepo `pnpm-lock.yaml`). Non-default branch → Preview; `main` → Production. |

### Deploy gotchas (read before deploying)
- **web-next project Root Directory = `apps/web-next`** (must stay set, else the
  git build reads the root `vercel.json` = docs config and builds the wrong app).
- **docs does NOT auto-promote** to `itshassan.it` — after a production build you
  may need `vercel promote <deployment-url>` (or dashboard → Deployments →
  Promote to Production). See task **T3**.
- Preview deploy URLs are behind Vercel SSO (401 to curl) — open in a browser
  logged into Vercel. Production custom domains are public.
- Windows + Neon: a `Assertion failed ... uv_handle` line after a successful DB
  op is a harmless `@neondatabase/serverless` teardown bug — ignore it.
- There is **no root `tsconfig.json`** (per-app configs only). See task **T4**.
- **Preview env vars are git-branch-scoped.** They were added scoped to specific
  branches (`feat/admin-phase-3-plan`, `feat/post-launch-tasks`) because the
  agent-mode CLI refuses to set "all Preview branches". A NEW branch with no
  preview env → web-next preview build **fails** with `DATABASE_URL is not set`
  (`lib/db/client.ts` throws at module load). Fix per new branch:
  `vercel env add <NAME> preview <branch> --value ... --yes` for the 4 vars, or
  better do **T7** once. Production env is unaffected by this.

## Set up on a new PC

```bash
corepack enable && corepack prepare pnpm@10.0.0 --activate
pnpm -w install --frozen-lockfile
git checkout feat/post-launch-tasks
```

Then recreate the **gitignored** local env files (values are NOT in git — pull
them from the Vercel dashboard env, Neon connection strings, or your password
manager). Use **pooled** Neon connection strings (host ends `-pooler`).

**`apps/web-next/.env.local`** (local dev → testing-db):
```dotenv
DATABASE_URL=<testing-db pooled URL>
ADMIN_EMAIL=hassan.akkari01@gmail.com
ADMIN_PASSWORD=<dev admin password>
ADMIN_SESSION_SECRET=<random ≥32 chars>
PUBLIC_ALLOWED_ORIGINS=https://itshassan.it,http://localhost:5173
ADMIN_ALLOWED_ORIGINS=https://admin.itshassan.it,http://localhost:3001
RESEND_API_KEY=
RESEND_FROM=Hassan <onboarding@resend.dev>
```

**`apps/web-next/.env.prod.local`** (only for migrating/seeding prod-db locally):
```dotenv
DATABASE_URL=<prod-db pooled URL>
ADMIN_EMAIL=hassan.akkari01@gmail.com
ADMIN_PASSWORD=<prod admin password>
ADMIN_SESSION_SECRET=<random ≥32 chars>
```

**`apps/docs/.env.local`** (local dev):
```dotenv
VITE_ADMIN_API_BASE=http://localhost:3001
VITE_CAL_LINK=itshassan/discovery-call
```

Optionally `cd apps/web-next && vercel link` (project `admin`) and
`cd apps/docs && vercel link` (project `laboratoire`) to run Vercel CLI commands.

### Vercel env already set (do NOT need to re-add)
- **`admin` project** — Preview (branch `feat/admin-phase-3-plan`) + Production:
  `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `PUBLIC_ALLOWED_ORIGINS`,
  `ADMIN_ALLOWED_ORIGINS`.
- **`laboratoire` project** — Production: `VITE_ADMIN_API_BASE=https://admin.itshassan.it`,
  `VITE_CAL_LINK=itshassan/discovery-call` (+ pre-existing `VITE_UI_SOURCE`).

---

## TASKS

### T1 — Verify the lead WRITE path  · P1
**Why:** the read path (site-config overlay) works; the write path (the whole
point — capturing leads) is unverified.
**Do:** submit the contact form on `itshassan.it` → confirm it POSTs to
`admin.itshassan.it/api/leads` and the lead shows in `admin.itshassan.it/admin/leads`
(and lands in **prod-db**, not lost).
**Watch:** CORS/Origin. `PUBLIC_ALLOWED_ORIGINS` includes `https://itshassan.it`,
so the browser fetch should pass; a raw curl with no Origin gets 403 (by design).
**Files:** `apps/web-next/app/api/leads/route.ts`, `apps/web-next/lib/origin.ts`,
`apps/docs/src/components/sections/ContactForm.tsx`.
**Done when:** a test lead appears in `/admin/leads` and only in prod-db.

### T2 — Cal.com webhook → leads  · P1 (if using calls)
**Why:** the "Book a call" button works (`VITE_CAL_LINK` set), but Cal bookings
won't become leads until the webhook is wired.
**Do:**
1. Add `CAL_WEBHOOK_SECRET` to the **`admin` project Production** env (random secret).
2. In Cal.com → create a webhook → URL `https://admin.itshassan.it/api/cal/webhook`,
   same secret, on booking-created events.
3. Make a test booking → confirm a lead with `source=cal` appears in `/admin/leads`.
**Files:** `apps/web-next/app/api/cal/webhook/route.ts`,
`apps/web-next/lib/cal/verifySignature.ts`, `apps/web-next/lib/cal/extract.ts`.

### T3 — Fix docs auto-promotion  · P2
**Why:** pushing `main` builds docs but it did NOT auto-promote to `itshassan.it`
(had to `vercel promote` manually) — future docs changes will silently not go live.
**Do:** in Vercel → `laboratoire` project → Settings → Git / Deployment, check for a
"production deployments require manual promotion" or auto-assign-production-domain
setting and align it so `main` pushes auto-promote.
**Workaround until fixed:** `vercel promote <docs-prod-deployment-url>` or dashboard
→ Deployments → ⋯ → Promote to Production.

### T4 — Resolve the Vercel "Typecheck" deployment check  · P3 (cosmetic) · ✅ DONE 2026-06-09
**Why:** the Vercel-managed **Typecheck** check fails with "command failed to
execute" — it runs bare `tsc` at the repo root, but there is **no root
`tsconfig.json`** (per-app configs only). The Lint check passes (root
`eslint.config.mjs` exists). The code itself is clean (`pnpm typecheck` = 4/4).
**Done:** took the **GitHub Action** option — added [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
running `pnpm check` (lint+typecheck+test via Turbo) on every push + PR. Single
`check` job, ubuntu-latest, pnpm 10 via `packageManager` (one pin) + Node 24 from
`.node-version`, `--frozen-lockfile`, pnpm-store + Turbo (`.turbo`) caches, no
secrets needed (web-next tests mock the db client; docs/web-react typecheck use the
UI source alias). Verified `pnpm check` green locally before commit.
**Still TODO (dashboard, you):** now that the GH Action is the real gate, you may
**remove/ignore** the Vercel-managed Typecheck check (Settings → Deployment Checks →
⋯ → Remove) so the cosmetic red ✗ stops showing. Don't add a root `tsconfig.json` —
the 4 apps have divergent TS settings.

### T5 — Resend email (lead notifications)  · P3
**Why:** admin "Send test email" + lead notification emails are off (optional).
**Do:** follow `apps/web-next/RESEND_SETUP.md`. For production also set
`RESEND_API_KEY` (+ keep `RESEND_FROM`) on the `admin` project Production env.
`onboarding@resend.dev` can only send to your own Resend-account email; to send
from `contact@itshassan.it` you must verify `itshassan.it` in Resend (OVH DNS).
Tracked as **F15** in `.claude/_followup.md`.

### T6 — Branch cleanup  · P3
`feat/admin-phase-3-plan` is merged into `main`. Once confident, delete it
(`git branch -d feat/admin-phase-3-plan` + `git push origin --delete feat/admin-phase-3-plan`).
Work continues on `feat/post-launch-tasks`.

### T7 — Make web-next Preview env apply to all branches  · P2
**Why:** the 4 Preview env vars are scoped per git-branch, so every new branch's
preview build fails with `DATABASE_URL is not set` until re-added (see gotcha above).
**Do (dashboard — CLI can't):** Vercel → `admin` project → Settings → Environment
Variables → for each of `DATABASE_URL`, `ADMIN_SESSION_SECRET`,
`PUBLIC_ALLOWED_ORIGINS`, `ADMIN_ALLOWED_ORIGINS` (Preview), edit → set
**All Preview branches** (remove the specific-branch filter). Then new branches
get preview env automatically.

---

## Commands cheat-sheet
```bash
pnpm dev:next          # web-next local (port 3001) → testing-db
pnpm dev:docs          # docs local (port 5173)
pnpm check             # lint + typecheck + test (run before push)
# DB (web-next), uses --env-file:
pnpm -F web-next db:migrate   # against .env.local (testing-db)
pnpm -F web-next db:seed
# prod-db migrate/seed: run tsx with --env-file=.env.prod.local
# Deploy: just `git push` (main = production, other branches = preview)
```
