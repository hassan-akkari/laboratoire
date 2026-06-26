"use client";

import {
  Tabs as HeroTabs,
  Tab as HeroTab,
  type TabsProps,
  // HeroUI names the `Tab` sub-part's prop type `TabItemProps` (NOT `TabProps`).
  type TabItemProps,
} from "@heroui/react";

/**
 * AppTabs — STATIC COMPOUND component (same pattern as `AppCard`).
 *
 * COLLECTION-COMPOUND CONVENTION:
 * `Tabs` is the parent; each `Tab` is a React-Aria collection child. BOTH are
 * GENERIC over the item type — HeroUI types them as
 * `<T extends object>(props) => ReactElement`. We mirror that exactly with
 * generic wrappers (like `AppTable`'s `Header`/`Column`/`Body`). The `Tab`
 * children MUST remain DIRECT descendants of `Tabs`, so each slot is a THIN
 * passthrough introducing NO wrapping element. Exposed as named exports
 * (`AppTab`) and a static member (`AppTabs.Tab`).
 *
 * NAME NOTE: HeroUI does not export a `TabProps` type. The per-tab prop type is
 * `TabItemProps` (from `@heroui/tabs`'s `tab-item-base`); we re-export it as
 * `AppTabProps` so consumers get the App-prefixed name they expect.
 *
 * ACCESSIBILITY: HeroUI wires `role="tablist"` / `tab` / `tabpanel`, roving
 * focus, and arrow-key navigation automatically. Give `AppTabs` an `aria-label`
 * so the tablist has an accessible name. Each `AppTab` needs a unique `key` and
 * a `title`; selection can be controlled via `selectedKey` / `onSelectionChange`
 * on `AppTabs`.
 *
 * Defaults: `radius="sm"` to match `AppCard`/`AppTable`; overridable. The `Tab`
 * slot carries NO defaults (pure content).
 */
export type AppTabsProps<T extends object = object> = TabsProps<T>;
export type AppTabProps<T extends object = object> = TabItemProps<T>;

export function AppTab<T extends object>(props: AppTabProps<T>) {
  return <HeroTab {...props} />;
}

function AppTabsRoot<T extends object>({
  radius = "sm",
  ...props
}: AppTabsProps<T>) {
  return <HeroTabs radius={radius} {...props} />;
}

/**
 * Explicit intersection annotation: keeps the root's generic call signature and
 * the static member named/exported in the emitted `.d.ts`, portable for
 * `tsc --declaration` (no TS2742 inlining).
 */
export const AppTabs: typeof AppTabsRoot & {
  Tab: typeof AppTab;
} = Object.assign(AppTabsRoot, {
  Tab: AppTab,
});
