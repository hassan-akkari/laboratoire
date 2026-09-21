"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addApplication, setStatus, updateApplication } from "./store";
import { APPLICATION_STATUSES } from "./schema";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function refresh(): void {
  revalidatePath("/tracker");
  revalidatePath("/");
}

const addInputSchema = z.object({
  company: z.string().trim().min(1),
  role: z.string().trim().min(1),
  location: z.string().trim().min(1),
  source: z.string().trim().min(1),
  stack: z.string().trim(),
  notes: z.string().trim(),
});

export async function addApplicationAction(formData: FormData): Promise<void> {
  const input = addInputSchema.parse({
    company: formData.get("company"),
    role: formData.get("role"),
    location: formData.get("location"),
    source: formData.get("source") || "manual",
    stack: formData.get("stack") ?? "",
    notes: formData.get("notes") ?? "",
  });

  await addApplication({
    company: input.company,
    role: input.role,
    location: input.location,
    source: input.source,
    stack: input.stack
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
    status: "applied",
    appliedAt: todayIso(),
    lastContactAt: todayIso(),
    nextFollowUpAt: null,
    notes: input.notes,
  });
  refresh();
}

const setStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(APPLICATION_STATUSES),
});

export async function setStatusAction(formData: FormData): Promise<void> {
  const input = setStatusSchema.parse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  await setStatus(input.id, input.status, todayIso());
  refresh();
}

const setFollowUpSchema = z.object({
  id: z.string().min(1),
  // Empty string = clear the follow-up.
  nextFollowUpAt: z.union([isoDate, z.literal("")]),
});

export async function setFollowUpAction(formData: FormData): Promise<void> {
  const input = setFollowUpSchema.parse({
    id: formData.get("id"),
    nextFollowUpAt: formData.get("nextFollowUpAt") ?? "",
  });
  await updateApplication(input.id, {
    nextFollowUpAt: input.nextFollowUpAt === "" ? null : input.nextFollowUpAt,
  });
  refresh();
}
