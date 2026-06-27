"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Error boundary for the public catalogue routes (/services and
// /services/[slug]). Must be a client component (Next.js contract) and receives
// `error` + `reset`. It logs to the console for diagnosis but NEVER renders raw
// error details to the visitor — only a friendly message plus a retry and a way
// back home. Variant-neutral base tokens so it reads correctly in any design.
export default function ServicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[booking-service] /services error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        We couldn&apos;t load the catalogue just now. This is usually temporary —
        please try again.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>
          <RotateCw className="size-4" aria-hidden="true" />
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back home
          </Link>
        </Button>
      </div>
    </main>
  );
}
