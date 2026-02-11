import type { Meta, StoryObj } from "@storybook/react";
import { AppButton } from "./AppButton";

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

export const Secondary: Story = {
  args: {
    color: "secondary",
  },
};
