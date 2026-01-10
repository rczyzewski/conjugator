import service, { ConjugationHistoryVerb } from "./ConjugationHistory";
import { describe, it, expect } from "vitest";

describe("VerbsService", () => {

  it("Testing getting URLs", async () => {

    const entry = new ConjugationHistoryVerb(
      "ir",
      "subjuntivo",
      "presente",
      "1s",
      "voy",
      new Date()
    );

    await service.insert(entry);
    const a = await service.findInTimeRange();
    console.log("log from here", a);
    //TODO: some assertions?
  });

  it("testing fetching", async () => {
    expect([]).toStrictEqual([]);
  });
});
