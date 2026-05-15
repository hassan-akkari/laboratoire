import { describe, expect, it } from "vitest";
import { getNotificationRecipient } from "./email";

describe("getNotificationRecipient", () => {
  it("returns notifyEmail when it is set", () => {
    expect(
      getNotificationRecipient({
        contactEmail: "hello@itshassan.it",
        notifyEmail: "alerts@itshassan.it",
      }),
    ).toBe("alerts@itshassan.it");
  });

  it("falls back to contactEmail when notifyEmail is null", () => {
    expect(
      getNotificationRecipient({
        contactEmail: "hello@itshassan.it",
        notifyEmail: null,
      }),
    ).toBe("hello@itshassan.it");
  });

  it("treats empty-string notifyEmail as 'not set' and falls back", () => {
    expect(
      getNotificationRecipient({
        contactEmail: "hello@itshassan.it",
        notifyEmail: "",
      }),
    ).toBe("hello@itshassan.it");
  });
});
