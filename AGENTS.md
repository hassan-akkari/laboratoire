# AGENTS.md - laboratoire

Operating instructions for any coding agent (Codex, Claude, other). Short and
operational: the *what/why* of the system lives elsewhere.

## Session bootstrap (do this first)

1. Read `docs/PROJECT_BRAIN.md` — current snapshot of apps, capabilities, deploys, security boundaries.
2. Read `docs/DECISIONS.md` — why the architecture is the way it is. Append-only; never rewrite entries.
3. Check the real repo state (`git status`, `git log --oneline -5`, the actual code). **Documentation is not automatically up to date — the repository is the source of truth.** If code contradicts a doc, trust the code and flag the drift.
4. After any architectural change (new app/package, deploy change, schema change, auth change), update `docs/PROJECT_BRAIN.md` in the same PR; add a `docs/DECISIONS.md` entry only if the decision is architecturally important.
5. Preserve critical flows and security boundaries (see below) — never break them silently.

Session modes Hassan uses: `STATUS`, `IDEA: …` (analysis only, no code), `BUILD: …` (end-to-end vertical slice + gates), `IMPROVE`, `HANDOFF`.

## Project Shape

- Pnpm + Turbo monorepo. Node `>=24 <25`; pnpm `10.0.0`.
- Workspaces (details + maturity in PROJECT_BRAIN):
  - `apps/docs`: live portfolio + digital garden. **Next.js 16 App Router**, SSG, 4 locales `en/it/fr/de`. Deployed: Vercel project `laboratoire` → itshassan.it (root `vercel.json`).
  - `apps/web-next`: **deployed** admin/lead-management (Drizzle + Neon, iron-session) on Vercel project `admin` → admin.itshassan.it, plus a parked in-memory booking demo under `app/(booking-demo)/`.
  - `apps/booking-service`: "Bookable" booking-request MVP (Next + Drizzle + Neon `booking_` prefix + vendored shadcn). Own `vercel.json`.
  - `apps/control-centre`: local-only QoL dashboard (port 3002 — collides with booking-service). No deploy by design.
  - `apps/web-react`: local Vite/RTK-Query/MSW scaffold demo.
  - `apps/lab`: local `@laboratoire/ui` playground.
  - `packages/ui`: shared presentational UI (`@laboratoire/ui`), Storybook, HeroUI v2+v3 coexistence.
- OVH is registrar/DNS only. CI: `.github/workflows/ci.yml` runs `pnpm check` on every push.

## Commands

Run from the repo root unless a package-specific command is clearer.

```bash
pnpm dev            # docs
pnpm dev:docs | dev:react | dev:next | dev:lab | dev:centre | dev:booking
pnpm dev:all

pnpm lint | typecheck | test
pnpm check          # all three — run before claiming a broad change complete

pnpm build
pnpm -F @laboratoire/ui build       # required before app prod builds
pnpm -F @laboratoire/ui storybook
pnpm -F docs vault:sync -- --vault "<path>"   # garden publish (manual, by design)
```

Prefer the narrowest useful gate while developing, then `pnpm check` before
push. For deploy-sensitive or shared-library changes, also run `pnpm build`.

## Critical flows & security boundaries (never break silently)

- **Three separate auth systems** — web-next `admin_session` (iron-session), web-next booking-demo sentinel cookie, booking-service admin session. Do NOT merge or share them without an explicit human decision.
- **Cal.com webhook** is HMAC-gated (`CAL_WEBHOOK_SECRET`), deliberately outside the proxy matcher. Keep raw-body signature verification intact.
- **Admin API chain**: Origin check → session check → zod validation, on every admin route. Keep it.
- **Garden privacy**: only `publish: true` vault notes may reach `notes.json`. The repo is public.
- **Shared Neon DB**: web-next (unprefixed tables) + booking-service (`booking_` prefix) share the same databases. Migrations only (`db:migrate`); never `db:push`; never apply migrations or seeds without asking.
- **Lead capture**: DB write is the source of truth; email (Resend) failure must never block or throw.
- Never read/print values from `.env*` files; variable names only.

## Editing Rules

- Preserve the user's uncommitted work. Inspect before editing; never revert unrelated changes.
- Keep edits scoped to the relevant workspace. App-specific code stays in the app; promote to `packages/*` when there are multiple real consumers or a core contract — a default, not a law. Exception: duplicated **security-boundary code** (auth, sessions, validation) already warrants convergence at two copies — compare, realign, test-cover first; share only after that comparison.
- Use existing patterns before adding new abstractions. Prefer complete vertical slices over horizontal refactors.
- Do not edit `pnpm-lock.yaml` by hand; lockfile changes ride in the same commit as the dep change.
- Atomic commits: one task = one commit; out-of-scope findings go to `.claude/_followup.md`, not into the current PR.
- Deploy-sensitive files (`vercel.json`, root scripts, turbo config, proxies, drizzle schema/migrations) are production-sensitive: explain behavioral impact and rollback.
- `apps/docs`: keep all 4 locales (`en/it/fr/de`) in sync for content/messages; DE is Swiss (ss, Sie, no ß). Notes canonicalize on `/en` — don't add per-locale note sitemap entries.
- `apps/web-next` booking code: update zod schemas and colocated tests with any input change; use `roundCurrency()`-style helpers, no ad-hoc float math.
- Keep `packages/ui` presentational: no app state, routers, env vars, or app-only deps. New heroui wrappers follow `App<Name>.tsx` + a Storybook story.
- `pnpm.onlyBuiltDependencies` is restricted — extend it deliberately via pnpm when adding native/postinstall deps.

## Known gotchas

- Prod builds of ui-consuming apps need `packages/ui/dist` (`pnpm -F @laboratoire/ui build`); Next apps handle it via `prebuild`, Vite apps can use `VITE_UI_SOURCE=1` in dev.
- `.npmrc`: `node-linker=hoisted`, `child-concurrency=1`, frozen lockfile. Windows: NTFS only.
- After moving/renaming Next routes, clear the app's `.next` before trusting a local `pnpm check`.
- pnpm 10 forwards a literal `--` to scripts (vault-sync handles it).
- `apps/web-next` in-memory orders + sentinel cookie are MVP-ONLY, confined to the booking demo.

## Source of truth ladder

1. Code and repo state.
2. `docs/PROJECT_BRAIN.md` (snapshot) + `docs/DECISIONS.md` (why).
3. This file (how to work).
4. `.claude/CLAUDE.md`, `README.md` — richer but **known-stale in parts** (pre-DB web-next, missing control-centre/booking-service detail); trust PROJECT_BRAIN over them until the next `bootstrap full`.
5. `.claude/_followup.md` — the tech-debt radar; add entries instead of scope-creeping.
