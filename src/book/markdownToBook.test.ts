import { describe, it, expect } from "vitest";
import markdownToBook from "./markdownToBook";
import { TableBlock } from "./bookModel";

describe("ParserTest", () => {
  it("parses conjugaction directive with properties into book model", async () => {
    const md = `## Title


::::conjugaction[Instructions for the exercise]{tense=indicativo.presente}
* ser
* estar
* tener
* comer
* vivir
* leer
* hablar
* escribir
::::

text
`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");

    const blocks = book.chapters[0].blocks;
    expect(blocks.length).toBe(2);

    const conjugationBlock = blocks[0];
    if (conjugationBlock.type !== "conjugaction") {
      throw new Error("First block is not a conjugaction block");
    }

    //expect(conjugationBlock.instructions).toBe("Instructions for the exercise");
    expect(conjugationBlock.attributes.tense).toBe("indicativo.presente");
    expect(conjugationBlock.content).toEqual([
      "ser",
      "estar",
      "tener",
      "comer",
      "vivir",
      "leer",
      "hablar",
      "escribir",
    ]);

    const paragraphBlock = blocks[1];
    expect(paragraphBlock.type).toBe("paragraph");
    if (paragraphBlock.type === "paragraph") {
      expect(paragraphBlock.text).toBe("text");
    }
  });

  it("parses exercise directive with label and attributes into book model", async () => {
    const md = `## Title

::::exercise[Instructions for the exercise]{property1=333, property2=value2}
Hola mundo
::::

text
`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");

    const blocks = book.chapters[0].blocks;
    expect(blocks.length).toBe(2);

    const exerciseBlock = blocks[0];
    if (exerciseBlock.type !== "exercise") {
      throw new Error("First block is not an exercise block");
    }

    expect(exerciseBlock.instructions).toBe("Instructions for the exercise");
    expect(exerciseBlock.attributes.property1).toBe("333");
    expect(exerciseBlock.attributes.property2).toBe("value2");
    expect(exerciseBlock.content).toEqual(["Hola mundo"]);

    const paragraphBlock = blocks[1];
    expect(paragraphBlock.type).toBe("paragraph");
    if (paragraphBlock.type === "paragraph") {
      expect(paragraphBlock.text).toBe("text");
    }
  });

  it("parses verify exercise directive with label and attributes into book model", async () => {
    const md = `## Title

::::verify[find true or false statments]{property1=333, property2=value2}
  [x] Perros son mejor que los gtos.
  [x] La piedra gana tijeras.
  [x] Tijeras ganan papel.
  [ ] Piedra gana papel
::::

`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");

    const blocks = book.chapters[0].blocks;
    expect(blocks.length).toBe(1);

    const verifyBlock = blocks[0];
    if (verifyBlock.type !== "verify") {
      throw new Error("First block is not a verify block");
    }

    expect(verifyBlock.instructions).toBe("find true or false statments");
    expect(verifyBlock.attributes.property1).toBe("333");
    expect(verifyBlock.attributes.property2).toBe("value2");
    expect(verifyBlock.content.length).toBeGreaterThan(0);
  });

  it("parses unordered list into book model", async () => {
    const md = `## Title

* First item
* Second item
* Third item

text
`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");

    const blocks = book.chapters[0].blocks;
    expect(blocks.length).toBe(2);

    const listBlock = blocks[0];
    if (listBlock.type !== "list") {
      throw new Error("First block is not a list block");
    }

    expect(listBlock.ordered).toBe(false);
    expect(listBlock.items).toEqual([
      "First item",
      "Second item",
      "Third item",
    ]);

    const paragraphBlock = blocks[1];
    expect(paragraphBlock.type).toBe("paragraph");
    if (paragraphBlock.type === "paragraph") {
      expect(paragraphBlock.text).toBe("text");
    }
  });

  it("parses ordered list into book model", async () => {
    const md = `## Title

1. First item
2. Second item
3. Third item

text
`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");

    const blocks = book.chapters[0].blocks;
    expect(blocks.length).toBe(2);

    const listBlock = blocks[0];
    if (listBlock.type !== "list") {
      throw new Error("First block is not a list block");
    }

    expect(listBlock.ordered).toBe(true);
    expect(listBlock.items).toEqual([
      "First item",
      "Second item",
      "Third item",
    ]);

    const paragraphBlock = blocks[1];
    expect(paragraphBlock.type).toBe("paragraph");
    if (paragraphBlock.type === "paragraph") {
      expect(paragraphBlock.text).toBe("text");
    }
  });

  it("parses table into book model", async () => {
    const md = `## Title

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");

    const blocks = book.chapters[0].blocks;
    expect(blocks.length).toBe(1);

    const tableBlock = blocks[0] as TableBlock;
    expect(tableBlock.type).toEqual("table");
    expect(tableBlock.headers).toEqual(["Header 1", "Header 2", "Header 3"]);
    expect(tableBlock.rows).toEqual([
      ["Cell 1", "Cell 2", "Cell 3"],
      ["Cell 4", "Cell 5", "Cell 6"], ]);

  });

});
