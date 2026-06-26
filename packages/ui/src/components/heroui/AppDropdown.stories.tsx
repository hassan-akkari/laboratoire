import type { Meta, StoryObj } from "@storybook/react";
import {
  AppDropdown,
  AppDropdownTrigger,
  AppDropdownMenu,
  AppDropdownItem,
  AppDropdownSection,
} from "./AppDropdown";
import { AppButton } from "./AppButton";

/**
 * Variant C story: a realistic working dropdown. Covers the named-slot form, the
 * `AppDropdown.*` dot form, sectioned menus, single-selection state, and
 * disabled items. The menu always carries an `aria-label` so addon-a11y is clean
 * (HeroUI renders a `role="menu"` that needs an accessible name).
 */
const meta = {
  title: "HeroUI/AppDropdown",
  component: AppDropdown,
  tags: ["autodocs"],
  argTypes: {
    radius: { control: "inline-radio", options: ["none", "sm", "md", "lg"] },
    backdrop: {
      control: "inline-radio",
      options: ["transparent", "opaque", "blur"],
    },
    placement: { control: "text" },
  },
  // `AppDropdown` requires `children` (a trigger + menu pair, typed
  // `ReactNode[]`); every story below supplies its own subtree via `render`, but
  // Storybook's strict `StoryObj` still needs the required prop satisfied at the
  // `meta` level — this default fills that contract.
  args: {
    children: [
      <AppDropdownTrigger key="trigger">
        <AppButton>Open</AppButton>
      </AppDropdownTrigger>,
      <AppDropdownMenu key="menu" aria-label="Actions">
        <AppDropdownItem key="item">Item</AppDropdownItem>
      </AppDropdownMenu>,
    ],
  },
} satisfies Meta<typeof AppDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Basic menu using the named-slot import form. */
export const Basic: Story = {
  render: (args) => (
    <AppDropdown {...args}>
      <AppDropdownTrigger>
        <AppButton variant="bordered">Actions</AppButton>
      </AppDropdownTrigger>
      <AppDropdownMenu aria-label="Booking actions">
        <AppDropdownItem key="view">View booking</AppDropdownItem>
        <AppDropdownItem key="edit">Edit guests</AppDropdownItem>
        <AppDropdownItem key="copy">Copy quote link</AppDropdownItem>
        <AppDropdownItem
          key="cancel"
          className="text-danger"
          color="danger"
        >
          Cancel booking
        </AppDropdownItem>
      </AppDropdownMenu>
    </AppDropdown>
  ),
};

/** Same structure written with the dot-namespaced static members. */
export const DotNamespaceForm: Story = {
  render: (args) => (
    <AppDropdown {...args}>
      <AppDropdown.Trigger>
        <AppButton>Menu (dot form)</AppButton>
      </AppDropdown.Trigger>
      <AppDropdown.Menu aria-label="Booking actions (dot form)">
        <AppDropdown.Item key="view">View booking</AppDropdown.Item>
        <AppDropdown.Item key="edit">Edit guests</AppDropdown.Item>
        <AppDropdown.Item key="copy">Copy quote link</AppDropdown.Item>
      </AppDropdown.Menu>
    </AppDropdown>
  ),
};

/** Sectioned menu — groups items under labelled `AppDropdownSection`s. */
export const WithSections: Story = {
  render: (args) => (
    <AppDropdown {...args}>
      <AppDropdownTrigger>
        <AppButton variant="flat">Manage</AppButton>
      </AppDropdownTrigger>
      <AppDropdownMenu aria-label="Booking management" variant="flat">
        <AppDropdownSection title="Booking">
          <AppDropdownItem key="view">View</AppDropdownItem>
          <AppDropdownItem key="reschedule">Reschedule</AppDropdownItem>
        </AppDropdownSection>
        <AppDropdownSection title="Danger zone">
          <AppDropdownItem key="cancel" color="danger" className="text-danger">
            Cancel booking
          </AppDropdownItem>
        </AppDropdownSection>
      </AppDropdownMenu>
    </AppDropdown>
  ),
};

/**
 * Single-selection menu with a disabled item — exercises `selectionMode`,
 * `selectedKeys`, and `disabledKeys` on the menu.
 */
export const SingleSelection: Story = {
  render: (args) => (
    <AppDropdown {...args}>
      <AppDropdownTrigger>
        <AppButton variant="bordered">Sort by</AppButton>
      </AppDropdownTrigger>
      <AppDropdownMenu
        aria-label="Sort bookings"
        variant="flat"
        selectionMode="single"
        defaultSelectedKeys={["date"]}
        disabledKeys={["archived"]}
      >
        <AppDropdownItem key="date">Date</AppDropdownItem>
        <AppDropdownItem key="guests">Guests</AppDropdownItem>
        <AppDropdownItem key="price">Price</AppDropdownItem>
        <AppDropdownItem key="archived">Archived (disabled)</AppDropdownItem>
      </AppDropdownMenu>
    </AppDropdown>
  ),
};
