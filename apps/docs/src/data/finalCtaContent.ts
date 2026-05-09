import type { Locale } from "../i18n/locale";
import { mailtoLink, SITE, whatsappLink } from "./site";

export type FinalCtaContent = {
  title: string;
  subtitle: string;
  auditLabel: string;
  auditHref: string;
  whatsappLabel: string;
  whatsappHref: string;
  emailLabel: string;
  emailHref: string;
  footnote: string;
};

const it: FinalCtaContent = {
  title: "Non sai ancora se il tuo sito ti sta costando clienti?",
  subtitle:
    "Mandami l'URL. Entro 24 ore lavorative ti mando un audit chiaro con cosa sistemare prima e perché.",
  auditLabel: "Richiedi audit gratuito",
  auditHref: "/audit",
  whatsappLabel: "Scrivimi su WhatsApp",
  whatsappHref: whatsappLink("it"),
  emailLabel: "Mandami una mail",
  emailHref: mailtoLink("Richiesta info", "Ciao Hassan, "),
  footnote: `Rispondo entro 24h lavorative — ${SITE.email} — ${SITE.location}`,
};

const en: FinalCtaContent = {
  title: "Don't know if your site is costing you customers?",
  subtitle:
    "Send me the URL. Within 24 business hours I send you a clear audit with what to fix first and why.",
  auditLabel: "Get a free audit",
  auditHref: "/audit",
  whatsappLabel: "Message me on WhatsApp",
  whatsappHref: whatsappLink("en"),
  emailLabel: "Send me an email",
  emailHref: mailtoLink("Quick question", "Hi Hassan, "),
  footnote: `I reply within 24 business hours — ${SITE.email} — ${SITE.location}`,
};

const fr: FinalCtaContent = {
  title: "Vous ne savez pas si votre site vous coûte des clients ?",
  subtitle:
    "Envoyez-moi l'URL. Sous 24 heures ouvrées, je vous envoie un audit clair avec quoi corriger en premier et pourquoi.",
  auditLabel: "Demander un audit gratuit",
  auditHref: "/audit",
  whatsappLabel: "Écrivez-moi sur WhatsApp",
  whatsappHref: whatsappLink("fr"),
  emailLabel: "Envoyez-moi un mail",
  emailHref: mailtoLink("Demande d'info", "Bonjour Hassan, "),
  footnote: `Je réponds sous 24h ouvrées — ${SITE.email} — ${SITE.location}`,
};

export const finalCtaContent: Record<Locale, FinalCtaContent> = { it, en, fr };

export function getFinalCtaContent(locale: Locale) {
  return finalCtaContent[locale];
}
