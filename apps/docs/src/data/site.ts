import type { Locale } from "../i18n/locale";

export const SITE = {
  name: "Hassan Akkari",
  email: "hassan.akkari01@gmail.com",
  whatsappNumber: "393517872307",
  calendlyUrl: "",
  github: "https://github.com/Dark-lIl-Demon",
  linkedin: "https://www.linkedin.com/in/hassan-akkari",
  location: "Roma, Italia",
} as const;

const whatsappPrefilledMessages: Record<Locale, string> = {
  it: "Ciao Hassan, vorrei parlare di un progetto. Mi puoi richiamare?",
  en: "Hi Hassan, I'd like to talk about a project. Can you get back to me?",
  fr: "Bonjour Hassan, je voudrais parler d'un projet. Pouvez-vous me recontacter ?",
};

export function whatsappLink(locale: Locale, message?: string) {
  const finalMessage = message ?? whatsappPrefilledMessages[locale];
  const text = encodeURIComponent(finalMessage);
  return `https://wa.me/${SITE.whatsappNumber}?text=${text}`;
}

export function mailtoLink(subject: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return `mailto:${SITE.email}${query ? `?${query}` : ""}`;
}
