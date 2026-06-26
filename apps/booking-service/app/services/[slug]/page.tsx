import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbReady } from "@/lib/db/client";
import { getActiveServiceBySlug } from "@/features/services/queries";
import { getStyle } from "@/lib/style";
import { Detail as EditorialDetail } from "@/components/styles/editorial/Detail";
import { Detail as WarmDetail } from "@/components/styles/warm/Detail";
import { Detail as BoldDetail } from "@/components/styles/bold/Detail";

// Public service-detail page for a single service. Same "Razor View" pattern as
// /services and /book/[serviceSlug]: fetch the row ONCE via the query layer (DB
// or demo fallback), then hand it to whichever variant's <Detail> the `bs_style`
// cookie selects. Unknown slug → notFound() (renders the sibling not-found.tsx).
//
// Next 16: `params` is a Promise and must be awaited.
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getActiveServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.title,
    // `||` (not `??`) so an empty-string description (the DB default) falls
    // through to the fallback rather than yielding an empty meta description.
    description: service.description || `Book ${service.title} — see pricing, duration and details.`,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [service, style] = await Promise.all([
    getActiveServiceBySlug(slug),
    getStyle(),
  ]);

  if (!service) notFound();

  switch (style) {
    case "editorial":
      return <EditorialDetail service={service} dbReady={dbReady} />;
    case "warm":
      return <WarmDetail service={service} dbReady={dbReady} />;
    case "bold":
      return <BoldDetail service={service} dbReady={dbReady} />;
  }
}
