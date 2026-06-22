"use client";

/**
 * AppChip — v3 MIGRATION (simple single-element archetype, sibling of AppButton).
 *
 * Now consumes HeroUI **v3** (`@heroui-v3/react`) while the rest of the inventory
 * still consumes v2 (`@heroui/react`). The two majors coexist via pnpm aliases
 * (Strategy A); see `packages/ui/package.json`.
 *
 * THE PATTERN (same anti-corruption shape as AppButton)
 * -----------------------------------------------------
 * v3 is a hard API break. To migrate INCREMENTALLY without editing the existing
 * call sites, `AppChipProps` is a HAND-WRITTEN anti-corruption interface: it keeps
 * accepting the v2-era prop surface the apps already pass (`color` / `variant` /
 * `size` / `radius`), and this wrapper MAPS that surface onto the v3 API
 * internally via `toV3ChipColor()` + `toV3ChipVariant()`. The public contract
 * (`AppChip` + `AppChipProps`) is preserved at the call site.
 *
 * v3 Chip API deltas handled here:
 *   - `color`: REMAPPED. v3 has NO `primary`/`secondary` colors; the warm brand
 *     accent moved to `color="accent"`. So v2 `primary` -> v3 `accent`; v2
 *     `secondary` has no v3 equivalent -> falls back to `default`;
 *     success/warning/danger/default pass through. See `toV3ChipColor()`.
 *   - `variant`: VALUES CHANGED. v2 (solid/bordered/flat/light/faded/shadow/dot)
 *     collapse onto v3 (primary/secondary/tertiary/soft). See `toV3ChipVariant()`.
 *   - `radius`: GONE in v3 -> accepted on the surface but DROPPED (no-op).
 *   - `classNames` / `onClose` / dismiss: not part of the v3 documented surface;
 *     not forwarded.
 *
 * Default mapping mirrors the calm low-contrast v2 face (the old wrapper defaulted
 * `color="primary"`, `variant="flat"`): we default to v3 `color="accent"`,
 * `variant="soft"` — the comparable calm, low-contrast v3 look.
 *
 * Token/styling gap: the warm v3 palette defines `--accent` (+ `--primary` alias)
 * but NO warm `--success`/`--warning`/`--danger`; those colors fall back to the
 * `@heroui-v3/styles` defaults. Plain-string children keep working because v3
 * auto-wraps text in `<Chip.Label>`.
 *
 * Styling foundation: warm v3 CSS vars in `../../theme/v3/warmThemeV3.css`; the
 * rendered root scopes itself with `withV3Theme()` so the chip is correctly
 * themed even when dropped outside an explicit wrapper element.
 */

import type { ReactNode } from "react";
import { Chip as HeroV3Chip } from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/** v3 chip color axis (the only colors v3 Chip exposes). */
export type AppChipColor = "default" | "accent" | "success" | "warning" | "danger";

/** v3 chip visual variants. */
export type AppChipVariant = "primary" | "secondary" | "tertiary" | "soft";

/** v2-era `color` strings the docs/stories still pass. */
type V2ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

/** v2-era `variant` strings the docs/stories still pass. */
type V2ChipVariant =
  | "solid"
  | "bordered"
  | "light"
  | "flat"
  | "faded"
  | "shadow"
  | "dot";

type V3Size = "sm" | "md" | "lg";

/**
 * PUBLIC, PRESERVED prop surface. Superset of every prop the docs (and the
 * packages/ui stories) pass to AppChip today, plus the v3-native escape hatch
 * (`color`/`variant` may be a v3 value directly). Internal mapping turns this
 * into the v3 surface.
 */
export interface AppChipProps {
  children?: ReactNode;
  /**
   * Semantic color. Accepts BOTH the v2 vocabulary
   * (default/primary/secondary/success/warning/danger) and the v3 vocabulary
   * (default/accent/success/warning/danger). v2 values are mapped via
   * `toV3ChipColor()` (primary -> accent; secondary -> default).
   */
  color?: V2ChipColor | AppChipColor;
  /**
   * Visual style. Accepts BOTH the v2 vocabulary
   * (solid/bordered/flat/light/faded/shadow/dot) and the v3 vocabulary
   * (primary/secondary/tertiary/soft). v2 values are mapped via
   * `toV3ChipVariant()`.
   */
  variant?: V2ChipVariant | AppChipVariant;
  /** v2 `radius` — accepted but DROPPED (no-op axis in v3). */
  radius?: "none" | "sm" | "md" | "lg" | "full";
  size?: V3Size;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-hidden"?: boolean;
}

/**
 * Map the v2 `color` vocabulary onto the v3 `color` axis.
 *
 * Rules (from the migration spec):
 *   primary           -> accent   (the warm brand accent moved name in v3)
 *   secondary         -> default  (no v3 equivalent — calm fallback)
 *   default           -> default
 *   success/warning/danger -> pass through
 * A v3 color passed directly (`accent`) is honored as-is.
 */
export function toV3ChipColor(color: AppChipProps["color"]): AppChipColor {
  switch (color) {
    case "primary":
    case "accent":
      return "accent";
    // v2 `secondary` has no v3 equivalent -> calm `default` fallback.
    case "secondary":
    case "default":
      return "default";
    case "success":
    case "warning":
    case "danger":
      return color;
    // undefined / anything unexpected -> the wrapper's default accent.
    case undefined:
    default:
      return "accent";
  }
}

/**
 * Map the v2 `variant` vocabulary onto the v3 `variant` axis.
 *
 * Rules (calm-first, mirroring the v2 wrapper's low-contrast intent):
 *   solid / shadow            -> primary    (filled background)
 *   bordered                  -> secondary  (border)
 *   light / dot               -> tertiary   (transparent background)
 *   flat / faded              -> soft        (lighter background — the calm face)
 * A v3 variant passed directly is honored as-is.
 */
export function toV3ChipVariant(
  variant: AppChipProps["variant"],
): AppChipVariant {
  switch (variant) {
    // Pass-through: already a v3 variant.
    case "primary":
    case "secondary":
    case "tertiary":
    case "soft":
      return variant;
    case "solid":
    case "shadow":
      return "primary";
    case "bordered":
      return "secondary";
    case "light":
    case "dot":
      return "tertiary";
    case "flat":
    case "faded":
    case undefined:
    default:
      return "soft";
  }
}

export function AppChip({
  children,
  // Defaults mirror the calm low-contrast v2 face (v2: color="primary",
  // variant="flat"): the comparable v3 look is accent + soft.
  color = "accent",
  variant = "soft",
  // `radius` is accepted (v2 call sites pass it) but DROPPED — v3 has no radius.
  radius: _radius,
  size = "md",
  className,
  ...rest
}: AppChipProps) {
  void _radius;
  return (
    <HeroV3Chip
      color={toV3ChipColor(color)}
      variant={toV3ChipVariant(variant)}
      size={size}
      className={withV3Theme(className)}
      {...rest}
    >
      {children}
    </HeroV3Chip>
  );
}
