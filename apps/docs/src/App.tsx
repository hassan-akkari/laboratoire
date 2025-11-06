import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaCode,
  FaDraftingCompass,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const base = import.meta.env.BASE_URL; // "/" in dev, "/laboratoire/" in prod (Pages)

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = (v: boolean) => setMenuOpen(v);

  return (
    <>
      {/* HEADER */}
      <div id="header">
        <div className="container">
          <nav>
            <img className="logo" />
            <ul
              id="sidemenu"
              className={menuOpen ? "open" : ""}
              onClick={() => toggleMenu(false)}
            >
              <li>
                <a href="#header">Home</a>
              </li>
              <li>
                <a href="#about">About me</a>
              </li>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#portfolio">Projects</a>
              </li>
              <li>
                <a href="#contact">Contact me</a>
              </li>
              <i className="fa-solid fa-xmark">
                <FaTimes />
              </i>
            </ul>
            <i className="fa-solid fa-bars" onClick={() => toggleMenu(true)}>
              <FaBars />
            </i>
          </nav>

          <div className="header-text">
            <p>Web Developer </p>
            <h1>
              Hi, I'm <span> Hassan </span>
              <br />
              Welcome to my website
            </h1>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div id="about">
        <div className="container">
          <div className="row">
            <div className="about-col-1">
              <img src={`${base}image/mePNG.png`} alt="Hassan portrait" />
            </div>
            <div className="about-col-2">
              <h1 className="sub-title">About me</h1>
              <p>
                Hi there,
                <br />I am quite curious, and I like to connect dots in
                patterns. <br />
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
                    <span>
                      October 2022 - June 2023 (BetterTogether - Rome)
                    </span>
                    <br />
                    Junior Developer - Stage
                  </li>
                </ul>
              </div>

              <div className="tab-contents" id="edu">
                <ul>
                  <li>
                    <span>
                      September 2019 - June 2021 (Uxbridge College - London)
                    </span>
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
        </div>
      </div>

      {/* SERVICES */}
      <div id="services">
        <div className="container">
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
        </div>
      </div>

      {/* PORTFOLIO */}
      <div id="portfolio" style={{ padding: "50px 0" }}>
        <div className="container">
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
              <img src={`${base}image/LaBrochure.png`} alt="Starbucks Ad" />
              <div className="layer">
                <h3>Starbucks Ad</h3>
                <p>
                  I used HTML, CSS and JavaScript to make this Starbucks page.
                </p>
              </div>
            </div>

            <div className="work">
              <img
                src={`${base}image/WorkBetterTgter.png`}
                alt="Work project"
              />
              <div className="layer">
                <h3>Work</h3>
                <p>
                  A project that uses data validation, and sends data to
                  Database.
                </p>
              </div>
            </div>
          </div>
          <a className="btn">Work in progress</a>
        </div>
      </div>

      {/* CONTACT */}
      <div id="contact">
        <div className="container">
          <div className="row">
            <div className="contact-left">
              <h1 className="sub-title">Contact me</h1>
              <p>
                <FaEnvelope /> hassan.akkari01@gmail.com
              </p>
              <p style={{ fontSize: 13 }}>
                Number shared when getting emailed.
              </p>
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
              <a
                href={`${base}pdf/CV-ENG-102025.pdf`}
                download
                className="btn btn2"
              >
                Download CV
              </a>
            </div>

            <div className="contact-right">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("msg");
                  if (el) el.textContent = "Thanks! I’ll get back to you.";
                }}
              >
                <input
                  type="text"
                  name="Name"
                  placeholder="Your name"
                  required
                />
                <input
                  type="email"
                  name="Email"
                  placeholder="Your email"
                  required
                />
                <textarea name="Message" rows={6} placeholder="Your message" />
                <button type="submit" className="btn btn2">
                  Submit
                </button>
              </form>
              <span id="msg"></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
