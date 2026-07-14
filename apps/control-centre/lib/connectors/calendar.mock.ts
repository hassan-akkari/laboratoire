import type { CalendarConnector, CalendarEvent } from "./types";

/** Mock calendar — enough shape for the briefing to compose a real morning. */

const TODAY_EVENTS: CalendarEvent[] = [
  {
    id: "cal-001",
    title: "Daily standup — Portal",
    startsAt: "09:30",
    endsAt: "09:45",
    location: "Meet",
  },
  {
    id: "cal-002",
    title: "Technical screen — Alpstein Software AG (round 2)",
    startsAt: "14:00",
    endsAt: "15:00",
    location: "Zoom",
  },
  {
    id: "cal-003",
    title: "Gym",
    startsAt: "18:30",
    endsAt: "19:30",
  },
];

export const calendarMockConnector: CalendarConnector = {
  name: "Calendar",
  mode: "mock",
  async fetchToday(): Promise<CalendarEvent[]> {
    return TODAY_EVENTS;
  },
};
