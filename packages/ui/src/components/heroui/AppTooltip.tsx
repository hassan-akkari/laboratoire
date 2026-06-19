"use client";

import { Tooltip as HeroTooltip, type TooltipProps } from "@heroui/react";

/**
 * AppTooltip — ARCHETYPE 1 variant: a leaf wrapper that WRAPS its children.
 *
 * Unlike a chip/button, the tooltip's `children` is the trigger element (it
 * stays untouched and rendered) while `content` is the floating bubble. We still
 * follow the baseline convention:
 *
 *   1. `"use client";` first (RSC-safe for web-next; Vite ignores it).
 *   2. Re-export HeroUI's own `TooltipProps` verbatim as `AppTooltipProps`.
 *   3. Apply tasteful warm defaults via destructured props, then spread
 *      `...props` LAST so call sites can override anything.
 *
 * Defaults: `color="default"` (a calm neutral bubble — colored tooltips read as
 * alerts, so we keep the resting state quiet), `radius="sm"` to match the rest
 * of the inventory, and `showArrow` so the bubble visibly points at its trigger.
 *
 * ACCESSIBILITY: HeroUI wires the tooltip to its trigger via React-Aria. Keep
 * the trigger focusable (e.g. a button/link) so keyboard users get the tooltip.
 */
export type AppTooltipProps = TooltipProps;

export function AppTooltip({
  color = "default",
  radius = "sm",
  showArrow = true,
  ...props
}: AppTooltipProps) {
  return (
    <HeroTooltip color={color} radius={radius} showArrow={showArrow} {...props} />
  );
}
