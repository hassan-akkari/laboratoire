---
publish: true
title: "TIL: Postgres websearch_to_tsquery"
stage: budding
tags: [postgres, search, til]
created: 2026-06-29
updated: 2026-07-08
---

# TIL: Postgres websearch_to_tsquery

Postgres ships a full-text query parser that understands **Google-like syntax** out of the box — quoted phrases, `OR`, and `-exclusions` — no hand-rolled parser required:

```sql
SELECT title
FROM notes
WHERE search_vector @@ websearch_to_tsquery('english', '"row level security" OR rls -mysql');
```

Unlike `to_tsquery`, it never throws on user input: garbage in, empty result out. That makes it safe to wire a search box straight to it.

The setup is two lines of DDL — a generated column plus a GIN index:

```sql
ALTER TABLE notes ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED;

CREATE INDEX notes_search_idx ON notes USING gin (search_vector);
```

This is the search engine planned for this very garden once it moves from static JSON to Postgres. Implementation notes live in [[Garden pipeline internals]].
