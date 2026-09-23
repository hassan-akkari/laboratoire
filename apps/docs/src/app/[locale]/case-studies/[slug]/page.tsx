import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CaseStudyDetailPage from "@/components/pages/CaseStudyDetailPage";
import {
  PROFESSIONAL_CASE_STUDY_SLUGS,
  caseStudyPath,
  getProfessionalCaseStudies,
  getProfessionalCaseStudy,
  getProfessionalCaseStudyLabels,
} from "@/data/professionalCaseStudies";
import { messages } from "@/i18n/messages";
import { localeFromParams } from "@/i18n/server";
import { buildPageMetadata } from "@/seo/pageMetadata";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

/** Three studies × four locales are prerendered; unknown slugs 404 at request time. */
export const dynamicParams = false;

export function generateStaticParams() {
  return PROFESSIONAL_CASE_STUDY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const { slug } = await params;
  const study = getProfessionalCaseStudy(locale, slug);
  if (!study) return {};
  // Fully translated content: canonical + hreflang stay per-locale (unlike
  // the English-only garden notes, which collapse onto /en).
  return buildPageMetadata({
    locale,
    path: caseStudyPath(study.slug),
    title: `${study.title} · Hassan Akkari`,
    description: study.seoDescription,
    keywords: study.stack,
  });
}

export default async function CaseStudyRoute({ params }: PageProps) {
  const locale = await localeFromParams(params);
  const { slug } = await params;
  const study = getProfessionalCaseStudy(locale, slug);
  if (!study) notFound();

  const all = getProfessionalCaseStudies(locale);
  const index = all.findIndex((item) => item.slug === study.slug);

  return (
    <CaseStudyDetailPage
      locale={locale}
      labels={messages[locale]}
      t={getProfessionalCaseStudyLabels(locale)}
      study={study}
      previous={index > 0 ? all[index - 1] : undefined}
      next={index < all.length - 1 ? all[index + 1] : undefined}
    />
  );
}
