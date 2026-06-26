import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_LABELS, type BookingStatus } from "@/features/bookings/status";

// Pure presentational status pill. No client state, no DB — safe as a server
// component. Each status gets a distinct, accessible colour (text + bg tuned
// for >=4.5:1 in light mode; tokens flip in dark mode).
const STATUS_STYLES: Record<BookingStatus, string> = {
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
  confirmed:
    "bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300",
  completed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
  cancelled:
    "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge variant="secondary" className={cn("border-0", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
