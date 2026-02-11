import { describe, expect, it } from "vitest";
import { heroFormSchema, roles } from "./heroForm.schema";

describe("heroFormSchema", () => {
  it("accepts a valid payload", () => {
    const result = heroFormSchema.safeParse({
      name: "Hassan",
      email: "hassan@example.com",
      role: roles[0].key,
      message: "Ciao, vorrei parlare di una collaborazione front-end.",
      newsletter: true,
      priority: false,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid payload", () => {
    const result = heroFormSchema.safeParse({
      name: "H",
      email: "invalid",
      role: "",
      message: "short",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    const fields = result.error.flatten().fieldErrors;
    expect(fields.name?.[0]).toBe("Nome troppo corto.");
    expect(fields.email?.[0]).toBe("Email non valida.");
    expect(fields.role?.[0]).toBe("Seleziona un ruolo.");
    expect(fields.message?.[0]).toBe("Minimo 10 caratteri.");
  });
});
