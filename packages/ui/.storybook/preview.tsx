import "./preview.css";
import type { Decorator, Preview } from "@storybook/react";
import { HeroUIProvider } from "@heroui/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import { useEffect, type ReactNode } from "react";

initialize();

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as "light" | "dark";
  return (
    <ThemeRoot theme={theme}>
      <Story />
    </ThemeRoot>
  );
};

function ThemeRoot({
  theme,
  children,
}: {
  theme: "light" | "dark";
  children: ReactNode;
}) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    root.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Theme",
      defaultValue: "dark",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        showName: true,
      },
    },
  },
  loaders: [mswLoader],
  decorators: [
    (Story) => (
      <HeroUIProvider>
        <Story />
      </HeroUIProvider>
    ),
    withTheme,
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
