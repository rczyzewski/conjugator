import { useEffect, useMemo, useState, JSX, DragEvent } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import {
  ContentBlock,
  ListBlock,
  ListItemBlock,
  ParagraphBlock,
  ParagraphText,
  TableBlock,
  TextSpecial,
  QuoteBlock,
} from "../../book/bookModel";
import { renderBlock, renderText } from "../../book/BookDisplayHelpers";
import {
  FillMissingWordsGame,
  WordBankItem,
  checkGame,
  clearSlot,
  createFillMissingWordsGame,
  placeWord,
} from "./FillMissingWordsGame";

interface GameDefinition {
  readonly paragraphs: ContentBlock[];
  readonly instructions?: string;
}

const handleDragOver = (e: any) => {
  e.preventDefault();
};

function hashString(input: string): string {
  // Small, stable hash for React keys (not crypto).
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

function blockKey(block: ContentBlock, fallback: string): string {
  const txt = block.getText().map((t: any) => t?.text ?? "").join("");
  return `${(block as any).type ?? "block"}-${hashString(txt)}-${fallback}`;
}

function tableRowKey(row: ParagraphBlock[], rowIndex: number): string {
  const txt = row
    .map((c) => c.getText().map((t: any) => t?.text ?? "").join(""))
    .join("|");
  return `tr-${hashString(txt)}-${rowIndex}`;
}

export default function FillMissingWords({
  paragraphs: blocks,
  instructions,
}: GameDefinition): JSX.Element {
  const [game, setGame] = useState<FillMissingWordsGame | null>(null);
  const [currentDraggedWord, setCurrentDraggedWord] =
    useState<WordBankItem | null>(null);
  const [verify, setVerify] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const reset = () => {
    setGame(createFillMissingWordsGame(blocks));
    setVerify(false);
    setShowSummary(false);
    setCurrentDraggedWord(null);
  };

  useEffect(() => {
    reset();
  }, [blocks]);

  const check = useMemo(() => (game ? checkGame(game) : null), [game]);

  const handleDrop = (_e: DragEvent, slotId: string) => {
    if (!game || !currentDraggedWord) return;
    setGame(placeWord(game, slotId, currentDraggedWord));
    setCurrentDraggedWord(null);
  };

  const renderSlot = (slotId: string) => {
    if (!game) return null;

    const answer = game.answersBySlotId[slotId];
    const isCorrect = check?.perSlot[slotId]?.isCorrect;

    if (verify) {
      return (
        <Button
          className="p-1 m-1"
          variant={isCorrect ? "success" : "danger"}
        >
          {answer?.text ?? "—"}
        </Button>
      );
    }

    return (
      <>
        {answer ? (
          <Button
            className="p-1 m-1"
            variant="secondary"
            onClick={() => setGame(clearSlot(game, slotId))}
            onDrop={(e: DragEvent) => handleDrop(e, slotId)}
            onDragOver={(e) => handleDragOver(e)}
          >
            {answer.text}
          </Button>
        ) : (
          <Button
            className="p-1 m-1 btn-outline-secondary"
            variant="light"
            onDrop={(e: DragEvent) => handleDrop(e, slotId)}
            onDragOver={(e) => handleDragOver(e)}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </Button>
        )}
      </>
    );
  };

  const renderFillMissingWordsBlock = (
    block: ContentBlock,
    slotIndexRef: { value: number }
  ): JSX.Element => {
    if (block instanceof ParagraphBlock) return renderParagraph(block, slotIndexRef);

    if (block instanceof QuoteBlock) {
      return (
        <>
          {block.text.map((b, i) => (
            <span key={blockKey(b, `quote-${i}`)}>
              {renderFillMissingWordsBlock(b, slotIndexRef)}
            </span>
          ))}
        </>
      );
    }

    if (block instanceof ListBlock) {
      return (
        <>
          {block.items.map((it, i) => (
            <div key={hashString(it.getText().map((t: any) => t?.text ?? "").join("") + `-${i}`)}>
              {renderFillMissingWordsListItem(it, slotIndexRef)}
            </div>
          ))}
        </>
      );
    }

    if (block instanceof TableBlock) {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              {block.headers.map((header, headerIndex) => (
                <th key={blockKey(header, `th-${headerIndex}`)}>
                  {renderParagraph(header, slotIndexRef)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={tableRowKey(row, rowIndex)}>
                {row.map((cell, cellIndex) => (
                  <td key={blockKey(cell, `td-${rowIndex}-${cellIndex}`)}>
                    {renderParagraph(cell, slotIndexRef)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }

    return renderBlock(block);
  };

  const renderParagraph = (
    paragraph: ParagraphBlock,
    slotIndexRef: { value: number }
  ): JSX.Element => {
    const parts = renderParagraphTextNodes(paragraph.getText(), slotIndexRef);
    return <p>{parts}</p>;
  };

  const renderParagraphTextNodes = (
    nodes: ParagraphText[],
    slotIndexRef: { value: number }
  ): JSX.Element[] => {
    let tokenCounter = 0;

    const renderNode = (t: ParagraphText): JSX.Element => {
      if (t instanceof TextSpecial) {
        const slot = game?.slots[slotIndexRef.value];
        const slotId = slot?.id ?? `slot-${slotIndexRef.value}`;
        slotIndexRef.value += 1;
        return <span key={slotId}>{renderSlot(slotId)}</span>;
      }

      const anyT = t as any;
      // Handle nested phrasing content (e.g. link children) recursively.
      if (Array.isArray(anyT?.children) && typeof anyT?.url === "string") {
        const children = (anyT.children as ParagraphText[]).map(renderNode);
        const key = `link-${tokenCounter}`;
        tokenCounter += 1;
        return (
          <a key={key} href={anyT.url}>
            {children}
          </a>
        );
      }

      const key = `txt-${tokenCounter}`;
      tokenCounter += 1;
      return <span key={key}>{renderText(t)}</span>;
    };

    return nodes.map(renderNode);
  };

  const renderFillMissingWordsListItem = (
    item: ListItemBlock,
    slotIndexRef: { value: number }
  ): JSX.Element => {
    return (
      <>
        {item.items.map((b, i) => (
          <span key={blockKey(b, `li-${i}`)}>
            {renderFillMissingWordsBlock(b, slotIndexRef)}
          </span>
        ))}
      </>
    );
  };

  return (
    <Container className="border m-2" style={{ backgroundColor: "#FAFAFA" }}>
      <Nav className="navbar navbar-light bg-light justify-content-between">
        <span className="navbar-brand">{instructions}</span>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={reset} disabled={!game}>
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setVerify(true);
              setShowSummary(true);
            }}
            disabled={!game}
          >
            Check
          </Button>
        </div>
      </Nav>

      <div className="p-3">
        {game &&
          (() => {
            const slotIndexRef = { value: 0 };
            return game.blocks.map((b, i) => (
              <span key={blockKey(b, `root-${i}`)}>
                {renderFillMissingWordsBlock(b, slotIndexRef)}
              </span>
            ));
          })()}
      </div>

      {game && game.bank.length > 0 && (
        <div className="p-3 border-top">
          <Row className="align-items-center">
            <Col className="col-auto fw-bold">Words</Col>
            <Col>
              {game.bank.map((w) => (
                <Button
                  key={w.id}
                  className="p-1 m-1"
                  draggable={!verify}
                  onDragStart={() => setCurrentDraggedWord(w)}
                  variant={currentDraggedWord?.id === w.id ? "dark" : "info"}
                >
                  {w.text}
                </Button>
              ))}
            </Col>
          </Row>
        </div>
      )}

      <Modal
        show={showSummary}
        onHide={() => setShowSummary(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {check && (
            <>
              <div className="mb-3">
                <div className="fw-bold">
                  Score: {check.correct}/{check.total}
                </div>
              </div>

              <ListGroup>
                {game?.slots.map((slot, idx) => {
                  const r = check.perSlot[slot.id];
                  const answer = r?.answer ?? null;
                  const expected = r?.expected ?? slot.expected;
                  const isCorrect = r?.isCorrect ?? false;
                  return (
                    <ListGroup.Item
                      key={slot.id}
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div className="me-3">
                        <div className="fw-bold">#{idx + 1}</div>
                        <div>
                          <span className="text-muted">Answer:</span>{" "}
                          <span className="fw-bold">
                            {answer ?? "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted">Expected:</span>{" "}
                          <span className="fw-bold">{expected}</span>
                        </div>
                      </div>
                      <Badge bg={isCorrect ? "success" : "danger"}>
                        {isCorrect ? "Correct" : "Wrong"}
                      </Badge>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={reset}>
            Reset
          </Button>
          <Button variant="primary" onClick={() => setShowSummary(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

