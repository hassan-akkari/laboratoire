import type { Meta, StoryObj } from "@storybook/react";
import { AppChip } from "./AppChip";

/**
 * Variant C story: typed `argTypes`, every meaningful state, autodocs on, and
 * clean a11y (chips carry text content, so they expose an accessible name).
 */
const meta = {
  title: "HeroUI/AppChip",
  component: AppChip,
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
      options: ["solid", "bordered", "light", "flat", "faded", "shadow", "dot"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    radius: {
      control: "inline-radio",
      options: ["none", "sm", "md", "lg", "full"],
    },
    isDisabled: { control: "boolean" },
  },
  args: {
    children: "Network",
  },
} satisfies Meta<typeof AppChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <AppChip {...args} color="default">
        default
      </AppChip>
      <AppChip {...args} color="primary">
        primary
      </AppChip>
      <AppChip {...args} color="secondary">
        secondary
      </AppChip>
      <AppChip {...args} color="success">
        success
      </AppChip>
      <AppChip {...args} color="warning">
        warning
      </AppChip>
      <AppChip {...args} color="danger">
        danger
      </AppChip>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <AppChip {...args} variant="solid">
        solid
      </AppChip>
      <AppChip {...args} variant="bordered">
        bordered
      </AppChip>
      <AppChip {...args} variant="flat">
        flat
      </AppChip>
      <AppChip {...args} variant="faded">
        faded
      </AppChip>
      <AppChip {...args} variant="dot">
        dot
      </AppChip>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <AppChip {...args} size="sm">
        sm
      </AppChip>
      <AppChip {...args} size="md">
        md
      </AppChip>
      <AppChip {...args} size="lg">
        lg
      </AppChip>
    </div>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true, children: "Disabled" },
};

/**
 * Closeable chip — `onClose` renders an accessible close button (HeroUI labels
 * it). Demonstrates the interactive edge of the simplest archetype.
 */
export const Closeable: Story = {
  args: {
    children: "Remove me",
    onClose: () => {},
  },
};
