import type { Locale } from "../i18n/locale";
import { mailtoLink, whatsappLink } from "./site";

export type AuditCheckpoint = {
  id: string;
  title: string;
  description: string;
};

export type AuditStep = {
  id: string;
  number: string;
  title: string;
  description: string;
};

export type AuditFaq = {
  id: string;
  question: string;
  answer: string;
};

export type AuditContent = {
  seoTitle: string;
  seoDescription: string;
  badge: string;
  hero: {
    title: string;
    subtitle: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    guarantee: string[];
  };
  checkpoints: {
    label: string;
    title: string;
    items: AuditCheckpoint[];
  };
  deliverable: {
    label: string;
    title: string;
    items: string[];
  };
  process: {
    label: string;
    title: string;
    steps: AuditStep[];
  };
  faq: {
    label: string;
    title: string;
    items: AuditFaq[];
  };
  finalCta: {
    title: string;
    subtitle: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  backToHome: string;
};

const auditPrefilled: Record<Locale, string> = {
  it: "Ciao Hassan, vorrei l'audit gratuito del mio sito. URL: ",
  en: "Hi Hassan, I'd like the free audit of my site. URL: ",
  fr: "Bonjour Hassan, je voudrais l'audit gratuit de mon site. URL : ",
};

const it: AuditContent = {
  seoTitle: "Audit gratuito del tuo sito · Hassan Akkari",
  seoDescription:
    "Mandami l'URL del tuo sito. Entro 24 ore lavorative ricevi un mini audit concreto su cosa sistemare prima e perché.",
  badge: "Lead magnet — gratuito",
  hero: {
    title:
      "Mandami l'URL del tuo sito. Entro 24 ore lavorative ti dico cosa sistemare prima.",
    subtitle:
      "Ricevi un mini audit concreto: cosa non funziona, cosa sistemare prima e quanto potrebbe costare intervenire. Gratis, senza impegno e senza call vendita mascherata.",
    primaryCtaLabel: "Voglio l'audit gratuito",
    primaryCtaHref: whatsappLink("it", auditPrefilled.it),
    secondaryCtaLabel: "Mandami una mail",
    secondaryCtaHref: mailtoLink(
      "Audit gratuito del mio sito",
      "Ciao Hassan, vorrei l'audit gratuito del mio sito.\n\nURL del sito: \nNote: ",
    ),
    guarantee: [
      "✓ Risposta entro 24 ore lavorative",
      "✓ Video chiaro, leggibile in 10 minuti",
      "✓ Call opzionale solo se vuoi approfondire",
    ],
  },
  checkpoints: {
    label: "Cosa controllo",
    title: "I 5 punti che fanno scappare un visitatore senza che tu lo sappia.",
    items: [
      {
        id: "first-impression",
        title: "Design e prima impressione",
        description:
          "I primi 3 secondi decidono se il visitatore resta o se ne va. Capiamo cosa comunica davvero il tuo sito al primo sguardo.",
      },
      {
        id: "mobile",
        title: "Mobile experience",
        description:
          "Il 60-70% del tuo traffico arriva da telefono. Verifico responsive, leggibilità, dita-su-bottone e tutto quello che oggi sta rompendo l'esperienza.",
      },
      {
        id: "performance",
        title: "Performance e velocità",
        description:
          "Core Web Vitals reali (LCP, CLS, INP). Ogni secondo di caricamento in più ti costa visitatori e posizionamento Google.",
      },
      {
        id: "seo",
        title: "SEO tecnica base",
        description:
          "Title, meta description, struttura semantica, sitemap, dati strutturati. Il minimo sindacale che spesso manca anche su siti rifatti da poco.",
      },
      {
        id: "conversion",
        title: "CTA e flussi di conversione",
        description:
          "Cosa devi fare per essere contattato? Quanti tap servono? Il visitatore capisce in 5 secondi cosa offri e come prenotare? Spesso è qui che si perdono i contatti.",
      },
    ],
  },
  deliverable: {
    label: "Cosa ricevi",
    title: "Un report concreto, leggibile in 10 minuti.",
    items: [
      "Video registrato di 4-6 minuti dove ti porto in giro per il sito e ti faccio vedere i problemi",
      "Lista delle 3 cose più urgenti da sistemare subito",
      "Indicazione di costi e priorità (cosa fare prima, cosa può aspettare)",
      "Call gratuita di 20 minuti opzionale, se vuoi approfondire",
    ],
  },
  process: {
    label: "Come funziona",
    title: "Tre step. Niente moduli infiniti.",
    steps: [
      {
        id: "send-url",
        number: "01",
        title: "Mi mandi l'URL su WhatsApp",
        description:
          "Un messaggio con il link del tuo sito (e una riga su cosa fai, se ti va). Tutto qui, niente form, niente registrazione.",
      },
      {
        id: "analyze",
        number: "02",
        title: "Analizzo entro 24 ore lavorative",
        description:
          "Verifico i 5 punti, faccio screenshot, registro il video. Se mi serve qualche dettaglio in più ti chiedo.",
      },
      {
        id: "deliver",
        number: "03",
        title: "Ti mando il report",
        description:
          "Video + checklist via WhatsApp o email. Lo guardi, decidi tu se sistemare in autonomia, con qualcun altro o con me. Nessuna pressione.",
      },
    ],
  },
  faq: {
    label: "Domande frequenti",
    title: "Risposte alle domande sensate.",
    items: [
      {
        id: "really-free",
        question: "È davvero gratis?",
        answer:
          "Sì. L'audit è gratuito perché è il modo più semplice per capire se posso aiutarti davvero. Se dopo il report vuoi sistemare qualcosa con me, ne parliamo. Altrimenti ti resta comunque una lista utile.",
      },
      {
        id: "no-website",
        question: "E se non ho ancora un sito?",
        answer:
          "Allora salta l'audit e scrivimi direttamente: parliamo di cosa serve davvero alla tua attività. La prima call è comunque gratuita.",
      },
      {
        id: "wp",
        question: "Ho un sito WordPress: lo guardi lo stesso?",
        answer:
          "Sì. WordPress, Wix, Squarespace, Shopify, custom — non importa la tecnologia. L'audit valuta cosa vede il visitatore, non come è costruito sotto.",
      },
      {
        id: "obligation",
        question: "Sono obbligato a comprare qualcosa dopo?",
        answer:
          "No. Se dopo l'audit decidi che non sei pronto a sistemare nulla, va benissimo. Sei libero di tornare quando ti serve.",
      },
      {
        id: "speed",
        question: "Davvero in 24 ore?",
        answer:
          "24 ore lavorative dal momento in cui ricevo l'URL. Se mi scrivi venerdì sera, può arrivare lunedì. Se sono in vacanza te lo dico subito e ti do una data realistica.",
      },
    ],
  },
  finalCta: {
    title: "Pronto a vedere cosa il tuo sito non ti sta dicendo?",
    subtitle:
      "Mandami l'URL. Entro 24 ore lavorative ricevi un audit chiaro con cosa sistemare prima e perché.",
    primaryLabel: "Mandami il mio URL su WhatsApp",
    primaryHref: whatsappLink("it", auditPrefilled.it),
    secondaryLabel: "Preferisco via email",
    secondaryHref: mailtoLink(
      "Audit gratuito del mio sito",
      "Ciao Hassan, vorrei l'audit gratuito del mio sito.\n\nURL del sito: \nNote: ",
    ),
  },
  backToHome: "← Torna alla homepage",
};

const en: AuditContent = {
  seoTitle: "Free site audit · Hassan Akkari",
  seoDescription:
    "Send me your site URL. Within 24 business hours you receive a concrete mini audit on what to fix first and why.",
  badge: "Lead magnet — free",
  hero: {
    title:
      "Send me your site URL. Within 24 business hours I'll tell you what to fix first.",
    subtitle:
      "You receive a concrete mini audit: what's not working, what to fix first, and what it could cost to intervene. Free, no commitment, no disguised sales call.",
    primaryCtaLabel: "I want the free audit",
    primaryCtaHref: whatsappLink("en", auditPrefilled.en),
    secondaryCtaLabel: "Send me an email",
    secondaryCtaHref: mailtoLink(
      "Free audit of my site",
      "Hi Hassan, I'd like the free audit of my site.\n\nSite URL: \nNotes: ",
    ),
    guarantee: [
      "✓ Reply within 24 business hours",
      "✓ Clear video, readable in 10 minutes",
      "✓ Optional call only if you want to dig deeper",
    ],
  },
  checkpoints: {
    label: "What I check",
    title: "The 5 things that drive your visitors away without you noticing.",
    items: [
      {
        id: "first-impression",
        title: "Design and first impression",
        description:
          "The first 3 seconds decide if the visitor stays or leaves. We figure out what your site is actually saying at first glance.",
      },
      {
        id: "mobile",
        title: "Mobile experience",
        description:
          "60-70% of your traffic comes from phones. I check responsive, readability, finger-on-button, and everything currently breaking the experience.",
      },
      {
        id: "performance",
        title: "Performance and speed",
        description:
          "Real Core Web Vitals (LCP, CLS, INP). Every extra second of load time costs you visitors and Google ranking.",
      },
      {
        id: "seo",
        title: "Basic technical SEO",
        description:
          "Title, meta description, semantic structure, sitemap, structured data. The minimum that's often missing even on recently rebuilt sites.",
      },
      {
        id: "conversion",
        title: "CTAs and conversion flows",
        description:
          "What does the visitor do to contact you? How many taps? Do they understand within 5 seconds what you offer and how to book? This is usually where leads die.",
      },
    ],
  },
  deliverable: {
    label: "What you get",
    title: "A concrete report, readable in 10 minutes.",
    items: [
      "A 4-6 minute recorded video walking through your site and pointing out the issues",
      "Top 3 most urgent things to fix right away",
      "Cost and priority guidance (what to do first, what can wait)",
      "Optional 20-minute free call if you want to dig deeper",
    ],
  },
  process: {
    label: "How it works",
    title: "Three steps. No endless forms.",
    steps: [
      {
        id: "send-url",
        number: "01",
        title: "You send me the URL on WhatsApp",
        description:
          "One message with your site link (and a line on what you do, if you want). That's it — no form, no signup.",
      },
      {
        id: "analyze",
        number: "02",
        title: "I analyse within 24 business hours",
        description:
          "I check the 5 points, take screenshots, record the video. If I need extra detail, I'll ask.",
      },
      {
        id: "deliver",
        number: "03",
        title: "I send you the report",
        description:
          "Video + checklist via WhatsApp or email. You watch it and decide whether to fix things yourself, with someone else, or with me. No pressure.",
      },
    ],
  },
  faq: {
    label: "Frequently asked questions",
    title: "Answers to the sensible questions.",
    items: [
      {
        id: "really-free",
        question: "Is it really free?",
        answer:
          "Yes. The audit is free because it's the simplest way to understand whether I can actually help. If after the report you want to fix something with me, we talk. If not, you still keep a useful list.",
      },
      {
        id: "no-website",
        question: "What if I don't have a site yet?",
        answer:
          "Skip the audit and message me directly: we'll talk about what your business actually needs. The first call is free anyway.",
      },
      {
        id: "wp",
        question: "I have a WordPress site — will you look at it?",
        answer:
          "Yes. WordPress, Wix, Squarespace, Shopify, custom — the technology doesn't matter. The audit looks at what visitors see, not how it's built underneath.",
      },
      {
        id: "obligation",
        question: "Am I forced to buy something afterwards?",
        answer:
          "No. If after the audit you decide you're not ready to fix anything, that's fine. You can come back when you need to.",
      },
      {
        id: "speed",
        question: "Really 24 hours?",
        answer:
          "24 business hours from when I receive the URL. If you send the audit on a Friday evening, it might land on Monday. If I'm on holiday I'll tell you immediately and give you a realistic date.",
      },
    ],
  },
  finalCta: {
    title: "Ready to see what your site isn't telling you?",
    subtitle:
      "Send me the URL. Within 24 business hours you receive a clear audit with what to fix first and why.",
    primaryLabel: "Send my URL on WhatsApp",
    primaryHref: whatsappLink("en", auditPrefilled.en),
    secondaryLabel: "I prefer email",
    secondaryHref: mailtoLink(
      "Free audit of my site",
      "Hi Hassan, I'd like the free audit of my site.\n\nSite URL: \nNotes: ",
    ),
  },
  backToHome: "← Back to homepage",
};

const fr: AuditContent = {
  seoTitle: "Audit gratuit de votre site · Hassan Akkari",
  seoDescription:
    "Envoyez-moi l'URL de votre site. Sous 24 heures ouvrées, vous recevez un mini audit concret sur quoi corriger en premier et pourquoi.",
  badge: "Lead magnet — gratuit",
  hero: {
    title:
      "Envoyez-moi l'URL de votre site. Sous 24 heures ouvrées, je vous dis quoi corriger en premier.",
    subtitle:
      "Vous recevez un mini audit concret : ce qui ne fonctionne pas, quoi corriger en premier et combien l'intervention pourrait coûter. Gratuit, sans engagement et sans appel commercial déguisé.",
    primaryCtaLabel: "Je veux l'audit gratuit",
    primaryCtaHref: whatsappLink("fr", auditPrefilled.fr),
    secondaryCtaLabel: "Envoyez-moi un mail",
    secondaryCtaHref: mailtoLink(
      "Audit gratuit de mon site",
      "Bonjour Hassan, je voudrais l'audit gratuit de mon site.\n\nURL du site : \nNotes : ",
    ),
    guarantee: [
      "✓ Réponse sous 24 heures ouvrées",
      "✓ Vidéo claire, lisible en 10 minutes",
      "✓ Appel optionnel seulement si vous voulez approfondir",
    ],
  },
  checkpoints: {
    label: "Ce que je vérifie",
    title:
      "Les 5 points qui font fuir un visiteur sans que vous le sachiez.",
    items: [
      {
        id: "first-impression",
        title: "Design et première impression",
        description:
          "Les 3 premières secondes décident si le visiteur reste ou part. On comprend ce que votre site dit vraiment au premier coup d'œil.",
      },
      {
        id: "mobile",
        title: "Expérience mobile",
        description:
          "60-70% de votre trafic vient du mobile. Je vérifie le responsive, la lisibilité, les boutons tappables et tout ce qui casse l'expérience aujourd'hui.",
      },
      {
        id: "performance",
        title: "Performance et vitesse",
        description:
          "Core Web Vitals réels (LCP, CLS, INP). Chaque seconde de chargement en plus vous coûte des visiteurs et du positionnement Google.",
      },
      {
        id: "seo",
        title: "SEO technique de base",
        description:
          "Title, meta description, structure sémantique, sitemap, données structurées. Le minimum souvent absent même sur des sites refaits récemment.",
      },
      {
        id: "conversion",
        title: "CTA et parcours de conversion",
        description:
          "Que doit faire le visiteur pour vous contacter ? Combien de taps ? Comprend-il en 5 secondes ce que vous offrez et comment réserver ? C'est souvent là qu'on perd les contacts.",
      },
    ],
  },
  deliverable: {
    label: "Ce que vous recevez",
    title: "Un rapport concret, lisible en 10 minutes.",
    items: [
      "Une vidéo enregistrée de 4-6 minutes où je passe sur votre site et pointe les problèmes",
      "Top 3 des choses les plus urgentes à corriger tout de suite",
      "Indication des coûts et des priorités (quoi faire d'abord, quoi peut attendre)",
      "Appel gratuit de 20 min en option, si vous voulez approfondir",
    ],
  },
  process: {
    label: "Comment ça marche",
    title: "Trois étapes. Pas de formulaires interminables.",
    steps: [
      {
        id: "send-url",
        number: "01",
        title: "Vous m'envoyez l'URL sur WhatsApp",
        description:
          "Un message avec le lien de votre site (et une ligne sur votre activité, si vous voulez). C'est tout — pas de formulaire, pas d'inscription.",
      },
      {
        id: "analyze",
        number: "02",
        title: "J'analyse sous 24 heures ouvrées",
        description:
          "Je vérifie les 5 points, je fais des captures, j'enregistre la vidéo. Si j'ai besoin de plus de détails, je vous demande.",
      },
      {
        id: "deliver",
        number: "03",
        title: "Je vous envoie le rapport",
        description:
          "Vidéo + checklist par WhatsApp ou email. Vous regardez, vous décidez si vous corrigez seul, avec quelqu'un d'autre ou avec moi. Aucune pression.",
      },
    ],
  },
  faq: {
    label: "Questions fréquentes",
    title: "Réponses aux questions sensées.",
    items: [
      {
        id: "really-free",
        question: "C'est vraiment gratuit ?",
        answer:
          "Oui. L'audit est gratuit parce que c'est le moyen le plus simple de comprendre si je peux vraiment vous aider. Si après le rapport vous voulez corriger quelque chose avec moi, on en parle. Sinon, vous gardez quand même une liste utile.",
      },
      {
        id: "no-website",
        question: "Et si je n'ai pas encore de site ?",
        answer:
          "Sautez l'audit et écrivez-moi directement : on parle de ce dont votre activité a vraiment besoin. Le premier appel est gratuit de toute façon.",
      },
      {
        id: "wp",
        question: "J'ai un site WordPress — vous le regardez quand même ?",
        answer:
          "Oui. WordPress, Wix, Squarespace, Shopify, custom — la techno n'a pas d'importance. L'audit regarde ce que voit le visiteur, pas comment c'est construit dessous.",
      },
      {
        id: "obligation",
        question: "Suis-je obligé d'acheter quelque chose après ?",
        answer:
          "Non. Si après l'audit vous décidez que vous n'êtes pas prêt à corriger quoi que ce soit, c'est ok. Vous pouvez revenir quand vous en aurez besoin.",
      },
      {
        id: "speed",
        question: "Vraiment 24h ?",
        answer:
          "24 heures ouvrées à partir de la réception de l'URL. Si vous m'écrivez un vendredi soir, il peut arriver lundi. Si je suis en vacances, je vous le dis tout de suite et je vous donne une date réaliste.",
      },
    ],
  },
  finalCta: {
    title: "Prêt à voir ce que votre site ne vous dit pas ?",
    subtitle:
      "Envoyez l'URL. Sous 24 heures ouvrées, vous recevez un audit clair avec quoi corriger en premier et pourquoi.",
    primaryLabel: "Envoyer mon URL sur WhatsApp",
    primaryHref: whatsappLink("fr", auditPrefilled.fr),
    secondaryLabel: "Je préfère par email",
    secondaryHref: mailtoLink(
      "Audit gratuit de mon site",
      "Bonjour Hassan, je voudrais l'audit gratuit de mon site.\n\nURL du site : \nNotes : ",
    ),
  },
  backToHome: "← Retour à l'accueil",
};

export const auditContent: Record<Locale, AuditContent> = { it, en, fr };

export function getAuditContent(locale: Locale) {
  return auditContent[locale];
}
