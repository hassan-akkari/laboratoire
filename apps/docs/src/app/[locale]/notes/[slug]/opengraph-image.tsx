import { ImageResponse } from "next/og";

import { getNote } from "@/content/notesLoader";
import type { NoteStage } from "@/content/notes.schema";

export const alt = "Hassan Akkari — Digital garden note";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Slugs come from generateStaticParams (dynamicParams=false on the page), so
// every card is baked at build time — same policy as the locale-level card.
export const dynamic = "force-static";

const STAGE_BADGE: Record<NoteStage, string> = {
  seedling: "🌱 Seedling",
  budding: "🌿 Budding",
  evergreen: "🌲 Evergreen",
};

/**
 * Per-note Open Graph card: dark brand canvas (mirrors the site's dark
 * tokens and the locale-level OG card), note title as the hero, growth
 * stage + tags as the garden fingerprint.
 */
export default async function NoteOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote(slug);
  const title = note?.title ?? "Digital garden";
  const stage = note ? STAGE_BADGE[note.stage] : "";
  const tags = note?.tags.slice(0, 4) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#080808",
          backgroundImage:
            "radial-gradient(820px 460px at 8% -18%, rgba(74,78,105,0.55), transparent 65%), radial-gradient(560px 340px at 92% -10%, rgba(238,146,108,0.22), transparent 70%)",
          color: "#decbc6",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#a9aed6",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 46,
                height: 3,
                backgroundColor: "#a9aed6",
                borderRadius: 2,
              }}
            />
            itshassan.it/notes
          </div>
          {stage && (
            <div
              style={{
                display: "flex",
                border: "1px solid #4a4e69",
                borderRadius: 999,
                padding: "8px 24px",
                fontSize: 24,
              }}
            >
              {stage}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 42 ? 58 : 72,
            fontWeight: 700,
            lineHeight: 1.12,
            color: "#decbc6",
            maxWidth: 1020,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#9a8f8c",
          }}
        >
          <div style={{ display: "flex", gap: 18 }}>
            {tags.map((tag) => (
              <div key={tag} style={{ display: "flex" }}>
                #{tag}
              </div>
            ))}
          </div>
          <div style={{ display: "flex" }}>Hassan Akkari</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
