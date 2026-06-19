import type { Meta, StoryObj } from "@storybook/react";
import {
  AppTable,
  AppTableHeader,
  AppTableColumn,
  AppTableBody,
  AppTableRow,
  AppTableCell,
} from "./AppTable";
import { AppChip } from "./AppChip";

/**
 * Variant C story: the heaviest compound. Covers the static-children form, the
 * dynamic `columns`/`items` collection form, the built-in empty state, the
 * loading state, and selection. Every table sets `aria-label` so addon-a11y is
 * clean (HeroUI renders a `role="grid"` that needs an accessible name).
 */
const meta = {
  title: "HeroUI/AppTable",
  component: AppTable,
  tags: ["autodocs"],
  argTypes: {
    shadow: { control: "inline-radio", options: ["none", "sm", "md", "lg"] },
    radius: { control: "inline-radio", options: ["none", "sm", "md", "lg"] },
    isStriped: { control: "boolean" },
    isCompact: { control: "boolean" },
    hideHeader: { control: "boolean" },
  },
  args: {
    "aria-label": "Bookings",
  },
} satisfies Meta<typeof AppTable>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Static children — the most explicit form. */
export const Static: Story = {
  render: (args) => (
    <AppTable {...args}>
      <AppTableHeader>
        <AppTableColumn>EXPERIENCE</AppTableColumn>
        <AppTableColumn>GUESTS</AppTableColumn>
        <AppTableColumn>STATUS</AppTableColumn>
      </AppTableHeader>
      <AppTableBody>
        <AppTableRow key="1">
          <AppTableCell>Sunrise hike</AppTableCell>
          <AppTableCell>2</AppTableCell>
          <AppTableCell>
            <AppChip color="success" size="sm">
              confirmed
            </AppChip>
          </AppTableCell>
        </AppTableRow>
        <AppTableRow key="2">
          <AppTableCell>Reef dive</AppTableCell>
          <AppTableCell>4</AppTableCell>
          <AppTableCell>
            <AppChip color="warning" size="sm">
              pending
            </AppChip>
          </AppTableCell>
        </AppTableRow>
      </AppTableBody>
    </AppTable>
  ),
};

interface Row {
  key: string;
  experience: string;
  guests: number;
  status: string;
}
interface Col {
  key: keyof Row;
  label: string;
}

const COLUMNS: Col[] = [
  { key: "experience", label: "EXPERIENCE" },
  { key: "guests", label: "GUESTS" },
  { key: "status", label: "STATUS" },
];
const ROWS: Row[] = [
  { key: "1", experience: "Sunrise hike", guests: 2, status: "confirmed" },
  { key: "2", experience: "Reef dive", guests: 4, status: "pending" },
  { key: "3", experience: "Pasta workshop", guests: 6, status: "confirmed" },
];

/** Dynamic collection form — `columns`/`items` render props (generic preserved). */
export const Dynamic: Story = {
  render: (args) => (
    <AppTable {...args}>
      <AppTableHeader columns={COLUMNS}>
        {(col) => <AppTableColumn key={col.key}>{col.label}</AppTableColumn>}
      </AppTableHeader>
      <AppTableBody items={ROWS}>
        {(row) => (
          <AppTableRow key={row.key}>
            {(colKey) => <AppTableCell>{String(row[colKey as keyof Row])}</AppTableCell>}
          </AppTableRow>
        )}
      </AppTableBody>
    </AppTable>
  ),
};

/** Empty-state edge — `TableBody emptyContent` is the built-in API. */
export const Empty: Story = {
  render: (args) => (
    <AppTable {...args}>
      <AppTableHeader>
        <AppTableColumn>EXPERIENCE</AppTableColumn>
        <AppTableColumn>GUESTS</AppTableColumn>
      </AppTableHeader>
      <AppTableBody emptyContent="No bookings yet.">{[]}</AppTableBody>
    </AppTable>
  ),
};

/** Loading edge — `isLoading` + `loadingContent`. */
export const Loading: Story = {
  render: (args) => (
    <AppTable {...args}>
      <AppTableHeader>
        <AppTableColumn>EXPERIENCE</AppTableColumn>
        <AppTableColumn>GUESTS</AppTableColumn>
      </AppTableHeader>
      <AppTableBody isLoading loadingContent={<span>Loading…</span>}>
        {[]}
      </AppTableBody>
    </AppTable>
  ),
};

/** Selectable rows — multiple selection with the built-in checkboxes. */
export const Selectable: Story = {
  args: { selectionMode: "multiple", defaultSelectedKeys: ["1"] },
  render: (args) => (
    <AppTable {...args}>
      <AppTableHeader>
        <AppTableColumn>EXPERIENCE</AppTableColumn>
        <AppTableColumn>GUESTS</AppTableColumn>
      </AppTableHeader>
      <AppTableBody>
        <AppTableRow key="1">
          <AppTableCell>Sunrise hike</AppTableCell>
          <AppTableCell>2</AppTableCell>
        </AppTableRow>
        <AppTableRow key="2">
          <AppTableCell>Reef dive</AppTableCell>
          <AppTableCell>4</AppTableCell>
        </AppTableRow>
      </AppTableBody>
    </AppTable>
  ),
};

/** Striped + compact density styling. */
export const StripedCompact: Story = {
  args: { isStriped: true, isCompact: true },
  render: Static.render,
};
