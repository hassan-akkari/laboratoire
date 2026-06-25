import { useState } from "react";
import {
  AppButton,
  AppCard,
  AppCardBody,
  AppCardHeader,
  AppCheckbox,
  AppInput,
  AppSelect,
  AppSelectItem,
  AppSwitch,
  AppTextarea,
} from "@laboratoire/ui";
import {
  heroFormSchema,
  initialHeroFormValues,
  roles,
  type HeroFormValues,
} from "./heroForm.schema";

// Mirrors HeroUI's react-aria `Selection` (`"all" | Set<Key>`, where the
// react-aria `Key` is `string | number`). Kept LOCAL so this component file
// imports nothing from raw HeroUI; the AppSelect wrapper accepts this exact
// surface (`selectedKeys?: Selection` / `onSelectionChange?: (keys) => void`).
type Key = string | number;
type Selection = "all" | Set<Key>;

export default function HeroForm() {
  const [values, setValues] = useState<HeroFormValues>(initialHeroFormValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof HeroFormValues, string>>
  >({});
  const [status, setStatus] = useState("");

  const updateField = (
    key: keyof HeroFormValues,
    value: HeroFormValues[keyof HeroFormValues]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");

    const result = heroFormSchema.safeParse(values);
    if (!result.success) {
      const nextErrors: Partial<Record<keyof HeroFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof HeroFormValues | undefined;
        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setStatus("Form validata con Zod.");
  };

  const handleRoleChange = (keys: Selection) => {
    if (keys === "all") return;
    const first = Array.from(keys)[0];
    updateField("role", first ? String(first) : "");
  };

  return (
    <AppCard className="border border-[--app-border] bg-[--app-card]">
      <AppCardHeader>
        <div>
          <h2 className="text-lg font-semibold">HeroUI form</h2>
          <p className="text-sm text-[--app-muted]">
            Input, select, textarea e toggle con stile uniforme.
          </p>
        </div>
      </AppCardHeader>
      <AppCardBody>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <AppInput
              label="Nome"
              placeholder="Hassan"
              variant="bordered"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              isInvalid={Boolean(errors.name)}
              errorMessage={errors.name}
            />
            <AppInput
              label="Email"
              placeholder="nome@email.com"
              type="email"
              variant="bordered"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              isInvalid={Boolean(errors.email)}
              errorMessage={errors.email}
            />
          </div>

          <AppSelect
            label="Ruolo"
            placeholder="Seleziona un ruolo"
            variant="bordered"
            selectedKeys={
              values.role ? new Set<Key>([values.role]) : new Set<Key>()
            }
            onSelectionChange={handleRoleChange}
            isInvalid={Boolean(errors.role)}
            errorMessage={errors.role}
          >
            {roles.map((role) => (
              <AppSelectItem key={role.key}>{role.label}</AppSelectItem>
            ))}
          </AppSelect>

          <AppTextarea
            label="Messaggio"
            placeholder="Scrivi qui..."
            variant="bordered"
            minRows={3}
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            isInvalid={Boolean(errors.message)}
            errorMessage={errors.message}
          />

          <div className="flex flex-wrap items-center gap-4">
            <AppCheckbox
              isSelected={Boolean(values.newsletter)}
              onValueChange={(value) => updateField("newsletter", value)}
            >
              Newsletter
            </AppCheckbox>
            <AppSwitch
              isSelected={Boolean(values.priority)}
              onValueChange={(value) => updateField("priority", value)}
              size="sm"
            >
              Priorità alta
            </AppSwitch>
          </div>

          <div className="flex flex-wrap gap-3">
            <AppButton color="primary" type="submit">
              Invia
            </AppButton>
            <AppButton
              variant="bordered"
              type="button"
              onPress={() => {
                setValues(initialHeroFormValues);
                setErrors({});
                setStatus("");
              }}
            >
              Annulla
            </AppButton>
            <AppButton variant="flat" color="secondary" type="button">
              Salva bozza
            </AppButton>
          </div>

          {status ? (
            <p className="text-xs text-[--app-muted]">{status}</p>
          ) : null}
        </form>
      </AppCardBody>
    </AppCard>
  );
}
