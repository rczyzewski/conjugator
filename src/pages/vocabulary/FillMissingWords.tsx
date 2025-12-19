import { useEffect, useState, JSX, DragEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';


interface GameDefinition {
    paragraphs: string[]
    instructions?: string
}

class GameState {
    constructor(public readonly text: string[],
        public readonly paragraphs: Array<Array<MissingWord | string>>,
        public readonly state: Map<string, MissingWord>,
        public readonly shuffled: MissingWord[],
    ) { }

    static fromText(text: string[]): GameState {
        const paragraphs = text.map((paraph, index) =>
            getWords(`p${index}`, paraph));

        const state = paragraphs.flatMap(it => it)
            .filter(it => it instanceof MissingWord)
            .map(it => it as MissingWord);

        const word_assignment = new Map<string, MissingWord>(state.map(it => [it.key, it]))
        const unordered = shuffle([...word_assignment.values()]);

        return new GameState(text, paragraphs, word_assignment, unordered);
    }

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


export default function FillMissingWords({ paragraphs: text, instructions  :myIinstructions }: GameDefinition): JSX.Element {

    const [gameState, setGameState] = useState<GameState | null>()
    const [currentMissingWord, setCurrentMissingWord] = useState<MissingWord | null>()
    const [ verify , setVerify] = useState<boolean>(false)
    
    const handleDrop = (e: DragEvent, missingWord: MissingWord) => {
        console.log(e)
        console.log(currentMissingWord)

        missingWord.answer = currentMissingWord || null;
        setCurrentMissingWord(null);
    };

    function renderParagraph(parts: Array<MissingWord | string>) {
        return <p> {parts.map(it => renderMissingWord(it, verify))} </p>
    }

    function renderMissingWord(missingWord: MissingWord | string, verify : boolean = false): JSX.Element {
        if (missingWord instanceof MissingWord)
        { 
            if ( verify  && missingWord.answer ) {
           return  <Button className='p-1 m-1' variant={ (missingWord.answer.original === missingWord.original)? "success": "danger"} >{missingWord.answer.original}</Button>


            }
            else {
                return <span 
                        onDrop={(e: DragEvent) => handleDrop(e, missingWord)}
                        onDragOver={(e) => handleDragOver(e)} >
                        {missingWord.answer && <><Button className='p-1 m-1' >{missingWord.answer.original}</Button></>}
                        {missingWord.answer == null && <Button className='p-1 m-1 btn-outline-secondary' variant={"light"} >
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Button> }
                    </span>
            }
        } else {
            return <span>{missingWord}</span>
        }
    }


    useEffect(() => {
        setGameState(GameState.fromText(text))
    }, [text]) 



    return (<>
        <Container className="border" style={{ backgroundColor: "#FAFAFA" }} >
            <nav className="navbar navbar-light bg-light justify-content-between">
                <span className="navbar-brand">{myIinstructions?myIinstructions:"Drag the words to the right spots"}</span>
            {gameState && gameState.withoutAnsers.length == 0 && <Button variant='alert' onClick={()=>setVerify(true)}>Check</Button>}
            </nav>
            {gameState && gameState.withoutAnsers
                .map(it => <><Button className="p-1 m-1" draggable onDrag={() => setCurrentMissingWord(it)}>{it.original}</Button></>)}


            {gameState && gameState.paragraphs.map(parts => renderParagraph(parts))}
        </Container>
    </>)
}

