import type { Meta, StoryObj } from "@storybook/react";
import { AppSwitch } from "./AppSwitch";

/**
 * Variant C story: typed `argTypes`, every meaningful state, autodocs on. A
 * switch with a label (children) exposes an accessible name.
 */
const meta = {
  title: "HeroUI/AppSwitch",
  component: AppSwitch,
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
    isSelected: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    children: "Enable notifications",
  },
} satisfies Meta<typeof AppSwitch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const On: Story = {
  args: { defaultSelected: true, children: "Dark mode" },
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <AppSwitch {...args} defaultSelected color="default">
        default
      </AppSwitch>
      <AppSwitch {...args} defaultSelected color="primary">
        primary
      </AppSwitch>
      <AppSwitch {...args} defaultSelected color="secondary">
        secondary
      </AppSwitch>
      <AppSwitch {...args} defaultSelected color="success">
        success
      </AppSwitch>
      <AppSwitch {...args} defaultSelected color="warning">
        warning
      </AppSwitch>
      <AppSwitch {...args} defaultSelected color="danger">
        danger
      </AppSwitch>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <AppSwitch {...args} defaultSelected size="sm">
        sm
      </AppSwitch>
      <AppSwitch {...args} defaultSelected size="md">
        md
      </AppSwitch>
      <AppSwitch {...args} defaultSelected size="lg">
        lg
      </AppSwitch>
    </div>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true, defaultSelected: true, children: "Disabled" },
};
