import { Skeleton } from "@/components/ui/skeleton";

// Loading UI for a public service detail page (/services/[slug]). Shaped like
// the rendered detail layout: a hero image, a title + meta block, a description,
// and a gallery row. Variant-neutral base tokens so it paints instantly in any
// of the three designs without layout shift.
export default function ServiceDetailLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <Skeleton className="h-4 w-32" />

      <Skeleton className="mt-6 aspect-[3/2] w-full rounded-2xl" />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-xl" />
        ))}
      </div>
    </main>
  );
}
