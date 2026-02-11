import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  email: z.string().email("Email is not valid."),
  message: z.string().min(10, "Message should be at least 10 characters."),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const initialContactValues: ContactValues = {
  name: "",
  email: "",
  message: "",
};
