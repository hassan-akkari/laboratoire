import type { AnchorHTMLAttributes } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "@/styles/notes.css";

import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Note } from "../../content/notes.schema";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import type { Messages } from "../../i18n/messages";
import NoteMeta from "./NoteMeta";

type NoteDetailPageProps = {
  locale: Locale;
  labels: Messages;
  note: Note;
  /** Notes whose body wikilinks here (reverse edges, computed at build). */
  backlinks: Note[];
  /** Shared-tag neighbours, already de-duplicated against backlinks. */
  related: Note[];
};

function AdjacentNotes({
  title,
  notes,
  locale,
}: {
  title: string;
  notes: Note[];
  locale: Locale;
}) {
  if (notes.length === 0) return null;
  return (
    <section className="note-adjacent__group">
      <h2>{title}</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.slug}>
            <Link href={localePath(locale, `/notes/${note.slug}`)}>
              {note.title}
            </Link>
            <p>{note.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Internal (locale-prefixed) links go through next/link; external ones get
 * rel hardening. Only href/children/title are forwarded — react-markdown also
 * passes a `node` AST prop that must not leak onto the DOM element.
 */
function MarkdownAnchor({
  href = "",
  children,
  title,
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} title={title}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} title={title} rel="noreferrer">
      {children}
    </a>
  );
}

export default function NoteDetailPage({
  locale,
  labels,
  note,
  backlinks,
  related,
}: NoteDetailPageProps) {
  const t = labels.notes;

  // vault-sync emits cross-note links as note:<slug>; bind them to the
  // reader's locale here, at render time, so one payload serves every locale.
  const body = note.body.replaceAll(
    "](note:",
    `](${localePath(locale, "/notes")}/`,
  );

  return (
    <Section id="note">
      <Container>
        <article className="notes-page note-article">
          <p className="notes-eyebrow">
            <Link href={localePath(locale, "/notes")}>← {t.backToNotes}</Link>
          </p>
          <header>
            <h1 className="note-title">{note.title}</h1>
            <NoteMeta note={note} locale={locale} labels={labels} />
            {t.languageNote && (
              <p className="notes-language-note">{t.languageNote}</p>
            )}
          </header>
          <div className="note-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{ a: MarkdownAnchor }}
            >
              {body}
            </ReactMarkdown>
          </div>
          {(backlinks.length > 0 || related.length > 0) && (
            <footer className="note-adjacent">
              <AdjacentNotes
                title={t.backlinksTitle}
                notes={backlinks}
                locale={locale}
              />
              <AdjacentNotes
                title={t.relatedTitle}
                notes={related}
                locale={locale}
              />
            </footer>
          )}
        </article>
      </Container>
    </Section>
  );
}
