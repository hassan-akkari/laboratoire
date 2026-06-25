import { AppCard, AppCardBody, AppCardHeader, AppChip } from "@laboratoire/ui";

export type ApiStatus = "online" | "offline" | "checking" | "unknown";

const statusTone: Record<
  ApiStatus,
  { label: string; color: "default" | "success" | "warning" | "danger" }
> = {
  online: { label: "Online", color: "success" },
  offline: { label: "Offline", color: "danger" },
  checking: { label: "Checking", color: "warning" },
  unknown: { label: "Unknown", color: "default" },
};

type StatusCardProps = {
  status: ApiStatus;
};

export default function StatusCard({ status }: StatusCardProps) {
  const tone = statusTone[status];

  return (
    <AppCard className="border border-[--app-border] bg-[--app-card]">
      <AppCardHeader className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">API status</h2>
        <AppChip color={tone.color} variant="flat">
          {tone.label}
        </AppChip>
      </AppCardHeader>
      <AppCardBody className="gap-2 text-sm text-[--app-muted]">
        <p>
          Endpoint: <span className="font-mono">/api/ping</span>
        </p>
        <p>MSW attivo solo in dev.</p>
      </AppCardBody>
    </AppCard>
  );
}
