import type { Meta, StoryObj } from "@storybook/react";
import { AppLink } from "./AppLink";

/**
 * Variant C story: typed `argTypes`, every meaningful state, autodocs on. The
 * link text (children) is its accessible name; `href` makes it a real anchor.
 */
const meta = {
  title: "HeroUI/AppLink",
  component: AppLink,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: [
        "foreground",
        "primary",
        "secondary",
        "success",
        "warning",
        "danger",
      ],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    underline: {
      control: "select",
      options: ["none", "hover", "always", "active", "focus"],
    },
    isBlock: { control: "boolean" },
    isExternal: { control: "boolean" },
    showAnchorIcon: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    children: "Browse experiences",
    href: "#",
  },
} satisfies Meta<typeof AppLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <AppLink {...args} color="foreground">
        foreground
      </AppLink>
      <AppLink {...args} color="primary">
        primary
      </AppLink>
      <AppLink {...args} color="secondary">
        secondary
      </AppLink>
      <AppLink {...args} color="success">
        success
      </AppLink>
      <AppLink {...args} color="warning">
        warning
      </AppLink>
      <AppLink {...args} color="danger">
        danger
      </AppLink>
    </div>
  ),
};

export const Underlines: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <AppLink {...args} underline="none">
        none
      </AppLink>
      <AppLink {...args} underline="hover">
        hover
      </AppLink>
      <AppLink {...args} underline="always">
        always
      </AppLink>
    </div>
  ),
};

/** External link with the anchor icon — opens in a new tab with rel safety. */
export const External: Story = {
  args: {
    children: "Open docs",
    href: "https://example.com",
    isExternal: true,
    showAnchorIcon: true,
  },
};

export const Disabled: Story = {
  args: { isDisabled: true, children: "Unavailable" },
};
