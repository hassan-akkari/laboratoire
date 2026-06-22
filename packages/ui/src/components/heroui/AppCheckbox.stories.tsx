import type { Meta, StoryObj } from "@storybook/react";
import { AppCheckbox } from "./AppCheckbox";

/**
 * v3 story surface. The v2-only axes (`color`, `radius`, `classNames`,
 * `labelPlacement`) are GONE in v3 and removed here; the controls now reflect the
 * v3 prop surface that AppCheckbox preserves: `variant` (primary|secondary),
 * `size` (mapped to a Tailwind `size-*` class on the control), plus the boolean
 * state flags. The checkbox label (children) provides the accessible name.
 */
const meta = {
  title: "HeroUI/AppCheckbox",
  component: AppCheckbox,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    isSelected: { control: "boolean" },
    isIndeterminate: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
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

export const Indeterminate: Story = {
  args: { isIndeterminate: true, children: "Select all" },
};

export const Disabled: Story = {
  args: { isDisabled: true, defaultSelected: true, children: "Disabled" },
};

export const Invalid: Story = {
  args: { isInvalid: true, isRequired: true, children: "I agree to the terms" },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <AppCheckbox {...args} defaultSelected variant="primary">
        primary
      </AppCheckbox>
      <AppCheckbox {...args} defaultSelected variant="secondary">
        secondary
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
