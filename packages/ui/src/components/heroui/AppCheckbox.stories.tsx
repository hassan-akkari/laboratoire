import type { Meta, StoryObj } from "@storybook/react";
import { AppCheckbox } from "./AppCheckbox";

/**
 * Variant C story: typed `argTypes`, every meaningful state, autodocs on. The
 * checkbox label (children) provides the accessible name.
 */
const meta = {
  title: "HeroUI/AppCheckbox",
  component: AppCheckbox,
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
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    radius: {
      control: "inline-radio",
      options: ["none", "sm", "md", "lg", "full"],
    },
    isSelected: { control: "boolean" },
    isIndeterminate: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    children: "Accept terms",
  },
} satisfies Meta<typeof AppCheckbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultSelected: true, children: "Subscribe to updates" },
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <AppCheckbox {...args} defaultSelected color="default">
        default
      </AppCheckbox>
      <AppCheckbox {...args} defaultSelected color="primary">
        primary
      </AppCheckbox>
      <AppCheckbox {...args} defaultSelected color="secondary">
        secondary
      </AppCheckbox>
      <AppCheckbox {...args} defaultSelected color="success">
        success
      </AppCheckbox>
      <AppCheckbox {...args} defaultSelected color="warning">
        warning
      </AppCheckbox>
      <AppCheckbox {...args} defaultSelected color="danger">
        danger
      </AppCheckbox>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <AppCheckbox {...args} defaultSelected size="sm">
        sm
      </AppCheckbox>
      <AppCheckbox {...args} defaultSelected size="md">
        md
      </AppCheckbox>
      <AppCheckbox {...args} defaultSelected size="lg">
        lg
      </AppCheckbox>
    </div>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true, defaultSelected: true, children: "Disabled" },
};
