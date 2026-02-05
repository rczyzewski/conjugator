import { Book }  from "./bookModel"
import FillMissingWords from "../pages/vocabulary/FillMissingWords";
import FillMissingWordsWithClue from "../pages/vocabulary/FillMissingWordsWithClue";
import VerbConjugateExercise from "../pages/vocabulary/VerbConjugateExercise";
import VerifyExercise from "../pages/vocabulary/VerifyExercise";
import BookMetadataView from "./BookMetadataView";

import { renderBlock } from "./BookDisplayHelpers";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BookTableOfContents from "./BookTableOfContents";



export default function BookView({ book }: { readonly book: Book }) {
  return (
    <Container fluid className="py-2">
      <BookMetadataView metadata={book.metadata} />
      <Row className="g-3">
        <Col lg={3} className="d-none d-lg-block">
          <BookTableOfContents book={book} />
        </Col>
        <Col lg={9}>
          <div>
            {book.chapters.map((chapter, chapterIndex) => {
              let exerciseCount = 0;
              const chapterNumber = chapterIndex + 1;

              return (
                <section
                  id={`chapter-${chapterNumber}`}
                  key={`chapter-${chapterNumber}-${chapter.title}`}
                  style={{ scrollMarginTop: "1rem" }}
                >
                  <h3>{`${chapterNumber}. ${chapter.title}`}</h3>

                  {chapter.blocks.map((block, blockIndex) => {
                    if (block.type === "exercise") {
                      exerciseCount += 1;
                      const exerciseNumber = `${chapterNumber}.${exerciseCount}`;
                      const instructions = block.instructions
                        ? `${exerciseNumber} ${block.instructions}`
                        : exerciseNumber;

                      return (
                        <div key={`exercise-${exerciseNumber}-${blockIndex}`}>
                          <FillMissingWords
                            instructions={instructions}
                            paragraphs={block.content}
                          />
                        </div>
                      );
                    }

                    if (block.type === "exercise_clue") {
                      exerciseCount += 1;
                      const exerciseNumber = `${chapterNumber}.${exerciseCount}`;
                      const instructions = block.instructions
                        ? `${exerciseNumber} ${block.instructions}`
                        : exerciseNumber;

                      return (
                        <div key={`exercise-clue-${exerciseNumber}-${blockIndex}`}>
                          <FillMissingWordsWithClue
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
                        <div key={`conjugation-${title}-${blockIndex}`}>
                          <VerbConjugateExercise
                            title={title}
                            words={block.verbs}
                            tenses={block.tenses}
                          />
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
                        <div key={`verify-${exerciseNumber}-${blockIndex}`}>
                          <VerifyExercise instructions={instructions} items={block.items} />
                        </div>
                      );
                    }

                    if (
                      block.type === "paragraph" ||
                      block.type === "heading" ||
                      block.type == "list" ||
                      block.type === "blockquote" ||
                      block.type === "table" ||
                      block.type == "code" ||
                      block.type == "youtube"
                    ) {
                      return renderBlock(block);
                    }

                    return null;
                  })}
                </section>
              );
            })}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
  