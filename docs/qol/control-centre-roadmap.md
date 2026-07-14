# Sistema QoL — Control Centre roadmap

Documento operativo per trasformare il concept `vault → DB → sito` in una serie di milestone piccole, verificabili e riusabili.

> **Stato al 2026-07-14 (branch `claude/qol-control-centre-9fsas9`)**: F1 implementata
> (`apps/docs/scripts/vault-sync.ts` + route `/notes`, vedi `docs/digital-garden.md`);
> in più esiste `apps/control-centre` (dashboard locale, `pnpm dev:centre`) che copre
> in versione mock-but-working i moduli di F2/F5: tracker, scout, triage inbox,
> pannello garden e digest git. Restano da fare: note reali dal vault, deploy, F3, F4.

## Direzione

L'obiettivo non è costruire dieci automazioni isolate, ma una spina dorsale unica:

```text
Obsidian vault → sync script → content store → API/build layer → itshassan.it
                         ↘ MCP / digest / job-search automations
```

La regola di sicurezza iniziale è semplice: solo le note con `publish: true` nel frontmatter escono dal vault. Tutto il resto resta privato.

## Principi di implementazione

- **Prima visibile, poi sofisticato**: partire con una pipeline statica per vedere `/notes` online, poi migrare al database senza riscrivere tutto.
- **Una sorgente, più destinazioni**: il parser del vault deve produrre un modello normalizzato indipendente dal target (`json`, Supabase, MCP, digest).
- **Frontmatter come contratto**: ogni automazione legge metadati espliciti, non inferenze fragili.
- **No cantieri infiniti**: ogni fase deve avere un output dimostrabile e uno stop naturale.
- **Privacy by default**: nessuna nota pubblicata senza flag esplicito; log e preview devono mostrare cosa verrebbe pubblicato prima di scrivere.

## Decisione F1: confine PC → GitHub

Scelta consigliata: **script nel monorepo**.

Il vault resta sul PC come sorgente privata. Nel monorepo vive solo il sync tool e l'artifact pubblico generato, per esempio `apps/docs/src/content/data/notes.generated.json`. Il flusso F1 diventa:

```text
Obsidian locale → pnpm vault:sync --dry-run → notes.generated.json → commit → Vercel deploy
```

Perché questa è la scelta giusta all'inizio:

- **minimo numero di pezzi**: niente repo privato extra, PAT, GitHub Action dedicata o database prematuro;
- **debug locale semplice**: se una nota non passa la validazione, lo vedi sul PC prima che tocchi GitHub;
- **privacy più controllabile**: il commit contiene solo l'artifact filtrato, non il vault completo;
- **migrazione pulita**: quando arriva Supabase, cambia il target di scrittura, non il parser;
- **deploy già allineato al repo**: Vercel vede una normale modifica del sito e non deve conoscere il vault.

Alternative tenute fuori da F1:

- **Vault come repo privato + Action**: utile più avanti se vuoi automazione totale e diario Git del vault, ma aggiunge subito segreti, permessi e una seconda pipeline da mantenere.
- **Direct-to-Supabase**: è la destinazione della F3, non il primo passo. Altrimenti devi risolvere DB, API, RLS e sincronizzazione prima di aver validato la UX di una singola nota online.

Regola pratica: F1 deve attraversare il confine PC → GitHub solo con dati già pubblicabili e già validati.

## Contratto minimo delle note

```yaml
---
title: "Titolo pubblico"
slug: "titolo-pubblico"
publish: true
stage: seedling # seedling | budding | evergreen
tags:
  - react
  - ai-product-engineering
updated: 2026-07-14
summary: "Sintesi breve mostrata nella lista note."
---
```

Campi consigliati per la fase successiva:

```yaml
canonical: "https://itshassan.it/notes/titolo-pubblico"
lang: it
visibility: public # public | unlisted
source: obsidian
```

## Suddivisione in stream

### Stream 1 — Digital garden sul sito

Scopo: rendere pubblicabili 3–5 note vere su `itshassan.it/notes`.

1. Definire schema frontmatter e validazione.
2. Scrivere parser del vault con modalità `dry-run`.
3. Generare un artifact statico (`notes.generated.json` o MDX normalizzato).
4. Aggiungere route `/notes` e pagina dettaglio nota nel portfolio.
5. Gestire wikilink base: `[[Nota]]` → link interno se pubblicata, testo neutro se privata/mancante.
6. Aggiungere preview locale prima del deploy.

Output di fase:

- indice note;
- dettaglio nota;
- badge `seedling/budding/evergreen`;
- tags;
- 3–5 contenuti reali.

### Stream 2 — Sync engine riusabile

Scopo: evitare che lo script statico diventi usa-e-getta.

Modulo suggerito:

```text
readVaultFiles()
parseFrontmatter()
validatePublicNote()
normalizeMarkdown()
extractWikilinks()
writeTarget(target)
```

Target iniziali:

- `static-json`: scrive file nel repo;
- `dry-run`: stampa cosa cambierebbe;
- `supabase`: arriva in fase 3.

### Stream 3 — Supabase/Postgres

Scopo: trasformare il garden in un progetto spendibile e con ricerca seria.

Tabelle iniziali:

- `notes`: contenuto normalizzato, slug, titolo, stage, summary, timestamps;
- `note_tags`: relazione nota/tag;
- `note_links`: backlink estratti dai wikilink;
- opzionale `note_events`: page view, refresh, cambio stage.

Funzioni da sbloccare:

- upsert da sync script;
- RLS read-only per client anonimo;
- full-text search con indice GIN;
- grafo backlink come query.

### Stream 4 — Job search QoL

Scopo: togliere stato mentale, non costruire subito un'app.

Prima versione senza codice pesante:

1. definire tier list opportunità;
2. definire campi tracker candidature;
3. creare template Notion o tabella equivalente;
4. usare routine mattutina assistita per shortlist;
5. generare follow-up da stato e ultimo contatto.

Campi tracker minimi:

- azienda;
- ruolo;
- paese/remoto;
- stack;
- range salariale;
- stato;
- ultimo contatto;
- prossimo follow-up;
- link annuncio;
- rationale/fit score.

### Stream 5 — Vault automation e digest

Scopo: fare manutenzione automatica della memoria.

Ordine consigliato:

1. import notturno export AI nel vault;
2. commit automatico con messaggio leggibile;
3. `git log --since=yesterday` come diario operativo;
4. weekly digest generato da commit, note nuove e tag caldi;
5. eventuale MCP server sul vault.

## Roadmap pratica

### F1 — Accendere il garden statico

Durata: un weekend.

Checklist:

- [ ] scegliere cartella Obsidian sorgente;
- [x] tenere lo script di sync nel monorepo (`apps/docs/scripts/vault-sync.ts`);
- [x] generare solo artifact pubblici dentro `apps/docs` (`src/content/data/notes.json`, allowlist `publish: true`);
- [x] definire frontmatter minimo (`apps/docs/src/content/notes.schema.ts` + `docs/digital-garden.md`);
- [ ] creare 3–5 note candidate (oggi: 3 note di esempio in `resources/vault-sample/`, da sostituire con note vere);
- [x] implementare `dry-run` (`pnpm -F docs vault:sync -- --vault … --dry-run`);
- [x] generare artifact statico;
- [x] creare `/notes` e pagina dettaglio (SSG, 4 locale, metadata per nota);
- [x] gestire wikilink base (pubblicata → link, privata → testo neutro);
- [ ] deploy controllato.

Criterio di done: URL pubblico con lista note e almeno tre note reali.

### F2 — Tracker candidature e job scout

Durata: una sera per il tracker, poi routine iterativa.

Checklist:

- [ ] definire stati candidatura;
- [ ] creare tracker;
- [ ] creare prompt/processo shortlist mattutina;
- [ ] definire regola follow-up;
- [ ] preparare template CV tailoring.

Criterio di done: ogni opportunità ha stato e prossimo passo visibile.

### F3 — Migrazione Supabase

Durata: un weekend.

Checklist:

- [ ] creare schema database;
- [ ] aggiungere target `supabase` allo script;
- [ ] configurare RLS read-only;
- [ ] implementare ricerca;
- [ ] sostituire lettura statica o aggiungere build-fetch;
- [ ] documentare rollback verso static JSON.

Criterio di done: stesse note servite dal database e ricerca funzionante.

### F4 — MCP server sul vault

Durata: fase successiva, dopo stabilizzazione dello schema.

Checklist:

- [ ] esporre query read-only sul vault o DB;
- [ ] strumenti minimi: search, get note, backlinks, recent changes;
- [ ] proteggere note private;
- [ ] testare con un client AI.

Criterio di done: un tool AI interroga la memoria senza copiare/incollare manuale.

### F5 — QoL di contorno

Durata: uno script a settimana.

Ordine consigliato:

1. import notturno + diario Git;
2. weekly digest;
3. triage Gmail;
4. briefing unico;
5. setup macchina riproducibile.

## Decisione consigliata

Partire da **F1 statico**, ma scrivere subito lo script come sync engine con target separati. In pratica: oggi costruisci `static-json`, domani aggiungi `supabase`. Così il primo risultato arriva velocemente e il lavoro resta riusabile.

## Primo task concreto

Creare una branch/issue dedicata a F1 con questo scope:

```text
Implementare una prima pipeline Obsidian → artifact statico → /notes.
Non includere Supabase, MCP, job scout o automazioni email.
```

Deliverable del primo PR:

- schema frontmatter documentato;
- script `dry-run`;
- artifact generato da fixture o note reali controllate;
- route `/notes`;
- README breve su come pubblicare una nota.
