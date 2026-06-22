import type { Meta, StoryObj } from "@storybook/react";
import { AppSpinner } from "./AppSpinner";

/**
 * v3 story surface. v3 Spinner exposes only `size` + `color` (+ `className`):
 *   - `color` is the v3 vocab (`current | accent | success | warning | danger`);
 *     the wrapper also accepts the v2 vocab and maps it (e.g. `primary -> accent`).
 *   - `size` now includes `xl`.
 *   - `variant` is GONE in v3 (dropped from argTypes).
 *   - `label` has no visible slot in v3; the wrapper folds it into `aria-label`
 *     so the status stays screen-reader announced and addon-a11y stays clean.
 */
const meta = {
  title: "HeroUI/AppSpinner",
  component: AppSpinner,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["current", "accent", "success", "warning", "danger"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    label: { control: "text" },
  },
  args: {
    label: "Loading quote…",
  },
} satisfies Meta<typeof AppSpinner>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Default warm accent spinner (wrapper defaults `color` to `accent`). */
export const Default: Story = {};

/** Every v3 color, including the warm `accent` default. */
export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <AppSpinner {...args} color="accent" />
      <AppSpinner {...args} color="current" />
      <AppSpinner {...args} color="success" />
      <AppSpinner {...args} color="warning" />
      <AppSpinner {...args} color="danger" />
    </div>
  ),
};

/** All four v3 sizes (v3 adds `xl`). */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <AppSpinner {...args} size="sm" label="sm" />
      <AppSpinner {...args} size="md" label="md" />
      <AppSpinner {...args} size="lg" label="lg" />
      <AppSpinner {...args} size="xl" label="xl" />
    </div>
  ),
};

/**
 * v2 vocabulary still typechecks: the wrapper maps `color="primary"` to v3
 * `accent`, keeping the old call sites working during coexistence.
 */
export const LegacyV2Color: Story = {
  args: { color: "primary" },
};

/**
 * No label text — pass an explicit `aria-label`. The wrapper prefers an explicit
 * `aria-label` over the folded `label`, so the status is still announced.
 */
export const NoLabel: Story = {
  args: { label: undefined, "aria-label": "Loading" },
};
