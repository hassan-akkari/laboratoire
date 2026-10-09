import type { Locale } from "../../i18n/locale";
import type { ProfessionalCaseStudy } from "../professionalCaseStudies";

/**
 * Case study: extraction of a monolithic ASP.NET Core backend-for-frontend
 * into feature-owned slices, July 2026. Figures are the staging-cutover
 * checkpoint; the later 92 / 91 / 93 counts are the whole team's product
 * growth and are labelled as such. No percentage: the reduction concerns one
 * composition file, not the BFF as a whole.
 */

const slug = "bff-modularization" as const;

const stack = [
  "ASP.NET Core",
  "C#",
  "Endpoint routing",
  "Dependency injection",
  "Swagger / OpenAPI",
  "NUnit",
];

const en: ProfessionalCaseStudy = {
  slug,
  title: "Turning a monolithic BFF into feature-owned slices without changing a contract",
  eyebrow: "Backend architecture · Team workflow",
  period: "July 2026, then iterated",
  teaser:
    "During the React migration the ASP.NET Core backend-for-frontend became the merge bottleneck: one 5,657-line endpoint file, 128 HTTP registrations, DI that could drift between production and tests. I led the extraction into feature-owned slices, guarded by OpenAPI snapshots.",
  summary:
    "During an incremental React migration, the ASP.NET Core backend-for-frontend was the integration point between a multi-tenant web application and its internal API — and its HTTP wiring, orchestration, contracts and test setup were concentrated in a few large shared files that every developer had to touch. I led the refactor into feature-owned endpoints, services, contracts and tests, protected by Swagger snapshots at every checkpoint: 307 operations preserved, zero handlers left in the composition root.",
  highlights: [
    "Central endpoint file 5,657 → 81 lines; 128 registrations → 0 handlers",
    "All 307 Swagger operations preserved at the staging cutover",
    "Running in testing, staging and production within roughly two weeks",
  ],
  role: "Architecture, extraction sequence, composition model, compatibility checks and release safety: mine. The feature logic that moved: its authors'.",
  stack,
  context: [
    "The BFF sits between a multi-tenant web application and its internal API and already exposed hundreds of operations. Its HTTP wiring, application orchestration, contracts and test infrastructure lived in a few large shared files: the main endpoint file had reached 5,657 lines with 128 HTTP registrations (133 verb-path operations across 19 tags), one shared service mixed unrelated domains, and production and test dependency registration could drift apart.",
    "With several developers building new React areas at the same time, everyone needed the same BFF surfaces. The structure had become a merge and coordination bottleneck more than a code-quality problem — and the goal was to make each feature independently understandable and changeable while preserving routes, payloads, status codes, authentication, tenant behaviour and frontend compatibility.",
  ],
  contribution: [
    "Inventoried the HTTP surface and froze it in Swagger/OpenAPI snapshots before moving anything.",
    "Designed the feature slice: React / RTK Query → /api/bff → feature endpoint module → feature service → user-scoped downstream API client → feature contract → frontend adapter and UI model.",
    "Introduced one shared composition method for dependency registration, used by both the production host and the test host, so the two could no longer diverge; session validation, tenant context and downstream API access stayed shared instead of being copied into each slice.",
    "Moved endpoint clusters, application logic and DTOs in controlled checkpoints, comparing route, operation ID, tag and payload metadata with the baseline after each step.",
    "Added startup, route, operation-ID, tag and dependency-resolution guardrails, plus an explicit build/freshness check after discovering that a stale compiled assembly could make the Swagger comparison pass falsely.",
    "Wrote Markdown and HTML onboarding material for developers working in the new structure, and later optimized the local quality gate and the shared test fixtures when the first version proved too slow for everyday pull-request work.",
  ],
  decisions: [
    {
      title: "Extraction, not rewrite",
      body: "Existing feature logic kept its behaviour and its authors. My responsibility was the boundaries, the sequence and the safety net, not re-implementing business rules.",
    },
    {
      title: "Contract first",
      body: "OpenAPI snapshots defined what 'unchanged' meant: routes, payload shapes, status codes, authentication and tenant behaviour had to match the baseline at every checkpoint before the next one started.",
    },
    {
      title: "One composition root for production and tests",
      body: "The same registration catalogue feeds both hosts. Cross-cutting concerns stay shared; a slice owns only what is specific to its feature.",
    },
    {
      title: "Strict gate first, then make it cheap",
      body: "The first quality gate protected contracts and tests but asked developers to remember extra steps, and some local checks were slow enough to interrupt normal PR work. Keeping the protection while cutting the cost was the second half of the job.",
    },
  ],
  difficulty: [
    "The refactor had to run while the same files were being changed by other developers for new features, so it moved in checkpoints small enough to merge and verify — never as one long-lived branch.",
    "The false-green discovery mattered: a stale compiled assembly made the contract comparison pass although the code had changed. Making the guard build and check freshness first turned it from a comfort into a real safeguard.",
  ],
  results: [
    "At the staging cutover the central endpoint file went from 5,657 to 81 lines and from 128 registrations to zero handlers; dedicated endpoint files grew from 18 to 42, BFF service classes from 20 to 40 and feature contract files from 18 to 40, with all 307 Swagger operations preserved.",
    "The structure reached testing, staging and production and became the pattern the team uses. I observed no regressions caused by the extraction, and within roughly two weeks of identifying the bottleneck the modular structure was operating across the environments.",
    "New areas could be built in parallel without concentrating unrelated work in one endpoint, service, contract or test file; request paths became easier to trace, for people and for AI-assisted tooling alike.",
    "At a later snapshot the architecture had grown to 92 endpoint modules, 91 service classes and 93 contract files, still with no handlers in the composition root — growth that belongs to the whole team's product work, not to the refactor alone.",
  ],
  metrics: [
    {
      label: "Central endpoint file",
      before: "5,657 lines",
      after: "81 lines",
      note: "that file only; logic redistributed, not deleted",
    },
    {
      label: "HTTP handlers in the composition root",
      before: "128 registrations",
      after: "0",
    },
    { label: "Dedicated endpoint files", before: "18", after: "42" },
    { label: "BFF service classes", before: "20", after: "40" },
    { label: "Feature contract files", before: "18", after: "40" },
    {
      label: "Swagger operations",
      before: "307",
      after: "307",
      note: "preserved at the staging cutover",
    },
  ],
  limits: [
    "The line-count reduction applies to the central composition file: total BFF code and complexity were redistributed into feature boundaries, not cut by the same proportion.",
    "No independent metrics were kept for merge-conflict frequency, lead time, defect rate or hours saved. The rollout to every environment and the absence of regressions rest on direct engineering observation.",
    "The later counts (92 / 91 / 93) reflect continued team development, and the speed-up of the quality gate was not benchmarked.",
  ],
  proves:
    "I can take a shared bottleneck in a live backend and restructure it under a contract-preservation guarantee, in checkpoints the team can absorb — and then make the safeguards cheap enough to survive daily use.",
  team:
    "The extraction, the composition model and the guardrails were mine, with AI-assisted analysis and documentation under my review. The features moved into the new slices were written by teammates and remain theirs.",
  seoDescription:
    "Modularizing a 5,657-line ASP.NET Core backend-for-frontend into feature-owned endpoints, services, contracts and tests while preserving 307 OpenAPI operations: decisions, checkpoints, limits.",
};

const it: ProfessionalCaseStudy = {
  slug,
  title: "Trasformare un BFF monolitico in slice possedute dalle feature senza cambiare un contratto",
  eyebrow: "Architettura backend · Lavoro del team",
  period: "Luglio 2026, poi iterato",
  teaser:
    "Durante la migrazione a React il backend-for-frontend ASP.NET Core era diventato il collo di bottiglia dei merge: un file di endpoint da 5.657 righe, 128 registrazioni HTTP, una DI che poteva divergere tra produzione e test. Ho guidato l'estrazione in slice per feature, protetta da snapshot OpenAPI.",
  summary:
    "Durante una migrazione incrementale a React, il backend-for-frontend ASP.NET Core era il punto di integrazione tra una web application multi-tenant e la sua API interna — e wiring HTTP, orchestrazione, contratti e infrastruttura di test erano concentrati in pochi grandi file condivisi che ogni sviluppatore doveva toccare. Ho guidato il refactor in endpoint, servizi, contratti e test posseduti dalle feature, protetto da snapshot Swagger a ogni checkpoint: 307 operazioni preservate, zero handler rimasti nella composition root.",
  highlights: [
    "File centrale degli endpoint da 5.657 a 81 righe; da 128 registrazioni a 0 handler",
    "Tutte le 307 operazioni Swagger preservate al cutover su staging",
    "In esecuzione in testing, staging e produzione entro circa due settimane",
  ],
  role: "Architettura, sequenza di estrazione, modello di composizione, controlli di compatibilità e sicurezza del rilascio: miei. La logica delle feature spostate: dei rispettivi autori.",
  stack,
  context: [
    "Il BFF sta tra una web application multi-tenant e la sua API interna ed esponeva già centinaia di operazioni. Wiring HTTP, orchestrazione applicativa, contratti e infrastruttura di test vivevano in pochi grandi file condivisi: il file principale degli endpoint aveva raggiunto 5.657 righe con 128 registrazioni HTTP (133 operazioni verbo-path su 19 tag), un servizio condiviso mescolava domini non correlati, e la registrazione delle dipendenze di produzione e test poteva divergere.",
    "Con più sviluppatori al lavoro contemporaneamente sulle nuove aree React, tutti avevano bisogno delle stesse superfici BFF. La struttura era diventata un collo di bottiglia per merge e coordinamento più che un problema di qualità del codice — e l'obiettivo era rendere ogni feature comprensibile e modificabile in modo indipendente preservando route, payload, status code, autenticazione, comportamento tenant e compatibilità con il frontend.",
  ],
  contribution: [
    "Ho inventariato la superficie HTTP e l'ho congelata in snapshot Swagger/OpenAPI prima di spostare qualsiasi cosa.",
    "Ho progettato la slice per feature: React / RTK Query → /api/bff → modulo endpoint della feature → servizio della feature → client API downstream user-scoped → contratto della feature → adapter frontend e modello UI.",
    "Ho introdotto un unico metodo di composizione condiviso per la registrazione delle dipendenze, usato sia dall'host di produzione sia dal test host, così che i due non potessero più divergere; validazione della sessione, contesto tenant e accesso all'API downstream sono rimasti condivisi invece di essere copiati in ogni slice.",
    "Ho spostato gruppi di endpoint, logica applicativa e DTO in checkpoint controllati, confrontando dopo ogni passo route, operation ID, tag e metadati dei payload con la baseline.",
    "Ho aggiunto guard su startup, route, operation ID, tag e risoluzione delle dipendenze, più un controllo esplicito di build e freschezza dopo aver scoperto che un assembly compilato stantio poteva far passare falsamente il confronto Swagger.",
    "Ho scritto materiale di onboarding in Markdown e HTML per chi lavora nella nuova struttura e, più avanti, ho ottimizzato il quality gate locale e le fixture di test condivise quando la prima versione si è rivelata troppo lenta per il lavoro quotidiano sulle pull request.",
  ],
  decisions: [
    {
      title: "Estrazione, non riscrittura",
      body: "La logica esistente delle feature ha mantenuto comportamento e autori. La mia responsabilità erano i confini, la sequenza e la rete di sicurezza, non reimplementare le regole di business.",
    },
    {
      title: "Prima il contratto",
      body: "Gli snapshot OpenAPI definivano cosa significasse 'invariato': route, shape dei payload, status code, autenticazione e comportamento tenant dovevano corrispondere alla baseline a ogni checkpoint prima di iniziare il successivo.",
    },
    {
      title: "Una sola composition root per produzione e test",
      body: "Lo stesso catalogo di registrazioni alimenta entrambi gli host. Le responsabilità trasversali restano condivise; una slice possiede solo ciò che è specifico della sua feature.",
    },
    {
      title: "Prima un gate severo, poi renderlo economico",
      body: "Il primo quality gate proteggeva contratti e test ma chiedeva agli sviluppatori di ricordare passaggi extra, e alcune verifiche locali erano abbastanza lente da interrompere il normale lavoro sulle PR. Conservare la protezione riducendone il costo è stata la seconda metà del lavoro.",
    },
  ],
  difficulty: [
    "Il refactor doveva procedere mentre gli stessi file venivano modificati da altri sviluppatori per nuove feature, quindi è avanzato in checkpoint abbastanza piccoli da essere mergiati e verificati — mai come un'unica branch di lunga durata.",
    "La scoperta del falso verde è stata importante: un assembly compilato stantio faceva passare il confronto dei contratti anche se il codice era cambiato. Far sì che il guard compilasse e verificasse la freschezza per primo lo ha trasformato da conforto in vera protezione.",
  ],
  results: [
    "Al cutover su staging il file centrale degli endpoint è passato da 5.657 a 81 righe e da 128 registrazioni a zero handler; i file endpoint dedicati sono cresciuti da 18 a 42, le classi service del BFF da 20 a 40 e i file contratto per feature da 18 a 40, con tutte le 307 operazioni Swagger preservate.",
    "La struttura è arrivata in testing, staging e produzione ed è diventata il modello usato dal team. Non ho osservato regressioni causate dall'estrazione, e entro circa due settimane dall'identificazione del collo di bottiglia la struttura modulare era operativa nei vari ambienti.",
    "Nuove aree potevano essere sviluppate in parallelo senza concentrare lavori non correlati in un unico file di endpoint, servizio, contratto o test; i percorsi delle richieste sono diventati più facili da seguire, per le persone come per gli strumenti assistiti dall'AI.",
    "In uno snapshot successivo l'architettura era cresciuta a 92 moduli endpoint, 91 classi service e 93 file contratto, sempre senza handler nella composition root — una crescita che appartiene al lavoro di prodotto di tutto il team, non al solo refactor.",
  ],
  metrics: [
    {
      label: "File centrale degli endpoint",
      before: "5.657 righe",
      after: "81 righe",
      note: "solo quel file; logica redistribuita, non eliminata",
    },
    {
      label: "Handler HTTP nella composition root",
      before: "128 registrazioni",
      after: "0",
    },
    { label: "File endpoint dedicati", before: "18", after: "42" },
    { label: "Classi service del BFF", before: "20", after: "40" },
    { label: "File contratto per feature", before: "18", after: "40" },
    {
      label: "Operazioni Swagger",
      before: "307",
      after: "307",
      note: "preservate al cutover su staging",
    },
  ],
  limits: [
    "La riduzione delle righe riguarda il file centrale di composizione: codice e complessità totali del BFF sono stati redistribuiti in confini per feature, non tagliati nella stessa proporzione.",
    "Non sono state conservate metriche indipendenti su frequenza dei merge conflict, lead time, tasso di difetti o ore risparmiate. Il rollout in tutti gli ambienti e l'assenza di regressioni si basano sull'osservazione diretta durante il lavoro.",
    "I conteggi successivi (92 / 91 / 93) riflettono lo sviluppo continuo del team, e la velocizzazione del quality gate non è stata misurata con un benchmark.",
  ],
  proves:
    "So prendere un collo di bottiglia condiviso in un backend in produzione e ristrutturarlo con la garanzia di preservare i contratti, in checkpoint che il team può assorbire — e poi rendere le protezioni abbastanza economiche da sopravvivere all'uso quotidiano.",
  team:
    "Estrazione, modello di composizione e guard sono lavoro mio, con analisi e documentazione assistite dall'AI sotto la mia revisione. Le feature spostate nelle nuove slice sono state scritte da colleghi e restano loro.",
  seoDescription:
    "Modularizzare un backend-for-frontend ASP.NET Core da 5.657 righe in endpoint, servizi, contratti e test per feature preservando 307 operazioni OpenAPI: decisioni, checkpoint, limiti.",
};

const fr: ProfessionalCaseStudy = {
  slug,
  title: "Transformer un BFF monolithique en tranches détenues par les features sans changer un contrat",
  eyebrow: "Architecture backend · Travail d'équipe",
  period: "Juillet 2026, puis itéré",
  teaser:
    "Pendant la migration React, le backend-for-frontend ASP.NET Core était devenu le goulot d'étranglement des merges : un fichier d'endpoints de 5 657 lignes, 128 enregistrements HTTP, une DI qui pouvait diverger entre production et tests. J'ai mené l'extraction en tranches par feature, protégée par des snapshots OpenAPI.",
  summary:
    "Pendant une migration incrémentale vers React, le backend-for-frontend ASP.NET Core était le point d'intégration entre une application web multi-tenant et son API interne — et son câblage HTTP, son orchestration, ses contrats et son infrastructure de tests étaient concentrés dans quelques gros fichiers partagés que chaque développeur devait toucher. J'ai mené le refactor vers des endpoints, services, contrats et tests détenus par les features, protégé par des snapshots Swagger à chaque étape : 307 opérations préservées, zéro handler restant dans la composition root.",
  highlights: [
    "Fichier central d'endpoints de 5 657 à 81 lignes ; de 128 enregistrements à 0 handler",
    "Les 307 opérations Swagger toutes préservées à la bascule en staging",
    "En service en testing, staging et production en environ deux semaines",
  ],
  role: "Architecture, séquence d'extraction, modèle de composition, contrôles de compatibilité et sécurité de release : les miens. La logique des features déplacées : celle de leurs auteurs.",
  stack,
  context: [
    "Le BFF se situe entre une application web multi-tenant et son API interne et exposait déjà des centaines d'opérations. Son câblage HTTP, son orchestration applicative, ses contrats et son infrastructure de tests vivaient dans quelques gros fichiers partagés : le fichier principal d'endpoints avait atteint 5 657 lignes avec 128 enregistrements HTTP (133 opérations verbe-chemin sur 19 tags), un service partagé mélangeait des domaines sans rapport, et l'enregistrement des dépendances de production et de test pouvait diverger.",
    "Avec plusieurs développeurs construisant de nouvelles zones React en même temps, tout le monde avait besoin des mêmes surfaces BFF. La structure était devenue un goulot d'étranglement de merge et de coordination plus qu'un problème de qualité de code — et l'objectif était de rendre chaque feature compréhensible et modifiable indépendamment tout en préservant routes, payloads, codes de statut, authentification, comportement tenant et compatibilité frontend.",
  ],
  contribution: [
    "J'ai inventorié la surface HTTP et l'ai figée dans des snapshots Swagger/OpenAPI avant de déplacer quoi que ce soit.",
    "J'ai conçu la tranche par feature : React / RTK Query → /api/bff → module d'endpoints de la feature → service de la feature → client API aval scoped par utilisateur → contrat de la feature → adaptateur frontend et modèle UI.",
    "J'ai introduit une méthode de composition partagée unique pour l'enregistrement des dépendances, utilisée par l'hôte de production et par l'hôte de test, pour que les deux ne puissent plus diverger ; validation de session, contexte tenant et accès à l'API aval sont restés partagés au lieu d'être copiés dans chaque tranche.",
    "J'ai déplacé des groupes d'endpoints, la logique applicative et les DTO par étapes contrôlées, en comparant après chaque pas routes, operation ID, tags et métadonnées de payload avec la baseline.",
    "J'ai ajouté des garde-fous au démarrage, sur les routes, les operation ID, les tags et la résolution des dépendances, plus un contrôle explicite de build et de fraîcheur après avoir découvert qu'un assembly compilé obsolète pouvait faire passer à tort la comparaison Swagger.",
    "J'ai rédigé du matériel d'onboarding en Markdown et HTML pour les développeurs travaillant dans la nouvelle structure, puis j'ai optimisé le quality gate local et les fixtures de test partagées quand la première version s'est révélée trop lente pour le travail quotidien sur les pull requests.",
  ],
  decisions: [
    {
      title: "Extraction, pas réécriture",
      body: "La logique existante des features a gardé son comportement et ses auteurs. Ma responsabilité portait sur les frontières, la séquence et le filet de sécurité, pas sur la réimplémentation des règles métier.",
    },
    {
      title: "Le contrat d'abord",
      body: "Les snapshots OpenAPI définissaient ce que « inchangé » voulait dire : routes, formes de payload, codes de statut, authentification et comportement tenant devaient correspondre à la baseline à chaque étape avant d'entamer la suivante.",
    },
    {
      title: "Une seule composition root pour la production et les tests",
      body: "Le même catalogue d'enregistrements alimente les deux hôtes. Les préoccupations transversales restent partagées ; une tranche ne possède que ce qui est propre à sa feature.",
    },
    {
      title: "Un gate strict d'abord, puis le rendre peu coûteux",
      body: "Le premier quality gate protégeait contrats et tests mais demandait aux développeurs de se souvenir d'étapes supplémentaires, et certains contrôles locaux étaient assez lents pour interrompre le travail normal sur les PR. Garder la protection en réduisant le coût a été la seconde moitié du travail.",
    },
  ],
  difficulty: [
    "Le refactor devait avancer pendant que les mêmes fichiers étaient modifiés par d'autres développeurs pour de nouvelles features : il a donc progressé par étapes assez petites pour être mergées et vérifiées — jamais comme une seule branche de longue durée.",
    "La découverte du faux vert a compté : un assembly compilé obsolète faisait passer la comparaison des contrats alors que le code avait changé. Faire construire et vérifier la fraîcheur au garde-fou en premier l'a transformé d'un confort en une vraie protection.",
  ],
  results: [
    "À la bascule en staging, le fichier central d'endpoints est passé de 5 657 à 81 lignes et de 128 enregistrements à zéro handler ; les fichiers d'endpoints dédiés sont passés de 18 à 42, les classes de service du BFF de 20 à 40 et les fichiers de contrat par feature de 18 à 40, avec les 307 opérations Swagger toutes préservées.",
    "La structure a atteint testing, staging et production et est devenue le modèle utilisé par l'équipe. Je n'ai observé aucune régression causée par l'extraction, et environ deux semaines après l'identification du goulot d'étranglement la structure modulaire fonctionnait dans tous les environnements.",
    "De nouvelles zones pouvaient être construites en parallèle sans concentrer des travaux sans rapport dans un même fichier d'endpoint, de service, de contrat ou de test ; les chemins des requêtes sont devenus plus faciles à suivre, pour les personnes comme pour l'outillage assisté par IA.",
    "Sur un snapshot ultérieur, l'architecture avait grandi à 92 modules d'endpoints, 91 classes de service et 93 fichiers de contrat, toujours sans handler dans la composition root — une croissance qui appartient au travail produit de toute l'équipe, pas au seul refactor.",
  ],
  metrics: [
    {
      label: "Fichier central d'endpoints",
      before: "5 657 lignes",
      after: "81 lignes",
      note: "ce fichier uniquement ; logique redistribuée, pas supprimée",
    },
    {
      label: "Handlers HTTP dans la composition root",
      before: "128 enregistrements",
      after: "0",
    },
    { label: "Fichiers d'endpoints dédiés", before: "18", after: "42" },
    { label: "Classes de service du BFF", before: "20", after: "40" },
    { label: "Fichiers de contrat par feature", before: "18", after: "40" },
    {
      label: "Opérations Swagger",
      before: "307",
      after: "307",
      note: "préservées à la bascule en staging",
    },
  ],
  limits: [
    "La réduction du nombre de lignes concerne le fichier central de composition : le code et la complexité totale du BFF ont été redistribués dans des frontières par feature, pas réduits dans la même proportion.",
    "Aucune métrique indépendante n'a été conservée sur la fréquence des conflits de merge, le lead time, le taux de défauts ou les heures économisées. Le déploiement dans tous les environnements et l'absence de régressions reposent sur l'observation directe pendant le travail.",
    "Les comptages ultérieurs (92 / 91 / 93) reflètent le développement continu de l'équipe, et l'accélération du quality gate n'a pas fait l'objet d'un benchmark.",
  ],
  proves:
    "Je sais prendre un goulot d'étranglement partagé dans un backend en production et le restructurer sous garantie de préservation des contrats, par étapes que l'équipe peut absorber — puis rendre les protections assez peu coûteuses pour survivre à l'usage quotidien.",
  team:
    "L'extraction, le modèle de composition et les garde-fous sont mon travail, avec une analyse et une documentation assistées par IA sous ma revue. Les features déplacées dans les nouvelles tranches ont été écrites par des collègues et restent les leurs.",
  seoDescription:
    "Modulariser un backend-for-frontend ASP.NET Core de 5 657 lignes en endpoints, services, contrats et tests par feature en préservant 307 opérations OpenAPI : décisions, étapes, limites.",
};

const de: ProfessionalCaseStudy = {
  slug,
  title: "Einen monolithischen BFF in Feature-Slices zerlegen, ohne einen Vertrag zu ändern",
  eyebrow: "Backend-Architektur · Teamarbeit",
  period: "Juli 2026, danach iteriert",
  teaser:
    "Während der React-Migration war das ASP.NET-Core-Backend-for-Frontend zum Merge-Engpass geworden: eine Endpunktdatei mit 5'657 Zeilen, 128 HTTP-Registrierungen, eine DI, die zwischen Produktion und Tests auseinanderlaufen konnte. Ich habe die Extraktion in Slices pro Feature geleitet, abgesichert durch OpenAPI-Snapshots.",
  summary:
    "Während einer inkrementellen React-Migration war das ASP.NET-Core-Backend-for-Frontend der Integrationspunkt zwischen einer mandantenfähigen Webanwendung und ihrer internen API — und HTTP-Verdrahtung, Orchestrierung, Verträge und Testaufbau lagen in wenigen grossen geteilten Dateien, die jeder Entwickler anfassen musste. Ich habe den Refactor in Endpunkte, Services, Verträge und Tests pro Feature geleitet, abgesichert durch Swagger-Snapshots an jedem Kontrollpunkt: 307 Operationen erhalten, null Handler in der Composition Root übrig.",
  highlights: [
    "Zentrale Endpunktdatei von 5'657 auf 81 Zeilen; von 128 Registrierungen auf 0 Handler",
    "Alle 307 Swagger-Operationen beim Staging-Umschalten erhalten",
    "In Testing, Staging und Produktion in Betrieb innerhalb von rund zwei Wochen",
  ],
  role: "Architektur, Extraktionsreihenfolge, Kompositionsmodell, Kompatibilitätsprüfungen und Release-Sicherheit: meine. Die verschobene Feature-Logik: die ihrer Autoren.",
  stack,
  context: [
    "Der BFF sitzt zwischen einer mandantenfähigen Webanwendung und ihrer internen API und exponierte bereits Hunderte Operationen. HTTP-Verdrahtung, Anwendungsorchestrierung, Verträge und Testinfrastruktur lebten in wenigen grossen geteilten Dateien: Die Hauptendpunktdatei hatte 5'657 Zeilen mit 128 HTTP-Registrierungen erreicht (133 Verb-Pfad-Operationen über 19 Tags), ein geteilter Service vermischte fachfremde Domänen, und die Abhängigkeitsregistrierung von Produktion und Tests konnte auseinanderlaufen.",
    "Mit mehreren Entwicklern, die gleichzeitig neue React-Bereiche bauten, brauchten alle dieselben BFF-Flächen. Die Struktur war eher zum Merge- und Koordinationsengpass geworden als zu einem Codequalitätsproblem — und das Ziel war, jedes Feature unabhängig verständlich und änderbar zu machen und dabei Routen, Payloads, Statuscodes, Authentifizierung, Mandantenverhalten und Frontend-Kompatibilität zu erhalten.",
  ],
  contribution: [
    "Die HTTP-Fläche inventarisiert und in Swagger/OpenAPI-Snapshots eingefroren, bevor irgendetwas bewegt wurde.",
    "Die Feature-Slice entworfen: React / RTK Query → /api/bff → Endpunktmodul des Features → Service des Features → benutzerbezogener Client der nachgelagerten API → Vertrag des Features → Frontend-Adapter und UI-Modell.",
    "Eine einzige gemeinsame Kompositionsmethode für die Abhängigkeitsregistrierung eingeführt, genutzt vom Produktions- und vom Test-Host, damit beide nicht mehr auseinanderlaufen können; Session-Validierung, Mandantenkontext und Zugriff auf die nachgelagerte API blieben geteilt statt in jede Slice kopiert.",
    "Endpunktgruppen, Anwendungslogik und DTOs in kontrollierten Kontrollpunkten verschoben und nach jedem Schritt Routen, Operation-IDs, Tags und Payload-Metadaten mit der Baseline verglichen.",
    "Absicherungen für Start, Routen, Operation-IDs, Tags und Abhängigkeitsauflösung ergänzt, plus eine explizite Build- und Aktualitätsprüfung, nachdem sich zeigte, dass eine veraltete kompilierte Assembly den Swagger-Vergleich fälschlich bestehen lassen konnte.",
    "Onboarding-Material in Markdown und HTML für Entwickler in der neuen Struktur geschrieben und später das lokale Quality Gate und die gemeinsamen Test-Fixtures optimiert, als sich die erste Version für die tägliche Pull-Request-Arbeit als zu langsam erwies.",
  ],
  decisions: [
    {
      title: "Extraktion, kein Neuschreiben",
      body: "Bestehende Feature-Logik behielt Verhalten und Autoren. Meine Verantwortung waren die Grenzen, die Reihenfolge und das Sicherheitsnetz, nicht das Neuimplementieren fachlicher Regeln.",
    },
    {
      title: "Vertrag zuerst",
      body: "OpenAPI-Snapshots definierten, was «unverändert» bedeutet: Routen, Payload-Formen, Statuscodes, Authentifizierung und Mandantenverhalten mussten an jedem Kontrollpunkt der Baseline entsprechen, bevor der nächste begann.",
    },
    {
      title: "Eine Composition Root für Produktion und Tests",
      body: "Derselbe Registrierungskatalog speist beide Hosts. Querschnittsbelange bleiben geteilt; eine Slice besitzt nur, was für ihr Feature spezifisch ist.",
    },
    {
      title: "Erst ein strenges Gate, dann günstig machen",
      body: "Das erste Quality Gate schützte Verträge und Tests, verlangte aber von Entwicklern, zusätzliche Schritte zu merken, und einige lokale Prüfungen waren langsam genug, um die normale PR-Arbeit zu unterbrechen. Den Schutz zu behalten und die Kosten zu senken war die zweite Hälfte der Arbeit.",
    },
  ],
  difficulty: [
    "Der Refactor musste laufen, während dieselben Dateien von anderen Entwicklern für neue Features geändert wurden, also bewegte er sich in Kontrollpunkten, die klein genug zum Mergen und Verifizieren waren — nie als ein einzelner langlebiger Branch.",
    "Die Entdeckung des falschen Grüns war wichtig: Eine veraltete kompilierte Assembly liess den Vertragsvergleich bestehen, obwohl sich der Code geändert hatte. Die Absicherung zuerst bauen und Aktualität prüfen zu lassen, machte aus einer Beruhigung einen echten Schutz.",
  ],
  results: [
    "Beim Staging-Umschalten ging die zentrale Endpunktdatei von 5'657 auf 81 Zeilen und von 128 Registrierungen auf null Handler; dedizierte Endpunktdateien wuchsen von 18 auf 42, BFF-Service-Klassen von 20 auf 40 und Feature-Vertragsdateien von 18 auf 40, mit allen 307 erhaltenen Swagger-Operationen.",
    "Die Struktur erreichte Testing, Staging und Produktion und wurde zum Muster, das das Team verwendet. Ich habe keine durch die Extraktion verursachten Regressionen beobachtet, und innerhalb von rund zwei Wochen nach Erkennen des Engpasses lief die modulare Struktur in allen Umgebungen.",
    "Neue Bereiche konnten parallel gebaut werden, ohne fachfremde Arbeit in einer einzigen Endpunkt-, Service-, Vertrags- oder Testdatei zu konzentrieren; Request-Pfade wurden leichter nachvollziehbar, für Menschen wie für KI-gestützte Werkzeuge.",
    "In einem späteren Snapshot war die Architektur auf 92 Endpunktmodule, 91 Service-Klassen und 93 Vertragsdateien gewachsen, weiterhin ohne Handler in der Composition Root — ein Wachstum, das der Produktarbeit des ganzen Teams gehört, nicht dem Refactor allein.",
  ],
  metrics: [
    {
      label: "Zentrale Endpunktdatei",
      before: "5'657 Zeilen",
      after: "81 Zeilen",
      note: "nur diese Datei; Logik umverteilt, nicht gelöscht",
    },
    {
      label: "HTTP-Handler in der Composition Root",
      before: "128 Registrierungen",
      after: "0",
    },
    { label: "Dedizierte Endpunktdateien", before: "18", after: "42" },
    { label: "BFF-Service-Klassen", before: "20", after: "40" },
    { label: "Feature-Vertragsdateien", before: "18", after: "40" },
    {
      label: "Swagger-Operationen",
      before: "307",
      after: "307",
      note: "beim Staging-Umschalten erhalten",
    },
  ],
  limits: [
    "Die Zeilenreduktion betrifft die zentrale Kompositionsdatei: Gesamtcode und Komplexität des BFF wurden in Feature-Grenzen umverteilt, nicht im selben Verhältnis gekürzt.",
    "Es wurden keine unabhängigen Kennzahlen zu Merge-Konflikthäufigkeit, Durchlaufzeit, Fehlerrate oder eingesparten Stunden aufbewahrt. Der Rollout in alle Umgebungen und das Ausbleiben von Regressionen beruhen auf direkter Beobachtung während der Arbeit.",
    "Die späteren Zählungen (92 / 91 / 93) spiegeln die fortlaufende Teamentwicklung, und die Beschleunigung des Quality Gate wurde nicht gemessen.",
  ],
  proves:
    "Ich kann einen geteilten Engpass in einem produktiven Backend unter Vertragsgarantie umstrukturieren, in Kontrollpunkten, die das Team verkraftet — und die Absicherungen danach so günstig machen, dass sie den täglichen Gebrauch überstehen.",
  team:
    "Extraktion, Kompositionsmodell und Absicherungen waren meine Arbeit, mit KI-gestützter Analyse und Dokumentation unter meinem Review. Die in die neuen Slices verschobenen Features wurden von Teamkollegen geschrieben und bleiben ihre.",
  seoDescription:
    "Ein ASP.NET-Core-Backend-for-Frontend mit 5'657 Zeilen in Endpunkte, Services, Verträge und Tests pro Feature zerlegen und dabei 307 OpenAPI-Operationen erhalten: Entscheidungen, Kontrollpunkte, Grenzen.",
};

export const bffModularization: Record<Locale, ProfessionalCaseStudy> = {
  en,
  it,
  fr,
  de,
};
