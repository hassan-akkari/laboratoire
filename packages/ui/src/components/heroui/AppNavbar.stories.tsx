import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  AppNavbar,
  AppNavbarBrand,
  AppNavbarContent,
  AppNavbarItem,
  AppNavbarMenuToggle,
  AppNavbarMenu,
  AppNavbarMenuItem,
} from "./AppNavbar";
import { AppLink } from "./AppLink";
import { AppButton } from "./AppButton";

/**
 * Variant C story: a realistic responsive navbar. Covers the named-slot form,
 * the `AppNavbar.*` dot form, justified content groups, and the controlled
 * mobile menu (toggle + collapsing `AppNavbarMenu`). The toggle always carries
 * an `aria-label` so the icon-only control has an accessible name.
 */
const meta = {
  title: "HeroUI/AppNavbar",
  component: AppNavbar,
  tags: ["autodocs"],
  argTypes: {
    maxWidth: {
      control: "inline-radio",
      options: ["sm", "md", "lg", "xl", "2xl", "full"],
    },
    position: { control: "inline-radio", options: ["static", "sticky"] },
    isBordered: { control: "boolean" },
    isBlurred: { control: "boolean" },
  },
} satisfies Meta<typeof AppNavbar>;

export default meta;

type Story = StoryObj<typeof meta>;

const links = [
  { key: "experiences", label: "Experiences", href: "#experiences" },
  { key: "pricing", label: "Pricing", href: "#pricing" },
  { key: "about", label: "About", href: "#about" },
];

/** Full navbar with brand, centred links, an action, and a working mobile menu. */
export const Full: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- interactive Storybook render (matches AppModal.stories convention)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
      <AppNavbar
        {...args}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <AppNavbarContent>
          <AppNavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <AppNavbarBrand>
            <span style={{ fontWeight: 700 }}>Laboratoire</span>
          </AppNavbarBrand>
        </AppNavbarContent>

        <AppNavbarContent className="hidden sm:flex" justify="center">
          {links.map((link) => (
            <AppNavbarItem key={link.key}>
              <AppLink color="foreground" href={link.href}>
                {link.label}
              </AppLink>
            </AppNavbarItem>
          ))}
        </AppNavbarContent>

        <AppNavbarContent justify="end">
          <AppNavbarItem>
            <AppButton color="primary" variant="flat">
              Book now
            </AppButton>
          </AppNavbarItem>
        </AppNavbarContent>

        <AppNavbarMenu>
          {links.map((link) => (
            <AppNavbarMenuItem key={link.key}>
              <AppLink color="foreground" href={link.href} size="lg">
                {link.label}
              </AppLink>
            </AppNavbarMenuItem>
          ))}
        </AppNavbarMenu>
      </AppNavbar>
    );
  },
};

/** Same brand + content groups written with the dot-namespaced static members. */
export const DotNamespaceForm: Story = {
  render: (args) => (
    <AppNavbar {...args}>
      <AppNavbar.Brand>
        <span style={{ fontWeight: 700 }}>Laboratoire</span>
      </AppNavbar.Brand>
      <AppNavbar.Content justify="end">
        <AppNavbar.Item>
          <AppLink color="foreground" href="#experiences">
            Experiences
          </AppLink>
        </AppNavbar.Item>
        <AppNavbar.Item>
          <AppButton color="primary" size="sm">
            Book now
          </AppButton>
        </AppNavbar.Item>
      </AppNavbar.Content>
    </AppNavbar>
  ),
};
