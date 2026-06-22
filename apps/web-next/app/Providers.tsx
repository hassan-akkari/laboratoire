"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { UiProvider } from "@laboratoire/ui";

/**
 * Dedicated client-component provider boundary for web-next (VARIANT B keeps the
 * client surface explicit and isolated to ONE file).
 *
 * WHY UiProvider IS INCLUDED EVEN THOUGH THE CART SPIKE IS v3-ONLY
 * ---------------------------------------------------------------
 * `UiProvider` wraps HeroUI **v2**'s `HeroUIProvider`. The cart wrappers actually
 * converted here — `AppCard` / `AppButton` — are HeroUI **v3**, which is CSS-first
 * and needs NO provider. So for the cart page alone this provider is a no-op.
 *
 * It is included deliberately as the forward-looking router-integration boundary:
 *   - It is the documented, monorepo-wide foundation provider (docs + web-react
 *     both mount it via their own `RouterUiProvider`). web-next should not be the
 *     odd one out.
 *   - The remaining booking pages (checkout/login) use form controls. The
 *     `App*` form wrappers still on v2 (`AppInput`, `AppSelect`, ...) DO require
 *     this provider, and HeroUI's `Link`/`Tabs`/`Menu` need router integration —
 *     wired here via `next/navigation`'s `useRouter().push`. Establishing the
 *     boundary now means later pages drop in without re-plumbing the layout.
 *   - It carries zero runtime cost for the v3 cart and introduces no styling.
 *
 * `next/navigation`'s `router.push(href)` is passed as HeroUI's `navigate`. v3 is
 * unaffected; this only serves future v2-backed wrappers.
 */
export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  return <UiProvider navigate={(href) => router.push(href)}>{children}</UiProvider>;
}
