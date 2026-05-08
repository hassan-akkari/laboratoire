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
    "In 24h te lo dico — gratis, senza call vendita mascherata. Mandami l'URL, leggi il report, decidi tu cosa fare. Se non sono io la persona giusta, te lo scrivo dritto.",
  auditLabel: "Voglio l'audit gratuito",
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
    "In 24h I'll tell you — free, no disguised sales call. Send me the URL, read the report, decide what to do next. If I'm not the right person, I'll tell you straight.",
  auditLabel: "I want the free audit",
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
    "En 24h je vous le dis — gratuit, sans appel commercial déguisé. Envoyez-moi l'URL, lisez le rapport, décidez ensuite. Si je ne suis pas la bonne personne, je vous le dis franchement.",
  auditLabel: "Je veux l'audit gratuit",
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
