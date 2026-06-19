import type { Meta, StoryObj } from "@storybook/react";
import { AppAvatar, AppAvatarGroup } from "./AppAvatar";

/**
 * Variant C story: typed `argTypes`, every meaningful state, autodocs on. An
 * avatar's accessible name comes from `name` (used as the img `alt` / initials).
 */
const meta = {
  title: "HeroUI/AppAvatar",
  component: AppAvatar,
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
    isBordered: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    name: "Ada Lovelace",
  },
} satisfies Meta<typeof AppAvatar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Initials fallback (no src) — the `name` drives the initials and alt text. */
export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <AppAvatar {...args} size="sm" />
      <AppAvatar {...args} size="md" />
      <AppAvatar {...args} size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <AppAvatar {...args} isBordered color="default" />
      <AppAvatar {...args} isBordered color="primary" />
      <AppAvatar {...args} isBordered color="secondary" />
      <AppAvatar {...args} isBordered color="success" />
      <AppAvatar {...args} isBordered color="warning" />
      <AppAvatar {...args} isBordered color="danger" />
    </div>
  ),
};

/**
 * Group via the named export — stacks avatars and shows a `+N` count past `max`.
 */
export const Group: Story = {
  render: () => (
    <AppAvatarGroup max={3} total={10}>
      <AppAvatar name="Ada Lovelace" />
      <AppAvatar name="Grace Hopper" />
      <AppAvatar name="Alan Turing" />
      <AppAvatar name="Katherine Johnson" />
    </AppAvatarGroup>
  ),
};

/** Same group via the dot-namespaced static member `AppAvatar.Group`. */
export const GroupDotForm: Story = {
  render: () => (
    <AppAvatar.Group max={2}>
      <AppAvatar name="Ada Lovelace" />
      <AppAvatar name="Grace Hopper" />
      <AppAvatar name="Alan Turing" />
    </AppAvatar.Group>
  ),
};
