import type { Meta, StoryObj } from "@storybook/react";
import { AppLink } from "./AppLink";

/**
 * v3 stories. The v2 style axes (`color` / `size` / `underline` / `isBlock`) are
 * gone as live props in v3 — those are now expressed with Tailwind utilities via
 * `className`. The remaining controls map to the real v3 surface: the icon
 * composition (`isExternal` / `showAnchorIcon` → `<Link.Icon />`) and the
 * v3-native `isDisabled`. The link text (children) is its accessible name;
 * `href` makes it a real anchor.
 */
const meta = {
  title: "HeroUI/AppLink",
  component: AppLink,
  tags: ["autodocs"],
  argTypes: {
    isExternal: { control: "boolean" },
    showAnchorIcon: { control: "boolean" },
    isDisabled: { control: "boolean" },
    className: { control: "text" },
  },
  args: {
    children: "Browse experiences",
    href: "#",
  },
} satisfies Meta<typeof AppLink>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Default: warm-accent link, underline appears on hover (v3 default). */
export const Default: Story = {};

/**
 * v3 colors come from Tailwind utilities, not a `color` prop. The wrapper
 * defaults to the warm accent; override with `text-*` / `decoration-*` classes.
 */
export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <AppLink {...args}>accent (default)</AppLink>
      <AppLink {...args} className="text-foreground decoration-foreground">
        foreground
      </AppLink>
      <AppLink {...args} className="text-muted decoration-muted">
        muted
      </AppLink>
    </div>
  ),
};

/**
 * v3 underlines on hover by default. Use Tailwind `underline` (always-on) or
 * `no-underline` (off), plus `decoration-*` / `underline-offset-*` to tune it.
 */
export const Underlines: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <AppLink {...args} className="no-underline">
        none
      </AppLink>
      <AppLink {...args}>hover (default)</AppLink>
      <AppLink {...args} className="underline underline-offset-4">
        always
      </AppLink>
    </div>
  ),
};

/**
 * External link with the trailing anchor icon. `isExternal` also applies safe
 * `target="_blank"` + `rel="noopener noreferrer"` defaults.
 */
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
