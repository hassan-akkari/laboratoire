import Container from "../layout/Container";
import Section from "../layout/Section";

type AboutSectionProps = {
  baseUrl: string;
};

export default function AboutSection({ baseUrl }: AboutSectionProps) {
  return (
    <Section id="about">
      <Container>
        <div className="row">
          <div className="about-col-1">
            <img src={`${baseUrl}image/mePNG.png`} alt="Hassan portrait" />
          </div>
          <div className="about-col-2">
            <h1 className="sub-title">About me</h1>
            <p>
              Hi there,
              <br />I am quite curious, and I like to connect dots in patterns.
              <br />
              Technology is interesting, and I enjoy finding creative
              <br />
              solutions to make things work.
            </p>

            <div className="tab-title">
              <p className="tab-links active-link">Skills</p>
              <p className="tab-links">Exp</p>
              <p className="tab-links">Edu</p>
              <p className="tab-links">General</p>
            </div>

            <div className="tab-contents active-tab" id="skills">
              <ul>
                <li>
                  <span>Front-End</span>
                  <br />
                  CSS, Javascript, HTML, Bootstrap
                </li>
                <li>
                  <span>Back-End</span>
                  <br />
                  .NET, C#
                </li>
                <li>
                  <span>Others</span>
                  <br />
                  SQL Server, REST API, GitHub Pages
                </li>
              </ul>
            </div>

            <div className="tab-contents" id="exp">
              <ul>
                <li>
                  <span>October 2022 - June 2023 (BetterTogether - Rome)</span>
                  <br />
                  Junior Developer - Stage
                </li>
              </ul>
            </div>

            <div className="tab-contents" id="edu">
              <ul>
                <li>
                  <span>September 2019 - June 2021 (Uxbridge College - London)</span>
                  <br />
                  Diploma in Computer Science
                </li>
              </ul>
            </div>

            <div className="tab-contents" id="general">
              <ul>
                <li>
                  <span>Languages</span>
                  <br />
                  Italian, English, Arabic (Darija)
                </li>
                <li>
                  <span>Microsoft</span>
                  <br />
                  Excel, Word
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
