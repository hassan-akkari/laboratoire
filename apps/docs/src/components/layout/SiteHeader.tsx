import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import Container from "./Container";
import { AppButton, ThemeToggle } from "@laboratoire/ui";
import type { ProfileContact, PortfolioContent } from "../../content/portfolioContent";
import type { Locale } from "../../i18n/locale";
import type { Messages } from "../../i18n/messages";
import LocaleSwitcher from "../ui/LocaleSwitcher";
import { Link } from "react-router-dom";
import {
  fadeUpVariants,
  getMountReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type SiteHeaderProps = {
  profile: PortfolioContent["profile"];
  contact: ProfileContact;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  labels: Messages;
};

export default function SiteHeader({
  profile,
  contact,
  locale,
  onLocaleChange,
  labels,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const toggleMenu = (open: boolean) => setMenuOpen(open);

  return (
    <div id="header">
      <Container>
        <motion.nav
          variants={fadeUpVariants}
          {...getMountReveal(reduceMotion)}
        >
          <img className="logo" src="favicon.png" alt="Laboratoire logo" />
          <ul
            id="sidemenu"
            className={menuOpen ? "open" : ""}
            onClick={() => toggleMenu(false)}
          >
            <li>
              <a href="#header">{labels.nav.home}</a>
            </li>
            <li>
              <a href="#about">{labels.nav.about}</a>
            </li>
            <li>
              <a href="#highlights">{labels.nav.highlights}</a>
            </li>
            <li>
              <a href="#portfolio">{labels.nav.projects}</a>
            </li>
            <li>
              <a href="#roadmap">{labels.nav.roadmap}</a>
            </li>
            <li>
              <a href="#contact">{labels.nav.contact}</a>
            </li>
            <li>
              <Link to="/cv">{labels.nav.cv}</Link>
            </li>
            <li className="nav-close">
              <button
                type="button"
                className="fa-solid fa-xmark nav-icon-button"
                onClick={() => toggleMenu(false)}
                aria-label="Close navigation menu"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </li>
          </ul>
          <div className="nav-actions">
            <ThemeToggle />
            <button
              type="button"
              className="fa-solid fa-bars nav-icon-button"
              onClick={() => toggleMenu(true)}
              aria-label="Open navigation menu"
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

        <motion.div
          className="header-content"
          variants={staggerChildrenVariants}
          {...getMountReveal(reduceMotion)}
        >
          <motion.div className="header-text" variants={fadeUpVariants}>
            <p>{profile.role}</p>
            <h1>
              {labels.header.greetingPrefix} <span>{profile.name}</span>
              <br />
              {labels.header.headlineSuffix}
            </h1>
            <p className="header-lead">{profile.focus}</p>
            <div className="header-actions">
              <AppButton as="a" href="#portfolio">
                {labels.header.viewProjects}
              </AppButton>
              <AppButton as="a" href={`mailto:${contact.email}`} variant="bordered">
                {labels.header.emailMe}
              </AppButton>
            </div>
          </motion.div>
          <motion.aside className="header-proof" variants={fadeUpVariants}>
            <p className="header-proof-title">{labels.header.quickProfile}</p>
            <p>{profile.metric}</p>
            <p>{profile.location}</p>
          </motion.aside>
        </motion.div>
      </Container>
    </div>
  );
}
