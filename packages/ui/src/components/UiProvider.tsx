"use client";

import { HeroUIProvider, type HeroUIProviderProps } from "@heroui/react";

/**
 * Router-agnostic wrapper over HeroUI's `HeroUIProvider` — the single
 * foundation provider for every app in the monorepo.
 *
 * Consumers pass their router's `navigate` / `useHref` so HeroUI's `Link`,
 * `Tabs`, `Menu`, etc. integrate with client-side routing. React Router 7 apps
 * pass `useNavigate()` / `useHref`; a future Next.js app (Phase 5) passes
 * `next/navigation`'s `useRouter().push` and a matching `useHref`.
 *
 * Props are the full `HeroUIProviderProps` spread straight through, so any
 * HeroUI provider option (locale, reducedMotion, disableAnimation,
 * validationBehavior, ...) keeps working without editing this file.
 *
 * The `"use client"` directive at the top of this file is required so that,
 * once `@laboratoire/ui` is consumed from a React Server Components graph
 * (web-next), the provider is correctly treated as a Client Component. Vite
 * consumers (docs, web-react) simply ignore the directive.
 */
export type UiProviderProps = HeroUIProviderProps;

export function UiProvider({ children, ...props }: UiProviderProps) {
  return <HeroUIProvider {...props}>{children}</HeroUIProvider>;
}
