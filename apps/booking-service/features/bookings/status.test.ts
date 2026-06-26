import { describe, expect, it } from "vitest";
import {
  BOOKING_STATUSES,
  parseBookingStatus,
} from "./status";

// Guards the server-side enum check used by updateBookingStatus: an arbitrary
// or hand-crafted status string MUST be rejected before any DB write.
describe("parseBookingStatus", () => {
  it("accepts each of the four allowed statuses", () => {
    for (const status of BOOKING_STATUSES) {
      expect(parseBookingStatus(status)).toBe(status);
    }
  });

  it("rejects an arbitrary / unknown string", () => {
    expect(parseBookingStatus("deleted")).toBeNull();
    expect(parseBookingStatus("PENDING")).toBeNull(); // case-sensitive
    expect(parseBookingStatus("")).toBeNull();
    expect(parseBookingStatus("pending; DROP TABLE")).toBeNull();
  });

  it("rejects non-string input", () => {
    expect(parseBookingStatus(undefined)).toBeNull();
    expect(parseBookingStatus(null)).toBeNull();
    expect(parseBookingStatus(42)).toBeNull();
    expect(parseBookingStatus({})).toBeNull();
  });
});
