import { describe, it, expect } from "vitest";
import markdownToBook from "./markdownToBook";
import { CodeBlock, ContentBlock, IConjugationBlock, IExerciseBlock, IVerifyBlock, ListBlock, ListItemBlock, ParagraphBlock, QuoteBlock, TableBlock, TextEmphasis, TextImage, TextInlineCode, TextLink, TextRegular, TextSpecial, TextStrong } from "./bookModel";
describe("ParserTest", () => {

  it("parses image block {}", async () => {
    const md = `## Title
# chapter 1
some ![pumpkin](https://127.0.0.1/b.jpg) here
`;

    const book = await markdownToBook(md);
    const paragraph = book.chapters[0].blocks[0] as ContentBlock;

    expect(paragraph.getText()).toStrictEqual([
      new TextRegular("some "),
      new TextImage("https://127.0.0.1/b.jpg","pumpkin"),
      new TextRegular(" here"),
    ]);
  });

  it("parses link block {}", async () => {
    const md = `## Title
# chapter 1
some [link](http://127.0.0.1/b.jpg) here
`;

    const book = await markdownToBook(md);
    const paragraph = book.chapters[0].blocks[0] as ContentBlock;

    expect(paragraph.getText()).toStrictEqual([
      new TextRegular("some "),
      new TextLink("http://127.0.0.1/b.jpg", [new TextRegular("link")]),
      new TextRegular(" here"),
    ]);
  });

  it("parses simple special block {}", async () => {
    const md = `## Title
# chapter 1
some {text} here
`;

    const book = await markdownToBook(md);

    const paragraph = book.chapters[0].blocks[0] as ContentBlock;

    expect(paragraph.getText()).toStrictEqual([
      new TextRegular("some "),
      new TextSpecial("text"),
      new TextRegular(" here"),
    ]);
  });


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

    const conjugationBlock = blocks[0] as IConjugationBlock;

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
    expect(paragraphBlock).toStrictEqual(new ParagraphBlock([new TextRegular("text")]));
  });

  it("parses exercise directive with label and attributes into book model", async () => {
    const md = `## Title

::::exercise[Instructions for the exercise]{property1=333 property2=value2}

Hola mundo my name is **RAFA**

::::

text
`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");

    const blocks = book.chapters[0].blocks;
    expect(blocks.length).toBe(2);

    const exerciseBlock = blocks[0] as IExerciseBlock

    expect(exerciseBlock.instructions).toBe("Instructions for the exercise");
    expect(exerciseBlock.attributes.property1).toBe("333");
    expect(exerciseBlock.attributes.property2).toBe("value2");
    expect(exerciseBlock.content).toEqual([new ParagraphBlock([ new TextRegular("Hola mundo my name is ") , new TextStrong("RAFA")])]);
  });

  it("parses code block", async () => {
    const md = `## Title
\`\`\`
here is some code
\`\`\`

`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");

    const blocks = book.chapters[0].blocks;
    expect(blocks.length).toBe(1);
    const codeBlock = blocks[0] as CodeBlock

    expect(codeBlock).toStrictEqual(new CodeBlock("here is some code")) ;
    expect( codeBlock.getText()).toStrictEqual([new TextInlineCode("here is some code")])

  });

  it("parses verify task list", async () => {
    const md = `## Title

-  [x] Perros son mejor que los gtos.
   Here is a continuation
   
   Here is another

-  [x] La piedra gana tijeras.
-  [x] Tijeras ganan papel.
-  [ ] Piedra gana papel

`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");

    const blocks = book.chapters[0].blocks;
    expect(blocks.length).toBe(1);

    const verifyBlock = blocks[0];
    
    console.log(verifyBlock)
    
  });
  it("parses verify exercise directive with label and attributes into book model", async () => {
    const md = `## Title

::::verify[find true or false statments]{property1=333 property2=value2}
-  [x] Perros son mejor que los gtos.
-  [x] La piedra gana tijeras.
-  [x] Tijeras ganan papel.
-  [ ] Piedra gana papel
::::

`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");

    const blocks = book.chapters[0].blocks;
    expect(blocks.length).toBe(1);

    const verifyBlock = blocks[0] as IVerifyBlock

    expect(verifyBlock.instructions).toBe("find true or false statments");
    expect(verifyBlock.items.length).toBeGreaterThan(0);


    //TODO: add more checks
    
  });

  it("parses unordered list into book model", async () => {
    const md = `## Title

* First item
  Some Item

  Another Item
* Second item
`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");

    const blocks = book.chapters[0].blocks;
    expect(blocks.length).toBe(1);

    const listBlock = blocks[0] as ListBlock;

    expect(listBlock.ordered).toBe(false);
    expect(listBlock.items).toEqual([
      new ListItemBlock(
        [
          new ParagraphBlock([new TextRegular("First item\nSome Item")]),
          new ParagraphBlock([new TextRegular("Another Item")]),
        ],
        null
      ),
      new ListItemBlock([new ParagraphBlock([new TextRegular("Second item")])], null),
    ]);
  });

  it("parses ordered list into book model", async () => {
    const md = `## Title

1. First item

2. Second item
`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");

    const blocks = book.chapters[0].blocks;
    expect(blocks.length).toBe(1);

    const listBlock = blocks[0] as ListBlock;

    expect(listBlock.ordered).toBe(true);

    expect(listBlock.items)
    .toEqual([
      new ListItemBlock(
        [new ParagraphBlock([new TextRegular("First item")])], 
        null
      ),

      new ListItemBlock([new ParagraphBlock([new TextRegular("Second item")])], null),
    ]);

  });


  it("parses quote into book model", async () => {
    const md = `## Title

>
> Here is quote
> * e1 
>   * e1.1
> * e2
> \`\`\` 
> Code
>\`\`\`
> | header |
> |--------|
> | cell1  |
> Here is quote 
>
> > double *quote*
`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");
    const quoteBlock = book.chapters[0].blocks[0] as QuoteBlock
    expect(quoteBlock.getText()).toStrictEqual([
      new TextRegular("Here is quote"),
      new TextRegular("e1"),
      new TextRegular("e1.1"),
      new TextRegular("e2"),
      new TextInlineCode("Code"),
      new TextRegular("header"),
      new TextRegular("cell1"),
      new TextRegular("Here is quote"),
      new TextRegular("double "),
      new TextEmphasis("quote"),
    ]);

  });



  it("parses table into book model", async () => {
    const md = `## Title

| Header 1 | Header 2 | 
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 4   | Cell 5   |
`;

    const book = await markdownToBook(md);

    expect(book.chapters.length).toBe(1);
    expect(book.chapters[0].title).toBe("Title");

    const blocks = book.chapters[0].blocks;
    expect(blocks.length).toBe(1);

    const tableBlock = blocks[0] as TableBlock;
    expect(tableBlock.type).toEqual("table");
    expect(tableBlock.headers).toEqual(["Header 1","Header 2"].map(it=> new TextRegular(it)).map(it=> new ParagraphBlock([it])));
    expect(tableBlock.rows).toEqual([
      ["Cell 1", "Cell 2"].map(it=> new TextRegular(it)).map(it=> new ParagraphBlock([it])),
      ["Cell 4", "Cell 5"].map(it=> new TextRegular(it)).map(it=> new ParagraphBlock([it])),
       ]);

        expect(tableBlock.getText()).toStrictEqual(
          ["Header 1", "Header 2", "Cell 1", "Cell 2", "Cell 4", "Cell 5"].map(
            (it) => new TextRegular(it)
          )
        );


  });

});
