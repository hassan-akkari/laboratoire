"use client";

/**
 * AppCheckbox — v3 MIGRATION (compound-form-control archetype).
 *
 * Now consumes HeroUI **v3** (`@heroui-v3/react`) while the rest of the inventory
 * still consumes v2 (`@heroui/react`). The two majors coexist via pnpm aliases
 * (Strategy A); see `packages/ui/package.json` and the AppButton/AppCard refs.
 *
 * THE PATTERN (same anti-corruption strategy as AppButton/AppCard)
 * ----------------------------------------------------------------
 * `AppCheckboxProps` is a HAND-WRITTEN interface (NOT `= CheckboxProps`). It keeps
 * accepting the v2-era prop surface the call sites already pass, and this wrapper
 * MAPS that surface onto the v3 compound API internally. The public contract
 * (`AppCheckbox` + `AppCheckboxProps`) is preserved so the barrel re-export and
 * any consumer keep working unchanged.
 *
 * v3 Checkbox API deltas handled here:
 *   - v3 is a headless COMPOUND: the single `<Checkbox/>` element is replaced by
 *     `Checkbox > Checkbox.Content > Checkbox.Control > Checkbox.Indicator`, with
 *     the LABEL being plain children inside `Checkbox.Content`. This wrapper takes
 *     the v2 `children` (the label) and renders the full tree internally, so call
 *     sites keep passing `<AppCheckbox>Label</AppCheckbox>` as before.
 *   - `color` GONE — the checked indicator fill comes from the theme `--accent`
 *     (warm brand). Dropped, not forwarded.
 *   - `radius` GONE — no rounding axis in v3. Dropped.
 *   - `classNames` GONE — replaced by a single `className` on the root field.
 *   - `size` GONE as a prop — sizing is a Tailwind class on `Checkbox.Control`.
 *     We keep accepting the v2 `size` ("sm"|"md"|"lg") and translate it to a
 *     `size-*` utility (sm->size-4, md->size-5, lg->size-6) so call sites are
 *     unaffected. See `CONTROL_SIZE_CLASS`.
 *   - `labelPlacement` GONE — label position is DOM order in `Checkbox.Content`
 *     (label after the control here = trailing label, the v2 default).
 *   - `variant` narrowed to "primary" | "secondary" (was a wider v2 union).
 *   - Event handler rename: v2 used `onValueChange`; v3 uses `onChange`
 *     ((isSelected: boolean) => void). We accept BOTH — `onValueChange` is mapped
 *     onto v3 `onChange`, and if a consumer passes both they are BOTH invoked.
 *
 * Styling foundation: warm v3 CSS vars in `../../theme/v3/warmThemeV3.css`; the
 * root field scopes itself with `withV3Theme()` so the checkbox is themed
 * correctly even when dropped outside an explicit wrapper element.
 *
 * Token note: there is NO warm `--danger` token in the foundation, so the v3
 * invalid state (`isInvalid`) renders with v3's built-in danger styling rather
 * than a warm-palette danger. This is a known foundation gap, not a wrapper bug.
 */

import { type ReactNode, type Ref } from "react";
import { Checkbox as HeroV3Checkbox } from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/** v3 visual variants (the only style axis v3 Checkbox exposes). */
export type AppCheckboxVariant = "primary" | "secondary";

/** v2-era size vocabulary the call sites/stories still pass. */
type V2Size = "sm" | "md" | "lg";

/**
 * PUBLIC, PRESERVED prop surface. Superset of the v2-era props the call sites and
 * stories pass to AppCheckbox. Internal mapping turns this into the v3 compound
 * tree. `color`/`radius`/`classNames`/`labelPlacement` are intentionally NOT here
 * (they no longer exist in v3).
 */
export interface AppCheckboxProps {
  /** The checkbox LABEL — rendered as plain children inside `Checkbox.Content`. */
  children?: ReactNode;
  /** Controlled checked state. */
  isSelected?: boolean;
  /** Uncontrolled initial checked state. */
  defaultSelected?: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  /** v3 visual variant. */
  variant?: AppCheckboxVariant;
  /** Form field name (HTML submission). */
  name?: string;
  /** Form field value (HTML submission). */
  value?: string;
  /**
   * v2 size — translated to a Tailwind `size-*` utility on `Checkbox.Control`
   * (sm->size-4, md->size-5, lg->size-6). Defaults to md.
   */
  size?: V2Size;
  /** Applied to the root `Checkbox` field (scoped with the v3 warm theme). */
  className?: string;
  /** v3 change handler: `(isSelected: boolean) => void`. */
  onChange?: (isSelected: boolean) => void;
  /**
   * v2-era change handler. Mapped onto v3 `onChange`. If BOTH `onValueChange`
   * and `onChange` are provided, both fire (onChange first, then onValueChange).
   */
  onValueChange?: (isSelected: boolean) => void;
  // Common pass-throughs.
  id?: string;
  // v3 Checkbox forwards its ref to the root field element (HTMLDivElement).
  ref?: Ref<HTMLDivElement>;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

/**
 * v3 dropped the `size` prop; sizing is a Tailwind utility on `Checkbox.Control`.
 * Map the v2 `size` vocabulary onto `size-*` classes, defaulting to md (size-5)
 * which matches the v3 docs' default control box.
 */
const CONTROL_SIZE_CLASS: Record<V2Size, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export function AppCheckbox({
  children,
  isSelected,
  defaultSelected,
  isIndeterminate,
  isDisabled,
  isInvalid,
  isReadOnly,
  isRequired,
  variant = "primary",
  name,
  value,
  size = "md",
  className,
  onChange,
  onValueChange,
  ref,
  ...rest
}: AppCheckboxProps) {
  // v2 `onValueChange` -> v3 `onChange`. If both are passed, fire both.
  const mergedOnChange: ((isSelected: boolean) => void) | undefined =
    onChange || onValueChange
      ? (next: boolean) => {
          onChange?.(next);
          onValueChange?.(next);
        }
      : undefined;

  return (
    <HeroV3Checkbox
      ref={ref}
      isSelected={isSelected}
      defaultSelected={defaultSelected}
      isIndeterminate={isIndeterminate}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      variant={variant}
      name={name}
      value={value}
      onChange={mergedOnChange}
      // Root field carries the warm v3 theme scope so the control/indicator
      // resolve `--accent` etc. even outside an explicit wrapper element.
      className={withV3Theme(className)}
      {...rest}
    >
      <HeroV3Checkbox.Content>
        {/* v2 `size` becomes a Tailwind `size-*` class on the control box. */}
        <HeroV3Checkbox.Control className={CONTROL_SIZE_CLASS[size]}>
          <HeroV3Checkbox.Indicator />
        </HeroV3Checkbox.Control>
        {/* v2 label (children) — trailing position == v2 default labelPlacement. */}
        {children}
      </HeroV3Checkbox.Content>
    </HeroV3Checkbox>
  );
}
