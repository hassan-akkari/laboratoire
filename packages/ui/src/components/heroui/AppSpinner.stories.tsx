import type { Meta, StoryObj } from "@storybook/react";
import { AppSpinner } from "./AppSpinner";

/**
 * Variant C story: typed `argTypes`, every meaningful state, autodocs on. A
 * `label` gives the spinner an accessible status, keeping addon-a11y clean.
 */
const meta = {
  title: "HeroUI/AppSpinner",
  component: AppSpinner,
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
        "current",
        "white",
      ],
    },
    variant: {
      control: "select",
      options: ["default", "simple", "gradient", "wave", "dots", "spinner"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    label: { control: "text" },
  },
  args: {
    label: "Loading quote…",
  },
} satisfies Meta<typeof AppSpinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <AppSpinner {...args} color="primary" />
      <AppSpinner {...args} color="secondary" />
      <AppSpinner {...args} color="success" />
      <AppSpinner {...args} color="warning" />
      <AppSpinner {...args} color="danger" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <AppSpinner {...args} size="sm" label="sm" />
      <AppSpinner {...args} size="md" label="md" />
      <AppSpinner {...args} size="lg" label="lg" />
    </div>
  ),
};

/** No visible label — provide an `aria-label` so the status is still announced. */
export const NoLabel: Story = {
  args: { label: undefined, "aria-label": "Loading" },
};
