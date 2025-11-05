import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import "./index.css";

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
  await enableMocksIfPossible();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}

bootstrap();
