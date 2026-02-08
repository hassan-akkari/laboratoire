import type { Locale } from "./locale";

export type Messages = {
  nav: {
    home: string;
    about: string;
    highlights: string;
    projects: string;
    contact: string;
    cv: string;
    downloadCv: string;
  };
  locale: {
    label: string;
    en: string;
    it: string;
    fr: string;
  };
  header: {
    greetingPrefix: string;
    headlineSuffix: string;
    quickProfile: string;
    viewProjects: string;
    emailMe: string;
  };
  about: {
    title: string;
    now: string;
    philosophy: string;
    techStack: string;
    experience: string;
    education: string;
    general: string;
    daily: string;
    comfortable: string;
    exploring: string;
  };
  highlights: {
    title: string;
    subtitle: string;
  };
  portfolio: {
    title: string;
    subtitle: string;
    requestCaseStudy: string;
  };
  contact: {
    title: string;
    note: string;
    emailMe: string;
    github: string;
    linkedin: string;
    bookCall: string;
    downloadCv: string;
  };
  cv: {
    title: string;
    subtitle: string;
    backToSite: string;
    print: string;
    downloadOriginal: string;
    summary: string;
    impact: string;
    stack: string;
    experience: string;
    education: string;
    general: string;
    contact: string;
  };
  system: {
    githubUnavailable: string;
    fallbackData: string;
    refreshing: string;
  };
};

export const messages: Record<Locale, Messages> = {
  en: {
    nav: {
      home: "Home",
      about: "About me",
      highlights: "Highlights",
      projects: "Featured projects",
      contact: "Contact",
      cv: "CV",
      downloadCv: "Download CV",
    },
    locale: {
      label: "Language",
      en: "English",
      it: "Italiano",
      fr: "Francais",
    },
    header: {
      greetingPrefix: "Hi, I'm",
      headlineSuffix: "I build connected web products",
      quickProfile: "Quick profile",
      viewProjects: "View projects",
      emailMe: "Email me",
    },
    about: {
      title: "About me",
      now: "Now",
      philosophy: "Tech philosophy",
      techStack: "Tech Stack",
      experience: "Experience",
      education: "Education",
      general: "General",
      daily: "Daily",
      comfortable: "Comfortable",
      exploring: "Exploring",
    },
    highlights: {
      title: "Impact highlights",
      subtitle:
        "Concrete ways I help teams ship faster and keep code quality stable.",
    },
    portfolio: {
      title: "Featured projects",
      subtitle: "Selected work with stack details and impact-oriented outcomes.",
      requestCaseStudy: "Request full case study",
    },
    contact: {
      title: "Contact me",
      note: "Phone number shared by email request.",
      emailMe: "Email me",
      github: "GitHub",
      linkedin: "LinkedIn",
      bookCall: "Book a call",
      downloadCv: "Open CV page",
    },
    cv: {
      title: "Curriculum Vitae",
      subtitle:
        "Localized profile view with print-ready layout and quick export options.",
      backToSite: "Back to portfolio",
      print: "Print",
      downloadOriginal: "Download original PDF",
      summary: "Professional summary",
      impact: "Impact highlights",
      stack: "Tech stack",
      experience: "Experience",
      education: "Education",
      general: "Additional information",
      contact: "Contact",
    },
    system: {
      githubUnavailable:
        "GitHub stats unavailable right now. Showing local profile data.",
      fallbackData:
        "Remote profile data unavailable. Fallback data is active.",
      refreshing: "Refreshing profile data...",
    },
  },
  it: {
    nav: {
      home: "Home",
      about: "Chi sono",
      highlights: "Risultati",
      projects: "Progetti in evidenza",
      contact: "Contatti",
      cv: "CV",
      downloadCv: "Scarica CV",
    },
    locale: {
      label: "Lingua",
      en: "English",
      it: "Italiano",
      fr: "Francais",
    },
    header: {
      greetingPrefix: "Ciao, sono",
      headlineSuffix: "Sviluppo prodotti web connessi e scalabili",
      quickProfile: "Profilo rapido",
      viewProjects: "Vedi progetti",
      emailMe: "Scrivimi",
    },
    about: {
      title: "Chi sono",
      now: "Adesso",
      philosophy: "Filosofia tecnica",
      techStack: "Stack tecnico",
      experience: "Esperienza",
      education: "Formazione",
      general: "Generale",
      daily: "Quotidiano",
      comfortable: "Confortevole",
      exploring: "In esplorazione",
    },
    highlights: {
      title: "Impatto",
      subtitle:
        "Risultati concreti con cui aiuto i team a consegnare piu velocemente e con qualita stabile.",
    },
    portfolio: {
      title: "Progetti in evidenza",
      subtitle: "Selezione di lavori con stack e risultati misurabili.",
      requestCaseStudy: "Richiedi case study completo",
    },
    contact: {
      title: "Contattami",
      note: "Numero di telefono condiviso su richiesta via email.",
      emailMe: "Scrivimi",
      github: "GitHub",
      linkedin: "LinkedIn",
      bookCall: "Prenota call",
      downloadCv: "Apri pagina CV",
    },
    cv: {
      title: "Curriculum Vitae",
      subtitle:
        "Vista profilo localizzata, pronta per la stampa e con opzioni rapide di esportazione.",
      backToSite: "Torna al portfolio",
      print: "Stampa",
      downloadOriginal: "Scarica PDF originale",
      summary: "Profilo professionale",
      impact: "Risultati",
      stack: "Stack tecnico",
      experience: "Esperienza",
      education: "Formazione",
      general: "Informazioni aggiuntive",
      contact: "Contatti",
    },
    system: {
      githubUnavailable:
        "Statistiche GitHub non disponibili ora. Mostro i dati locali del profilo.",
      fallbackData:
        "Dati profilo remoti non disponibili. Uso i dati di fallback.",
      refreshing: "Aggiornamento dati profilo...",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      about: "A propos",
      highlights: "Impact",
      projects: "Projets a la une",
      contact: "Contact",
      cv: "CV",
      downloadCv: "Telecharger CV",
    },
    locale: {
      label: "Langue",
      en: "English",
      it: "Italiano",
      fr: "Francais",
    },
    header: {
      greetingPrefix: "Bonjour, je suis",
      headlineSuffix: "Je construis des produits web connectes",
      quickProfile: "Profil rapide",
      viewProjects: "Voir projets",
      emailMe: "Ecrivez-moi",
    },
    about: {
      title: "A propos",
      now: "Actuellement",
      philosophy: "Philosophie technique",
      techStack: "Stack technique",
      experience: "Experience",
      education: "Formation",
      general: "General",
      daily: "Quotidien",
      comfortable: "A l'aise",
      exploring: "Exploration",
    },
    highlights: {
      title: "Points d'impact",
      subtitle:
        "Actions concretes qui aident les equipes a livrer plus vite avec une qualite stable.",
    },
    portfolio: {
      title: "Projets a la une",
      subtitle:
        "Selection de travaux avec details techniques et resultats orientes impact.",
      requestCaseStudy: "Demander l'etude de cas complete",
    },
    contact: {
      title: "Contactez-moi",
      note: "Numero partage sur demande par email.",
      emailMe: "Ecrivez-moi",
      github: "GitHub",
      linkedin: "LinkedIn",
      bookCall: "Reserver un appel",
      downloadCv: "Ouvrir page CV",
    },
    cv: {
      title: "Curriculum Vitae",
      subtitle:
        "Vue profile localisee, optimisee pour l'impression et l'export rapide.",
      backToSite: "Retour portfolio",
      print: "Imprimer",
      downloadOriginal: "Telecharger PDF original",
      summary: "Resume professionnel",
      impact: "Impact",
      stack: "Stack technique",
      experience: "Experience",
      education: "Formation",
      general: "Informations supplementaires",
      contact: "Contact",
    },
    system: {
      githubUnavailable:
        "Statistiques GitHub indisponibles. Affichage des donnees locales.",
      fallbackData:
        "Donnees distantes indisponibles. Utilisation des donnees de secours.",
      refreshing: "Actualisation des donnees profil...",
    },
  },
};
