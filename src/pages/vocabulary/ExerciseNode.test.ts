import { describe, it, expect } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkDirective from "remark-directive";
import remarkExercise from "./ExerciseNode";
import { astToBook } from "./astToBook";
import type { Root } from "mdast";

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

    const processor = unified()
      .use(remarkParse)
      .use(remarkDirective)
      .use(remarkExercise);

    const tree = processor.parse(md) as Root;
    const transformed = (await processor.run(tree)) as Root;

    const book = astToBook(transformed);

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

    const processor = unified()
      .use(remarkParse)
      .use(remarkDirective)
      .use(remarkExercise);

    const tree = processor.parse(md) as Root;
    const transformed = (await processor.run(tree)) as Root;

    const book = astToBook(transformed);

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

    const processor = unified()
      .use(remarkParse)
      .use(remarkDirective)
      .use(remarkExercise);

    const tree = processor.parse(md) as Root;
    const transformed = (await processor.run(tree)) as Root;

    const book = astToBook(transformed);

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
});
