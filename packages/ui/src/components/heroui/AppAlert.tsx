"use client";

/**
 * AppAlert — v3 MIGRATION (compound-feedback archetype).
 *
 * Now consumes HeroUI **v3** (`@heroui-v3/react`) alongside the still-v2 rest of
 * the inventory (coexistence via pnpm aliases — see `packages/ui/package.json`).
 *
 * PUBLIC API IS PRESERVED. The barrel imports `AppAlert` + `AppAlertProps` by
 * name; both keep their old shape. `AppAlertProps` is a HAND-WRITTEN
 * anti-corruption interface (NOT `= AlertProps`): it keeps accepting the
 * convenient v2-era surface (`color`/`title`/`description`/`icon`/`hideIcon`)
 * the call sites and stories already pass, and this wrapper composes that onto
 * the v3 COMPOUND tree internally.
 *
 * v3 Alert API deltas handled here:
 *   - v2 `color` is RENAMED to v3 `status`. We map the v2 vocabulary:
 *       primary   -> accent   (v3 "accent" replaces v2 "primary")
 *       secondary -> default
 *       default / success / warning / danger -> pass through unchanged.
 *     A v3-native `status` may also be passed directly; if BOTH `status` and
 *     `color` are given, `status` wins (explicit v3 intent over the legacy alias).
 *   - v2 `title` / `description` -> the `<Alert.Title>` / `<Alert.Description>`
 *     compound members. Free-form `children` are appended inside `<Alert.Content>`
 *     so a call site can still pass arbitrary body content.
 *   - v2 `icon` -> custom `<Alert.Indicator>` child; `hideIcon` omits the
 *     indicator entirely (v3 has no `hideIcon` prop — expressed structurally).
 *   - v2 `variant` (solid/bordered/flat/faded) is GONE — `status` drives the
 *     whole look in v3; the prop is dropped (not forwarded).
 *   - v2 `radius` / `classNames` are GONE — dropped; use Tailwind `className`.
 *   - v2 `isClosable` / `onClose` / `endContent` are GONE — v3 expresses a close
 *     affordance compositionally via a `<CloseButton/>` child. Not part of this
 *     wrapper's preserved surface (no call site used them); add a child if needed.
 *
 * Token / styling note: warm v3 CSS vars live in `../../theme/v3/warmThemeV3.css`.
 * `status="accent"` reads `--accent` (warm indigo). There are NO warm
 * `--success` / `--warning` / `--danger` overrides, so those three statuses fall
 * back to the `@heroui-v3/styles` defaults — a deliberate gap (semantic status
 * colors stay standard, not warm-tinted). The root is scoped with
 * `withV3Theme()` so the alert is correctly themed even outside a wrapper.
 */

import type { ReactNode } from "react";
import { Alert as HeroV3Alert } from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/** v3 semantic status axis (the only style axis v3 Alert exposes). */
export type AppAlertStatus =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "danger";

/** v2-era `color` strings the docs/stories still pass. */
type V2AlertColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

/**
 * PUBLIC, PRESERVED prop surface. Superset of every prop the call sites and the
 * packages/ui stories pass to AppAlert today, plus the v3-native escape hatch
 * (`status` may be passed directly). Internal mapping turns this into the v3
 * compound tree.
 */
export interface AppAlertProps {
  /** v3-native status axis. If set, it WINS over `color`. */
  status?: AppAlertStatus;
  /** v2 semantic `color` — mapped to v3 `status` (primary->accent, secondary->default). */
  color?: V2AlertColor;
  /** Convenience: rendered as `<Alert.Title>`. */
  title?: ReactNode;
  /** Convenience: rendered as `<Alert.Description>`. */
  description?: ReactNode;
  /** Extra body content, appended inside `<Alert.Content>` after title/description. */
  children?: ReactNode;
  /** Custom indicator icon -> `<Alert.Indicator>{icon}</Alert.Indicator>`. */
  icon?: ReactNode;
  /** When true, omit the `<Alert.Indicator>` entirely (v3 has no `hideIcon`). */
  hideIcon?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * Map the v2 `color` vocabulary onto the v3 `status` axis.
 *   primary   -> accent   (accent replaces primary in v3)
 *   secondary -> default
 *   default / success / warning / danger -> identity
 */
export function toV3Status(color: V2AlertColor | undefined): AppAlertStatus {
  switch (color) {
    case "primary":
      return "accent";
    case "secondary":
      return "default";
    case "success":
    case "warning":
    case "danger":
      return color;
    case "default":
    case undefined:
    default:
      return "default";
  }
}

export function AppAlert({
  status,
  color,
  title,
  description,
  children,
  icon,
  hideIcon,
  className,
  ...rest
}: AppAlertProps) {
  // Explicit v3 `status` wins; otherwise fold the v2 `color` alias.
  const v3Status: AppAlertStatus = status ?? toV3Status(color);

  return (
    <HeroV3Alert
      status={v3Status}
      className={withV3Theme(className)}
      {...rest}
    >
      {!hideIcon && <HeroV3Alert.Indicator>{icon}</HeroV3Alert.Indicator>}
      <HeroV3Alert.Content>
        {title && <HeroV3Alert.Title>{title}</HeroV3Alert.Title>}
        {description && (
          <HeroV3Alert.Description>{description}</HeroV3Alert.Description>
        )}
        {children}
      </HeroV3Alert.Content>
    </HeroV3Alert>
  );
}
