"use client";

import { Divider as HeroDivider, type DividerProps } from "@heroui/react";

/**
 * AppDivider — ARCHETYPE 1: simple single-element passthrough (same shape as
 * `AppButton`/`AppChip`).
 *
 *   1. `"use client";` first (RSC-safe for web-next; Vite ignores it).
 *   2. Re-export HeroUI's own `DividerProps` verbatim as `AppDividerProps`.
 *   3. Spread `...props` LAST so every call site can override anything.
 *
 * NO defaults: a divider is a pure structural separator. Its only meaningful
 * knob is `orientation` (`"horizontal"` default in HeroUI) and HeroUI's own
 * default is already the right one, so adding a default here would only risk
 * fighting a consumer's layout. Kept as a clean passthrough on purpose.
 */
export type AppDividerProps = DividerProps;

export function AppDivider(props: AppDividerProps) {
  return <HeroDivider {...props} />;
}
