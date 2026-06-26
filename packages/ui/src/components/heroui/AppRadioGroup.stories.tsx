import type { Meta, StoryObj } from "@storybook/react";
import { AppRadioGroup, AppRadio } from "./AppRadioGroup";

/**
 * v3 stories. Exercises the v3 prop surface only — the v2 `color`/`size`/`radius`
 * axes are GONE (selected color is the warm `--primary` theme alias; sizing is
 * Tailwind). Shows BOTH compound forms (named `AppRadio` and the
 * `AppRadioGroup.Radio` dot member), vertical + horizontal layouts, per-radio
 * descriptions, and the disabled state. The group's `label` provides the
 * accessible name; each radio's children label the option.
 */
const meta = {
  title: "HeroUI/AppRadioGroup",
  component: AppRadioGroup,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary"] },
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal"],
    },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    isInvalid: { control: "boolean" },
  },
  args: {
    label: "Pricing model",
    defaultValue: "per-person",
  },
} satisfies Meta<typeof AppRadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Default vertical group using the named-import `AppRadio` form. */
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

/** Horizontal layout with per-radio descriptions. */
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

/** Group-level helper text via the `description` prop, plus per-radio descriptions. */
export const WithGroupDescription: Story = {
  args: {
    label: "Pricing model",
    description: "How guests are charged for this experience.",
  },
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
