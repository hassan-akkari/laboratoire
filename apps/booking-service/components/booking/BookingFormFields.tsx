"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarCheck, CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";

import {
  createBookingSchema,
  type CreateBookingInput,
} from "@/lib/bookingSchemas";
import { createBooking } from "@/app/actions/createBooking";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

/**
 * Local-midnight Date for the START of today (no UTC shift). The date-picker
 * uses this to disable past days (`{ before: today }`, exclusive — today stays
 * selectable), exactly replacing the old native `min` attribute.
 */
function todayLocalStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Parse a `YYYY-MM-DD` string to a LOCAL-midnight Date — the inverse of
 * `format(date, "yyyy-MM-dd")`. We construct from numeric parts (never
 * `new Date("2026-07-01")`, which would parse as UTC and shift the day in
 * negative-offset timezones). Returns `undefined` for an empty/invalid value so
 * the calendar renders unselected.
 */
function parseDateValue(value: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Per-variant styling hooks so each chrome can theme the shared fields. */
export type BookingFieldStyles = {
  /** Wrapper around the whole form. */
  formClassName?: string;
  /** Applied to each text/time input + the textarea. */
  controlClassName?: string;
  /**
   * Applied to the date-picker trigger button. Falls back to
   * `controlClassName` when unset so a variant can theme everything at once.
   */
  datePickerTriggerClassName?: string;
  /** Applied to the date-picker popover surface (the Calendar's container). */
  datePickerPopoverClassName?: string;
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
    // Validate only AFTER a submit attempt, then live-correct as the user fixes
    // each field. This is the fix for the punitive "Choose a valid date" that
    // used to fire the instant a user blurred the empty, required date field
    // (the old `mode: "onBlur"`). Nothing errors on initial load or on blur.
    mode: "onSubmit",
    reValidateMode: "onChange",
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

  const today = React.useMemo(() => todayLocalStart(), []);
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
            render={({ field }) => {
              const selected = parseDateValue(field.value);
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Preferred date <RequiredMark />
                  </FormLabel>
                  <DatePickerControl
                    value={field.value}
                    selected={selected}
                    onSelect={(date) =>
                      // Bridge Date → the exact YYYY-MM-DD string zod expects
                      // (`z.string().date()`). Local format, not toISOString,
                      // so there is no UTC day-shift. Empty string when cleared.
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                    }
                    onBlur={field.onBlur}
                    disabledBefore={today}
                    triggerClassName={cn(
                      styles?.controlClassName,
                      styles?.datePickerTriggerClassName,
                    )}
                    popoverClassName={styles?.datePickerPopoverClassName}
                  />
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="preferredTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
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

/**
 * The shadcn date-picker pattern: an outline `Button` trigger that shows the
 * chosen date (or a placeholder) and opens a `Popover` containing a single-mode
 * `Calendar`. Past dates are disabled. Selecting a day closes the popover.
 *
 * The RHF field stays a YYYY-MM-DD string end-to-end; this component only
 * bridges to/from `Date` at the Calendar boundary (see `parseDateValue` and the
 * `format(...)` in `onSelect`).
 *
 * A11y:
 *  - The trigger has an explicit `aria-label` that announces the current value
 *    (or "no date selected"), on top of the visible label wired by FormControl.
 *  - `FormControl` slots onto the trigger so `aria-invalid` + `aria-describedby`
 *    (error/description ids) land on the focusable element.
 *  - The Calendar (react-day-picker) is a keyboard-operable grid by default;
 *    focus moves into it on open and returns to the trigger on close.
 */
function DatePickerControl({
  value,
  selected,
  onSelect,
  onBlur,
  disabledBefore,
  triggerClassName,
  popoverClassName,
}: {
  value: string;
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  onBlur: () => void;
  disabledBefore: Date;
  triggerClassName?: string;
  popoverClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const label = selected ? format(selected, "d MMM yyyy") : "Pick a date";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <FormControl>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            // RHF still tracks touched/blur on the date control.
            onBlur={onBlur}
            aria-label={
              selected
                ? `Preferred date: ${format(selected, "d MMMM yyyy")}. Change date.`
                : "Pick a preferred date"
            }
            data-empty={!value}
            className={cn(
              "h-11 w-full justify-start gap-2 px-3 text-left font-normal data-[empty=true]:text-muted-foreground",
              triggerClassName,
            )}
          >
            <CalendarIcon
              className="size-4 shrink-0 opacity-70"
              aria-hidden="true"
            />
            {label}
          </Button>
        </PopoverTrigger>
      </FormControl>
      <PopoverContent
        align="start"
        className={cn("w-auto p-0", popoverClassName)}
      >
        <Calendar
          mode="single"
          autoFocus
          selected={selected}
          defaultMonth={selected ?? disabledBefore}
          onSelect={(date) => {
            onSelect(date);
            // Close on select (shadcn date-picker behaviour); focus returns to
            // the trigger via Radix's focus management.
            setOpen(false);
          }}
          disabled={{ before: disabledBefore }}
        />
      </PopoverContent>
    </Popover>
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
