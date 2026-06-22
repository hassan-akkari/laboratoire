import type { Meta, StoryObj } from "@storybook/react";
import { AppAvatar, AppAvatarGroup } from "./AppAvatar";

/**
 * Variant C story, updated to the v3 prop surface.
 *
 * v3 deltas reflected here: `color` enum is now default | accent | success |
 * warning | danger (`accent` replaces v2 `primary`); `size` is sm | md | lg;
 * `variant` is default | soft. The v2-only `radius` / `isBordered` /
 * `isDisabled` controls are GONE. The accessible name comes from `name`
 * (used as the image `alt` and the initials fallback) or from an explicit
 * `Avatar.Image alt` in children.
 */
const meta = {
  title: "HeroUI/AppAvatar",
  component: AppAvatar,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "accent", "success", "warning", "danger"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    variant: { control: "inline-radio", options: ["default", "soft"] },
  },
  args: {
    name: "Ada Lovelace",
  },
} satisfies Meta<typeof AppAvatar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Initials fallback (no src) — the `name` drives the initials and alt text. */
export const Default: Story = {};

/**
 * Standalone avatar with a real image plus an initials fallback: the
 * convenience `src` + `name` props synthesize `<Avatar.Image>` +
 * `<Avatar.Fallback>` internally.
 */
export const WithImage: Story = {
  args: {
    name: "John Doe",
    src: "https://img.heroui.chat/image/avatar?w=400&h=400&u=3",
  },
};

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
      <AppAvatar {...args} color="default" />
      <AppAvatar {...args} color="accent" />
      <AppAvatar {...args} color="success" />
      <AppAvatar {...args} color="warning" />
      <AppAvatar {...args} color="danger" />
    </div>
  ),
};

/** Soft visual variant across the color enum. */
export const SoftVariant: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <AppAvatar {...args} variant="soft" color="accent" />
      <AppAvatar {...args} variant="soft" color="success" />
      <AppAvatar {...args} variant="soft" color="warning" />
      <AppAvatar {...args} variant="soft" color="danger" />
    </div>
  ),
};

/**
 * Group via the named export — stacks avatars (hand-built `-space-x-2` + ring)
 * and shows a `+N` counter past `max`.
 */
export const Group: Story = {
  render: () => (
    <AppAvatarGroup max={3}>
      <AppAvatar
        name="John Doe"
        src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
      />
      <AppAvatar
        name="Kate Wilson"
        src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg"
      />
      <AppAvatar
        name="Emily Chen"
        src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"
      />
      <AppAvatar name="Michael Brown" />
      <AppAvatar name="Olivia Davis" />
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
