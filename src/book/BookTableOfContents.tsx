import { JSX } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import type { Book } from "./bookModel";
import { HeadingBlock } from "./bookModel";

export default function BookTableOfContents({
  book,
}: {
  readonly book: Book;
}): JSX.Element {
  return (
    <Card
      className="border"
      style={{
        backgroundColor: "#FAFAFA",
        position: "sticky",
        top: "1rem",
        maxHeight: "calc(100vh - 2rem)",
        overflowY: "auto",
      }}
    >
      <Card.Body className="pb-2">
        <Card.Title className="mb-2">Contents</Card.Title>
        {book.metadata?.title && (
          <div className="text-muted small">{book.metadata.title}</div>
        )}
      </Card.Body>
      <ListGroup variant="flush">
        {book.chapters.map((chapter, idx) => {
          const chapterNumber = idx + 1;
          const href = `#chapter-${chapterNumber}`;
          return (
            <div key={`toc-chapter-${chapterNumber}-${chapter.title}`}>
              <ListGroup.Item>
                <a href={href} style={{ textDecoration: "none" }}>
                  {chapterNumber}. {chapter.title}
                </a>
              </ListGroup.Item>

              {chapter.blocks
                .filter((b): b is HeadingBlock => b instanceof HeadingBlock)
                .map((h) => {
                  const indent = Math.max(0, h.depth - 2) * 12;
                  return (
                    <ListGroup.Item
                      key={`toc-${h.anchorId}`}
                      style={{ paddingLeft: 16 + indent }}
                    >
                      <a href={`#${h.anchorId}`} style={{ textDecoration: "none" }}>
                        {h.getText().map((t: any) => t?.text ?? "").join("")}
                      </a>
                    </ListGroup.Item>
                  );
                })}
            </div>
          );
        })}
      </ListGroup>
    </Card>
  );
}


