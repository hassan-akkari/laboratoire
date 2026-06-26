import type { Metadata } from "next";
import Link from "next/link";
import { Plus, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dbReady } from "@/lib/db/client";
import { formatDuration, formatPriceRange } from "@/lib/format";
import { requireAdminSession } from "@/lib/adminSession";
import { listAllServices } from "@/features/services/queries";
import { ServiceActiveToggle } from "./ServiceActiveToggle";
import { DeleteServiceButton } from "./DeleteServiceButton";

export const metadata: Metadata = {
  title: "Services · Admin",
  robots: { index: false, follow: false },
};

// Reads request state (session cookie, DB) → render dynamically.
export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  // Defence in depth: the (authed) layout already gated this, but every admin
  // page re-checks server-side.
  await requireAdminSession();

  const services = await listAllServices();
  const total = services.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
          <p className="text-sm text-muted-foreground">
            The full catalogue — active and inactive. Edit, reorder, toggle
            visibility, or delete.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="size-4" aria-hidden="true" />
            New service
          </Link>
        </Button>
      </div>

      {!dbReady ? (
        <Card>
          <CardHeader>
            <CardTitle>Database not configured</CardTitle>
            <CardDescription>
              Set <code className="font-mono">DATABASE_URL</code> (Neon) and run{" "}
              <code className="font-mono">db:push</code> +{" "}
              <code className="font-mono">db:seed</code> to manage services.
              Changes cannot be saved until a database is connected.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          {total === 0 ? (
            <CardContent className="py-16 text-center">
              <p className="text-sm font-medium">No services yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first service to populate the public catalogue.
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/services/new">
                  <Plus className="size-4" aria-hidden="true" />
                  New service
                </Link>
              </Button>
            </CardContent>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right tabular-nums">Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((s) => (
                  <TableRow key={s.id} data-inactive={!s.active}>
                    <TableCell className="font-medium">{s.title}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {s.slug}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {s.category ?? "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatPriceRange(s.priceFromCents, s.priceToCents)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDuration(s.durationMin)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ServiceActiveToggle
                          serviceId={s.id}
                          active={s.active}
                          title={s.title}
                        />
                        <Badge
                          variant="secondary"
                          className={
                            s.active
                              ? "border-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300"
                              : "border-0 bg-muted text-muted-foreground"
                          }
                        >
                          {s.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {s.sortOrder}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={`/admin/services/${s.id}`}
                            aria-label={`Edit ${s.title}`}
                          >
                            <SquarePen className="size-4" aria-hidden="true" />
                            Edit
                          </Link>
                        </Button>
                        <DeleteServiceButton serviceId={s.id} title={s.title} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      )}
    </div>
  );
}
