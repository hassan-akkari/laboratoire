import type { Meta, StoryObj } from "@storybook/react";
import { AppPagination } from "./AppPagination";

/**
 * Variant C story: typed `argTypes`, meaningful states, autodocs on. Pagination
 * renders a `<nav>` with React-Aria-labelled page items, so it is accessible
 * once `total` is provided.
 */
const meta = {
  title: "HeroUI/AppPagination",
  component: AppPagination,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "success",
        "warning",
        "danger",
      ],
    },
    variant: {
      control: "select",
      options: ["flat", "bordered", "light", "faded"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    radius: {
      control: "inline-radio",
      options: ["none", "sm", "md", "lg", "full"],
    },
    showControls: { control: "boolean" },
    loop: { control: "boolean" },
    isCompact: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    total: 10,
    initialPage: 1,
  },
} satisfies Meta<typeof AppPagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Compact + looping controls — denser footprint for tight footers. */
export const Compact: Story = {
  args: { isCompact: true, loop: true },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <AppPagination {...args} variant="flat" />
      <AppPagination {...args} variant="bordered" />
      <AppPagination {...args} variant="light" />
      <AppPagination {...args} variant="faded" />
    </div>
  ),
};

/** No prev/next chevrons. */
export const NoControls: Story = {
  args: { showControls: false },
};
