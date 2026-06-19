"use client";

import {
  Table as HeroTable,
  TableHeader as HeroTableHeader,
  TableColumn as HeroTableColumn,
  TableBody as HeroTableBody,
  TableRow as HeroTableRow,
  TableCell as HeroTableCell,
  type TableProps,
  type TableHeaderProps,
  type TableColumnProps,
  type TableBodyProps,
  type TableRowProps,
  type TableCellProps,
} from "@heroui/react";

/**
 * AppTable — ARCHETYPE 5: HEAVY COMPOUND component (the upper bound of the
 * convention).
 *
 * COLLECTION-COMPOUND CONVENTION:
 * `Table` composes six pieces. Three of the public authoring components are
 * GENERIC over the row type — HeroUI types them as `<T>(props) => JSX.Element`:
 * `TableHeader<T>`, `TableColumn<T>`, `TableBody<T>`. The remaining two,
 * `TableRow` and `TableCell`, are NON-generic at the value level (their prop
 * type defaults `T` to `object`). We mirror each exactly: generic wrappers for
 * the first three, plain wrappers for the last two. (Mirroring HeroUI's own
 * constraints — bare `<T>`, no `extends object` — avoids rejecting valid usage.)
 *
 * Collection children MUST remain DIRECT descendants of their parent (React-Aria
 * walks `Table > TableHeader > TableColumn` and `Table > TableBody > TableRow >
 * TableCell` to build the collection). Every slot is therefore a THIN
 * passthrough that introduces NO wrapping element — adding a `<div>` would break
 * the collection. This is the firm boundary of the wrapper convention: for
 * collection compounds, wrappers re-export and attach as static members but
 * never restructure the tree.
 *
 * Exposed as both named exports (`AppTableHeader`, …) and static members
 * (`AppTable.Header`, `AppTable.Column`, `AppTable.Body`, `AppTable.Row`,
 * `AppTable.Cell`).
 *
 * ACCESSIBILITY: HeroUI renders semantic `role="grid"`/`columnheader`/`rowgroup`
 * structure that needs an accessible name — give the table `aria-label` (or
 * `aria-labelledby`) on `AppTable`. The empty and loading states use the
 * built-in `TableBody` props (`emptyContent`, `isLoading`/`loadingContent`).
 *
 * Defaults: `radius="sm"` and `shadow="sm"` to match `AppCard`; both overridable.
 */
export type AppTableProps = TableProps;
export type AppTableHeaderProps<T = object> = TableHeaderProps<T>;
export type AppTableColumnProps<T = object> = TableColumnProps<T>;
export type AppTableBodyProps<T = object> = TableBodyProps<T>;
export type AppTableRowProps<T = object> = TableRowProps<T>;
export type AppTableCellProps = TableCellProps;

export function AppTableHeader<T>(props: AppTableHeaderProps<T>) {
  return <HeroTableHeader {...props} />;
}

export function AppTableColumn<T>(props: AppTableColumnProps<T>) {
  return <HeroTableColumn {...props} />;
}

export function AppTableBody<T>(props: AppTableBodyProps<T>) {
  return <HeroTableBody {...props} />;
}

export function AppTableRow(props: AppTableRowProps) {
  return <HeroTableRow {...props} />;
}

export function AppTableCell(props: AppTableCellProps) {
  return <HeroTableCell {...props} />;
}

function AppTableRoot({ radius = "sm", shadow = "sm", ...props }: AppTableProps) {
  return <HeroTable radius={radius} shadow={shadow} {...props} />;
}

/**
 * Explicit intersection annotation: keeps each generic slot's call signature and
 * the static members in the `.d.ts`, portable for `tsc --declaration` (TS2742).
 */
export const AppTable: typeof AppTableRoot & {
  Header: typeof AppTableHeader;
  Column: typeof AppTableColumn;
  Body: typeof AppTableBody;
  Row: typeof AppTableRow;
  Cell: typeof AppTableCell;
} = Object.assign(AppTableRoot, {
  Header: AppTableHeader,
  Column: AppTableColumn,
  Body: AppTableBody,
  Row: AppTableRow,
  Cell: AppTableCell,
});
