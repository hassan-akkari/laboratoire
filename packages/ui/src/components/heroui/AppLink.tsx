"use client";

/**
 * AppLink — v3 MIGRATION (archetype: single-element passthrough with a compound
 * `Link.Icon`, sibling of `AppButton` / `AppCard`).
 *
 * Now consumes HeroUI **v3** (`@heroui-v3/react`) while the rest of the inventory
 * still consumes v2 (`@heroui/react`). The two majors coexist via pnpm aliases
 * (Strategy A); see `packages/ui/package.json`.
 *
 * THE PATTERN (same anti-corruption contract as AppButton)
 * --------------------------------------------------------
 * v3 Link is a hard API break: every visual axis the v2 Link exposed as a PROP
 * is gone, replaced by Tailwind utilities. To migrate INCREMENTALLY without
 * editing call sites (the barrel re-exports `AppLink` + `AppLinkProps` by name,
 * and `AppNavbar.stories.tsx` still passes `color`/`size`), `AppLinkProps` is a
 * HAND-WRITTEN interface that keeps accepting the v2-era prop surface; this
 * wrapper maps that surface onto the v3 API internally. The public contract is
 * preserved byte-for-byte at the call site.
 *
 * v3 Link API deltas handled here:
 *   - `color` GONE as a prop. v2 default was `color="primary"` (the warm
 *     accent), so we DEFAULT the rendered Link to `text-accent decoration-accent`
 *     Tailwind classes (v3 link colors come from utilities, not a prop). The
 *     `color` prop is still ACCEPTED and IGNORED so existing call sites compile.
 *   - `size` GONE. ACCEPTED and IGNORED (sizing now via Tailwind `text-*`).
 *   - `underline` enum GONE. ACCEPTED and IGNORED — v3 underlines on hover by
 *     default; call sites that want an always-on / no underline pass Tailwind
 *     `underline` / `no-underline` via `className`.
 *   - `isBlock` GONE. ACCEPTED and IGNORED (express via Tailwind layout classes).
 *   - `isExternal` / `showAnchorIcon` → composed as a trailing `<Link.Icon />`.
 *     `isExternal` ALSO applies safe defaults `target="_blank"` +
 *     `rel="noopener noreferrer"` (preserving the v2 external-link semantics)
 *     unless the call site overrode `target` / `rel` explicitly.
 *   - Uses `onPress`, not `onClick` (react-aria). We accept `onPress` directly.
 *
 * Styling foundation: warm v3 CSS vars live in `../../theme/v3/warmThemeV3.css`;
 * the rendered root is scoped with `withV3Theme()` so the link is correctly
 * themed even when dropped outside an explicit wrapper element.
 */

import { type ReactNode } from "react";
import {
  Link as HeroV3Link,
  type LinkProps as HeroV3LinkProps,
} from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/** v2-era `color` strings call sites / stories still pass (accept-and-ignore). */
type V2LinkColor =
  | "foreground"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

/** v2-era `underline` enum (accept-and-ignore — express via Tailwind instead). */
type V2LinkUnderline = "none" | "hover" | "always" | "active" | "focus";

type V2LinkSize = "sm" | "md" | "lg";

/**
 * PUBLIC, PRESERVED prop surface. Superset of every prop the apps + stories pass
 * to AppLink today. The v2 style axes (`color`/`size`/`underline`/`isBlock`) are
 * accepted for source compatibility but no longer drive rendering in v3; the
 * functional/anchor props map straight onto the v3 Link.
 */
export interface AppLinkProps {
  children?: ReactNode;
  /** Destination URL for the anchor. */
  href?: string;
  /** Where to open the linked document. Defaults to `_blank` when `isExternal`. */
  target?: string;
  /** Relationship between documents. Defaults to safe rel when `isExternal`. */
  rel?: string;
  /** Prompt a file download instead of navigation. */
  download?: boolean | string;
  /** Disables pointer + keyboard interaction (v3-native). */
  isDisabled?: boolean;
  /** Whether the element should receive focus on render (v3-native). */
  autoFocus?: boolean;
  className?: string;
  /** v3/react-aria press handler (replaces v2 `onClick`). */
  onPress?: HeroV3LinkProps["onPress"];

  // ---- v2-era style props: ACCEPTED, no longer rendered as props in v3 -----
  /** v2 semantic color — IGNORED in v3; default warm accent applied via class. */
  color?: V2LinkColor;
  /** v2 size — IGNORED in v3 (size via Tailwind `text-*`). */
  size?: V2LinkSize;
  /** v2 underline enum — IGNORED in v3 (use Tailwind `underline`/`no-underline`). */
  underline?: V2LinkUnderline;
  /** v2 block layout — IGNORED in v3 (use Tailwind layout classes). */
  isBlock?: boolean;

  // ---- icon composition (v2 `isExternal` / `showAnchorIcon`) ---------------
  /**
   * External link: renders a trailing `<Link.Icon />` AND applies safe defaults
   * `target="_blank"` + `rel="noopener noreferrer"` unless overridden.
   */
  isExternal?: boolean;
  /** Force the trailing anchor `<Link.Icon />` (independent of `isExternal`). */
  showAnchorIcon?: boolean;

  // Common pass-throughs.
  id?: string;
  style?: React.CSSProperties;
  title?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-current"?: React.AriaAttributes["aria-current"];
}

/**
 * v3 Link has NO `color` prop — color is expressed via Tailwind utilities. To
 * PRESERVE the v2 `color` semantics (e.g. AppNavbar's `color="foreground"` muted
 * nav links) we MAP each v2 color onto its `text-*`/`decoration-*` utility pair
 * here, instead of accept-and-ignoring it (which silently dropped the value).
 * `color` defaults to `"primary"` (the warm accent), matching the v2 wrapper
 * default. (`success`/`warning`/`danger` resolve against the @heroui-v3/styles
 * default theme — the warm scope defines no semantic-status colors.)
 */
const V2_LINK_COLOR_CLASS: Record<V2LinkColor, string> = {
  foreground: "text-foreground decoration-foreground",
  primary: "text-accent decoration-accent",
  // v3 has no `secondary` color; fold onto the muted foreground (closest v2 read).
  secondary: "text-foreground decoration-foreground",
  success: "text-success decoration-success",
  warning: "text-warning decoration-warning",
  danger: "text-danger decoration-danger",
};

export function AppLink({
  children,
  href,
  target,
  rel,
  download,
  isDisabled,
  autoFocus,
  className,
  onPress,
  // v2 `color` is mapped to a Tailwind class below (preserves v2 color
  // semantics). size/underline/isBlock have no v3 prop equivalent — stripped
  // from the forwarded set and ignored.
  color = "primary",
  size: _size,
  underline: _underline,
  isBlock: _isBlock,
  isExternal,
  showAnchorIcon,
  ...rest
}: AppLinkProps) {
  // size/underline/isBlock are accepted for source-compat and intentionally
  // stripped above so they are NOT forwarded onto the v3 Link/anchor. Discard
  // explicitly (they no longer drive rendering) to satisfy `no-unused-vars`.
  void _size;
  void _underline;
  void _isBlock;

  // Map the v2 `color` onto its Tailwind utility pair (see V2_LINK_COLOR_CLASS).
  const colorClass = V2_LINK_COLOR_CLASS[color];

  // External links get safe target/rel defaults unless the call site set them.
  const resolvedTarget = target ?? (isExternal ? "_blank" : undefined);
  const resolvedRel = rel ?? (isExternal ? "noopener noreferrer" : undefined);

  // v2 `isExternal` and `showAnchorIcon` both surface the trailing arrow icon.
  const withIcon = isExternal || showAnchorIcon;

  return (
    <HeroV3Link
      href={href}
      target={resolvedTarget}
      rel={resolvedRel}
      download={download}
      isDisabled={isDisabled}
      autoFocus={autoFocus}
      onPress={onPress}
      className={withV3Theme(`${colorClass} ${className ?? ""}`.trim())}
      {...rest}
    >
      {children}
      {withIcon ? <HeroV3Link.Icon /> : null}
    </HeroV3Link>
  );
}
