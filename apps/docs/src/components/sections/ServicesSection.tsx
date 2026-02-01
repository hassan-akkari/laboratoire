import { FaCode, FaDraftingCompass } from "react-icons/fa";
import Container from "../layout/Container";
import Section from "../layout/Section";

export default function ServicesSection() {
  return (
    <Section id="services">
      <Container>
        <h1 className="sub-title">My Services</h1>
        <div className="services-list">
          <div>
            <i className="fa-solid fa-code">
              <FaCode />
            </i>
            <h2>Web Development</h2>
            <p>Create and develop a website</p>
          </div>
          <div>
            <i className="fa-solid fa-compass-drafting">
              <FaDraftingCompass />
            </i>
            <h2>UI/UX Design</h2>
            <p>
              Create a user friendly interface, and have efficient user
              experience
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
