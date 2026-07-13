import type { Locale } from "../i18n/locale";

export type ProcessStep = {
  id: string;
  number: string;
  title: string;
  description: string;
};

export type ProcessContent = {
  sectionLabel: string;
  title: string;
  subtitle: string;
  steps: ProcessStep[];
};

const it: ProcessContent = {
  sectionLabel: "Come lavoro",
  title: "Quattro step semplici, dalla prima call al sito online.",
  subtitle:
    "Metodo semplice: capiamo il problema, decidiamo lo scope, lavori su anteprime visibili e poi pubblichiamo.",
  steps: [
    {
      id: "discovery",
      number: "01",
      title: "Capisco cosa ti serve davvero",
      description:
        "Una call gratuita di 20-30 minuti. Mi racconti il problema, ti faccio le domande giuste. A fine call hai già più chiarezza, anche se non lavoreremo insieme.",
    },
    {
      id: "proposal",
      number: "02",
      title: "Ti mando una proposta chiara",
      description:
        "Ti mando una proposta scritta: cosa farò, cosa non farò, quanto costa, in quanto tempo. Niente sorprese, niente costi nascosti, niente 'poi vediamo'.",
    },
    {
      id: "build",
      number: "03",
      title: "Costruisco con anteprime visibili",
      description:
        "Vedi i progressi mentre lavoro. Anteprima online sempre disponibile, feedback rapidi su WhatsApp o email, decisioni tracciate senza confusione.",
    },
    {
      id: "launch",
      number: "04",
      title: "Pubblico e resto disponibile",
      description:
        "Pubblichiamo, controlliamo che tutto funzioni, ti spiego come gestire le piccole modifiche. Per le evolutive ci sono pacchetti dedicati, niente abbonamenti forzati.",
    },
  ],
};

const en: ProcessContent = {
  sectionLabel: "How I work",
  title: "Four simple steps, from the first call to the live site.",
  subtitle:
    "Simple method: understand the problem, define the scope, work from visible previews, then publish.",
  steps: [
    {
      id: "discovery",
      number: "01",
      title: "I understand what you actually need",
      description:
        "A 20-30 minute free call. You tell me the problem, I ask the right questions. By the end you already have more clarity, even if we don't work together.",
    },
    {
      id: "proposal",
      number: "02",
      title: "I send a clear proposal",
      description:
        "I send a written proposal: what I'll do, what I won't, how much it costs, in what time. No surprises, no hidden costs, no 'we'll see later'.",
    },
    {
      id: "build",
      number: "03",
      title: "I build with visible previews",
      description:
        "You see progress while I work. Live preview always available, quick feedback on WhatsApp or email, decisions tracked without confusion.",
    },
    {
      id: "launch",
      number: "04",
      title: "I publish and stay available",
      description:
        "We publish, double-check everything works, I show you how to handle small edits. For evolutions there are dedicated packages — no forced subscriptions.",
    },
  ],
};

const fr: ProcessContent = {
  sectionLabel: "Comment je travaille",
  title:
    "Quatre étapes simples, du premier appel au site en ligne.",
  subtitle:
    "Méthode simple : comprendre le problème, définir le scope, travailler sur des aperçus visibles, puis publier.",
  steps: [
    {
      id: "discovery",
      number: "01",
      title: "Je comprends ce dont vous avez vraiment besoin",
      description:
        "Un appel gratuit de 20-30 minutes. Vous me décrivez le problème, je vous pose les bonnes questions. À la fin vous y voyez plus clair, même si on ne travaille pas ensemble.",
    },
    {
      id: "proposal",
      number: "02",
      title: "Je vous envoie une proposition claire",
      description:
        "Je vous envoie un devis écrit : ce que je fais, ce que je ne fais pas, combien ça coûte, en combien de temps. Pas de surprises, pas de coûts cachés, pas de 'on verra plus tard'.",
    },
    {
      id: "build",
      number: "03",
      title: "Je construis avec des aperçus visibles",
      description:
        "Vous voyez les progrès pendant que je travaille. Aperçu en ligne toujours disponible, retours rapides sur WhatsApp ou email, décisions suivies sans confusion.",
    },
    {
      id: "launch",
      number: "04",
      title: "Je publie et je reste disponible",
      description:
        "On publie, on vérifie que tout fonctionne, je vous explique comment gérer les petites modifs. Pour les évolutions il y a des forfaits dédiés — pas d'abonnement forcé.",
    },
  ],
};

const de: ProcessContent = {
  sectionLabel: "Arbeitsweise",
  title: "Vier einfache Schritte, vom ersten Gespräch bis zur Website online.",
  subtitle:
    "Einfache Methode: Wir verstehen das Problem, legen den Umfang fest, Sie arbeiten mit sichtbaren Vorschauen — dann geht es online.",
  steps: [
    {
      id: "discovery",
      number: "01",
      title: "Ich verstehe, was Sie wirklich brauchen",
      description:
        "Ein kostenloses Gespräch von 20-30 Minuten. Sie schildern das Problem, ich stelle die richtigen Fragen. Am Ende haben Sie mehr Klarheit — auch wenn wir nicht zusammenarbeiten.",
    },
    {
      id: "proposal",
      number: "02",
      title: "Sie erhalten eine klare Offerte",
      description:
        "Eine schriftliche Offerte: was ich mache, was nicht, was es kostet, in welcher Zeit. Keine Überraschungen, keine versteckten Kosten, kein «schauen wir dann».",
    },
    {
      id: "build",
      number: "03",
      title: "Ich baue mit sichtbaren Vorschauen",
      description:
        "Sie sehen den Fortschritt, während ich arbeite. Online-Vorschau jederzeit verfügbar, schnelles Feedback per WhatsApp oder E-Mail, nachvollziehbare Entscheidungen ohne Chaos.",
    },
    {
      id: "launch",
      number: "04",
      title: "Ich publiziere und bleibe erreichbar",
      description:
        "Wir gehen online, prüfen, dass alles funktioniert, und ich zeige Ihnen, wie Sie kleine Änderungen selbst verwalten. Für Weiterentwicklungen gibt es eigene Pakete — keine Zwangs-Abos.",
    },
  ],
};

export const processContent: Record<Locale, ProcessContent> = {
  it,
  en,
  fr,
  de,
};

export function getProcessContent(locale: Locale) {
  return processContent[locale];
}
