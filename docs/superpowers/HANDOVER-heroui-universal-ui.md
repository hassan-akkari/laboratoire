# HANDOVER — Universal HeroUI Component System

Last updated: 2026-06-19 · Branch: `feat/heroui-universal-ui-system`

## What this is

Monorepo-wide UI unification on HeroUI: one shared theme, one provider, a full
`App*` component library in `packages/ui`, a standalone playground, and migration
of all three apps onto it. Full design + rationale: [spec](specs/2026-06-18-heroui-universal-component-system-design.md).

Second, deferred job ("Job 2"): make `admin.itshassan.it` land on `/admin` (host
routing in `apps/web-next/proxy.ts`) instead of forcing the `/admin` path.

## ⚡ CURRENT STATUS — updated 2026-06-25 (READ THIS FIRST)

Roadmap progress on `feat/heroui-universal-ui-system` (off `main`, **NOT merged to main** — 35 commits ahead; pushed to `origin`):

| Phase | State |
|---|---|
| P0 setup · P1 theme/provider · P2 22 wrappers + stories | ✅ done (green) |
| **P2.5 v3 field-slice migration** | ✅ done — Button/Card/Input/Textarea/Select migrated to HeroUI **v3** (`@heroui-v3/react` via pnpm aliases); rest of inventory still v2. Apps wire v3 CSS layers + keep the v2 `heroui()` plugin (coexistence). |
| **P5 web-next universal adoption** | ✅ done — Tailwind v4 + `app/providers.tsx` + ALL public funnel pages (home, cart, checkout, confirmation, experiences/[slug], login, not-found) AND the admin surface (7 admin files) migrated onto `App*`. Admin done via an orchestrator agenthub competition (Variant B parity-first won; run-log in `_orchestrator-runs/2026-06-25-*`). |
| **P3 apps/lab playground** | ✅ done (2026-06-25) — `apps/lab` standalone Vite SPA, categorized live gallery of all 22 wrappers. `pnpm dev:lab` / `build:lab` / `preview:lab`. Local-only. |
| **P4 web-react migration** | ⬜ NOT done — web-react still imports raw `@heroui/react` (HeroForm/PageHeader/StatusCard). Next obvious work. |
| **P6 / Job 2 admin subdomain** | ⬜ NOT done — host-route `admin.itshassan.it` → `/admin` in `apps/web-next/proxy.ts`. |

Verified green this session: `pnpm check` (5/5 workspaces — docs/web-react/web-next/ui/lab), `pnpm build` (all apps incl lab), 78 ui + 108 web-next + 16 docs + 2 web-react tests.

**Key facts that drifted from the original spec/handover below:**
- The field-slice wrappers are **v3 now**, styled via selective `@heroui-v3/styles` CSS layers (NOT the v2 `heroui()` plugin). The plugin is still loaded for the remaining v2 wrappers — both systems coexist. `apps/lab/src/index.css` and `apps/docs/src/index.css` are the canonical example of the dual recipe.
- `AppInput` now forwards native constraint attrs (`minLength/maxLength/pattern/min/max/step`) — added this session for the web-next forms.
- web-next forms keep **native `<select>`** inside server-action/GET forms (AppSelect v3 = react-aria ListBox, needs client state — would break form submission). Documented inline at every site.
- Open follow-ups from this session live in `.claude/_followup.md` H1–H4 (next-env.d.ts flapping, admin `<Link>`→anchor nav, redundant aria-label, deferred maximal AppTable/AppChip admin adoption archived at tag `hub/archive/20260625-164205/agent-1`).

---

## Branch & commit state (original — phases 0–2)

All work is on `feat/heroui-universal-ui-system` (off `main`).

| Commit | What |
|---|---|
| `0e419a47` | spec + 6-phase roadmap |
| `272f12c7` | `.mcp.json` — HeroUI MCP (`@heroui/react-mcp`, stdio) |
| `d8c7bb56` | gitignore `.agenthub/` + `.claude/worktrees/` |
| `8a59f232` | **Phase 1** — shared theme + `UiProvider`; docs + web-react adopt |
| `eba0d2bc` | **Phase 2a** — 5 archetype wrappers + Storybook unify + tw-ui retired |
| `e6585910` | **Phase 2b** — remaining 14 wrappers + stories (22 total) |

(Phases after 2b — v3 field-slice, P5 web-next, P3 lab — are summarized in the
CURRENT STATUS block above; see git log + `_orchestrator-runs/` for detail.)

## Done (verified green: `pnpm check` + `pnpm build` + `build-storybook`)

### Phase 1 — foundation (`packages/ui`)
- `src/theme/tokens.ts` — ONE typed source of truth for the canonical **WARM** palette
  (`heroColorTokens`, `appTokens`) + derivation helpers. Token drift is now a type
  error + test failure.
- `src/theme/heroTheme.ts` — `heroui()` plugin derived from tokens. **Must keep the
  `const heroTheme: ReturnType<typeof heroui> = …` annotation** (prevents TS2742 in the
  declaration build).
- `src/theme/tokens.css` — CSS face of the tokens (added in 2a); `tokensCssSync` test
  keeps it in lockstep.
- `src/components/UiProvider.tsx` — router-agnostic `"use client"` wrapper over
  `HeroUIProvider` (full `HeroUIProviderProps` passthrough). `tsc` preserves the
  `"use client"` directive into `dist/` (verified) — needed for web-next RSC (Phase 5).
- `apps/docs` + `apps/web-react`: consume `UiProvider` via a small `RouterUiProvider`
  bridge (own file — keeps the Vite entry free of component defs / react-refresh rule),
  wired with React Router `useNavigate`/`useHref`. Local `hero.ts` deleted. web-react
  recolored cool-blue → warm and now actually depends on `@laboratoire/ui`.

### Phase 2 — component library (22 `App*` wrappers, each with a Storybook story)
- Convention (locked in 2a): thin `"use client"` HeroUI passthrough with house defaults;
  compounds re-export slots as `App*<Slot>` **and** attach them as static members
  (`AppCard.Body`, `AppDropdown.Menu`, `AppTabs.Tab`, …) via an **explicit intersection
  type** on `Object.assign` (keeps the declaration build portable). Prop types re-exported
  verbatim, or derived via `ComponentProps<typeof HeroX>` where HeroUI exports none.
- Components: Button, Input, Textarea, Chip, Card, Select, Modal, Table, Checkbox, Switch,
  RadioGroup(+Radio), Alert, Avatar(+Group), Divider, Spinner, Link, Tooltip,
  Dropdown(+slots), Accordion(+Item), Navbar(+slots), Tabs(+Tab), Pagination.
- Storybook unified onto the shared warm theme (`.storybook/hero.ts` re-exports shared
  `heroTheme`; `preview.tsx` uses `UiProvider`; `preview.css` plugs shared theme + tokens).
- tw-ui `Input/InputGroup/Textarea` **retired from the public barrel** (HeroUI wrappers
  are canonical); tw-ui source files kept, usable internally where HeroUI has no equivalent.
- `eslint.config.mjs`: `react-refresh/only-export-components` disabled for the heroui
  wrapper dir (compound static-member consts trip it; mirrors the existing web-next override).

## Next (in roadmap order)

### Phase 3 — `apps/lab` standalone playground  ← IN PROGRESS (not started in code)
Decision locked: **local-only** (no deploy target yet). A new Vite SPA, its own folder,
imports `@laboratoire/ui`, renders a categorized live gallery of all 22 components on the
warm theme. Storybook already covers the dev-tool angle; this is the in-browser showcase.

**Ready-to-build recipe (mirror `apps/docs`, simpler — no Redux, no router):**
- `apps/lab/package.json`: name `lab`, private, type module. scripts: `dev: vite`,
  `build: vite build`, `lint: eslint .`, `typecheck: tsc -b`, `preview: vite preview`.
  deps: `@laboratoire/ui workspace:*`, `@heroui/react ^2.8.8`, `@heroui/theme ^2.4.26`,
  `framer-motion ^12.29.2`, `react ^19.2.4`, `react-dom ^19.2.4`. devDeps mirror docs
  (`@tailwindcss/postcss`, `tailwindcss`, `@vitejs/plugin-react`, `@types/*`, `vite`,
  `typescript`, eslint stack).
- `apps/lab/vite.config.ts`: copy `apps/docs/vite.config.ts` verbatim except `base: "/"`
  and drop the `manualChunks` (or keep a minimal one). Keep the UI source/dist alias +
  dist guard.
- `apps/lab/tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`: copy docs'
  (app references `@laboratoire/ui` → `../../packages/ui/src/index.ts`).
- `apps/lab/index.html`: minimal (no SEO/JSON-LD), `<div id="root">` + `/src/main.tsx`.
- `apps/lab/src/index.css`: like docs — `@import "tailwindcss"; @plugin
  "../../../packages/ui/src/theme/heroTheme.ts"; @import
  "../../../packages/ui/src/theme/tokens.css"; @custom-variant dark (...)`. No
  `@config`/`tailwind.config.ts` needed (docs has one only for legacy; web-react has none).
- `apps/lab/src/main.tsx`: `createRoot(...).render(<StrictMode><UiProvider><App/></UiProvider></StrictMode>)`.
  No router → `UiProvider` needs no `navigate`/`useHref` (full passthrough makes them optional).
  Add an `initTheme()` like docs (default dark) if you want the toggle to work.
- `apps/lab/src/App.tsx` (+ small showcase components): categorized sections (Form controls,
  Display/feedback, Overlay/disclosure, Navigation, Data) rendering several states of each
  of the 22 wrappers. Include a `ThemeToggle` (already exported from the lib).
- Root `package.json`: add `dev:lab` (`pnpm -F lab dev`) and `preview:lab`; add lab to
  `dev:all` if desired.
- Then `pnpm -w install` (regen lockfile — new workspace pkg), `pnpm -F @laboratoire/ui build`
  (UI dist for prod builds), `pnpm -F lab build`, and `pnpm check`. turbo auto-detects lab.

Reference configs already read: `apps/docs/{package.json,vite.config.ts,tsconfig*.json,index.html}`,
`apps/web-react/vite.config.ts`, root `package.json`, `pnpm-workspace.yaml` (globs `apps/*`).

### Phase 4 — migrate `apps/web-react` onto shared wrappers
Replace remaining raw `@heroui/react` usage with `App*` wrappers (e.g. `HeroForm.tsx`,
`PageHeader.tsx`, `StatusCard.tsx` use raw Button/Card/Chip/Input/Select/Switch/Textarea).
Visual parity expected (already on the warm theme + UiProvider since Phase 1).

### Phase 5 — `apps/web-next` universal adoption (highest risk)
Currently plain-CSS + RSC, no Tailwind/HeroUI. Add Tailwind v4 + `@tailwindcss/postcss` +
the heroui plugin (shared `heroTheme`) + `@source` for the lib; add a `"use client"`
`app/providers.tsx` (HeroUIProvider via `UiProvider`, `next/navigation` nav adapter) into
`app/layout.tsx`; migrate `.button`/`.field`/`.card` etc. to shared components page-by-page,
preserving RSC/client boundaries. `UiProvider` + the `"use client"` wrappers are already
RSC-ready. Verify `pnpm build` + booking/checkout flows.

### Job 2 — admin subdomain host-routing (`apps/web-next/proxy.ts`)
In `proxy`, detect `host === admin.itshassan.it` and rewrite `/` (and non-`/admin` paths)
→ `/admin`, so the subdomain lands on the panel. Add the admin host to the matcher; keep the
existing admin auth gate intact. Add tests for host routing. (web-next IS deployed —
`apps/web-next/vercel.json` exists; CLAUDE.md gotcha #5 "no deploy target" is stale.)

## Orchestration playbook (how Phases 1 & 2a were run — repeat for 4/5)

Used the `orchestrator` skill → agenthub competition for design-heavy phases:
1. `python <agenthub>/skills/agenthub/scripts/hub_init.py --task "..." --agents 3 --base-branch feat/heroui-universal-ui-system`
   (script path: `C:\Users\Hassan\.claude\plugins\cache\claude-code-skills\agenthub\2.9.0\skills\agenthub\scripts\`)
2. Write dispatch briefs to `.agenthub/board/dispatch/` (a COMMON + one per variant, distinct strategies).
3. Spawn N variants in ONE message: `Agent(..., isolation:"worktree")`, each told to read its
   dispatch by absolute path and write a result to `.agenthub/board/results/`.
4. Judge on actual diffs (not self-reports) → adversarial review agent on the winner → fix
   blockers (graft good bits from runners-up) → merge → verify → commit.

**Key gotchas learned:**
- Harness `isolation:"worktree"` branches worktrees off **`main`**, NOT the current branch.
  So each variant must run `git merge --no-edit feat/heroui-universal-ui-system` FIRST to get
  prior phases. Merge the winner by **cherry-picking its post-`<lastPhaseSHA>` commits**:
  `git cherry-pick --no-commit <lastPhaseSHA>..<winnerBranch>`.
- Variant worktrees have **no `node_modules`** and `@laboratoire/ui` resolves to the main
  checkout — they can't reliably run `pnpm check`. Judge on diffs; verify on the merged result.
- After each phase: `git worktree remove .claude/worktrees/<agent> --force` + `git branch -D <branch>`.
- Phase 2b (mechanical fan-out) did NOT use a competition — parallel batch agents in the MAIN
  tree wrote disjoint files (no `index.ts`/git), then the barrel was assembled centrally.

## Standing notes / gotchas
- **HeroUI MCP** (`.mcp.json`) activates on the next client reconnect — not live in the session
  it was added. On Windows if `npx` won't spawn: `"command":"cmd","args":["/c","npx",…]`.
- Lib build is plain `tsc -p tsconfig.json` (declaration:true, noEmitOnError). Watch TS2742
  on any exported value whose inferred type references tailwindcss/heroui internals — annotate.
- `verbatimModuleSyntax` ON for ui/docs/web-react → `import type` for type-only imports.
- Every wrapper file starts with `"use client";` (enforced by `wrapperUseClient.test.ts`).
- Any `package.json` dep change → `pnpm -w install --no-frozen-lockfile` + commit the lock in
  the SAME commit (CI runs `--frozen-lockfile`).
- `.agenthub/` sessions (`20260618-225749`, `20260619-074027`) are gitignored scratch — ignorable.

## Resume / verify commands
```
git switch feat/heroui-universal-ui-system
pnpm -w install --frozen-lockfile
pnpm -F @laboratoire/ui build      # UI dist (needed for app prod builds)
pnpm check                         # lint + typecheck + test (48 ui tests)
pnpm build                         # all apps
pnpm -F @laboratoire/ui storybook  # browse the 22 components (:6006)
```
