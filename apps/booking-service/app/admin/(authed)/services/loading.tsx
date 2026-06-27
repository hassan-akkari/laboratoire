import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading UI for the admin services catalogue (/admin/services). Mirrors the
// real page: heading + "New service" action on the right, then the services
// table. Renders inside the (authed) layout's <main>.
export default function AdminServicesLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      <Card className="p-0">
        <div className="space-y-px p-4">
          <Skeleton className="h-9 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}
