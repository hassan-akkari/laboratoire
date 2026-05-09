# AGENTS.md - laboratoire

Codex-facing project instructions. This file is intentionally shorter than
`.claude/CLAUDE.md`: keep the full inventory there, and keep this file focused
on what a coding agent must know before editing.

## Project Shape

- Pnpm + Turbo monorepo.
- Node `>=24 <25`; pnpm `10.0.0`.
- Workspaces:
  - `apps/docs`: live portfolio site. Vite, React Router 7, React 19, Tailwind v4, HeroUI, Redux Toolkit/RTK Query, i18n `en`/`it`/`fr`. This is the only deployed app.
  - `apps/web-react`: local showcase prototype. Vite, React Router 7, Redux Toolkit, RTK Query/MSW, Tailwind v4, HeroUI. No deploy target.
  - `apps/web-next`: local booking/checkout MVP. Next.js App Router, Server Actions, zod, in-memory order store. No deploy target.
  - `packages/ui`: shared presentational UI package, exported as `@laboratoire/ui`, with Storybook.
- Deployment today: only `apps/docs` is built by Vercel through `vercel.json`. OVH is registrar/DNS only and does not run this repo.

## Commands

Run from the repo root unless a package-specific command is clearer.

```bash
pnpm dev
pnpm dev:docs
pnpm dev:react
pnpm dev:next
pnpm dev:all

pnpm lint
pnpm typecheck
pnpm test
pnpm check

pnpm build
pnpm build:docs
pnpm build:react
pnpm build:next

pnpm -F @laboratoire/ui build
pnpm -F @laboratoire/ui storybook
```

Prefer the narrowest useful gate while developing, then run `pnpm check` before
claiming a broad change is complete. For deploy-sensitive or shared-library
changes, also run `pnpm build` when feasible.

## Critical Gotchas

- Production builds of `apps/docs` and `apps/web-react` expect
  `packages/ui/dist/index.js` unless `VITE_UI_SOURCE=1` is set. Build the UI
  package first with `pnpm -F @laboratoire/ui build` when needed.
- Vite dev auto-uses UI source mode. Production builds should remain
  package-first.
- `apps/web-react` has a `@laboratoire/ui` TS path alias but does not import the
  package and does not list it as a dependency. Do not rely on or remove this
  without an explicit decision.
- `apps/web-next` stores orders in memory on `globalThis`, with 6h TTL and a
  200-entry cap. This is an intentional MVP limitation, not production storage.
- `apps/web-next` checkout protection is a single sentinel cookie. Do not treat
  it as production auth.
- `dev:all` can have Vite port collisions; Vite will auto-increment.
- `.npmrc` uses `node-linker=hoisted` and `child-concurrency=1`. Keep Windows
  and pnpm symlink behavior in mind.
- `pnpm.onlyBuiltDependencies` is restricted. If adding a dependency that needs
  postinstall/native build scripts, update this deliberately through pnpm, not by
  hand-editing the lockfile.

## Editing Rules

- Preserve the user's uncommitted work. This repo often has dirty files; inspect
  before editing and never revert unrelated changes.
- Keep edits scoped to the relevant workspace.
- Use existing patterns before adding new abstractions.
- Do not edit `pnpm-lock.yaml` by hand. Use pnpm commands.
- Do not expand the Vercel deploy surface beyond `apps/docs` unless the user asks
  for that explicitly.
- Keep `packages/ui` presentational. Do not import app state, routers, env vars,
  or app-only dependencies into it.
- When editing `apps/docs` portfolio copy or structure, keep `en`, `it`, and
  `fr` content/message shapes in sync.
- When changing booking inputs in `apps/web-next`, update zod schemas and tests
  near the change.
- Use currency helpers such as `roundCurrency()` in booking/pricing code; avoid
  ad hoc float math.

## Frontend Expectations

- Match the local design language already present in each app.
- For `apps/docs`, treat the site as the live portfolio, so visual regressions
  matter.
- For shared UI, keep component APIs small, accessible, and framework-neutral
  within the current React/HeroUI stack.
- If a dev server is started for UI work, visually verify the changed page before
  finishing when possible.

## Useful Local Roles

These are not separate installed Codex agents; they are working modes to apply
when a task matches the area.

- UI package work: edit `packages/ui/src`, export from `packages/ui/src/index.ts`,
  add Storybook coverage for new visible components, and test logic when present.
- Portfolio content work: update all locales together and run the docs tests or
  typecheck relevant to content schemas.
- Booking engine work: keep changes inside `apps/web-next`, preserve idempotency
  and validation, and add focused Vitest coverage.
- Deploy/config work: treat `vercel.json`, root scripts, Turbo config, and app
  build configs as production-sensitive. Explain behavioral impact and rollback.
- Cross-workspace refactors: write the plan first, keep dependency and engine
  changes explicit, and run the full monorepo gate when feasible.

## Source Of Truth

- Use this file for Codex operating context.
- Use `.claude/CLAUDE.md` as the richer architectural inventory.
- Use `.claude/AGENTS.md` and `.claude/CAPABILITIES.md` only as reference
  material; they contain Claude-specific tool names that do not map 1:1 to
  Codex.
