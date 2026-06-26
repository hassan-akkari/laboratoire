"use client";

/**
 * AppSpinner — v3 MIGRATION (simple single-element archetype; cf. AppButton).
 *
 * Now consumes HeroUI **v3** (`@heroui-v3/react`) while the rest of the inventory
 * still consumes v2 (`@heroui/react`). The two majors coexist via pnpm aliases
 * (Strategy A); see `packages/ui/package.json`.
 *
 * THE PATTERN (same anti-corruption discipline as AppButton/AppCard)
 * -----------------------------------------------------------------
 * `AppSpinnerProps` is a HAND-WRITTEN interface (NOT `= SpinnerProps`) so the
 * public contract keeps accepting the v2-era prop surface the docs/stories pass.
 * The wrapper MAPS that surface onto the v3 API internally. Public exports
 * (`AppSpinner` + `AppSpinnerProps`) are preserved byte-for-byte at the barrel.
 *
 * v3 Spinner API deltas handled here:
 *   - `size` now also accepts `"xl"` (v3 adds it; v2 maxed at `lg`). Passed
 *     through unchanged for the shared sizes.
 *   - `color` REMAPPED. v3 vocabulary is `current | accent | success | warning
 *     | danger` (default `current` = inherits text color). There is NO
 *     `primary`/`secondary`/`default`/`white`. We map the v2 vocab via
 *     `toV3Color()`: `primary -> accent` (preserving the old warm-accent
 *     default), `default`/`secondary`/`white`/`current` -> `current`, and
 *     `success`/`warning`/`danger` pass through.
 *   - WARM DEFAULT preserved: the v2 wrapper defaulted to `color="primary"`
 *     (warm accent). We keep that by defaulting to v3 `"accent"`, which resolves
 *     `--accent` from the warm v3 theme via `withV3Theme()`.
 *   - `variant` GONE (no `simple`/`gradient`/`wave`/`dots`/`spinner` axis in v3)
 *     -> accepted-and-ignored so existing call sites still typecheck.
 *   - `classNames` GONE -> dropped; use `className`.
 *   - `label` / `labelColor` NOT documented in v3 -> NOT rendered as a visible
 *     label. Instead, `label` is folded into the spinner's `aria-label` (only if
 *     no explicit `aria-label` is given) so the status stays screen-reader
 *     announced and addon-a11y stays clean. `labelColor` is accepted-and-ignored.
 *
 * Token/styling gap: v3 ships defaults for `--success`/`--warning`/`--danger`;
 * the warm theme intentionally defines NO warm overrides for those, so a
 * non-accent `color` falls back to `@heroui-v3/styles` defaults. The warm
 * surface scope is still applied via `withV3Theme()` so `accent`/`current`
 * resolve against the warm palette.
 */

import {
  Spinner as HeroV3Spinner,
  type SpinnerProps as HeroV3SpinnerProps,
} from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/** v3 semantic colors (the only color axis v3 Spinner exposes). */
export type AppSpinnerColor = NonNullable<HeroV3SpinnerProps["color"]>;

/** v2-era `color` strings the docs/stories still pass. */
type V2SpinnerColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "current"
  | "white";

/** v2-era `variant` strings — GONE in v3; accepted-and-ignored. */
type V2SpinnerVariant =
  | "default"
  | "simple"
  | "gradient"
  | "wave"
  | "dots"
  | "spinner";

/** v3 size axis (adds `xl` over the v2 `sm | md | lg`). */
type V3Size = NonNullable<HeroV3SpinnerProps["size"]>;

/**
 * PUBLIC, PRESERVED prop surface. Superset of every prop the docs (and the
 * packages/ui stories) pass to AppSpinner today, plus the v3-native escape hatch
 * (`color`/`size` may be v3 values directly). Internal mapping turns this into v3.
 */
export interface AppSpinnerProps {
  /**
   * Semantic color. Accepts BOTH the v2 vocabulary
   * (default/primary/secondary/white/...) and the v3 vocabulary
   * (current/accent/success/warning/danger). v2 values are mapped via
   * `toV3Color()`. Defaults to `accent` (the warm accent — preserves the v2
   * `color="primary"` default).
   */
  color?: V2SpinnerColor | AppSpinnerColor;
  /** v3 size — now also accepts `xl`. */
  size?: V3Size;
  /** v2 `variant` — GONE in v3. Accepted for back-compat, then dropped. */
  variant?: V2SpinnerVariant;
  /** v2 `labelColor` — GONE in v3 (no visible label). Accepted, then dropped. */
  labelColor?: V2SpinnerColor;
  /**
   * v2 visible status label. v3 has no label slot, so this is NOT rendered; it
   * is folded into `aria-label` (unless an explicit `aria-label` is supplied) so
   * the loading status stays screen-reader announced.
   */
  label?: string;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-hidden"?: boolean;
}

/**
 * Map the v2 `color` vocabulary onto a v3 `color`.
 *
 * Rules (from the migration spec):
 *   primary                          -> accent (preserves the warm default)
 *   default / secondary / white      -> current (no v3 equivalent; inherit text)
 *   success / warning / danger       -> pass through
 *   current / accent                 -> pass through (already v3)
 */
export function toV3Color(color: AppSpinnerProps["color"]): AppSpinnerColor {
  switch (color) {
    case "primary":
    case "accent":
      return "accent";
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "danger":
      return "danger";
    case "default":
    case "secondary":
    case "white":
    case "current":
    default:
      return "current";
  }
}

export function AppSpinner({
  color = "accent",
  size,
  variant: _variant,
  labelColor: _labelColor,
  label,
  className,
  "aria-label": ariaLabel,
  ...rest
}: AppSpinnerProps) {
  // `variant`/`labelColor` are intentionally destructured-and-ignored (v3 drops
  // both); the leading-underscore names document the deliberate discard for
  // `noUnusedLocals`.
  void _variant;
  void _labelColor;

  // v3 Spinner renders a role-less <span>, so an `aria-label` alone is NOT
  // announced. When an accessible label exists (explicit aria-label or the v2
  // `label`), also set role="status" so screen readers announce the loading
  // state; otherwise leave the spinner purely decorative.
  const accessibleLabel = ariaLabel ?? label;

  return (
    <HeroV3Spinner
      color={toV3Color(color)}
      size={size}
      className={withV3Theme(className)}
      role={accessibleLabel ? "status" : undefined}
      aria-label={accessibleLabel}
      {...rest}
    />
  );
}
