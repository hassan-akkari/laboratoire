import Link from "next/link";
import { Button } from "@/components/ui/button";

// Shown when /services/[slug] resolves to no active service. Theme-neutral (uses
// base shadcn tokens) so it reads cleanly under any active variant.
export default function ServiceDetailNotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
        404
      </p>
      <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        That service doesn&rsquo;t exist
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        It may have been removed or the link is out of date. Browse the full
        menu to find what you&rsquo;re looking for.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/services">View all services</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </main>
  );
}
