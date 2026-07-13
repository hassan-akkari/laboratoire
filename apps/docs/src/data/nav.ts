import type { Locale } from "../i18n/locale";

export type NavItem = {
  href: string;
  label: string;
};

export type NavRoute = {
  to: string;
  label: string;
};

export type NavContent = {
  items: NavItem[];
  audit: NavRoute;
  whatsappLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
  ariaLabel: string;
};

const it: NavContent = {
  items: [
    { href: "#services", label: "Servizi" },
    { href: "#case-studies", label: "Progetti" },
    { href: "#process", label: "Come lavoro" },
    { href: "#faq", label: "FAQ" },
    { href: "#cta", label: "Contatti" },
  ],
  audit: { to: "/audit", label: "Audit gratuito" },
  whatsappLabel: "WhatsApp",
  openMenuLabel: "Apri menu di navigazione",
  closeMenuLabel: "Chiudi menu di navigazione",
  ariaLabel: "Navigazione principale",
};

const en: NavContent = {
  items: [
    { href: "#services", label: "Services" },
    { href: "#case-studies", label: "Projects" },
    { href: "#process", label: "How I work" },
    { href: "#faq", label: "FAQ" },
    { href: "#cta", label: "Contact" },
  ],
  audit: { to: "/audit", label: "Free audit" },
  whatsappLabel: "WhatsApp",
  openMenuLabel: "Open navigation menu",
  closeMenuLabel: "Close navigation menu",
  ariaLabel: "Main navigation",
};

const fr: NavContent = {
  items: [
    { href: "#services", label: "Services" },
    { href: "#case-studies", label: "Projets" },
    { href: "#process", label: "Méthode" },
    { href: "#faq", label: "FAQ" },
    { href: "#cta", label: "Contact" },
  ],
  audit: { to: "/audit", label: "Audit gratuit" },
  whatsappLabel: "WhatsApp",
  openMenuLabel: "Ouvrir le menu de navigation",
  closeMenuLabel: "Fermer le menu de navigation",
  ariaLabel: "Navigation principale",
};

const de: NavContent = {
  items: [
    { href: "#services", label: "Leistungen" },
    { href: "#case-studies", label: "Projekte" },
    { href: "#process", label: "Arbeitsweise" },
    { href: "#faq", label: "FAQ" },
    { href: "#cta", label: "Kontakt" },
  ],
  audit: { to: "/audit", label: "Gratis-Audit" },
  whatsappLabel: "WhatsApp",
  openMenuLabel: "Navigationsmenü öffnen",
  closeMenuLabel: "Navigationsmenü schliessen",
  ariaLabel: "Hauptnavigation",
};

export const navContent: Record<Locale, NavContent> = { it, en, fr, de };

export function getNavContent(locale: Locale) {
  return navContent[locale];
}

const ALL_LOCALES: Locale[] = ["en", "it", "fr", "de"];

export function getLongestNavLabels(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const ref of navContent.en.items) {
    let longest = "";
    for (const loc of ALL_LOCALES) {
      const match = navContent[loc].items.find((i) => i.href === ref.href);
      if (match && match.label.length > longest.length) {
        longest = match.label;
      }
    }
    result[ref.href] = longest;
  }
  return result;
}

export function getLongestAuditLabel(): string {
  let longest = "";
  for (const loc of ALL_LOCALES) {
    const label = navContent[loc].audit.label;
    if (label.length > longest.length) longest = label;
  }
  return longest;
}
