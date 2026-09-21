import type { Metadata } from "next";

import NotesIndexPage from "@/components/pages/NotesIndexPage";
import { getNotes } from "@/content/notesLoader";
import { messages } from "@/i18n/messages";
import { localeFromParams } from "@/i18n/server";
import { buildPageMetadata } from "@/seo/pageMetadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const labels = messages[locale];
  return buildPageMetadata({
    locale,
    path: "/notes",
    title: `${labels.notes.title} · Hassan Akkari`,
    description: labels.notes.subtitle,
  });
}

export default async function NotesRoute({ params }: PageProps) {
  const locale = await localeFromParams(params);
  const labels = messages[locale];

  return <NotesIndexPage locale={locale} labels={labels} notes={getNotes()} />;
}
