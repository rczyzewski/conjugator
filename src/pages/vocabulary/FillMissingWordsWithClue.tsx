import { JSX, useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import {
  ContentBlock,
  ListBlock,
  ListItemBlock,
  ParagraphBlock,
  ParagraphText,
  QuoteBlock,
  TableBlock,
  TextCluedSpecial,
} from "../../book/bookModel";
import { renderBlock, renderText } from "../../book/BookDisplayHelpers";
import {
  FillMissingWordsClueGame,
  checkGame,
  clearSlot,
  createFillMissingWordsClueGame,
  setAnswer,
} from "./FillMissingWordsClueGame";

interface GameDefinition {
  readonly paragraphs: ContentBlock[];
  readonly instructions?: string;
}

export default function FillMissingWordsWithClue({
  paragraphs: blocks,
  instructions,
}: GameDefinition): JSX.Element {
  const [game, setGame] = useState<FillMissingWordsClueGame | null>(null);
  const [verify, setVerify] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const reset = () => {
    setGame(createFillMissingWordsClueGame(blocks));
    setVerify(false);
    setShowSummary(false);
  };

  useEffect(() => {
    reset();
  }, [blocks]);

  const check = useMemo(() => (game ? checkGame(game) : null), [game]);

  const renderSlot = (slotId: string) => {
    if (!game) return null;
    const isCorrect = check?.perSlot[slotId]?.isCorrect;
    const clue = check?.perSlot[slotId]?.clue ?? "";
    const value = game.answersBySlotId[slotId] ?? "";

    if (verify) {
      return (
        <span className="mx-1">
          <Form.Control
            value={value}
            readOnly
            title={clue}
            placeholder="_______"
            className={`d-inline-block align-baseline ${isCorrect ? "is-valid" : "is-invalid"}`}
            style={{
              width: "10em",
              border: 0,
              borderBottom: "2px solid #adb5bd",
              borderRadius: 0,
              background: "transparent",
              paddingLeft: 0,
              paddingRight: 0,
            }}
          />
          {clue && <span className="text-muted small ms-1">[{clue}]</span>}
        </span>
      );
    }

    return (
      <span className="mx-1">
        <Form.Control
          value={value}
          onChange={(e) => setGame(setAnswer(game, slotId, e.target.value))}
          placeholder="_______"
          title={clue}
          className="d-inline-block align-baseline"
          style={{
            width: "10em",
            border: 0,
            borderBottom: "2px solid #adb5bd",
            borderRadius: 0,
            background: "transparent",
            paddingLeft: 0,
            paddingRight: 0,
          }}
        />
        {clue && <span className="text-muted small ms-1">[{clue}]</span>}
        {value.length > 0 && (
          <Button
            className="p-0 ms-2"
            variant="link"
            onClick={() => setGame(clearSlot(game, slotId))}
            style={{ textDecoration: "none" }}
          >
            ×
          </Button>
        )}
      </span>
    );
  };

  const renderParagraphTextNodes = (
    nodes: ParagraphText[],
    slotIndexRef: { value: number }
  ): JSX.Element[] => {
    let tokenCounter = 0;
    const renderNode = (t: any): JSX.Element => {
      if (t instanceof TextCluedSpecial) {
        const slot = game?.slots[slotIndexRef.value];
        const slotId = slot?.id ?? `slot-${slotIndexRef.value}`;
        slotIndexRef.value += 1;
        return <span key={slotId}>{renderSlot(slotId)}</span>;
      }
      if (Array.isArray(t?.children) && typeof t?.url === "string") {
        const children = (t.children as ParagraphText[]).map(renderNode);
        const key = `link-${tokenCounter++}`;
        return (
          <a key={key} href={t.url}>
            {children}
          </a>
        );
      }
      const key = `txt-${tokenCounter++}`;
      return <span key={key}>{renderText(t)}</span>;
    };
    return nodes.map(renderNode);
  };

  const renderBlockWithSlots = (
    block: ContentBlock,
    slotIndexRef: { value: number }
  ): JSX.Element => {
    if (block instanceof ParagraphBlock) {
      return <p>{renderParagraphTextNodes(block.getText(), slotIndexRef)}</p>;
    }
    if (block instanceof QuoteBlock) {
      return (
        <>
          {block.text.map((b, i) => (
            <span
              key={`q-${b.getText().map((t: any) => t?.text ?? "").join("")}-${i}`}
            >
              {renderBlockWithSlots(b, slotIndexRef)}
            </span>
          ))}
        </>
      );
    }
    if (block instanceof ListBlock) {
      return (
        <ol>
          {block.items.map((it, i) => (
            <li key={`li-${it.getText().map((t: any) => t?.text ?? "").join("")}-${i}`}>
              {renderListItemWithSlots(it, slotIndexRef)}
            </li>
          ))}
        </ol>
      );
    }
    if (block instanceof TableBlock) {
      // Minimal support: render each cell as a paragraph with slots.
      return renderBlock(block);
    }
    return renderBlock(block);
  };

  const renderListItemWithSlots = (
    item: ListItemBlock,
    slotIndexRef: { value: number }
  ): JSX.Element => {
    return (
      <>
        {item.items.map((b, i) => (
          <span key={`li-${(b as any).type ?? "b"}-${b.getText().map((t: any) => t?.text ?? "").join("")}-${i}`}>
            {renderBlockWithSlots(b, slotIndexRef)}
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
            return game.blocks.map((b, i) => {
              const txt = b.getText().map((t: any) => t?.text ?? "").join("");
              const key = `${(b as any).type ?? "block"}-${txt}-${i}`;
              return <span key={key}>{renderBlockWithSlots(b, slotIndexRef)}</span>;
            });
          })()}
      </div>

      <Modal show={showSummary} onHide={() => setShowSummary(false)} centered size="lg">
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
                  return (
                    <ListGroup.Item
                      key={slot.id}
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div className="me-3">
                        <div className="fw-bold">#{idx + 1}</div>
                        <div>
                          <span className="text-muted">Clue:</span>{" "}
                          <span className="fw-bold">[{r.clue}]</span>
                        </div>
                        <div>
                          <span className="text-muted">Answer:</span>{" "}
                          <span className="fw-bold">{r.answer ?? "—"}</span>
                        </div>
                        <div>
                          <span className="text-muted">Expected:</span>{" "}
                          <span className="fw-bold">{r.expected}</span>
                        </div>
                      </div>
                      <Badge bg={r.isCorrect ? "success" : "danger"}>
                        {r.isCorrect ? "Correct" : "Wrong"}
                      </Badge>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={reset} disabled={!game}>
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


