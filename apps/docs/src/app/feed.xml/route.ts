import { getNotes } from "@/content/notesLoader";
import { SITE_URL } from "@/seo/site";

/**
 * RSS 2.0 feed for the digital garden. Lives at the root (one feed — notes
 * are English-only; items point at the /en pages) and is baked at build
 * time like every other notes artifact: new notes ship when a sync commit
 * deploys, so a static feed is always exactly as fresh as the site.
 */
export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/** ISO date → RFC 822 (UTC midnight), the pubDate format RSS readers expect. */
function toRfc822(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

export function GET(): Response {
  const notes = getNotes(); // already freshest-first
  const feedUrl = `${SITE_URL}/feed.xml`;
  const gardenUrl = `${SITE_URL}/en/notes`;

  const items = notes
    .map((note) => {
      const url = `${SITE_URL}/en/notes/${note.slug}`;
      return [
        "    <item>",
        `      <title>${escapeXml(note.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${toRfc822(note.updatedAt)}</pubDate>`,
        `      <description>${escapeXml(note.summary)}</description>`,
        ...note.tags.map(
          (tag) => `      <category>${escapeXml(tag)}</category>`,
        ),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hassan Akkari — Digital garden</title>
    <link>${gardenUrl}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <description>Working notes from the lab — published while they grow, not once they're perfect.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
