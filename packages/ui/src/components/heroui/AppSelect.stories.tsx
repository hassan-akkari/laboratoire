import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { Selection } from "@heroui/react";
import { AppSelect, AppSelectItem } from "./AppSelect";

/**
 * Variant C story: every state — default (uncontrolled), controlled, multiple,
 * disabled, invalid, and the empty-collection edge. Each story carries an
 * accessible name (visible `label` or `aria-label`) so addon-a11y stays clean.
 */
const meta = {
  title: "HeroUI/AppSelect",
  component: AppSelect,
  tags: ["autodocs"],
  argTypes: {
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
    variant: {
      control: "select",
      options: ["flat", "bordered", "faded", "underlined"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    labelPlacement: {
      control: "inline-radio",
      options: ["inside", "outside", "outside-left"],
    },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
  args: {
    label: "Experience",
    placeholder: "Pick an experience",
    // `AppSelect` requires `children`; each story supplies its own collection via
    // `render`, but Storybook's strict `StoryObj` needs the required prop
    // satisfied at the `meta` level — this default item fills that contract.
    children: <AppSelectItem key="placeholder">Placeholder</AppSelectItem>,
  },
} satisfies Meta<typeof AppSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

const EXPERIENCES = [
  { key: "hike", label: "Sunrise hike" },
  { key: "dive", label: "Reef dive" },
  { key: "cook", label: "Pasta workshop" },
  { key: "wine", label: "Vineyard tour" },
];

/** Uncontrolled, single selection. */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 280 }}>
      <AppSelect {...args}>
        {EXPERIENCES.map((e) => (
          <AppSelectItem key={e.key}>{e.label}</AppSelectItem>
        ))}
      </AppSelect>
    </div>
  ),
};

/** Controlled selection — demonstrates `selectedKeys` inference is preserved. */
export const Controlled: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<Selection>(new Set(["dive"]));
    return (
      <div style={{ maxWidth: 280 }}>
        <AppSelect
          {...args}
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          {EXPERIENCES.map((e) => (
            <AppSelectItem key={e.key}>{e.label}</AppSelectItem>
          ))}
        </AppSelect>
      </div>
    );
  },
};

/** Multiple selection. */
export const Multiple: Story = {
  args: { selectionMode: "multiple", label: "Add-ons" },
  render: (args) => (
    <div style={{ maxWidth: 280 }}>
      <AppSelect {...args}>
        {EXPERIENCES.map((e) => (
          <AppSelectItem key={e.key}>{e.label}</AppSelectItem>
        ))}
      </AppSelect>
    </div>
  ),
};

/** Label hidden — accessible name supplied via `aria-label`. */
export const AriaLabelOnly: Story = {
  args: { label: undefined, "aria-label": "Experience", placeholder: "Select" },
  render: (args) => (
    <div style={{ maxWidth: 280 }}>
      <AppSelect {...args}>
        {EXPERIENCES.map((e) => (
          <AppSelectItem key={e.key}>{e.label}</AppSelectItem>
        ))}
      </AppSelect>
    </div>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true },
  render: (args) => (
    <div style={{ maxWidth: 280 }}>
      <AppSelect {...args}>
        {EXPERIENCES.map((e) => (
          <AppSelectItem key={e.key}>{e.label}</AppSelectItem>
        ))}
      </AppSelect>
    </div>
  ),
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    errorMessage: "Please choose an experience",
    isRequired: true,
  },
  render: (args) => (
    <div style={{ maxWidth: 280 }}>
      <AppSelect {...args}>
        {EXPERIENCES.map((e) => (
          <AppSelectItem key={e.key}>{e.label}</AppSelectItem>
        ))}
      </AppSelect>
    </div>
  ),
};

/** Empty collection edge — uses the dynamic `items` API with no rows. */
export const Empty: Story = {
  args: { items: [], label: "Sold out" },
  render: (args) => (
    <div style={{ maxWidth: 280 }}>
      <AppSelect {...args}>
        {() => <AppSelectItem>unused</AppSelectItem>}
      </AppSelect>
    </div>
  ),
};
