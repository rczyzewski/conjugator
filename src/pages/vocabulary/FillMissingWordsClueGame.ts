import type { ContentBlock, ParagraphText } from "../../book/bookModel";
import { TextCluedSpecial } from "../../book/bookModel";

export interface CluedMissingWordSlot {
  readonly id: string;
  readonly expected: string;
  readonly clue: string;
}

export interface FillMissingWordsClueGame {
  readonly blocks: ContentBlock[];
  readonly slots: CluedMissingWordSlot[];
  readonly answersBySlotId: Readonly<Record<string, string>>;
}

export interface FillMissingWordsCheckResult {
  readonly total: number;
  readonly correct: number;
  readonly perSlot: Readonly<
    Record<
      string,
      {
        readonly expected: string;
        readonly clue: string;
        readonly answer: string | null;
        readonly isCorrect: boolean;
      }
    >
  >;
}

export function createFillMissingWordsClueGame(
  blocks: ContentBlock[],
  _options: { shuffleBank?: boolean } = {}
): FillMissingWordsClueGame {
  const slots = extractCluedSlots(blocks).map((s, idx) => ({
    ...s,
    id: `slot-${idx}`,
  }));

  const answersBySlotId: Record<string, string> = {};
  slots.forEach((s) => (answersBySlotId[s.id] = ""));

  return { blocks, slots, answersBySlotId };
}

export function setAnswer(
  game: FillMissingWordsClueGame,
  slotId: string,
  answer: string
): FillMissingWordsClueGame {
  if (!(slotId in game.answersBySlotId)) return game;
  return {
    ...game,
    answersBySlotId: { ...game.answersBySlotId, [slotId]: answer },
  };
}

export function clearSlot(
  game: FillMissingWordsClueGame,
  slotId: string
): FillMissingWordsClueGame {
  if (!(slotId in game.answersBySlotId)) return game;
  return {
    ...game,
    answersBySlotId: { ...game.answersBySlotId, [slotId]: "" },
  };
}

export function checkGame(game: FillMissingWordsClueGame): FillMissingWordsCheckResult {
  const perSlot: Record<string, { expected: string; clue: string; answer: string | null; isCorrect: boolean }> =
    {};
  let correct = 0;

  for (const s of game.slots) {
    const answerRaw = game.answersBySlotId[s.id] ?? "";
    const answer = answerRaw.trim();
    const expected = s.expected.trim();
    const isCorrect =
      answer.length > 0 &&
      answer.localeCompare(expected, undefined, { sensitivity: "accent" }) === 0;
    if (isCorrect) correct += 1;
    perSlot[s.id] = {
      expected: s.expected,
      clue: s.clue,
      answer: answerRaw.length > 0 ? answerRaw : null,
      isCorrect,
    };
  }

  return { total: game.slots.length, correct, perSlot };
}

export function isComplete(game: FillMissingWordsClueGame): boolean {
  return game.slots.every((s) => (game.answersBySlotId[s.id] ?? "").trim().length > 0);
}

function extractCluedSlots(blocks: ContentBlock[]): Array<{ expected: string; clue: string }> {
  return blocks.flatMap((b) => extractCluedFromText(b.getText()));
}

function extractCluedFromText(text: ParagraphText[]): Array<{ expected: string; clue: string }> {
  const out: Array<{ expected: string; clue: string }> = [];

  const walk = (t: any) => {
    if (t instanceof TextCluedSpecial) {
      out.push({ expected: t.text, clue: t.clue });
      return;
    }
    if (Array.isArray(t?.children)) {
      t.children.forEach(walk);
    }
  };

  text.forEach(walk);
  return out;
}


