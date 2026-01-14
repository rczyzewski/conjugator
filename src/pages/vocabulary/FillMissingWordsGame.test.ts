import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  ParagraphBlock,
  TextRegular,
  TextSpecial,
  QuoteBlock,
  ListBlock,
  ListItemBlock,
  TableBlock,
  TextLink,
} from "../../book/bookModel";
import {
  checkGame,
  clearSlot,
  createFillMissingWordsGame,
  extractSpecialWords,
  isComplete,
  placeWord,
} from "./FillMissingWordsGame";

describe("FillMissingWordsGame", () => {
  const baseBlocks = () => [
    new ParagraphBlock([
      new TextRegular("A "),
      new TextSpecial("uno"),
      new TextRegular(" B "),
      new TextSpecial("dos"),
      new TextRegular("."),
    ]),
  ];

  it("extractSpecialWords() extracts words using block.getText()", () => {
    const blocks = baseBlocks();
    expect(extractSpecialWords(blocks)).toEqual(["uno", "dos"]);
  });

  it("extractSpecialWords() finds specials nested in phrasing content (e.g. link children)", () => {
    const link = new TextLink("https://example.com", [
      new TextRegular("x"),
      new TextSpecial("tres"),
      new TextRegular("y"),
    ]);
    const blocks = [new ParagraphBlock([new TextRegular("pre "), link])];
    expect(extractSpecialWords(blocks)).toEqual(["tres"]);
  });

  it("createFillMissingWordsGame() builds slots, bank and empty answers map", () => {
    const game = createFillMissingWordsGame(baseBlocks(), { shuffleBank: false });
    expect(game.slots.map((s) => s.id)).toEqual(["slot-0", "slot-1"]);
    expect(game.slots.map((s) => s.expected)).toEqual(["uno", "dos"]);
    expect(game.bank.map((b) => b.id)).toEqual(["word-0", "word-1"]);
    expect(game.bank.map((b) => b.text)).toEqual(["uno", "dos"]);
    expect(game.answersBySlotId).toEqual({ "slot-0": null, "slot-1": null });
  });

  it("createFillMissingWordsGame() shuffles bank by default (deterministic via mocked Math.random)", () => {
    const spy = vi.spyOn(Math, "random").mockImplementation(() => 0);
    try {
      const blocks = [
        new ParagraphBlock([
          new TextSpecial("a"),
          new TextSpecial("b"),
          new TextSpecial("c"),
        ]),
      ];
      const game = createFillMissingWordsGame(blocks); // shuffle on by default
      // With Math.random() === 0, Fisher–Yates chooses j=0 each time:
      // [a,b,c] -> i=2 swap(2,0) => [c,b,a] -> i=1 swap(1,0) => [b,c,a]
      expect(game.bank.map((x) => x.text)).toEqual(["b", "c", "a"]);
    } finally {
      spy.mockRestore();
    }
  });

  it("placeWord() and clearSlot() update answers; unknown slot id is a no-op", () => {
    const game0 = createFillMissingWordsGame(baseBlocks(), { shuffleBank: false });
    const word = game0.bank[1]; // "dos"

    const game1 = placeWord(game0, "slot-0", word);
    expect(game1.answersBySlotId["slot-0"]?.text).toBe("dos");

    const game2 = clearSlot(game1, "slot-0");
    expect(game2.answersBySlotId["slot-0"]).toBeNull();

    expect(placeWord(game0, "slot-does-not-exist", word)).toBe(game0);
    expect(clearSlot(game0, "slot-does-not-exist")).toBe(game0);
  });

  it("checkGame() reports correct/wrong and handles unanswered slots", () => {
    const game0 = createFillMissingWordsGame(baseBlocks(), { shuffleBank: false });

    // One correct, one unanswered
    const game1 = placeWord(game0, "slot-0", game0.bank[0]); // uno -> correct
    const r1 = checkGame(game1);
    expect(r1.total).toBe(2);
    expect(r1.correct).toBe(1);
    expect(r1.perSlot["slot-0"]).toEqual({
      expected: "uno",
      answer: "uno",
      isCorrect: true,
    });
    expect(r1.perSlot["slot-1"]).toEqual({
      expected: "dos",
      answer: null,
      isCorrect: false,
    });

    // Wrong answer
    const game2 = placeWord(game0, "slot-0", game0.bank[1]); // dos -> wrong
    const r2 = checkGame(game2);
    expect(r2.correct).toBe(0);
    expect(r2.perSlot["slot-0"].isCorrect).toBe(false);
  });

  it("isComplete() returns false until all slots are answered", () => {
    const game0 = createFillMissingWordsGame(baseBlocks(), { shuffleBank: false });
    expect(isComplete(game0)).toBe(false);

    const game1 = placeWord(game0, "slot-0", game0.bank[0]);
    expect(isComplete(game1)).toBe(false);

    const game2 = placeWord(game1, "slot-1", game0.bank[1]);
    expect(isComplete(game2)).toBe(true);
  });

  it("extractSpecialWords() works through recursive content via getText() (quote/list/table)", () => {
    const quote = new QuoteBlock([
      new ParagraphBlock([new TextRegular("q "), new TextSpecial("q1")]),
    ]);

    const list = new ListBlock([
      new ListItemBlock(
        [new ParagraphBlock([new TextRegular("li "), new TextSpecial("l1")])],
        null
      ),
    ]);

    const table = new TableBlock(
      [new ParagraphBlock([new TextSpecial("h1")])],
      [[new ParagraphBlock([new TextRegular("c "), new TextSpecial("c1")])]]
    );

    expect(extractSpecialWords([quote, list, table])).toEqual(["q1", "l1", "h1", "c1"]);
  });
});


