"use client";

import {
  Dropdown as HeroDropdown,
  DropdownTrigger as HeroDropdownTrigger,
  DropdownMenu as HeroDropdownMenu,
  DropdownItem as HeroDropdownItem,
  DropdownSection as HeroDropdownSection,
  type DropdownProps,
  type DropdownTriggerProps,
  type DropdownMenuProps,
  type DropdownItemProps,
  type DropdownSectionProps,
} from "@heroui/react";

/**
 * AppDropdown — STATIC COMPOUND component (same pattern as `AppCard`).
 *
 * COLLECTION-COMPOUND CONVENTION:
 * `Dropdown` composes a trigger, a menu, and the menu's items/sections. The
 * trigger + menu MUST remain DIRECT children of `Dropdown` (HeroUI reads them
 * positionally — `children` is typed `ReactNode[]`), and the items/sections are
 * React-Aria collection children that `DropdownMenu` walks to build its tree.
 * Every slot is therefore a THIN passthrough that introduces NO wrapping
 * element — adding a `<div>` would break the trigger detection and the
 * collection. We expose each as both a named `App*` export and a static member
 * (`AppDropdown.Trigger` / `.Menu` / `.Item` / `.Section`).
 *
 * `DropdownMenu` is GENERIC over the item type (HeroUI types it as
 * `<T extends object>(props) => ReactElement`) so its wrapper is generic too —
 * mirroring `AppTable`'s collection wrappers. `DropdownItem` and
 * `DropdownSection` are NON-generic at the value level (their prop types default
 * `T` to `object`), so they are plain wrappers.
 *
 * ACCESSIBILITY: HeroUI wires `role="menu"` / `menuitem`, focus management, and
 * type-ahead automatically. Give `AppDropdownMenu` an `aria-label` so the menu
 * has an accessible name. Selection state lives on the menu
 * (`selectionMode`/`selectedKeys`); disabled items use `disabledKeys`.
 *
 * Defaults: `radius="sm"` on the root popover surface to match `AppCard`;
 * overridable. Slots carry NO defaults (pure layout).
 */
export type AppDropdownProps = DropdownProps;
export type AppDropdownTriggerProps = DropdownTriggerProps;
export type AppDropdownMenuProps<T extends object = object> =
  DropdownMenuProps<T>;
export type AppDropdownItemProps<T extends object = object> =
  DropdownItemProps<T>;
export type AppDropdownSectionProps<T extends object = object> =
  DropdownSectionProps<T>;

export function AppDropdownTrigger(props: AppDropdownTriggerProps) {
  return <HeroDropdownTrigger {...props} />;
}

export function AppDropdownMenu<T extends object>(
  props: AppDropdownMenuProps<T>,
) {
  return <HeroDropdownMenu {...props} />;
}

export function AppDropdownItem<T extends object>(
  props: AppDropdownItemProps<T>,
) {
  return <HeroDropdownItem {...props} />;
}

export function AppDropdownSection<T extends object>(
  props: AppDropdownSectionProps<T>,
) {
  return <HeroDropdownSection {...props} />;
}

function AppDropdownRoot({ radius = "sm", ...props }: AppDropdownProps) {
  return <HeroDropdown radius={radius} {...props} />;
}

/**
 * Explicit intersection annotation: keeps every static member (and each generic
 * slot's call signature) named/exported in the emitted `.d.ts`, portable for
 * `tsc --declaration` (no inlined internal HeroUI path → no TS2742).
 */
export const AppDropdown: typeof AppDropdownRoot & {
  Trigger: typeof AppDropdownTrigger;
  Menu: typeof AppDropdownMenu;
  Item: typeof AppDropdownItem;
  Section: typeof AppDropdownSection;
} = Object.assign(AppDropdownRoot, {
  Trigger: AppDropdownTrigger,
  Menu: AppDropdownMenu,
  Item: AppDropdownItem,
  Section: AppDropdownSection,
});
