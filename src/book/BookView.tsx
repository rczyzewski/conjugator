import { Book } from "./bookModel"
import FillMissingWords from "../pages/vocabulary/FillMissingWords";
import VerbConjugateExercise from "../pages/vocabulary/VerbConjugateExercise";
import VerifyExercise from "../pages/vocabulary/VerifyExercise";
import Table from "react-bootstrap/Table";

export default function BookView({ book }: { book: Book }) {
  return (
    <div>
      <h1>{book.title}</h1>

      {book.chapters.map((chapter, chapterIndex) => {
        let exerciseCount = 0;
        const chapterNumber = chapterIndex + 1;

        return (
          <section key={chapterIndex}>
            <h2>{`${chapterNumber}. ${chapter.title}`}</h2>

            {chapter.blocks.map((block, blockIndex) => {
              if (block.type === "paragraph") {
                return <p key={blockIndex}>{block.text}</p>;
              }

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

              if (block.type === "conjugaction") {
                const title = block.instructions
                  ? `${chapterNumber}.${exerciseCount + 1} ${block.instructions}`
                  : `${chapterNumber}.${exerciseCount + 1}`;

                exerciseCount += 1;

                return (
                  <div key={blockIndex}>
                      <VerbConjugateExercise title={title} words={block.content} tenses={[block.attributes.tenses]}></VerbConjugateExercise>

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
                      items={block.content}
                    />
                  </div>
                );
              }

              if (block.type === "list") {
                if (block.ordered) {
                  return (
                    <ol key={blockIndex}>
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ol>
                  );
                } else {
                  return (
                    <ul key={blockIndex}>
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  );
                }
              }

              if (block.type === "table") {
                return (
                  <Table key={blockIndex} striped bordered hover>
                    <thead>
                      <tr>
                        {block.headers.map((header, headerIndex) => (
                          <th key={headerIndex}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                );
              }

              return null;
            })}
          </section>
        );
      })}
    </div>
  );
}
  