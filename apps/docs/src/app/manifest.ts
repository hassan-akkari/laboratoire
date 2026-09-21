import type { MetadataRoute } from "next";

/**
 * Web app manifest — brand identity for installs, new-tab tiles and the
 * odd crawler that reads it. start_url is the bare root on purpose: the
 * proxy locale-redirects it to the visitor's language.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hassan Akkari — Freelance Web Developer",
    short_name: "itshassan.it",
    description:
      "Freelance web developer in Rome — websites, web apps and a digital garden of working notes.",
    start_url: "/",
    display: "browser",
    background_color: "#080808",
    theme_color: "#080808",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
