"use client";

/**
 * AppAvatar — v3 MIGRATION (static-compound archetype, sibling to `AppCard`).
 *
 * This wrapper now consumes HeroUI **v3** (`@heroui-v3/react`) while the rest of
 * the inventory still consumes v2 (`@heroui/react`). The two majors coexist via
 * pnpm aliases (Strategy A); see `packages/ui/package.json`.
 *
 * PUBLIC API IS PRESERVED. The barrel keeps importing `AppAvatar`,
 * `AppAvatarGroup`, `AppAvatarProps`, `AppAvatarGroupProps` by name AND the
 * static member `AppAvatar.Group`. The explicit `Object.assign` +
 * intersection-type annotation is preserved verbatim (it guards `.d.ts`
 * portability against TS2742 — every static member is a named, exported
 * component so `tsc --declaration` never inlines a non-portable internal HeroUI
 * path).
 *
 * v3 Avatar API deltas handled here
 * ---------------------------------
 *   - v3 ships a COMPOUND `Avatar` -> `Avatar.Image` + `Avatar.Fallback`. The v2
 *     `src` / `name` / `icon` / `isBordered` props are GONE; image + fallback are
 *     now children. To migrate INCREMENTALLY without editing call sites, the
 *     HAND-WRITTEN `AppAvatarProps` keeps the v2 convenience surface: pass `src`
 *     and/or `name` and the wrapper renders `<Avatar.Image src alt={name}/>` +
 *     `<Avatar.Fallback>{initials(name)}</Avatar.Fallback>` internally. Callers
 *     may instead pass explicit `children` (their own Avatar.Image/Fallback).
 *   - `color` REMAPPED: v2 `primary`/`secondary` collapse onto v3 `accent` (the
 *     warm brand). v3 enum is default | accent | success | warning | danger.
 *   - `size` stays 'sm' | 'md' | 'lg' (custom sizes via `className`, e.g. `size-16`).
 *   - `variant` is now only 'default' | 'soft'.
 *   - `radius` is GONE (square via `className="rounded-lg"`); `classNames` is
 *     GONE (single `className`); `isBordered` / `isDisabled` are dropped.
 *   - There is NO `Avatar.Group` / `AvatarGroup` in v3. `AppAvatarGroup` is now
 *     HAND-BUILT: a flex `-space-x-2` container that gives each child a
 *     `ring-2 ring-background` ring (so stacked avatars read cleanly) and renders
 *     a trailing `+N` counter Avatar when `max` is exceeded.
 *
 * Styling foundation: warm v3 CSS vars in `../../theme/v3/warmThemeV3.css`; every
 * rendered root scopes itself with `withV3Theme()` so the avatar is correctly
 * themed even when dropped outside an explicit wrapper element.
 *
 * Token gap note: the warm foundation defines `--accent`/`--primary` (alias),
 * `--surface`, `--foreground`, `--muted`, `--border`, `--background`, `--focus`,
 * `--radius` — but NO warm `--success`/`--warning`/`--danger`. Those three avatar
 * colors fall back to the `@heroui-v3/styles` defaults (intentional; we do not
 * edit any CSS file).
 */

import type { ReactNode } from "react";
import { Children, Fragment } from "react";
import { Avatar as HeroV3Avatar } from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/** v3 avatar size axis (custom sizes go through `className`, e.g. `size-16`). */
export type AppAvatarSize = "sm" | "md" | "lg";

/** v3 fallback color enum (`accent` replaces the v2 `primary`). */
export type AppAvatarColor =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "danger";

/** v2-era color strings call sites/stories may still pass — folded to v3. */
type V2AvatarColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

/** v3 visual variant (v2 had no real equivalent worth carrying). */
export type AppAvatarVariant = "default" | "soft";

/**
 * Map the v2 `color` vocabulary onto the v3 enum: `primary`/`secondary` (the
 * warm brand axis) collapse to v3 `accent`; the rest pass through unchanged.
 */
function toV3Color(color: V2AvatarColor | AppAvatarColor | undefined): AppAvatarColor {
  if (color === "primary" || color === "secondary") return "accent";
  return (color ?? "default") as AppAvatarColor;
}

/** Derive up-to-two-letter initials from a display name (used as fallback text). */
function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * PUBLIC, PRESERVED root props (HAND-WRITTEN anti-corruption interface — NOT
 * `= AvatarProps`). Superset of the v2 convenience surface the apps already
 * pass (`src` / `name` / `size` / `color`) mapped onto the v3 compound API,
 * plus a `children` escape hatch for explicit `Avatar.Image` / `Avatar.Fallback`.
 */
export interface AppAvatarProps {
  /** Convenience: image URL. Renders `<Avatar.Image src alt={name} />`. */
  src?: string;
  /** Convenience: display name. Drives the image `alt` AND the initials fallback. */
  name?: string;
  /** Explicit compound children (own `Avatar.Image`/`Avatar.Fallback`); wins over `src`/`name`. */
  children?: ReactNode;
  size?: AppAvatarSize;
  /** Accepts the v2 vocabulary (primary/secondary/...) — mapped via `toV3Color()`. */
  color?: V2AvatarColor | AppAvatarColor;
  variant?: AppAvatarVariant;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

function AppAvatarRoot({
  src,
  name,
  children,
  size = "md",
  color,
  variant = "default",
  className,
  ...rest
}: AppAvatarProps) {
  // Explicit children win; otherwise synthesize the compound parts from the v2
  // convenience props. `name` feeds both the image `alt` and the initials.
  const content: ReactNode = children ?? (
    <>
      {src ? <HeroV3Avatar.Image src={src} alt={name ?? ""} /> : null}
      <HeroV3Avatar.Fallback>{name ? initialsOf(name) : null}</HeroV3Avatar.Fallback>
    </>
  );

  return (
    <HeroV3Avatar
      size={size}
      color={toV3Color(color)}
      variant={variant}
      className={withV3Theme(className)}
      {...rest}
    >
      {content}
    </HeroV3Avatar>
  );
}

/** Hand-built group props (v3 has no `AvatarGroup`). */
export interface AppAvatarGroupProps {
  children?: ReactNode;
  /** Show at most this many avatars; the rest collapse into a `+N` counter. */
  max?: number;
  size?: AppAvatarSize;
  className?: string;
  id?: string;
  role?: string;
  "aria-label"?: string;
}

/**
 * HAND-BUILT avatar group. v3 ships NO `AvatarGroup`, so we recreate the v2
 * stacking affordance with markup straight from the v3 docs: a flex `-space-x-2`
 * container, each child Avatar wrapped so it carries a `ring-2 ring-background`
 * ring, plus a trailing `+N` counter Avatar when `max` is exceeded.
 */
export function AppAvatarGroup({
  children,
  max,
  size = "md",
  className,
  ...rest
}: AppAvatarGroupProps) {
  const items = Children.toArray(children);
  // Clamp `max` to a non-negative integer so nonsense inputs (0, negatives,
  // fractions) can't slice from the end or miscount the overflow.
  const cap =
    typeof max === "number" ? Math.max(0, Math.floor(max)) : undefined;
  const visible = cap != null ? items.slice(0, cap) : items;
  const overflow = items.length - visible.length;

  return (
    <div className={withV3Theme(`flex -space-x-2 ${className ?? ""}`.trim())} {...rest}>
      {visible.map((child, index) => (
        // Ring on the wrapper keeps each stacked avatar visually separated.
        <div key={index} className="rounded-full ring-2 ring-background">
          {child}
        </div>
      ))}
      {overflow > 0 ? (
        <div className="rounded-full ring-2 ring-background">
          <HeroV3Avatar size={size}>
            <HeroV3Avatar.Fallback className="text-xs">{`+${overflow}`}</HeroV3Avatar.Fallback>
          </HeroV3Avatar>
        </div>
      ) : (
        <Fragment />
      )}
    </div>
  );
}

/**
 * Static-property attachment. PRESERVED verbatim from the v2 wrapper: the
 * EXPLICIT intersection type annotation (rather than relying on `Object.assign`
 * inference) keeps the emitted `.d.ts` portable — every member is a named,
 * exported component, so `tsc --declaration` never inlines a non-portable
 * internal HeroUI path (TS2742).
 */
export const AppAvatar: typeof AppAvatarRoot & {
  Group: typeof AppAvatarGroup;
} = Object.assign(AppAvatarRoot, {
  Group: AppAvatarGroup,
});
