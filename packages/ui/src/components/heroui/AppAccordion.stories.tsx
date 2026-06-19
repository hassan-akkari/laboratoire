import type { Meta, StoryObj } from "@storybook/react";
import { AppAccordion, AppAccordionItem } from "./AppAccordion";

/**
 * Variant C story: a realistic working accordion. Covers the named-slot form,
 * the `AppAccordion.Item` dot form, the dynamic `items` collection form, the
 * variants, multiple-selection, and a disabled item. Each item provides a
 * `title`, which HeroUI renders as a heading-wrapped trigger for accessibility.
 */
const meta = {
  title: "HeroUI/AppAccordion",
  component: AppAccordion,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["light", "shadow", "bordered", "splitted"],
    },
    selectionMode: {
      control: "inline-radio",
      options: ["none", "single", "multiple"],
    },
    isCompact: { control: "boolean" },
    showDivider: { control: "boolean" },
  },
  // `AppAccordion` requires `children`; every story below supplies its own items
  // via `render`, but Storybook's strict `StoryObj` still needs the required
  // prop satisfied at the `meta` level — this default fills that contract.
  args: {
    children: (
      <AppAccordionItem key="default" aria-label="Item" title="Item">
        Item body
      </AppAccordionItem>
    ),
  },
} satisfies Meta<typeof AppAccordion>;

export default meta;

type Story = StoryObj<typeof meta>;

interface Faq {
  key: string;
  title: string;
  body: string;
}

const faqs: Faq[] = [
  {
    key: "what",
    title: "What is included?",
    body: "Gear, a certified guide, and a warm breakfast at the summit.",
  },
  {
    key: "cancel",
    title: "Can I cancel?",
    body: "Free cancellation up to 48 hours before the experience starts.",
  },
  {
    key: "group",
    title: "Do you offer group rates?",
    body: "Yes — groups of 5+ get an automatic discount at checkout.",
  },
];

/** Static children using the named-slot import form. */
export const Static: Story = {
  render: (args) => (
    <AppAccordion {...args}>
      {faqs.map((faq) => (
        <AppAccordionItem
          key={faq.key}
          aria-label={faq.title}
          title={faq.title}
        >
          {faq.body}
        </AppAccordionItem>
      ))}
    </AppAccordion>
  ),
};

/** Same structure written with the `AppAccordion.Item` static member. */
export const DotNamespaceForm: Story = {
  render: (args) => (
    <AppAccordion {...args}>
      <AppAccordion.Item key="a" aria-label="First" title="First">
        Body of the first item (dot form).
      </AppAccordion.Item>
      <AppAccordion.Item key="b" aria-label="Second" title="Second">
        Body of the second item (dot form).
      </AppAccordion.Item>
    </AppAccordion>
  ),
};

/**
 * Data-driven collection — maps a typed `Faq[]` array into items.
 *
 * NOTE: HeroUI's `Accordion` uses React-Aria's `CollectionBase`, whose render
 * child must return a branded `CollectionElement` (the literal `Item`/`Section`
 * element), not the `ReactElement` an `App*` wrapper produces. So the
 * `items={...}` + `(item) => <AppAccordionItem/>` render-prop form does not
 * type-check through the wrapper. Mapping the typed array (the non-function
 * `children` branch) is the type-safe way to drive the accordion from data and
 * keeps the per-item type (`Faq`) intact.
 */
export const DataDriven: Story = {
  render: (args) => (
    <AppAccordion {...args}>
      {faqs.map((faq) => (
        <AppAccordionItem key={faq.key} aria-label={faq.title} title={faq.title}>
          {faq.body}
        </AppAccordionItem>
      ))}
    </AppAccordion>
  ),
};

/** Multiple-selection + a disabled item. */
export const MultipleWithDisabled: Story = {
  args: { selectionMode: "multiple", variant: "bordered" },
  render: (args) => (
    <AppAccordion {...args} disabledKeys={["group"]}>
      {faqs.map((faq) => (
        <AppAccordionItem
          key={faq.key}
          aria-label={faq.title}
          title={faq.title}
        >
          {faq.body}
        </AppAccordionItem>
      ))}
    </AppAccordion>
  ),
};
