import { describe, it, expect, vi } from "vitest";
import type { VerbEntry } from "../conjugation/VerbsService";
import {
  checkGame,
  createVerbConjugateExerciseGame,
  isComplete,
  parseAllowedTenses,
  setAnswer,
} from "./VerbConjugateExerciseGame";

function makeEntry(verbo: string, mode: string, tense: string, person: string, answer: string): VerbEntry {
  const empty = {} as any;
  const entry: VerbEntry = {
    verbo,
    indicativo: {},
    subjuntivo: {},
    imperativo: {},
  };
  (entry as any)[mode] = {
    [tense]: {
      [person]: answer,
    },
  };
  // Ensure other modes exist for flatMapVerbEntry
  entry.indicativo = (entry as any).indicativo ?? empty;
  entry.subjuntivo = (entry as any).subjuntivo ?? empty;
  entry.imperativo = (entry as any).imperativo ?? empty;
  return entry;
}

describe("VerbConjugateExerciseGame", () => {
  it("parseAllowedTenses supports dot, underscore and defaults to indicativo", () => {
    expect(parseAllowedTenses(["indicativo.presente"])).toEqual([
      { mode: "indicativo", tense: "presente" },
    ]);
    expect(parseAllowedTenses(["subjuntivo_imperfecto"])).toEqual([
      { mode: "subjuntivo", tense: "imperfecto" },
    ]);
    expect(parseAllowedTenses(["preterito"])).toEqual([
      { mode: "indicativo", tense: "preterito" },
    ]);
  });

  it("createVerbConjugateExerciseGame selects one prompt per requested word (filtered by tenses)", () => {
    const entries: VerbEntry[] = [
      makeEntry("ser", "indicativo", "presente", "1s", "soy"),
      makeEntry("tener", "indicativo", "preterito", "1s", "tuve"),
    ];

    const game = createVerbConjugateExerciseGame(entries, ["ser", "tener"], {
      tenses: ["indicativo.presente"],
    });

    expect(game.prompts).toHaveLength(1);
    expect(game.prompts[0].infinitivo).toBe("ser");
    expect(game.prompts[0].expected).toBe("soy");
    expect(Object.keys(game.answersByPromptId)).toEqual([game.prompts[0].id]);
    expect(game.answersByPromptId[game.prompts[0].id]).toBe("");
  });

  it("createVerbConjugateExerciseGame shuffles deterministically via mocked Math.random (pickRandom)", () => {
    const spy = vi.spyOn(Math, "random").mockImplementation(() => 0);
    try {
      // Two possible prompts for same verb; pickRandom should select index 0.
      const entry: VerbEntry = {
        verbo: "ser",
        indicativo: {
          presente: { "1s": "soy", "2s": "eres" },
        },
        subjuntivo: {},
        imperativo: {},
      };
      const game = createVerbConjugateExerciseGame([entry], ["ser"], {
        tenses: ["indicativo.presente"],
      });
      expect(game.prompts).toHaveLength(1);
      expect(["soy", "eres"]).toContain(game.prompts[0].expected);
      // With Math.random()=0, pickRandom should pick the first element created by flatMapVerbEntry
      expect(game.prompts[0].expected).toBe("soy");
    } finally {
      spy.mockRestore();
    }
  });

  it("setAnswer updates existing prompt; unknown prompt id is a no-op", () => {
    const entries: VerbEntry[] = [makeEntry("ser", "indicativo", "presente", "1s", "soy")];
    const game0 = createVerbConjugateExerciseGame(entries, ["ser"], {
      tenses: ["indicativo.presente"],
    });
    const id = game0.prompts[0].id;

    const game1 = setAnswer(game0, id, "soy");
    expect(game1.answersByPromptId[id]).toBe("soy");

    expect(setAnswer(game0, "missing", "x")).toBe(game0);
  });

  it("checkGame scores correct/wrong and ignores empty answers; isComplete checks non-empty", () => {
    const entries: VerbEntry[] = [makeEntry("ser", "indicativo", "presente", "1s", "soy")];
    const game0 = createVerbConjugateExerciseGame(entries, ["ser"], {
      tenses: ["indicativo.presente"],
    });
    const id = game0.prompts[0].id;

    expect(isComplete(game0)).toBe(false);
    const r0 = checkGame(game0);
    expect(r0.correct).toBe(0);
    expect(r0.perPrompt[id].isCorrect).toBe(false);

    const game1 = setAnswer(game0, id, " soy ");
    expect(isComplete(game1)).toBe(true);
    const r1 = checkGame(game1);
    expect(r1.correct).toBe(1);
    expect(r1.perPrompt[id].isCorrect).toBe(true);

    const game2 = setAnswer(game0, id, "nope");
    const r2 = checkGame(game2);
    expect(r2.correct).toBe(0);
    expect(r2.perPrompt[id].isCorrect).toBe(false);
  });
});


