import { useEffect, useMemo, useState, JSX } from "react";
import fetchFromJsonDb, { VerbEntry } from "../conjugation/VerbsService";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Placeholder from "react-bootstrap/Placeholder";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import {
  VerbConjugateExerciseGame,
  checkGame,
  createVerbConjugateExerciseGame,
  setAnswer,
} from "./VerbConjugateExerciseGame";


interface GameDefinition {
    readonly title: string
    readonly words: string[]
    readonly tenses: string[]

}



export default function VerbConjugateExercise({ title, words, tenses }: GameDefinition): JSX.Element {

    const [loading, setLoading] = useState<boolean>(true);
    const [entries, setEntries] = useState<VerbEntry[] | null>(null);
    const [game, setGame] = useState<VerbConjugateExerciseGame | null>(null);
    const [verify, setVerify] = useState<boolean>(false);
    const [showSummary, setShowSummary] = useState<boolean>(false);

    useEffect(() => {

        setLoading(true);
        fetchFromJsonDb(0, 2000)
            .then((data: VerbEntry[]) => {
                const wanted = new Set(words);
                const selected = data.filter((it: VerbEntry) => wanted.has(it.verbo));
                setEntries(selected);
            })
            .finally(() => setLoading(false));
    }, [words]);

    const reset = () => {
        if (!entries) return;
        setGame(createVerbConjugateExerciseGame(entries, words, { tenses }));
        setVerify(false);
        setShowSummary(false);
    };

    useEffect(() => {
        if (!entries) return;
        setGame(createVerbConjugateExerciseGame(entries, words, { tenses }));
        setVerify(false);
        setShowSummary(false);
    }, [entries, words, tenses]);

    const check = useMemo(() => (game ? checkGame(game) : null), [game]);

    const getValidationClass = (promptId: string): string | undefined => {
        if (!verify || !check) return undefined;
        const r = check.perPrompt[promptId];
        return r?.isCorrect ? "is-valid" : "is-invalid";
    };

    const renderPromptRow = (p: { id: string; infinitivo: string; mode: string; tense: string; person: string; expected: string; }) => {
        return (
            <Form.Group className="row align-items-center mb-2" key={p.id}>
                <Form.Label className="col-sm-2 col-form-label">{p.infinitivo}</Form.Label>
                <Col>
                    <Form.Control
                        value={game?.answersByPromptId[p.id] ?? ""}
                        onChange={(e) => {
                            if (!game) return;
                            setGame(setAnswer(game, p.id, (e.target as HTMLInputElement).value));
                        }}
                        className={getValidationClass(p.id)}
                        placeholder="Type the conjugation…"
                        disabled={verify}
                    />
                    <Form.Text className="text-muted">
                        {p.mode} {p.tense} {p.person}
                    </Form.Text>
                </Col>
                {verify && (
                    <Col className="col-sm-4">
                        <span className="text-muted">Expected: </span>
                        <span className="fw-bold">{p.expected}</span>
                    </Col>
                )}
            </Form.Group>
        );
    };

    return <Container className="border m-2" style={{ backgroundColor: "#FAFAFA" }} >
        <Nav className="navbar navbar-light bg-light justify-content-between">
            <span className="navbar-brand">{title}</span>
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

        {loading && (
            <>
                <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />
                <Placeholder xs={6} /> <Placeholder xs={8} />
            </>
        )}

        {!loading && game && (
            <div className="p-3">
                {game.prompts.map(renderPromptRow)}
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
                            {game?.prompts.map((p, idx) => {
                                const r = check.perPrompt[p.id];
                                return (
                                    <ListGroup.Item
                                        key={p.id}
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="me-3">
                                            <div className="fw-bold">#{idx + 1} {p.infinitivo}</div>
                                            <div>
                                                <span className="text-muted">Answer:</span>{" "}
                                                <span className="fw-bold">{r.answer || "—"}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted">Expected:</span>{" "}
                                                <span className="fw-bold">{r.expected}</span>
                                            </div>
                                            <div className="text-muted">
                                                {p.mode} {p.tense} {p.person}
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
    
}

