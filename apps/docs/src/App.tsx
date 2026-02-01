import AboutSection from "./components/sections/AboutSection";
import ContactSection from "./components/sections/ContactSection";
import PortfolioSection from "./components/sections/PortfolioSection";
import ServicesSection from "./components/sections/ServicesSection";
import SiteHeader from "./components/layout/SiteHeader";

const base = import.meta.env.BASE_URL;

export default function App() {
  return (
    <>
      <SiteHeader />
      <AboutSection baseUrl={base} />
      <ServicesSection />
      <PortfolioSection baseUrl={base} />
      <ContactSection baseUrl={base} />
    </>
  );
}
