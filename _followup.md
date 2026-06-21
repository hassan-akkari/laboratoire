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
