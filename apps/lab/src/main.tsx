import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UiProvider } from "@laboratoire/ui";

import "./index.css";
import App from "./App.tsx";

const THEME_KEY = "laboratoire-theme";

// Mirror docs: default dark, persisted in localStorage. ThemeToggle (from the lib)
// flips the same `data-theme` + .dark/.light classes the CSS vars key off.
function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const theme = stored === "light" || stored === "dark" ? stored : "dark";
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.setAttribute("data-theme", theme);
}

initTheme();

// No router here, so UiProvider gets no navigate/useHref — its full HeroUIProvider
// passthrough makes them optional. Link/anchor components fall back to native nav.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UiProvider>
      <App />
    </UiProvider>
  </StrictMode>,
);
