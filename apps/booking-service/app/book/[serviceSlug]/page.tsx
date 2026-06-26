import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbReady } from "@/lib/db/client";
import { getActiveServiceBySlug } from "@/features/services/queries";
import { getStyle } from "@/lib/style";
import { Book as EditorialBook } from "@/components/styles/editorial/Book";
import { Book as WarmBook } from "@/components/styles/warm/Book";
import { Book as BoldBook } from "@/components/styles/bold/Book";

// Booking page for a single service. Same "Razor View" pattern as /services:
// fetch the row ONCE via the query layer (DB or demo fallback), then hand it to
// whichever variant's <Book> the `bs_style` cookie selects. Unknown slug →
// notFound() (renders the sibling not-found.tsx).
//
// Next 16: `params` is a Promise and must be awaited.
type PageProps = { params: Promise<{ serviceSlug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { serviceSlug } = await params;
  const service = await getActiveServiceBySlug(serviceSlug);
  if (!service) return { title: "Service not found" };
  return {
    title: `Book ${service.title}`,
    description: `Send a booking request for ${service.title}.`,
  };
}

export default async function BookPage({ params }: PageProps) {
  const { serviceSlug } = await params;

  const [service, style] = await Promise.all([
    getActiveServiceBySlug(serviceSlug),
    getStyle(),
  ]);

  if (!service) notFound();

  switch (style) {
    case "editorial":
      return <EditorialBook service={service} dbReady={dbReady} />;
    case "warm":
      return <WarmBook service={service} dbReady={dbReady} />;
    case "bold":
      return <BoldBook service={service} dbReady={dbReady} />;
  }
}
