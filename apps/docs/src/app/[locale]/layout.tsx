import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Outfit, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";

import "@/index.css";
import "@/styles/portfolio.css";

import { THEME_KEY } from "@laboratoire/ui";
import { LOCALES, isLocale, type Locale } from "@/i18n/locale";
import { SITE_URL } from "@/seo/site";
import JsonLd from "@/seo/JsonLd";
import ScrollField from "@/components/ui/ScrollField";
import CardSpotlight from "@/components/ui/CardSpotlight";
import LocaleCookieSync from "@/components/ui/LocaleCookieSync";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { Providers } from "../providers";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

/**
 * Runs BEFORE first paint (inline in <head>) so the stored theme is applied
 * with no flash — the Next.js equivalent of the old synchronous initTheme()
 * in main.tsx. Same storage key the @laboratoire/ui useTheme hook writes.
 */
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});t=t==="light"||t==="dark"?t:"dark";var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.classList.toggle("light",t==="light");r.setAttribute("data-theme",t);}catch(e){}})();`;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  authors: [{ name: "Hassan Akkari", url: SITE_URL }],
  creator: "Hassan Akkari",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang: Locale = locale;

  return (
    // Server-rendered default is dark (the SPA's default); the inline script
    // corrects to the stored theme before paint. suppressHydrationWarning is
    // required because the script may flip class/attribute before React
    // hydrates <html>.
    <html
      lang={lang}
      className={`dark ${outfit.variable} ${spaceGrotesk.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* Below-the-fold sections reveal on scroll via framer-motion, which
            serializes their pre-reveal opacity:0 into the static HTML. With
            JS disabled nothing would ever reveal them — force everything
            visible for no-JS clients (crawlers, brittle connections). */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <ScrollProgress />
        <CardSpotlight />
        <Providers>
          {/* .site-shell (isolation: isolate) hosts the fixed z:-1 particle
              layer: without its own stacking context the layer would paint
              BEHIND the opaque body background and vanish. */}
          <div className="site-shell">
            <ScrollField />
            {children}
          </div>
        </Providers>
        {/* Site-level structured data (Person + ProfessionalService) on every
            page — the old index.html served it on all SPA routes, and the
            audit landing page needs it as much as the home. */}
        <JsonLd locale={lang} />
        <LocaleCookieSync locale={lang} />
        <Analytics />
      </body>
    </html>
  );
}
