import Link from "next/link";

import "@/styles/notes.css";

import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Note } from "../../content/notes.schema";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import type { Messages } from "../../i18n/messages";
import NoteMeta from "./NoteMeta";

type NotesIndexPageProps = {
  locale: Locale;
  labels: Messages;
  notes: Note[];
};

export default function NotesIndexPage({
  locale,
  labels,
  notes,
}: NotesIndexPageProps) {
  const t = labels.notes;

  return (
    <Section id="notes">
      <Container>
        <div className="notes-page">
          <p className="notes-eyebrow">
            <Link href={localePath(locale)}>← {t.backToSite}</Link>
          </p>
          <h1 className="sub-title">{t.title}</h1>
          <p className="notes-subtitle">{t.subtitle}</p>
          {t.languageNote && (
            <p className="notes-language-note">{t.languageNote}</p>
          )}

          {notes.length === 0 ? (
            <p className="notes-subtitle">{t.empty}</p>
          ) : (
            <ul className="notes-list">
              {notes.map((note) => (
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
        </div>
      </Container>
    </Section>
  );
}
