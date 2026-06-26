import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dbReady } from "@/lib/db/client";
import { formatDateTime, formatPreferredSlot } from "@/lib/format";
import { requireAdminSession } from "@/lib/adminSession";
import { listBookings } from "@/features/bookings/queries";
import { StatusBadge } from "./StatusBadge";
import { StatusSelect } from "./StatusSelect";

export const metadata: Metadata = {
  title: "Bookings · Admin",
  robots: { index: false, follow: false },
};

// Read request state (session cookie, DB) → render dynamically.
export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  // Defence in depth: the (authed) layout already gated this, but every admin
  // page re-checks server-side. Never trust the layout/middleware alone.
  await requireAdminSession();

  const bookings = await listBookings();
  const total = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Incoming booking requests, newest first.
        </p>
      </div>

      {!dbReady ? (
        <Card>
          <CardHeader>
            <CardTitle>Database not configured</CardTitle>
            <CardDescription>
              Set <code className="font-mono">DATABASE_URL</code> (Neon) and run{" "}
              <code className="font-mono">db:push</code> +{" "}
              <code className="font-mono">db:seed</code> to load bookings.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total bookings" value={total} />
            <StatCard label="Pending" value={pendingCount} accent="amber" />
            <StatCard label="Confirmed" value={confirmedCount} accent="blue" />
          </div>

          {/* Bookings table */}
          <Card className="overflow-hidden p-0">
            {total === 0 ? (
              <CardContent className="py-16 text-center">
                <p className="text-sm font-medium">No bookings yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  New requests from the booking form will appear here.
                </p>
              </CardContent>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Received</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Preferred</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Set status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(b.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{b.customerName}</div>
                        <div className="text-xs text-muted-foreground">
                          {b.customerEmail ?? b.customerPhone ?? "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {b.serviceTitle ?? (
                          <span className="text-muted-foreground italic">
                            Deleted service
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatPreferredSlot(b.preferredDate, b.preferredTime)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={b.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <StatusSelect
                            bookingId={b.id}
                            current={b.status}
                            customerName={b.customerName}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "amber" | "blue";
}) {
  const accentClass =
    accent === "amber"
      ? "text-amber-600 dark:text-amber-400"
      : accent === "blue"
        ? "text-blue-600 dark:text-blue-400"
        : "text-foreground";
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className={`text-3xl tabular-nums ${accentClass}`}>
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
