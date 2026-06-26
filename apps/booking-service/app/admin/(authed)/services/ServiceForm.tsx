"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { serviceSchema, type ServiceInput } from "@/lib/serviceSchemas";
import type { ServiceActionResult } from "./actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Shared admin form for CREATE and EDIT (mirrors components/booking/
// BookingFormFields.tsx: RHF + zodResolver + sonner, mode:"onSubmit" /
// reValidateMode:"onChange"). It imports the SAME pure schema the server action
// validates against (`serviceSchema`, cents) and the action FUNCTION as a prop —
// never a server-only module. On a {ok:false} result it shows a toast; on
// success the action redirects (so the happy path never returns here).
//
// PRICES: the RHF value type IS `ServiceInput` (cents) so the resolver validates
// exactly what the action receives. The two price fields render a EURO display
// layer (cents → "35.00" shown; typed euros → Math.round(*100) stored as cents),
// so the user sees euros while the validated/submitted value stays integer cents.

/** cents → a euros display string ("3500" → "35", "3550" → "35.50"). */
function centsToEuroStr(cents: number | null | undefined): string {
  if (cents == null) return "";
  const euros = cents / 100;
  // Trim a trailing ".00" for whole euros, keep cents otherwise.
  return Number.isInteger(euros) ? String(euros) : euros.toFixed(2);
}

/** A euros input string → integer cents, or null when blank. NaN for garbage so
 *  the schema's number check reports it. */
function euroStrToCents(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const euros = Number(trimmed);
  if (Number.isNaN(euros)) return Number.NaN;
  return Math.round(euros * 100);
}

/** Gallery textarea ↔ RHF value. The user types ONE URL per line; we split on
 *  newlines, trim each, and drop blank lines so trailing/empty lines don't
 *  become invalid "" entries (which the schema's url() check would reject). The
 *  resulting array is what serviceSchema validates and the action persists. */
function linesToUrls(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export type ServiceFormProps = {
  mode: "create" | "edit";
  /** Pre-fill for edit; omit for create. */
  defaultValues?: Partial<ServiceInput>;
  /** Bound action. Create: (input). Edit: (input) with id already closed over. */
  action: (input: ServiceInput) => Promise<ServiceActionResult>;
};

export function ServiceForm({ mode, defaultValues, action }: ServiceFormProps) {
  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      title: defaultValues?.title ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
      category: defaultValues?.category ?? null,
      durationMin: defaultValues?.durationMin ?? 60,
      priceFromCents: defaultValues?.priceFromCents ?? 0,
      priceToCents: defaultValues?.priceToCents ?? null,
      imageUrl: defaultValues?.imageUrl ?? null,
      // Gallery: always an array (never undefined) so the RHF value type stays
      // `string[]` and lines up with serviceSchema's required `images` field.
      images: defaultValues?.images ?? [],
      active: defaultValues?.active ?? true,
      sortOrder: defaultValues?.sortOrder ?? 0,
    },
  });

  // Local display strings for the two euro inputs (so partial typing like "35."
  // is preserved while the underlying RHF value stays integer cents).
  const [priceFromStr, setPriceFromStr] = React.useState(() =>
    centsToEuroStr(defaultValues?.priceFromCents ?? 0),
  );
  const [priceToStr, setPriceToStr] = React.useState(() =>
    centsToEuroStr(defaultValues?.priceToCents ?? null),
  );
  // Local textarea text for the gallery (one URL per line). Pre-fills on EDIT by
  // joining the saved array; the underlying RHF value stays a string[] (kept in
  // sync on every keystroke via linesToUrls).
  const [galleryStr, setGalleryStr] = React.useState(() =>
    (defaultValues?.images ?? []).join("\n"),
  );

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: ServiceInput) {
    // `values` is already cents + normalised by the resolver. Hand it straight
    // to the action; on success the action redirects (throws), so code below the
    // await only runs on a returned {ok:false}.
    const result = await action(values);
    if (!result.ok) {
      toast.error(
        mode === "create"
          ? "Could not create the service"
          : "Could not save changes",
        { description: result.error },
      );
    }
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-5"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Classic Haircut"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="classic-haircut"
                  className="h-11 font-mono"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Lowercase letters, numbers and single dashes. Used in the public
                URL.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="What the service includes…"
                  className="min-h-24"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Hair, Braids, Treatment…"
                    className="h-11"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.value === "" ? null : e.target.value)
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormDescription>Optional.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="durationMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    className="h-11"
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? Number.NaN
                          : e.target.valueAsNumber,
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="priceFromCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting price (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    placeholder="35.00"
                    className="h-11"
                    value={priceFromStr}
                    onChange={(e) => {
                      setPriceFromStr(e.target.value);
                      const cents = euroStrToCents(e.target.value);
                      // Blank → 0 (column is NN default 0); else cents (NaN flags
                      // invalid for the resolver).
                      field.onChange(cents == null ? 0 : cents);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormDescription>Shown to customers as “from €X”.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceToCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum price (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    placeholder="Optional"
                    className="h-11"
                    value={priceToStr}
                    onChange={(e) => {
                      setPriceToStr(e.target.value);
                      field.onChange(euroStrToCents(e.target.value));
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormDescription>
                  Optional. Leave blank for “from” pricing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero image URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  placeholder="https://…"
                  className="h-11"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? null : e.target.value)
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>
                Optional. The main image at the top of the detail page. If left
                blank, the first gallery image is used as the hero.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gallery image URLs (one per line)</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={"https://…\nhttps://…"}
                  className="min-h-24 font-mono text-sm"
                  value={galleryStr}
                  onChange={(e) => {
                    setGalleryStr(e.target.value);
                    field.onChange(linesToUrls(e.target.value));
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>
                Optional. One image URL per line (up to 12). Shown as a gallery
                below the hero on the public detail page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    className="h-11"
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? Number.NaN
                          : e.target.valueAsNumber,
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormDescription>
                  Lower numbers appear first in the catalogue.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Active</FormLabel>
                <div className="flex h-11 items-center gap-3">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="Active"
                    />
                  </FormControl>
                  <span className="text-sm text-muted-foreground">
                    {field.value
                      ? "Visible in the public catalogue."
                      : "Hidden from customers."}
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            asChild
          >
            <a href="/admin/services">Cancel</a>
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className={cn("min-w-32")}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Saving…
              </>
            ) : (
              <>
                <Save className="size-4" aria-hidden="true" />
                {mode === "create" ? "Create service" : "Save changes"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
