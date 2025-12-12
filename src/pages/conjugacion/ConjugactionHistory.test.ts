import service, { ConjugactionHistoryVerb } from "./ConjugactionHistory";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("VerbsService", () => {
  beforeEach(() => {
    // globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Testing getting URLs", async () => {

    const entry = new ConjugactionHistoryVerb(
      "ir",
      "subjuntivo",
      "presente",
      "1s",
      "voy",
      new Date()
    );

    console.log(entry)
    await service.insert(entry);
    const a = await service.findInTimeRange();
    console.log("log from here", a);
  });

  it("testing fetching", async () => {
    expect([]).toStrictEqual([]);
  });
});
