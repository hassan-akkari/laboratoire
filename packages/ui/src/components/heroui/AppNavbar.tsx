"use client";

import {
  Navbar as HeroNavbar,
  NavbarBrand as HeroNavbarBrand,
  NavbarContent as HeroNavbarContent,
  NavbarItem as HeroNavbarItem,
  NavbarMenuToggle as HeroNavbarMenuToggle,
  NavbarMenu as HeroNavbarMenu,
  NavbarMenuItem as HeroNavbarMenuItem,
  type NavbarProps,
  type NavbarBrandProps,
  type NavbarContentProps,
  type NavbarItemProps,
  type NavbarMenuToggleProps,
  type NavbarMenuProps,
  type NavbarMenuItemProps,
} from "@heroui/react";

/**
 * AppNavbar — STATIC COMPOUND component (same pattern as `AppCard`).
 *
 * COMPOUND CONVENTION:
 * `Navbar` composes a brand, content groups (each holding items), a mobile
 * menu toggle, and the collapsing mobile menu (holding menu items). Every slot
 * is a THIN passthrough re-exported under an `App*` name AND attached as a
 * static member (`AppNavbar.Brand` / `.Content` / `.Item` / `.MenuToggle` /
 * `.Menu` / `.MenuItem`). We keep HeroUI's own composition so the responsive
 * open/close state machine, `justify` layout, and ARIA wiring stay intact.
 *
 * ACCESSIBILITY: HeroUI renders a `<nav>` landmark and wires the menu toggle to
 * the collapsing `NavbarMenu` (aria-expanded / controlled `isMenuOpen`). Give
 * `AppNavbarMenuToggle` an `aria-label` ("Open menu" / "Close menu") for the
 * icon-only control. The mobile menu open state can be controlled via
 * `isMenuOpen` / `onMenuOpenChange` on `AppNavbar`.
 *
 * Defaults: NONE. All slots (and the root) are pure layout/structure — the
 * navbar's chrome is driven by tokens, not a corner radius — so we add no
 * defaults that could fight a consumer's chosen `maxWidth` / `position` /
 * `isBordered`. Spread `...props` last.
 */
export type AppNavbarProps = NavbarProps;
export type AppNavbarBrandProps = NavbarBrandProps;
export type AppNavbarContentProps = NavbarContentProps;
export type AppNavbarItemProps = NavbarItemProps;
export type AppNavbarMenuToggleProps = NavbarMenuToggleProps;
export type AppNavbarMenuProps = NavbarMenuProps;
export type AppNavbarMenuItemProps = NavbarMenuItemProps;

export function AppNavbarBrand(props: AppNavbarBrandProps) {
  return <HeroNavbarBrand {...props} />;
}

export function AppNavbarContent(props: AppNavbarContentProps) {
  return <HeroNavbarContent {...props} />;
}

export function AppNavbarItem(props: AppNavbarItemProps) {
  return <HeroNavbarItem {...props} />;
}

export function AppNavbarMenuToggle(props: AppNavbarMenuToggleProps) {
  return <HeroNavbarMenuToggle {...props} />;
}

export function AppNavbarMenu(props: AppNavbarMenuProps) {
  return <HeroNavbarMenu {...props} />;
}

export function AppNavbarMenuItem(props: AppNavbarMenuItemProps) {
  return <HeroNavbarMenuItem {...props} />;
}

function AppNavbarRoot(props: AppNavbarProps) {
  return <HeroNavbar {...props} />;
}

/**
 * Explicit intersection annotation: keeps every static member named/exported in
 * the emitted `.d.ts`, portable for `tsc --declaration` (no TS2742 inlining).
 */
export const AppNavbar: typeof AppNavbarRoot & {
  Brand: typeof AppNavbarBrand;
  Content: typeof AppNavbarContent;
  Item: typeof AppNavbarItem;
  MenuToggle: typeof AppNavbarMenuToggle;
  Menu: typeof AppNavbarMenu;
  MenuItem: typeof AppNavbarMenuItem;
} = Object.assign(AppNavbarRoot, {
  Brand: AppNavbarBrand,
  Content: AppNavbarContent,
  Item: AppNavbarItem,
  MenuToggle: AppNavbarMenuToggle,
  Menu: AppNavbarMenu,
  MenuItem: AppNavbarMenuItem,
});
