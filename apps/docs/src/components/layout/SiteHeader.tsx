import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Container from "./Container";
import { ThemeToggle } from "@laboratoire/ui";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = (open: boolean) => setMenuOpen(open);

  return (
    <div id="header">
      <Container>
        <nav>
          <img className="logo" src="favicon.png" alt="Laboratoire logo" />
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
            <button
              type="button"
              className="fa-solid fa-xmark nav-icon-button"
              onClick={() => toggleMenu(false)}
              aria-label="Close navigation menu"
            >
              <FaTimes />
            </button>
          </ul>
          <div className="nav-actions">
            <ThemeToggle />
            <button
              type="button"
              className="fa-solid fa-bars nav-icon-button"
              onClick={() => toggleMenu(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="sidemenu"
            >
              <FaBars />
            </button>
          </div>
        </nav>

        <div className="header-text">
          <p>Web Developer</p>
          <h1>
            Hi, I'm <span> Hassan </span>
            <br />
            Welcome to my website
          </h1>
        </div>
      </Container>
    </div>
  );
}
