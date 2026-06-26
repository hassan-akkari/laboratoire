import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


// Reads request state (DB, cookies, server actions) → render dynamically.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Booking Service",
  description:
    "A generic service-booking app: public catalogue, booking requests, and an admin dashboard. Seeded here with a beauty/hair demo.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="min-h-dvh">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
