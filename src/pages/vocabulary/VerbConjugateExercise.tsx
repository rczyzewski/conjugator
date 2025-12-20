
import { useEffect, useState, JSX } from 'react';
import fetchFromJsonDb, { ConjugatedVerb, flatMapVerbEntry, pickRandom, VerbEntry } from '../conjugacion/VerbsService';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';


interface GameDefinition {
    title: string
    words: string[]
    tenses: string[]
}



export default function VerbConjugateExercise({ title: title, words: words, tenses: tenses }: GameDefinition): JSX.Element {

    const [gameState, setGameState] = useState<ConjugatedVerb[] | null>()

    useEffect(() => {

        fetchFromJsonDb(0, 100)
            .then((data: VerbEntry[]) => {
                const selectedVerbs = data.filter((it: VerbEntry) => words.some(v => v === it.verbo))

                const selectedMap = new Map(selectedVerbs.map(obj => [obj.verbo, obj as VerbEntry]));

                const gameState = words.map(it => selectedMap.get(it))
                    .filter(it => it)
                    .map(it => it as VerbEntry)
                    .map(it => pickRandom(flatMapVerbEntry(it)));
                setGameState(gameState);
            })
    }
        , [words, tenses])


    return (<>
        <Container className="border" style={{ backgroundColor: "#FAFAFA" }} >
            <Nav className=" navbar-light bg-light justify-content-between">
                <span className="navbar-brand">{title}</span>
                <Button>Check</Button>
            </Nav>

            {gameState && gameState.map(it =>
                <Form.Group className="row" key={it.infinitivo}>
                    <Form.Label for="inputEmail3" className="col-sm-2 col-form-label">{it.infinitivo}</Form.Label>
                    <Col >
                        <Form.Control type="email" className="form-control" id="inputEmail3" />
                    </Col>
                    <Col>{it.answer}</Col>
                    <Col>
                        <Form.Text className="text-muted">
                            {it.mode} {it.tense} {it.person}
                        </Form.Text>
                    </Col>
                </Form.Group>
            )}
        </Container>
    </>)
}

