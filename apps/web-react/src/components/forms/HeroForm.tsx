import { useState } from "react";
import type { Key } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@heroui/react";
import {
  heroFormSchema,
  initialHeroFormValues,
  roles,
  type HeroFormValues,
} from "./heroForm.schema";

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
    <Card className="border border-[--app-border] bg-[--app-card]">
      <CardHeader>
        <div>
          <h2 className="text-lg font-semibold">HeroUI form</h2>
          <p className="text-sm text-[--app-muted]">
            Input, select, textarea e toggle con stile uniforme.
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Nome"
              placeholder="Hassan"
              variant="bordered"
              value={values.name}
              onValueChange={(value) => updateField("name", value)}
              isInvalid={Boolean(errors.name)}
              errorMessage={errors.name}
            />
            <Input
              label="Email"
              placeholder="nome@email.com"
              type="email"
              variant="bordered"
              value={values.email}
              onValueChange={(value) => updateField("email", value)}
              isInvalid={Boolean(errors.email)}
              errorMessage={errors.email}
            />
          </div>

          <Select
            label="Ruolo"
            placeholder="Seleziona un ruolo"
            variant="bordered"
            selectedKeys={[values.role]}
            onSelectionChange={handleRoleChange}
            isInvalid={Boolean(errors.role)}
            errorMessage={errors.role}
          >
            {roles.map((role) => (
              <SelectItem key={role.key}>{role.label}</SelectItem>
            ))}
          </Select>

          <Textarea
            label="Messaggio"
            placeholder="Scrivi qui..."
            variant="bordered"
            minRows={3}
            value={values.message}
            onValueChange={(value) => updateField("message", value)}
            isInvalid={Boolean(errors.message)}
            errorMessage={errors.message}
          />

          <div className="flex flex-wrap items-center gap-4">
            <Checkbox
              isSelected={Boolean(values.newsletter)}
              onValueChange={(value) => updateField("newsletter", value)}
            >
              Newsletter
            </Checkbox>
            <Switch
              isSelected={Boolean(values.priority)}
              onValueChange={(value) => updateField("priority", value)}
              size="sm"
            >
              Priorita alta
            </Switch>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button color="primary" type="submit">
              Invia
            </Button>
            <Button
              variant="bordered"
              type="button"
              onPress={() => {
                setValues(initialHeroFormValues);
                setErrors({});
                setStatus("");
              }}
            >
              Annulla
            </Button>
            <Button variant="flat" color="secondary" type="button">
              Salva bozza
            </Button>
          </div>

          {status ? (
            <p className="text-xs text-[--app-muted]">{status}</p>
          ) : null}
        </form>
      </CardBody>
    </Card>
  );
}
