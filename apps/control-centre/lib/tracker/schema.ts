import { z } from "zod";

/** Pipeline order matters: it drives the board sort and the status <select>. */
export const APPLICATION_STATUSES = [
  "scouted",
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "ghosted",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** Statuses where follow-ups no longer make sense. */
const CLOSED_STATUSES: readonly ApplicationStatus[] = ["offer", "rejected", "ghosted"];

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");

export const applicationSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),
  source: z.string().min(1),
  stack: z.array(z.string().min(1)),
  status: z.enum(APPLICATION_STATUSES),
  appliedAt: isoDate.nullable(),
  lastContactAt: isoDate.nullable(),
  nextFollowUpAt: isoDate.nullable(),
  notes: z.string(),
});

export const applicationsStoreSchema = z.object({
  applications: z.array(applicationSchema),
});

export type Application = z.infer<typeof applicationSchema>;

export function isOpen(application: Application): boolean {
  return !CLOSED_STATUSES.includes(application.status);
}

/** "The forgotten follow-up is the dumbest way to lose an opportunity." */
export function isFollowUpOverdue(
  application: Application,
  todayIso: string,
): boolean {
  return (
    isOpen(application) &&
    application.nextFollowUpAt !== null &&
    application.nextFollowUpAt < todayIso
  );
}

/**
 * Board order: overdue follow-ups first, then open ones by soonest follow-up
 * (no follow-up scheduled sinks below scheduled), closed applications last.
 */
export function sortForBoard(
  applications: Application[],
  todayIso: string,
): Application[] {
  const rank = (app: Application): number => {
    if (isFollowUpOverdue(app, todayIso)) return 0;
    if (isOpen(app)) return app.nextFollowUpAt ? 1 : 2;
    return 3;
  };
  return [...applications].sort((a, b) => {
    const byRank = rank(a) - rank(b);
    if (byRank !== 0) return byRank;
    const aKey = a.nextFollowUpAt ?? a.lastContactAt ?? "9999-99-99";
    const bKey = b.nextFollowUpAt ?? b.lastContactAt ?? "9999-99-99";
    return aKey.localeCompare(bKey) || a.company.localeCompare(b.company);
  });
}
