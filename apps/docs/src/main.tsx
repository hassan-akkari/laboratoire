import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import "./index.css";
import "./styles/portfolio.css";
import App from "./App.tsx";
import { store } from "./state/store";
import { RouterUiProvider } from "./RouterUiProvider";

const THEME_KEY = "laboratoire-theme";

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const theme = stored === "light" || stored === "dark" ? stored : "dark";
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.setAttribute("data-theme", theme);
}

initTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <RouterUiProvider>
        <Provider store={store}>
          <App />
          <Analytics />
        </Provider>
      </RouterUiProvider>
    </BrowserRouter>
  </StrictMode>,
)
