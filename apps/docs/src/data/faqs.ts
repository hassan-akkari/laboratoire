import type { Locale } from "../i18n/locale";

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type FaqsContent = {
  sectionLabel: string;
  title: string;
  outro: {
    prefix: string;
    linkLabel: string;
    suffix: string;
  };
  whatsappMessage: string;
  faqs: Faq[];
};

const it: FaqsContent = {
  sectionLabel: "Domande frequenti",
  title: "Le cose che mi chiedono prima di iniziare. Risposte dirette.",
  outro: {
    prefix: "Hai un'altra domanda? ",
    linkLabel: "Scrivimi su WhatsApp",
    suffix: ", rispondo entro 24 ore lavorative.",
  },
  whatsappMessage:
    "Ciao Hassan, ho una domanda sul tuo lavoro prima di partire con un progetto.",
  faqs: [
    {
      id: "wordpress",
      question:
        "Perché non WordPress? Mi avevano detto che costa meno e va bene uguale.",
      answer:
        "WordPress va benissimo per blog e siti molto semplici. Io lo evito quando il progetto richiede più controllo su performance, design, sicurezza o flussi personalizzati. In quei casi preferisco costruire una soluzione più leggera, veloce e tua al 100%.",
    },
    {
      id: "price",
      question: "Quanto costa davvero un sito?",
      answer:
        "Dipende dal tipo. Una landing parte da 600 €, un sito completo da 1.500 €, una web app/MVP da 3.500 €. Sono prezzi indicativi: dopo la prima call ti faccio un preventivo scritto, fisso, senza sorprese.",
    },
    {
      id: "timeline",
      question: "In quanto tempo è online?",
      answer:
        "Una landing in 5-7 giorni. Un sito completo in 2-3 settimane. Una web app/MVP in 4-8 settimane. I tempi partono da quando ho i contenuti (testi, foto, logo). Se non li hai ancora, ne parliamo insieme.",
    },
    {
      id: "content",
      question: "I testi e le foto chi li mette?",
      answer:
        "Possiamo fare a metà strada. Se hai già i testi, li sistemo io insieme a te. Se non li hai, ti faccio una traccia di domande a cui rispondi in chat o in voice, e li riscrivo io. Foto: o le hai tu, o ti consiglio dove prenderle (Unsplash, Pexels) o un fotografo locale.",
    },
    {
      id: "what-after",
      question: "E dopo che il sito è online, mi lasci da solo?",
      answer:
        "No. Resto reperibile su WhatsApp/email per piccoli fix e dubbi. Se vuoi un'evolutiva (sezione nuova, blog, integrazione) ti faccio un preventivo separato.",
    },
    {
      id: "host",
      question: "L'hosting e il dominio sono inclusi?",
      answer:
        "Il dominio (~15 €/anno) e l'hosting (spesso 0 € su Vercel per siti vetrina) li paghi tu, sui tuoi account, così resti sempre proprietario. Io li configuro insieme a te durante il setup.",
    },
    {
      id: "seo",
      question: "Mi farai trovare su Google?",
      answer:
        "Faccio SEO tecnica base inclusa: title corretti, meta description, struttura semantica, performance, sitemap, mobile-first. Per posizionarti su query competitive serve lavoro continuativo (contenuti, backlink): se ti serve, ti dico chiaramente cosa fare e quanto costa, anche se non lo faccio io.",
    },
    {
      id: "remote",
      question: "Lavori solo a Roma o anche fuori?",
      answer:
        "Sono a Roma, ma lavoro 100% online con tutta Italia (e all'estero). Call su Meet/WhatsApp, condivisione anteprime via link, scambio file via Drive/Notion. Se sei a Roma e vuoi vederci di persona, si può fare.",
    },
    {
      id: "guarantee",
      question: "E se non sono soddisfatto del risultato?",
      answer:
        "Lavoriamo per step con anteprime continue: se qualcosa non ti convince lo dici subito, non a fine progetto. Sui pacchetti landing/sito sono incluse 2 revisioni di design e 1 di copy. Sulle web app definiamo insieme i milestone, e ognuno è approvato prima di passare al successivo.",
    },
  ],
};

const en: FaqsContent = {
  sectionLabel: "Frequently asked questions",
  title: "The things people ask me before starting. Direct answers.",
  outro: {
    prefix: "Got another question? ",
    linkLabel: "Message me on WhatsApp",
    suffix: ", I reply within 24 business hours.",
  },
  whatsappMessage:
    "Hi Hassan, I have a question about how you work before kicking off a project.",
  faqs: [
    {
      id: "wordpress",
      question:
        "Why not WordPress? People told me it's cheaper and just as good.",
      answer:
        "WordPress is perfectly fine for blogs and very simple sites. I avoid it when a project needs more control over performance, design, security, or custom flows. In those cases I prefer building a lighter, faster solution that stays 100% yours.",
    },
    {
      id: "price",
      question: "How much does a site really cost?",
      answer:
        "Depends on the type. A landing page starts at €600, a full site at €1,500, a web app/MVP at €3,500. These are indicative — after our first call I send you a written, fixed quote with no surprises.",
    },
    {
      id: "timeline",
      question: "How long until it's live?",
      answer:
        "A landing in 5-7 days. A full site in 2-3 weeks. A web app/MVP in 4-8 weeks. Timelines start when I have the content (copy, photos, logo). If you don't have them yet, we figure it out together.",
    },
    {
      id: "content",
      question: "Who provides the copy and photos?",
      answer:
        "We meet halfway. If you have the copy, I tidy it up with you. If you don't, I send you a list of questions you answer by text or voice, and I write it for you. Photos: yours, or I recommend where to grab them (Unsplash, Pexels) or a local photographer.",
    },
    {
      id: "what-after",
      question: "After the site is live, do you leave me alone?",
      answer:
        "No. I stay reachable on WhatsApp/email for small fixes and questions. If you want an evolution (new section, blog, integration), I send you a separate quote.",
    },
    {
      id: "host",
      question: "Are hosting and domain included?",
      answer:
        "Domain (~€15/year) and hosting (often €0 on Vercel for brochure sites) are paid by you, on your accounts — so you always stay the owner. I help you set them up.",
    },
    {
      id: "seo",
      question: "Will you get me ranked on Google?",
      answer:
        "Basic technical SEO is included: correct titles, meta descriptions, semantic structure, performance, sitemap, mobile-first. To rank on competitive queries you need ongoing work (content, backlinks): if you need it, I'll tell you clearly what it takes and what it costs — even if I'm not the one doing it.",
    },
    {
      id: "remote",
      question: "Do you only work in Rome?",
      answer:
        "I'm based in Rome but I work 100% online with clients across Italy (and abroad). Calls on Meet/WhatsApp, preview links, file sharing via Drive/Notion. If you're in Rome and want to meet in person, we can.",
    },
    {
      id: "guarantee",
      question: "What if I'm not happy with the result?",
      answer:
        "We work step by step with continuous previews: if something doesn't convince you, you tell me right away — not at the end. Landing/site packages include 2 design revisions and 1 copy revision. For web apps we agree on milestones, each approved before moving forward.",
    },
  ],
};

const fr: FaqsContent = {
  sectionLabel: "Questions fréquentes",
  title:
    "Ce qu'on me demande avant de démarrer. Réponses directes.",
  outro: {
    prefix: "Une autre question ? ",
    linkLabel: "Écrivez-moi sur WhatsApp",
    suffix: ", je réponds sous 24h.",
  },
  whatsappMessage:
    "Bonjour Hassan, j'ai une question sur votre façon de travailler avant de démarrer un projet.",
  faqs: [
    {
      id: "wordpress",
      question:
        "Pourquoi pas WordPress ? On m'a dit que c'est moins cher et que ça suffit.",
      answer:
        "WordPress convient très bien pour un blog ou un site vitrine très simple. Mais dès que c'est un peu personnalisé, vous finissez par payer 4-5 plugins payants par an, des performances mobiles médiocres, et un dev à l'heure à chaque changement. Mes sites sont plus rapides, plus sûrs, et restent 100% à vous.",
    },
    {
      id: "price",
      question: "Combien coûte vraiment un site ?",
      answer:
        "Ça dépend du type. Une landing à partir de 600 €, un site complet à partir de 1 500 €, une web app/MVP à partir de 3 500 €. Ce sont des prix indicatifs : après le premier appel je vous envoie un devis écrit, fixe, sans surprises.",
    },
    {
      id: "timeline",
      question: "En combien de temps le site est en ligne ?",
      answer:
        "Une landing en 5-7 jours. Un site complet en 2-3 semaines. Une web app/MVP en 4-8 semaines. Les délais démarrent quand j'ai le contenu (textes, photos, logo). Si vous ne l'avez pas encore, on en parle ensemble.",
    },
    {
      id: "content",
      question: "Qui fournit les textes et les photos ?",
      answer:
        "On fait moitié-moitié. Si vous avez les textes, je les retravaille avec vous. Sinon, je vous envoie une liste de questions auxquelles vous répondez par chat ou vocaux, et je les rédige. Photos : les vôtres, ou je vous indique où les prendre (Unsplash, Pexels) ou un photographe local.",
    },
    {
      id: "what-after",
      question: "Une fois le site en ligne, vous me laissez seul ?",
      answer:
        "Non. Je reste joignable sur WhatsApp/email pour les petites corrections et les doutes. Si vous voulez une évolution (nouvelle section, blog, intégration), je vous fais un devis séparé. Pas d'abonnement annuel forcé pour changer deux lignes.",
    },
    {
      id: "host",
      question: "L'hébergement et le domaine sont inclus ?",
      answer:
        "Le domaine (~15 €/an) et l'hébergement (souvent 0 € sur Vercel pour des sites vitrine) sont payés par vous, sur vos comptes — vous restez toujours propriétaire. Je vous accompagne pour la configuration. Pas de combine du genre 'le domaine est à moi tant que tu payes la redevance'.",
    },
    {
      id: "seo",
      question: "Vous allez me faire trouver sur Google ?",
      answer:
        "Le SEO technique de base est inclus : titres corrects, meta descriptions, structure sémantique, performance, sitemap, mobile-first. Pour vous positionner sur des requêtes concurrentielles il faut un travail continu (contenu, backlinks) : si vous en avez besoin, je vous dis clairement ce qu'il faut et combien ça coûte — même si je ne le fais pas moi-même.",
    },
    {
      id: "remote",
      question: "Vous travaillez seulement à Rome ?",
      answer:
        "Je suis à Rome, mais je travaille 100% en ligne partout en Italie (et à l'étranger). Appels sur Meet/WhatsApp, aperçus partagés par lien, fichiers via Drive/Notion. Si vous êtes à Rome et voulez se voir en personne, c'est possible.",
    },
    {
      id: "guarantee",
      question: "Et si je ne suis pas satisfait du résultat ?",
      answer:
        "On travaille par étapes avec des aperçus continus : si quelque chose ne vous convainc pas, vous le dites tout de suite — pas à la fin. Les forfaits landing/site incluent 2 révisions de design et 1 de copy. Pour les web apps, on définit ensemble les milestones, chacun validé avant de passer au suivant.",
    },
  ],
};

export const faqsContent: Record<Locale, FaqsContent> = { it, en, fr };

export function getFaqsContent(locale: Locale) {
  return faqsContent[locale];
}
