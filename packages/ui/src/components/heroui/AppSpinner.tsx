"use client";

import { Spinner as HeroSpinner, type SpinnerProps } from "@heroui/react";

/**
 * AppSpinner — ARCHETYPE 1: simple single-element passthrough (same shape as
 * `AppButton`/`AppChip`).
 *
 *   1. `"use client";` first (RSC-safe for web-next; Vite ignores it).
 *   2. Re-export HeroUI's own `SpinnerProps` verbatim as `AppSpinnerProps`.
 *   3. Apply the warm default (`color="primary"`) via a destructured prop, then
 *      spread `...props` LAST so any call site can override it.
 *
 * Default: `color="primary"` matches `AppButton`/`AppChip` so loading states sit
 * on the same warm accent. `size`/`variant` are left to HeroUI's defaults
 * (`md` / `default`) — those are already neutral and context-appropriate.
 *
 * ACCESSIBILITY: pass `label` for a visible, screen-reader-announced status, or
 * an `aria-label` if the spinner is purely decorative-adjacent. The stories
 * exercise `label` so the addon-a11y checks stay clean.
 */
export type AppSpinnerProps = SpinnerProps;

export function AppSpinner({ color = "primary", ...props }: AppSpinnerProps) {
  return <HeroSpinner color={color} {...props} />;
}
