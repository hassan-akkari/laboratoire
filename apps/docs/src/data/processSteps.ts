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
    "Niente brief di 40 pagine, niente sparizioni di 3 settimane. Vedi i progressi mentre lavoro.",
  steps: [
    {
      id: "discovery",
      number: "01",
      title: "Capiamo cosa ti serve davvero",
      description:
        "Una call gratuita di 20-30 minuti. Mi racconti il problema, ti faccio le domande giuste. A fine call hai già più chiarezza, anche se non lavoreremo insieme.",
    },
    {
      id: "proposal",
      number: "02",
      title: "Proposta chiara, prezzo fisso",
      description:
        "Ti mando una proposta scritta: cosa farò, cosa non farò, quanto costa, in quanto tempo. Niente sorprese, niente costi nascosti, niente 'poi vediamo'.",
    },
    {
      id: "build",
      number: "03",
      title: "Costruisco e ti tengo aggiornato",
      description:
        "Vedi i progressi mentre lavoro. Anteprima online sempre disponibile, feedback rapidi su WhatsApp o email. Non sparisco per 3 settimane.",
    },
    {
      id: "launch",
      number: "04",
      title: "Online + supporto post-lancio",
      description:
        "Pubblichiamo, controlliamo che tutto funzioni, ti spiego come gestire le piccole modifiche. Per le evolutive ci sono pacchetti dedicati, niente abbonamenti forzati.",
    },
  ],
};

const en: ProcessContent = {
  sectionLabel: "How I work",
  title: "Four simple steps, from the first call to the live site.",
  subtitle:
    "No 40-page briefs, no 3-week disappearances. You see progress as I work.",
  steps: [
    {
      id: "discovery",
      number: "01",
      title: "We figure out what you actually need",
      description:
        "A 20-30 minute free call. You tell me the problem, I ask the right questions. By the end you already have more clarity, even if we don't work together.",
    },
    {
      id: "proposal",
      number: "02",
      title: "Clear proposal, fixed price",
      description:
        "I send a written proposal: what I'll do, what I won't, how much it costs, in what time. No surprises, no hidden costs, no 'we'll see later'.",
    },
    {
      id: "build",
      number: "03",
      title: "I build and keep you posted",
      description:
        "You see progress while I work. Live preview always available, quick feedback on WhatsApp or email. I don't ghost you for 3 weeks.",
    },
    {
      id: "launch",
      number: "04",
      title: "Live + post-launch support",
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
    "Pas de briefs de 40 pages, pas de disparitions de 3 semaines. Vous voyez les progrès au fur et à mesure.",
  steps: [
    {
      id: "discovery",
      number: "01",
      title: "On comprend ce dont vous avez vraiment besoin",
      description:
        "Un appel gratuit de 20-30 minutes. Vous me décrivez le problème, je vous pose les bonnes questions. À la fin vous y voyez plus clair, même si on ne travaille pas ensemble.",
    },
    {
      id: "proposal",
      number: "02",
      title: "Proposition claire, prix fixe",
      description:
        "Je vous envoie un devis écrit : ce que je fais, ce que je ne fais pas, combien ça coûte, en combien de temps. Pas de surprises, pas de coûts cachés, pas de 'on verra plus tard'.",
    },
    {
      id: "build",
      number: "03",
      title: "Je construis et je vous tiens au courant",
      description:
        "Vous voyez les progrès pendant que je travaille. Aperçu en ligne toujours dispo, retours rapides sur WhatsApp ou email. Je ne disparais pas pendant 3 semaines.",
    },
    {
      id: "launch",
      number: "04",
      title: "Mise en ligne + support post-lancement",
      description:
        "On publie, on vérifie que tout fonctionne, je vous explique comment gérer les petites modifs. Pour les évolutions il y a des forfaits dédiés — pas d'abonnement forcé.",
    },
  ],
};

export const processContent: Record<Locale, ProcessContent> = { it, en, fr };

export function getProcessContent(locale: Locale) {
  return processContent[locale];
}
