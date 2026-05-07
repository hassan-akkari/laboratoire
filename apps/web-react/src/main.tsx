import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { HeroUIProvider } from "@heroui/react";
import { Analytics } from "@vercel/analytics/react";
import { store } from "./store/store";
import App from "./App";
import "./index.css";

const THEME_KEY = "laboratoire-theme";

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const theme = stored === "light" || stored === "dark" ? stored : "dark";
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.classList.toggle("light", theme === "light");
}

async function enableMocksIfPossible() {
  if (!import.meta.env.DEV) return;
  // SW consentiti solo su https o su localhost/127.0.0.1
  const swAllowed =
    "serviceWorker" in navigator &&
    (location.protocol === "https:" ||
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1");

  if (!swAllowed) {
    console.warn(
      "[MSW] Service Worker non disponibile in questo contesto; mock disabilitati."
    );
    return;
  }

  try {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: { url: import.meta.env.BASE_URL + "mockServiceWorker.js" },
    });
    console.info("[MSW] Mocking abilitato.");
  } catch (err) {
    console.warn("[MSW] Impossibile avviare i mock:", err);
  }
}

async function bootstrap() {
  initTheme();
  await enableMocksIfPossible();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <HeroUIProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Provider store={store}>
          <App />
          <Analytics />
        </Provider>
      </BrowserRouter>
    </HeroUIProvider>
  );
}

bootstrap();
