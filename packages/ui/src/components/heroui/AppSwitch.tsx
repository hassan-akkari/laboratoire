"use client";

import { Switch as HeroSwitch, type SwitchProps } from "@heroui/react";

/**
 * AppSwitch — ARCHETYPE 1: simple single-element passthrough (same shape as
 * `AppButton` / `AppChip`):
 *
 *   1. `"use client";` first (RSC-safe for web-next; Vite ignores it).
 *   2. Re-export HeroUI's own `SwitchProps` verbatim as `AppSwitchProps`.
 *   3. Apply the warm default via destructured props, then spread `...props`
 *      LAST so any call site can override it.
 *
 * Defaults: `color="primary"` matches `AppButton`/`AppChip`. NOTE: HeroUI's
 * Switch (`ToggleVariantProps`) only exposes `size` + `color` — there is NO
 * `radius` prop — so we do not set one. `size` is left to the consumer.
 */
export type AppSwitchProps = SwitchProps;

export function AppSwitch({ color = "primary", ...props }: AppSwitchProps) {
  return <HeroSwitch color={color} {...props} />;
}
