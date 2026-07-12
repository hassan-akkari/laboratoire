"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { UiProvider } from "@laboratoire/ui";

/**
 * Next.js counterpart of the old RouterUiProvider: bridges next/navigation
 * into the router-agnostic UiProvider so HeroUI's Link/Tabs/Menu integrate
 * with App Router client-side navigation (the "Phase 5" wiring the UiProvider
 * docblock anticipated).
 */
export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <UiProvider navigate={(href) => router.push(href)} useHref={(href) => href}>
      {children}
    </UiProvider>
  );
}
