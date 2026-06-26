import { getStyle } from "@/lib/style";
import { Home as EditorialHome } from "@/components/styles/editorial/Home";
import { Home as WarmHome } from "@/components/styles/warm/Home";
import { Home as BoldHome } from "@/components/styles/bold/Home";

// Public landing page. All three competing designs ship at once; the active one
// is chosen by the `bs_style` cookie (read here via getStyle()) and switched
// live by the floating StyleSwitcher. This page stays a thin Server Component —
// it just picks which variant's <Home> to render. Each variant composes its own
// small motion islands internally.
export default async function HomePage() {
  const style = await getStyle();

  switch (style) {
    case "editorial":
      return <EditorialHome />;
    case "warm":
      return <WarmHome />;
    case "bold":
      return <BoldHome />;
  }
}
