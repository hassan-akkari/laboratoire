# Handover — HeroUI v3 + Vite 8 migration & web-next UI adoption

> **Date:** 2026-06-21 · **Branch:** `feat/heroui-universal-ui-system` (synced with `main` via merge `7cc000bb`) · **Status:** SCOPED, NOT STARTED.
> Design proposed and decisions locked; final approval + 1 scope confirmation still pending (see §9).
> No code written yet. This doc is the resume point.

---

## 1. The request

User asked, in sequence:
1. "Have we updated HeroUI? Have we used it in all 3 projects?" → answered: **no** (still v2.8.8) and **2 of 3** (docs + web-react adopt `@laboratoire/ui`; web-next does not).
2. "Wire it [into web-next], and update tech — HeroUI (pasted the v2→v3 migration-MCP guide), Vite (pasted the v7→v8 / Rolldown migration notes), and any other tech not yet upgraded."

Then invoked `/orchestrator` + `/entp` to execute, but **interrupted before execution** and asked for this handov             er.

---

## 2. Decisions locked (via AskUserQuestion)

| # | Decision | Choice |
|---|---|---|
| 1 | HeroUI v2 → v3 | **Full v3 migration now** (rewrite wrappers + all call sites; not a deferral) |
| 2 | Vite 7 → 8 | **Vite 8 now** (Rolldown/Oxc) + `@vitejs/plugin-react` 5→6 |
| 3 | web-next UI | **Full adoption** (implies adding Tailwind v4 to web-next — it has none today) |
| 4 | Other deps | **Safe bumps only** (patch/minor; hold `@eslint/js` 9→10 and `@types/node` 24→26) |

---

## 3. Version facts (verified via `pnpm outdated -r` + `npm view dist-tags`, 2026-06-21)

**Both majors are STABLE `latest`, not beta** (corrects an earlier mis-statement in the session):
- `@heroui/react`: **2.8.8 → 3.2.1** (`latest`). `3.0.0-rc.1` / `-beta.2` are old pre-release tags.
- `@heroui/theme`: **2.4.26 is latest — v3 has NO theme package.** It is dropped; styling moves to `@heroui/styles` (new pkg) + CSS variables.
- `vite`: **7.3.1 → 8.0.16** (`latest`). `@vitejs/plugin-react`: **5.1.2 → 6.0.2**.

**Safe bumps (decision 4 — apply all):** react/react-dom 19.2.4→19.2.7 · next 16.1.6→16.2.9 · tailwindcss & @tailwindcss/postcss 4.1.18→4.3.1 · framer-motion 12.29.2→12.40.0 · zod 4.3.6→4.4.3 · react-router-dom 7.13.0→7.18.0 · @reduxjs/toolkit 2.11.2→2.12.0 · react-redux 9.2.0→9.3.0 · react-icons 5.5.0→5.6.0 · msw 2.12.7→2.14.6 · storybook + @storybook/* 10.2.4→10.4.6 · turbo 2.8.1→2.9.18 · tsx 4.21.0→4.22.4 · resend 6.12.3→6.14.0 · postcss 8.5.6→8.5.15 · @headlessui/react 2.2.9→2.2.10 · globals 17.3.0→17.6.0 · msw-storybook-addon 2.0.6→2.0.7 · @types/react 19.2.10→19.2.17 · eslint-plugin-react-hooks 7.0.1→7.1.1 · typescript-eslint 8.54.0→8.61.1

**HELD (do NOT bump — decision 4):** `@eslint/js` 9.39.2→10.0.1 (major) · `@types/node` 24.10.9→26.0.0 (keep matched to Node 24 engine; `@types/bcryptjs` is deprecated upstream — leave/ignore).

---

## 4. Migration surface — `packages/ui`

**22 `App*` HeroUI wrappers** (in `packages/ui/src/components/heroui/`), each with a `.stories.tsx`:
`AppButton, AppInput, AppTextarea, AppChip, AppCard(+Header/Body/Footer), AppSelect(+Item/Section), AppModal(+Content/Header/Body/Footer, useAppDisclosure), AppTable(+Header/Column/Body/Row/Cell), AppCheckbox, AppSwitch, AppRadioGroup(+Radio), AppAlert, AppAvatar(+Group), AppDivider, AppSpinner, AppLink, AppTooltip, AppDropdown(+Trigger/Menu/Item/Section), AppAccordion(+Item), AppNavbar(+Brand/Content/Item/MenuToggle/Menu/MenuItem), AppTabs(+Tab), AppPagination`.

The public compound API (`AppCard.Body`, `AppModal.Content`, `AppTable.*`, etc.) is **already compound-shaped** — keep it stable so call sites barely move; rewrite only the v3 internals.

**Also in `packages/ui`:**
- `src/components/UiProvider.tsx` — wraps `HeroUIProvider`. **v3 removes the provider** → re-implement as a wrapper over React Aria's `RouterProvider` (preserves the router-agnostic abstraction: React Router 7 for docs/web-react, Next router for web-next) + theme class. Exported & consumed by both apps' `RouterUiProvider`.
- `src/components/ThemeToggle.tsx` — uses `Switch`.
- `src/theme/heroTheme.ts` — uses `heroui` from `@heroui/theme`. **Delete** (no plugin in v3).
- `src/theme/tokens.ts` — the "warm theme" single source of truth. **Rewrite as CSS variables in oklch** (`heroColorTokens`, `appTokens`, `renderThemeCss`, etc. are exported from the barrel — keep the exported helper surface or update all consumers).
- `src/index.ts` — barrel; update exports as wrappers change.
- `src/components/tw-ui/` (~28 Catalyst-style primitives on **Headless UI, not HeroUI**) — **OUT of scope.** Barrel rule (already documented in index.ts): a tw-ui primitive is public ONLY where HeroUI has no equivalent.

---

## 5. Migration surface — apps

**docs** (live on Vercel — the only deployed app): 12 files import `@laboratoire/ui`:
`RouterUiProvider, pages/AuditPage, pages/CvPage, components/ui/CalBookButton, layout/SiteHeader, sections/{AboutSection, ContactForm, ContactSection, FinalCTASection, HeroSection, PortfolioSection, RoadmapSection, ServicesSection}`. Plus CSS migration in `apps/docs/src/index.css` (drop plugin, port warm theme to oklch vars, utility-class renames).

**web-react**: 5 files import `@laboratoire/ui` (`RouterUiProvider, ThemeTokensCard, StatusCard, PageHeader, HeroForm`) **AND 4 files use RAW `@heroui/react`** that must migrate directly to v3 compound API:
- `ThemeTokensCard.tsx` — `Card, CardBody, CardHeader`
- `StatusCard.tsx` — `Card, CardBody, CardHeader, Chip`
- `PageHeader.tsx` — `Button`
- `HeroForm.tsx` — `Checkbox, Input, Select, SelectItem, Switch, Textarea`
Plus CSS migration in `apps/web-react/src/index.css`. (Note CLAUDE.md gotcha #2 "web-react declares but never imports `@laboratoire/ui`" is **STALE** — it imports it in 5 files; fix in P7.)

**web-next** (Next.js 16 App Router, SSR): currently **NO `@heroui`, NO `@laboratoire/ui`, NO Tailwind** (only `app/globals.css`; CLAUDE.md gotcha #4). Full adoption = add Tailwind v4 + `@heroui/styles` + `@laboratoire/ui` dep + a **client-boundary `UiProvider`** + swap cart/checkout/booking UI. Largest new surface; watch SSR/hydration with React Aria.

---

## 6. v3 delta cheat-sheet (from the official migration + styling guides)

- **No Provider.** `HeroUIProvider` removed.
- **CSS-first, no plugin.** Remove `heroui()` from Tailwind config; `@import "tailwindcss"; @import "@heroui/styles";` (order matters — tailwind first). Add dep `@heroui/styles`.
- **`classNames` → `className`** on every component.
- **Colors:** `primary`→`accent`; `secondary` removed (now a variant, uses `default`); `content1-4` → `surface` / `surface-secondary…` + `overlay`; numbered scales (`-50`…`-900`) removed → use `-soft` / `-hover`; **HSL → OKLCH**; muted text → `muted` token.
- **Utilities:** `text-tiny/small/medium/large` → `text-xs/sm/base/lg`; `rounded-small/medium/large` → `rounded-sm/md/lg` (**values shrink** 8/12/14px → 4/6/8px — use `rounded-[12px]` to match v2); `border-small/medium/large` → `border` / `border-2` / `border-[3px]`; `transition-background` / `transition-colors-opacity` etc. **removed** → standard Tailwind `transition-*`.
- **Component renames:** Divider→**Separator**, Textarea→**TextArea**, Autocomplete→ComboBox, Progress→ProgressBar, CircularProgress→ProgressCircle, NumberInput→NumberField, DateInput→DateField, TimeInput→TimeField. Input→**TextField / Input / InputGroup** (pick per usage; labeled → TextField).
- **Removed entirely (affect repo):** **Navbar** (rebuild from primitives — see `/docs/react/migration/navbar`), Code, Image, Ripple, Snippet, Spacer, User.
- **Collection identity:** `key` → `id` + `textValue` for Dropdown/Select/Accordion/Table/Tabs/ListBox items (leaks to call sites that build item lists). Keep React `key` for reconciliation too.
- **Hooks:** `useDisclosure` → **`useOverlayState`** (affects AppModal/`useAppDisclosure`); `useSwitch`/`useInput` removed (use compound components).
- **framer-motion** no longer a HeroUI dep → drop from `packages/ui` peerDeps; apps keep it for their own motion.
- Per-component breakers worth flagging: **AppNavbar** 🔴 (rebuild), **AppModal** 🟠 (hook), **AppInput** 🟠 (TextField choice), collection wrappers 🟠 (id/textValue), AppDivider/AppTextarea 🟢 (rename).

---

## 7. Proposed phasing (each phase verifiable with `pnpm -F <pkg> build/typecheck/lint`)

HeroUI states **v2 and v3 cannot coexist** → use the **Full Migration** strategy (migrate component code, flip dep, then styling). The lib is intentionally broken between the P2 dep-flip and P3 completion.

- **P0 — setup:** work continues on `feat/heroui-universal-ui-system` (already synced with `main`, merge `7cc000bb` — phases 0-2 wrapper work lives here); add `heroui-migration` MCP to `.mcp.json` (see §8); add `@heroui/styles`.
- **P1 — `packages/ui` core:** `tokens.ts`→oklch CSS, delete `heroTheme.ts`, rewrite `UiProvider` on `RouterProvider`, wire `@heroui/styles` import.
- **P2 — `packages/ui` wrappers:** 22 wrappers + 22 stories to v3 (parallelizable; AppNavbar dedicated). Flip `@heroui/react` 2.8.8→3.2.1, remove `@heroui/theme`.
- **P3 — docs:** CSS migration + call-site fixes. Build + visual verify.
- **P4 — web-react:** CSS migration + 4 raw call sites + 5 wrapper sites. Verify.
- **P5 — web-next:** add Tailwind v4 + full `@laboratoire/ui` adoption + client UiProvider boundary. Verify SSR/hydration.
- **P6 — Vite 8 + plugin-react 6 + all safe bumps** (§3), then repo-wide `pnpm check`.
- **P7 — docs/CLAUDE.md:** update versions table; fix stale gotcha #2; record web-next now has Tailwind + UI.

**Do NOT push to `main` until P7 is green** (docs is the live site).

---

## 8. Execution model + the missing MCP

- **Intended driver:** `/orchestrator` (interactive mode; `complexity = complex` → Depth-2 mini-teams; per-phase objective gate `pnpm check`; adversarial pass before any merge) with `/entp` as the Step 1.5 pre-flight critic on framing/scope.
- **Blocker for this session:** the HeroUI **component-dev MCP (`heroui`) disconnected**, and the **migration MCP is not configured**. Both need a restart.
- **`.mcp.json` currently:**
  ```json
  { "mcpServers": { "heroui": { "command": "npx", "args": ["-y", "@heroui/react-mcp@latest"] } } }
  ```
  **Add the migration server, then restart Claude Code and `/mcp` to confirm "Connected":**
  ```json
  "heroui-migration": { "type": "http", "url": "https://migration-mcp.heroui.com" }
  ```
  Migration MCP tools: `get_migration_workflow`, `list_component_migration_guides`, `get_component_migration_guides` (kebab-case names), `get_styling_migration_guide`, `get_hooks_migration_guide`; prompts `analyze-and-plan` then `implement-migration`.

---

## 9. Open / not-yet-confirmed (resolve before coding)

1. **Final design approval** — the §7 phasing was presented; user asked for handover before approving. Re-confirm.
2. **web-next Tailwind v4** — full adoption necessarily adds Tailwind v4 to web-next (no Tailwind today). Confirm in scope (the only realistic alternative is not adopting HeroUI there at all).
3. **`UiProvider` shape** — confirm re-implementing on React Aria `RouterProvider` (vs dropping the abstraction and wiring routing per-app).
4. **AppNavbar rebuild** — may alter docs `SiteHeader` call site; confirm acceptable.

---

## 10. Repo invariants (from orchestrator skill — apply to every change)

1. `pnpm check` (lint + typecheck + test) must pass.
2. Atomic commits: one task = one commit; scope creep → `_followup.md`.
3. **Lockfile:** never hand-edit `pnpm-lock.yaml`. Any dep/peer/dev change → `pnpm install --no-frozen-lockfile` and commit the regenerated lock **in the same commit** (`.npmrc` enforces frozen-lockfile; splitting breaks CI). **This is the highest-risk invariant for a dep-heavy migration.**
4. `packages/ui` never imports from `apps/*`.
5. i18n: never touch one locale without the other two (docs has en/it/fr).
6. web-next = Server Actions (no Redux); docs/web-react = Redux/RTK (no Server Actions).
7. `orders.ts` / `session.ts` keep their `MVP-ONLY` guards.

---

## 11. Reference paths

- Wrappers: `packages/ui/src/components/heroui/App*.tsx` (+ `.stories.tsx`)
- Barrel: `packages/ui/src/index.ts`
- Theme: `packages/ui/src/theme/tokens.ts`, `packages/ui/src/theme/heroTheme.ts` (to delete)
- Provider: `packages/ui/src/components/UiProvider.tsx`
- App CSS: `apps/docs/src/index.css`, `apps/web-react/src/index.css`, `apps/web-next/app/globals.css`
- Vite configs: `apps/docs/vite.config.ts`, `apps/web-react/vite.config.ts` (UI-dist guard at lines ~15-21)
- web-react raw heroui sites: `apps/web-react/src/components/{sections/ThemeTokensCard.tsx, sections/StatusCard.tsx, layout/PageHeader.tsx, forms/HeroForm.tsx}`
- `.mcp.json`, `CLAUDE.md`, `_followup.md`

---

## 12. First actions on resume

1. Add migration MCP to `.mcp.json`; restart; `/mcp` → confirm `heroui` + `heroui-migration` both Connected.
2. Re-confirm §9 open items with the user.
3. Confirm on `feat/heroui-universal-ui-system` (already synced with `main`); commit the untracked `_handover-heroui-v3-vite8-migration.md` if you want it tracked.
4. Run migration MCP `analyze-and-plan` (cross-check against §4–6 here), then drive `/orchestrator` (+`/entp` pre-flight) phase by phase per §7, verifying each gate. Keep off `main` until P7.
