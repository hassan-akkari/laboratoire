import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import NavLink from "@/components/NavLink";

export const metadata: Metadata = {
  title: "Control Centre — laboratoire",
  description:
    "Local-only QoL control centre: job search, inbox triage, vault garden, weekly digest.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <aside className="sidebar">
            <div className="brand">
              Control Centre
              <small>laboratoire · local only</small>
            </div>
            <nav>
              <NavLink href="/">☀️ Briefing</NavLink>
              <NavLink href="/scout">🔭 Job scout</NavLink>
              <NavLink href="/tracker">📋 Tracker</NavLink>
              <NavLink href="/inbox">📬 Inbox</NavLink>
              <NavLink href="/garden">🌱 Garden</NavLink>
              <NavLink href="/digest">🗞️ Digest</NavLink>
            </nav>
            <footer>
              mock connectors are
              <br />
              flagged <span className="amber">MOCK</span> — swap the
              <br />
              adapter, keep the app
            </footer>
          </aside>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
