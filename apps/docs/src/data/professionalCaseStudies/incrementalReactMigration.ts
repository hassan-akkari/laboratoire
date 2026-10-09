import type { Locale } from "../../i18n/locale";
import type { ProfessionalCaseStudy } from "../professionalCaseStudies";

/**
 * Case study: incremental Razor/MVC → React migration inside a live ASP.NET
 * Core host, measured between a June 2026 baseline and a September 2026
 * snapshot. Route counts are route counts — never features or legacy pages;
 * the entry-chunk figure is the entry chunk only. Locale-specific digit
 * grouping (1,764,861 / 1.764.861 / 1 764 861 / 1'764'861) is deliberate.
 */

const slug = "incremental-react-migration" as const;

const stack = [
  "React",
  "TypeScript",
  "React Router",
  "Redux Toolkit",
  "RTK Query",
  "Vite (library mode)",
  "ASP.NET Core",
  "BFF",
];

const en: ProfessionalCaseStudy = {
  slug,
  title: "Leading a gradual Razor-to-React migration without stopping a live product",
  eyebrow: "Frontend architecture · Incremental migration",
  period: "2026 · measured June → September",
  teaser:
    "A live multi-tenant ASP.NET Core interface built on MVC, Razor, jQuery and Blazor could not be rewritten in one go. I owned the frontend path that let React grow inside it, page by page, with security boundaries and release safeguards.",
  summary:
    "The product was a live multi-tenant ASP.NET Core platform whose interface had grown across MVC, Razor, JavaScript/jQuery and some Blazor components. A rewrite was not realistic, so I owned the frontend direction of an incremental React + TypeScript migration: hybrid navigation, feature-owned routes, a same-origin BFF, a reusable page shell and build safeguards, so the legacy interface and React could coexist until each business area was safe to replace.",
  highlights: [
    "Real React routes grew from 10 to 112 between the June baseline and the September snapshot",
    "Entry JavaScript artifact 1,764,861 → 63,249 bytes (the entry chunk only)",
    "108 real routes on the staging line, 65 of them explicitly mapped to legacy URLs",
  ],
  role: "Frontend architecture and implementation direction: mine. Business features on the platform: the whole team.",
  stack,
  context: [
    "The product was a live, multi-tenant ASP.NET Core platform whose interface had grown across MVC, Razor, JavaScript/jQuery and selected Blazor components. A full rewrite was not realistic: customers depended on the existing application, feature development had to continue, and many legacy areas were coupled to authentication, tenant context and operational workflows.",
    "The constraints were concrete. The existing product had to stay usable throughout. Legacy and React navigation had to coexist without breaking authorization or deep links. The browser could never receive the downstream API bearer token. New features needed repeatable patterns for state, API contracts, layout and error handling. And every change went through testing and staging before production, so it had to be compatible and rollback-friendly.",
  ],
  contribution: [
    "Mounted React and TypeScript under /app inside the existing ASP.NET host, with React Router using /app as its basename while ASP.NET kept session handling and server-side integration.",
    "Set up the browser → same-origin BFF flow: the API JWT stays in the server-side session, React receives an authentication snapshot and uses CSRF protection for mutations. Redux Toolkit and RTK Query became the shared model for server state, caching and per-feature endpoint injection.",
    "Designed the hybrid navigation model — legacy page, automatic resolution or explicit React route — with shared utilities that preserve query strings and hashes and handle SPA, full-page and external destinations through one interface.",
    "Moved route discovery to feature-owned definitions via import.meta.glob, with duplicate-route checks, so a normal feature no longer edits a central registry.",
    "Built PageShell, a reusable layout with a header, an optional subheader and a scrollable body: desktop operational pages keep actions and filters visible while the data area scrolls; small screens fall back to natural page scrolling.",
    "Implemented route and vendor code splitting in the Vite library-mode build while preserving the ASP.NET bridge, kept a single stylesheet (split CSS could be orphaned in this setup) and added a bundle verifier that fails the build on missing referenced chunks.",
  ],
  decisions: [
    {
      title: "Incremental, inside the same host",
      body: "No second application and no big-bang cutover. React lives under /app in the existing ASP.NET host, so each business area moves when it is safe and the legacy page stays available until then.",
    },
    {
      title: "The token stays on the server",
      body: "The BFF keeps the API JWT in the server-side session; the browser only ever gets an authentication snapshot and a CSRF token for mutations.",
    },
    {
      title: "Routes owned by features",
      body: "Route definitions live next to the feature and are discovered at build time. The central registry had become a merge hotspot and an easy place to forget an entry.",
    },
    {
      title: "Split JavaScript, one stylesheet",
      body: "Code splitting for routes and vendors, but a unified CSS bundle: in library mode a split stylesheet could end up never loaded. The verifier catches a missing chunk at release time instead of in production.",
    },
  ],
  difficulty: [
    "As the React surface grew, the BFF and the routing became the main source of integration risk: a large central endpoint surface, dependency registration that could diverge between production and tests, shared HTTP headers and client/server contract mismatches on one side; duplicated resolvers and inconsistent destinations on the other.",
    "Stabilizing that meant per-feature endpoints, services and DTOs with shared dependency-injection composition, per-request HTTP headers, client/server inventory checks, Swagger contract verification, centralized navigation and release-time bundle checks. I worked with the person promoting release branches and stayed involved through staging until frontend failures reached a stable operational level.",
  ],
  results: [
    "Between the verified June baseline and the September snapshot, real React routes grew from 10 to 112 at HEAD; the examined staging line held 108 real routes, excluding 42 placeholders and two development-only routes.",
    "Of the 108 staging routes, 65 were explicitly mapped to legacy URLs, 16 were declared native React routes and 27 were additional detail, create, edit or otherwise unmapped paths.",
    "The React pages promoted to staging were operational according to direct engineering observation; the repository held 317 frontend test files and the migration tracker passed 16 of 16 tests.",
    "The durable outcome is a migration platform: feature-owned routes, shared navigation, a reusable page structure, BFF boundaries, consistent state patterns and release safeguards that let React work expand while the legacy product stayed available.",
  ],
  metrics: [
    {
      label: "Real React routes at HEAD",
      before: "10",
      after: "112",
      note: "June baseline → September 2026 snapshot",
    },
    {
      label: "Real routes on the staging line",
      value: "108",
      note: "excluding 42 placeholders and 2 development-only routes",
    },
    {
      label: "Staging routes mapped to a legacy URL",
      value: "65 of 108",
      note: "16 native React routes, 27 detail/create/edit or unmapped paths",
    },
    {
      label: "Entry JavaScript artifact",
      before: "1,764,861 bytes",
      after: "63,249 bytes",
      note: "the entry chunk only, not total JavaScript",
    },
    {
      label: "Frontend test files · migration tracker",
      value: "317 files · 16 / 16 tests",
      note: "historical counts, September 2026",
    },
  ],
  limits: [
    "A route is not a complete business feature, and route counts say nothing about how much of the legacy product has been migrated.",
    "The entry-chunk reduction is not a reduction of total transferred JavaScript or of page-load time; neither was measured.",
    "Operation in staging is an engineering observation, not a route-by-route smoke test, customer activation or production adoption. Those were not retained as verifiable metrics, so I do not present this as a completed migration.",
  ],
  proves:
    "I can design a migration path that lets a new stack grow inside a live legacy product — with security boundaries, repeatable patterns and release safeguards — and stay accountable through stabilization.",
  team:
    "I owned the frontend architecture and implementation direction, using AI assistance for repository analysis and implementation while keeping the decisions, the review and the release readiness. Business features built on the platform belong to the whole team, and the UI-library choices were shared decisions.",
  seoDescription:
    "Incremental Razor-to-React migration inside a live multi-tenant ASP.NET Core platform: hybrid navigation, feature-owned routes, same-origin BFF, page shell, code splitting. Numbers with their limits.",
};

const it: ProfessionalCaseStudy = {
  slug,
  title: "Guidare una migrazione graduale da Razor a React senza fermare un prodotto attivo",
  eyebrow: "Architettura frontend · Migrazione incrementale",
  period: "2026 · misurata da giugno a settembre",
  teaser:
    "Un'interfaccia ASP.NET Core multi-tenant in produzione, costruita su MVC, Razor, jQuery e Blazor, non poteva essere riscritta in un colpo solo. Ho guidato il percorso frontend che ha permesso a React di crescerci dentro, pagina per pagina, con confini di sicurezza e guard di rilascio.",
  summary:
    "Il prodotto era una piattaforma ASP.NET Core multi-tenant in produzione, con un'interfaccia distribuita tra MVC, Razor, JavaScript/jQuery e alcuni componenti Blazor. Una riscrittura non era realistica, quindi ho guidato la direzione frontend di una migrazione incrementale a React + TypeScript: navigazione ibrida, route possedute dalle feature, un BFF same-origin, una struttura pagina riutilizzabile e guard di build, così che interfaccia legacy e React potessero convivere finché ogni area di business non fosse pronta per essere sostituita.",
  highlights: [
    "Le route React reali sono passate da 10 a 112 tra la baseline di giugno e lo snapshot di settembre",
    "Artefatto JavaScript di entry da 1.764.861 a 63.249 byte (solo l'entry chunk)",
    "108 route reali sulla linea di staging, 65 delle quali mappate esplicitamente su URL legacy",
  ],
  role: "Architettura frontend e direzione dell'implementazione: mie. Le feature di business sulla piattaforma: tutto il team.",
  stack,
  context: [
    "Il prodotto era una piattaforma ASP.NET Core multi-tenant già utilizzata, con un'interfaccia cresciuta tra MVC, Razor, JavaScript/jQuery e alcuni componenti Blazor. Una riscrittura completa non era realistica: i clienti dipendevano dall'applicazione esistente, lo sviluppo delle funzionalità doveva continuare e molte aree legacy erano accoppiate ad autenticazione, contesto tenant e flussi operativi.",
    "I vincoli erano concreti. Il prodotto doveva restare utilizzabile per tutta la durata. Navigazione legacy e React dovevano convivere senza rompere autorizzazioni e deep link. Il browser non doveva mai ricevere il bearer token dell'API downstream. Le nuove feature avevano bisogno di pattern ripetibili per stato, contratti API, layout ed error handling. E ogni cambiamento passava da testing e staging prima della produzione, quindi doveva essere compatibile e facile da annullare.",
  ],
  contribution: [
    "Ho montato React e TypeScript sotto /app nello stesso host ASP.NET, con React Router che usa /app come basename mentre ASP.NET continua a gestire sessione e integrazioni server-side.",
    "Ho impostato il flusso browser → BFF same-origin: il JWT dell'API resta nella sessione server-side, React riceve uno snapshot di autenticazione e usa la protezione CSRF per le mutation. Redux Toolkit e RTK Query sono diventati il modello condiviso per server state, caching ed endpoint definiti per feature.",
    "Ho progettato la navigazione ibrida — pagina legacy, risoluzione automatica o route React esplicita — con utility condivise che preservano query string e hash e gestiscono destinazioni SPA, full-page ed esterne attraverso una sola interfaccia.",
    "Ho spostato la route discovery su definizioni possedute dalle feature tramite import.meta.glob, con controlli sui duplicati, così una feature normale non modifica più un registry centrale.",
    "Ho creato PageShell, un layout riutilizzabile con header, subheader opzionale e body scrollabile: nelle pagine operative desktop azioni e filtri restano visibili mentre scorre l'area dati; sugli schermi piccoli torna lo scroll naturale.",
    "Ho implementato la separazione di route e vendor nella build Vite in library mode conservando il bridge ASP.NET, ho mantenuto un unico foglio di stile (un CSS separato poteva restare orfano in questo assetto) e ho aggiunto un verificatore del bundle che fa fallire la build se manca un chunk referenziato.",
  ],
  decisions: [
    {
      title: "Incrementale, nello stesso host",
      body: "Nessuna seconda applicazione e nessun cutover big-bang. React vive sotto /app nell'host ASP.NET esistente, così ogni area di business migra quando è sicuro farlo e la pagina legacy resta disponibile fino a quel momento.",
    },
    {
      title: "Il token resta sul server",
      body: "Il BFF tiene il JWT dell'API nella sessione server-side; il browser riceve soltanto uno snapshot di autenticazione e un token CSRF per le mutation.",
    },
    {
      title: "Route possedute dalle feature",
      body: "Le definizioni delle route vivono accanto alla feature e vengono scoperte in fase di build. Il registry centrale era diventato un punto caldo per i merge e un posto facile in cui dimenticare una voce.",
    },
    {
      title: "JavaScript separato, un solo foglio di stile",
      body: "Code splitting per route e vendor, ma un bundle CSS unico: in library mode un foglio di stile separato poteva non venire mai caricato. Il verificatore intercetta un chunk mancante al rilascio invece che in produzione.",
    },
  ],
  difficulty: [
    "Con la crescita della superficie React, BFF e routing sono diventati la principale fonte di rischio d'integrazione: da un lato una grande superficie centrale di endpoint, registrazioni DI che potevano divergere tra produzione e test, header HTTP condivisi e disallineamenti tra contratti client e server; dall'altro resolver duplicati e destinazioni incoerenti.",
    "Stabilizzare ha significato endpoint, servizi e DTO per feature con una composizione DI condivisa, header HTTP per richiesta, controlli di inventario client/server, verifica dei contratti Swagger, navigazione centralizzata e controlli del bundle al rilascio. Ho lavorato con il responsabile della promozione delle branch e sono rimasto coinvolto durante lo staging finché gli errori frontend non hanno raggiunto un livello operativo stabile.",
  ],
  results: [
    "Tra la baseline verificata di giugno e lo snapshot di settembre, le route React reali sono passate da 10 a 112 sull'HEAD; la linea di staging esaminata conteneva 108 route reali, escludendo 42 placeholder e due route solo di sviluppo.",
    "Delle 108 route di staging, 65 erano mappate esplicitamente su URL legacy, 16 dichiarate come route React native e 27 erano percorsi aggiuntivi di dettaglio, creazione, modifica o comunque senza mapping.",
    "Le pagine React promosse in staging risultavano operative secondo l'osservazione diretta durante il lavoro; il repository conteneva 317 file di test frontend e il tracker della migrazione ha superato 16 test su 16.",
    "Il risultato durevole è una piattaforma di migrazione: route possedute dalle feature, navigazione condivisa, struttura pagina riutilizzabile, confini BFF, pattern coerenti per lo stato e guard di rilascio che hanno permesso al lavoro React di crescere mentre il prodotto legacy restava disponibile.",
  ],
  metrics: [
    {
      label: "Route React reali sull'HEAD",
      before: "10",
      after: "112",
      note: "baseline di giugno → snapshot di settembre 2026",
    },
    {
      label: "Route reali sulla linea di staging",
      value: "108",
      note: "escludendo 42 placeholder e 2 route solo di sviluppo",
    },
    {
      label: "Route di staging mappate su un URL legacy",
      value: "65 su 108",
      note: "16 route React native, 27 percorsi di dettaglio/creazione/modifica o senza mapping",
    },
    {
      label: "Artefatto JavaScript di entry",
      before: "1.764.861 byte",
      after: "63.249 byte",
      note: "solo l'entry chunk, non il JavaScript totale",
    },
    {
      label: "File di test frontend · tracker della migrazione",
      value: "317 file · 16 / 16 test",
      note: "conteggi storici, settembre 2026",
    },
  ],
  limits: [
    "Una route non è una feature di business completa, e il numero di route non dice quanta parte del prodotto legacy sia stata migrata.",
    "La riduzione dell'entry chunk non è una riduzione del JavaScript totale trasferito né dei tempi di caricamento: nessuno dei due è stato misurato.",
    "L'operatività in staging è un'osservazione ingegneristica, non uno smoke test route per route, un'attivazione per i clienti o un'adozione in produzione. Questi dati non sono stati conservati come metriche verificabili, per questo non presento il lavoro come una migrazione completata.",
  ],
  proves:
    "So progettare un percorso di migrazione che lasci crescere un nuovo stack dentro un prodotto legacy in produzione — con confini di sicurezza, pattern ripetibili e guard di rilascio — restando responsabile fino alla stabilizzazione.",
  team:
    "Ho guidato architettura frontend e direzione dell'implementazione, usando l'assistenza dell'AI per analisi del repository e implementazione mantenendo decisioni, review e release readiness. Le feature di business costruite sulla piattaforma appartengono a tutto il team, e le scelte sulla libreria UI sono state decisioni condivise.",
  seoDescription:
    "Migrazione incrementale da Razor a React dentro una piattaforma ASP.NET Core multi-tenant in produzione: navigazione ibrida, route per feature, BFF same-origin, page shell, code splitting. Numeri con i loro limiti.",
};

const fr: ProfessionalCaseStudy = {
  slug,
  title: "Mener une migration progressive de Razor vers React sans arrêter un produit en production",
  eyebrow: "Architecture frontend · Migration incrémentale",
  period: "2026 · mesurée de juin à septembre",
  teaser:
    "Une interface ASP.NET Core multi-tenant en production, bâtie sur MVC, Razor, jQuery et Blazor, ne pouvait pas être réécrite d'un bloc. J'ai piloté le chemin frontend qui a permis à React d'y grandir, page par page, avec des frontières de sécurité et des garde-fous de release.",
  summary:
    "Le produit était une plateforme ASP.NET Core multi-tenant en production dont l'interface s'était étendue entre MVC, Razor, JavaScript/jQuery et quelques composants Blazor. Une réécriture n'était pas réaliste, alors j'ai piloté la direction frontend d'une migration incrémentale vers React + TypeScript : navigation hybride, routes détenues par les features, un BFF same-origin, une structure de page réutilisable et des garde-fous de build, pour que l'interface legacy et React coexistent jusqu'à ce que chaque domaine métier puisse être remplacé sans risque.",
  highlights: [
    "Les routes React réelles sont passées de 10 à 112 entre la baseline de juin et le snapshot de septembre",
    "Artefact JavaScript d'entrée de 1 764 861 à 63 249 octets (le chunk d'entrée uniquement)",
    "108 routes réelles sur la ligne de staging, dont 65 explicitement mappées vers des URL legacy",
  ],
  role: "Architecture frontend et direction de l'implémentation : les miennes. Les features métier sur la plateforme : toute l'équipe.",
  stack,
  context: [
    "Le produit était une plateforme ASP.NET Core multi-tenant déjà utilisée, dont l'interface avait grandi entre MVC, Razor, JavaScript/jQuery et quelques composants Blazor. Une réécriture complète n'était pas réaliste : les clients dépendaient de l'application existante, le développement des fonctionnalités devait continuer, et beaucoup de zones legacy étaient couplées à l'authentification, au contexte tenant et aux flux opérationnels.",
    "Les contraintes étaient concrètes. Le produit devait rester utilisable tout du long. Les navigations legacy et React devaient coexister sans casser les autorisations ni les deep links. Le navigateur ne devait jamais recevoir le bearer token de l'API en aval. Les nouvelles features avaient besoin de patterns répétables pour l'état, les contrats API, le layout et la gestion d'erreurs. Et chaque changement passait par testing et staging avant la production : il devait donc être compatible et facile à annuler.",
  ],
  contribution: [
    "J'ai monté React et TypeScript sous /app dans l'hôte ASP.NET existant, avec React Router utilisant /app comme basename tandis qu'ASP.NET gardait la session et l'intégration côté serveur.",
    "J'ai mis en place le flux navigateur → BFF same-origin : le JWT de l'API reste dans la session côté serveur, React reçoit un snapshot d'authentification et utilise une protection CSRF pour les mutations. Redux Toolkit et RTK Query sont devenus le modèle partagé pour l'état serveur, le cache et l'injection d'endpoints par feature.",
    "J'ai conçu le modèle de navigation hybride — page legacy, résolution automatique ou route React explicite — avec des utilitaires partagés qui préservent query strings et hashes et gèrent les destinations SPA, pleine page et externes via une seule interface.",
    "J'ai déplacé la découverte des routes vers des définitions détenues par les features via import.meta.glob, avec contrôle des doublons, pour qu'une feature ordinaire ne modifie plus un registre central.",
    "J'ai construit PageShell, un layout réutilisable avec en-tête, sous-en-tête optionnel et corps défilant : sur les pages opérationnelles desktop, actions et filtres restent visibles pendant que la zone de données défile ; sur petits écrans, retour au défilement naturel de la page.",
    "J'ai implémenté le découpage du code par route et par vendor dans le build Vite en mode librairie tout en préservant le pont ASP.NET, gardé une feuille de style unique (un CSS découpé pouvait rester orphelin dans cette configuration) et ajouté un vérificateur de bundle qui fait échouer le build si un chunk référencé manque.",
  ],
  decisions: [
    {
      title: "Incrémental, dans le même hôte",
      body: "Pas de seconde application ni de bascule big-bang. React vit sous /app dans l'hôte ASP.NET existant : chaque domaine métier migre quand c'est sûr et la page legacy reste disponible jusque-là.",
    },
    {
      title: "Le token reste côté serveur",
      body: "Le BFF conserve le JWT de l'API dans la session côté serveur ; le navigateur ne reçoit jamais qu'un snapshot d'authentification et un token CSRF pour les mutations.",
    },
    {
      title: "Des routes détenues par les features",
      body: "Les définitions de routes vivent à côté de la feature et sont découvertes au build. Le registre central était devenu un point chaud de merge et un endroit facile pour oublier une entrée.",
    },
    {
      title: "JavaScript découpé, une seule feuille de style",
      body: "Découpage du code pour les routes et les vendors, mais un bundle CSS unifié : en mode librairie, une feuille de style découpée pouvait ne jamais être chargée. Le vérificateur attrape un chunk manquant à la release plutôt qu'en production.",
    },
  ],
  difficulty: [
    "À mesure que la surface React grandissait, le BFF et le routage sont devenus la principale source de risque d'intégration : d'un côté une grande surface centrale d'endpoints, un enregistrement des dépendances qui pouvait diverger entre production et tests, des en-têtes HTTP partagés et des écarts de contrat client/serveur ; de l'autre, des résolveurs dupliqués et des destinations incohérentes.",
    "Stabiliser a signifié des endpoints, services et DTO par feature avec une composition d'injection de dépendances partagée, des en-têtes HTTP par requête, des contrôles d'inventaire client/serveur, une vérification des contrats Swagger, une navigation centralisée et des contrôles de bundle à la release. J'ai travaillé avec la personne qui promouvait les branches de release et je suis resté impliqué en staging jusqu'à ce que les échecs frontend atteignent un niveau opérationnel stable.",
  ],
  results: [
    "Entre la baseline vérifiée de juin et le snapshot de septembre, les routes React réelles sont passées de 10 à 112 sur HEAD ; la ligne de staging examinée contenait 108 routes réelles, hors 42 placeholders et deux routes réservées au développement.",
    "Sur les 108 routes de staging, 65 étaient explicitement mappées vers des URL legacy, 16 déclarées comme routes React natives et 27 étaient des chemins supplémentaires de détail, création, édition ou sans mapping.",
    "Les pages React promues en staging étaient opérationnelles selon l'observation directe pendant le travail ; le dépôt contenait 317 fichiers de tests frontend et le tracker de migration a passé 16 tests sur 16.",
    "Le résultat durable est une plateforme de migration : routes détenues par les features, navigation partagée, structure de page réutilisable, frontières BFF, patterns d'état cohérents et garde-fous de release qui ont permis au travail React de s'étendre pendant que le produit legacy restait disponible.",
  ],
  metrics: [
    {
      label: "Routes React réelles sur HEAD",
      before: "10",
      after: "112",
      note: "baseline de juin → snapshot de septembre 2026",
    },
    {
      label: "Routes réelles sur la ligne de staging",
      value: "108",
      note: "hors 42 placeholders et 2 routes réservées au développement",
    },
    {
      label: "Routes de staging mappées vers une URL legacy",
      value: "65 sur 108",
      note: "16 routes React natives, 27 chemins de détail/création/édition ou sans mapping",
    },
    {
      label: "Artefact JavaScript d'entrée",
      before: "1 764 861 octets",
      after: "63 249 octets",
      note: "le chunk d'entrée uniquement, pas le JavaScript total",
    },
    {
      label: "Fichiers de tests frontend · tracker de migration",
      value: "317 fichiers · 16 / 16 tests",
      note: "comptages historiques, septembre 2026",
    },
  ],
  limits: [
    "Une route n'est pas une feature métier complète, et le nombre de routes ne dit rien de la part du produit legacy déjà migrée.",
    "La réduction du chunk d'entrée n'est pas une réduction du JavaScript total transféré ni du temps de chargement ; aucun des deux n'a été mesuré.",
    "Le fonctionnement en staging est une observation d'ingénierie, pas un smoke test route par route, une activation client ou une adoption en production. Ces données n'ont pas été conservées comme métriques vérifiables, c'est pourquoi je ne présente pas ce travail comme une migration terminée.",
  ],
  proves:
    "Je sais concevoir un chemin de migration qui laisse une nouvelle stack grandir dans un produit legacy en production — avec des frontières de sécurité, des patterns répétables et des garde-fous de release — et rester responsable jusqu'à la stabilisation.",
  team:
    "J'ai piloté l'architecture frontend et la direction de l'implémentation, avec l'assistance de l'IA pour l'analyse du dépôt et l'implémentation, tout en gardant les décisions, la revue et la préparation des releases. Les features métier construites sur la plateforme appartiennent à toute l'équipe, et les choix de librairie UI ont été des décisions partagées.",
  seoDescription:
    "Migration incrémentale de Razor vers React dans une plateforme ASP.NET Core multi-tenant en production : navigation hybride, routes par feature, BFF same-origin, page shell, découpage du code. Des chiffres avec leurs limites.",
};

const de: ProfessionalCaseStudy = {
  slug,
  title: "Eine schrittweise Migration von Razor zu React leiten, ohne ein produktives Produkt anzuhalten",
  eyebrow: "Frontend-Architektur · Inkrementelle Migration",
  period: "2026 · gemessen Juni bis September",
  teaser:
    "Eine produktive mandantenfähige ASP.NET-Core-Oberfläche aus MVC, Razor, jQuery und Blazor liess sich nicht in einem Zug neu schreiben. Ich habe den Frontend-Weg verantwortet, auf dem React darin wachsen konnte, Seite für Seite, mit Sicherheitsgrenzen und Release-Absicherungen.",
  summary:
    "Das Produkt war eine produktive mandantenfähige ASP.NET-Core-Plattform, deren Oberfläche über MVC, Razor, JavaScript/jQuery und einige Blazor-Komponenten gewachsen war. Ein Neuschreiben war nicht realistisch, also habe ich die Frontend-Richtung einer inkrementellen Migration zu React + TypeScript verantwortet: hybride Navigation, von Features besessene Routen, ein Same-Origin-BFF, eine wiederverwendbare Seitenstruktur und Build-Absicherungen, damit Legacy-Oberfläche und React nebeneinander bestehen konnten, bis jeder Fachbereich sicher ersetzt werden konnte.",
  highlights: [
    "Echte React-Routen wuchsen zwischen der Juni-Baseline und dem September-Snapshot von 10 auf 112",
    "JavaScript-Einstiegsartefakt von 1'764'861 auf 63'249 Bytes (nur der Einstiegs-Chunk)",
    "108 echte Routen auf der Staging-Linie, davon 65 explizit auf Legacy-URLs abgebildet",
  ],
  role: "Frontend-Architektur und Umsetzungsrichtung: meine. Die fachlichen Features auf der Plattform: das ganze Team.",
  stack,
  context: [
    "Das Produkt war eine produktive, mandantenfähige ASP.NET-Core-Plattform, deren Oberfläche über MVC, Razor, JavaScript/jQuery und einzelne Blazor-Komponenten gewachsen war. Ein vollständiges Neuschreiben war nicht realistisch: Kunden hingen von der bestehenden Anwendung ab, die Feature-Entwicklung musste weiterlaufen, und viele Legacy-Bereiche waren mit Authentifizierung, Mandantenkontext und operativen Abläufen gekoppelt.",
    "Die Randbedingungen waren konkret. Das bestehende Produkt musste durchgehend nutzbar bleiben. Legacy- und React-Navigation mussten nebeneinander funktionieren, ohne Autorisierung oder Deep Links zu brechen. Der Browser durfte das Bearer-Token der nachgelagerten API nie erhalten. Neue Features brauchten wiederholbare Muster für State, API-Verträge, Layout und Fehlerbehandlung. Und jede Änderung durchlief Testing und Staging vor der Produktion, musste also kompatibel und leicht zurücknehmbar sein.",
  ],
  contribution: [
    "React und TypeScript unter /app im bestehenden ASP.NET-Host eingebunden, mit React Router und /app als Basename, während ASP.NET Session und serverseitige Integration weiter verantwortete.",
    "Den Fluss Browser → Same-Origin-BFF aufgesetzt: Das API-JWT bleibt in der serverseitigen Session, React erhält einen Authentifizierungs-Snapshot und nutzt CSRF-Schutz für Mutationen. Redux Toolkit und RTK Query wurden zum gemeinsamen Modell für Server-State, Caching und Endpunkt-Injektion pro Feature.",
    "Das hybride Navigationsmodell entworfen — Legacy-Seite, automatische Auflösung oder explizite React-Route — mit gemeinsamen Hilfsfunktionen, die Query-Strings und Hashes erhalten und SPA-, Vollseiten- und externe Ziele über eine einzige Schnittstelle behandeln.",
    "Die Routen-Erkennung auf von Features besessene Definitionen über import.meta.glob verlagert, mit Duplikatprüfung, sodass ein normales Feature kein zentrales Register mehr bearbeitet.",
    "PageShell gebaut, ein wiederverwendbares Layout mit Header, optionalem Subheader und scrollbarem Body: Operative Desktop-Seiten halten Aktionen und Filter sichtbar, während der Datenbereich scrollt; kleine Bildschirme fallen auf natürliches Seitenscrollen zurück.",
    "Routen- und Vendor-Code-Splitting im Vite-Library-Mode-Build umgesetzt und dabei die ASP.NET-Brücke erhalten, ein einziges Stylesheet beibehalten (aufgeteiltes CSS konnte in diesem Aufbau verwaist bleiben) und einen Bundle-Prüfer ergänzt, der den Build bei fehlenden referenzierten Chunks scheitern lässt.",
  ],
  decisions: [
    {
      title: "Inkrementell, im selben Host",
      body: "Keine zweite Anwendung und kein Big-Bang-Umschalten. React lebt unter /app im bestehenden ASP.NET-Host, sodass jeder Fachbereich wechselt, wenn es sicher ist, und die Legacy-Seite bis dahin verfügbar bleibt.",
    },
    {
      title: "Das Token bleibt auf dem Server",
      body: "Der BFF hält das API-JWT in der serverseitigen Session; der Browser erhält immer nur einen Authentifizierungs-Snapshot und ein CSRF-Token für Mutationen.",
    },
    {
      title: "Routen gehören den Features",
      body: "Routendefinitionen liegen neben dem Feature und werden zur Build-Zeit erkannt. Das zentrale Register war zum Merge-Brennpunkt geworden und ein leichter Ort, einen Eintrag zu vergessen.",
    },
    {
      title: "Aufgeteiltes JavaScript, ein Stylesheet",
      body: "Code-Splitting für Routen und Vendors, aber ein vereinheitlichtes CSS-Bundle: Im Library Mode konnte ein aufgeteiltes Stylesheet nie geladen werden. Der Prüfer fängt einen fehlenden Chunk beim Release ab statt in der Produktion.",
    },
  ],
  difficulty: [
    "Mit wachsender React-Oberfläche wurden BFF und Routing zur Hauptquelle von Integrationsrisiko: auf der einen Seite eine grosse zentrale Endpunktfläche, eine Abhängigkeitsregistrierung, die zwischen Produktion und Tests auseinanderlaufen konnte, geteilte HTTP-Header und Vertragsabweichungen zwischen Client und Server; auf der anderen doppelte Resolver und inkonsistente Ziele.",
    "Stabilisieren bedeutete Endpunkte, Services und DTOs pro Feature mit gemeinsamer Dependency-Injection-Komposition, HTTP-Header pro Anfrage, Inventarprüfungen zwischen Client und Server, Swagger-Vertragsverifikation, zentralisierte Navigation und Bundle-Prüfungen beim Release. Ich habe mit der Person zusammengearbeitet, die Release-Branches befördert, und blieb durch das Staging hindurch beteiligt, bis die Frontend-Fehler ein stabiles operatives Niveau erreichten.",
  ],
  results: [
    "Zwischen der verifizierten Juni-Baseline und dem September-Snapshot wuchsen die echten React-Routen auf HEAD von 10 auf 112; die untersuchte Staging-Linie enthielt 108 echte Routen, ohne 42 Platzhalter und zwei reine Entwicklungsrouten.",
    "Von den 108 Staging-Routen waren 65 explizit auf Legacy-URLs abgebildet, 16 als native React-Routen deklariert und 27 zusätzliche Detail-, Erstell-, Bearbeitungs- oder anderweitig nicht abgebildete Pfade.",
    "Die nach Staging beförderten React-Seiten waren nach direkter Beobachtung während der Arbeit funktionsfähig; das Repository enthielt 317 Frontend-Testdateien, und der Migrations-Tracker bestand 16 von 16 Tests.",
    "Das dauerhafte Ergebnis ist eine Migrationsplattform: von Features besessene Routen, gemeinsame Navigation, eine wiederverwendbare Seitenstruktur, BFF-Grenzen, konsistente State-Muster und Release-Absicherungen, die die React-Arbeit wachsen liessen, während das Legacy-Produkt verfügbar blieb.",
  ],
  metrics: [
    {
      label: "Echte React-Routen auf HEAD",
      before: "10",
      after: "112",
      note: "Juni-Baseline → September-Snapshot 2026",
    },
    {
      label: "Echte Routen auf der Staging-Linie",
      value: "108",
      note: "ohne 42 Platzhalter und 2 reine Entwicklungsrouten",
    },
    {
      label: "Staging-Routen mit Abbildung auf eine Legacy-URL",
      value: "65 von 108",
      note: "16 native React-Routen, 27 Detail-/Erstell-/Bearbeitungspfade oder ohne Abbildung",
    },
    {
      label: "JavaScript-Einstiegsartefakt",
      before: "1'764'861 Bytes",
      after: "63'249 Bytes",
      note: "nur der Einstiegs-Chunk, nicht das gesamte JavaScript",
    },
    {
      label: "Frontend-Testdateien · Migrations-Tracker",
      value: "317 Dateien · 16 / 16 Tests",
      note: "historische Zählung, September 2026",
    },
  ],
  limits: [
    "Eine Route ist kein vollständiges fachliches Feature, und Routenzahlen sagen nichts darüber, wie viel des Legacy-Produkts migriert ist.",
    "Die Verkleinerung des Einstiegs-Chunks ist keine Verkleinerung des insgesamt übertragenen JavaScripts und keine Verkürzung der Ladezeit; beides wurde nicht gemessen.",
    "Der Betrieb im Staging ist eine technische Beobachtung, kein Smoke-Test Route für Route, keine Kundenaktivierung und keine Produktionsnutzung. Diese Daten wurden nicht als überprüfbare Kennzahlen aufbewahrt, deshalb stelle ich die Arbeit nicht als abgeschlossene Migration dar.",
  ],
  proves:
    "Ich kann einen Migrationspfad entwerfen, der einen neuen Stack in einem produktiven Legacy-Produkt wachsen lässt — mit Sicherheitsgrenzen, wiederholbaren Mustern und Release-Absicherungen — und bis zur Stabilisierung verantwortlich bleiben.",
  team:
    "Ich habe Frontend-Architektur und Umsetzungsrichtung verantwortet und dabei KI-Unterstützung für Repository-Analyse und Umsetzung genutzt, während Entscheidungen, Review und Release-Bereitschaft bei mir blieben. Die auf der Plattform gebauten fachlichen Features gehören dem ganzen Team, und die Wahl der UI-Bibliothek war eine gemeinsame Entscheidung.",
  seoDescription:
    "Inkrementelle Migration von Razor zu React in einer produktiven mandantenfähigen ASP.NET-Core-Plattform: hybride Navigation, Routen pro Feature, Same-Origin-BFF, Page Shell, Code-Splitting. Zahlen mit ihren Grenzen.",
};

export const incrementalReactMigration: Record<Locale, ProfessionalCaseStudy> = {
  en,
  it,
  fr,
  de,
};
