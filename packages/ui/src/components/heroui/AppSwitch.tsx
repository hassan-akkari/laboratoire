"use client";

/**
 * AppSwitch — v3 MIGRATION (headless-COMPOUND archetype reference).
 *
 * This wrapper consumes HeroUI **v3** (`@heroui-v3/react`) while the rest of the
 * inventory still consumes v2 (`@heroui/react`). The two majors coexist via pnpm
 * aliases (Strategy A); see `packages/ui/package.json`. Migrate one wrapper at a
 * time — do NOT touch the others.
 *
 * THE PATTERN (same anti-corruption shape as AppButton/AppCard)
 * ------------------------------------------------------------
 * v3 Switch is a hard API break: it is now a HEADLESS COMPOUND tree
 * (`Switch` > `Switch.Content` > `Switch.Control` > `Switch.Thumb`) instead of
 * the v2 single self-contained element. To keep the migration incremental, the
 * PUBLIC contract (`AppSwitch` + `AppSwitchProps`) is preserved: `AppSwitchProps`
 * is a HAND-WRITTEN anti-corruption interface that keeps accepting the v2-era
 * prop surface, and this wrapper MAPS that surface onto the v3 compound tree
 * internally. The barrel still imports `AppSwitch` + `AppSwitchProps` by name.
 *
 * v3 Switch API deltas handled here:
 *   - COMPOUND TREE: v2's single `<Switch>` becomes
 *       <Switch> <Switch.Content> <Switch.Control> <Switch.Thumb/> </Switch.Control>
 *         {label} </Switch.Content> </Switch>
 *     The wrapper builds this tree so call sites keep passing flat props.
 *   - `children` is now the LABEL TEXT, placed inside `Switch.Content` AFTER the
 *     control (v3 derives label position from DOM order; we default to "after").
 *     A switch with no `children` is valid — we then render only the control and
 *     rely on the consumer's `aria-label` for the accessible name.
 *   - `color` GONE: the selected-track color comes from the theme (warm `--accent`
 *     via `--primary` alias). v2 `color` is accepted-but-dropped (no warm
 *     success/warning/danger tokens exist anyway).
 *   - `variant` / `radius` / `classNames` / `labelPlacement` GONE: dropped (not
 *     part of the v3 surface). `size` (sm/md/lg) is KEPT and forwarded.
 *   - v2 `onValueChange` -> v3 `onChange` ((isSelected: boolean) => void). Both
 *     are accepted; if both are supplied, BOTH fire (onChange first, then
 *     onValueChange) so neither call site contract is silently dropped.
 *   - v2 `thumbIcon` / `startContent` / `endContent` -> a single `thumbIcon` slot
 *     rendered as `<Switch.Icon>` inside `<Switch.Thumb>` (the only v3 icon slot).
 *   - `className` is applied to the root `.switch` field via `withV3Theme()`.
 *
 * AppSwitch has NO app call sites — `ThemeToggle.tsx` uses the RAW v2 `Switch`
 * directly, not this wrapper — so this migration is internally contained. We
 * still keep a clean, stable public surface for eventual adopters.
 *
 * Styling foundation: warm v3 CSS vars live in `../../theme/v3/warmThemeV3.css`;
 * the root scopes itself with `withV3Theme()` so the switch is themed correctly
 * even when dropped outside an explicit wrapper element.
 */

import { type ReactNode } from "react";
import {
  Switch as HeroV3Switch,
  type SwitchProps as HeroV3SwitchProps,
} from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

type V3Size = "sm" | "md" | "lg";

/**
 * PUBLIC, PRESERVED prop surface. Superset of the v2-era props the wrapper used
 * to accept (it re-exported HeroUI's `SwitchProps`), trimmed to the axes that
 * survive in v3 plus the back-compat escape hatches the apps/stories rely on.
 * The wrapper maps this onto the v3 compound tree internally.
 */
export interface AppSwitchProps {
  /** Label text — rendered inside `Switch.Content` after the control. */
  children?: ReactNode;
  size?: V3Size;
  /** Controlled selected state. */
  isSelected?: boolean;
  /** Uncontrolled initial selected state. */
  defaultSelected?: boolean;
  isDisabled?: boolean;
  /** Marks the field invalid (v3/React-Aria SwitchField). */
  isInvalid?: boolean;
  /** Read-only: visible + focusable but not togglable. */
  isReadOnly?: boolean;
  /** Required in an HTML form / for validation. */
  isRequired?: boolean;
  /** v3/react-aria press handler (fires on activation). */
  onPress?: HeroV3SwitchProps["onPress"];
  /** Form field name (used when submitting an HTML form). */
  name?: string;
  /** Form field value (used when submitting an HTML form). */
  value?: string;
  /** Applied to the root `.switch` field element (themed via withV3Theme). */
  className?: string;
  /** v3 change handler. */
  onChange?: (isSelected: boolean) => void;
  /**
   * v2-era change handler. Mapped onto v3 `onChange`. If BOTH `onChange` and
   * `onValueChange` are supplied, both fire (onChange first) so no call site
   * contract is silently dropped.
   */
  onValueChange?: (isSelected: boolean) => void;
  /**
   * v2 `thumbIcon`/`startContent`/`endContent` collapse to this single slot,
   * rendered as `<Switch.Icon>` inside `<Switch.Thumb>` (the only v3 icon slot).
   */
  thumbIcon?: ReactNode;
  // Common pass-throughs (no warm color axis: selected track is theme-driven).
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export function AppSwitch({
  children,
  size = "md",
  isSelected,
  defaultSelected,
  isDisabled,
  isInvalid,
  isReadOnly,
  isRequired,
  onPress,
  name,
  value,
  className,
  onChange,
  onValueChange,
  thumbIcon,
  ...rest
}: AppSwitchProps) {
  // v2 `onValueChange` -> v3 `onChange`. If both are given, fire onChange first
  // then onValueChange so neither call-site contract is dropped.
  const mergedOnChange: ((selected: boolean) => void) | undefined =
    onChange || onValueChange
      ? (selected) => {
          onChange?.(selected);
          onValueChange?.(selected);
        }
      : undefined;

  // The thumb. v2's thumbIcon/startContent/endContent all funnel into the single
  // v3 `Switch.Icon` slot nested inside `Switch.Thumb`.
  const thumb = thumbIcon ? (
    <HeroV3Switch.Thumb>
      <HeroV3Switch.Icon>{thumbIcon}</HeroV3Switch.Icon>
    </HeroV3Switch.Thumb>
  ) : (
    <HeroV3Switch.Thumb />
  );

  const control = (
    <HeroV3Switch.Control>{thumb}</HeroV3Switch.Control>
  );

  return (
    <HeroV3Switch
      size={size}
      isSelected={isSelected}
      defaultSelected={defaultSelected}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      onPress={onPress}
      name={name}
      value={value}
      onChange={mergedOnChange}
      className={withV3Theme(className)}
      {...rest}
    >
      <HeroV3Switch.Content>
        {control}
        {/* Label after the control (v3 reads position from DOM order). Render
            the label only when children are present; a switch with no label is
            valid and relies on the consumer's aria-label. */}
        {children}
      </HeroV3Switch.Content>
    </HeroV3Switch>
  );
}
