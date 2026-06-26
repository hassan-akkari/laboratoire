import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdminSession } from "@/lib/adminSession";
import { createService } from "../actions";
import { ServiceForm } from "../ServiceForm";

export const metadata: Metadata = {
  title: "New service · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  await requireAdminSession();

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
        <h1 className="text-2xl font-semibold tracking-tight">New service</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service details</CardTitle>
          <CardDescription>
            Create a service for the public catalogue. Prices are entered in
            euros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* createService already matches (input) => Promise<result>. */}
          <ServiceForm mode="create" action={createService} />
        </CardContent>
      </Card>
    </div>
  );
}
