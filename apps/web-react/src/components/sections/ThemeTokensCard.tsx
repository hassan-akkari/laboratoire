import { Card, CardBody, CardHeader } from "@heroui/react";

export default function ThemeTokensCard() {
  return (
    <Card className="border border-[--app-border] bg-[--app-card]">
      <CardHeader>
        <h2 className="text-lg font-semibold">Theme tokens</h2>
      </CardHeader>
      <CardBody className="text-sm text-[--app-muted]">
        <p>Colori gestiti con CSS variables (light/dark).</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-[--app-border] bg-[--app-bg] px-3 py-1 text-xs">
            bg
          </span>
          <span className="rounded-full border border-[--app-border] bg-[--app-card] px-3 py-1 text-xs">
            card
          </span>
          <span className="rounded-full border border-[--app-border] bg-[--app-accent] px-3 py-1 text-xs text-white">
            accent
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
