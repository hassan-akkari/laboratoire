"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { setServiceActive } from "./actions";

// Per-row active toggle. Imports ONLY the action function. Optimistically flips,
// calls the server action (which re-checks auth + validates server-side), and
// reverts on failure. revalidatePath in the action refreshes the table.
export function ServiceActiveToggle({
  serviceId,
  active,
  title,
}: {
  serviceId: string;
  active: boolean;
  title: string;
}) {
  const [value, setValue] = useState(active);
  const [pending, startTransition] = useTransition();

  function onChange(next: boolean) {
    if (next === value) return;
    const previous = value;
    setValue(next); // optimistic
    startTransition(async () => {
      const result = await setServiceActive(serviceId, next);
      if (!result.ok) {
        setValue(previous); // revert
        toast.error(result.error);
        return;
      }
      toast.success(
        `${title} ${next ? "activated" : "deactivated"}`,
      );
    });
  }

  return (
    <Switch
      checked={value}
      onCheckedChange={onChange}
      disabled={pending}
      aria-label={`${value ? "Deactivate" : "Activate"} ${title}`}
    />
  );
}
