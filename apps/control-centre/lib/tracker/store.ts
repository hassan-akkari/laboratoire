import "server-only";

import { randomUUID } from "node:crypto";
import { readStore, writeStore } from "../store/jsonStore";
import {
  applicationsStoreSchema,
  type Application,
  type ApplicationStatus,
} from "./schema";

const STORE = "applications";

export async function listApplications(): Promise<Application[]> {
  const { applications } = await readStore(STORE, applicationsStoreSchema);
  return applications;
}

export async function addApplication(
  input: Omit<Application, "id">,
): Promise<Application> {
  const applications = await listApplications();
  const application: Application = { ...input, id: randomUUID() };
  await writeStore(STORE, applicationsStoreSchema, {
    applications: [...applications, application],
  });
  return application;
}

export async function updateApplication(
  id: string,
  patch: Partial<Omit<Application, "id">>,
): Promise<void> {
  const applications = await listApplications();
  if (!applications.some((app) => app.id === id)) {
    throw new Error(`[control-centre] unknown application id: ${id}`);
  }
  await writeStore(STORE, applicationsStoreSchema, {
    applications: applications.map((app) =>
      app.id === id ? { ...app, ...patch } : app,
    ),
  });
}

export async function setStatus(
  id: string,
  status: ApplicationStatus,
  todayIso: string,
): Promise<void> {
  // A status change IS a contact event — that's what keeps "last contact"
  // honest without a separate logging chore.
  await updateApplication(id, { status, lastContactAt: todayIso });
}
