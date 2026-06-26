import type { Meta, StoryObj } from "@storybook/react";
import { AppTooltip } from "./AppTooltip";
import { AppButton } from "./AppButton";

/**
 * Variant C story: typed `argTypes`, meaningful states, autodocs on. The trigger
 * is a focusable `AppButton`, so the tooltip is reachable by keyboard.
 */
const meta = {
  title: "HeroUI/AppTooltip",
  component: AppTooltip,
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
        "foreground",
      ],
    },
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    radius: {
      control: "inline-radio",
      options: ["none", "sm", "md", "lg", "full"],
    },
    showArrow: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    content: "Service fee is 8% of the subtotal.",
    children: <AppButton size="sm">Hover or focus me</AppButton>,
  },
} satisfies Meta<typeof AppTooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Placements: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, padding: 40, flexWrap: "wrap" }}>
      <AppTooltip {...args} placement="top" content="top">
        <AppButton size="sm">top</AppButton>
      </AppTooltip>
      <AppTooltip {...args} placement="bottom" content="bottom">
        <AppButton size="sm">bottom</AppButton>
      </AppTooltip>
      <AppTooltip {...args} placement="left" content="left">
        <AppButton size="sm">left</AppButton>
      </AppTooltip>
      <AppTooltip {...args} placement="right" content="right">
        <AppButton size="sm">right</AppButton>
      </AppTooltip>
    </div>
  ),
};

/** Always-open via `isOpen` so the colored bubble is visible in autodocs. */
export const Colored: Story = {
  args: { color: "primary", isOpen: true, content: "Booking confirmed" },
};

/** Disabled tooltip — the trigger still renders, the bubble never shows. */
export const Disabled: Story = {
  args: { isDisabled: true },
};
