import type { ConjugatedVerb, VerbEntry } from "../conjugation/VerbsService";
import { flatMapVerbEntry, pickRandom } from "../conjugation/VerbsService";

export interface VerbPrompt {
  /** Stable id */
  readonly id: string;
  /** Verb infinitive (e.g. "ser") */
  readonly infinitivo: string;
  /** Mode (e.g. "indicativo") */
  readonly mode: string;
  /** Tense name (e.g. "preterito") */
  readonly tense: string;
  /** Person (e.g. "1s") */
  readonly person: string;
  /** Correct answer */
  readonly expected: string;
}

export interface VerbConjugateExerciseGame {
  readonly prompts: VerbPrompt[];
  readonly answersByPromptId: Readonly<Record<string, string>>;
}

export interface VerbConjugateBuildOptions {
  /** If empty/undefined: allow all tenses found in data. */
  readonly tenses?: string[];
}

export interface VerbConjugateCheckResult {
  readonly total: number;
  readonly correct: number;
  readonly perPrompt: Readonly<
    Record<
      string,
      {
        readonly expected: string;
        readonly answer: string;
        readonly isCorrect: boolean;
        readonly infinitivo: string;
        readonly mode: string;
        readonly tense: string;
        readonly person: string;
      }
    >
  >;
}

export function createVerbConjugateExerciseGame(
  verbEntries: VerbEntry[],
  words: string[],
  options: VerbConjugateBuildOptions = {}
): VerbConjugateExerciseGame {
  const allowed = parseAllowedTenses(options.tenses ?? []);

  const entryByVerb = new Map(verbEntries.map((e) => [e.verbo, e]));

  const prompts: VerbPrompt[] = words
    .map((infinitivo) => {
      const entry = entryByVerb.get(infinitivo);
      if (!entry) return null;

      const all = flatMapVerbEntry(entry);
      const filtered =
        allowed.length === 0
          ? all
          : all.filter((cv) =>
              allowed.some((t) => t.mode === cv.mode && t.tense === cv.tense)
            );

      if (filtered.length === 0) return null;
      const picked = pickRandom(filtered);
      return toPrompt(picked);
    })
    .filter(Boolean)
    .map((p) => p as VerbPrompt);

  const answersByPromptId: Record<string, string> = {};
  prompts.forEach((p) => {
    answersByPromptId[p.id] = "";
  });

  return { prompts, answersByPromptId };
}

export function setAnswer(
  game: VerbConjugateExerciseGame,
  promptId: string,
  answer: string
): VerbConjugateExerciseGame {
  if (!(promptId in game.answersByPromptId)) return game;
  return {
    ...game,
    answersByPromptId: {
      ...game.answersByPromptId,
      [promptId]: answer,
    },
  };
}

export function checkGame(
  game: VerbConjugateExerciseGame
): VerbConjugateCheckResult {
  const perPrompt: Record<
    string,
    {
      expected: string;
      answer: string;
      isCorrect: boolean;
      infinitivo: string;
      mode: string;
      tense: string;
      person: string;
    }
  > = {};

  let correct = 0;

  for (const p of game.prompts) {
    const answerRaw = game.answersByPromptId[p.id] ?? "";
    const answer = answerRaw.trim();
    const expected = p.expected.trim();
    const isCorrect =
      answer.length > 0 &&
      answer.localeCompare(expected, undefined, { sensitivity: "accent" }) === 0;

    if (isCorrect) correct += 1;

    perPrompt[p.id] = {
      expected: p.expected,
      answer: answerRaw,
      isCorrect,
      infinitivo: p.infinitivo,
      mode: p.mode,
      tense: p.tense,
      person: p.person,
    };
  }

  return { total: game.prompts.length, correct, perPrompt };
}

export function isComplete(game: VerbConjugateExerciseGame): boolean {
  return game.prompts.every((p) => (game.answersByPromptId[p.id] ?? "").trim().length > 0);
}

export type ParsedTense = { readonly mode: string; readonly tense: string };

export function parseAllowedTenses(specs: string[]): ParsedTense[] {
  return specs
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(parseTenseSpec)
    .filter((t): t is ParsedTense => t != null);
}

function parseTenseSpec(spec: string): ParsedTense | null {
  // Supported:
  // - "indicativo.presente" (from book YAML)
  // - "indicativo_presente" (from UI settings id)
  // - "preterito" (defaults to indicativo)
  if (spec.includes(".")) {
    const [mode, tense] = spec.split(".", 2);
    if (!mode || !tense) return null;
    return { mode, tense };
  }
  if (spec.includes("_")) {
    const [mode, tense] = spec.split("_", 2);
    if (!mode || !tense) return null;
    return { mode, tense };
  }
  return { mode: "indicativo", tense: spec };
}

function toPrompt(cv: ConjugatedVerb): VerbPrompt {
  const id = `${cv.infinitivo}-${cv.mode}-${cv.tense}-${cv.person}`;
  return {
    id,
    infinitivo: cv.infinitivo,
    mode: cv.mode,
    tense: cv.tense,
    person: cv.person,
    expected: cv.answer,
  };
}


