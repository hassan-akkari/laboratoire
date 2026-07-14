import type { Locale } from "./locale";

export type Messages = {
  nav: {
    home: string;
    about: string;
    highlights: string;
    projects: string;
    roadmap: string;
    contact: string;
    cv: string;
    downloadCv: string;
  };
  locale: {
    label: string;
    en: string;
    it: string;
    fr: string;
    de: string;
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
    howIWork: string;
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
  roadmap: {
    title: string;
    subtitle: string;
    recruiterSignals: string;
    mvpScope: string;
    targetApp: string;
    cta: string;
  };
  contact: {
    title: string;
    note: string;
    emailMe: string;
    github: string;
    linkedin: string;
    bookCall: string;
    downloadCv: string;
    formName: string;
    formEmail: string;
    formMessage: string;
    formSubmit: string;
    formSubmitting: string;
    formSuccess: string;
    formError: string;
    formErrorNameShort: string;
    formErrorEmailInvalid: string;
    formErrorMessageShort: string;
    formErrorPrivacyRequired: string;
    privacyLabel: string;
    privacyLink: string;
  };
  cv: {
    title: string;
    subtitle: string;
    backToSite: string;
    print: string;
    downloadOriginal: string;
    summary: string;
    impact: string;
    projects: string;
    stack: string;
    experience: string;
    education: string;
    general: string;
    contact: string;
    readMore: string;
    showLess: string;
  };
  privacy: {
    title: string;
    intro: string;
    sections: { heading: string; body: string }[];
    backToSite: string;
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
      roadmap: "Next builds",
      contact: "Contact",
      cv: "CV",
      downloadCv: "Download CV",
    },
    locale: {
      label: "Language",
      en: "English",
      it: "Italiano",
      fr: "Français",
      de: "Deutsch",
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
      howIWork: "How I work",
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
      requestCaseStudy: "Ask for additional details",
    },
    roadmap: {
      title: "Next builds",
      subtitle:
        "Two mini side projects I build in my spare time to experiment beyond the static portfolio.",
      recruiterSignals: "What I am exploring",
      mvpScope: "MVP scope",
      targetApp: "Target app",
      cta: "If you want, I can share what I am building now",
    },
    contact: {
      title: "Contact me",
      note: "Phone number shared by email request.",
      emailMe: "Email me",
      github: "GitHub",
      linkedin: "LinkedIn",
      bookCall: "Book a call",
      downloadCv: "Open CV page",
      formName: "Your name",
      formEmail: "Your email",
      formMessage: "Your message",
      formSubmit: "Send",
      formSubmitting: "Sending...",
      formSuccess: "Thanks! I will get back to you.",
      formError: "Could not send the message. Please retry in a moment.",
      formErrorNameShort: "Please use at least 2 characters.",
      formErrorEmailInvalid: "That email doesn't look right.",
      formErrorMessageShort: "Please write at least 10 characters.",
      formErrorPrivacyRequired: "Please accept the privacy notice to continue.",
      privacyLabel: "I have read and accept the",
      privacyLink: "privacy notice",
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
      projects: "Selected projects",
      stack: "Tech stack",
      experience: "Experience",
      education: "Education",
      general: "Additional information",
      contact: "Contact",
      readMore: "Read more",
      showLess: "Show less",
    },
    privacy: {
      title: "Privacy notice",
      intro:
        "When you use the contact form on itshassan.it I receive your name, email, and message. I use that data only to reply to you.",
      sections: [
        {
          heading: "What I collect",
          body:
            "Name, email address, the message you write, and the timestamp of the submission. I also automatically receive a request origin (for spam protection) — nothing else.",
        },
        {
          heading: "Why I collect it",
          body:
            "To answer your message. The legal basis is your consent (checkbox on the form). You can withdraw at any time by emailing me.",
        },
        {
          heading: "Where it lives",
          body:
            "Inside a private Neon Postgres database in the Frankfurt region (EU). Email notifications are sent via Resend. I do not share your data with anyone else and do not run ads or trackers.",
        },
        {
          heading: "How long",
          body:
            "Up to 24 months, then deleted. You can ask me to delete sooner — write to the same address you used to contact me.",
        },
        {
          heading: "Your rights",
          body:
            "Access, correction, deletion, portability, and the right to lodge a complaint with the supervisory authority. Email me to exercise them.",
        },
      ],
      backToSite: "Back to portfolio",
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
      roadmap: "Prossimi build",
      contact: "Contatti",
      cv: "CV",
      downloadCv: "Scarica CV",
    },
    locale: {
      label: "Lingua",
      en: "English",
      it: "Italiano",
      fr: "Français",
      de: "Deutsch",
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
      howIWork: "Come lavoro",
      techStack: "Stack tecnico",
      experience: "Esperienza",
      education: "Formazione",
      general: "Generale",
      daily: "Quotidiano",
      comfortable: "Consolidato",
      exploring: "In esplorazione",
    },
    highlights: {
      title: "Impatto",
      subtitle:
        "Risultati concreti con cui aiuto i team a consegnare più velocemente e con qualità stabile.",
    },
    portfolio: {
      title: "Progetti in evidenza",
      subtitle: "Selezione di lavori con stack e risultati misurabili.",
      requestCaseStudy: "Per maggiori dettagli scrivimi",
    },
    roadmap: {
      title: "Prossimi build",
      subtitle:
        "Due mini progetti personali che porto avanti nel tempo libero, per sperimentare oltre il portfolio statico.",
      recruiterSignals: "Cosa sto sperimentando",
      mvpScope: "Scope MVP",
      targetApp: "App target",
      cta: "Se ti va, ti racconto cosa sto buildando ora",
    },
    contact: {
      title: "Contattami",
      note: "Numero di telefono condiviso su richiesta via email.",
      emailMe: "Scrivimi",
      github: "GitHub",
      linkedin: "LinkedIn",
      bookCall: "Prenota call",
      downloadCv: "Apri pagina CV",
      formName: "Nome",
      formEmail: "Email",
      formMessage: "Messaggio",
      formSubmit: "Invia",
      formSubmitting: "Invio in corso...",
      formSuccess: "Grazie! Ti rispondo presto.",
      formError: "Invio non riuscito. Riprova tra un momento.",
      formErrorNameShort: "Inserisci almeno 2 caratteri.",
      formErrorEmailInvalid: "L'email non sembra valida.",
      formErrorMessageShort: "Scrivi almeno 10 caratteri.",
      formErrorPrivacyRequired: "Accetta l'informativa privacy per continuare.",
      privacyLabel: "Ho letto e accetto l'",
      privacyLink: "informativa privacy",
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
      projects: "Progetti selezionati",
      stack: "Stack tecnico",
      experience: "Esperienza",
      education: "Formazione",
      general: "Informazioni aggiuntive",
      contact: "Contatti",
      readMore: "Leggi tutto",
      showLess: "Mostra meno",
    },
    privacy: {
      title: "Informativa privacy",
      intro:
        "Quando usi il modulo di contatto su itshassan.it ricevo nome, email e messaggio. Uso questi dati solo per risponderti.",
      sections: [
        {
          heading: "Cosa raccolgo",
          body:
            "Nome, email, il messaggio che scrivi e il timestamp dell'invio. Ricevo anche l'origine della richiesta (per la protezione anti-spam) — nient'altro.",
        },
        {
          heading: "Perché lo raccolgo",
          body:
            "Per rispondere al tuo messaggio. La base legale è il tuo consenso (checkbox sul modulo). Puoi revocarlo in qualsiasi momento scrivendomi.",
        },
        {
          heading: "Dove sono i dati",
          body:
            "In un database privato Neon Postgres nella regione di Francoforte (UE). Le notifiche email passano da Resend. Non condivido i tuoi dati con nessuno e non uso pubblicità o tracker.",
        },
        {
          heading: "Per quanto tempo",
          body:
            "Fino a 24 mesi, poi cancello. Puoi chiedermi di cancellare prima — scrivimi all'indirizzo che hai usato per contattarmi.",
        },
        {
          heading: "I tuoi diritti",
          body:
            "Accesso, rettifica, cancellazione, portabilità e diritto di reclamo all'autorità di controllo. Scrivimi per esercitarli.",
        },
      ],
      backToSite: "Torna al portfolio",
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
      about: "À propos",
      highlights: "Impact",
      projects: "Projets à la une",
      roadmap: "Prochains builds",
      contact: "Contact",
      cv: "CV",
      downloadCv: "Télécharger CV",
    },
    locale: {
      label: "Langue",
      en: "English",
      it: "Italiano",
      fr: "Français",
      de: "Deutsch",
    },
    header: {
      greetingPrefix: "Bonjour, je suis",
      headlineSuffix: "Je construis des produits web connectés",
      quickProfile: "Profil rapide",
      viewProjects: "Voir projets",
      emailMe: "Écrivez-moi",
    },
    about: {
      title: "À propos",
      now: "Actuellement",
      philosophy: "Philosophie technique",
      howIWork: "Comment je travaille",
      techStack: "Stack technique",
      experience: "Expérience",
      education: "Formation",
      general: "Général",
      daily: "Quotidien",
      comfortable: "À l'aise",
      exploring: "Exploration",
    },
    highlights: {
      title: "Points d'impact",
      subtitle:
        "Actions concrètes qui aident les équipes à livrer plus vite avec une qualité stable.",
    },
    portfolio: {
      title: "Projets à la une",
      subtitle:
        "Sélection de travaux avec détails techniques et résultats orientés impact.",
      requestCaseStudy: "Demander plus de détails",
    },
    roadmap: {
      title: "Prochains builds",
      subtitle:
        "Deux mini projets perso que je fais sur mon temps libre pour expérimenter au-delà du portfolio statique.",
      recruiterSignals: "Ce que j'explore",
      mvpScope: "Scope MVP",
      targetApp: "App cible",
      cta: "Si vous voulez, je peux partager ce que je build en ce moment",
    },
    contact: {
      title: "Contactez-moi",
      note: "Numéro partagé sur demande par email.",
      emailMe: "Écrivez-moi",
      github: "GitHub",
      linkedin: "LinkedIn",
      bookCall: "Réserver un appel",
      downloadCv: "Ouvrir page CV",
      formName: "Votre nom",
      formEmail: "Votre email",
      formMessage: "Votre message",
      formSubmit: "Envoyer",
      formSubmitting: "Envoi en cours...",
      formSuccess: "Merci! Je vous réponds rapidement.",
      formError: "Envoi impossible. Veuillez réessayer dans un instant.",
      formErrorNameShort: "Saisissez au moins 2 caractères.",
      formErrorEmailInvalid: "Cet email n'a pas l'air valide.",
      formErrorMessageShort: "Écrivez au moins 10 caractères.",
      formErrorPrivacyRequired: "Acceptez la politique de confidentialité pour continuer.",
      privacyLabel: "J'ai lu et j'accepte la",
      privacyLink: "politique de confidentialité",
    },
    cv: {
      title: "Curriculum Vitae",
      subtitle:
        "Vue profil localisée, optimisée pour l'impression et l'export rapide.",
      backToSite: "Retour portfolio",
      print: "Imprimer",
      downloadOriginal: "Télécharger PDF original",
      summary: "Résumé professionnel",
      impact: "Impact",
      projects: "Projets sélectionnés",
      stack: "Stack technique",
      experience: "Expérience",
      education: "Formation",
      general: "Informations supplémentaires",
      contact: "Contact",
      readMore: "Lire la suite",
      showLess: "Réduire",
    },
    privacy: {
      title: "Politique de confidentialité",
      intro:
        "Lorsque vous utilisez le formulaire de contact sur itshassan.it, je reçois votre nom, email et message. J'utilise ces données uniquement pour vous répondre.",
      sections: [
        {
          heading: "Ce que je collecte",
          body:
            "Nom, email, le message que vous écrivez et la date d'envoi. Je reçois aussi l'origine de la requête (protection anti-spam) — rien d'autre.",
        },
        {
          heading: "Pourquoi je collecte",
          body:
            "Pour répondre à votre message. La base légale est votre consentement (case à cocher du formulaire). Vous pouvez le retirer à tout moment en m'écrivant.",
        },
        {
          heading: "Où sont les données",
          body:
            "Dans une base Neon Postgres privée dans la région de Francfort (UE). Les notifications email passent par Resend. Je ne partage pas vos données et n'utilise ni publicité ni tracker.",
        },
        {
          heading: "Pendant combien de temps",
          body:
            "Jusqu'à 24 mois, puis suppression. Vous pouvez demander une suppression plus tôt — écrivez-moi à l'adresse que vous avez utilisée.",
        },
        {
          heading: "Vos droits",
          body:
            "Accès, rectification, suppression, portabilité et droit de réclamation auprès de l'autorité de contrôle. Écrivez-moi pour les exercer.",
        },
      ],
      backToSite: "Retour au portfolio",
    },
    system: {
      githubUnavailable:
        "Statistiques GitHub indisponibles. Affichage des données locales.",
      fallbackData:
        "Données distantes indisponibles. Utilisation des données de secours.",
      refreshing: "Actualisation des données profil...",
    },
  },
  de: {
    nav: {
      home: "Home",
      about: "Über mich",
      highlights: "Ergebnisse",
      projects: "Ausgewählte Projekte",
      roadmap: "Nächste Builds",
      contact: "Kontakt",
      cv: "CV",
      downloadCv: "CV herunterladen",
    },
    locale: {
      label: "Sprache",
      en: "English",
      it: "Italiano",
      fr: "Français",
      de: "Deutsch",
    },
    header: {
      greetingPrefix: "Hallo, ich bin",
      headlineSuffix: "Ich baue vernetzte Web-Produkte",
      quickProfile: "Kurzprofil",
      viewProjects: "Projekte ansehen",
      emailMe: "Schreiben Sie mir",
    },
    about: {
      title: "Über mich",
      now: "Aktuell",
      philosophy: "Technische Philosophie",
      howIWork: "Arbeitsweise",
      techStack: "Tech-Stack",
      experience: "Erfahrung",
      education: "Ausbildung",
      general: "Allgemein",
      daily: "Täglich",
      comfortable: "Sicher",
      exploring: "Am Erkunden",
    },
    highlights: {
      title: "Wirkung",
      subtitle:
        "Konkrete Ergebnisse, mit denen ich Teams helfe, schneller zu liefern und die Codequalität stabil zu halten.",
    },
    portfolio: {
      title: "Ausgewählte Projekte",
      subtitle:
        "Ausgewählte Arbeiten mit Stack-Details und wirkungsorientierten Ergebnissen.",
      requestCaseStudy: "Weitere Details anfragen",
    },
    roadmap: {
      title: "Nächste Builds",
      subtitle:
        "Zwei kleine Nebenprojekte, die ich in meiner Freizeit baue, um über das statische Portfolio hinaus zu experimentieren.",
      recruiterSignals: "Was ich gerade erkunde",
      mvpScope: "MVP-Umfang",
      targetApp: "Ziel-App",
      cta: "Wenn Sie möchten, zeige ich Ihnen, woran ich gerade baue",
    },
    contact: {
      title: "Kontakt",
      note: "Telefonnummer auf Anfrage per E-Mail.",
      emailMe: "Schreiben Sie mir",
      github: "GitHub",
      linkedin: "LinkedIn",
      bookCall: "Gespräch buchen",
      downloadCv: "CV-Seite öffnen",
      formName: "Ihr Name",
      formEmail: "Ihre E-Mail",
      formMessage: "Ihre Nachricht",
      formSubmit: "Senden",
      formSubmitting: "Wird gesendet...",
      formSuccess: "Danke! Ich melde mich bei Ihnen.",
      formError:
        "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es gleich noch einmal.",
      formErrorNameShort: "Bitte mindestens 2 Zeichen verwenden.",
      formErrorEmailInvalid: "Diese E-Mail-Adresse sieht nicht korrekt aus.",
      formErrorMessageShort: "Bitte mindestens 10 Zeichen schreiben.",
      formErrorPrivacyRequired:
        "Bitte akzeptieren Sie die Datenschutzerklärung, um fortzufahren.",
      privacyLabel: "Ich habe die",
      privacyLink: "Datenschutzerklärung gelesen und akzeptiere sie",
    },
    cv: {
      title: "Curriculum Vitae",
      subtitle:
        "Lokalisierte Profilansicht mit druckfertigem Layout und schnellen Export-Optionen.",
      backToSite: "Zurück zum Portfolio",
      print: "Drucken",
      downloadOriginal: "Original-PDF herunterladen",
      summary: "Profil",
      impact: "Ergebnisse",
      projects: "Ausgewählte Projekte",
      stack: "Tech-Stack",
      experience: "Erfahrung",
      education: "Ausbildung",
      general: "Weitere Informationen",
      contact: "Kontakt",
      readMore: "Mehr anzeigen",
      showLess: "Weniger anzeigen",
    },
    privacy: {
      title: "Datenschutzerklärung",
      intro:
        "Wenn Sie das Kontaktformular auf itshassan.it verwenden, erhalte ich Ihren Namen, Ihre E-Mail-Adresse und Ihre Nachricht. Ich verwende diese Daten ausschliesslich, um Ihnen zu antworten.",
      sections: [
        {
          heading: "Was ich erhebe",
          body:
            "Name, E-Mail-Adresse, Ihre Nachricht und der Zeitstempel des Absendens. Automatisch erhalte ich zudem die Herkunft der Anfrage (Spam-Schutz) — sonst nichts.",
        },
        {
          heading: "Warum ich es erhebe",
          body:
            "Um Ihre Nachricht zu beantworten. Rechtsgrundlage ist Ihre Einwilligung (Checkbox im Formular). Sie können sie jederzeit per E-Mail widerrufen.",
        },
        {
          heading: "Wo die Daten liegen",
          body:
            "In einer privaten Neon-Postgres-Datenbank in der Region Frankfurt (EU). E-Mail-Benachrichtigungen laufen über Resend. Ich gebe Ihre Daten an niemanden weiter und verwende weder Werbung noch Tracker.",
        },
        {
          heading: "Wie lange",
          body:
            "Bis zu 24 Monate, danach werden sie gelöscht. Sie können jederzeit eine frühere Löschung verlangen — schreiben Sie mir an dieselbe Adresse, die Sie für die Kontaktaufnahme verwendet haben.",
        },
        {
          heading: "Ihre Rechte",
          body:
            "Auskunft, Berichtigung, Löschung, Datenübertragbarkeit und das Recht auf Beschwerde bei der Aufsichtsbehörde. Schreiben Sie mir, um sie auszuüben.",
        },
      ],
      backToSite: "Zurück zum Portfolio",
    },
    system: {
      githubUnavailable:
        "GitHub-Statistiken derzeit nicht verfügbar. Es werden lokale Profildaten angezeigt.",
      fallbackData:
        "Externe Profildaten nicht verfügbar. Fallback-Daten sind aktiv.",
      refreshing: "Profildaten werden aktualisiert...",
    },
  },
};
