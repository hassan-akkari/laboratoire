"use client";

/**
 * AppCard — SECOND v3 MIGRATION (compound-archetype reference).
 *
 * Now consumes HeroUI **v3** (`@heroui-v3/react`) alongside the still-v2 rest of
 * the inventory (coexistence via pnpm aliases — see `packages/ui/package.json`).
 *
 * PUBLIC API IS PRESERVED. The wrapper keeps exporting `AppCard`,
 * `AppCardHeader`, `AppCardBody`, `AppCardFooter` plus their `*Props` types AND
 * the static members `AppCard.Header` / `AppCard.Body` / `AppCard.Footer`. The
 * explicit `Object.assign` + intersection-type annotation is preserved verbatim
 * (it guards `.d.ts` portability against TS2742 — every static member is a
 * named, exported component so `tsc --declaration` never inlines a non-portable
 * internal HeroUI path).
 *
 * v3 Card API deltas handled here:
 *   - v3 ships a COMPOUND `Card.Header` / `Card.Content` / `Card.Footer`. We map
 *     the v2 slot names onto them: `AppCardBody` -> `Card.Content` (the rename),
 *     `AppCardHeader` -> `Card.Header`, `AppCardFooter` -> `Card.Footer`.
 *   - Removed props `shadow` / `radius` / `isPressable` / `isHoverable` /
 *     `isBlurred` / `fullWidth` / `isDisabled` are NOT forwarded (they no longer
 *     exist in v3); consumers express those via Tailwind classNames instead.
 *   - `classNames` -> `className`.
 *   - `variant` is new (transparent | default | secondary | tertiary).
 *
 * AppCard has ZERO app call sites (only its Storybook story), so this migration
 * is internally contained — but we keep the full public surface so the eventual
 * adopters get the stable compound API.
 *
 * Styling foundation: warm v3 CSS vars in `../../theme/v3/warmThemeV3.css`;
 * the root scopes itself with `withV3Theme()` so the card is themed correctly
 * even when rendered outside an explicit wrapper element.
 */

import type { ComponentProps, ReactNode } from "react";
import {
  Card as HeroV3Card,
  type CardProps as HeroV3CardProps,
} from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/** v3 semantic prominence variants. */
export type AppCardVariant = "transparent" | "default" | "secondary" | "tertiary";

/**
 * PUBLIC, PRESERVED root props. `variant` is the v3 axis; `className` replaces
 * v2 `classNames`. The removed v2 props (shadow/radius/isPressable/...) are not
 * part of the surface anymore — express them with Tailwind classes.
 */
export interface AppCardProps {
  children: ReactNode;
  variant?: AppCardVariant;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

// Slot prop types derived from the v3 compound members (stays accurate AND keeps
// the emitted `.d.ts` portable — no inlined internal HeroUI path -> no TS2742).
export type AppCardHeaderProps = ComponentProps<typeof HeroV3Card.Header>;
// NOTE: `AppCardBody` maps to v3 `Card.Content` (the v2 CardBody -> v3 Content
// rename); the PUBLIC name stays `AppCardBody` for API stability.
export type AppCardBodyProps = ComponentProps<typeof HeroV3Card.Content>;
export type AppCardFooterProps = ComponentProps<typeof HeroV3Card.Footer>;

export function AppCardHeader(props: AppCardHeaderProps) {
  return <HeroV3Card.Header {...props} />;
}

export function AppCardBody(props: AppCardBodyProps) {
  // v2 `AppCardBody` -> v3 `Card.Content`.
  return <HeroV3Card.Content {...props} />;
}

export function AppCardFooter(props: AppCardFooterProps) {
  return <HeroV3Card.Footer {...props} />;
}

function AppCardRoot({ variant = "default", className, ...props }: AppCardProps) {
  const cardProps = props as Omit<HeroV3CardProps, "variant" | "className">;
  return (
    <HeroV3Card
      variant={variant}
      className={withV3Theme(className)}
      {...cardProps}
    />
  );
}

/**
 * Static-property attachment. PRESERVED verbatim from the v2 wrapper: the
 * EXPLICIT intersection type annotation (rather than relying on `Object.assign`
 * inference) keeps the emitted `.d.ts` portable — every member is a named,
 * exported component, so `tsc --declaration` never inlines a non-portable
 * internal HeroUI path (TS2742).
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
