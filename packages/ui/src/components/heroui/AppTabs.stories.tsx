import type { Meta, StoryObj } from "@storybook/react";
import { AppTabs, AppTab } from "./AppTabs";
import { AppCard, AppCardBody } from "./AppCard";

/**
 * Variant C story: a realistic working tabset. Covers the named-slot form, the
 * `AppTabs.Tab` dot form, the dynamic `items` collection form, the variants, and
 * a disabled tab. Every tablist sets `aria-label` so addon-a11y is clean (HeroUI
 * renders a `role="tablist"` that needs an accessible name).
 */
const meta = {
  title: "HeroUI/AppTabs",
  component: AppTabs,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["solid", "underlined", "bordered", "light"],
    },
    radius: { control: "inline-radio", options: ["none", "sm", "md", "lg"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    color: {
      control: "inline-radio",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
    },
    isVertical: { control: "boolean" },
  },
  args: {
    "aria-label": "Booking details",
  },
} satisfies Meta<typeof AppTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Static children using the named-slot import form. */
export const Static: Story = {
  render: (args) => (
    <AppTabs {...args}>
      <AppTab key="overview" title="Overview">
        <AppCard>
          <AppCardBody>A guided dawn ascent with a small group.</AppCardBody>
        </AppCard>
      </AppTab>
      <AppTab key="pricing" title="Pricing">
        <AppCard>
          <AppCardBody>Per-person from €120. Group discounts apply.</AppCardBody>
        </AppCard>
      </AppTab>
      <AppTab key="reviews" title="Reviews">
        <AppCard>
          <AppCardBody>4.9 / 5 from 212 guests.</AppCardBody>
        </AppCard>
      </AppTab>
    </AppTabs>
  ),
};

/** Same structure written with the `AppTabs.Tab` static member. */
export const DotNamespaceForm: Story = {
  render: (args) => (
    <AppTabs {...args}>
      <AppTabs.Tab key="overview" title="Overview">
        <p style={{ margin: 0 }}>Overview panel (dot form).</p>
      </AppTabs.Tab>
      <AppTabs.Tab key="pricing" title="Pricing">
        <p style={{ margin: 0 }}>Pricing panel (dot form).</p>
      </AppTabs.Tab>
    </AppTabs>
  ),
};

interface TabItem {
  id: string;
  label: string;
  body: string;
}

const TAB_ITEMS: TabItem[] = [
  { id: "overview", label: "Overview", body: "Dynamic overview." },
  { id: "pricing", label: "Pricing", body: "Dynamic pricing." },
  { id: "reviews", label: "Reviews", body: "Dynamic reviews." },
];

/**
 * Dynamic collection — drives tabs from an `items` array + render child.
 *
 * Spreading `{...args}` pins `AppTabs`'s generic to its `object` default (the
 * meta resolves `AppTabs` with no type arg), so the render param arrives as
 * `object`. We narrow it once via a typed alias — the array itself stays fully
 * typed (`TabItem[]`), keeping the example meaningful and `any`-free.
 */
export const DynamicItems: Story = {
  render: (args) => (
    <AppTabs {...args} items={TAB_ITEMS}>
      {(item) => {
        const tab = item as TabItem;
        return (
          <AppTab key={tab.id} title={tab.label}>
            <p style={{ margin: 0 }}>{tab.body}</p>
          </AppTab>
        );
      }}
    </AppTabs>
  ),
};

/** A disabled tab via `disabledKeys` on the tablist. */
export const WithDisabledTab: Story = {
  args: { disabledKeys: ["reviews"] },
  render: (args) => (
    <AppTabs {...args}>
      <AppTab key="overview" title="Overview">
        <p style={{ margin: 0 }}>Overview panel.</p>
      </AppTab>
      <AppTab key="pricing" title="Pricing">
        <p style={{ margin: 0 }}>Pricing panel.</p>
      </AppTab>
      <AppTab key="reviews" title="Reviews (disabled)">
        <p style={{ margin: 0 }}>You should not be able to reach this.</p>
      </AppTab>
    </AppTabs>
  ),
};
