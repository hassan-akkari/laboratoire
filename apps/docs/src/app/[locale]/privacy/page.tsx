import type { Metadata } from "next";

import PrivacyPage from "@/components/pages/PrivacyPage";
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
    path: "/privacy",
    title: `${labels.privacy.title} · Hassan Akkari`,
    description: labels.privacy.intro,
  });
}

export default async function PrivacyRoute({ params }: PageProps) {
  const locale = await localeFromParams(params);
  const labels = messages[locale];

  return <PrivacyPage locale={locale} labels={labels} />;
}
