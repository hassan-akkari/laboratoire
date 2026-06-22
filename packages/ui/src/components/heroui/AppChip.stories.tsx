import type { Meta, StoryObj } from "@storybook/react";
import { AppChip } from "./AppChip";

/**
 * AppChip stories — updated to the HeroUI **v3** prop surface.
 *
 * The wrapper accepts BOTH the v2 vocabulary (for unmigrated call sites) and the
 * v3 vocabulary; these stories exercise the v3 axes the wrapper maps onto:
 *   - color:   default | accent | success | warning | danger  (no primary/secondary)
 *   - variant: primary | secondary | tertiary | soft
 *   - size:    sm | md | lg
 * `radius` is gone in v3, so it is no longer a control. Plain-string children
 * work because v3 auto-wraps text in `<Chip.Label>`.
 */
const meta = {
  title: "HeroUI/AppChip",
  component: AppChip,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "accent", "success", "warning", "danger"],
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "soft"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
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
      <AppChip {...args} color="accent">
        accent
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
      <AppChip {...args} variant="primary">
        primary
      </AppChip>
      <AppChip {...args} variant="secondary">
        secondary
      </AppChip>
      <AppChip {...args} variant="tertiary">
        tertiary
      </AppChip>
      <AppChip {...args} variant="soft">
        soft
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
