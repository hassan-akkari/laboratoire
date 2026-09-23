import type { Locale } from "../../i18n/locale";
import type { ProfessionalCaseStudy } from "../professionalCaseStudies";

/**
 * Case study: cross-request header race on a shared HttpClient, July 2026.
 * Anonymized: no company, product, header names or infrastructure identifiers.
 * Test figures are the historical results of that release, not a re-run.
 */

const slug = "http-client-concurrency" as const;

const stack = [
  "ASP.NET Core",
  "C#",
  "HttpClient",
  "Polly",
  "Azure Application Insights",
  "NUnit",
];

const en: ProfessionalCaseStudy = {
  slug,
  title: "Eliminating a cross-request HttpClient header race in production",
  eyebrow: "Production incident · ASP.NET Core",
  period: "July 2026",
  teaser:
    "Intermittent 500s, broken sidebars and surprise logouts on a live multi-tenant platform, traced to shared mutable headers on a singleton HttpClient and fixed without touching a public contract.",
  summary:
    "Under real concurrency a live multi-tenant ASP.NET Core platform started failing in ways nobody could reproduce alone: sidebar errors, HTTP 500s, redirects to login. I traced the failures through Azure telemetry and the HTTP stack to shared mutable headers on a singleton HttpClient, replaced them with request-scoped messages, covered the race with tests and shipped the fix without changing any interface.",
  highlights: [
    "Root cause found from Azure telemetry and stack traces, not from a local reproduction",
    "12 targeted regression tests, including 2 users making 40 overlapping calls through one client",
    "Failures stopped recurring after deployment (operational observation)",
  ],
  role: "Diagnosis, fix, regression tests and release documentation, end to end.",
  stack,
  context: [
    "The web host of a multi-tenant ASP.NET Core platform calls a separate API on behalf of the logged-in user, forwarding that user's JWT together with a tenant/environment header. The service classes shared one singleton HttpClient and mutated its default headers before every call.",
    "Under real concurrency — several users logged in, overlapping calls — production began showing sidebar failures, HTTP 500 responses and unexpected redirects to the login page. Application Insights recorded failed dependencies with result code 0 and a NullReferenceException inside the HTTP connection's header-writing routine.",
  ],
  contribution: [
    "Correlated Azure telemetry, stack traces, historical code and the dependency-injection setup until the shared mutable state stood out as the common factor.",
    "Identified concurrent mutation of the client's default headers as the cause, and named the security risk it implied: an overlapping call could in theory carry another request's bearer token or tenant values.",
    "Replaced shared-header mutation with a fresh HttpRequestMessage for every attempt, sent through SendAsync, with the authorization, tenant, accept and API-key headers attached to that individual message.",
    "Re-created the request body for every Polly retry, corrected the environment value propagation that was consumed once and then lost, and stopped a failed page-catalogue lookup from being written to cache — successful results now carry an explicit five-minute TTL.",
    "Wrote the targeted regression suite and documented the change for the release.",
  ],
  decisions: [
    {
      title: "Request-scoped messages, not per-request clients",
      body: "A client per call would have removed the race but invited socket exhaustion and a rewrite of the registration. Keeping the singleton and moving every per-user value onto the HttpRequestMessage left the public interfaces and the DI setup untouched.",
    },
    {
      title: "No interface changes",
      body: "Frontend, BFF and API contracts stayed identical, so the fix shipped in a normal release with a trivial rollback.",
    },
    {
      title: "Fail closed",
      body: "The API keeps returning 401 when authentication is missing or invalid; the fix adds no fallback that could mask a missing token, and tokens stay out of error logs.",
    },
    {
      title: "Never cache a failure",
      body: "A temporary failure of the page catalogue used to be stored like a valid result and poison the sidebar for later requests. Only successful results are cached now, with a bounded TTL.",
    },
  ],
  difficulty: [
    "The failure was nondeterministic. It needed real overlap between users and never appeared in a single-user session, so the evidence had to be assembled from telemetry patterns and the internals of the HTTP stack rather than from a debugger.",
    "The tests had to force the race on purpose: two simulated users issuing 40 concurrent calls through the same singleton client, asserting that every call carried its own bearer and tenant values, plus sibling-task and cache-behaviour cases.",
  ],
  results: [
    "12 of 12 targeted regression tests passed: the 2-user × 40-call scenario, bearer and environment isolation, sibling tasks and cache behaviour.",
    "Release build with zero errors; the full suite reported 443 passing tests and 10 pre-existing baseline failures out of 453, unchanged by this work.",
    "No public frontend, BFF or API contract changed.",
    "After deployment the sidebar and login failures stopped recurring and the matching Application Insights errors were no longer observed.",
  ],
  metrics: [
    { label: "Targeted regression tests", value: "12 / 12 passed" },
    { label: "Concurrency scenario", value: "2 users × 40 overlapping calls" },
    {
      label: "Full suite (Release build)",
      value: "443 / 453 passing",
      note: "10 pre-existing baseline failures, unchanged",
    },
    { label: "Public contracts changed", value: "0" },
  ],
  limits: [
    "Post-deployment success is an operational observation: the user-facing failures stopped and the telemetry errors disappeared. No exported monitoring metric was retained.",
    "The cross-user token exposure was a credible risk created by shared headers, not a documented incident: no actual credential crossover was observed.",
    "Test counts are the historical results of July 2026, not a re-run made for this page.",
  ],
  proves:
    "I can trace a production failure across telemetry, framework internals and legacy code, fix it without breaking a contract, and prove the fix with tests that force the race.",
  team:
    "Diagnosis, fix and tests were my work. Deployment followed the team's normal release process.",
  seoDescription:
    "How I found and fixed a cross-request HttpClient header race in a live multi-tenant ASP.NET Core platform: telemetry, root cause, request-scoped fix, concurrency tests, limits.",
};

const it: ProfessionalCaseStudy = {
  slug,
  title: "Eliminare una race condition sugli header HttpClient in produzione",
  eyebrow: "Incidente in produzione · ASP.NET Core",
  period: "Luglio 2026",
  teaser:
    "Errori 500 intermittenti, sidebar rotte e logout improvvisi su una piattaforma multi-tenant attiva, riconducibili a header condivisi e mutabili su un HttpClient singleton. Risolti senza toccare un contratto pubblico.",
  summary:
    "Sotto concorrenza reale una piattaforma ASP.NET Core multi-tenant in produzione ha iniziato a fallire in modi che nessuno riusciva a riprodurre da solo: errori nella sidebar, HTTP 500, redirect al login. Ho ricostruito il guasto attraverso la telemetria Azure e lo stack HTTP fino agli header condivisi e mutabili di un HttpClient singleton, li ho sostituiti con messaggi per singola richiesta, ho coperto la race con test e ho rilasciato la correzione senza cambiare alcuna interfaccia.",
  highlights: [
    "Causa radice trovata da telemetria Azure e stack trace, non da una riproduzione locale",
    "12 test di regressione mirati, inclusi 2 utenti con 40 chiamate sovrapposte sullo stesso client",
    "Dopo il rilascio gli errori non si sono più ripresentati (osservazione operativa)",
  ],
  role: "Diagnosi, correzione, test di regressione e documentazione di rilascio, end to end.",
  stack,
  context: [
    "L'host web di una piattaforma ASP.NET Core multi-tenant chiama un'API separata per conto dell'utente autenticato, inoltrando il suo JWT insieme a un header di tenant/ambiente. Le classi di servizio condividevano un unico HttpClient singleton e ne modificavano gli header di default prima di ogni chiamata.",
    "Sotto concorrenza reale — più utenti connessi, chiamate sovrapposte — la produzione ha iniziato a mostrare errori nella sidebar, risposte HTTP 500 e redirect inattesi alla pagina di login. Application Insights registrava dipendenze fallite con result code 0 e una NullReferenceException nella routine di scrittura degli header della connessione HTTP.",
  ],
  contribution: [
    "Ho correlato telemetria Azure, stack trace, storico del codice e configurazione della dependency injection finché lo stato condiviso mutabile è emerso come fattore comune.",
    "Ho identificato la mutazione concorrente degli header di default del client come causa, esplicitando anche il rischio di sicurezza implicito: una chiamata sovrapposta poteva in teoria portare il bearer token o i valori tenant di un'altra richiesta.",
    "Ho sostituito la mutazione degli header condivisi con un nuovo HttpRequestMessage per ogni tentativo, inviato via SendAsync, con gli header di autorizzazione, tenant, accept e chiave API agganciati a quel singolo messaggio.",
    "Ho ricreato il corpo della richiesta a ogni retry di Polly, corretto la propagazione del valore ambiente che veniva consumato una volta e poi perso, e impedito che un lookup fallito del catalogo pagine finisse in cache — i risultati validi hanno ora un TTL esplicito di cinque minuti.",
    "Ho scritto la suite di regressione mirata e documentato il cambiamento per il rilascio.",
  ],
  decisions: [
    {
      title: "Messaggi per richiesta, non client per richiesta",
      body: "Un client per ogni chiamata avrebbe eliminato la race ma aperto la porta all'esaurimento dei socket e a una riscrittura della registrazione. Mantenere il singleton e spostare ogni valore per-utente sull'HttpRequestMessage ha lasciato intatte interfacce pubbliche e configurazione DI.",
    },
    {
      title: "Nessun cambio di interfaccia",
      body: "I contratti di frontend, BFF e API sono rimasti identici: la correzione è uscita in un rilascio normale, con rollback banale.",
    },
    {
      title: "Fail closed",
      body: "L'API continua a rispondere 401 quando l'autenticazione manca o non è valida; la correzione non aggiunge fallback che possano mascherare un token assente, e i token restano fuori dai log di errore.",
    },
    {
      title: "Mai mettere in cache un fallimento",
      body: "Un errore temporaneo del catalogo pagine veniva salvato come risultato valido e inquinava la sidebar per le richieste successive. Ora vanno in cache solo i risultati validi, con TTL limitato.",
    },
  ],
  difficulty: [
    "Il guasto era non deterministico. Richiedeva una sovrapposizione reale tra utenti e non compariva mai in una sessione singola, quindi le prove andavano ricostruite dai pattern della telemetria e dagli interni dello stack HTTP, non da un debugger.",
    "I test dovevano forzare la race di proposito: due utenti simulati che emettono 40 chiamate concorrenti sullo stesso client singleton, verificando che ogni chiamata portasse il proprio bearer e i propri valori tenant, più casi su task fratelli e sul comportamento della cache.",
  ],
  results: [
    "12 test di regressione mirati su 12 superati: scenario 2 utenti × 40 chiamate, isolamento di bearer e ambiente, task fratelli e comportamento della cache.",
    "Build Release senza errori; la suite completa riportava 443 test superati e 10 fallimenti preesistenti su 453, non toccati da questo lavoro.",
    "Nessun contratto pubblico di frontend, BFF o API è cambiato.",
    "Dopo il rilascio gli errori di sidebar e login non si sono più ripresentati e gli errori corrispondenti in Application Insights non sono stati più osservati.",
  ],
  metrics: [
    { label: "Test di regressione mirati", value: "12 / 12 superati" },
    { label: "Scenario di concorrenza", value: "2 utenti × 40 chiamate sovrapposte" },
    {
      label: "Suite completa (build Release)",
      value: "443 / 453 superati",
      note: "10 fallimenti preesistenti, invariati",
    },
    { label: "Contratti pubblici modificati", value: "0" },
  ],
  limits: [
    "Il successo post-rilascio è un'osservazione operativa: gli errori visibili agli utenti sono cessati e quelli in telemetria sono scomparsi. Non è stata conservata alcuna metrica di monitoraggio esportata.",
    "L'esposizione incrociata dei token era un rischio credibile creato dagli header condivisi, non un incidente documentato: nessuno scambio reale di credenziali è stato osservato.",
    "I conteggi dei test sono i risultati storici di luglio 2026, non una riesecuzione fatta per questa pagina.",
  ],
  proves:
    "So risalire a un guasto di produzione attraverso telemetria, interni del framework e codice legacy, correggerlo senza rompere un contratto e dimostrare la correzione con test che forzano la race.",
  team:
    "Diagnosi, correzione e test sono lavoro mio. Il rilascio ha seguito il normale processo del team.",
  seoDescription:
    "Come ho trovato e corretto una race condition sugli header HttpClient in una piattaforma ASP.NET Core multi-tenant in produzione: telemetria, causa radice, correzione per richiesta, test di concorrenza, limiti.",
};

const fr: ProfessionalCaseStudy = {
  slug,
  title: "Éliminer une race condition sur les en-têtes HttpClient en production",
  eyebrow: "Incident en production · ASP.NET Core",
  period: "Juillet 2026",
  teaser:
    "Erreurs 500 intermittentes, barres latérales cassées et déconnexions surprises sur une plateforme multi-tenant en production, remontées à des en-têtes partagés et mutables sur un HttpClient singleton. Corrigées sans toucher à un contrat public.",
  summary:
    "Sous concurrence réelle, une plateforme ASP.NET Core multi-tenant en production a commencé à échouer d'une façon que personne ne parvenait à reproduire seul : erreurs de barre latérale, HTTP 500, redirections vers le login. J'ai remonté la panne à travers la télémétrie Azure et la pile HTTP jusqu'aux en-têtes partagés et mutables d'un HttpClient singleton, je les ai remplacés par des messages propres à chaque requête, j'ai couvert la race par des tests et j'ai livré le correctif sans modifier aucune interface.",
  highlights: [
    "Cause racine trouvée à partir de la télémétrie Azure et des stack traces, pas d'une reproduction locale",
    "12 tests de régression ciblés, dont 2 utilisateurs émettant 40 appels simultanés sur le même client",
    "Après le déploiement, les échecs ne se sont plus reproduits (observation opérationnelle)",
  ],
  role: "Diagnostic, correctif, tests de régression et documentation de release, de bout en bout.",
  stack,
  context: [
    "L'hôte web d'une plateforme ASP.NET Core multi-tenant appelle une API séparée pour le compte de l'utilisateur connecté, en transmettant son JWT ainsi qu'un en-tête de tenant/environnement. Les classes de service partageaient un seul HttpClient singleton et modifiaient ses en-têtes par défaut avant chaque appel.",
    "Sous concurrence réelle — plusieurs utilisateurs connectés, appels qui se chevauchent — la production a commencé à afficher des erreurs de barre latérale, des réponses HTTP 500 et des redirections inattendues vers la page de login. Application Insights enregistrait des dépendances en échec avec le code résultat 0 et une NullReferenceException dans la routine d'écriture des en-têtes de la connexion HTTP.",
  ],
  contribution: [
    "J'ai corrélé la télémétrie Azure, les stack traces, l'historique du code et la configuration de l'injection de dépendances jusqu'à ce que l'état partagé mutable ressorte comme facteur commun.",
    "J'ai identifié la mutation concurrente des en-têtes par défaut du client comme cause, en nommant aussi le risque de sécurité impliqué : un appel qui se chevauche pouvait en théorie porter le bearer token ou les valeurs de tenant d'une autre requête.",
    "J'ai remplacé la mutation des en-têtes partagés par un nouveau HttpRequestMessage à chaque tentative, envoyé via SendAsync, avec les en-têtes d'autorisation, de tenant, d'accept et de clé API attachés à ce message précis.",
    "J'ai recréé le corps de la requête à chaque retry Polly, corrigé la propagation de la valeur d'environnement consommée une fois puis perdue, et empêché qu'un lookup échoué du catalogue de pages soit écrit en cache — les résultats valides portent désormais un TTL explicite de cinq minutes.",
    "J'ai écrit la suite de régression ciblée et documenté le changement pour la release.",
  ],
  decisions: [
    {
      title: "Des messages par requête, pas des clients par requête",
      body: "Un client par appel aurait supprimé la race mais ouvert la porte à l'épuisement des sockets et à une réécriture de l'enregistrement. Garder le singleton et déplacer chaque valeur par utilisateur sur le HttpRequestMessage a laissé intactes les interfaces publiques et la configuration DI.",
    },
    {
      title: "Aucun changement d'interface",
      body: "Les contrats du frontend, du BFF et de l'API sont restés identiques : le correctif est parti dans une release normale, avec un rollback trivial.",
    },
    {
      title: "Fail closed",
      body: "L'API continue de répondre 401 quand l'authentification manque ou est invalide ; le correctif n'ajoute aucun fallback susceptible de masquer un token absent, et les tokens restent hors des logs d'erreur.",
    },
    {
      title: "Ne jamais mettre un échec en cache",
      body: "Un échec temporaire du catalogue de pages était stocké comme un résultat valide et polluait la barre latérale pour les requêtes suivantes. Seuls les résultats valides sont désormais mis en cache, avec un TTL borné.",
    },
  ],
  difficulty: [
    "La panne était non déterministe. Elle exigeait un vrai chevauchement entre utilisateurs et n'apparaissait jamais en session isolée : les preuves devaient être assemblées à partir des motifs de télémétrie et des entrailles de la pile HTTP, pas d'un débogueur.",
    "Les tests devaient forcer la race volontairement : deux utilisateurs simulés émettant 40 appels concurrents sur le même client singleton, avec vérification que chaque appel portait son propre bearer et ses propres valeurs de tenant, plus des cas sur les tâches sœurs et le comportement du cache.",
  ],
  results: [
    "12 tests de régression ciblés sur 12 réussis : scénario 2 utilisateurs × 40 appels, isolation du bearer et de l'environnement, tâches sœurs et comportement du cache.",
    "Build Release sans erreur ; la suite complète rapportait 443 tests réussis et 10 échecs préexistants sur 453, non modifiés par ce travail.",
    "Aucun contrat public du frontend, du BFF ou de l'API n'a changé.",
    "Après le déploiement, les échecs de barre latérale et de login ne se sont plus reproduits et les erreurs correspondantes dans Application Insights n'ont plus été observées.",
  ],
  metrics: [
    { label: "Tests de régression ciblés", value: "12 / 12 réussis" },
    { label: "Scénario de concurrence", value: "2 utilisateurs × 40 appels simultanés" },
    {
      label: "Suite complète (build Release)",
      value: "443 / 453 réussis",
      note: "10 échecs préexistants, inchangés",
    },
    { label: "Contrats publics modifiés", value: "0" },
  ],
  limits: [
    "Le succès post-déploiement est une observation opérationnelle : les échecs visibles par les utilisateurs ont cessé et les erreurs de télémétrie ont disparu. Aucune métrique de monitoring exportée n'a été conservée.",
    "L'exposition croisée des tokens était un risque crédible créé par les en-têtes partagés, pas un incident documenté : aucun échange réel d'identifiants n'a été observé.",
    "Les comptages de tests sont les résultats historiques de juillet 2026, pas une réexécution faite pour cette page.",
  ],
  proves:
    "Je sais remonter une panne de production à travers la télémétrie, les entrailles du framework et du code legacy, la corriger sans casser un contrat, et prouver le correctif avec des tests qui forcent la race.",
  team:
    "Le diagnostic, le correctif et les tests sont mon travail. Le déploiement a suivi le processus de release habituel de l'équipe.",
  seoDescription:
    "Comment j'ai trouvé et corrigé une race condition sur les en-têtes HttpClient dans une plateforme ASP.NET Core multi-tenant en production : télémétrie, cause racine, correctif par requête, tests de concurrence, limites.",
};

const de: ProfessionalCaseStudy = {
  slug,
  title: "Eine Race Condition auf HttpClient-Headern in Produktion beseitigen",
  eyebrow: "Produktionsvorfall · ASP.NET Core",
  period: "Juli 2026",
  teaser:
    "Sporadische 500er, defekte Seitenleisten und überraschende Logouts auf einer produktiven mandantenfähigen Plattform, zurückgeführt auf geteilte, veränderbare Header eines Singleton-HttpClient. Behoben, ohne einen öffentlichen Vertrag anzufassen.",
  summary:
    "Unter echter Nebenläufigkeit begann eine produktive mandantenfähige ASP.NET-Core-Plattform auf eine Weise zu scheitern, die niemand allein reproduzieren konnte: Fehler in der Seitenleiste, HTTP 500, Weiterleitungen zum Login. Ich habe den Fehler über die Azure-Telemetrie und den HTTP-Stack bis zu den geteilten, veränderbaren Headern eines Singleton-HttpClient verfolgt, sie durch Nachrichten pro Anfrage ersetzt, die Race mit Tests abgedeckt und die Korrektur ausgeliefert, ohne eine Schnittstelle zu ändern.",
  highlights: [
    "Ursache aus Azure-Telemetrie und Stack Traces gefunden, nicht aus einer lokalen Reproduktion",
    "12 gezielte Regressionstests, darunter 2 Benutzer mit 40 überlappenden Aufrufen über einen Client",
    "Nach dem Deployment traten die Fehler nicht mehr auf (operative Beobachtung)",
  ],
  role: "Diagnose, Korrektur, Regressionstests und Release-Dokumentation, durchgehend.",
  stack,
  context: [
    "Der Web-Host einer mandantenfähigen ASP.NET-Core-Plattform ruft im Namen des angemeldeten Benutzers eine separate API auf und leitet dessen JWT zusammen mit einem Mandanten-/Umgebungs-Header weiter. Die Service-Klassen teilten sich einen einzigen Singleton-HttpClient und veränderten dessen Standard-Header vor jedem Aufruf.",
    "Unter echter Nebenläufigkeit — mehrere angemeldete Benutzer, überlappende Aufrufe — zeigte die Produktion Fehler in der Seitenleiste, HTTP-500-Antworten und unerwartete Weiterleitungen zur Login-Seite. Application Insights protokollierte fehlgeschlagene Abhängigkeiten mit Result Code 0 und eine NullReferenceException in der Header-Schreibroutine der HTTP-Verbindung.",
  ],
  contribution: [
    "Azure-Telemetrie, Stack Traces, Code-Historie und die Dependency-Injection-Konfiguration korreliert, bis der geteilte veränderbare Zustand als gemeinsamer Faktor hervortrat.",
    "Die nebenläufige Veränderung der Standard-Header des Clients als Ursache identifiziert und das damit verbundene Sicherheitsrisiko benannt: Ein überlappender Aufruf konnte theoretisch das Bearer-Token oder die Mandantenwerte einer anderen Anfrage tragen.",
    "Die Veränderung geteilter Header durch eine neue HttpRequestMessage pro Versuch ersetzt, gesendet über SendAsync, mit Autorisierungs-, Mandanten-, Accept- und API-Key-Headern an genau dieser Nachricht.",
    "Den Anfragekörper bei jedem Polly-Retry neu erzeugt, die Weitergabe des Umgebungswerts korrigiert, der einmal konsumiert und dann verloren ging, und verhindert, dass ein fehlgeschlagener Lookup des Seitenkatalogs in den Cache geschrieben wird — gültige Ergebnisse tragen jetzt eine explizite TTL von fünf Minuten.",
    "Die gezielte Regressionssuite geschrieben und die Änderung für das Release dokumentiert.",
  ],
  decisions: [
    {
      title: "Nachrichten pro Anfrage, nicht Clients pro Anfrage",
      body: "Ein Client pro Aufruf hätte die Race beseitigt, aber Socket-Erschöpfung und ein Umschreiben der Registrierung riskiert. Den Singleton zu behalten und jeden benutzerspezifischen Wert auf die HttpRequestMessage zu verlagern, liess öffentliche Schnittstellen und DI-Konfiguration unberührt.",
    },
    {
      title: "Keine Schnittstellenänderung",
      body: "Die Verträge von Frontend, BFF und API blieben identisch: Die Korrektur ging in einem normalen Release raus, mit trivialem Rollback.",
    },
    {
      title: "Fail closed",
      body: "Die API antwortet weiterhin mit 401, wenn die Authentifizierung fehlt oder ungültig ist; die Korrektur fügt keinen Fallback hinzu, der ein fehlendes Token verdecken könnte, und Tokens bleiben aus den Fehlerlogs.",
    },
    {
      title: "Niemals einen Fehlschlag cachen",
      body: "Ein vorübergehender Fehler des Seitenkatalogs wurde wie ein gültiges Ergebnis gespeichert und vergiftete die Seitenleiste für spätere Anfragen. Jetzt werden nur gültige Ergebnisse gecacht, mit begrenzter TTL.",
    },
  ],
  difficulty: [
    "Der Fehler war nicht deterministisch. Er brauchte echte Überlappung zwischen Benutzern und trat in einer Einzelsitzung nie auf, also mussten die Belege aus Telemetriemustern und den Interna des HTTP-Stacks zusammengesetzt werden, nicht aus einem Debugger.",
    "Die Tests mussten die Race absichtlich erzwingen: zwei simulierte Benutzer mit 40 gleichzeitigen Aufrufen über denselben Singleton-Client, mit der Prüfung, dass jeder Aufruf sein eigenes Bearer-Token und seine eigenen Mandantenwerte trägt, plus Fälle zu Geschwister-Tasks und Cache-Verhalten.",
  ],
  results: [
    "12 von 12 gezielten Regressionstests bestanden: Szenario 2 Benutzer × 40 Aufrufe, Isolation von Bearer und Umgebung, Geschwister-Tasks und Cache-Verhalten.",
    "Release-Build ohne Fehler; die vollständige Suite meldete 443 bestandene Tests und 10 vorbestehende Baseline-Fehler von 453, durch diese Arbeit unverändert.",
    "Kein öffentlicher Vertrag von Frontend, BFF oder API hat sich geändert.",
    "Nach dem Deployment traten die Seitenleisten- und Login-Fehler nicht mehr auf, und die entsprechenden Fehler in Application Insights wurden nicht mehr beobachtet.",
  ],
  metrics: [
    { label: "Gezielte Regressionstests", value: "12 / 12 bestanden" },
    { label: "Nebenläufigkeitsszenario", value: "2 Benutzer × 40 überlappende Aufrufe" },
    {
      label: "Vollständige Suite (Release-Build)",
      value: "443 / 453 bestanden",
      note: "10 vorbestehende Fehler, unverändert",
    },
    { label: "Geänderte öffentliche Verträge", value: "0" },
  ],
  limits: [
    "Der Erfolg nach dem Deployment ist eine operative Beobachtung: Die für Benutzer sichtbaren Fehler hörten auf, und die Telemetriefehler verschwanden. Eine exportierte Monitoring-Metrik wurde nicht aufbewahrt.",
    "Die kreuzweise Token-Exposition war ein glaubwürdiges, durch geteilte Header erzeugtes Risiko, kein dokumentierter Vorfall: Ein tatsächlicher Austausch von Zugangsdaten wurde nicht beobachtet.",
    "Die Testzahlen sind die historischen Ergebnisse von Juli 2026, kein erneuter Lauf für diese Seite.",
  ],
  proves:
    "Ich kann einen Produktionsfehler über Telemetrie, Framework-Interna und Legacy-Code nachverfolgen, ihn beheben, ohne einen Vertrag zu brechen, und die Korrektur mit Tests belegen, die die Race erzwingen.",
  team:
    "Diagnose, Korrektur und Tests waren meine Arbeit. Das Deployment folgte dem normalen Release-Prozess des Teams.",
  seoDescription:
    "Wie ich eine Race Condition auf HttpClient-Headern in einer produktiven mandantenfähigen ASP.NET-Core-Plattform gefunden und behoben habe: Telemetrie, Ursache, Korrektur pro Anfrage, Nebenläufigkeitstests, Grenzen.",
};

export const httpClientConcurrency: Record<Locale, ProfessionalCaseStudy> = {
  en,
  it,
  fr,
  de,
};
