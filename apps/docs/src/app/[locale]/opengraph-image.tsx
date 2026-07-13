import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/locale";
import { localeFromParams } from "@/i18n/server";
import { getSeoContent } from "@/data/seoContent";

export const alt = "Hassan Akkari — Freelance Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// All inputs are static and there are exactly three variants — bake the PNGs
// at build time instead of running satori+resvg on every social unfurl.
export const dynamic = "force-static";

const ROLE_LINE: Record<Locale, string> = {
  it: "Sviluppatore freelance · Roma",
  en: "Freelance web developer · Rome",
  fr: "Développeur web freelance · Rome",
};

/**
 * Brand Open Graph card (1200x630) generated per locale at build time —
 * replaces the 3:4 portrait that link previews used to crop. Colors mirror
 * the dark theme tokens (#080808 / #decbc6 / #4a4e69).
 */
export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale: Locale = await localeFromParams(params);
  const seo = getSeoContent(locale);

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
            gap: 16,
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#a9aed6",
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
          itshassan.it
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#decbc6",
            }}
          >
            Hassan Akkari
          </div>
          <div style={{ fontSize: 38, color: "#a9aed6" }}>
            {ROLE_LINE[locale]}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "#9a8f8c",
              maxWidth: 980,
            }}
          >
            {seo.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 24,
            color: "#9a8f8c",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: "#4a4e69",
            }}
          />
          React · Next.js · TypeScript
        </div>
      </div>
    ),
    { ...size },
  );
}
