import { Book }  from "./bookModel"
import FillMissingWords from "../pages/vocabulary/FillMissingWords";
import VerbConjugateExercise from "../pages/vocabulary/VerbConjugateExercise";
import VerifyExercise from "../pages/vocabulary/VerifyExercise";

import { renderBlock } from "./BookDisplayHelpers";



export default function BookView({ book }: { readonly book: Book }) {
  return (
    <>
      <pre>
        {JSON.stringify(book.metadata, null, 2)}
      </pre>
      <div>
      {book.chapters.map((chapter, chapterIndex) => {
        let exerciseCount = 0;
        const chapterNumber = chapterIndex + 1;

        return (
          <section key={chapterIndex}>
            <h3>{`${chapterNumber}. ${chapter.title}`}</h3>

            {chapter.blocks.map((block, blockIndex) => {

              if (block.type === "exercise") {
                exerciseCount += 1;
                const exerciseNumber = `${chapterNumber}.${exerciseCount}`;
                const instructions = block.instructions
                  ? `${exerciseNumber} ${block.instructions}`
                  : exerciseNumber;

                return (
                  <div key={blockIndex}>
                    <FillMissingWords
                      instructions={instructions}
                      paragraphs={block.content}
                    />
                  </div>
                );
              }

              if (block.type === "conjugation") {
                const title = block.instructions
                  ? `${chapterNumber}.${exerciseCount + 1} ${block.instructions}`
                  : `${chapterNumber}.${exerciseCount + 1}`;

                exerciseCount += 1;

                return (
                  <div key={blockIndex}>
                      <VerbConjugateExercise title={title} words={block.verbs} tenses={block.tenses}></VerbConjugateExercise>

                  </div>
                );
              }

              if (block.type === "verify") {
                exerciseCount += 1;
                const exerciseNumber = `${chapterNumber}.${exerciseCount}`;
                const instructions = block.instructions
                  ? `${exerciseNumber} ${block.instructions}`
                  : exerciseNumber;

                return (
                  <div key={blockIndex}>
                    <VerifyExercise
                      instructions={instructions}
                      items={block.items[0]}
                    />
                  </div>
                );
              }

              if (block.type === "paragraph"
                || block.type == "list"
                || block.type === "blockquote"
                || block.type === "table"
                || block.type == "code"
                ||   block.type == "youtube") {
                return renderBlock(block)
              }

              return null;
            })}
          </section>
        );
      })}
    </div>
  </>
  );
}
  