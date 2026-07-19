"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { Note, NoteStage } from "../../content/notes.schema";
import { NOTE_STAGES } from "../../content/notes.schema";
import { computeTagCounts } from "../../content/notesGraph";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import type { Messages } from "../../i18n/messages";
import NoteMeta from "./NoteMeta";

const STAGE_ICON: Record<NoteStage, string> = {
  seedling: "🌱",
  budding: "🌿",
  evergreen: "🌲",
};

type NotesExplorerProps = {
  locale: Locale;
  labels: Messages;
  notes: Note[];
};

/**
 * Client island for the index: growth-stage + topic filter chips (with
 * counts, Maggie-Appleton style) over the prerendered notes payload. The
 * full list arrives from the server component, so the unfiltered view is
 * in the static HTML — filtering is progressive enhancement only.
 */
export default function NotesExplorer({
  locale,
  labels,
  notes,
}: NotesExplorerProps) {
  const t = labels.notes;
  const [stage, setStage] = useState<NoteStage | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  const stageCounts = useMemo(() => {
    const counts = { seedling: 0, budding: 0, evergreen: 0 };
    for (const note of notes) counts[note.stage] += 1;
    return counts;
  }, [notes]);

  const tagCounts = useMemo(() => computeTagCounts(notes), [notes]);

  const filtered = notes.filter(
    (note) =>
      (stage === null || note.stage === stage) &&
      (tag === null || note.tags.includes(tag)),
  );

  return (
    <>
      <div className="notes-filters">
        <div
          className="notes-filter-row"
          role="group"
          aria-label={t.filterStages}
        >
          <button
            type="button"
            className={`note-filter-chip${stage === null ? " is-active" : ""}`}
            aria-pressed={stage === null}
            onClick={() => setStage(null)}
          >
            {t.filterAll}
          </button>
          {NOTE_STAGES.filter((s) => stageCounts[s] > 0).map((s) => (
            <button
              key={s}
              type="button"
              className={`note-filter-chip${stage === s ? " is-active" : ""}`}
              aria-pressed={stage === s}
              onClick={() => setStage(stage === s ? null : s)}
            >
              <span aria-hidden="true">{STAGE_ICON[s]}</span> {t.stages[s]}{" "}
              <span className="note-filter-chip__count">{stageCounts[s]}</span>
            </button>
          ))}
        </div>
        <div
          className="notes-filter-row"
          role="group"
          aria-label={t.filterTags}
        >
          <button
            type="button"
            className={`note-filter-chip${tag === null ? " is-active" : ""}`}
            aria-pressed={tag === null}
            onClick={() => setTag(null)}
          >
            {t.filterAll}
          </button>
          {tagCounts.map(({ tag: name, count }) => (
            <button
              key={name}
              type="button"
              className={`note-filter-chip${tag === name ? " is-active" : ""}`}
              aria-pressed={tag === name}
              onClick={() => setTag(tag === name ? null : name)}
            >
              #{name}{" "}
              <span className="note-filter-chip__count">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="notes-subtitle">{t.empty}</p>
      ) : (
        <ul className="notes-list">
          {filtered.map((note) => (
            <li key={note.slug} className="note-card">
              <h2>
                <Link href={localePath(locale, `/notes/${note.slug}`)}>
                  {note.title}
                </Link>
              </h2>
              <p className="note-summary">{note.summary}</p>
              <NoteMeta note={note} locale={locale} labels={labels} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
