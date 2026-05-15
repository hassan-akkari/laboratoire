import { useMemo, useState, type FormEvent } from "react";
import { AppButton, AppInput, AppTextarea } from "@laboratoire/ui";
import {
  createContactSchema,
  initialContactValues,
  type ContactValues,
} from "./contactForm.schema";
import type { Messages } from "../../i18n/messages";

type ContactFormProps = {
  labels: Messages["contact"];
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const adminBaseUrl = (import.meta.env.VITE_ADMIN_API_BASE as string | undefined)?.replace(
  /\/$/,
  "",
);

export default function ContactForm({ labels }: ContactFormProps) {
  const [values, setValues] = useState<ContactValues>(() => initialContactValues());
  const [errors, setErrors] = useState<Partial<Record<keyof ContactValues, string>>>({});
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });

  const schema = useMemo(
    () =>
      createContactSchema({
        nameShort: labels.formErrorNameShort,
        emailInvalid: labels.formErrorEmailInvalid,
        messageShort: labels.formErrorMessageShort,
        privacyRequired: labels.formErrorPrivacyRequired,
      }),
    [labels],
  );

  const updateField = <K extends keyof ContactValues>(key: K, value: ContactValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (submit.kind === "success") setSubmit({ kind: "idle" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const nextErrors: Partial<Record<keyof ContactValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactValues | undefined;
        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
      setErrors(nextErrors);
      setSubmit({ kind: "idle" });
      return;
    }

    setErrors({});
    setSubmit({ kind: "submitting" });

    if (!adminBaseUrl) {
      setSubmit({ kind: "error", message: labels.formError });
      return;
    }

    try {
      const response = await fetch(`${adminBaseUrl}/api/leads`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: result.data.name,
          email: result.data.email,
          message: result.data.message,
          company_website: result.data.companyWebsite ?? "",
          started_at: result.data.startedAt,
          privacy_accepted: result.data.privacyAccepted,
        }),
      });
      if (!response.ok) {
        setSubmit({ kind: "error", message: labels.formError });
        return;
      }
      setSubmit({ kind: "success" });
      setValues(initialContactValues());
    } catch {
      setSubmit({ kind: "error", message: labels.formError });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <AppInput
          type="text"
          name="Name"
          label={labels.formName}
          labelPlacement="inside"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          isInvalid={Boolean(errors.name)}
          errorMessage={errors.name}
          required
        />
      </div>

      <div className="form-field">
        <AppInput
          type="email"
          name="Email"
          label={labels.formEmail}
          labelPlacement="inside"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          isInvalid={Boolean(errors.email)}
          errorMessage={errors.email}
          required
        />
      </div>

      <div className="form-field">
        <AppTextarea
          name="Message"
          label={labels.formMessage}
          labelPlacement="inside"
          minRows={6}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          isInvalid={Boolean(errors.message)}
          errorMessage={errors.message}
          required
        />
      </div>

      {/* Honeypot — hidden from real users via tabIndex + aria-hidden + off-screen styling.
          Real submissions leave it empty; bots that auto-fill every input populate it,
          and the admin route silently 200s without inserting. */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}
      >
        <label>
          Company website
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            value={values.companyWebsite ?? ""}
            onChange={(event) => updateField("companyWebsite", event.target.value)}
          />
        </label>
      </div>

      <div className="form-field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          id="contact-privacy"
          checked={values.privacyAccepted === true}
          onChange={(event) =>
            updateField("privacyAccepted", event.target.checked as unknown as true)
          }
          required
        />
        <label htmlFor="contact-privacy" style={{ fontSize: 14 }}>
          {labels.privacyLabel}{" "}
          <a href={`${import.meta.env.BASE_URL}privacy`} target="_blank" rel="noreferrer">
            {labels.privacyLink}
          </a>
          .
        </label>
      </div>
      {errors.privacyAccepted && (
        <p className="form-field-error" style={{ color: "var(--app-error, #c33)" }}>
          {errors.privacyAccepted}
        </p>
      )}

      <AppButton type="submit" className="mt-2 w-fit" isDisabled={submit.kind === "submitting"}>
        {submit.kind === "submitting" ? labels.formSubmitting : labels.formSubmit}
      </AppButton>

      {submit.kind === "success" && (
        <span id="msg" role="status" aria-live="polite">
          {labels.formSuccess}
        </span>
      )}
      {submit.kind === "error" && (
        <span role="alert" aria-live="assertive">
          {submit.message}
        </span>
      )}
    </form>
  );
}
