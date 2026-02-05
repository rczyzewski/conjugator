import {
  ContentBlock,
  ParagraphText,
  TextSpecial,
} from "../../book/bookModel";

export interface MissingWordSlot {
  /** Stable id used for rendering and updates */
  readonly id: string;
  /** The correct answer for this slot (from `{...}`) */
  readonly expected: string;
}

export interface WordBankItem {
  /** Stable id used for rendering and drag/drop */
  readonly id: string;
  /** The visible word text */
  readonly text: string;
}

export interface FillMissingWordsGame {
  /** Original content blocks (unmodified) */
  readonly blocks: ContentBlock[];
  /** Slots in encounter order */
  readonly slots: MissingWordSlot[];
  /** Word bank items (usually same count as slots) */
  readonly bank: WordBankItem[];
  /** User answers keyed by slot id */
  readonly answersBySlotId: Readonly<Record<string, WordBankItem | null>>;
}

export interface FillMissingWordsBuildOptions {
  /** Shuffle bank items (defaults to true) */
  readonly shuffleBank?: boolean;
}

export interface FillMissingWordsCheckResult {
  readonly total: number;
  readonly correct: number;
  readonly perSlot: Readonly<
    Record<
      string,
      {
        readonly expected: string;
        readonly answer: string | null;
        readonly isCorrect: boolean;
      }
    >
  >;
}

function defaultShuffle<T>(items: readonly T[]): T[] {
  // Fisher–Yates
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createFillMissingWordsGame(
  blocks: ContentBlock[],
  options: FillMissingWordsBuildOptions = {}
): FillMissingWordsGame {
  const slots: MissingWordSlot[] = [];
  const bank: WordBankItem[] = [];

  const expectedWords = extractSpecialWords(blocks);
  expectedWords.forEach((word, idx) => {
    const slotId = `slot-${idx}`;
    const wordId = `word-${idx}`;
    slots.push({ id: slotId, expected: word });
    bank.push({ id: wordId, text: word });
  });

  const shuffledBank =
    options.shuffleBank === false ? bank : defaultShuffle(bank);

  const answersBySlotId: Record<string, WordBankItem | null> = {};
  slots.forEach((s) => {
    answersBySlotId[s.id] = null;
  });

  return {
    blocks,
    slots,
    bank: shuffledBank,
    answersBySlotId,
  };
}

export function placeWord(
  game: FillMissingWordsGame,
  slotId: string,
  word: WordBankItem
): FillMissingWordsGame {
  if (!(slotId in game.answersBySlotId)) return game;

  // If the word is already used elsewhere, we allow re-using it (word ids are unique per slot),
  // but we keep the bank as the source of truth for available items.
  return {
    ...game,
    answersBySlotId: {
      ...game.answersBySlotId,
      [slotId]: word,
    },
  };
}

export function clearSlot(
  game: FillMissingWordsGame,
  slotId: string
): FillMissingWordsGame {
  if (!(slotId in game.answersBySlotId)) return game;
  return {
    ...game,
    answersBySlotId: {
      ...game.answersBySlotId,
      [slotId]: null,
    },
  };
}

export function checkGame(game: FillMissingWordsGame): FillMissingWordsCheckResult {
  const perSlot: Record<
    string,
    { expected: string; answer: string | null; isCorrect: boolean }
  > = {};

  let correct = 0;

  for (const slot of game.slots) {
    const answerItem = game.answersBySlotId[slot.id] ?? null;
    const answer = answerItem?.text ?? null;
    const isCorrect = answer != null && answer === slot.expected;
    if (isCorrect) correct += 1;
    perSlot[slot.id] = { expected: slot.expected, answer, isCorrect };
  }

  return {
    total: game.slots.length,
    correct,
    perSlot,
  };
}

export function isComplete(game: FillMissingWordsGame): boolean {
  return game.slots.every((s) => game.answersBySlotId[s.id] != null);
}

export function extractSpecialWords(blocks: ContentBlock[]): string[] {
  // `ContentBlock` is recursive, and every block already provides `getText()` which
  // flattens nested content. So we can extract specials from the flattened text.
  return blocks.flatMap((b) => extractSpecialWordsFromParagraphText(b.getText()));
}

function extractSpecialWordsFromParagraphText(text: ParagraphText[]): string[] {
  return text.flatMap(extractSpecialWordsFromText);
}

function extractSpecialWordsFromText(t: ParagraphText): string[] {
  if (t instanceof TextSpecial) return [t.text];

  // `ParagraphText` is an empty interface in this codebase, so other text nodes
  // (like TextLink) are structurally compatible. We support nested phrasing content
  // via duck-typing on `children`.
  const anyT = t as any;
  if (Array.isArray(anyT?.children)) {
    return (anyT.children as ParagraphText[]).flatMap(extractSpecialWordsFromText);
  }

  return [];
}


