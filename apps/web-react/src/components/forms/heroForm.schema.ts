import { z } from "zod";

export const roles = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "fullstack", label: "Full-stack" },
  { key: "design", label: "Design" },
] as const;

export const heroFormSchema = z.object({
  name: z.string().min(2, "Nome troppo corto."),
  email: z.string().email("Email non valida."),
  role: z.string().min(1, "Seleziona un ruolo."),
  message: z.string().min(10, "Minimo 10 caratteri."),
  newsletter: z.boolean().optional(),
  priority: z.boolean().optional(),
});

export type HeroFormValues = z.infer<typeof heroFormSchema>;

export const initialHeroFormValues: HeroFormValues = {
  name: "",
  email: "",
  role: roles[0].key,
  message: "",
  newsletter: true,
  priority: true,
};
