import { useMemo, useState, JSX } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import { ContentBlock, ListBlock, ListItemBlock } from "../../book/bookModel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { renderBlock } from "../../book/BookDisplayHelpers";

interface VerifyExerciseProps {
  readonly instructions?: string;
  /** Verify directive content; usually contains a single `ListBlock` */
  readonly items: ContentBlock[];
}

export default function VerifyExercise({ instructions, items }: VerifyExerciseProps): JSX.Element {

  const list = useMemo(() => {
    const found = items.find((b) => b instanceof ListBlock);
    return (found as ListBlock | undefined) ?? null;
  }, [items]);

  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [verifyMode, setVerifyMode] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const reset = () => {
    setCheckedItems(new Set());
    setVerifyMode(false);
    setShowSummary(false);
  };

  const handleToggle = (index: number) => {
    if (verifyMode) return;

    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const result = useMemo(() => {
    if (!list) return null;
    const perItem = list.items.map((li, index) => {
      const expected = li.checked; // boolean | null | undefined
      const selected = checkedItems.has(index);
      const isKnown = expected !== null && expected !== undefined;
      const isCorrect = isKnown ? selected === expected : false;
      return { expected, selected, isKnown, isCorrect, item: li };
    });
    const graded = perItem.filter((x) => x.isKnown);
    const correct = graded.filter((x) => x.isCorrect).length;
    return { total: graded.length, correct, perItem };
  }, [list, checkedItems]);

  const rowVariant = (li: ListItemBlock, index: number): "success" | "danger" | undefined => {
    if (!verifyMode || !result) return undefined;
    const r = result.perItem[index];
    if (!r?.isKnown) return undefined;
    return r.isCorrect ? "success" : "danger";
  };

  return (
    <Container className="border m-2" style={{ backgroundColor: "#FAFAFA" }}>
      <Nav className="navbar navbar-light bg-light justify-content-between">
        <span className="navbar-brand">
          {instructions || "Select the correct statements"}
        </span>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={reset}>
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setVerifyMode(true);
              setShowSummary(true);
            }}
            disabled={!list}
          >
            Check
          </Button>
        </div>
      </Nav>

      <div className="p-3">
        {!list && <div className="text-muted">No verify list found.</div>}
        {list &&
          list.items.map((li, index) => {
            const isChecked = checkedItems.has(index);
            const variant = rowVariant(li, index);
            return (
              <Row
                key={`verify-row-${index}`}
                className={`align-items-start mb-2 ${
                  variant === "success"
                    ? "bg-success-subtle"
                    : variant === "danger"
                      ? "bg-danger-subtle"
                      : ""
                }`}
              >
                <Col className="col-1">
                  <Form.Check
                    type="switch"
                    id={`verify-item-${index}`}
                    checked={isChecked}
                    onChange={() => handleToggle(index)}
                    disabled={verifyMode}
                    className="mb-2"
                  />
                </Col>
                <Col>{li.items.map((b, i) => <span key={`v-${index}-${i}`}>{renderBlock(b)}</span>)}</Col>
                {verifyMode && (
                  <Col className="col-auto">
                    {li.checked === null || li.checked === undefined ? (
                      <Badge bg="secondary">N/A</Badge>
                    ) : (
                      <Badge bg={variant === "success" ? "success" : "danger"}>
                        {variant === "success" ? "Correct" : "Wrong"}
                      </Badge>
                    )}
                  </Col>
                )}
              </Row>
            );
          })}
      </div>

      <Modal show={showSummary} onHide={() => setShowSummary(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {result && (
            <>
              <div className="mb-3">
                <div className="fw-bold">
                  Score: {result.correct}/{result.total}
                </div>
              </div>
              <ListGroup>
                {result.perItem.map((r, idx) => (
                  <ListGroup.Item
                    key={`sum-${idx}`}
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="me-3">
                      <div className="fw-bold">#{idx + 1}</div>
                      <div>
                        <span className="text-muted">Selected:</span>{" "}
                        <span className="fw-bold">{r.selected ? "Yes" : "No"}</span>
                      </div>
                      {r.isKnown && (
                        <div>
                          <span className="text-muted">Expected:</span>{" "}
                          <span className="fw-bold">{r.expected ? "Yes" : "No"}</span>
                        </div>
                      )}
                    </div>
                    {!r.isKnown ? (
                      <Badge bg="secondary">N/A</Badge>
                    ) : (
                      <Badge bg={r.isCorrect ? "success" : "danger"}>
                        {r.isCorrect ? "Correct" : "Wrong"}
                      </Badge>
                    )}
                  </ListGroup.Item>
                ))}
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
