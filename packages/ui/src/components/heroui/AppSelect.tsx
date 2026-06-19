"use client";

import {
  Select as HeroSelect,
  SelectItem as HeroSelectItem,
  SelectSection as HeroSelectSection,
  type SelectProps,
  type SelectItemProps,
  type SelectSectionProps,
} from "@heroui/react";

/**
 * AppSelect — ARCHETYPE 3: COLLECTION component.
 *
 * COMPOUND/COLLECTION CONVENTION:
 * `Select` is a generic over the item shape (`SelectProps<T>`). To preserve that
 * generic through the wrapper we type the component with an explicit generic
 * signature instead of the destructuring-arrow form used by single-element
 * wrappers — otherwise the item type would collapse to `object` and consumers
 * lose `selectedKeys`/`items` inference.
 *
 * The collection children (`SelectItem`, `SelectSection`) are re-exported as
 * `AppSelectItem` / `AppSelectSection` thin passthroughs AND attached as static
 * members (`AppSelect.Item`, `AppSelect.Section`). Collection children MUST stay
 * direct descendants of `Select` (HeroUI walks them with React-Aria's collection
 * builder), so wrappers must not introduce an intermediate element — these stay
 * pure re-exports for exactly that reason.
 *
 * ACCESSIBILITY: HeroUI's `Select` needs an accessible name. Provide `label`
 * (visible) OR `aria-label` (when label is visual-only). Stories exercise both
 * so the addon-a11y checks stay clean.
 *
 * Defaults: `variant="bordered"`, `radius="sm"`, `labelPlacement="inside"`,
 * `fullWidth` — matching `AppInput`/`AppTextarea` so form controls line up.
 */
export type AppSelectProps<T extends object = object> = SelectProps<T>;
export type AppSelectItemProps = SelectItemProps;
export type AppSelectSectionProps = SelectSectionProps;

function AppSelectRoot<T extends object>({
  color = "primary",
  variant = "bordered",
  radius = "sm",
  labelPlacement = "inside",
  fullWidth = true,
  ...props
}: AppSelectProps<T>) {
  return (
    <HeroSelect
      color={color}
      variant={variant}
      radius={radius}
      labelPlacement={labelPlacement}
      fullWidth={fullWidth}
      {...props}
    />
  );
}

export function AppSelectItem(props: AppSelectItemProps) {
  return <HeroSelectItem {...props} />;
}

export function AppSelectSection(props: AppSelectSectionProps) {
  return <HeroSelectSection {...props} />;
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
