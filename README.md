# laboratoire

Personal monorepo (pnpm + Turbo) by Hassan Akkari: a live portfolio, a live full-stack booking product, and a few framework labs that share one UI library.

## Start here

| What | Where | Status |
| --- | --- | --- |
| **Portfolio** — who I am, case studies, CV, notes | https://itshassan.it · [`apps/docs`](apps/docs) | Live (Vercel) |
| **Bookable** — booking platform with a runtime style switcher, the flagship project | https://bookable.itshassan.it · [`apps/booking-service`](apps/booking-service) · [README](apps/booking-service/README.md) · [case study](apps/booking-service/PORTFOLIO_CASE_STUDY.md) | Live (Vercel) |
| Working notes for contributors and coding agents | [`AGENTS.md`](AGENTS.md) · [`docs/PROJECT_BRAIN.md`](docs/PROJECT_BRAIN.md) · [`docs/DECISIONS.md`](docs/DECISIONS.md) | — |

If you only have five minutes: open the Bookable demo, switch the three designs with the pill in the top-right corner, then read its README for how it is built and what it deliberately does not do yet.

## Monorepo map

```
apps/
  docs/              Portfolio + digital garden. Next.js 16 App Router, SSG, locales en/it/fr/de.
  booking-service/   Bookable. Next.js 16, Drizzle + Neon Postgres, iron-session, shadcn/ui.
  web-next/          Admin / lead management behind itshassan.it (Next.js 16, Drizzle + Neon)
                     plus a parked in-memory booking demo.
  web-react/         Vite + React 19 + Redux Toolkit / RTK Query + MSW scaffold. Local only.
  lab/               Playground for the shared UI library. Local only.
  control-centre/    Local-only dashboard for personal workflows. No deploy by design.
packages/
  ui/                @laboratoire/ui — shared presentational components, Storybook.
docs/                PROJECT_BRAIN (current snapshot), DECISIONS (why), handovers.
```

Deployed apps each have their own Vercel project; the domain is registered on OVH and points at Vercel (DNS only). CI runs `pnpm check` on every push and pull request ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)).

## Requirements

- Node `>=24 <25` (see `.node-version`)
- pnpm `10.0.0` (pinned in `package.json#packageManager`)
- Windows: an **NTFS** volume — pnpm workspaces rely on symlinks, which exFAT does not support.

## Install

```bash
corepack enable && corepack prepare pnpm@10.0.0 --activate
pnpm -w install --frozen-lockfile
```

## Run

```bash
pnpm dev            # portfolio (apps/docs) → http://localhost:3000
pnpm dev:booking    # Bookable (apps/booking-service) → http://localhost:3002
pnpm dev:next       # web-next → http://localhost:3001
pnpm dev:react      # web-react (Vite) → http://localhost:5173+
pnpm dev:lab        # UI playground (Vite)
pnpm dev:centre     # control-centre → http://localhost:3002 (same port as Bookable: run one or the other)
pnpm dev:all        # UI watch + Storybook (6006) + every app
```

Bookable boots without a database (sample data + demo banner). To point it at a real Postgres, follow [its README](apps/booking-service/README.md#database--migrations) — migrations only, never `db:push`, because the database is shared between apps.

## Quality gates

```bash
pnpm check          # lint + typecheck + test across all workspaces (same as CI)
pnpm lint
pnpm typecheck
pnpm test
```

## Build

```bash
pnpm -F @laboratoire/ui build   # shared UI first (Next apps do this in their prebuild)
pnpm build                       # turbo: every workspace
pnpm build:docs | build:booking | build:next | build:react | build:lab
pnpm start:docs | start:booking | start:next
```

## Shared UI library

`packages/ui` is a real package: it builds to `dist/`, and the apps consume it as a dependency (`transpilePackages` in the Next apps, a dist alias in the Vite apps; `VITE_UI_SOURCE=1` switches Vite apps to source for HMR).

```bash
pnpm -F @laboratoire/ui storybook          # http://localhost:6006
pnpm -F @laboratoire/ui build-storybook
```

## Where things are documented

- [`AGENTS.md`](AGENTS.md) — how to work in this repo (commands, boundaries, editing rules).
- [`docs/PROJECT_BRAIN.md`](docs/PROJECT_BRAIN.md) — current-state snapshot of apps, deploys and security boundaries.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — why the architecture is the way it is (append-only).
- [`apps/booking-service/README.md`](apps/booking-service/README.md) — Bookable: setup, environment variables, migrations, screenshots, limits.
