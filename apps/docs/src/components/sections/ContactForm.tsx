import { useMemo, useState } from "react";
import { z } from "zod";
import { AppButton, AppInput, AppTextarea } from "@laboratoire/ui";

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  email: z.string().email("Email is not valid."),
  message: z.string().min(10, "Message should be at least 10 characters."),
});

type ContactValues = z.infer<typeof contactSchema>;

const initialValues: ContactValues = {
  name: "",
  email: "",
  message: "",
};

export default function ContactForm() {
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactValues, string>>>(
    {}
  );
  const [status, setStatus] = useState("");

  const isDirty = useMemo(
    () =>
      values.name.length > 0 || values.email.length > 0 || values.message.length > 0,
    [values]
  );

  const updateField = (key: keyof ContactValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");

    const result = contactSchema.safeParse(values);
    if (!result.success) {
      const nextErrors: Partial<Record<keyof ContactValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactValues | undefined;
        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setStatus("Thanks! I will get back to you.");
    setValues(initialValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <AppInput
          type="text"
          name="Name"
          label="Your name"
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
          label="Your email"
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
          label="Your message"
          labelPlacement="inside"
          minRows={6}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          isInvalid={Boolean(errors.message)}
          errorMessage={errors.message}
          required
        />
      </div>

      <AppButton type="submit" className="mt-2 w-fit">
        Submit
      </AppButton>
      {status && isDirty === false && <span id="msg">{status}</span>}
    </form>
  );
}
