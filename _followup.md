# Follow-up — HeroUI v3 incremental-coexistence spike (slice 1: AppButton + AppCard)

> Branch: `hub/20260621-160400/agent-2/attempt-1` (off `feat/heroui-universal-ui-system`).
> This slice proved the v2<->v3 coexistence pattern and migrated EXACTLY two
> wrappers. Everything below is DELIBERATELY out of scope for this slice.

## What shipped in this slice

- **Coexistence (Strategy A — pnpm aliases).** `packages/ui/package.json` keeps
  v2 (`@heroui/react` ^2.8.8 peer+dev, `@heroui/theme` ^2.4.26 dev) and ADDS v3
  as real runtime `dependencies`:
  `@heroui-v3/react` = `npm:@heroui/react@latest` (3.2.1),
  `@heroui-v3/styles` = `npm:@heroui/styles@latest` (3.2.1).
  Rationale for `dependencies` (not peer/dev): the migrated wrapper source
  imports v3 directly, and the apps cannot provide the `@heroui-v3` alias — so
  the library genuinely owns this runtime dep. v2 stays a peerDep (apps provide
  the v2 `HeroUIProvider`/styling during coexistence).
- **AppButton + AppCard** migrated to `@heroui-v3/react`. The other 20 wrappers
  still import `@heroui/react` (v2) unchanged.
- **New v3 token foundation** (NOT by editing `tokens.ts`):
  `packages/ui/src/theme/v3/warmThemeV3.css` + `warmThemeV3.ts`.

## The EXTENSION PATTERN (how the remaining 20 wrappers plug in)

This is the reusable seam this slice paid for. To migrate wrapper N:

1. **Import from v3.** Change `import { X } from "@heroui/react"` to
   `import { X } from "@heroui-v3/react"`. Leave the other wrappers on v2.
2. **Preserve the public API with a hand-written anti-corruption interface.**
   `AppXProps` stays a hand-written `interface` that keeps accepting the v2-era
   prop surface the apps already pass, and the wrapper MAPS it onto v3 inside.
   This is why ZERO app files changed for AppButton (10 call sites). See
   `AppButton.tsx` `toV3Variant()` + the `as="a"` anchor branch as the template
   for the hard case; `AppCard.tsx` as the template for the easy compound case.
   DO NOT set `AppXProps = <v3 component>Props` — v3's prop surface differs and
   that forces app edits.
3. **Theme via the foundation.** Wrap rendered elements with `withV3Theme()`
   (from `@laboratoire/ui`) so the warm v3 CSS vars resolve. If the component
   reads a v3 variable not yet mapped (e.g. `--overlay` for AppModal/AppTooltip,
   `--field-*` for AppInput, `--success`/`--warning` for AppAlert), add ONE line
   per token to BOTH blocks in `warmThemeV3.css`, deriving each value from
   `tokens.ts` via the documented sRGB->OKLCH conversion (keep the hex+oklch
   comment). `V3_TOKEN_MAP` in `warmThemeV3.ts` is the typed manifest of what is
   mapped so far.
4. **Stories.** Update `AppX.stories.tsx` to the v3 prop surface (removed v2
   props like `shadow`/`radius`/`isPressable` will fail typecheck — stories ARE
   typechecked under `noEmitOnError`).
5. **Verify.** `pnpm -F @laboratoire/ui typecheck && pnpm -F docs typecheck`
   (docs typechecks the UI from SOURCE via its `paths` alias, so it validates
   every migrated call site), then repo-root `pnpm check`.

## Scope punts (do later, in their own slices)

- **Remaining 20 wrappers** (AppInput, AppTextarea, AppChip, AppSelect,
  AppModal, AppTable, AppCheckbox, AppSwitch, AppRadioGroup, AppAlert,
  AppAvatar, AppDivider, AppSpinner, AppLink, AppTooltip, AppDropdown,
  AppAccordion, AppNavbar, AppTabs, AppPagination). AppNavbar is the 🔴 hard one
  (removed in v3 — rebuild from primitives). AppModal needs the
  `useDisclosure`->`useOverlayState` hook change. Collection wrappers need the
  `key`->`id`+`textValue` change.
- **`UiProvider` rewrite.** v3 has no provider, but 20 v2 wrappers still need
  `HeroUIProvider`. Left untouched this slice (constraint). Re-implement on
  React Aria `RouterProvider` only AFTER the last v2 wrapper is gone.
- **`tokens.ts` -> oklch / delete `heroTheme.ts`.** The v2 single-source and its
  `heroui()` plugin stay until all wrappers are off v2 (the CSS-sync vitest
  pins `tokens.ts`). The new v3 foundation lives ALONGSIDE it for now.
- **Wiring v3 styles into the apps' `index.css`.** Only Storybook's
  `preview.css` got `@import "@heroui-v3/styles"` this slice (where the migrated
  stories render). `apps/docs/src/index.css` and `apps/web-react/src/index.css`
  still use the v2 plugin only. Add the v3 `@import` per-app when those apps
  start rendering v3 components in anger (the warm v3 vars are scoped under
  `.heroui-v3-warm`, so adding the import is non-breaking when ready).
- **Vite 8 / plugin-react 6 / safe dep bumps.** Out of this slice entirely.
- **web-next adoption** (Tailwind v4 + `@laboratoire/ui`). Out of scope.

## Known low-risk notes / hazards (from adversarial review)

- **`onClick` handling (resolved).** v3 `Button` strips native DOM `onClick`
  (`delete props.onClick`). AppButton's button branch therefore routes the
  v2-era `onClick` through v3's documented `onPress` (composing with any
  explicit `onPress`) instead of relying on react-aria's internal onClick shim.
  The `as="a"` anchor branch keeps native `onClick` (real DOM element).
- **`isLoading` path is app-unexercised.** No docs call site sets `isLoading`
  (ContactForm uses `isDisabled`). The render-prop spinner branch is validated
  by inspection + story only. The content fragment is duplicated between the
  pending and non-pending paths — keep them in sync if edited.
- **`onlyBuiltDependencies`.** Install reported NO ignored build scripts for the
  v3 packages (they are React-Aria/JS, no native postinstall). No change needed
  to the `onlyBuiltDependencies` allowlist.

## Adversarial review verdict — orchestrator session 20260621-160400 (MEDIUM/LOW-only; no CRITICAL)

All 8 repo invariants + every spike-contract bullet PASSED (verified by fresh,
non-cached UI typecheck/lint/test, docs typecheck, frozen lockfile, and the
installed v3 3.2.1 type surface). The merge into `feat` is safe. Open items:

- **F1 — MEDIUM — PRE-DEPLOY GATE (do NOT deploy docs off this branch until fixed).**
  The migrated v3 AppButton/AppCard emit v3 class names (`button`, `button--primary`,
  `card`, …) and read v3 CSS vars, but `@heroui-v3/styles` + `warmThemeV3.css` are
  imported ONLY in Storybook `preview.css` — NOT in `apps/docs/src/index.css`. So a
  docs deploy off this branch would render ~60 live buttons UNSTYLED. `pnpm check`
  cannot catch this (no test renders against app CSS). Fix before docs reaches a
  deploy: add `@import "@heroui-v3/styles";` (after tailwind) + the warm-v3 import to
  `apps/docs/src/index.css`. (Same applies to web-react when it renders v3.) This is
  the same item as the "wiring v3 styles into the apps" punt above — now flagged as a
  hard pre-deploy blocker, not just a nicety.
- **F2 — MEDIUM — pin the v3 specifier off `@latest`.** `package.json` uses
  `npm:@heroui/react@latest` / `@heroui/styles@latest`. v3 still ships frequent
  releases; the lockfile pins 3.2.1 today (and `.npmrc` frozen-lockfile holds CI), but
  the SPECIFIER should be pinned: `npm:@heroui/react@3.2.1` / `@heroui/styles@3.2.1`.
- **F3 — LOW — harden the `as="a"` anchor branch.** It drops `isLoading`/`type`/
  `onPress` (button-only) and sets `aria-disabled` without removing `href` — a disabled
  anchor stays navigable. No docs `as="a"` site currently passes those props, so latent.
  If `as="a"` && `isDisabled`: drop `href` + `tabIndex={-1}`.
- **F4/F5 — LOW (note).** Public prop types narrowed from broad v2 `ButtonProps`/
  `CardProps` to hand-written allow-list interfaces (intended anti-corruption design;
  a future untyped consumer of a dropped v2 prop loses it silently). `onClick` in the
  button branch passes a react-aria `PressEvent` double-cast to `MouseEvent` — fine for
  current arg-less docs handlers, but document that `onClick` receives a PressEvent.

## Slice 2 — F1 (v3 styles in docs) + F2 (pin 3.2.1) + m3-ripple (session 20260621-181235, winner C, merged)

Shipped: apps/docs now imports a SURGICAL subset of `@heroui-v3/styles` layers (themes/default
+ utilities + variants + components/button.css + card.css; v3 `base` layer deliberately SKIPPED to
avoid a global `*{border-color}` reset; warmThemeV3.css last) — 411kB CSS. `@heroui-v3/styles` added
to apps/docs/package.json. v3 specifiers pinned `@latest`→`@3.2.1`. m3-ripple@1.1.3 added to
packages/ui; ripple on BOTH AppButton render paths (button + anchor), inert when disabled/pending,
opt-out via new `disableRipple` prop (default false = ON), SSR-safe + aria-hidden. 5 new tests.

Open follow-ups from the slice-2 adversarial review (none blocked merge):
- **MEDIUM — add a CSS sideEffects carve-out (do before Vite 8).** `packages/ui/package.json` declares
  `"sideEffects": false`, but AppButton now relies on the bare side-effect import `import "m3-ripple/ripple.css"`
  surviving bundling. Works under Vite 7/Rollup today (docs build ships the CSS), but is fragile against the
  in-flight Vite 8 bump. Fix: `"sideEffects": ["**/*.css"]` in packages/ui/package.json.
- **DEPLOY FLAG (pre-existing, now load-bearing).** Vercel `buildCommand: pnpm -F docs build` runs vite build
  directly, bypassing turbo `^build`; `packages/ui/dist` is gitignored. Now that dist carries a RUNTIME dep
  (m3-ripple), a clean Vercel checkout could hit the `apps/docs/vite.config.ts` "dist is missing" guard. Confirm
  Vercel rebuilds packages/ui (monorepo turbo detection or an install hook) before feat→main deploys. Combine
  with slice-1 F1 (v3 styles are now wired into docs, so that pre-deploy gate is CLEARED for docs).
- **LOW (cosmetic).** Tighten the disabled-ripple rationale comment in AppButton.tsx (inertness comes from
  m3-ripple skipping listeners when `disabled`, not from an aria-disabled CSS rule). Document the v2/v3 CSS
  layering order in apps/docs/src/index.css.
- Surgical-layer maintenance: each future v3 wrapper that needs new component CSS must add its layer import to
  apps/docs/src/index.css (overlay wrappers — Modal/Tooltip — also need `tw-animate-css` wired, which is why the
  full `@heroui-v3/styles` barrel was rejected for the surgical subset).

## web-next HeroUI v3 + Tailwind wiring + cart conversion (session 20260622-p0-infra, agent-2, VARIANT B layer-disciplined)

Shipped: apps/web-next now consumes `@laboratoire/ui` (added `workspace:*`). Tailwind v4 wired via an
explicit `apps/web-next/postcss.config.mjs` (`@tailwindcss/postcss`). `app/globals.css` imports the SAME
surgical v3 layer subset docs uses (themes/default + utilities + variants + components/button.css +
card.css + warmThemeV3.css last), with the two v3 component recipes force-imported into a LOW `@layer
heroui-v3` and the existing app rules wrapped in a HIGH `@layer app`. The two colliding bare base
selectors (`.card` / `.button`) got a zero-specificity `:where(:not(.heroui-v3-warm))` guard so the v3
wrappers (which carry `.heroui-v3-warm`) escape the legacy look while plain pages stay byte-identical.
`.heroui-v3-warm` + `color-scheme:dark` are server-rendered on `<html>` in `layout.tsx` (no theme flash).
A dedicated `app/Providers.tsx` ("use client") mounts `UiProvider` (HeroUI v2 provider — a no-op for the
v3-only cart, included as the forward-looking router boundary for future v2-backed form pages). Cart page
converted to `AppCard` + `AppButton` (`as="a"`). Consumes the lib from `dist` (Next 16 Turbopack rejects
aliasing a bare specifier to an absolute `.ts` → "external module"); a `web-next` `prebuild` script builds
the lib so `pnpm -F web-next build` is self-contained. `turbopack.root` pinned to the monorepo root to
silence the worktree dual-lockfile warning.

Open follow-ups (none blocked the commit):
- **GATE FALLBACK USED — `pnpm -F web-next build` is environment-blocked, NOT by this change.** The prod
  build reaches `✓ Compiled successfully` + `Running TypeScript` (both clean), then fails in
  `lib/db/client.ts:15` (`DATABASE_URL is not set`) while collecting page data for the pre-existing
  `/api/site-config` route. `next build` forces `NODE_ENV=production`, which disables the `DEV_NO_DB=1`
  escape hatch, so a clean prod build needs a real `DATABASE_URL`. Verified via the dispatch's documented
  fallback instead: lint + typecheck clean, `dev:next` boots, cart SSR HTML inspected. A future
  deploy/CI for web-next must provide `DATABASE_URL` (or make `/api/site-config` build-safe without DB).
- **MEDIUM — same CSS sideEffects fragility as slice-2 applies here.** web-next now ALSO relies on
  `import "m3-ripple/ripple.css"` surviving the lib's `dist` through Next's transpile. Confirm the
  pending `packages/ui` `"sideEffects": ["**/*.css"]` carve-out covers Next/Turbopack too.
- **DECISION (source-vs-dist).** Chose dist + `prebuild` over TS-source alias because Turbopack on Next 16
  cannot bundle a bare-specifier→absolute-`.ts` alias (treats it as external; also rejects Windows
  backslash paths). If a future Next/Turbopack supports source aliasing cleanly, revisit to drop the
  `prebuild` step. tsconfig `paths` still points `@laboratoire/ui`→source `index.ts` for the typecheck.
- **LOW (routing).** Cart CTAs use `AppButton as="a"` (styled anchor) rather than Next `<Link>`, so they
  do a full navigation instead of a soft client transition. Acceptable for this MVP prototype; revisit if
  AppButton gains an `asChild`/render-element escape hatch to wrap `next/link`.
- **LOW (layer order nuance).** Tailwind registers its own `utilities` layer during `@import "tailwindcss"`,
  so the effective compiled order is `theme < base < utilities < heroui-v3 < app` (utilities below the
  component layers, not above). Harmless here (cart wrappers don't override via utility classes), but a
  future page that needs a `className` utility to beat the v3 recipe would have to rely on specificity or
  an explicit higher layer. Documented inline in globals.css.

---

# Follow-up — booking-service style switcher (2026-06-26)

> From the adversarial pass on the style-switcher merge (run-log:
> `_orchestrator-runs/2026-06-26-booking-service-style-switcher-merge.md`).
> Both MEDIUM, non-blocking, deferred. App: `apps/booking-service`.

- **M1 (a11y, MEDIUM).** `components/StyleSwitcher.tsx` sets `aria-busy={isPending}` on the
  `role="group"` wrapper. Valid ARIA but semantically imprecise — `group` has no implicit live
  region, and the per-button `disabled={isPending}` already conveys non-interactivity. Fix: drop
  `aria-busy` from the group; rely on `disabled` + the `aria-pressed` change on completion.
- **M2 (CSS tidiness, MEDIUM).** `app/globals.css` has TWO `@media (prefers-reduced-motion: reduce)`
  blocks: a warm-specific one (`.warm-canvas/.warm-lift/.warm-reveal`) and a later global `*` reset
  with `!important`. The global `!important` clobbers the specific block (visually identical — 0.01ms
  vs none — so harmless). Fix: merge the warm-specific reset into the global block, or move the global
  block first and drop `!important`.

---

# Follow-up — booking-service admin (2026-06-26)

> From the adversarial pass on the admin auth+dashboard build (run-log:
> `_orchestrator-runs/2026-06-26-booking-service-admin-auth-dashboard.md`). LOW, deferred.

- **LOW (cookie hardening for staging).** `apps/booking-service/lib/adminSession.ts` sets the admin
  session cookie `secure: process.env.NODE_ENV === "production"`. Standard for local HTTP dev, but a
  non-prod STAGING deploy served over HTTP would transmit the admin cookie in clear. Fix when a
  staging env exists: set `NODE_ENV=production` there, or change to
  `secure: process.env.NODE_ENV !== "development"` so only true local dev allows insecure cookies.

---

# Follow-up — booking-service admin services CRUD (2026-06-26)

> From the adversarial pass on the admin services-CRUD build (run-log:
> `_orchestrator-runs/2026-06-26-booking-service-admin-services-crud.md`). All non-blocking.

- **MEDIUM (invariant 6 — type export from a `"use server"` module).** Both
  `apps/booking-service/app/admin/(authed)/services/actions.ts` (`ServiceActionResult`) and the
  earlier-shipped `apps/booking-service/app/admin/(authed)/actions.ts` (`UpdateStatusResult`) export a
  result TYPE directly from a `"use server"` file. The invariant says these modules should export only
  async functions; pure types belong in a plain module. No runtime exposure (TypeScript erases
  type-only exports before the server-action compiler pass), and it is a consistent pre-existing
  pattern — so it did not block the merge. Fix BOTH together: move the result types to a plain module
  (e.g. `lib/adminActionTypes.ts` or alongside the zod schemas) and import them as types.
- **LOW (dead error-probe branch).** `actions.ts` `isUniqueViolation` checks `err.message` contains
  `"23505"` as a fallback when `err.code` isn't `"23505"`. Neon/node-postgres always sets `.code`, so
  the message branch is dead. Harmless (returns a boolean, never echoes the message), but unnecessary
  surface — drop the message-string check, keep the `.code` check.
- **LOW (edit-page pre-DB uuid check).** `app/admin/(authed)/services/[id]/page.tsx` passes the raw
  `[id]` segment to `getServiceById` without a `z.string().uuid()` pre-check. No security issue
  (Drizzle parameterizes; a non-uuid simply returns null → `notFound()`), just one wasted DB
  round-trip on a crafted path. Optional: `safeParse` the id and `notFound()` early on a miss.
