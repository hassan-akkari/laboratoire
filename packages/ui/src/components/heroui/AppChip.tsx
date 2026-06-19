"use client";

import { Chip as HeroChip, type ChipProps } from "@heroui/react";

/**
 * AppChip — ARCHETYPE 1: simple single-element passthrough (same shape as
 * `AppButton`). The baseline wrapper pattern the whole inventory follows:
 *
 *   1. `"use client";` first (RSC-safe for web-next Phase 5; Vite ignores it).
 *   2. Re-export HeroUI's own prop type verbatim as `App<Name>Props` so the full
 *      prop surface (and its docs) flow through untouched.
 *   3. Apply the monorepo's warm defaults via destructured props, then spread
 *      `...props` LAST so every call site can override any default.
 *
 * Defaults: `color="primary"` and `radius="sm"` match `AppButton` for a
 * consistent look; `variant="flat"` is the calm, low-contrast chip face that
 * reads well against the warm background in both themes.
 */
export type AppChipProps = ChipProps;

export function AppChip({
  color = "primary",
  radius = "sm",
  variant = "flat",
  ...props
}: AppChipProps) {
  return (
    <HeroChip color={color} radius={radius} variant={variant} {...props} />
  );
}
