"use client";

import {
  Pagination as HeroPagination,
  type PaginationProps,
} from "@heroui/react";

/**
 * AppPagination — ARCHETYPE 1 (leaf-ish): single-element passthrough.
 *
 * HeroUI's `Pagination` renders the full control set (page items + prev/next
 * chevrons) from a single element driven by the required `total` prop, so it
 * stays a leaf wrapper — no sub-components to attach.
 *
 *   1. `"use client";` first (RSC-safe for web-next; Vite ignores it).
 *   2. Re-export HeroUI's own `PaginationProps` verbatim as `AppPaginationProps`.
 *   3. Apply warm defaults via destructured props, then spread `...props` LAST.
 *
 * Defaults: `color="primary"` (selected-page cursor uses the warm accent, like
 * `AppButton`), `radius="sm"` and `variant="flat"` to match `AppChip`, and
 * `showControls` so prev/next arrows are present by default. `total` carries no
 * default — it is required and meaningless to guess.
 *
 * ACCESSIBILITY: `Pagination` renders a `<nav>` and React-Aria labels each page
 * item; supply `total` (and typically a controlled `page` + `onChange`).
 */
export type AppPaginationProps = PaginationProps;

export function AppPagination({
  color = "primary",
  radius = "sm",
  variant = "flat",
  showControls = true,
  ...props
}: AppPaginationProps) {
  return (
    <HeroPagination
      color={color}
      radius={radius}
      variant={variant}
      showControls={showControls}
      {...props}
    />
  );
}
