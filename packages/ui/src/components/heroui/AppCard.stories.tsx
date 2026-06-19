import type { Meta, StoryObj } from "@storybook/react";
import { AppCard, AppCardHeader, AppCardBody, AppCardFooter } from "./AppCard";
import { AppButton } from "./AppButton";

/**
 * Variant C story: shows BOTH compound-usage forms (named slot imports and the
 * `AppCard.Body` dot form), exercises edge states, autodocs on. The card has no
 * intrinsic role, so a11y comes from the content within (headings, buttons).
 */
const meta = {
  title: "HeroUI/AppCard",
  component: AppCard,
  tags: ["autodocs"],
  argTypes: {
    shadow: {
      control: "inline-radio",
      options: ["none", "sm", "md", "lg"],
    },
    radius: {
      control: "inline-radio",
      options: ["none", "sm", "md", "lg"],
    },
    isBlurred: { control: "boolean" },
    isHoverable: { control: "boolean" },
    isPressable: { control: "boolean" },
  },
} satisfies Meta<typeof AppCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Full card using the named-slot import form. */
export const Full: Story = {
  render: (args) => (
    <AppCard {...args} style={{ maxWidth: 360 }}>
      <AppCardHeader>
        <h3 style={{ margin: 0, fontWeight: 600 }}>Mountain Sunrise Hike</h3>
      </AppCardHeader>
      <AppCardBody>
        <p style={{ margin: 0 }}>
          A guided dawn ascent with a small group. Includes gear and a warm
          breakfast at the summit.
        </p>
      </AppCardBody>
      <AppCardFooter style={{ justifyContent: "flex-end" }}>
        <AppButton size="sm">Book now</AppButton>
      </AppCardFooter>
    </AppCard>
  ),
};

/** Same structure via the dot-namespaced static members. */
export const DotNamespaceForm: Story = {
  render: (args) => (
    <AppCard {...args} style={{ maxWidth: 360 }}>
      <AppCard.Header>
        <h3 style={{ margin: 0, fontWeight: 600 }}>Dot form</h3>
      </AppCard.Header>
      <AppCard.Body>
        <p style={{ margin: 0 }}>
          Identical to <code>Full</code>, written with{" "}
          <code>AppCard.Body</code> etc.
        </p>
      </AppCard.Body>
      <AppCard.Footer style={{ justifyContent: "flex-end" }}>
        <AppButton size="sm" variant="bordered">
          Details
        </AppButton>
      </AppCard.Footer>
    </AppCard>
  ),
};

/** Body-only card — the minimal composition. */
export const BodyOnly: Story = {
  render: (args) => (
    <AppCard {...args} style={{ maxWidth: 360 }}>
      <AppCardBody>
        <p style={{ margin: 0 }}>Just a body, no header or footer.</p>
      </AppCardBody>
    </AppCard>
  ),
};

/**
 * Pressable card — when `isPressable` is set HeroUI exposes the card as a
 * button-like element with the correct role; keep an accessible label via the
 * visible heading text.
 */
export const Pressable: Story = {
  args: { isPressable: true, isHoverable: true },
  render: (args) => (
    <AppCard {...args} style={{ maxWidth: 360 }}>
      <AppCardBody>
        <p style={{ margin: 0 }}>Press me — I act as a single control.</p>
      </AppCardBody>
    </AppCard>
  ),
};

export const ShadowScale: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {(["none", "sm", "md", "lg"] as const).map((shadow) => (
        <AppCard key={shadow} shadow={shadow} style={{ width: 140 }}>
          <AppCardBody>
            <p style={{ margin: 0 }}>shadow={shadow}</p>
          </AppCardBody>
        </AppCard>
      ))}
    </div>
  ),
};
