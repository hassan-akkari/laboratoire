import { Skeleton } from "@/components/ui/skeleton";

// Loading UI for the public catalogue (/services). Shaped like the rendered
// page — a heading block plus a responsive grid of service cards — so the
// transition to real content has no layout shift. Design-variant neutral on
// purpose: it paints instantly before the active variant's data resolves, using
// only base theme tokens (so it reads correctly in any variant + dark mode).
export default function ServicesLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl ring-1 ring-foreground/10"
          >
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
