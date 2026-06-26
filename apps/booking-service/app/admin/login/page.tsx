import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminSession } from "@/lib/adminSession";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in · Booking Service",
  robots: { index: false, follow: false },
};

// Server Component shell. If a valid session already exists, skip the form.
// The form itself is the LoginForm client island.
export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-sm" size="default">
        <CardHeader className="text-center">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Booking · Admin
          </p>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Restricted area. Sign in to manage bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
