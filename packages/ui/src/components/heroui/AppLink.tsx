"use client";

import { Link as HeroLink, type LinkProps } from "@heroui/react";

/**
 * AppLink — ARCHETYPE 1: simple single-element passthrough (same shape as
 * `AppButton` / `AppChip`). Wraps HeroUI's own `Link`:
 *
 *   1. `"use client";` first (RSC-safe for web-next; Vite ignores it).
 *   2. Re-export HeroUI's own `LinkProps` verbatim as `AppLinkProps`.
 *   3. Apply the warm default via destructured props, then spread `...props`
 *      LAST so any call site can override it.
 *
 * Defaults: `color="primary"` matches `AppButton`/`AppChip` (HeroUI's own Link
 * default is `"foreground"`). NOTE: `LinkVariantProps` exposes `color`, `size`,
 * `underline`, `isBlock` — there is NO `radius` prop, so we do not set one.
 */
export type AppLinkProps = LinkProps;

export function AppLink({ color = "primary", ...props }: AppLinkProps) {
  return <HeroLink color={color} {...props} />;
}
