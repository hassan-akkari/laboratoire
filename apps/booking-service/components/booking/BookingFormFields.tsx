"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";

import {
  createBookingSchema,
  type CreateBookingInput,
} from "@/lib/bookingSchemas";
import { createBooking } from "@/app/actions/createBooking";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// THE single source of booking-form behaviour: RHF + zodResolver + the server
// action + sonner + the success/confirmation state. The three style variants
// each render their own chrome around THIS island, passing only the service
// identity and optional theme hooks — so the form logic lives in exactly one
// place. Client-only: it imports the schema (pure) and the server-action
// FUNCTION (the documented boundary), never server-only modules.

/** Local YYYY-MM-DD (no UTC shift) for the date input's `min`. */
function todayLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Per-variant styling hooks so each chrome can theme the shared fields. */
export type BookingFieldStyles = {
  /** Wrapper around the whole form. */
  formClassName?: string;
  /** Applied to each text/date input + the textarea. */
  controlClassName?: string;
  /** Applied to the submit button. */
  submitClassName?: string;
  /** Applied to the success confirmation panel. */
  panelClassName?: string;
};

export function BookingFormFields({
  serviceSlug,
  serviceTitle,
  className,
  styles,
}: {
  serviceSlug: string;
  serviceTitle: string;
  className?: string;
  styles?: BookingFieldStyles;
}) {
  const [confirmed, setConfirmed] = React.useState<null | {
    via: string;
    demo: boolean;
  }>(null);

  const form = useForm<CreateBookingInput>({
    resolver: zodResolver(createBookingSchema),
    mode: "onBlur",
    defaultValues: {
      serviceSlug,
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
    },
  });

  const minDate = React.useMemo(() => todayLocal(), []);
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: CreateBookingInput) {
    const result = await createBooking(values);

    if (result.ok) {
      const via = values.customerEmail?.trim()
        ? values.customerEmail.trim()
        : values.customerPhone?.trim() || "your contact details";
      setConfirmed({ via, demo: Boolean(result.demo) });
      if (result.demo) {
        toast.info("Demo mode — request validated but not saved", {
          description:
            "No database is connected, so this booking was not persisted.",
        });
      } else {
        toast.success("Booking request sent", {
          description: `We'll confirm ${serviceTitle} via ${via}.`,
        });
      }
      return;
    }

    // Map server-side field errors back onto the form so they render inline,
    // then focus the first offending field.
    const fieldErrors = "fieldErrors" in result ? result.fieldErrors : undefined;
    const fieldOrder: (keyof CreateBookingInput)[] = [
      "customerName",
      "customerPhone",
      "customerEmail",
      "preferredDate",
      "preferredTime",
      "notes",
    ];
    let focused = false;
    if (fieldErrors) {
      for (const name of fieldOrder) {
        const messages = fieldErrors[name];
        if (messages && messages.length > 0) {
          form.setError(name, { type: "server", message: messages[0] });
          if (!focused) {
            form.setFocus(name);
            focused = true;
          }
        }
      }
    }

    toast.error("Could not send your request", {
      description: result.error,
    });
  }

  // ── Success / confirmation state ──────────────────────────────────────────
  if (confirmed) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "rounded-xl border border-primary/30 bg-primary/5 p-6 text-card-foreground sm:p-8",
          styles?.panelClassName,
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="mt-0.5 size-6 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div>
            <h2 className="font-heading text-xl font-medium tracking-tight">
              Request sent
            </h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Thanks — we&rsquo;ve received your request for{" "}
              <span className="font-medium text-foreground">
                {serviceTitle}
              </span>{" "}
              and will confirm by{" "}
              <span className="font-medium text-foreground">
                {confirmed.via}
              </span>
              .
            </p>
            {confirmed.demo ? (
              <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                Demo mode: no database is connected, so this request was{" "}
                <strong>not saved</strong>.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-5", styles?.formClassName, className)}
      >
        {/* serviceSlug travels with the form via defaultValues (hidden from UI). */}

        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Your name <RequiredMark />
              </FormLabel>
              <FormControl>
                <Input
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className={cn("h-11", styles?.controlClassName)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+353 87 123 4567"
                    className={cn("h-11", styles?.controlClassName)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="jane@example.com"
                    className={cn("h-11", styles?.controlClassName)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormDescription className="-mt-2.5">
          Provide a phone or email so we can confirm your booking.
        </FormDescription>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="preferredDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Preferred date <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={minDate}
                    autoComplete="off"
                    className={cn("h-11", styles?.controlClassName)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    className={cn("h-11", styles?.controlClassName)}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Optional — 24-hour clock.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anything we should know?</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Preferences, accessibility needs, style references…"
                  className={cn("min-h-24", styles?.controlClassName)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className={cn("h-12 w-full text-base", styles?.submitClassName)}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending request…
            </>
          ) : (
            <>
              <CalendarCheck className="size-4" aria-hidden="true" />
              Send booking request
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="text-destructive">
        *
      </span>
      <span className="sr-only">(required)</span>
    </>
  );
}
