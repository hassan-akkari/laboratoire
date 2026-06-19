import type { Meta, StoryObj } from "@storybook/react";
import { AppDivider } from "./AppDivider";

/**
 * Variant C story: typed `argTypes`, meaningful states, autodocs on. A divider
 * is `role="separator"`; HeroUI sets the correct `aria-orientation`.
 */
const meta = {
  title: "HeroUI/AppDivider",
  component: AppDivider,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof AppDivider>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Default horizontal rule between two blocks of content. */
export const Horizontal: Story = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <p style={{ margin: 0 }}>Mountain Sunrise Hike</p>
      <AppDivider {...args} style={{ margin: "12px 0" }} />
      <p style={{ margin: 0 }}>Includes gear and a warm breakfast.</p>
    </div>
  ),
};

/** Vertical divider sitting between inline items (needs a sized container). */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, height: 24 }}>
      <span>Guests</span>
      <AppDivider {...args} />
      <span>Quote</span>
      <AppDivider {...args} />
      <span>Checkout</span>
    </div>
  ),
};
