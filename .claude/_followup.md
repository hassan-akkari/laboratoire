# Follow-up — observations collected outside this PR's scope

> Created during `chore: deploy topology cleanup` (branch `chore/deploy-topology-cleanup`). Smells noted but **not** fixed here, per the brief's "no scope creep" rule. Each entry has enough evidence and a suggested next step.

## Open decision points (asked back to the human)

| ID | Topic | Status |
|---|---|---|
| **D1** | Fate of `apps/web-next` (WIP / smoke-test / abandoned) | **Answered 2026-05-07**: WIP framework-showcase prototype. Will eventually be linked from the portfolio (route/subdomain/external — TBD). No urgency. |
| **D2** | OVH topology — what runs there, service type, deploy mechanism | **Answered 2026-05-07**: OVH is registrar/DNS only for the portfolio domain — points at Vercel. **No OVH compute in scope.** Original premise of "OVH as deploy target for web-react/web-next" was wrong; corrected in CLAUDE.md. |
| **D3** | Values for the `<DATE>` and `<ISSUE>` placeholders in the new MVP guard comments | **Resolved 2026-05-07**: no issue tracker / no deadline. Placeholders removed; comment reads `MVP-ONLY — replace before going live with real users`. |

D1/D2 closed. P2 (`apps/web-next` build-only path) is no longer blocked — but also no longer urgent, since web-next has no production target. Defer until hosting strategy is decided.

---

## Doc / repo cleanup pairs left dangling

These are direct consequences of work in this PR. Resolve in a small follow-up so the codebase stays coherent.

### F1 — `README.md` still references the deleted GH Pages workflow ✅ RESOLVED 2026-05-07

- **Was**: `README.md` "Deploy GitHub Pages" section referencing `deploy-user-site.yml`, `GH_PAGES_TOKEN`, target external repo.
- **Fix applied**: section rewritten to describe the actual topology (Vercel for `docs`, OVH for DNS only, no deploy for `web-react`/`web-next`). "Stato attuale" block also updated.

### F2 — `apps/web-react/vite.config.ts` dead `@laboratoire/ui` alias ✅ RESOLVED 2026-05-07

- **Was**: build-time alias resolving `@laboratoire/ui` to `packages/ui/src` or `packages/ui/dist/index.js`, plus the `existsSync` guard, despite `web-react` never importing the package.
- **Fix applied**: `apps/web-react/vite.config.ts` simplified — removed the alias block, the source/dist toggle, the existsSync guard, the unused `loadEnv`/`existsSync`/`path` imports, and the dangling `// const isPages = …` comment. Kept `base: "/react/"`, the React plugin, and the Tailwind PostCSS plugin.

### F3 — `_bootstrap-report.md` is a frozen snapshot mentioning the removed workflow

- **Where**: `.claude/_bootstrap-report.md:11` lists `deploy-user-site.yml` among inspected configs.
- **Why not fixed**: it's an analysis trail / point-in-time artifact. Updating it would falsify history.
- **Suggested approach**: leave as-is. If / when the next bootstrap pass runs, it will produce a fresh snapshot.

---

## Latent smells noticed but out of scope

### F4 — `apps/web-react` has no `tailwind.config.ts`

- **Where**: `apps/web-react/` (compare to `apps/docs/tailwind.config.ts`).
- **Behavior**: Tailwind v4's postcss plugin still runs, but content scanning is implicit and may miss class usage. Already noted in `CLAUDE.md` Gotcha #3 (originally Gotcha #3 pre-cleanup).
- **Suggested fix**: either add an explicit config file mirroring `apps/docs/tailwind.config.ts`, or drop Tailwind from web-react if not actively used. Decide as part of the broader web-react audit.

### F5 — Three Tailwind setups with drifting design tokens

- **Where**: `apps/docs/src/index.css:14-49`, `apps/web-react/src/index.css:14-33`, `apps/web-next/app/globals.css`.
- **Behavior**: dark/light token values diverge across apps. Already noted in `CLAUDE.md` Gotchas (now #3).
- **Suggested fix**: consolidate canonical tokens in `packages/ui` (CSS variables exposed via a `theme.css` exported from the package) and have each app import them. Bigger refactor; needs design alignment.

### F6 — Free-form commit-message convention, no linter

- **Where**: history mixes `feat:`/`fix:`/`chore:` with one-word commits like `gg`, `sb`, `last updates`.
- **Behavior**: no enforcement. Already documented in `CLAUDE.md` Conventions.
- **Suggested fix**: add `commitlint` + `husky` if semantic versioning becomes a goal. Otherwise leave it.

### F7 — `pnpm` 11.0.8 is available; lockfile pinned to 10.0.0

- **Where**: install output during P0.1 surfaced an upgrade banner. `package.json#packageManager` and `.node-version` still target 10.x.
- **Suggested fix**: planned bump in a separate PR — coordinate with all devs on the team since `packageManager` is enforced.

### F8 — No pre-commit hooks (lint/typecheck/test)

- **Where**: no `.husky/`, no `lint-staged` config.
- **Behavior**: `pnpm check` only runs in CI (or when a human remembers locally).
- **Suggested fix**: small `husky` + `lint-staged` setup that runs `eslint --fix` and `tsc --noEmit` on changed files. Won't catch tests but covers most regressions.

### F9 — Zero React-component tests

- **Where**: every test under `apps/*` and `packages/ui` is a Zod-schema or pure-function test. No `@testing-library/react`, no Playwright.
- **Suggested fix**: introduce RTL for the `apps/web-next/app/checkout/` flow first (where the real risk lives — payment + idempotency). Pair with the booking-engine-author agent in `AGENTS.md`.

### F10 — Two SPA `index.html → 404.html` copy variants (legacy from GH Pages)

- **Where**: `apps/docs/package.json:8` (inline) and `apps/web-react/package.json:9-10` (postbuild hook).
- **Behavior**: vestigial — Vercel handles SPA routing natively. Harmless but pointless.
- **Suggested fix**: remove both copy steps once it's confirmed nothing relies on `404.html` for SPA fallback in the new topology. Trivial diff.

### F11 — Deprecated `baseUrl` in `apps/docs/tsconfig.app.json` ✅ RESOLVED 2026-05-08

- **Was**: `apps/docs/tsconfig.app.json:10` — `"baseUrl": "."`. TS 5.x emitted `Option 'baseUrl' is deprecated and will stop functioning in TypeScript 7.0`.
- **Fix applied**: dropped the `baseUrl` line. The single `paths` entry is now resolved relative to the tsconfig file (default behaviour since TS 5.x). Verified `@laboratoire/ui` import still resolves at type-check (Vite alias in `apps/docs/vite.config.ts:25-27` already handles runtime resolution independently).

### F12 — Personal admin/booking page (manage availability + appointments) — DIRECTION DECIDED 2026-05-08

- **Where**: net-new feature. Hybrid layout: Cal.com handles booking infra; a thin custom surface inside `apps/docs` (or a new `/admin` route gated by auth) handles whatever Cal.com doesn't cover.
- **What's needed**: (1) bookable calendar with Hassan's availability windows, (2) incoming-call inbox visible to Hassan, (3) optional dashboard for lead-source attribution + quick actions, (4) maybe a status pill on the public hero ("disponibile / in slot pieni").
- **Decision**: hybrid with Cal.com Free tier. Free tier covers everything needed for a solo freelancer:
  - 1 user, unlimited event types and calendars
  - Email + SMS notifications, 100+ integrations (Google/Outlook Calendar, Slack)
  - Stripe + PayPal payment acceptance (future-proof for paid intro calls)
  - Webhooks (the hook for any custom logic on booking events)
  - 1-click Calendly import (easy migration if a Calendly account already exists)
- **Concrete plan when this gets built**:
  1. Create a Cal.com event type for "Free 20-min intro call" + one for "Audit follow-up" (post-audit upsell flow).
  2. Embed the Cal.com inline widget on the `/audit` follow-up step ("Vuoi una call dopo aver letto il report?") and as a third option in `FinalCTASection` next to WhatsApp + email.
  3. Wire a Cal.com webhook to a Vercel Function in `apps/web-next` (or a new `apps/admin` if scope grows) that (a) logs booking events to a persistent store, (b) optionally pings Hassan via Slack/Telegram, (c) updates a lightweight "current slot status" feed the public hero can read.
  4. Build the admin dashboard (auth-gated) only when Cal.com's own admin UI proves insufficient — likely never for phase 1.
- **Dependencies for the custom side**: persistent store (replace MVP-only `globalThis.__bookingOrderStore__`), real auth (replace MVP-only cookie session). Both already flagged as MVP guards in web-next; neither is urgent until inbound flow is real.
- **Why still deferred**: the conversion-pitch sprint must ship first. Cal.com itself can be set up in 30 min independently — the integration into the site (embed + webhook) is the real work.

### F13 — Tailwind v4 canonical CSS variable syntax sweep

- **Where**: 79 occurrences of `[var(--app-*)]` across 11 files in `apps/docs/src/` (HeroSection, AuditPage, ServicesSection, CaseStudiesSection, ProcessSection, FAQSection, FinalCTASection, ProblemsSection, TargetClientsSection, TechStackSection, WhyMeSection).
- **Behavior**: Tailwind v4 prefers the shorter `text-(--app-muted)` syntax over `text-[var(--app-muted)]`. tsserver/eslint surface a `suggestCanonicalClasses` warning on every occurrence. Builds and runtime are unaffected.
- **Suggested fix**: one-shot regex sweep (`[var\(--([\w-]+)\)\]` → `(--$1)`) across the 11 files, in a single chore commit. Trivial diff but touches a lot of lines — keep it isolated from feature commits to make review tractable.
- **Why not now**: pure stylistic refactor, zero functional impact. Should not be bundled with feature commits per atomic-commit discipline.

---

## How to consume this file

- Pick one or two entries, open a small focused PR for each.
- Update `CLAUDE.md` if the change is structural (per the agentic-doc-as-code rule).
- Move resolved entries to a `_followup-archive.md` rather than deleting, so the trail is preserved.
