import type { Metadata } from "next";
import { notFound } from "next/navigation";

import NoteDetailPage from "@/components/pages/NoteDetailPage";
import {
  getBacklinks,
  getNote,
  getNotes,
  getRelatedNotes,
} from "@/content/notesLoader";
import { messages } from "@/i18n/messages";
import { localeFromParams } from "@/i18n/server";
import { buildPageMetadata } from "@/seo/pageMetadata";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

/** Every note is prerendered per locale; unknown slugs 404 at request time. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  return buildPageMetadata({
    locale,
    path: `/notes/${note.slug}`,
    title: `${note.title} · Hassan Akkari`,
    description: note.summary,
    keywords: note.tags,
  });
}

export default async function NoteRoute({ params }: PageProps) {
  const locale = await localeFromParams(params);
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  return (
    <NoteDetailPage
      locale={locale}
      labels={messages[locale]}
      note={note}
      backlinks={getBacklinks(note.slug)}
      related={getRelatedNotes(note)}
    />
  );
}
