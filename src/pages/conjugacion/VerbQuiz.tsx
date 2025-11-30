import React, { useRef, useEffect, useState, JSX } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import fetchFromJsonDb, { VerbEntry , pickRandom, Conjugations, ConjugatedVerb} from './VerbsService';

interface VerbListProps {
  title: string;
  range: number;
}

interface VerbResponseProps {
  correct: boolean
  conjugatedVerb: ConjugatedVerb
}

function VerbResponse( { correct, conjugatedVerb }: VerbResponseProps  ): JSX.Element {

  if ( correct ) {
  return <>
        <h2>Yes, Yes, Yes!</h2>
        <Button variant="primary">Next Verb</Button>
  </>
  }
  else {
  return <>
        <h2>No No No!</h2>
        <h2>expected answer: {conjugatedVerb?.answer}</h2>
        <Button variant="primary">Next Verb</Button>
  </>

  }
  
}
function VerbQuiz({ title, range }: VerbListProps): JSX.Element {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conjugatedVerb, setSelected] = useState<ConjugatedVerb | null>(null)
  const [response, setResponse] = useState<true | false | null>(null);
  const answerRef = useRef<HTMLInputElement>(null)
  const [ finished, setFinished ] = useState<boolean>(false)

function EvaluateResponse( { conjugatedVerb }: VerbResponseProps ) : JSX.Element{
  console.log("should we save it to db? ", conjugatedVerb.answer)
  return ( <>
  <Button variant="danger" onClick={ ()=> { setFinished(!finished)}}>Danger</Button>
  <Button variant="warning" onClick={ ()=> { setFinished(!finished)}}>Warning</Button>
  <Button variant="secondary" onClick={ ()=> { setFinished(!finished)}}>Secondary</Button>
  <Button variant="info" onClick={ ()=> { setFinished(!finished)}}>Info</Button>
  <Button variant="success" onClick={ ()=> { setFinished(!finished)}}>Success</Button>
</>
)

}

  useEffect(() => {
    fetchFromJsonDb(0, 100)
      .then((data: VerbEntry[]) => {

        let selectedVerb = pickRandom(data);

        const modes = Object.getOwnPropertyNames(selectedVerb).filter(it => it !== "verbo");
        const mode = pickRandom(modes)
        const modeData = selectedVerb[mode as keyof VerbEntry] as Conjugations;


        const tense = pickRandom(Object.getOwnPropertyNames(modeData))

        const tenseData = modeData[tense]
        console.log(tenseData)
        const persons = Object.getOwnPropertyNames(tenseData);

        const pe = pickRandom(persons);


        let selectedData = new ConjugatedVerb(selectedVerb.verbo, mode, tense, pe, tenseData[pe]);

        setSelected(selectedData)
        setLoading(false);

      })
      .catch((err: TypeError) => {
        setError(err.message);
        console.log(err.stack)
        setLoading(false);
      });
  }, [finished]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>My custom Error: {error}</div>;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(event);
    setResponse((answerRef?.current?.value === conjugatedVerb?.answer) ? true: false )  

  }

  let variant = "Secondary"

  return (
    <>
      <HeaderComponent></HeaderComponent>
      <Card
        bg={variant.toLowerCase()}
        key={variant}
        text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
        style={{ width: '24rem' }}
        className="mb-2"
      >
        <Card.Header>{title} : {range}</Card.Header>
        <Card.Title>{conjugatedVerb?.infinitivo }</Card.Title>
        <Card.Subtitle>{conjugatedVerb?.mode} {conjugatedVerb?.tense}</Card.Subtitle>
        <Card.Title>{conjugatedVerb?.person}</Card.Title>
        <div>
          <form onSubmit={handleSubmit}>
            <input onInput={(e) => console.log((e.target as HTMLInputElement).value)} ref={answerRef}></input>
          </form>
        </div>
      { conjugatedVerb !== null && response !== null &&
      
        <VerbResponse correct={false} conjugatedVerb={conjugatedVerb}/> 
        

}
{ conjugatedVerb !== null &&
      <EvaluateResponse conjugatedVerb={conjugatedVerb} correct={true}/>
}
      </Card>
    </>
  );
}
export default VerbQuiz;