"use client";

/**
 * AppPagination — FULL COMPOUND REWRITE (anti-corruption archetype).
 *
 * Now consumes HeroUI **v3** (`@heroui-v3/react`) alongside the still-v2 rest of
 * the inventory (coexistence via pnpm aliases — see `packages/ui/package.json`).
 *
 * THE ANTI-CORRUPTION WIN
 * -----------------------
 * v2 `Pagination` was a single DECLARATIVE element: you handed it `total` (the
 * page COUNT), a controlled/uncontrolled `page`, and `onChange`, and it rendered
 * the entire control set (page items + prev/next + ellipsis) internally.
 *
 * v3 inverts this: `Pagination` is a COMPOUND tree (`Pagination.Content` ->
 * `Pagination.Item` -> `Pagination.Link` / `.Previous` / `.Next` / `.Ellipsis`)
 * and the CALLER is expected to own page state, compute the visible page window,
 * place the ellipses, and wire every `onPress`. That is a hard break for the
 * docs/stories call sites which still pass `<AppPagination total page onChange />`.
 *
 * So this wrapper PRESERVES THE V2 DECLARATIVE API byte-for-byte at the call
 * site and absorbs the entire compound complexity internally: it manages page
 * state (controlled via `page`/`onChange`, or uncontrolled via `defaultPage` +
 * a local `useState` fallback), runs the page-window + ellipsis algorithm, and
 * builds the v3 `Pagination.*` tree. Callers keep the simple API; the migration
 * cost is paid once, here.
 *
 * v3 Pagination API deltas handled here:
 *   - `showControls` GONE -> we render `Pagination.Previous` / `Pagination.Next`
 *     explicitly, gated on the public `showControls` (default `true`, matching v2).
 *   - `total` / `page` / `onChange` / `siblings` / `boundaries` GONE as props on
 *     the v3 root -> consumed by THIS wrapper to drive state + the page window.
 *   - `color` / `variant` / `radius` / `classNames` / `loop` / `isCompact` /
 *     `initialPage` GONE -> dropped (the warm theme + v3 size cover the styling).
 *   - `size` KEPT (the only v3 root style axis).
 *   - Active page = `isActive` on `Pagination.Link` (v2 had no per-item flag).
 *   - Press handling = `onPress`, never `onClick` (react-aria normalizes it).
 *
 * Styling foundation: warm v3 CSS vars in `../../theme/v3/warmThemeV3.css`; the
 * root `<nav>` scopes itself with `withV3Theme()` so the control is themed
 * correctly even when dropped outside an explicit wrapper element. The active
 * page reads `--accent` (warm indigo); there is intentionally no warm
 * success/warning/danger axis here (none of those existed on v2 pagination).
 */

import { useState, type ReactNode } from "react";
import { Pagination as HeroV3Pagination } from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

type V3Size = "sm" | "md" | "lg";

/**
 * PUBLIC, PRESERVED prop surface — the v2 DECLARATIVE contract. Callers pass the
 * same props they always did; the wrapper translates them onto the v3 compound
 * tree. HAND-WRITTEN (never `= PaginationProps`) so the public API is a stable
 * anti-corruption boundary, decoupled from v3's internal compound prop types.
 */
export interface AppPaginationProps {
  /**
   * The number of PAGES (v2 `total` semantics — a page COUNT, not an item
   * count). Required: there is no sensible default to guess.
   */
  total: number;
  /** Controlled current page (1-based). Pair with `onChange`. */
  page?: number;
  /** Uncontrolled initial page (1-based). Defaults to `1`. */
  defaultPage?: number;
  /** Fired with the next 1-based page when the user navigates. */
  onChange?: (page: number) => void;
  /**
   * Render the prev/next chevrons. Default `true` (matches the v2 wrapper, which
   * defaulted `showControls` on). v3 has no `showControls` prop, so we render
   * `Pagination.Previous` / `.Next` ourselves when this is on.
   */
  showControls?: boolean;
  /** Pagination size (the only v3 root style axis). */
  size?: V3Size;
  /**
   * How many page links to show on EACH side of the current page (the inner
   * window). Default `1`. Larger values widen the window before ellipses appear.
   */
  siblings?: number;
  /**
   * How many page links to pin at EACH boundary (first/last). Default `1`.
   */
  boundaries?: number;
  /** Disable the whole control (prev/next + every page link). */
  isDisabled?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

/**
 * Compute the ordered list of page slots to render: page NUMBERS interleaved
 * with `"ellipsis"` placeholders. v3 does not do this for us (it did in v2), so
 * the window logic lives here.
 *
 * Algorithm (boundaries + siblings window, matching the official v3 docs recipe
 * generalized):
 *   - Always pin the first `boundaries` and last `boundaries` pages.
 *   - Show the current page +/- `siblings` (the inner window).
 *   - Bridge a gap of exactly ONE hidden page with that real page (an ellipsis
 *     standing in for a single page is wasteful and misleading); bridge a gap of
 *     2+ hidden pages with a single `"ellipsis"`.
 *   - If everything fits (total <= the slots a full window would occupy), emit
 *     every page with no ellipsis at all.
 */
export function getPaginationRange(
  total: number,
  page: number,
  siblings: number,
  boundaries: number,
): (number | "ellipsis")[] {
  // Clamp inputs defensively (a caller could pass total=0 or an out-of-range page).
  const totalPages = Math.max(0, Math.floor(total));
  if (totalPages <= 0) return [];

  const current = Math.min(Math.max(1, Math.floor(page)), totalPages);
  const sib = Math.max(0, Math.floor(siblings));
  const bnd = Math.max(1, Math.floor(boundaries));

  // The maximum number of page links a full window could show:
  //   first boundary block + last boundary block + the inner window (current
  //   +/- siblings) + 2 ellipsis slots. If totalPages fits in that, render all.
  const totalShown = bnd * 2 + sib * 2 + 3;
  if (totalPages <= totalShown) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Inner window bounds, kept inside the [boundary..boundary] interior.
  const startInner = Math.max(current - sib, bnd + 1);
  const endInner = Math.min(current + sib, totalPages - bnd);

  // Whether a gap exists between the left/right boundary block and the window.
  const showLeftEllipsis = startInner > bnd + 2;
  const showRightEllipsis = endInner < totalPages - (bnd + 1);

  const range: (number | "ellipsis")[] = [];

  // Left boundary block: pages 1..bnd.
  for (let p = 1; p <= bnd; p++) range.push(p);

  // Left bridge: ellipsis for a 2+ gap, else the single bridging page.
  if (showLeftEllipsis) {
    range.push("ellipsis");
  } else {
    for (let p = bnd + 1; p < startInner; p++) range.push(p);
  }

  // Inner window: startInner..endInner.
  for (let p = startInner; p <= endInner; p++) range.push(p);

  // Right bridge: ellipsis for a 2+ gap, else the single bridging page.
  if (showRightEllipsis) {
    range.push("ellipsis");
  } else {
    for (let p = endInner + 1; p <= totalPages - bnd; p++) range.push(p);
  }

  // Right boundary block: the last bnd pages.
  for (let p = totalPages - bnd + 1; p <= totalPages; p++) range.push(p);

  return range;
}

export function AppPagination({
  total,
  page: controlledPage,
  defaultPage = 1,
  onChange,
  showControls = true,
  size = "md",
  siblings = 1,
  boundaries = 1,
  isDisabled = false,
  className,
  ...rest
}: AppPaginationProps) {
  // Controlled/uncontrolled page state. When `page` is provided the component is
  // controlled and the local state is ignored; otherwise the local state drives
  // it (seeded from `defaultPage`).
  const [uncontrolledPage, setUncontrolledPage] = useState(defaultPage);
  const isControlled = controlledPage != null;
  const totalPages = Math.max(0, Math.floor(total));
  const rawPage = isControlled ? controlledPage : uncontrolledPage;
  // Clamp the active page into [1, totalPages] so a stale controlled value or an
  // out-of-range default can never produce an impossible `isActive`/disabled mix.
  const currentPage = totalPages > 0 ? Math.min(Math.max(1, rawPage), totalPages) : 1;

  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), Math.max(1, totalPages));
    // Compare against the RAW current page (the controlled value when
    // controlled). If a controlled parent passed an out-of-range `page`, the
    // displayed `currentPage` is clamped — comparing against it would suppress
    // the click that should fire `onChange` to correct the parent. Comparing
    // against `rawPage` lets that correction through.
    const reference = isControlled ? rawPage : currentPage;
    if (clamped === reference) return;
    if (!isControlled) setUncontrolledPage(clamped);
    onChange?.(clamped);
  };

  const range = getPaginationRange(totalPages, currentPage, siblings, boundaries);
  const atStart = currentPage <= 1;
  const atEnd = currentPage >= totalPages;

  return (
    <HeroV3Pagination
      size={size}
      className={withV3Theme(className)}
      {...rest}
    >
      <HeroV3Pagination.Content>
        {showControls && (
          <HeroV3Pagination.Item>
            <HeroV3Pagination.Previous
              isDisabled={isDisabled || atStart}
              onPress={() => goToPage(currentPage - 1)}
            >
              <HeroV3Pagination.PreviousIcon />
              <span>Previous</span>
            </HeroV3Pagination.Previous>
          </HeroV3Pagination.Item>
        )}

        {range.map((slot, i): ReactNode =>
          slot === "ellipsis" ? (
            <HeroV3Pagination.Item key={`ellipsis-${i}`}>
              <HeroV3Pagination.Ellipsis />
            </HeroV3Pagination.Item>
          ) : (
            <HeroV3Pagination.Item key={slot}>
              <HeroV3Pagination.Link
                isActive={slot === currentPage}
                isDisabled={isDisabled}
                onPress={() => goToPage(slot)}
              >
                {slot}
              </HeroV3Pagination.Link>
            </HeroV3Pagination.Item>
          ),
        )}

        {showControls && (
          <HeroV3Pagination.Item>
            <HeroV3Pagination.Next
              isDisabled={isDisabled || atEnd}
              onPress={() => goToPage(currentPage + 1)}
            >
              <span>Next</span>
              <HeroV3Pagination.NextIcon />
            </HeroV3Pagination.Next>
          </HeroV3Pagination.Item>
        )}
      </HeroV3Pagination.Content>
    </HeroV3Pagination>
  );
}
