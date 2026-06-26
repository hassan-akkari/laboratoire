"use client";

import {
  Accordion as HeroAccordion,
  AccordionItem as HeroAccordionItem,
  type AccordionProps,
  // HeroUI re-aliases `AccordionItemBaseProps` -> `AccordionItemProps` at its
  // package entry; that aliased name is the public prop type for the item.
  type AccordionItemProps,
} from "@heroui/react";

/**
 * AppAccordion — STATIC COMPOUND component (same pattern as `AppCard`).
 *
 * COLLECTION-COMPOUND CONVENTION:
 * `Accordion` is the parent; each `AccordionItem` is a React-Aria collection
 * child that the group walks to build its tree. The items MUST remain DIRECT
 * descendants of `Accordion`, so each slot is a THIN passthrough introducing NO
 * wrapping element. Exposed as a named export (`AppAccordionItem`) and a static
 * member (`AppAccordion.Item`).
 *
 * Unlike `AppTabs`, neither HeroUI value is generic at the call site: `Accordion`
 * is a forwardRef `div` (`AccordionProps`, non-generic) and `AccordionItem` is
 * declared `(props: AccordionItemBaseProps) => JSX.Element` (the public
 * `AccordionItemProps` defaults its row type to `{}`). So both wrappers are plain
 * (no `<T>`), like `AppTable`'s `Row`/`Cell`.
 *
 * ACCESSIBILITY: HeroUI renders each item's trigger as a heading-wrapped button
 * with `aria-expanded` / `aria-controls` and wires the disclosure region.
 * Provide each `AppAccordionItem` a unique `key`, a `title` (the visible label),
 * and optionally an `aria-label` when the title is not plain text. Selection /
 * expansion can be controlled via `selectionMode` / `selectedKeys` on
 * `AppAccordion`.
 *
 * Defaults: NONE. The accordion's chrome is token-driven and its variant
 * (`light` / `shadow` / `bordered` / `splitted`) is a deliberate consumer choice,
 * so we inject no defaults that could fight it. Spread `...props` last.
 */
export type AppAccordionProps = AccordionProps;
export type AppAccordionItemProps = AccordionItemProps;

export function AppAccordionItem(props: AppAccordionItemProps) {
  return <HeroAccordionItem {...props} />;
}

function AppAccordionRoot(props: AppAccordionProps) {
  return <HeroAccordion {...props} />;
}

/**
 * Explicit intersection annotation: keeps the static member named/exported in
 * the emitted `.d.ts`, portable for `tsc --declaration` (no TS2742 inlining).
 */
export const AppAccordion: typeof AppAccordionRoot & {
  Item: typeof AppAccordionItem;
} = Object.assign(AppAccordionRoot, {
  Item: AppAccordionItem,
});
