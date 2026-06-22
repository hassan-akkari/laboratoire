import type { Meta, StoryObj } from "@storybook/react";
import { AppDivider } from "./AppDivider";

/**
 * Variant C story: typed `argTypes`, meaningful states, autodocs on. A separator
 * is `role="separator"`; HeroUI v3 sets the correct `aria-orientation`.
 *
 * v3 prop surface only: `orientation` ('horizontal' | 'vertical') and `variant`
 * (the CONTRAST scale 'default' | 'secondary' | 'tertiary'). The v2 axes
 * (color/radius/size) are gone in v3 and are not exercised here.
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
    variant: {
      control: "inline-radio",
      options: ["default", "secondary", "tertiary"],
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

/** Vertical separator sitting between inline items (needs a sized container). */
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

/**
 * The v3 CONTRAST scale. `secondary`/`tertiary` step the rule down in prominence
 * (this replaces v2's color/intent `variant` axis, which no longer exists).
 */
export const ContrastScale: Story = {
  render: () => (
    <div style={{ maxWidth: 320, display: "grid", gap: 16 }}>
      <div>
        <p style={{ margin: 0 }}>default</p>
        <AppDivider variant="default" style={{ marginTop: 8 }} />
      </div>
      <div>
        <p style={{ margin: 0 }}>secondary</p>
        <AppDivider variant="secondary" style={{ marginTop: 8 }} />
      </div>
      <div>
        <p style={{ margin: 0 }}>tertiary</p>
        <AppDivider variant="tertiary" style={{ marginTop: 8 }} />
      </div>
    </div>
  ),
};
