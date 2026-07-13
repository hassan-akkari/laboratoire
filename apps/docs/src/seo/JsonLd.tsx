import type { Locale } from "../i18n/locale";
import { getSeoContent } from "../data/seoContent";
import { getServicesContent } from "../data/services";
import { SITE } from "../data/site";
import { SITE_URL } from "./site";

const SERVICE_BRAND_NAME: Record<Locale, string> = {
  it: "Hassan Akkari — Sviluppo siti e web app",
  en: "Hassan Akkari — Websites & web app development",
  fr: "Hassan Akkari — Création de sites et web apps",
  de: "Hassan Akkari — Websites & Web-App-Entwicklung",
};

/**
 * Server-rendered structured data (Person + ProfessionalService with an
 * OfferCatalog), ported from the old index.html JSON-LD but localized and
 * with absolute URLs. Offer entries come straight from the services data so
 * schema.org copy never drifts from the visible pricing section.
 */
export default function JsonLd({ locale }: { locale: Locale }) {
  const seo = getSeoContent(locale);
  const services = getServicesContent(locale);
  const pageUrl = `${SITE_URL}/${locale}`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: SITE.name,
        jobTitle: "Freelance Web Developer",
        url: pageUrl,
        image: `${SITE_URL}/image/portrait.webp`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Roma",
          addressCountry: "IT",
        },
        sameAs: [SITE.github, SITE.linkedin],
        knowsAbout: [
          "React",
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "Frontend architecture",
          "Web app development",
          "Landing page design",
        ],
      },
      {
        "@type": "ProfessionalService",
        name: SERVICE_BRAND_NAME[locale],
        description: seo.description,
        image: `${SITE_URL}/image/portrait.webp`,
        url: pageUrl,
        telephone: `+${SITE.whatsappNumber}`,
        areaServed: {
          "@type": "Country",
          name: "Italy",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Roma",
          addressCountry: "IT",
        },
        priceRange: "€€",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: services.title,
          itemListElement: services.services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.name,
              description: service.tagline,
            },
          })),
        },
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
