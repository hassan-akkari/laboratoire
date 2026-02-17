import { useMemo } from "react";
import { Analytics } from "@vercel/analytics/react";
import { usePingQuery } from "./store/api";
import { useTheme } from "./hooks/useTheme";
import PageLayout from "./components/layout/PageLayout";
import PageHeader from "./components/layout/PageHeader";
import StatusCard, { type ApiStatus } from "./components/sections/StatusCard";
import ThemeTokensCard from "./components/sections/ThemeTokensCard";
import NextSteps from "./components/sections/NextSteps";
import HeroForm from "./components/forms/HeroForm";

function App() {
  const { data, isError, isLoading } = usePingQuery();
  const { theme, toggleTheme } = useTheme();

  const apiStatus = useMemo<ApiStatus>(() => {
    if (isLoading) return "checking";
    if (isError) return "offline";
    if (data?.ok) return "online";
    return "unknown";
  }, [data, isError, isLoading]);

  return (
    <PageLayout>
      <PageHeader theme={theme} onToggleTheme={toggleTheme} />

      <section className="grid gap-6 md:grid-cols-2">
        <StatusCard status={apiStatus} />
        <ThemeTokensCard />
      </section>

      <HeroForm />
      <NextSteps />
      <Analytics />
    </PageLayout>
  );
}

export default App;
