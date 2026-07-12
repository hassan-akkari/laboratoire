import type { Metadata } from "next";

import CvPage from "@/components/pages/CvPage";
import { getPortfolioContent } from "@/content/loader";
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
    path: "/cv",
    title: `${labels.cv.title} · Hassan Akkari`,
    description: labels.cv.subtitle,
  });
}

export default async function CvRoute({ params }: PageProps) {
  const locale = await localeFromParams(params);
  const labels = messages[locale];
  const content = getPortfolioContent(locale);

  return <CvPage content={content} locale={locale} labels={labels} />;
}
