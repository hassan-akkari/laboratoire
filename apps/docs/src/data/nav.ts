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
};

export const navContent: Record<Locale, NavContent> = { it, en, fr };

export function getNavContent(locale: Locale) {
  return navContent[locale];
}
