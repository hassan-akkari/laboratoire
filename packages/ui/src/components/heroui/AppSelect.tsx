"use client";

/**
 * AppSelect — FIELD-SLICE v3 MIGRATION (collection / overlay archetype).
 *
 * Now consumes HeroUI **v3** (`@heroui-v3/react`) alongside the still-v2 rest of
 * the inventory (coexistence via pnpm aliases — see `packages/ui/package.json`).
 *
 * THE v3 API BREAK (the hardest of the field slice)
 * -------------------------------------------------
 * v2 shipped a single "fat" generic `Select<T>` whose options were `SelectItem`
 * children and whose selection was the Set-based `selectedKeys: Selection` /
 * `onSelectionChange: (Selection) => void` pair. v3 decomposes this into a
 * COMPOUND OVERLAY:
 *
 *   <Select selectionMode value/onChange isInvalid isRequired isDisabled aria-label>
 *     <Label/>                          // label is a CHILD, not a prop
 *     <Select.Trigger><Select.Value/><Select.Indicator/></Select.Trigger>
 *     <Select.Popover>
 *       <ListBox items selectionMode> ...ListBox.Item... </ListBox>   // options
 *     </Select.Popover>
 *     <FieldError/>                     // error is a CHILD, not a prop
 *   </Select>
 *
 * There is NO `Select.Item` / `Select.Section` in v3 — options are `ListBox.Item`
 * / `ListBox.Section`. The Select ROOT accepts only `variant: "primary"|"secondary"`
 * + `fullWidth` for styling (NO `color`/`size`/`radius`/`labelPlacement`).
 *
 * SELECTION TRANSLATION (v2 Set-based surface -> v3 native value/onChange)
 * -----------------------------------------------------------------------
 * The 7 stories (the SPEC) pass the v2 surface: `selectedKeys: Selection`
 * (`"all" | Set<Key>`), `onSelectionChange: (Selection) => void`, `selectionMode`.
 * v3's react-aria Select OWNS selection state via `value`/`onChange`
 * (single: `Key | null`; multiple: `Key[]`). This wrapper TRANSLATES both ways so
 * the Set-based consumer surface keeps working and the Select state is real:
 *   - controlled-in:  Selection -> value  (single: first key; multiple: array)
 *   - change-out:     value     -> Selection (rebuild a Set, call consumer)
 * `"all"` collapses to an empty selection (there is no "all" concept on a Select).
 *
 * COLLECTION CHILDREN (preserved conventions)
 * -------------------------------------------
 *   - `AppSelectItem` maps the v2 `SelectItem` onto `ListBox.Item`: the v2 `key`
 *     prop becomes the react-aria collection key (react-aria reads the React
 *     `key` of a collection child when no explicit `id` is set — same mechanism
 *     the v2 wrapper relied on), and `textValue` is derived from string children
 *     when not supplied (typeahead + accessible value).
 *   - `AppSelectSection` maps onto `ListBox.Section`.
 *   - Both stay DIRECT descendants in the rendered tree (react-aria walks the JSX
 *     collection) and are attached as static `AppSelect.Item` / `AppSelect.Section`
 *     via `Object.assign` + an EXPLICIT intersection annotation (guards `.d.ts`
 *     portability against TS2742 — copies the v2 AppCard/AppSelect shape).
 *   - The dynamic `items` API + render-prop child are preserved: `items` flows to
 *     the inner `<ListBox>`, and a function child is forwarded as the ListBox's
 *     render function (the Empty story passes `items: []` + `() => <Item/>`).
 *
 * ACCESSIBILITY: provide `label` (visible `<Label>`) OR `aria-label` (label is
 * visual-only). Stories exercise both so addon-a11y stays clean.
 *
 * Styling foundation: warm v3 CSS vars in `../../theme/v3/warmThemeV3.css`; the
 * root scopes itself with `withV3Theme()`.
 */

import { type ReactNode, type Ref, isValidElement } from "react";
import type { Selection } from "@heroui/react";
import {
  Select as HeroV3Select,
  ListBox as HeroV3ListBox,
  Label as HeroV3Label,
  FieldError as HeroV3FieldError,
} from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/**
 * The react-aria collection key flavor. Derived from the v2 `Selection`
 * (`"all" | Set<Key>`) so it is guaranteed identical to the key type the stories'
 * `selectedKeys` Set uses — without importing a `Key` symbol that v2
 * `@heroui/react` does not re-export.
 */
type Key = Exclude<Selection, "all"> extends Set<infer K> ? K : never;

/** v3 field visual variants (the only style axis the v3 Select root exposes). */
export type AppSelectVariant = "primary" | "secondary";

/** v2-era `variant` strings the stories still pass. */
type V2SelectVariant = "flat" | "bordered" | "faded" | "underlined";

/** v2-era semantic `color` strings (no v3 Select axis — accepted, no-op). */
type V2SelectColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

type V3Size = "sm" | "md" | "lg";
type SelectionMode = "single" | "multiple";

/**
 * Render-prop child for the dynamic `items` API (mirrors the v2/react-aria shape):
 * `(item: T) => ReactNode`. The Empty story passes `() => <AppSelectItem/>`.
 */
type CollectionChildren<T> = ReactNode | ((item: T) => ReactNode);

/**
 * PUBLIC, PRESERVED generic prop surface. Hand-written (NOT `type X = V3Props`) so
 * the generic `<T>` inference + the full v2 consumer surface survive the wrapper.
 */
export interface AppSelectProps<T extends object = object> {
  /** Visible label — rendered as a `<Label>` child. */
  label?: ReactNode;
  placeholder?: string;
  /** Single vs multiple selection — flows to both Select and inner ListBox. */
  selectionMode?: SelectionMode;
  /** Controlled selection (v2 Set-based) — translated to the v3 `value`. */
  selectedKeys?: Selection;
  /** Uncontrolled initial selection (v2 Set-based). */
  defaultSelectedKeys?: Selection;
  /** v2 Set-based change handler — driven from the v3 `onChange`. */
  onSelectionChange?: (keys: Selection) => void;
  /** Keys of disabled options — flows to the inner ListBox. */
  disabledKeys?: Iterable<Key>;
  /** Dynamic collection source — flows to the inner ListBox. */
  items?: Iterable<T>;
  isInvalid?: boolean;
  errorMessage?: ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  name?: string;
  /** v2 visual axes — accepted for call-site compatibility. */
  variant?: V2SelectVariant | AppSelectVariant;
  /** v2 `color` — accepted but NO-OP (no v3 Select color axis). */
  color?: V2SelectColor;
  /** v2 `radius` — accepted but NO-OP (the Select trigger radius is recipe-baked). */
  radius?: "none" | "sm" | "md" | "lg" | "full";
  /** v2 `size` — accepted but NO-OP (no v3 Select size axis). */
  size?: V3Size;
  /** v2 `labelPlacement` — accepted but NO-OP (v3 always renders label above). */
  labelPlacement?: "inside" | "outside" | "outside-left";
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** Collection children OR a dynamic render-prop child (with `items`). */
  children?: CollectionChildren<T>;
  ref?: Ref<HTMLDivElement>;
}

/** v2 SelectItem surface — mapped onto `ListBox.Item`. */
export interface AppSelectItemProps {
  /**
   * The option's key. Provided either via React's reserved `key` (the stories
   * pass `key={e.key}` — react-aria reads it as the collection key) or as an
   * explicit `id`. `id` wins when both are present.
   */
  id?: Key;
  /** Accessible/typeahead text. Derived from string children when omitted. */
  textValue?: string;
  isDisabled?: boolean;
  className?: string;
  children?: ReactNode;
}

/** v2 SelectSection surface — mapped onto `ListBox.Section`. */
export interface AppSelectSectionProps {
  title?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/** Map the v2 `variant` vocabulary onto a v3 Select variant. */
function toV3Variant(variant: AppSelectProps["variant"]): AppSelectVariant {
  if (variant === "secondary" || variant === "faded") return "secondary";
  return "primary";
}

/** Selection (`"all" | Set<Key>`) -> the v3 single-select `value` (`Key | null`). */
function toSingleValue(selection: Selection | undefined): Key | null {
  if (!selection || selection === "all") return null;
  const [first] = selection;
  return first ?? null;
}

/** Selection (`"all" | Set<Key>`) -> the v3 multi-select `value` (`Key[]`). */
function toMultiValue(selection: Selection | undefined): Key[] {
  if (!selection || selection === "all") return [];
  return Array.from(selection);
}

function AppSelectRoot<T extends object>({
  label,
  placeholder,
  selectionMode = "single",
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  disabledKeys,
  items,
  isInvalid,
  errorMessage,
  isRequired,
  isDisabled,
  fullWidth = true,
  name,
  variant,
  // NOTE: `color`, `radius`, `size`, `labelPlacement` are part of the public
  // interface for call-site compatibility but have NO v3 Select axis — they are
  // intentionally NOT destructured, so they are silently dropped (no `...rest`
  // spread forwards them onward). Keeps the no-op absorption lint-clean.
  className,
  style,
  ref,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
}: AppSelectProps<T>) {
  const v3Variant = toV3Variant(variant);
  const isMultiple = selectionMode === "multiple";

  // Translate the v2 Set-based selection onto the v3 native value/onChange.
  const value = isMultiple
    ? toMultiValue(selectedKeys)
    : toSingleValue(selectedKeys);
  const defaultValue = isMultiple
    ? toMultiValue(defaultSelectedKeys)
    : toSingleValue(defaultSelectedKeys);
  const hasControlledSelection = selectedKeys !== undefined;
  const hasDefaultSelection = defaultSelectedKeys !== undefined;

  // v3 onChange (Key | Key[] | null) -> rebuild a Set and call the v2 consumer.
  const handleChange = onSelectionChange
    ? (next: Key | readonly Key[] | null) => {
        const keys =
          next == null ? [] : Array.isArray(next) ? next : [next as Key];
        onSelectionChange(new Set(keys));
      }
    : undefined;

  // `items` + a render-prop child drive the dynamic ListBox collection; static
  // JSX children pass straight through. Either way children stay direct
  // descendants of <ListBox> so react-aria's collection builder walks them.
  const listBoxChildren = children as
    | ReactNode
    | ((item: T) => ReactNode);

  return (
    <HeroV3Select<T, typeof selectionMode>
      ref={ref}
      selectionMode={selectionMode}
      // Only pass the selection axis the consumer actually drives (controlled vs
      // uncontrolled vs neither) so we never fight react-aria's state ownership.
      {...(hasControlledSelection ? { value } : {})}
      {...(!hasControlledSelection && hasDefaultSelection ? { defaultValue } : {})}
      {...(handleChange ? { onChange: handleChange } : {})}
      disabledKeys={disabledKeys}
      isInvalid={isInvalid}
      isRequired={isRequired}
      isDisabled={isDisabled}
      fullWidth={fullWidth}
      name={name}
      placeholder={placeholder}
      variant={v3Variant}
      className={withV3Theme(className)}
      style={style}
      aria-label={label ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {label ? <HeroV3Label>{label}</HeroV3Label> : null}
      <HeroV3Select.Trigger>
        <HeroV3Select.Value />
        <HeroV3Select.Indicator />
      </HeroV3Select.Trigger>
      <HeroV3Select.Popover>
        <HeroV3ListBox<T>
          selectionMode={selectionMode}
          items={items}
          aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
        >
          {listBoxChildren as never}
        </HeroV3ListBox>
      </HeroV3Select.Popover>
      {isInvalid && errorMessage ? (
        <HeroV3FieldError>{errorMessage}</HeroV3FieldError>
      ) : null}
    </HeroV3Select>
  );
}

/**
 * `AppSelectItem` -> `ListBox.Item`. Derives `textValue` from string children
 * when not supplied. The react-aria collection key comes from the React `key`
 * (stories pass `key={e.key}`) or the explicit `id`.
 */
export function AppSelectItem({
  id,
  textValue,
  isDisabled,
  className,
  children,
}: AppSelectItemProps) {
  const derivedTextValue =
    textValue ?? (typeof children === "string" ? children : undefined);
  return (
    <HeroV3ListBox.Item
      id={id}
      textValue={derivedTextValue}
      isDisabled={isDisabled}
      className={className}
    >
      {children}
      <HeroV3ListBox.ItemIndicator />
    </HeroV3ListBox.Item>
  );
}

/** `AppSelectSection` -> `ListBox.Section`. */
export function AppSelectSection({
  title,
  className,
  children,
}: AppSelectSectionProps) {
  return (
    <HeroV3ListBox.Section className={className}>
      {title && isValidElement(title) ? title : null}
      {children}
    </HeroV3ListBox.Section>
  );
}

/**
 * Explicit intersection annotation keeps the generic call signature of
 * `AppSelectRoot` AND the static members in the emitted `.d.ts`, while staying
 * portable for `tsc --declaration` (no inlined non-portable HeroUI path, TS2742).
 */
export const AppSelect: typeof AppSelectRoot & {
  Item: typeof AppSelectItem;
  Section: typeof AppSelectSection;
} = Object.assign(AppSelectRoot, {
  Item: AppSelectItem,
  Section: AppSelectSection,
});
