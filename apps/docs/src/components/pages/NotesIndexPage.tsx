import Link from "next/link";

import "@/styles/notes.css";

import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Note } from "../../content/notes.schema";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import type { Messages } from "../../i18n/messages";
import NotesExplorer from "./NotesExplorer";

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
          <p className="notes-feed-link">
            <a href="/feed.xml">{t.feedLabel} ↗</a>
          </p>

          {notes.length === 0 ? (
            <p className="notes-subtitle">{t.empty}</p>
          ) : (
            <NotesExplorer locale={locale} labels={labels} notes={notes} />
          )}
        </div>
      </Container>
    </Section>
  );
}
