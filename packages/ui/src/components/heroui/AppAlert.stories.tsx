import type { Meta, StoryObj } from "@storybook/react";
import { AppAlert } from "./AppAlert";

/**
 * v3 story surface: the v3 Alert exposes a single `status` style axis (the v2
 * `variant`/`radius`/`isClosable` props are gone). `color` is still accepted by
 * the anti-corruption wrapper and folded onto `status` (primary->accent,
 * secondary->default), so we keep a control for it to document the legacy alias.
 * Each story carries a title + description for an accessible name.
 */
const meta = {
  title: "HeroUI/AppAlert",
  component: AppAlert,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["default", "accent", "success", "warning", "danger"],
    },
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
    hideIcon: { control: "boolean" },
  },
  args: {
    title: "Heads up",
    description: "Your booking is being processed.",
  },
} satisfies Meta<typeof AppAlert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every v3 status, each with a title + description. */
export const Statuses: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <AppAlert
        {...args}
        status="default"
        title="Default"
        description="General information for the reader."
      />
      <AppAlert
        {...args}
        status="accent"
        title="Accent"
        description="Important information rendered with the warm --accent token."
      />
      <AppAlert
        {...args}
        status="success"
        title="Success"
        description="Your changes have been saved."
      />
      <AppAlert
        {...args}
        status="warning"
        title="Warning"
        description="Scheduled maintenance is coming up."
      />
      <AppAlert
        {...args}
        status="danger"
        title="Danger"
        description="We could not connect to the server."
      />
    </div>
  ),
};

/** The legacy v2 `color` prop still works — folded onto `status` by the wrapper. */
export const LegacyColorAlias: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <AppAlert
        {...args}
        color="primary"
        title="color=primary"
        description="Mapped to status=accent."
      />
      <AppAlert
        {...args}
        color="secondary"
        title="color=secondary"
        description="Mapped to status=default."
      />
      <AppAlert
        {...args}
        color="danger"
        title="color=danger"
        description="Passed through to status=danger."
      />
    </div>
  ),
};

/** Indicator omitted via `hideIcon` (v3 has no hideIcon prop — done structurally). */
export const NoIndicator: Story = {
  args: {
    status: "success",
    title: "Profile updated",
    description: "Your changes have been saved.",
    hideIcon: true,
  },
};
