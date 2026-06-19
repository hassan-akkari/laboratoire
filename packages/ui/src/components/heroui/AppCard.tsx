"use client";

import type { ComponentProps } from "react";
import {
  Card as HeroCard,
  CardHeader as HeroCardHeader,
  CardBody as HeroCardBody,
  CardFooter as HeroCardFooter,
  type CardProps,
  type CardFooterProps,
} from "@heroui/react";

/**
 * AppCard — ARCHETYPE 2: STATIC COMPOUND component.
 *
 * COMPOUND CONVENTION (the pattern the rest of the inventory follows):
 * HeroUI ships a parent (`Card`) plus dedicated slot components
 * (`CardHeader`/`CardBody`/`CardFooter`). We re-export each slot under an
 * `App<Slot>` name as a THIN passthrough and ALSO attach them to the root as
 * static properties — so consumers can write EITHER:
 *
 *   import { AppCard, AppCardBody } from "@laboratoire/ui";
 *   <AppCard><AppCardBody>…</AppCardBody></AppCard>
 *
 * OR the dot-namespaced form (handy for discoverability / scoping):
 *
 *   <AppCard><AppCard.Body>…</AppCard.Body></AppCard>
 *
 * Both resolve to the same component. We do NOT collapse the slots into a
 * single mega-prop API: keeping HeroUI's own composition keeps the full prop
 * surface and accessibility wiring intact, and avoids re-implementing layout.
 *
 * Defaults: `radius="sm"` and `shadow="sm"` give a quiet card that matches the
 * warm token palette; both are overridable. Slots carry NO defaults (they are
 * pure layout) so they never fight a consumer's spacing.
 */
export type AppCardProps = CardProps;
// HeroUI does NOT export named `CardHeaderProps` / `CardBodyProps` (only
// `CardFooterProps`). Both header and body are `div`-based HeroUI components, so
// we derive their prop types from the components themselves with
// `ComponentProps`. This stays accurate AND keeps the emitted `.d.ts` portable
// (no inlined internal `@heroui/system` `HTMLHeroUIProps` path → no TS2742).
export type AppCardHeaderProps = ComponentProps<typeof HeroCardHeader>;
export type AppCardBodyProps = ComponentProps<typeof HeroCardBody>;
export type AppCardFooterProps = CardFooterProps;

export function AppCardHeader(props: AppCardHeaderProps) {
  return <HeroCardHeader {...props} />;
}

export function AppCardBody(props: AppCardBodyProps) {
  return <HeroCardBody {...props} />;
}

export function AppCardFooter(props: AppCardFooterProps) {
  return <HeroCardFooter {...props} />;
}

function AppCardRoot({ radius = "sm", shadow = "sm", ...props }: AppCardProps) {
  return <HeroCard radius={radius} shadow={shadow} {...props} />;
}

/**
 * Static-property attachment. The EXPLICIT intersection type annotation (rather
 * than relying on `Object.assign`'s inference) keeps the emitted `.d.ts`
 * portable: every member is a named, exported component, so `tsc --declaration`
 * never inlines a non-portable internal HeroUI path (TS2742).
 */
export const AppCard: typeof AppCardRoot & {
  Header: typeof AppCardHeader;
  Body: typeof AppCardBody;
  Footer: typeof AppCardFooter;
} = Object.assign(AppCardRoot, {
  Header: AppCardHeader,
  Body: AppCardBody,
  Footer: AppCardFooter,
});
