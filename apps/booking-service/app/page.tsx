import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">
        Booking Service · MVP
      </p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Book a service in seconds.
      </h1>
      <p className="max-w-prose text-lg text-muted-foreground">
        A generic service-booking engine — public catalogue, booking requests,
        and an admin dashboard. Currently seeded with a beauty/hair demo, but the
        schema is domain-neutral: swap the seed data for any business.
      </p>
      <div className="flex gap-3">
        <Link
          href="/services"
          className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Browse services
        </Link>
      </div>
    </main>
  );
}
