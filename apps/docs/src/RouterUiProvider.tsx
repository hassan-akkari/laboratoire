import type { ReactNode } from "react";
import { useHref, useNavigate } from "react-router-dom";
import { UiProvider } from "@laboratoire/ui";

/**
 * Bridges React Router's navigation into the router-agnostic UiProvider so
 * HeroUI's Link/Tabs/Menu integrate with client-side routing.
 *
 * Must render INSIDE <BrowserRouter> so the router hooks have a context. Lives
 * in its own module (not main.tsx) so the Vite entry stays free of component
 * definitions (react-refresh/only-export-components).
 */
export function RouterUiProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <UiProvider navigate={navigate} useHref={useHref}>
      {children}
    </UiProvider>
  );
}
