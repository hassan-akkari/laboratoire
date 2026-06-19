import type { Meta, StoryObj } from "@storybook/react";
import { AppAlert } from "./AppAlert";

/**
 * Variant C story: typed `argTypes`, every meaningful state, autodocs on. The
 * alert region carries its own title/description text for the accessible name.
 */
const meta = {
  title: "HeroUI/AppAlert",
  component: AppAlert,
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
      options: ["solid", "flat", "faded", "bordered"],
    },
    radius: {
      control: "inline-radio",
      options: ["none", "sm", "md", "lg", "full"],
    },
    isClosable: { control: "boolean" },
  },
  args: {
    title: "Heads up",
    description: "Your booking is being processed.",
  },
} satisfies Meta<typeof AppAlert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <AppAlert {...args} color="primary" title="Primary" />
      <AppAlert {...args} color="success" title="Success" />
      <AppAlert {...args} color="warning" title="Warning" />
      <AppAlert {...args} color="danger" title="Danger" />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <AppAlert {...args} color="warning" variant="solid" title="solid" />
      <AppAlert {...args} color="warning" variant="flat" title="flat" />
      <AppAlert {...args} color="warning" variant="faded" title="faded" />
      <AppAlert {...args} color="warning" variant="bordered" title="bordered" />
    </div>
  ),
};

/** Closable alert — HeroUI renders an accessible close button. */
export const Closable: Story = {
  args: {
    color: "success",
    title: "Saved",
    description: "Your changes have been saved.",
    isClosable: true,
  },
};
