import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading UI for the admin bookings dashboard (/admin). Renders inside the
// (authed) layout's <main>, so it only paints the inner content: the heading,
// the three stat cards, and the bookings table. Matches the real page's shape
// to avoid layout shift when data resolves.
export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-8 w-16" />
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="p-0">
        <div className="space-y-px p-4">
          <Skeleton className="h-9 w-full" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}
