import { AppButton } from "@laboratoire/ui";
import type { ThemeMode } from "../../hooks/useTheme";

type PageHeaderProps = {
  theme: ThemeMode;
  onToggleTheme: () => void;
};

export default function PageHeader({ theme, onToggleTheme }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[--app-muted]">
          laboratoire
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">
          Tailwind + HeroUI base kit
        </h1>
        <p className="mt-2 text-sm text-[--app-muted]">
          Componenti pronti (bottoni, form, theme) da riusare ovunque.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <AppButton variant="bordered" onPress={onToggleTheme}>
          Switch to {theme === "dark" ? "light" : "dark"}
        </AppButton>
        <AppButton color="primary">Primary action</AppButton>
        <AppButton variant="flat" color="secondary">
          Secondary
        </AppButton>
      </div>
    </header>
  );
}
