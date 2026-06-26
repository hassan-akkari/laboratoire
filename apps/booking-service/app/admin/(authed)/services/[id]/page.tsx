import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdminSession } from "@/lib/adminSession";
import { getServiceById } from "@/features/services/queries";
import { updateService } from "../actions";
import { ServiceForm } from "../ServiceForm";

export const metadata: Metadata = {
  title: "Edit service · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();

  // Next 16 async params.
  const { id } = await params;

  // getServiceById returns ALL services regardless of active, null if missing
  // or !dbReady.
  const service = await getServiceById(id);
  if (!service) notFound();

  // Bind the id to the update action → a (input) => Promise<result> reference
  // safe to hand to the client form (the canonical Next.js bind pattern).
  const action = updateService.bind(null, service.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to services
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Edit service</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{service.title}</CardTitle>
          <CardDescription>
            Update this service. Prices are entered in euros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceForm
            mode="edit"
            action={action}
            defaultValues={{
              title: service.title,
              slug: service.slug,
              description: service.description,
              category: service.category,
              durationMin: service.durationMin,
              priceFromCents: service.priceFromCents,
              priceToCents: service.priceToCents,
              imageUrl: service.imageUrl,
              images: service.images,
              active: service.active,
              sortOrder: service.sortOrder,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
