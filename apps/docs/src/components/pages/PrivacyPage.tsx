import Link from "next/link";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import type { Messages } from "../../i18n/messages";

type PrivacyPageProps = {
  locale: Locale;
  labels: Messages;
};

export default function PrivacyPage({ locale, labels }: PrivacyPageProps) {
  const { privacy } = labels;
  return (
    <Section id="privacy">
      <Container>
        <div className="privacy-page" style={{ maxWidth: "70ch", margin: "0 auto", padding: "32px 0" }}>
          <h1 className="sub-title">{privacy.title}</h1>
          <p>{privacy.intro}</p>
          {privacy.sections.map((section) => (
            <section key={section.heading} style={{ marginTop: 20 }}>
              <h2 style={{ fontSize: "1.2rem", margin: "0 0 6px" }}>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <p style={{ marginTop: 32 }}>
            <Link href={localePath(locale)}>← {privacy.backToSite}</Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}
