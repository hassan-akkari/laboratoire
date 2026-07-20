import type { Locale } from "../i18n/locale";
import { getFaqsContent } from "../data/faqs";

/**
 * FAQPage structured data for the home page — mirrors the visible FAQ
 * section 1:1 (same data module), which is Google's eligibility condition
 * for FAQ rich results. Rendered ONLY on the route that shows the FAQs;
 * site-wide duplication would disqualify it.
 */
export default function FaqJsonLd({ locale }: { locale: Locale }) {
  const { faqs } = getFaqsContent(locale);

  const graph = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
