"use client";

/**
 * AppRadioGroup — v3 MIGRATION (static-compound archetype, same shape as
 * `AppCard`).
 *
 * This wrapper now consumes HeroUI **v3** (`@heroui-v3/react`) while the rest of
 * the inventory still consumes v2 (`@heroui/react`). The two majors coexist via
 * pnpm aliases (Strategy A); see `packages/ui/package.json`.
 *
 * PUBLIC API IS PRESERVED. The barrel keeps importing `AppRadioGroup`,
 * `AppRadio`, `AppRadioGroupProps`, `AppRadioProps` BY NAME and the static member
 * `AppRadioGroup.Radio` keeps working. The explicit `Object.assign` +
 * intersection-type annotation is preserved verbatim from the v2 wrapper (it
 * guards `.d.ts` portability against TS2742 — every static member is a named,
 * exported component, so `tsc --declaration` never inlines a non-portable
 * internal HeroUI path).
 *
 * `AppRadioGroupProps` / `AppRadioProps` are HAND-WRITTEN anti-corruption
 * interfaces: they keep accepting the v2-era prop surface the call sites already
 * use, and this wrapper composes the v3 COMPOUND tree internally. So a consumer
 * still writes the flat form:
 *
 *   <AppRadioGroup label="Plan" value={v} onValueChange={setV}>
 *     <AppRadio value="a" description="...">Option A</AppRadio>
 *   </AppRadioGroup>
 *
 * ...and this file expands each `AppRadio` into the required
 * `Radio > Radio.Content > Radio.Control > Radio.Indicator` structure, with the
 * radio's `children` becoming the plain-text label.
 *
 * v3 RadioGroup/Radio API deltas handled here:
 *   - COMPOUND, two-level. v2's flat `<Radio>label</Radio>` becomes the v3
 *     `Radio.Content`/`Radio.Control`/`Radio.Indicator` tree; the label is a
 *     plain-text child of `Radio.Content` (v2 `labelPlacement` is GONE).
 *   - `color` GONE: the selected color comes from the theme `--primary` var,
 *     which the warm v3 theme aliases to the warm `--accent`. We drop the v2
 *     `color="primary"` default entirely (it is no longer a prop).
 *   - `size` / `radius` / `classNames` GONE (expressed via Tailwind / `className`).
 *   - `variant` is the only style axis now ("primary" | "secondary"); "primary"
 *     is the v3 default and we leave it implicit.
 *   - v2 `onValueChange` -> v3 `onChange((value: string) => void)`. We accept
 *     BOTH for back-compat and fan out to whichever (or both) are supplied.
 *   - `label` / `description` (v2 flat props) -> rendered as v3 `<Label>` /
 *     `<Description>` children at the TOP of the group, before the radios.
 *   - per-radio `description` -> a v3 `<Description>` sibling of `Radio.Content`
 *     inside the `Radio` (announced via `aria-describedby`).
 *
 * `orientation` is the one axis kept verbatim from v2.
 *
 * Token/styling note: there is NO warm `--success`/`--warning`/`--danger`, so the
 * v2 semantic `color` palette has no v3 equivalent — selected radios always read
 * the warm `--primary` (alias of `--accent`). This is intentional for the warm
 * coexistence theme; no CSS is edited here.
 *
 * Styling foundation: warm v3 CSS vars in `../../theme/v3/warmThemeV3.css`; the
 * group root scopes itself with `withV3Theme()` so radios are themed correctly
 * even when rendered outside an explicit wrapper element.
 */

import type { ReactNode } from "react";
import {
  RadioGroup as HeroV3RadioGroup,
  Radio as HeroV3Radio,
  Label as HeroV3Label,
  Description as HeroV3Description,
} from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/** v3 RadioGroup visual variant (the only style axis v3 exposes). */
export type AppRadioGroupVariant = "primary" | "secondary";

/**
 * PUBLIC, PRESERVED group props. Hand-written anti-corruption surface: the same
 * flat shape the v2 wrapper accepted, mapped onto the v3 compound API inside the
 * component. The removed v2 props (`color`/`size`/`radius`/`classNames`/
 * `labelPlacement`) are NOT part of the surface anymore.
 */
export interface AppRadioGroupProps {
  /**
   * The compound radios (AppRadio / AppRadioGroup.Radio nodes). Optional to
   * mirror v3/React-Aria `RadioGroupProps` (and to keep CSF stories that supply
   * children via `render` rather than `args` well-typed).
   */
  children?: ReactNode;
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial selected value. */
  defaultValue?: string;
  /** v3 change handler — receives the newly selected value. */
  onChange?: (value: string) => void;
  /**
   * v2-era change handler. Accepted for back-compat and mapped onto v3
   * `onChange`. If BOTH `onChange` and `onValueChange` are supplied, both fire.
   */
  onValueChange?: (value: string) => void;
  /** Layout axis (the one v2 style prop kept verbatim). */
  orientation?: "horizontal" | "vertical";
  /** v3 visual variant; defaults to the v3 "primary" (left implicit). */
  variant?: AppRadioGroupVariant;
  isDisabled?: boolean;
  isRequired?: boolean;
  /** Read-only: radios are visible + focusable but not selectable. */
  isReadOnly?: boolean;
  isInvalid?: boolean;
  /** HTML form field name. */
  name?: string;
  /** Visible accessible name — rendered as a v3 `<Label>` at the group top. */
  label?: ReactNode;
  /** Helper text — rendered as a v3 `<Description>` at the group top. */
  description?: ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * PUBLIC, PRESERVED radio props. Hand-written: keeps the v2 flat `<AppRadio
 * value="x">Label</AppRadio>` shape. Internally this composes the v3
 * `Radio.Content`/`Radio.Control`/`Radio.Indicator` tree with `children` as the
 * plain-text label. `color`/`size`/`classNames` are dropped (no longer a prop).
 */
export interface AppRadioProps {
  /** The option value (required by the radio group). */
  value: string;
  /** The radio's visible label (plain-text child of `Radio.Content`). */
  children: ReactNode;
  /** Optional helper text — rendered as a v3 `<Description>` inside the radio. */
  description?: ReactNode;
  isDisabled?: boolean;
  /** HTML form field name (rarely needed — usually inherited from the group). */
  name?: string;
  className?: string;
}

/**
 * AppRadio — composes the v3 compound tree for a single option. The radio's
 * `children` is the plain-text label living inside `Radio.Content` next to the
 * control; an optional `description` is a `Radio.Content` sibling (announced via
 * `aria-describedby`, per the v3 anatomy).
 */
export function AppRadio({
  value,
  children,
  description,
  isDisabled,
  name,
  className,
}: AppRadioProps) {
  return (
    <HeroV3Radio
      value={value}
      isDisabled={isDisabled}
      name={name}
      className={className}
    >
      <HeroV3Radio.Content>
        <HeroV3Radio.Control>
          <HeroV3Radio.Indicator />
        </HeroV3Radio.Control>
        {children}
      </HeroV3Radio.Content>
      {description != null ? (
        <HeroV3Description>{description}</HeroV3Description>
      ) : null}
    </HeroV3Radio>
  );
}

function AppRadioGroupRoot({
  children,
  value,
  defaultValue,
  onChange,
  onValueChange,
  orientation,
  variant,
  isDisabled,
  isRequired,
  isReadOnly,
  isInvalid,
  name,
  label,
  description,
  className,
  ...rest
}: AppRadioGroupProps) {
  // v2 `onValueChange` folds into v3 `onChange`. If both are supplied, fan out
  // to both so a mid-migration call site passing the legacy handler still works.
  const handleChange =
    onChange || onValueChange
      ? (next: string) => {
          onChange?.(next);
          onValueChange?.(next);
        }
      : undefined;

  return (
    <HeroV3RadioGroup
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      orientation={orientation}
      variant={variant}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
      name={name}
      className={withV3Theme(className)}
      {...rest}
    >
      {label != null ? <HeroV3Label>{label}</HeroV3Label> : null}
      {description != null ? (
        <HeroV3Description>{description}</HeroV3Description>
      ) : null}
      {children}
    </HeroV3RadioGroup>
  );
}

/**
 * Static-property attachment. PRESERVED verbatim from the v2 wrapper: the
 * EXPLICIT intersection type annotation (rather than relying on `Object.assign`
 * inference) keeps the emitted `.d.ts` portable — `AppRadioGroup.Radio` is a
 * named, exported component, so `tsc --declaration` never inlines a
 * non-portable internal HeroUI path (TS2742).
 */
export const AppRadioGroup: typeof AppRadioGroupRoot & {
  Radio: typeof AppRadio;
} = Object.assign(AppRadioGroupRoot, {
  Radio: AppRadio,
});
