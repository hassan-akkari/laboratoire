import type { Meta, StoryObj } from "@storybook/react";
import { AppCard, AppCardHeader, AppCardBody, AppCardFooter } from "./AppCard";
import { AppButton } from "./AppButton";

/**
 * AppCard is v3-migrated. It keeps BOTH compound-usage forms (named slot
 * imports and the `AppCard.Body` dot form) over the v3 compound primitives
 * (`Card.Header` / `Card.Content` / `Card.Footer`). The v2 props
 * (shadow/radius/isPressable/...) are gone in v3; prominence is now the
 * semantic `variant` axis, and spacing/elevation are Tailwind classNames.
 */
const meta = {
  title: "HeroUI/AppCard",
  component: AppCard,
  tags: ["autodocs"],
  // `children` is required on AppCardProps; each story overrides via `render`,
  // but a meta-level default keeps the StoryObj args contract satisfied.
  args: {
    children: null,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["transparent", "default", "secondary", "tertiary"],
    },
  },
} satisfies Meta<typeof AppCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Full card using the named-slot import form. */
export const Full: Story = {
  render: (args) => (
    <AppCard {...args} className="max-w-[360px]">
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
    <AppCard {...args} className="max-w-[360px]">
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
    <AppCard {...args} className="max-w-[360px]">
      <AppCardBody>
        <p style={{ margin: 0 }}>Just a body, no header or footer.</p>
      </AppCardBody>
    </AppCard>
  ),
};

/** The four v3 semantic prominence variants. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {(["transparent", "default", "secondary", "tertiary"] as const).map(
        (variant) => (
          <AppCard key={variant} variant={variant} className="w-[160px]">
            <AppCardBody>
              <p style={{ margin: 0 }}>variant={variant}</p>
            </AppCardBody>
          </AppCard>
        ),
      )}
    </div>
  ),
};
