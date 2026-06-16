# Vercel env vars — what goes where

> Which env var belongs to which Vercel project + scope. Reference so secrets stop
> landing on the wrong project. **No values in this file** (safe to be public).
> Companion to `TASKS.md` (tasks) and `HANDOVER.md` (deploy history).
> Last verified: 2026-06-16 via `vercel env ls`.

## Rule of thumb

- **`VITE_*`** → **`laboratoire`** project (docs / `itshassan.it`). Build-time, baked
  into the static bundle, **not secret**.
- **Everything server-side** (DB, sessions, secrets, webhooks, email) →
  **`admin`** project (web-next / `admin.itshassan.it`). Read at runtime.
- A var only takes effect on **deployments built after it was added** — adding/
  editing an env var does **not** update the already-running deployment. Redeploy
  (`git push` to the relevant branch, or `vercel redeploy <url>`) to apply.

## Project: `admin`  (web-next → `admin.itshassan.it`)

ID `prj_1jzlN6SQ98QdFwqhK4QRSBeH8EHQ` · team `hassans-projects-9cc8617f` · Root Dir `apps/web-next`

| Var | Production | Preview | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | ✅ | ⚠️ branch-scoped | prod=prod-db, preview=testing-db. **Preview only on specific branches** (T7). |
| `ADMIN_SESSION_SECRET` | ✅ | ⚠️ branch-scoped | ≥32 chars. |
| `PUBLIC_ALLOWED_ORIGINS` | ✅ | ⚠️ branch-scoped | `https://itshassan.it,http://localhost:5173` |
| `ADMIN_ALLOWED_ORIGINS` | ✅ | ⚠️ branch-scoped | `https://admin.itshassan.it,http://localhost:3001` |
| `CAL_WEBHOOK_SECRET` | ✅ (added 2026-06-16) | — | **Must equal the Cal.com webhook secret.** Read in `app/api/cal/webhook/route.ts`. |
| `RESEND_API_KEY` | ❌ not set | — | optional — lead-notification email (T5). |
| `RESEND_FROM` | ❌ not set | — | optional, with `RESEND_API_KEY`. |
| `PRIVACY_VERSION` | ❌ not set | — | optional; code defaults to `v1-2026-05`. |

⚠️ **Preview = branch-scoped (T7).** The 4 core vars are attached to
`feat/post-launch-tasks` + `feat/admin-phase-3-plan` only → a **new** branch's
preview build fails (`DATABASE_URL is not set`). Fix once: dashboard → each var
(Preview) → set **All Preview branches**.

## Project: `laboratoire`  (docs → `itshassan.it`)

Root Dir = repo root (builds `apps/docs`).

| Var | Scope | Value |
| --- | --- | --- |
| `VITE_ADMIN_API_BASE` | Production | `https://admin.itshassan.it` |
| `VITE_CAL_LINK` | Production | `itshassan/discovery-call` |
| `VITE_UI_SOURCE` | Production | pre-existing (UI source/dist gate) |

🧹 **Cleanup:** a stray `CAL_WEBHOOK_SECRET` was added here by mistake (2026-06-10).
Nothing on docs reads it — **delete it** to avoid confusion. The real one lives on
`admin` (above).

## Add a var via CLI (app must be linked)

```powershell
# link once per app dir (writes gitignored .vercel/)
npx vercel@latest link --yes --scope hassans-projects-9cc8617f --project admin --cwd apps/web-next
npx vercel@latest link --yes --scope hassans-projects-9cc8617f --project laboratoire --cwd apps/docs

# list names (no values)
npx vercel@latest env ls --cwd apps/web-next

# add (prompts for value; or pipe via stdin)
npx vercel@latest env add CAL_WEBHOOK_SECRET production --cwd apps/web-next
```

## Cal webhook — final check

Secret is live on `admin` Production (probe returns 401 to unsigned requests = good).
**Only a real test booking confirms the value matches Cal.com:** book on
`itshassan.it` → expect a lead `source=cal` in `admin.itshassan.it/admin/leads`
(prod-db). If it does **not** appear, the `admin` secret ≠ the Cal.com webhook
secret → regenerate one value and set it identically in **both** places.
