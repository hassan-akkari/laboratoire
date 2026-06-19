"use client";

import {
  RadioGroup as HeroRadioGroup,
  Radio as HeroRadio,
  type RadioGroupProps,
  type RadioProps,
} from "@heroui/react";

/**
 * AppRadioGroup — ARCHETYPE 2: STATIC COMPOUND component (same pattern as
 * `AppCard`).
 *
 * HeroUI ships a parent (`RadioGroup`) plus the item (`Radio`). We wrap `Radio`
 * as `AppRadio` (a thin passthrough), re-export it as a NAMED export, AND attach
 * it to the root as a static member so consumers can write EITHER:
 *
 *   import { AppRadioGroup, AppRadio } from "@laboratoire/ui";
 *   <AppRadioGroup><AppRadio value="a">A</AppRadio></AppRadioGroup>
 *
 * OR the dot-namespaced form:
 *
 *   <AppRadioGroup><AppRadioGroup.Radio value="a">A</AppRadioGroup.Radio></AppRadioGroup>
 *
 * `Radio` MUST stay a direct descendant of `RadioGroup` (HeroUI reads group
 * context via React-Aria), so `AppRadio` is a pure passthrough that introduces
 * no intermediate element.
 *
 * Defaults: `color="primary"` on the group (matches `AppButton`/`AppChip`; the
 * accent cascades to its radios via group context). `orientation` is left to
 * HeroUI's `"vertical"` default. `AppRadio` carries NO defaults — it inherits
 * `color`/`size` from the group, so adding any here would shadow that cascade.
 *
 * ACCESSIBILITY: give the group an accessible name via `label` (visible) or
 * `aria-label`. Each `AppRadio` needs a `value`; its children become the label.
 */
export type AppRadioGroupProps = RadioGroupProps;
export type AppRadioProps = RadioProps;

export function AppRadio(props: AppRadioProps) {
  return <HeroRadio {...props} />;
}

function AppRadioGroupRoot({ color = "primary", ...props }: AppRadioGroupProps) {
  return <HeroRadioGroup color={color} {...props} />;
}

/**
 * Explicit intersection annotation keeps the static member in the emitted
 * `.d.ts` while staying portable for `tsc --declaration` (every member is a
 * named, exported component → no inlined non-portable HeroUI path, TS2742).
 */
export const AppRadioGroup: typeof AppRadioGroupRoot & {
  Radio: typeof AppRadio;
} = Object.assign(AppRadioGroupRoot, {
  Radio: AppRadio,
});
