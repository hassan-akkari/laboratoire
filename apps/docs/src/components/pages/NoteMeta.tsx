import type { Note, NoteStage } from "../../content/notes.schema";
import type { Locale } from "../../i18n/locale";
import type { Messages } from "../../i18n/messages";

const STAGE_ICON: Record<NoteStage, string> = {
  seedling: "🌱",
  budding: "🌿",
  evergreen: "🌲",
};

function formatDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

type NoteMetaProps = {
  note: Note;
  locale: Locale;
  labels: Messages;
};

/** Stage badge + dates + tags — shared by the index cards and the article header. */
export default function NoteMeta({ note, locale, labels }: NoteMetaProps) {
  const t = labels.notes;
  const wasTended = note.updatedAt !== note.createdAt;

  return (
    <div className="note-meta">
      <span className="note-stage">
        <span aria-hidden="true">{STAGE_ICON[note.stage]}</span>
        {t.stages[note.stage]}
      </span>
      <span>
        {t.plantedLabel} {formatDate(note.createdAt, locale)}
      </span>
      {wasTended && (
        <span>
          {t.tendedLabel} {formatDate(note.updatedAt, locale)}
        </span>
      )}
      {note.tags.map((tag) => (
        <span key={tag} className="note-tag">
          {tag}
        </span>
      ))}
    </div>
  );
}
