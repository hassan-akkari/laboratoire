"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BOOKING_STATUSES,
  STATUS_LABELS,
  type BookingStatus,
} from "@/features/bookings/status";
import { updateBookingStatus } from "./actions";

// Per-row status control. Imports ONLY the action function + pure types. On
// change it optimistically reflects the new value, calls the server action
// (which re-checks auth + validates the enum server-side), and reverts on
// failure. revalidatePath in the action refreshes the table/stats.
export function StatusSelect({
  bookingId,
  current,
  customerName,
}: {
  bookingId: string;
  current: BookingStatus;
  customerName: string;
}) {
  const [value, setValue] = useState<BookingStatus>(current);
  const [pending, startTransition] = useTransition();

  function onChange(next: string) {
    const nextStatus = next as BookingStatus;
    if (nextStatus === value) return;
    const previous = value;
    setValue(nextStatus); // optimistic
    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, nextStatus);
      if (!result.ok) {
        setValue(previous); // revert
        toast.error(result.error);
        return;
      }
      toast.success(`${customerName} → ${STATUS_LABELS[nextStatus]}`);
    });
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={pending}>
      <SelectTrigger
        size="sm"
        className="w-35"
        aria-label={`Update status for ${customerName}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {BOOKING_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
