import { Card, CardBody, CardHeader, Chip } from "@heroui/react";

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
    <Card className="border border-[--app-border] bg-[--app-card]">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">API status</h2>
        <Chip color={tone.color} variant="flat">
          {tone.label}
        </Chip>
      </CardHeader>
      <CardBody className="gap-2 text-sm text-[--app-muted]">
        <p>
          Endpoint: <span className="font-mono">/api/ping</span>
        </p>
        <p>MSW attivo solo in dev.</p>
      </CardBody>
    </Card>
  );
}
