# Design — Universal HeroUI Component System

> Status: **draft, awaiting user review**
> Date: 2026-06-18
> Author: Hassan + Claude (brainstorming → orchestrator)
> Scope: monorepo-wide UI unification on HeroUI, + standalone playground, + (deferred) admin subdomain routing.

## 1. Problem

The repo has **three divergent UI implementations** for the same primitives:

- `apps/docs` (Vite SPA) — uses `@laboratoire/ui` HeroUI wrappers (`AppButton/AppInput/AppTextarea`) + a local `hero.ts` theme. Some raw `<button>` in nav/locale/FAQ.
- `apps/web-react` (Vite SPA) — imports raw `@heroui/react` directly, **ignores `@laboratoire/ui`**, has its own `hero.ts`. Reinvents button/input/card/theme-toggle.
- `apps/web-next` (Next 16 App Router, RSC) — **no HeroUI, no Tailwind**, plain CSS in `app/globals.css`.

Consequences: 3 button impls, 3 form-field impls, card abstractions that don't match, and `--app-*` theme tokens that **drift between apps** (CLAUDE.md gotcha #4). `packages/ui` also ships **two parallel systems**: 3 exported HeroUI wrappers + 27 mostly-unexported headless `tw-ui` primitives.

## 2. Goals

1. **One canonical component library** in `packages/ui`, HeroUI-based, exported and usable in **all three apps** (docs, web-react, web-next).
2. **One theme source** — kill token drift; all apps render the same brand.
3. **One provider** that works across React Router (SPAs) and Next App Router (RSC).
4. A **standalone playground** (`apps/lab`) + **Storybook story per component** to view/play with every component.
5. Migrate all three apps onto the shared lib (web-next is the heavy lift — gains Tailwind + HeroUI).

## 3. Non-goals (YAGNI)

- Not wrapping the entire HeroUI catalog — only the component set the three apps actually use today + obvious near-term needs (accordion, modal, table, pagination, tabs). More can be added per-need later.
- Not redesigning the visual brand. Tokens are unified to a single source; exact palette is a follow-up decision, not part of this work.
- Not touching the booking/pricing/orders domain logic. UI swap only.
- Admin subdomain routing is **Job 2**, specced here but built after the component program.

## 4. Key decisions (locked with user)

- **Canonical API = HeroUI wrappers** (`App<Name>`). The 27 headless `tw-ui` primitives are retired from the public surface; a primitive is kept only where HeroUI has no equivalent.
- **Playground = standalone `apps/lab`** (its own Vite app/folder) **+** Storybook stories for every component.
- **web-next = full universal** — add Tailwind v4 + HeroUIProvider, migrate plain-CSS UI to shared components.
- **HeroUI MCP installed** to query live component APIs/examples during the build.

## 5. Architecture

### 5.1 Single theme source

Move theme out of per-app `hero.ts` into `packages/ui`:

- `packages/ui/src/theme/heroTheme.ts` — exports the `heroui({...})` config (light/dark colors) as the **single source of truth**.
- `packages/ui/src/theme/tokens.css` — the `--app-*` CSS custom properties, one definition.
- Each app's CSS imports/plugs the shared theme instead of defining its own. docs & web-react drop their local `hero.ts`; web-next adopts it.

This directly fixes gotcha #4 (drifting tokens).

### 5.2 Single provider with a nav adapter

HeroUIProvider needs router-aware `navigate` / `useHref`. Router differs per app, so the lib stays framework-agnostic:

```tsx
// packages/ui/src/provider/UiProvider.tsx  ("use client")
export function UiProvider({ navigate, useHref, children }: UiProviderProps) {
  return <HeroUIProvider navigate={navigate} useHref={useHref}>{children}</HeroUIProvider>;
}
```

- docs / web-react: pass React Router's `useNavigate()` / `useHref`.
- web-next: a `"use client"` `app/providers.tsx` passes `next/navigation` `useRouter().push`.

### 5.3 RSC / client-boundary strategy (web-next)

- Every exported wrapper file carries the `"use client"` directive so it is safe to import from Next server components.
- The build (`packages/ui` dist) **must preserve `"use client"`** — verify the bundler keeps the directive (banner/preserve-directives). This is an explicit Phase-1/2 acceptance check.
- web-next adds: Tailwind v4 + `@tailwindcss/postcss`, the heroui Tailwind plugin pointed at the shared theme, and the `@source` path for `@laboratoire/ui`.

### 5.4 Package exports

`packages/ui/src/index.ts` expands to export the full wrapper set + `UiProvider` + theme + hooks/icons. Consider subpath exports (`@laboratoire/ui/theme`) for the CSS/theme plugin. Tree-shaking preserved.

### 5.5 Canonical component inventory

Grounded in actual repo usage (admin table+pagination, FAQ accordion, web-react selects/chips/cards, docs CTAs, checkout form fields):

| Wrapper | HeroUI base | Driven by (existing need) |
|---|---|---|
| AppButton *(exists)* | Button | docs CTAs, web-react, web-next `.button` |
| AppInput *(exists)* | Input | ContactForm, web-next checkout fields |
| AppTextarea *(exists)* | Textarea | ContactForm |
| AppSelect | Select + SelectItem | web-react HeroForm, web-next checkout |
| AppCheckbox | Checkbox | ContactForm privacy, web-react |
| AppRadioGroup / AppRadio | RadioGroup, Radio | forms |
| AppSwitch | Switch | ThemeToggle, web-react |
| AppCard | Card/Header/Body/Footer | web-react StatusCard, web-next `.card` |
| AppChip | Chip | web-react StatusCard, admin status |
| AppLink | Link | nav, footers |
| AppModal | Modal + slots | future dialogs |
| AppDropdown | Dropdown + menu | nav menus |
| AppNavbar | Navbar + slots | docs SiteHeader, web-react PageHeader |
| AppTable | Table + slots | admin leads dashboard |
| AppPagination | Pagination | admin leads ("pagination future work") |
| AppTabs | Tabs/Tab | showcase, future |
| AppAccordion | Accordion | docs/AuditPage FAQ (currently raw button) |
| AppAlert | Alert | form errors, admin notices |
| AppAvatar | Avatar | future |
| AppDivider | Divider | layout |
| AppSpinner | Spinner | loading states |
| AppTooltip | Tooltip | affordances |
| ThemeToggle *(exists)* | Switch | docs SiteHeader |

Defaults convention follows existing wrappers (e.g. `color="primary"`, `radius="sm"`); full HeroUI prop pass-through preserved.

## 6. Phased roadmap

Each phase = its own spec section → plan → build. Design-heavy phases (1, 2) run as **agenthub competitions**; mechanical migrations (4, 5) run as planned sequential implementations with review.

### Phase 0 — Setup
- Install HeroUI MCP (verify exact package/command before wiring).
- Lock inventory + API conventions (this doc).
- **Acceptance:** MCP reachable; this spec approved.

### Phase 1 — Foundation (theme + provider)
- Create shared `heroTheme.ts` + `tokens.css` + `UiProvider` in `packages/ui`.
- Refactor docs + web-react to consume shared theme/provider; delete their local `hero.ts`.
- Verify `"use client"` survives the build.
- **Acceptance:** docs + web-react render identically to before on the unified theme; `pnpm check` green; no token drift between the two.

### Phase 2 — Component set + Storybook
- Build the full wrapper inventory (§5.5). Export all from `index.ts`.
- One Storybook story per component (states/variants).
- Retire redundant `tw-ui` primitives from the public API.
- **Acceptance:** every wrapper has a story; `pnpm -F @laboratoire/ui build-storybook` green; `pnpm check` green.

### Phase 3 — Playground (`apps/lab`)
- New standalone Vite app `apps/lab`, imports `@laboratoire/ui`, renders a live gallery of every component with controls.
- Wire `dev:lab` script. Decide deploy target later (default: local).
- **Acceptance:** `apps/lab` runs, shows every component, builds clean.

### Phase 4 — web-react migration
- Replace raw `@heroui/react` usage with shared wrappers. Remove web-react's local `hero.ts`.
- **Acceptance:** zero raw `@heroui/react` imports in web-react app code; visual parity; `pnpm check` green.

### Phase 5 — web-next universal adoption *(highest risk)*
- Add Tailwind v4 + `@tailwindcss/postcss` + heroui plugin (shared theme) + `@source` for the lib.
- Add `"use client"` `app/providers.tsx` (HeroUIProvider + Next nav adapter) into `app/layout.tsx`.
- Migrate plain-CSS UI (`.button`, `.field`, `.card`, etc.) to shared components, page by page, preserving RSC/client boundaries.
- **Acceptance:** web-next renders on HeroUI; server/client boundaries correct (no hydration errors); `pnpm check` + `pnpm build` green; booking/checkout flows still pass.

### Phase 6 — Admin subdomain routing *(Job 2)*
- In `proxy.ts`: detect `host === admin.itshassan.it` → rewrite `/` (and non-`/admin` paths as agreed) to `/admin`. Reach admin without typing the path.
- Add the admin host to the proxy matcher; preserve existing admin auth gate.
- **Acceptance:** request to `admin.itshassan.it/` lands on the admin panel (login if unauth); `itshassan.it` public site unaffected; tests cover host routing.

## 7. Repo invariants (apply to every phase / every agenthub variant)

1. `pnpm check` (lint + typecheck + test) must pass.
2. Atomic commits: one logical change per commit; scope creep → `_followup.md`.
3. `web-next` uses no Redux; `docs`/`web-react` use no Server Actions.
4. No hand-editing `pnpm-lock.yaml`. Any dep change → `pnpm install --no-frozen-lockfile`, commit regenerated lock in the **same commit** (`.npmrc` enforces frozen lockfile in CI).
5. `packages/ui` never imports from `apps/*`.
6. i18n: never edit one locale without the other two (en/it/fr).
7. `orders.ts` / `session.ts` `MVP-ONLY` guards are not removed without explicit approval.
8. UI dist required for prod builds (`pnpm -F @laboratoire/ui build` or `VITE_UI_SOURCE=1`).

## 8. Risks

- **`"use client"` survival through the lib build** — if the bundler strips it, web-next breaks. Mitigate: explicit build check in Phase 1.
- **web-next CSS migration regressions** — plain-CSS → Tailwind/HeroUI may shift layout. Mitigate: page-by-page, visual check, keep `globals.css` resets until parity confirmed.
- **HeroUI + Next 16 RSC peer/transpile issues** — verify HeroUI 2.8.8 works with Next 16 App Router (transpilePackages if needed).
- **Token unification may visibly change docs/web-react** — they currently differ. Phase 1 picks one canonical palette; flag any intended visual change to the user.

## 9. Open questions (resolve before the relevant phase)

- Phase 3: does `apps/lab` get a deploy target (subroute/subdomain) or stay local? (default: local for now)
- Phase 1: which app's current palette becomes the canonical token set, or a fresh unified palette? (raise at Phase 1 design)
