import type { Locale } from "../i18n/locale";
import { mailtoLink, SITE, whatsappLink } from "./site";

export type FinalCtaContent = {
  title: string;
  subtitle: string;
  whatsappLabel: string;
  whatsappHref: string;
  callLabel: string;
  callHref: string;
  emailLabel: string;
  emailHref: string;
  footnote: string;
};

const it: FinalCtaContent = {
  title:
    "Vuoi capire se posso aiutarti? La prima call è gratuita e dura 20 minuti.",
  subtitle:
    "Niente impegno, niente preventivo finto, niente upselling. Mi racconti il problema, ti dico se posso risolverlo, in quanto tempo e con quale budget. Se non sono io la persona giusta, te lo dico con onestà.",
  whatsappLabel: "Scrivimi su WhatsApp",
  whatsappHref: whatsappLink("it"),
  callLabel: "Prenota una call",
  callHref: mailtoLink(
    "Call gratuita per il mio progetto",
    "Ciao Hassan, vorrei prenotare una call gratuita di 20 minuti.",
  ),
  emailLabel: "Mandami una mail",
  emailHref: mailtoLink("Richiesta info", "Ciao Hassan, "),
  footnote: `Rispondo entro 24h lavorative — ${SITE.email} — ${SITE.location}`,
};

const en: FinalCtaContent = {
  title:
    "Want to see if I can help? The first call is free and lasts 20 minutes.",
  subtitle:
    "No commitment, no fake quote, no upselling. You describe the problem, I tell you if I can solve it, in what time and with what budget. If I'm not the right person, I'll tell you honestly.",
  whatsappLabel: "Message me on WhatsApp",
  whatsappHref: whatsappLink("en"),
  callLabel: "Book a call",
  callHref: mailtoLink(
    "Free intro call about my project",
    "Hi Hassan, I'd like to book a 20-minute free intro call.",
  ),
  emailLabel: "Send me an email",
  emailHref: mailtoLink("Quick question", "Hi Hassan, "),
  footnote: `I reply within 24 business hours — ${SITE.email} — ${SITE.location}`,
};

const fr: FinalCtaContent = {
  title:
    "Vous voulez voir si je peux vous aider ? Le premier appel est gratuit et dure 20 minutes.",
  subtitle:
    "Pas d'engagement, pas de devis bidon, pas d'upselling. Vous me décrivez le problème, je vous dis si je peux le résoudre, en combien de temps et avec quel budget. Si je ne suis pas la bonne personne, je vous le dis honnêtement.",
  whatsappLabel: "Écrivez-moi sur WhatsApp",
  whatsappHref: whatsappLink("fr"),
  callLabel: "Réserver un appel",
  callHref: mailtoLink(
    "Appel gratuit pour mon projet",
    "Bonjour Hassan, j'aimerais réserver un appel gratuit de 20 minutes.",
  ),
  emailLabel: "Envoyez-moi un mail",
  emailHref: mailtoLink("Demande d'info", "Bonjour Hassan, "),
  footnote: `Je réponds sous 24h ouvrées — ${SITE.email} — ${SITE.location}`,
};

export const finalCtaContent: Record<Locale, FinalCtaContent> = { it, en, fr };

export function getFinalCtaContent(locale: Locale) {
  return finalCtaContent[locale];
}
