import type { Meta, StoryObj } from "@storybook/react";
import { AppRadioGroup, AppRadio } from "./AppRadioGroup";

/**
 * Variant C story: shows BOTH compound-usage forms (the named `AppRadio` import
 * and the `AppRadioGroup.Radio` dot form), exercises edge states, autodocs on.
 * The group's `label` provides the accessible name; each radio's children label
 * the option.
 */
const meta = {
  title: "HeroUI/AppRadioGroup",
  component: AppRadioGroup,
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
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal"],
    },
    isDisabled: { control: "boolean" },
  },
  args: {
    label: "Pricing model",
    defaultValue: "per-person",
  },
} satisfies Meta<typeof AppRadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Default group using the named-import `AppRadio` form. */
export const Default: Story = {
  render: (args) => (
    <AppRadioGroup {...args}>
      <AppRadio value="per-person">Per person</AppRadio>
      <AppRadio value="minimum_group">Minimum group</AppRadio>
    </AppRadioGroup>
  ),
};

/** Same options written with the `AppRadioGroup.Radio` dot-namespaced member. */
export const DotNamespaceForm: Story = {
  render: (args) => (
    <AppRadioGroup {...args}>
      <AppRadioGroup.Radio value="per-person">Per person</AppRadioGroup.Radio>
      <AppRadioGroup.Radio value="minimum_group">
        Minimum group
      </AppRadioGroup.Radio>
    </AppRadioGroup>
  ),
};

/** Horizontal layout with radios that carry descriptions. */
export const HorizontalWithDescriptions: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <AppRadioGroup {...args}>
      <AppRadio value="per-person" description="Charged for each guest">
        Per person
      </AppRadio>
      <AppRadio value="minimum_group" description="Flat floor for small groups">
        Minimum group
      </AppRadio>
    </AppRadioGroup>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true },
  render: (args) => (
    <AppRadioGroup {...args}>
      <AppRadio value="per-person">Per person</AppRadio>
      <AppRadio value="minimum_group">Minimum group</AppRadio>
    </AppRadioGroup>
  ),
};
