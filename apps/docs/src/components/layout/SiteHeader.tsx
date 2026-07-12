"use client";

import { useMemo, useState } from "react";
import { FaBars, FaTimes, FaWhatsapp } from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Container from "./Container";
import { AppButton, ThemeToggle } from "@laboratoire/ui";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import type { Messages } from "../../i18n/messages";
import LocaleSwitcher from "../ui/LocaleSwitcher";
import { whatsappLink } from "../../data/site";
import { useSiteContactOverrides } from "../../lib/useSiteConfig";
import {
  getLongestAuditLabel,
  getLongestNavLabels,
  getNavContent,
} from "../../data/nav";
import { fadeUpVariants, getMountReveal } from "../ui/motionPresets";

type SiteHeaderProps = {
  locale: Locale;
  labels: Messages;
};

export default function SiteHeader({ locale, labels }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const nav = getNavContent(locale);
  const { phoneDigits } = useSiteContactOverrides();
  const longestNavLabels = useMemo(() => getLongestNavLabels(), []);
  const longestAuditLabel = useMemo(() => getLongestAuditLabel(), []);
  const toggleMenu = (open: boolean) => setMenuOpen(open);

  return (
    <div id="header">
      <Container>
        <motion.nav variants={fadeUpVariants} {...getMountReveal(reduceMotion)}>
          <ul
            id="sidemenu"
            className={menuOpen ? "open" : ""}
            onClick={() => toggleMenu(false)}
          >
            {nav.items.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="nav-link">
                  <span className="nav-link__text">{item.label}</span>
                  <span className="nav-link__ghost" aria-hidden="true">
                    {longestNavLabels[item.href] ?? item.label}
                  </span>
                </a>
              </li>
            ))}
            <li>
              <Link href={localePath(locale, nav.audit.to)} className="nav-link">
                <span className="nav-link__text">{nav.audit.label}</span>
                <span className="nav-link__ghost" aria-hidden="true">
                  {longestAuditLabel}
                </span>
              </Link>
            </li>
            <li>
              <Link href={localePath(locale, "/cv")}>{labels.nav.cv}</Link>
            </li>
            <li className="nav-close">
              <button
                type="button"
                className="fa-solid fa-xmark nav-icon-button"
                onClick={() => toggleMenu(false)}
                aria-label={nav.closeMenuLabel}
              >
                <FaTimes aria-hidden="true" />
              </button>
            </li>
          </ul>
          <div className="nav-actions">
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
              labels={labels.locale}
              className="nav-locale-switcher"
            />
          </div>
        </motion.nav>
      </Container>
    </div>
  );
}
