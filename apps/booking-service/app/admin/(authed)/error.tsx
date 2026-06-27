"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Error boundary for the admin (authed) route group. Client component per the
// Next.js contract; receives `error` + `reset`. Renders inside the (authed)
// layout chrome (header + nav stay visible). Logs the error for diagnosis but
// shows the admin only a friendly message — never the raw error — with a retry
// and a link back to the dashboard.
//
// NOTE: a redirect thrown by requireAdminSession() is a control-flow signal, not
// a real error, and is handled by Next.js before reaching here — so an expired
// session still routes to /admin/login rather than tripping this boundary.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[booking-service] /admin error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg py-12">
      <Card>
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred while loading this admin page. The
            issue has been logged. Try again, or head back to the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={reset}>
            <RotateCw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Back to dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
