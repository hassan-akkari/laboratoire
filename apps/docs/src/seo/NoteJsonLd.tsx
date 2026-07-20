import type { Note } from "../content/notes.schema";
import type { Locale } from "../i18n/locale";
import { SITE } from "../data/site";
import { SITE_URL } from "./site";

/**
 * Per-note structured data: TechArticle (the notes are engineering
 * write-ups) + BreadcrumbList. `inLanguage` is always "en" — the body is
 * English under every locale prefix, and lying to crawlers about that
 * would hurt more than the locale chrome helps.
 */
export default function NoteJsonLd({
  locale,
  note,
  notesLabel,
}: {
  locale: Locale;
  note: Note;
  notesLabel: string;
}) {
  const noteUrl = `${SITE_URL}/${locale}/notes/${note.slug}`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        // BlogPosting, NOT TechArticle: Google's Article rich result only
        // recognizes Article/NewsArticle/BlogPosting subtypes.
        "@type": "BlogPosting",
        headline: note.title,
        description: note.summary,
        url: noteUrl,
        inLanguage: "en",
        datePublished: note.createdAt,
        dateModified: note.updatedAt,
        keywords: note.tags.join(", "),
        author: {
          "@type": "Person",
          name: SITE.name,
          url: `${SITE_URL}/${locale}`,
          sameAs: [SITE.github, SITE.linkedin],
        },
        mainEntityOfPage: noteUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE.name,
            item: `${SITE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: notesLabel,
            item: `${SITE_URL}/${locale}/notes`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: note.title,
            item: noteUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
