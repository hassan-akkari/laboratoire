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

### F12 — Personal admin/booking page (manage availability + appointments)

- **Where**: net-new feature. Likely candidate path: a separate route in `apps/docs` (e.g. `/admin`) gated by auth, OR a new app entirely depending on auth complexity.
- **What's needed**: authenticated dashboard where Hassan can (1) edit weekly availability windows, (2) see incoming intro-call / audit requests, (3) manage booked slots, (4) maybe push status to public hero ("disponibile / in slot pieni").
- **Why not in scope now**: the conversion-pitch sprint (homepage + hero + audit linkage) is a separate concern — this is post-launch infrastructure once leads start arriving. Build vs buy still open: Cal.com / Calendly OAuth integration may be cheaper than custom for phase 1.
- **Suggested approach**: log a small RFC weighing (a) Cal.com embed + iframe widget, (b) custom build leveraging the existing `apps/web-next` booking infra (in-memory store needs to become persistent — see Gotcha #6 in CLAUDE.md), (c) hybrid (Cal.com for booking, custom dashboard for slot rules). Decision needed before commit-time. Until then, hero/final-CTA links keep pointing to WhatsApp + email (zero infrastructure).
- **Dependencies**: real auth (out of MVP-only cookie session in web-next), persistent storage (out of `globalThis` order store), maybe Stripe if intro calls become paid in future. None of these are urgent until inbound flow is real.

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
