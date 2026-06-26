import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/FadeUp";
import { SplitHeadline } from "./SplitHeadline";

// Editorial-elegant landing for the demo beauty/hair salon. Calm whitespace,
// a serif display headline (Playfair, via the `font-editorial` token), one
// primary CTA. Tokens only — no hard-coded colours — so it tracks the theme.
// `.theme-editorial` repoints `--font-heading` to Playfair for shadcn surfaces.
export function Home() {
  return (
    <main className="theme-editorial mx-auto flex min-h-dvh max-w-5xl flex-col px-6 sm:px-10">
      {/* Masthead — quiet brand line, like a magazine flag. */}
      <header className="flex items-center justify-between border-b py-6">
        <span className="font-editorial text-lg tracking-tight">Maison</span>
        <nav aria-label="Primary">
          <Link
            href="/services"
            className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            The Menu
          </Link>
        </nav>
      </header>

      {/* Hero — the editorial centrepiece. */}
      <section className="flex flex-1 flex-col justify-center py-20 sm:py-28">
        <FadeUp
          as="p"
          className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary"
        >
          <span aria-hidden className="h-px w-8 bg-primary/60" />
          Hair &amp; Beauty Atelier
        </FadeUp>

        <SplitHeadline
          className="max-w-3xl font-editorial text-5xl leading-[1.05] font-medium tracking-tight text-balance sm:text-6xl md:text-7xl"
          segments={[
            { text: "The art of looking" },
            { text: " effortless", className: "italic" },
            { text: "." },
          ]}
        />

        <FadeUp
          as="p"
          delay={0.25}
          className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
        >
          A quiet studio for considered cuts, colour and braiding. Every
          appointment is unhurried, every finish tailored to you. Browse the
          menu and request a time that suits.
        </FadeUp>

        <FadeUp
          delay={0.35}
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <Button asChild size="lg" className="px-7">
            <Link href="/services">View the menu</Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            By appointment · No deposit to enquire
          </span>
        </FadeUp>
      </section>

      {/* Footnotes — small editorial details that read as a real salon site. */}
      <footer className="grid gap-8 border-t py-10 sm:grid-cols-3">
        <DetailNote label="Studio">
          14 Rue des Tilleuls
          <br />
          Open Tuesday – Saturday
        </DetailNote>
        <DetailNote label="Hours">
          9.00 – 18.00
          <br />
          Evenings by request
        </DetailNote>
        <DetailNote label="Care">
          Precision cuts · Colour
          <br />
          Braids · Treatments
        </DetailNote>
      </footer>
    </main>
  );
}

function DetailNote({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="text-sm">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="leading-relaxed text-foreground/90">{children}</p>
    </div>
  );
}
