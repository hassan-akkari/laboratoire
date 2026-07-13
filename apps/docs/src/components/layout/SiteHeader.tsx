"use client";

import { useState } from "react";
import { FaArrowRight, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import {
  AppButton,
  AppNavbar,
  AppNavbarBrand,
  AppNavbarContent,
  AppNavbarItem,
  AppNavbarMenu,
  AppNavbarMenuItem,
  AppNavbarMenuToggle,
  ThemeToggle,
} from "@laboratoire/ui";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import type { Messages } from "../../i18n/messages";
import LocaleSwitcher from "../ui/LocaleSwitcher";
import { whatsappLink } from "../../data/site";
import { useSiteContactOverrides } from "../../lib/useSiteConfig";
import { useHideOnScroll } from "../../lib/useHideOnScroll";
import { getLongestNavLabels, getNavContent } from "../../data/nav";

type SiteHeaderProps = {
  locale: Locale;
  labels: Messages;
};

/**
 * Home navigation, rebuilt on the @laboratoire/ui AppNavbar compound (the
 * native-HTML v3 wrapper) instead of the SPA-era hand-rolled `#sidemenu`
 * off-canvas. What the swap buys:
 *   - a real mobile menu: animated dropdown panel with dimmed page behind it,
 *     body scroll-lock, Escape-to-close, aria-expanded/aria-controls wiring —
 *     all owned by the wrapper;
 *   - the locale switcher is reachable on mobile again (the old CSS simply
 *     `display:none`d it below 780px);
 *   - no more fixed off-canvas `<ul>` parked at `right:-260px`;
 *   - hide-on-scroll: the pill leaves while you read down, returns on the
 *     first upward flick (disabled while the menu is open).
 *
 * The desktop links keep the ghost-label trick (`.nav-link__ghost` reserves
 * the widest label across locales) so switching language never resizes the
 * pill. Entrance stays the CSS `.hero-enter` keyframe — never a framer mount
 * animation (SSR visibility rule, see HeroSection).
 */
export default function SiteHeader({ locale, labels }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = getNavContent(locale);
  const { phoneDigits } = useSiteContactOverrides();
  const hidden = useHideOnScroll(menuOpen);
  const longestNavLabels = getLongestNavLabels();

  const closeMenu = () => setMenuOpen(false);

  return (
    <AppNavbar
      position="sticky"
      maxWidth="full"
      collapseBreakpoint="lg"
      isMenuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
      aria-label={nav.ariaLabel}
      className={`site-nav hero-enter${hidden ? " site-nav--hidden" : ""}`}
    >
      <AppNavbarContent justify="start" className="site-nav__cluster">
        <AppNavbarBrand>
          <Link
            href={localePath(locale)}
            className="site-nav__brand"
            onClick={closeMenu}
          >
            itshassan<span className="site-nav__brand-tld">.it</span>
          </Link>
        </AppNavbarBrand>
      </AppNavbarContent>

      <AppNavbarContent justify="center" className="site-nav__links">
        {nav.items.map((item) => (
          <AppNavbarItem key={item.href}>
            <a href={item.href} className="site-nav__link nav-link">
              <span className="nav-link__text">{item.label}</span>
              <span className="nav-link__ghost" aria-hidden="true">
                {longestNavLabels[item.href] ?? item.label}
              </span>
            </a>
          </AppNavbarItem>
        ))}
        <AppNavbarItem>
          <Link href={localePath(locale, "/cv")} className="site-nav__link">
            {labels.nav.cv}
          </Link>
        </AppNavbarItem>
      </AppNavbarContent>

      <AppNavbarContent justify="end" className="site-nav__actions">
        <AppNavbarItem>
          <AppButton
            as="a"
            href={whatsappLink(locale, undefined, phoneDigits)}
            target="_blank"
            rel="noreferrer"
            size="sm"
            variant="flat"
            isIconOnly
            aria-label={nav.whatsappLabel}
            className="nav-whatsapp"
          >
            <FaWhatsapp aria-hidden="true" />
          </AppButton>
        </AppNavbarItem>
        <AppNavbarItem>
          <ThemeToggle />
        </AppNavbarItem>
        <AppNavbarItem className="site-nav__locale">
          <LocaleSwitcher locale={locale} labels={labels.locale} />
        </AppNavbarItem>
        <AppNavbarItem className="site-nav__cta">
          <AppButton
            as="a"
            href={localePath(locale, nav.audit.to)}
            size="sm"
            className="cta-primary"
            endContent={<FaArrowRight aria-hidden="true" />}
          >
            {nav.audit.label}
          </AppButton>
        </AppNavbarItem>
        <AppNavbarMenuToggle
          aria-label={menuOpen ? nav.closeMenuLabel : nav.openMenuLabel}
          className="site-nav__toggle"
        />
      </AppNavbarContent>

      <AppNavbarMenu className="site-nav__menu">
        {nav.items.map((item, index) => (
          <AppNavbarMenuItem key={item.href}>
            <a
              href={item.href}
              className="site-nav__menu-link"
              style={{ "--i": index } as React.CSSProperties}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          </AppNavbarMenuItem>
        ))}
        <AppNavbarMenuItem>
          <Link
            href={localePath(locale, "/cv")}
            className="site-nav__menu-link"
            style={{ "--i": nav.items.length } as React.CSSProperties}
            onClick={closeMenu}
          >
            {labels.nav.cv}
          </Link>
        </AppNavbarMenuItem>
        <AppNavbarMenuItem className="site-nav__menu-footer">
          <AppButton
            as="a"
            href={localePath(locale, nav.audit.to)}
            size="lg"
            fullWidth
            className="cta-primary"
            endContent={<FaArrowRight aria-hidden="true" />}
            onPress={closeMenu}
          >
            {nav.audit.label}
          </AppButton>
          <div className="site-nav__menu-meta">
            <LocaleSwitcher locale={locale} labels={labels.locale} />
            <AppButton
              as="a"
              href={whatsappLink(locale, undefined, phoneDigits)}
              target="_blank"
              rel="noreferrer"
              size="sm"
              variant="flat"
              startContent={<FaWhatsapp aria-hidden="true" />}
            >
              WhatsApp
            </AppButton>
          </div>
        </AppNavbarMenuItem>
      </AppNavbarMenu>
    </AppNavbar>
  );
}
