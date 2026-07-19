import Link from "next/link";

import "@/styles/notes.css";

import Container from "../layout/Container";
import Section from "../layout/Section";
import NoteMeta from "../pages/NoteMeta";
import { getNotes } from "../../content/notesLoader";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import { messages } from "../../i18n/messages";

type NotesTeaserSectionProps = {
  locale: Locale;
};

/**
 * Homepage window into the digital garden — curation before chronology:
 * the three freshest notes (getNotes() is already sorted by last-tended)
 * plus one CTA into /notes. Server component; renders nothing while the
 * garden is empty so the landing never shows a hollow section.
 */
export default function NotesTeaserSection({
  locale,
}: NotesTeaserSectionProps) {
  const labels = messages[locale];
  const t = labels.notes;
  const latest = getNotes().slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <Section id="notes-teaser">
      <Container>
        <div className="notes-teaser">
          <div className="notes-teaser__head">
            <h2 className="sub-title">{t.teaserTitle}</h2>
            <p className="notes-subtitle">{t.teaserSubtitle}</p>
          </div>
          <ul className="notes-list notes-teaser__list">
            {latest.map((note) => (
              <li key={note.slug} className="note-card">
                <h3>
                  <Link href={localePath(locale, `/notes/${note.slug}`)}>
                    {note.title}
                  </Link>
                </h3>
                <p className="note-summary">{note.summary}</p>
                <NoteMeta note={note} locale={locale} labels={labels} />
              </li>
            ))}
          </ul>
          <p className="notes-teaser__cta">
            <Link href={localePath(locale, "/notes")}>{t.teaserCta} →</Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}
