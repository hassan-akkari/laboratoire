import Link from "next/link";
import { dbReady } from "@/lib/db/client";
import { listActiveServices } from "@/features/services/queries";
import { formatDuration, formatPriceRange } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// This page is the "Razor View". It calls the query layer (the repository) and
// renders — no SQL/Drizzle in here. The data flow:
//   request → listActiveServices() (DB or demo fallback) → rows → cards → HTML.
export default async function ServicesPage() {
  const services = await listActiveServices();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10">
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← Home
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Services
          </h1>
          {!dbReady ? <Badge variant="secondary">demo data</Badge> : null}
        </div>
        <p className="mt-2 text-muted-foreground">
          Browse what&rsquo;s on offer, then send a booking request.
        </p>
      </div>

      {services.length === 0 ? (
        <EmptyNotice />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.id}>
              <Card className="h-full transition hover:shadow-md">
                <CardHeader>
                  {s.category ? (
                    <Badge variant="outline" className="mb-1 w-fit">
                      {s.category}
                    </Badge>
                  ) : null}
                  <CardTitle>{s.title}</CardTitle>
                  {s.description ? (
                    <CardDescription className="line-clamp-3">
                      {s.description}
                    </CardDescription>
                  ) : null}
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm">
                  <span className="font-semibold">
                    {formatPriceRange(s.priceFromCents, s.priceToCents)}
                  </span>
                  <span className="text-muted-foreground">
                    {formatDuration(s.durationMin)}
                  </span>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/book/${s.slug}`}>Book</Link>
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function EmptyNotice() {
  return (
    <div className="rounded-xl border border-dashed bg-card p-8 text-center text-card-foreground">
      <h2 className="text-lg font-semibold">No services yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Run <code className="font-mono">pnpm -F booking-service db:seed</code> to
        load the demo catalogue, or add services from the admin dashboard.
      </p>
    </div>
  );
}
