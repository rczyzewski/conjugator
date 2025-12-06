import { useEffect, useState, JSX, DragEvent } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';


interface GameDefinition {
    text: string[]
}

class GameState {
    constructor(public readonly text: string[],
        public readonly paragraphs: Array<Array<MissingWord | string>>,
        public readonly state: Map<string, MissingWord>
    ) { }
}

class MissingWord {
    constructor(public readonly original: string,
        public readonly key: string,
        public answer: MissingWord | null = null
    ) { }
}
const handleDragOver = (e: any) => {
    e.preventDefault()
};


export function getWords(prefix: string, str: string): Array<string | MissingWord> {

    let reg = /{([a-zA-Z]+)}/
    const ret: Array<string | MissingWord> = []
    let current = str;
    let counter =  0
    while (true) {
        let index = current.search(reg);
        if (index == 0) {
            let m = current.match(reg)
            ret.push(new MissingWord(m![1]!, `${prefix}_${counter}`));
            counter ++;
            current = current.slice(m![0].length)
        }
        if (index > 0) {

            ret.push(current.slice(0, index))
            current = current.slice(index)
        }
        if (index < 0) {
            ret.push(current)
            break
        }

    }
    return ret;
}


export default function FillMissingWords(): JSX.Element {

    const [gameState, setGameState] = useState<GameState | null>()
    const [currentMissingWord, setCurrentMissingWord] = useState<MissingWord | null>()

    const handleDrop = (e: DragEvent, missingWord: MissingWord) => {
        console.log(e)
        console.log(currentMissingWord)

        missingWord.answer = currentMissingWord || null;
        setCurrentMissingWord(null);
    };

    function renderParagraph(parts: Array<MissingWord | string>) {
        return <p> {parts.map(it => renderMissingWord(it))} </p>
    }

    function renderMissingWord(missingWord: MissingWord | string): JSX.Element {
        if (missingWord instanceof MissingWord)
            return <><span style={{ backgroundColor: "#AAAAAA" }}

                onDrop={(e: DragEvent) => handleDrop(e, missingWord)}
                onDragOver={(e) => handleDragOver(e)}
            >

                {missingWord.answer && <>{missingWord.answer.original}</>}
                {missingWord.answer == null &&
                    <> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</>}

            </span></>
        { }

        return <span>{missingWord}</span>
    }

    const PUBLIC_URL = "http://localhost:5173/conjugator"

    useEffect(() => {

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`Error en ${url}`);
                return res.json() as Promise<GameDefinition>;
            })
            .then(it => {

                let paragraphs = it.text.map((paraph, index) =>
                    getWords(`p${index}`, paraph));

                let state = paragraphs.flatMap(it => it).filter(it => it instanceof MissingWord)
                    .map(it => it as MissingWord);

                let word_assignment = new Map<string, MissingWord>(state.map(it => [it.key, it]))
                setGameState(new GameState(it.text, paragraphs, word_assignment))

            })
    }, [])

    const url = PUBLIC_URL + `/exercises/loremipsum.json`;

    return (<>
        <HeaderComponent></HeaderComponent>

        <Container>
            {
                gameState &&

                [...gameState.state.values()]
                    .map(it => <><Button draggable onDrag={(e) => setCurrentMissingWord(it)}>{it.original}</Button> &nbsp;</>)
            }
            <hr />
            {gameState &&
                gameState.paragraphs.map(parts => renderParagraph(parts))}
        </Container>
    </>)
}

