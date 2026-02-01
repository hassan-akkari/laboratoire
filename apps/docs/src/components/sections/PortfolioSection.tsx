import Container from "../layout/Container";
import Section from "../layout/Section";
import { AppButton } from "@laboratoire/ui";

type PortfolioSectionProps = {
  baseUrl: string;
};

export default function PortfolioSection({ baseUrl }: PortfolioSectionProps) {
  return (
    <Section id="portfolio">
      <Container>
        <h1 className="sub-title">My Work</h1>
        <div
          className="work-list"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 40,
            marginTop: 50,
          }}
        >
          <div className="work">
            <img src={`${baseUrl}image/LaBrochure.png`} alt="Starbucks Ad" />
            <div className="layer">
              <h3>Starbucks Ad</h3>
              <p>I used HTML, CSS and JavaScript to make this Starbucks page.</p>
            </div>
          </div>

          <div className="work">
            <img src={`${baseUrl}image/WorkBetterTgter.png`} alt="Work project" />
            <div className="layer">
              <h3>Work</h3>
              <p>A project that uses data validation, and sends data to Database.</p>
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <AppButton variant="bordered">Work in progress</AppButton>
        </div>
      </Container>
    </Section>
  );
}
