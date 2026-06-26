import Link from "next/link";
import type { Service } from "@/lib/db/schema";
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
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";
import { HoverLift } from "@/components/motion/HoverLift";

// Editorial "menu" view. Data is fetched once by the page and passed in as
// props — this component never touches the query layer. Look is unchanged from
// the editorial design: serif headline, hairline cards, restrained type.
export function Services({
  services,
  dbReady,
}: {
  services: Service[];
  dbReady: boolean;
}) {
  return (
    <main className="theme-editorial mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-24">
      {/* Editorial masthead for the menu. */}
      <FadeUp className="border-b pb-10">
        <Link
          href="/"
          className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          ← Maison
        </Link>

        <p className="mt-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
          <span aria-hidden className="h-px w-8 bg-primary/60" />
          The Menu
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2">
          <h1 className="font-editorial text-4xl leading-tight font-medium tracking-tight sm:text-5xl">
            Services &amp; Care
          </h1>
          {!dbReady ? (
            <Badge variant="secondary" className="mb-1.5">
              demo data
            </Badge>
          ) : null}
        </div>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
          A considered list of what we offer. Choose a service, then send a
          booking request — we&rsquo;ll confirm a time that suits you.
        </p>
      </FadeUp>

      {services.length === 0 ? (
        <EmptyNotice />
      ) : (
        <StaggerList
          as="ul"
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => (
            <StaggerItem as="li" key={s.id} className="group">
              <HoverLift className="h-full">
                <Card className="h-full ring-foreground/[0.08] transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_30px_-12px_rgba(0,0,0,0.18)] motion-reduce:transition-none">
                  <CardHeader className="gap-3">
                    {s.category ? (
                      <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        {s.category}
                      </span>
                    ) : null}
                    <CardTitle className="text-xl leading-snug">
                      {s.title}
                    </CardTitle>
                    {s.description ? (
                      <CardDescription className="line-clamp-3 leading-relaxed">
                        {s.description}
                      </CardDescription>
                    ) : null}
                  </CardHeader>

                  <CardContent className="mt-auto flex items-baseline justify-between gap-3 pt-2">
                    <span className="font-editorial text-lg tracking-tight tabular-nums">
                      {formatPriceRange(s.priceFromCents, s.priceToCents)}
                    </span>
                    <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground tabular-nums">
                      {formatDuration(s.durationMin)}
                    </span>
                  </CardContent>

                  <CardFooter className="border-t-0 bg-transparent pt-0">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary motion-reduce:transition-none"
                    >
                      <Link href={`/book/${s.slug}`}>Book this service</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </main>
  );
}

function EmptyNotice() {
  return (
    <div className="mt-14 rounded-xl border border-dashed bg-card p-12 text-center text-card-foreground">
      <h2 className="font-editorial text-2xl font-medium tracking-tight">
        The menu is being prepared
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Run <code className="font-mono">pnpm -F booking-service db:seed</code> to
        load the demo catalogue, or add services from the admin dashboard.
      </p>
    </div>
  );
}
