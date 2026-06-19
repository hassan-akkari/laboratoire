"use client";

import { Checkbox as HeroCheckbox, type CheckboxProps } from "@heroui/react";

/**
 * AppCheckbox — ARCHETYPE 1: simple single-element passthrough (same shape as
 * `AppButton` / `AppChip`):
 *
 *   1. `"use client";` first (RSC-safe for web-next; Vite ignores it).
 *   2. Re-export HeroUI's own `CheckboxProps` verbatim as `AppCheckboxProps`.
 *   3. Apply the warm defaults via destructured props, then spread `...props`
 *      LAST so any call site can override them.
 *
 * Defaults: `color="primary"` and `radius="sm"` match `AppButton`/`AppChip` for
 * a consistent look. HeroUI's Checkbox supports both (`color` + `radius` come
 * from `CheckboxVariantProps`); `size` is left to the consumer.
 */
export type AppCheckboxProps = CheckboxProps;

export function AppCheckbox({
  color = "primary",
  radius = "sm",
  ...props
}: AppCheckboxProps) {
  return <HeroCheckbox color={color} radius={radius} {...props} />;
}
