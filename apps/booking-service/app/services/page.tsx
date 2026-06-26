import { dbReady } from "@/lib/db/client";
import { listActiveServices } from "@/features/services/queries";
import { getStyle } from "@/lib/style";
import { Services as EditorialServices } from "@/components/styles/editorial/Services";
import { Services as WarmServices } from "@/components/styles/warm/Services";
import { Services as BoldServices } from "@/components/styles/bold/Services";

// "Razor View": calls the query layer (the repository) ONCE and hands the rows
// + the dbReady flag down to whichever variant's <Services> is active. No
// SQL/Drizzle here; no per-variant refetch. The active design comes from the
// `bs_style` cookie via getStyle(). Data flow:
//   request → listActiveServices() (DB or demo fallback) → rows → variant → HTML.
export default async function ServicesPage() {
  const [services, style] = await Promise.all([
    listActiveServices(),
    getStyle(),
  ]);

  switch (style) {
    case "editorial":
      return <EditorialServices services={services} dbReady={dbReady} />;
    case "warm":
      return <WarmServices services={services} dbReady={dbReady} />;
    case "bold":
      return <BoldServices services={services} dbReady={dbReady} />;
  }
}
