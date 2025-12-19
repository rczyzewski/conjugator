
import { useEffect, useState, JSX } from 'react';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import fetchFromJsonDb, { ConjugatedVerb, flatMapVerbEntry, pickRandom, VerbEntry } from '../conjugacion/VerbsService';
import Button from 'react-bootstrap/esm/Button';


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
            <ul>
                {gameState && gameState.map(it => <li key={it.infinitivo}>{it.infinitivo} {it.mode} {it.tense}<input></input> </li>)}
            </ul>
        </Container>
    </>)
}

