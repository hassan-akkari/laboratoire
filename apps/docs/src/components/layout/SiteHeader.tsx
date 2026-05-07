import { useState } from "react";
import { FaBars, FaTimes, FaWhatsapp } from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import Container from "./Container";
import { AppButton, ThemeToggle } from "@laboratoire/ui";
import type { Locale } from "../../i18n/locale";
import type { Messages } from "../../i18n/messages";
import LocaleSwitcher from "../ui/LocaleSwitcher";
import { whatsappLink } from "../../data/site";
import { getNavContent } from "../../data/nav";
import { fadeUpVariants, getMountReveal } from "../ui/motionPresets";

type SiteHeaderProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  labels: Messages;
};

export default function SiteHeader({
  locale,
  onLocaleChange,
  labels,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const nav = getNavContent(locale);
  const toggleMenu = (open: boolean) => setMenuOpen(open);

  return (
    <div id="header">
      <Container>
        <motion.nav variants={fadeUpVariants} {...getMountReveal(reduceMotion)}>
          <Link to="/" aria-label="Home">
            <img className="logo" src="favicon.png" alt="Laboratoire logo" />
          </Link>
          <ul
            id="sidemenu"
            className={menuOpen ? "open" : ""}
            onClick={() => toggleMenu(false)}
          >
            {nav.items.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            <li>
              <Link to="/cv">{labels.nav.cv}</Link>
            </li>
            <button
              type="button"
              className="fa-solid fa-xmark nav-icon-button"
              onClick={() => toggleMenu(false)}
              aria-label={nav.closeMenuLabel}
            >
              <FaTimes />
            </button>
          </ul>
          <div className="nav-actions">
            <AppButton
              as="a"
              href={whatsappLink(locale)}
              target="_blank"
              rel="noreferrer"
              size="sm"
              variant="flat"
              startContent={<FaWhatsapp aria-hidden="true" />}
              className="nav-whatsapp"
            >
              {nav.whatsappLabel}
            </AppButton>
            <ThemeToggle />
            <button
              type="button"
              className="fa-solid fa-bars nav-icon-button"
              onClick={() => toggleMenu(true)}
              aria-label={nav.openMenuLabel}
              aria-expanded={menuOpen}
              aria-controls="sidemenu"
            >
              <FaBars />
            </button>
            <LocaleSwitcher
              locale={locale}
              onChange={onLocaleChange}
              labels={labels.locale}
              className="nav-locale-switcher"
            />
          </div>
        </motion.nav>
      </Container>
    </div>
  );
}
