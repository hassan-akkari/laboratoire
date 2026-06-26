import type { Meta, StoryObj } from "@storybook/react";
import { AppSwitch } from "./AppSwitch";

/**
 * v3 story surface. The v2 `color` axis is GONE (selected-track color is
 * theme-driven via the warm `--accent`/`--primary` alias), so the old `Colors`
 * story is replaced by a `WithThumbIcon` story exercising the v3 `Switch.Icon`
 * slot. Remaining axes (`size`, `isSelected`, `defaultSelected`, `isDisabled`)
 * map 1:1 onto the v3 compound tree the wrapper builds.
 */
const meta = {
  title: "HeroUI/AppSwitch",
  component: AppSwitch,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    isSelected: { control: "boolean" },
    defaultSelected: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    children: "Enable notifications",
  },
} satisfies Meta<typeof AppSwitch>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Off by default. */
export const Default: Story = {};

/** On (uncontrolled, starts selected). */
export const On: Story = {
  args: { defaultSelected: true, children: "Dark mode" },
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

/**
 * Thumb icon: v2's `thumbIcon`/`startContent`/`endContent` collapse to a single
 * slot rendered as `<Switch.Icon>` inside `<Switch.Thumb>`.
 */
export const WithThumbIcon: Story = {
  args: {
    defaultSelected: true,
    children: "Power",
    size: "lg",
    thumbIcon: (
      <svg
        viewBox="0 0 16 16"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M3.5 8.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};
