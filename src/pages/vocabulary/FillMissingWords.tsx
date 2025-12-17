import { useEffect, useState, JSX, DragEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';


interface GameDefinition {
    paragraphs: string[]
}

class GameState {
    constructor(public readonly text: string[],
        public readonly paragraphs: Array<Array<MissingWord | string>>,
        public readonly state: Map<string, MissingWord>,
        public readonly shuffled: MissingWord[]
    ) { }

    get withoutAnsers(): MissingWord[] {
        return this.shuffled
            .filter(it => !this.shuffled.some(d => d.answer == it))
    }
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

function shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

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


export default function FillMissingWords({ paragraphs: myText  }: GameDefinition): JSX.Element {

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

    function renderMissingWord(missingWord: MissingWord | string, verify : boolean = true): JSX.Element {
        if (missingWord instanceof MissingWord)
        { 
            if ( verify  && missingWord.answer ) {
           return  <Button className='m-1' variant={ (missingWord.answer.original === missingWord.original)? "success": "danger"} >{missingWord.answer.original}</Button>


            }
            else {
                return <>
                    <span style={{ backgroundColor: "#AAAAAA" }}

                        onDrop={(e: DragEvent) => handleDrop(e, missingWord)}
                        onDragOver={(e) => handleDragOver(e)}
                    >
                        {missingWord.answer && <><Button className='m-1' >{missingWord.answer.original}</Button></>}
                        {missingWord.answer == null &&
                            <> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</>}

                    </span>
                </>
            }
        } else {
            return <span>{missingWord}</span>
        }
    }


    useEffect(() => {

                const paragraphs = myText.map((paraph, index) =>
                    getWords(`p${index}`, paraph));

                const state = paragraphs.flatMap(it => it).filter(it => it instanceof MissingWord)
                    .map(it => it as MissingWord);

                const word_assignment = new Map<string, MissingWord>(state.map(it => [it.key, it]))
                const unordered = shuffle([...word_assignment.values()] );

                setGameState(new GameState(myText, paragraphs, word_assignment, unordered))

    }, [myText])


    return (<>

        <Container>

                {
                gameState &&

                    gameState.withoutAnsers
                    .map(it => <><Button className="p-1 m-1" draggable onDrag={() => setCurrentMissingWord(it)}>{it.original}</Button></>)
            }

            { gameState && gameState.withoutAnsers.length == 0 && <Button variant='alert'>Check</Button>  }

            <hr />
            {gameState &&
                gameState.paragraphs.map(parts => renderParagraph(parts))}
        </Container>
    </>)
}

