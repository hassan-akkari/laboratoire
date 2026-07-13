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

export const whatsappPrefilledMessages: Record<Locale, string> = {
  it: "Ciao Hassan, vorrei parlare di un progetto. Mi puoi richiamare?",
  en: "Hi Hassan, I'd like to talk about a project. Can you get back to me?",
  fr: "Bonjour Hassan, je voudrais parler d'un projet. Pouvez-vous me recontacter ?",
  de: "Hallo Hassan, ich würde gerne über ein Projekt sprechen. Können Sie sich bei mir melden?",
};

export function whatsappLink(locale: Locale, message?: string, phoneDigitsOverride?: string) {
  const phone = phoneDigitsOverride ?? SITE.whatsappNumber;
  const finalMessage = message ?? whatsappPrefilledMessages[locale];
  const text = encodeURIComponent(finalMessage);
  return `https://wa.me/${phone}?text=${text}`;
}

export function mailtoLink(subject: string, body?: string, emailOverride?: string) {
  const email = emailOverride ?? SITE.email;
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return `mailto:${email}${query ? `?${query}` : ""}`;
}

export function patchWhatsappPhone(href: string, phoneDigits: string): string {
  return href.replace(/wa\.me\/\d+/, `wa.me/${phoneDigits}`);
}

export function patchMailtoEmail(href: string, email: string): string {
  return href.replace(/mailto:[^?]+/, `mailto:${email}`);
}
