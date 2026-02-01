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
          <img className="logo" src="favicon.png" alt="" />
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
          <div className="nav-actions">
            <ThemeToggle />
            <i className="fa-solid fa-bars" onClick={() => toggleMenu(true)}>
              <FaBars />
            </i>
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
