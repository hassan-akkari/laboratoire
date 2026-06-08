import { getCalApi } from "@calcom/embed-react";
import { useEffect, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { AppButton } from "@laboratoire/ui";

const CAL_LINK = (import.meta.env.VITE_CAL_LINK as string | undefined) ?? "itshassan/discovery-call";
const CAL_NAMESPACE = CAL_LINK.split("/")[1] ?? "discovery-call";

type Props = {
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "bordered" | "flat";
};

export default function CalBookButton({ label, size = "lg", variant = "bordered" }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    getCalApi({ namespace: CAL_NAMESPACE }).then((cal) => {
      if (!cancelled) {
        cal("ui", { layout: "month_view", hideEventTypeDetails: false });
        calRef.current = cal;
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppButton
      as="button"
      type="button"
      size={size}
      variant={variant}
      onClick={() => calRef.current?.("modal", { calLink: CAL_LINK })}
      startContent={<FaCalendarAlt aria-hidden="true" />}
    >
      {label}
    </AppButton>
  );
}
