import type { Locale } from "../i18n/locale";
import { mailtoLink, whatsappLink } from "./site";

export type Service = {
  id: string;
  name: string;
  tagline: string;
  forWho: string;
  includes: string[];
  excludes: string[];
  priceLabel: string;
  timeline: string;
  badge?: string;
  ctaLabel: string;
  ctaHref: string;
};

export type ServicesContent = {
  sectionLabel: string;
  title: string;
  subtitle: string;
  services: Service[];
  secondaryCta: { label: string; href: string };
};

const it: ServicesContent = {
  sectionLabel: "Servizi e pacchetti",
  title: "Quattro modi concreti per migliorare la tua presenza online.",
  subtitle:
    "Prezzi indicativi: dopo la prima call ricevi un preventivo scritto, fisso, senza sorprese.",
  services: [
    {
      id: "landing",
      name: "Landing Page Professionale",
      tagline:
        "Una pagina pensata per vendere un servizio o raccogliere contatti. Online in una settimana.",
      forWho:
        "Ideale per professionisti, freelance e piccole attività che vogliono promuovere un servizio specifico, una campagna, un'offerta o una nuova attività.",
      includes: [
        "Design su misura, mobile-first",
        "Copy strutturato per la conversione",
        "Form contatti + bottone WhatsApp",
        "SEO base (title, meta, struttura corretta)",
        "Performance ottimizzata su mobile",
        "Setup hosting e dominio insieme a te",
      ],
      excludes: [
        "Logica di prenotazione complessa",
        "Area clienti / login",
        "E-commerce con catalogo",
      ],
      priceLabel: "Da 600 €",
      timeline: "5-7 giorni lavorativi",
      ctaLabel: "Voglio una landing",
      ctaHref: whatsappLink(
        "it",
        "Ciao Hassan, mi interessa una landing page. Mi puoi dare maggiori info?",
      ),
    },
    {
      id: "site",
      name: "Sito Professionale per attività e studi",
      tagline:
        "Il sito che dà credibilità alla tua attività. Chiaro, veloce, fatto per farti contattare.",
      forWho:
        "Studi, professionisti e piccole aziende che hanno un sito vecchio o non ne hanno uno e vogliono apparire seri online.",
      includes: [
        "Homepage, Chi siamo, Servizi, Contatti, FAQ",
        "Design coerente e responsive su ogni dispositivo",
        "SEO tecnico base + meta tag corretti",
        "Form contatti + WhatsApp + Google Maps",
        "Performance ottimizzata e Core Web Vitals",
        "Affiancamento hosting/dominio",
      ],
      excludes: [
        "App mobile native",
        "Area clienti / login utente",
        "E-commerce avanzato",
      ],
      priceLabel: "Da 1.500 €",
      timeline: "2-3 settimane",
      badge: "Più richiesto",
      ctaLabel: "Voglio un sito completo",
      ctaHref: whatsappLink(
        "it",
        "Ciao Hassan, mi serve un sito professionale per la mia attività. Possiamo parlarne?",
      ),
    },
    {
      id: "webapp",
      name: "Web App / MVP su misura",
      tagline:
        "Un piccolo sistema web per togliere processi da Excel, WhatsApp o strumenti improvvisati.",
      forWho:
        "Chi ha un'idea di prodotto digitale, un gestionale interno da rifare o vuole portare online un processo che oggi gira su Excel/WhatsApp. Partiamo dalla prima versione utile, non dal castello intero.",
      includes: [
        "Analisi del problema e definizione dell'MVP",
        "Area clienti / login / dashboard",
        "Gestione dati, prenotazioni, contenuti",
        "API REST e integrazioni con servizi esterni",
        "Base tecnica solida, facile da evolvere senza rifare tutto da zero",
        "Documentazione e handover finale",
      ],
      excludes: [
        "Manutenzione continuativa post-lancio (a parte, su contratto)",
        "App native iOS/Android (solo web app responsive)",
      ],
      priceLabel: "Da 3.500 €",
      timeline: "4-8 settimane",
      ctaLabel: "Parliamo del progetto",
      ctaHref: whatsappLink(
        "it",
        "Ciao Hassan, ho un'idea per una web app/MVP e vorrei capire come muovermi.",
      ),
    },
    {
      id: "restyle",
      name: "Restyling strategico del sito esistente",
      tagline:
        "Il tuo sito è vecchio, lento o non ti rappresenta più? Lo rimetto a posto senza ricominciare da zero.",
      forWho:
        "Chi ha già un sito (anche WordPress) ma sta perdendo contatti per design datato, performance basse o struttura confusa.",
      includes: [
        "Audit completo: design, UX, performance, SEO base",
        "Rifacimento UI delle pagine principali",
        "Miglioramento velocità e mobile experience",
        "Nuovi CTA e flussi di contatto",
        "Riscrittura sezioni con copy più chiaro",
        "Report finale con cosa è cambiato e perché",
      ],
      excludes: [
        "Riscrittura completa da zero (è un altro pacchetto)",
        "Migrazione di e-commerce con migliaia di prodotti",
      ],
      priceLabel: "Da 800 €",
      timeline: "1-2 settimane",
      ctaLabel: "Voglio sistemare il mio sito",
      ctaHref: whatsappLink(
        "it",
        "Ciao Hassan, ho un sito esistente e vorrei migliorarlo. Lo puoi guardare?",
      ),
    },
  ],
  secondaryCta: {
    label: "Non sai quale serve a te? Scrivimi e ne parliamo",
    href: mailtoLink(
      "Confronto pacchetti",
      "Ciao Hassan, non sono sicuro di quale pacchetto faccia al caso mio. Posso descriverti la mia situazione?",
    ),
  },
};

const en: ServicesContent = {
  sectionLabel: "Services & packages",
  title: "Four concrete ways to upgrade your online presence.",
  subtitle:
    "Indicative pricing — after our first call you get a written, fixed quote with no surprises.",
  services: [
    {
      id: "landing",
      name: "Professional Landing Page",
      tagline:
        "A single page built to sell a service or capture leads. Live in one week.",
      forWho:
        "Ideal for professionals, freelancers, and small businesses promoting a specific service, campaign, offer, or new activity.",
      includes: [
        "Custom mobile-first design",
        "Copy structured for conversion",
        "Contact form + WhatsApp button",
        "Basic SEO (title, meta, proper structure)",
        "Optimised mobile performance",
        "Hosting and domain setup together",
      ],
      excludes: [
        "Complex booking logic",
        "Customer area / login",
        "Catalogue-based e-commerce",
      ],
      priceLabel: "From €600",
      timeline: "5-7 business days",
      ctaLabel: "I want a landing page",
      ctaHref: whatsappLink(
        "en",
        "Hi Hassan, I'm interested in a landing page. Can you tell me more?",
      ),
    },
    {
      id: "site",
      name: "Professional Website for businesses and studios",
      tagline:
        "The website that gives your business credibility. Clear, fast, built to get you contacted.",
      forWho:
        "Studios, professionals, and small companies with an old site (or none) who want to look serious online.",
      includes: [
        "Home, About, Services, Contact, FAQ",
        "Consistent, responsive design on any device",
        "Basic technical SEO + correct meta tags",
        "Contact form + WhatsApp + Google Maps",
        "Optimised performance and Core Web Vitals",
        "Hosting/domain setup support",
      ],
      excludes: [
        "Native mobile apps",
        "User login / customer area",
        "Advanced e-commerce",
      ],
      priceLabel: "From €1,500",
      timeline: "2-3 weeks",
      badge: "Most requested",
      ctaLabel: "I want a full website",
      ctaHref: whatsappLink(
        "en",
        "Hi Hassan, I need a professional website for my business. Can we talk?",
      ),
    },
    {
      id: "webapp",
      name: "Custom Web App / MVP",
      tagline:
        "A small web system to move work away from Excel, WhatsApp, or improvised tools.",
      forWho:
        "Founders with a product idea, teams stuck on Excel/WhatsApp, or anyone who needs to move a process online. We start from the first useful version, not the whole castle.",
      includes: [
        "Problem analysis and MVP definition",
        "Customer area / login / dashboard",
        "Data, booking, and content management",
        "REST APIs and third-party integrations",
        "Solid technical base, easy to evolve without rebuilding from scratch",
        "Final documentation and handover",
      ],
      excludes: [
        "Long-term maintenance (separate retainer)",
        "Native iOS/Android (responsive web only)",
      ],
      priceLabel: "From €3,500",
      timeline: "4-8 weeks",
      ctaLabel: "Let's talk about the project",
      ctaHref: whatsappLink(
        "en",
        "Hi Hassan, I have an idea for a web app/MVP and I'd like to figure out how to move forward.",
      ),
    },
    {
      id: "restyle",
      name: "Strategic restyling of an existing website",
      tagline:
        "Your site is old, slow, or no longer represents you? I fix it without starting over.",
      forWho:
        "People who already have a site (even WordPress) but are losing leads to dated design, poor performance, or confused structure.",
      includes: [
        "Full audit: design, UX, performance, basic SEO",
        "UI rebuild on main pages",
        "Speed and mobile experience improvements",
        "New CTAs and contact flows",
        "Section rewrites with clearer copy",
        "Final report on what changed and why",
      ],
      excludes: [
        "Full rebuild from scratch (different package)",
        "Migrating e-commerce with thousands of products",
      ],
      priceLabel: "From €800",
      timeline: "1-2 weeks",
      ctaLabel: "I want to fix my site",
      ctaHref: whatsappLink(
        "en",
        "Hi Hassan, I have an existing site I'd like to improve. Can you take a look?",
      ),
    },
  ],
  secondaryCta: {
    label: "Not sure which one fits? Drop me a line and we'll figure it out",
    href: mailtoLink(
      "Package comparison",
      "Hi Hassan, I'm not sure which package fits my case. Can I describe my situation?",
    ),
  },
};

const fr: ServicesContent = {
  sectionLabel: "Services et forfaits",
  title:
    "Quatre façons concrètes d'améliorer votre présence en ligne.",
  subtitle:
    "Tarifs indicatifs — après le premier échange vous recevez un devis écrit, fixe, sans surprise.",
  services: [
    {
      id: "landing",
      name: "Landing Page Professionnelle",
      tagline:
        "Une page conçue pour vendre un service ou capter des contacts. En ligne en une semaine.",
      forWho:
        "Idéal pour les professionnels, freelances et petites structures qui veulent promouvoir un service précis, une campagne, une offre ou une nouvelle activité.",
      includes: [
        "Design sur mesure, mobile-first",
        "Copy structuré pour la conversion",
        "Formulaire contact + bouton WhatsApp",
        "SEO de base (title, meta, structure correcte)",
        "Performance optimisée sur mobile",
        "Mise en place hébergement et domaine ensemble",
      ],
      excludes: [
        "Logique de réservation complexe",
        "Espace client / login",
        "E-commerce avec catalogue",
      ],
      priceLabel: "À partir de 600 €",
      timeline: "5-7 jours ouvrés",
      ctaLabel: "Je veux une landing",
      ctaHref: whatsappLink(
        "fr",
        "Bonjour Hassan, je suis intéressé(e) par une landing page. Pouvez-vous m'en dire plus ?",
      ),
    },
    {
      id: "site",
      name: "Site professionnel pour activités et cabinets",
      tagline:
        "Le site qui donne de la crédibilité à votre activité. Clair, rapide, fait pour générer des contacts.",
      forWho:
        "Cabinets, professionnels et petites entreprises avec un site daté (ou sans site) qui veulent paraître sérieux en ligne.",
      includes: [
        "Accueil, À propos, Services, Contact, FAQ",
        "Design cohérent et responsive sur tout appareil",
        "SEO technique de base + meta tags corrects",
        "Formulaire contact + WhatsApp + Google Maps",
        "Performance optimisée et Core Web Vitals",
        "Accompagnement hébergement/domaine",
      ],
      excludes: [
        "Apps mobiles natives",
        "Espace client / login utilisateur",
        "E-commerce avancé",
      ],
      priceLabel: "À partir de 1 500 €",
      timeline: "2-3 semaines",
      badge: "Le plus demandé",
      ctaLabel: "Je veux un site complet",
      ctaHref: whatsappLink(
        "fr",
        "Bonjour Hassan, j'ai besoin d'un site professionnel pour mon activité. On peut en parler ?",
      ),
    },
    {
      id: "webapp",
      name: "Web App / MVP sur mesure",
      tagline:
        "Un petit système web pour sortir des processus d'Excel, WhatsApp ou d'outils improvisés.",
      forWho:
        "Founders avec une idée de produit, équipes coincées sur Excel/WhatsApp, ou toute personne qui doit digitaliser un processus. On part de la première version utile, pas d'une plateforme énorme.",
      includes: [
        "Analyse du problème et définition du MVP",
        "Espace client / login / tableau de bord",
        "Gestion données, réservations, contenus",
        "API REST et intégrations tierces",
        "Base technique solide, facile à faire évoluer sans tout reconstruire",
        "Documentation finale et passation",
      ],
      excludes: [
        "Maintenance long terme (contrat séparé)",
        "Apps iOS/Android natives (web responsive uniquement)",
      ],
      priceLabel: "À partir de 3 500 €",
      timeline: "4-8 semaines",
      ctaLabel: "Parlons du projet",
      ctaHref: whatsappLink(
        "fr",
        "Bonjour Hassan, j'ai une idée de web app/MVP et j'aimerais comprendre comment avancer.",
      ),
    },
    {
      id: "restyle",
      name: "Refonte stratégique du site existant",
      tagline:
        "Votre site est daté, lent, ne vous représente plus ? Je le remets en forme sans repartir de zéro.",
      forWho:
        "Vous avez déjà un site (même WordPress) mais perdez des contacts à cause d'un design dépassé, de performances faibles ou d'une structure confuse.",
      includes: [
        "Audit complet : design, UX, performance, SEO de base",
        "Refonte UI des pages principales",
        "Amélioration vitesse et expérience mobile",
        "Nouveaux CTA et parcours de contact",
        "Réécriture des sections avec un copy plus clair",
        "Rapport final sur ce qui a changé et pourquoi",
      ],
      excludes: [
        "Réécriture complète depuis zéro (autre forfait)",
        "Migration e-commerce avec des milliers de produits",
      ],
      priceLabel: "À partir de 800 €",
      timeline: "1-2 semaines",
      ctaLabel: "Je veux remettre mon site à jour",
      ctaHref: whatsappLink(
        "fr",
        "Bonjour Hassan, j'ai un site existant que j'aimerais améliorer. Vous pouvez y jeter un œil ?",
      ),
    },
  ],
  secondaryCta: {
    label: "Pas sûr du bon choix ? Écrivez-moi, on en parle",
    href: mailtoLink(
      "Comparaison des forfaits",
      "Bonjour Hassan, je ne suis pas sûr(e) du forfait qui me correspond. Je peux décrire ma situation ?",
    ),
  },
};

export const servicesContent: Record<Locale, ServicesContent> = { it, en, fr };

export function getServicesContent(locale: Locale) {
  return servicesContent[locale];
}
