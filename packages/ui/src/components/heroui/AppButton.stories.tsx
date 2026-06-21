import type { Meta, StoryObj } from "@storybook/react";
import { AppButton } from "./AppButton";

/**
 * AppButton is the first v3-migrated wrapper. The public prop surface is
 * unchanged (v2-era props still accepted and mapped internally), so these
 * stories drive the SAME props the docs call sites use.
 */
const meta: Meta<typeof AppButton> = {
  title: "HeroUI/AppButton",
  component: AppButton,
  args: {
    children: "Press me",
  },
};

export default meta;

type Story = StoryObj<typeof AppButton>;

export const Primary: Story = {};

/** v2 `variant="bordered"` maps to the v3 `secondary` variant. */
export const Bordered: Story = {
  args: {
    variant: "bordered",
  },
};

/** v2 `variant="flat"` maps to the v3 `tertiary` variant. */
export const Flat: Story = {
  args: {
    variant: "flat",
  },
};

/** `as="a"` renders a styled anchor (docs uses this for CTAs/links). */
export const AsAnchor: Story = {
  args: {
    as: "a",
    href: "https://example.com",
    target: "_blank",
    rel: "noreferrer",
    children: "Open link",
  },
};

/** v2 `isLoading` maps to the v3 `isPending` render-prop spinner. */
export const Loading: Story = {
  args: {
    isLoading: true,
    children: "Submitting…",
  },
};
