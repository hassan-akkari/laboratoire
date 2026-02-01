import { FaEnvelope, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { AppButton } from "@laboratoire/ui";
import Container from "../layout/Container";
import Section from "../layout/Section";
import ContactForm from "./ContactForm";

type ContactSectionProps = {
  baseUrl: string;
};

export default function ContactSection({ baseUrl }: ContactSectionProps) {
  return (
    <Section id="contact">
      <Container>
        <div className="row">
          <div className="contact-left">
            <h1 className="sub-title">Contact me</h1>
            <p>
              <FaEnvelope /> hassan.akkari01@gmail.com
            </p>
            <p style={{ fontSize: 13 }}>Number shared when getting emailed.</p>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/hassan.akkari.714"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://instagram.com/its.hassan.main?igshid=OGQ5ZDc2ODk2ZA=="
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/hassan-akkari"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
            <AppButton
              as="a"
              href={`${baseUrl}pdf/CV-ENG-102025.pdf`}
              download
              className="mt-6 w-fit"
            >
              Download CV
            </AppButton>
          </div>

          <div className="contact-right">
            <ContactForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
