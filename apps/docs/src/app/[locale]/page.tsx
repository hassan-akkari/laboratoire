import type { Metadata } from "next";

import SiteHeader from "@/components/layout/SiteHeader";
import HeroSection from "@/components/sections/HeroSection";
import ProblemsSection from "@/components/sections/ProblemsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import TargetClientsSection from "@/components/sections/TargetClientsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import WhyMeSection from "@/components/sections/WhyMeSection";
import TechStackSection from "@/components/sections/TechStackSection";
import NotesTeaserSection from "@/components/sections/NotesTeaserSection";
import FAQSection from "@/components/sections/FAQSection";
import FinalCTASection from "@/components/sections/FinalCTASection";
import { getSeoContent } from "@/data/seoContent";
import { messages } from "@/i18n/messages";
import { localeFromParams } from "@/i18n/server";
import { buildPageMetadata } from "@/seo/pageMetadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const seo = getSeoContent(locale);
  return buildPageMetadata({
    locale,
    path: "",
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function HomePage({ params }: PageProps) {
  const locale = await localeFromParams(params);
  const labels = messages[locale];

  return (
    <>
      <SiteHeader locale={locale} labels={labels} />
      <HeroSection locale={locale} />
      <ProblemsSection locale={locale} />
      <ServicesSection locale={locale} />
      <TargetClientsSection locale={locale} />
      <ProcessSection locale={locale} />
      <CaseStudiesSection locale={locale} />
      <WhyMeSection locale={locale} />
      <TechStackSection locale={locale} />
      <NotesTeaserSection locale={locale} />
      <FAQSection locale={locale} />
      <FinalCTASection locale={locale} />
    </>
  );
}
