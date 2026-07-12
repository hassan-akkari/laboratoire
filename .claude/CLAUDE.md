# CLAUDE.md — laboratoire

> Canonical instructions for any AI/human contributor on this repo. Generated 2026-05-07. See `_bootstrap-report.md` for analysis trail.

## Overview

Pnpm + Turbo monorepo with several frontend apps and one shared UI library. Used as a personal lab and showcase: a portfolio site (`docs`, **Next.js 16 App Router** — migrated from Vite/React Router for SEO), a Redux/MSW reference app (`web-react`), a Next.js booking/checkout MVP (`web-next`), plus `lab` and `booking-service`. UI primitives live in `packages/ui` and are consumed via `@laboratoire/ui`.

## Tech Stack (exact installed versions)

Source: `pnpm-lock.yaml` (cross-checked against `package.json` ranges).

| Layer                     | Tool                                  | Version                             |
| ------------------------- | ------------------------------------- | ----------------------------------- |
| Runtime                   | Node                                  | `>=24 <25` (`.node-version` = `24`) |
| Package manager           | pnpm                                  | `10.0.0` (`packageManager` field)   |
| Monorepo                  | Turbo                                 | `2.8.1`                             |
| UI                        | React / React-DOM                     | `19.2.4`                            |
| Bundler (web-react)       | Vite + `@vitejs/plugin-react`         | `7.3.1` / `5.1.2`                   |
| Framework (docs, web-next) | Next.js                              | `16.1.6` (App Router)               |
| Language                  | TypeScript                            | `5.9.3`                             |
| CSS                       | Tailwind + `@tailwindcss/postcss`     | `4.1.18`                            |
| Components                | `@heroui/react` / `@heroui/theme`     | `2.8.8` / `2.4.26`                  |
| State                     | `@reduxjs/toolkit` / `react-redux`    | `2.11.2` / `9.2.0`                  |
| Routing (SPA)             | `react-router-dom`                    | `7.13.0`                            |
| Animation                 | `framer-motion`                       | `12.29.2`                           |
| Validation                | `zod`                                 | `4.3.6`                             |
| Mocks                     | `msw`                                 | `2.12.7` (web-react only)           |
| Testing                   | `vitest`                              | `3.2.4`                             |
| Linting                   | `eslint` / `typescript-eslint`        | `9.39.2` / `8.54.0`                 |
| Stories                   | `storybook` / `@storybook/react-vite` | `10.2.4` (packages/ui)              |
| Headless                  | `@headlessui/react`                   | `2.2.9`                             |

## Architecture

```mermaid
graph TD
  ui[packages/ui<br/>@laboratoire/ui<br/>HeroUI wrappers + Theme]
  docs[apps/docs<br/>Next.js 16 App Router<br/>SSG · locale routes /it /en /fr<br/>i18n: en/it/fr]
  webreact[apps/web-react<br/>Vite SPA · React Router 7<br/>Redux + MSW<br/>base: /react/]
  webnext[apps/web-next<br/>Next.js 16 App Router<br/>Server Actions · zod · in-memory orders]

  ui --> docs
  ui -.alias declared but no import.-> webreact
  ui --> webnext
```

Notes:

- `apps/docs` is the only app live: built and hosted by **Vercel** (`vercel.json`), domain pointed via **OVH** (registrar/DNS only — OVH does not run any compute for this repo).
- `apps/web-react` and `apps/web-next` are **showcase prototypes** — same patterns implemented in different frameworks, intended to eventually be linked from the portfolio (route, subdomain, or external link — undecided). No deploy target wired up. Treat them as local until a hosting plan is agreed.
- Routing: `web-react` uses React Router 7; `docs` and `web-next` use the Next.js App Router. `docs` serves locale-prefixed routes (`/it`, `/en`, `/fr`) with a proxy redirect for bare paths (`apps/docs/src/proxy.ts`).
- State management is asymmetric: web-react uses Redux Toolkit + RTK Query; docs has NO Redux anymore (content is statically imported + zod-validated at build in `apps/docs/src/content/loader.ts`); web-next uses Server Actions + an in-memory order store on `globalThis`.
- `apps/web-next/middleware.ts:21-23` protects `/checkout/:path*` via a single-cookie session (`SESSION_COOKIE_NAME` / `SESSION_COOKIE_VALUE`). MVP only — not production-safe.
- `apps/web-next/lib/orders.ts:23-24` keeps orders in `globalThis.__bookingOrderStore__` with 6h TTL and 200-entry cap. **Lost on every server restart.**

## Commands

Always run from repo root unless noted. Node 24 + pnpm 10 required.

```bash
# Install (frozen lockfile is enforced via .npmrc)
corepack enable && corepack prepare pnpm@10.0.0 --activate
pnpm -w install --frozen-lockfile

# Dev
pnpm dev               # alias of dev:docs (default — docs only)
pnpm dev:docs          # apps/docs (Next.js, port 3000 — pinned)
pnpm dev:react         # apps/web-react (Vite, port 5173+)
pnpm dev:next          # apps/web-next (Next.js, port 3001 — hard-coded)
pnpm dev:all           # UI watch + Storybook (6006) + all three apps

# UI library (workspace)
pnpm -F @laboratoire/ui build         # required before app prod build
pnpm -F @laboratoire/ui storybook     # port 6006
pnpm -F @laboratoire/ui build-storybook

# Quality gates (run all three before pushing)
pnpm check             # = lint + typecheck + test
pnpm lint
pnpm typecheck
pnpm test

# Build / Preview
pnpm build             # turbo run build (respects ^build deps)
pnpm preview:docs      # next start apps/docs (port 3000; alias start:docs)
pnpm preview:react     # vite preview web-react/dist
pnpm start:next        # next start (port 3001)
```

## Conventions

- **TypeScript**: `strict: true` everywhere; also `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`, `erasableSyntaxOnly`. `verbatimModuleSyntax: true` for web-react/ui; **off** in the Next.js apps (docs, web-next).
- **ESLint**: flat config at `eslint.config.mjs`. Stack = `@eslint/js` + `typescript-eslint` + `eslint-plugin-react` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` (Vite preset). `react-refresh/only-export-components` is **disabled for `apps/web-next`** (eslint.config.mjs:51-55).
- **No Prettier, no commitlint, no pre-commit hooks.** Formatting is informal.
- **Naming**: React components in `apps/*` use `PascalCase.tsx`. `packages/ui/src/components/heroui` uses `App<Name>.tsx` (PascalCase wrappers); `packages/ui/src/components/tw-ui` uses `lowercase.tsx` (utility primitives) — keep the convention if you add files there.
- **Folder layout**: type-based per app (`components/sections`, `components/layout`, `components/forms`, `pages`).
- **Schema files**: `<feature>.schema.ts` co-located with their consumer; tests are `<feature>.schema.test.ts`.
- **Imports**: no enforced order. Convention is `react` → third-party → `@laboratoire/ui` → relative.
- **Commits**: free-form mixed with conventional prefixes (`feat:`, `fix:`, `chore:`, `ci:`, `build:`, `deploy:`). No enforcement — match the recent style.
- **i18n**: `apps/docs/src/i18n/messages.ts` ships `en` / `it` / `fr` dictionaries. `apps/docs/src/content/data/portfolio-content.{en,it,fr}.json` mirror the same shape and are statically imported (zod-validated) at build — keep all three locales in sync. SEO copy per locale: `src/data/seoContent.ts` + `src/data/auditContent.ts` (seoTitle/seoDescription), consumed by each route's `generateMetadata`.

## Domain Glossary

Booking domain (`apps/web-next`):

| EN              | IT                 | FR              | Where                                    |
| --------------- | ------------------ | --------------- | ---------------------------------------- |
| experience      | esperienza         | expérience      | `apps/web-next/lib/data.ts`              |
| guest           | ospite             | invité          | `apps/web-next/lib/bookingSchemas.ts:5`  |
| quote           | preventivo         | devis           | `apps/web-next/app/api/quote/route.ts`   |
| booking         | prenotazione       | réservation     | `apps/web-next/lib/pricing.ts:82`        |
| cart            | carrello           | panier          | `apps/web-next/app/cart/page.tsx`        |
| checkout        | cassa              | paiement        | `apps/web-next/app/checkout/page.tsx`    |
| promo code      | codice promo       | code promo      | `apps/web-next/lib/pricing.ts:33-45`     |
| service fee     | commissione        | frais           | `apps/web-next/lib/pricing.ts:30` (8%)   |
| tax             | IVA                | TVA             | `apps/web-next/lib/pricing.ts:31` (12%)  |
| order           | ordine             | commande        | `apps/web-next/lib/orders.ts:5`          |
| idempotency key | chiave idempotenza | clé idempotence | `apps/web-next/lib/bookingSchemas.ts:14` |

Promo codes (hard-coded): `NETWORK10` (10%, no min), `TEAM5` (5%, min 5 guests).

Pricing models: `per-person` (default) and `minimum_group` (uses `Math.max(minimumGroupPrice, perPerson*guests)`).

Portfolio domain (`apps/docs`): nav uses `Chi sono` / `Esperienza` / `Risultati` / `Progetti in evidenza` / `Prossimi build` / `Filosofia tecnica` / `Contattami` (see `apps/docs/src/i18n/messages.ts`).

## Gotchas (read this before anything else)

1. **UI dist required for prod builds.** `apps/web-react/vite.config.ts:17-21` throws if `packages/ui/dist/index.js` is missing **and** `VITE_UI_SOURCE` is unset. `apps/docs` (Next.js) instead consumes the dist via `transpilePackages` and builds it automatically through its `prebuild` script. Either run `pnpm -F @laboratoire/ui build` first or (web-react only) set `VITE_UI_SOURCE=1`.
2. **`web-react` declares `@laboratoire/ui` in `tsconfig.app.json:11-13` but never imports it** (zero matches across `apps/web-react/src`) and does **not** list it in `package.json` deps. The path alias is dead code — confirm with the human before relying on or removing it.
3. **`apps/web-react` has no `tailwind.config.ts` file** despite installing `tailwindcss` and `@tailwindcss/postcss`. Tailwind v4 still picks up the postcss plugin, but content scanning is implicit — verify any new utility classes actually generate CSS.
4. **Three Tailwind setups, drifting tokens.** Dark theme colors differ between docs (`apps/docs/src/index.css:14-49`) and web-react (`apps/web-react/src/index.css:14-33`). web-next has only `apps/web-next/app/globals.css` and no Tailwind. Don't assume tokens match across apps.
5. **`apps/web-next` and `apps/web-react` have no deploy target.** Vercel (`vercel.json`) only deploys `apps/docs`. These two apps are framework-comparison prototypes for the portfolio — no hosting plan decided yet. Treat them as local sandboxes until linked from `apps/docs`.
6. **In-memory order store, no persistence.** `apps/web-next/lib/orders.ts` — orders die on restart. The cookie session has no encryption or CSRF protection. **Conscious MVP choice** (see the `MVP-ONLY` guard comments at the top of `orders.ts` and `session.ts`). Do not use for real users.
7. **SPA fallback artifact.** `apps/web-react` still copies `index.html → 404.html` via a `postbuild` hook (originally for GitHub Pages routing). `apps/docs` no longer does this — Next.js serves a real 404 via `src/app/[locale]/not-found.tsx`.
8. **Ports in `dev:all`.** docs (Next) is pinned at `3000`, web-next at `3001`, Storybook at `6006`; web-react (Vite) picks `5173+`.
9. **Windows: NTFS only.** pnpm workspaces use symlinks; exFAT volumes will fail silently during install. Also `.npmrc` sets `child-concurrency=1` (sequential pnpm child tasks) and `node-linker=hoisted` (flat root `node_modules`).
10. **`pnpm onlyBuiltDependencies`** restricts post-install scripts to `@heroui/shared-utils`, `esbuild`, `msw` (`package.json:42-46`). Adding native-build deps without listing them here will silently skip their build.

## Workflow

1. Branch off `main`. Naming is informal — recent branches: `dev/adding-motion`, `chore/deploy-topology-cleanup`.
2. Make changes; run `pnpm check` locally before push.
3. Push → **Vercel** auto-deploys `apps/docs` (config: `vercel.json`, framework `nextjs`, build `pnpm -F docs build`, output `apps/docs/.next`). Domain `itshassan.it` is registered/DNS-managed on **OVH**, pointed at Vercel. No GitHub Actions workflow runs in this repo today.
4. `apps/web-react` and `apps/web-next` have **no deploy pipeline** — they're framework-showcase prototypes. Hosting strategy TBD (subroute, subdomain, separate Vercel project, etc.).
5. No required secrets at the repo level for the current pipeline. Vercel manages its own credentials in the Vercel dashboard.
6. No PR templates, no CODEOWNERS, no review automation in repo.

## Capability Map

See [`CAPABILITIES.md`](./CAPABILITIES.md) for skills, slash commands, sub-agents, and MCP integrations available on this host. See [`AGENTS.md`](./AGENTS.md) for the project-specific sub-agent roster.

## Re-bootstrap

Trigger phrases when the repo state drifts:

- `bootstrap full` — re-run all 5 phases
- `bootstrap refresh capabilities` — only Phase 4
- `bootstrap audit` — diff this file vs. current repo and report incoherence
