import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { usePingQuery } from "./store/api";

const THEME_KEY = "laboratoire-theme";

type Theme = "dark" | "light";

function App() {
  const { data, isError, isLoading } = usePingQuery();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const apiStatus = useMemo(() => {
    if (isLoading) return "checking";
    if (isError) return "offline";
    if (data?.ok) return "online";
    return "unknown";
  }, [data, isError, isLoading]);

  return (
    <div className="min-h-screen bg-[--app-bg] text-[--app-fg] transition-colors">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[--app-muted]">
              laboratoire
            </p>
            <h1 className="text-3xl font-semibold md:text-4xl">
              Tailwind themes + HeroUI
            </h1>
            <p className="mt-2 text-sm text-[--app-muted]">
              Base pronta per componenti Tailwind Plus e UI kit.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="flat"
              onPress={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
              }
            >
              Switch to {theme === "dark" ? "light" : "dark"}
            </Button>
            <Button color="primary">Primary action</Button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[--app-border] bg-[--app-card] p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Status</h2>
            <p className="mt-2 text-sm text-[--app-muted]">
              API: <span className="font-medium text-[--app-fg]">{apiStatus}</span>
            </p>
            <p className="text-xs text-[--app-muted]">
              Endpoint: <span className="font-mono">/api/ping</span> (MSW in dev)
            </p>
          </div>

          <div className="rounded-2xl border border-[--app-border] bg-[--app-card] p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Theme tokens</h2>
            <p className="mt-2 text-sm text-[--app-muted]">
              Colori gestiti via CSS variables per light/dark.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-[--app-border] bg-[--app-bg] px-3 py-1 text-xs">
                bg
              </span>
              <span className="rounded-full border border-[--app-border] bg-[--app-card] px-3 py-1 text-xs">
                card
              </span>
              <span className="rounded-full border border-[--app-border] bg-[--app-accent] px-3 py-1 text-xs text-white">
                accent
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[--app-border] bg-[--app-card] p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Next steps</h2>
          <ol className="mt-3 list-decimal pl-4 text-sm text-[--app-muted]">
            <li>Importa i componenti di Tailwind Plus qui.</li>
            <li>Definisci una palette ufficiale per il brand.</li>
            <li>Aggiungi layout/page reali e routing.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}

export default App;
