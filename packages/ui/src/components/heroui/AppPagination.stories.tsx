import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AppPagination } from "./AppPagination";

/**
 * v3-migrated story. `AppPagination` keeps the v2 DECLARATIVE surface
 * (`total` / `page` / `onChange` / `showControls` / `size`) over a v3 compound
 * tree, so the stories stay declarative — each meaningful state drives a tiny
 * stateful `render` that owns the controlled `page` and feeds `onChange` back.
 *
 * The v3 prop surface here is `total` (page COUNT), `page`, `defaultPage`,
 * `onChange`, `showControls`, `size`, `siblings`, `boundaries`, `isDisabled`.
 * The removed v2 axes (`color` / `variant` / `radius` / `loop` / `isCompact`)
 * are gone, so they are absent from `argTypes`.
 */
const meta = {
  title: "HeroUI/AppPagination",
  component: AppPagination,
  tags: ["autodocs"],
  argTypes: {
    total: { control: { type: "number", min: 1 } },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    siblings: { control: { type: "number", min: 0 } },
    boundaries: { control: { type: "number", min: 1 } },
    showControls: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    total: 5,
    defaultPage: 1,
    showControls: true,
  },
} satisfies Meta<typeof AppPagination>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Stateful harness: holds the controlled `page` so navigation actually moves
 * (the wrapper computes the page window from `page`). Used by every story so the
 * declarative API is exercised end-to-end.
 */
function Stateful(args: React.ComponentProps<typeof AppPagination>) {
  const [page, setPage] = useState(args.defaultPage ?? 1);
  return <AppPagination {...args} page={page} onChange={setPage} />;
}

/** Basic: a small page count that fits with no ellipsis. */
export const Basic: Story = {
  render: (args) => <Stateful {...args} />,
};

/** Large total => the window collapses with `Pagination.Ellipsis` on each side. */
export const WithEllipsis: Story = {
  args: { total: 20, defaultPage: 10 },
  render: (args) => <Stateful {...args} />,
};

/** No prev/next chevrons (declarative `showControls={false}`). */
export const NoControls: Story = {
  args: { total: 8, showControls: false },
  render: (args) => <Stateful {...args} />,
};

/**
 * Disabled controls at a boundary: on page 1 the Previous chevron is disabled
 * (boundary), and `isDisabled` disables the entire control set.
 */
export const DisabledAtBoundary: Story = {
  args: { total: 10, defaultPage: 1, isDisabled: true },
  render: (args) => <Stateful {...args} />,
};

/** Size variants, exercised side by side. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Stateful {...args} size="sm" />
      <Stateful {...args} size="md" />
      <Stateful {...args} size="lg" />
    </div>
  ),
};
