"use client";

import { Alert as HeroAlert, type AlertProps } from "@heroui/react";

/**
 * AppAlert — ARCHETYPE 1: simple single-element passthrough (same shape as
 * `AppButton` / `AppChip`):
 *
 *   1. `"use client";` first (RSC-safe for web-next; Vite ignores it).
 *   2. Re-export HeroUI's own `AlertProps` verbatim as `AppAlertProps`.
 *   3. Apply the warm defaults via destructured props, then spread `...props`
 *      LAST so any call site can override them.
 *
 * Defaults: `radius="sm"` matches the rest of the inventory and `variant="flat"`
 * is the calm, low-contrast alert face that reads well in both themes (same call
 * as `AppChip`). `color` is intentionally NOT defaulted — alert colour is
 * semantic (success/warning/danger), so we leave HeroUI's `"default"` and let
 * each call site choose the meaning.
 */
export type AppAlertProps = AlertProps;

export function AppAlert({
  radius = "sm",
  variant = "flat",
  ...props
}: AppAlertProps) {
  return <HeroAlert radius={radius} variant={variant} {...props} />;
}
