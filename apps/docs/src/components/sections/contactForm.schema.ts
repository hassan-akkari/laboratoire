import { z } from "zod";

export type ContactFormErrorLabels = {
  nameShort: string;
  emailInvalid: string;
  messageShort: string;
  privacyRequired: string;
};

export function createContactSchema(labels: ContactFormErrorLabels) {
  return z.object({
    name: z.string().min(2, labels.nameShort).max(120),
    email: z.string().email(labels.emailInvalid),
    message: z.string().min(10, labels.messageShort).max(5000),
    companyWebsite: z.string().optional(),
    startedAt: z.number(),
    privacyAccepted: z
      .boolean()
      .refine((v) => v === true, { message: labels.privacyRequired }),
  });
}

export type ContactValues = z.infer<ReturnType<typeof createContactSchema>>;

export function initialContactValues(): ContactValues {
  return {
    name: "",
    email: "",
    message: "",
    companyWebsite: "",
    startedAt: Date.now(),
    // `false` is intentionally outside the refined `true` narrowing — TS allows
    // it because the input type of safeParse is `unknown`. The form state holds
    // the pre-validated value.
    privacyAccepted: false as unknown as true,
  };
}
