import type { Metadata } from "next";

import AuditPage from "@/components/pages/AuditPage";
import { getAuditContent } from "@/data/auditContent";
import { messages } from "@/i18n/messages";
import { localeFromParams } from "@/i18n/server";
import { buildPageMetadata } from "@/seo/pageMetadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const content = getAuditContent(locale);
  return buildPageMetadata({
    locale,
    path: "/audit",
    title: content.seoTitle,
    description: content.seoDescription,
  });
}

export default async function AuditRoute({ params }: PageProps) {
  const locale = await localeFromParams(params);
  const labels = messages[locale];

  return <AuditPage locale={locale} labels={labels} />;
}
