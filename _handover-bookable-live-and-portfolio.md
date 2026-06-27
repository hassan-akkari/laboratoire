# Handover — Bookable is live; integrate it into the `docs` portfolio

_Created 2026-06-27. For the next session. Read this first, then act._

---

## TL;DR

`apps/booking-service` (**Bookable — Multi-Style Booking Platform**) is now a **real, deployed, full-stack app**:

- **Live:** https://bookable.itshassan.it (Vercel project `bookable`, custom domain + SSL valid)
- **Stack:** Next.js 16 App Router, Drizzle ORM + Neon Postgres, iron-session + bcrypt auth, Zod, shadcn/ui, framer-motion
- **Signature feature:** runtime 3-style switcher (Editorial / Warm / Bold) — same content, three full design systems
- **Docs written:** `apps/booking-service/README.md` + `apps/booking-service/PORTFOLIO_CASE_STUDY.md`

**The portfolio (`apps/docs`) does NOT yet reflect this.** Its "Featured projects" section still describes the old in-memory `web-next` booking prototype and calls the projects "two mini side projects." That copy is now stale. **The main next job is updating `docs` to showcase the live Bookable app.**

---

## What is DONE (don't redo)

- ✅ `apps/booking-service` built, deployed to Vercel (project `bookable`, team `hassan's projects`, Hobby plan).
- ✅ Custom Vercel config: `apps/booking-service/vercel.json` (`framework: nextjs`, `outputDirectory: .next`). Needed because the **root `vercel.json` is docs/vite-only** and was hijacking the booking-service build. Root Directory in the Vercel project = `apps/booking-service`.
- ✅ Prod Neon DB **migrated** (`db:migrate`) and **seeded** (`db:seed`): admin user `hassan.akkari@icloud.com`, settings singleton, 4 demo services.
- ✅ 4 prod env vars set in Vercel (Production scope): `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
- ✅ Domain: OVH DNS zone `itshassan.it` → CNAME `bookable` → `14d9db35d6d1b69e.vercel-dns-017.com.` → Vercel SSL valid. Verified `https://bookable.itshassan.it` returns 200 on `/`, `/services`, `/admin/login`, `/book/classic-haircut`.
- ✅ Presentation polish shipped earlier: route `loading.tsx` skeletons, `error.tsx` boundaries, a site-wide demo-mode banner (`components/DemoModeBanner.tsx`, shows only when `!dbReady`).

---

## ⚠️ CRITICAL gotchas (read before touching anything)

1. **NEVER run `db:push` on this Neon DB. Use `db:migrate`.** The DB is **shared** with a sibling project (tables `users`, `leads`, `site_config` from web-next). `db:push` reconciles the DB to booking-service's schema and **drops every table it doesn't know about** — it tried to `DROP TABLE users/leads/site_config CASCADE` and was only stopped by the non-TTY prompt. The migrations (`drizzle/0000-0002.sql`) only `CREATE booking_*` tables, so `db:migrate` is safe and additive. README has been corrected to say this.

2. **`ADMIN_SESSION_SECRET` was leaked in chat** (the value `33e128...` was printed by the assistant during setup). **Action item:** generate a fresh one (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`), update it in Vercel, redeploy. Until rotated, treat it as compromised. _(Confirm whether the user already rotated it.)_

3. **In production the login uses ONLY the DB hash**, not `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars. Those two env vars only feed the dev-only no-DB escape hatch (`app/admin/login/actions.ts:65`, gated on `!dbReady && NODE_ENV !== "production"`). To change the prod admin password: re-run `db:seed` with the new `ADMIN_PASSWORD` in `.env.local` (it upserts the hash). No redeploy needed for that.

4. **Never give the assistant the prod `DATABASE_URL`.** The user keeps prod credentials private and runs prod `db:migrate`/`db:seed` themselves. The assistant can only run DB commands against the **testing** DB in `.env.local` (and only with explicit confirmation — the sandbox blocks remote-DB writes by default).

5. **Git push is gated.** The remote push URL had been set to `DISABLED_no_push` (now restored to `https://github.com/Dark-lIl-Demon/laboratoire.git`). Direct pushes to `main` require explicit user confirmation each time (the auto-mode classifier blocks them otherwise). Repo: `Dark-lIl-Demon/laboratoire`.

6. **Local DNS is unreliable** on the user's network — the TIM router rewrites lookups with a `.homenet.telecomitalia.it` suffix. Don't trust `nslookup` from here; verify domains with `curl -I` instead (it resolves + connects for real).

---

## OPEN — git

- **One unpushed commit on `main`:** `290e92ad` — `docs(booking-service): warn against db:push on shared DB`. Two earlier `vercel.json` commits are already pushed. **Next session: push `290e92ad` (with user confirmation).** Working tree is otherwise clean.

---

## NEXT JOB — update `apps/docs` to showcase Bookable

The whole point of going live: the portfolio can now link a **real, deployed** full-stack app instead of "side projects."

### Where the content lives
- **i18n strings:** `apps/docs/src/i18n/messages.ts` (en/it/fr). The "Featured projects" section heading + intro live here. Current intro (stale): _"Two mini side projects I build in my spare time…"_ / _"Due mini progetti personali…"_ — **rewrite**: Bookable is a production-grade full-stack app, not a spare-time experiment.
- **Project cards:** `apps/docs/public/data/portfolio-content.json` (+ `.it.json` + `.fr.json` — **keep all three locales in sync**, this is a hard project rule). Each project = `{ title, summary, stack[], impact[], links: [{ label, href, kind }] }` where `kind` ∈ `live | caseStudy | github`.

### The specific edit
- `portfolio-content.json` already has a **"Next.js Booking and Checkout Engine"** entry (~line 203) — that's the **old web-next prototype**. Decide with the user: **replace it** with the live Bookable entry, or add Bookable as a new card and retire the old one. Recommended: replace, since Bookable supersedes it.
- New Bookable card should have:
  - `title`: "Bookable — Multi-Style Booking Platform"
  - `summary`: lead with the runtime 3-style design system (the differentiator) + full-stack (Next 16 / Drizzle / Neon / auth).
  - `stack`: Next.js 16, React 19, Drizzle ORM, Neon Postgres, iron-session, Zod, shadcn/ui, Tailwind v4, framer-motion
  - `links`: **live → https://bookable.itshassan.it** (`kind: "live"`), and a case-study link (the `PORTFOLIO_CASE_STUDY.md` content, or `#contact`), optionally GitHub.
  - Source copy for summary/impact/bullets is ready in `apps/booking-service/PORTFOLIO_CASE_STUDY.md` (overview, CV/Upwork bullets) — translate to it/fr for the other two JSONs.
- Update the section intro in `messages.ts` (all 3 locales) away from "two mini side projects."

### Don't forget
- `pnpm -F docs build` needs `packages/ui/dist` (run `pnpm -F @laboratoire/ui build` first) or `VITE_UI_SOURCE=1`. Dev mode auto-uses source.
- After editing `docs`, the deploy is automatic: pushing `main` triggers the **`laboratoire`** Vercel project (the one on `itshassan.it`), separate from `bookable`.

---

## Other things we can do (menu for the user — not committed to)

- **Screenshots** for the case study (checklist in `PORTFOLIO_CASE_STUDY.md`). Capture against the seeded prod DB so no demo banner shows. The README has a `docs/screenshots/` placeholder table to fill.
- **Rotate `ADMIN_SESSION_SECRET`** (see gotcha #2) — quick security hygiene.
- **Clean up Preview-scope env vars:** `ADMIN_EMAIL`/`ADMIN_PASSWORD` are set on "Production and Preview" but `DATABASE_URL`/`ADMIN_SESSION_SECRET` only on Production — Preview deploys would half-break. Either add all 4 to Preview or none.
- **Tier-2 product depth** (from the original audit, only if the user wants real features, not just presentation): availability/time-slot engine (the honest gap — it's a request system, not a scheduler), customer accounts, email notifications, login rate-limiting/CSRF, pagination on the bookings table.
- **Fix the minor Vercel build warning:** `Both outputFileTracingRoot and turbopack.root are set` — harmless, comes from `next.config.ts` setting `turbopack.root`. Align them or drop the turbopack.root pin if it stops being needed.
- **Stale repo CLAUDE.md:** the root `.claude/CLAUDE.md` still describes `web-next` as the booking app and never mentions `booking-service`. Worth updating so future sessions/AI don't get misled (the `booking-service` is the real flagship now).

---

## Quick verify the live app still works (next session)

```bash
for p in / /services /admin/login /book/classic-haircut; do
  echo "$p → $(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 https://bookable.itshassan.it$p)"
done
# expect 200 on all
```

Login at https://bookable.itshassan.it/admin/login with `hassan.akkari@icloud.com` + the seeded password.
