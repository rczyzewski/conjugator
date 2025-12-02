import React, { useRef, useEffect, useState, JSX } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import fetchFromJsonDb, { VerbEntry, pickRandom, Conjugations, ConjugatedVerb } from './VerbsService';

interface VerbListProps {
  range: number;
  typed: boolean;
}

interface VerbEvaluation {
  conjugatedVerb: ConjugatedVerb
}
interface VerbResponseProps extends VerbEvaluation {
  correct: boolean;
  conjugatedVerb: ConjugatedVerb;
}

function VerbResponse({ correct, conjugatedVerb }: VerbResponseProps): JSX.Element {

  if (correct) {
    return <>
      <h2>Yes, Yes, Yes!</h2>
      <Button variant="primary">Next Verb</Button>
    </>
  }
  else {
    return <>
      <h1> {conjugatedVerb?.answer}</h1>
    </>

  }

}
function VerbQuiz({ range, typed = false }: VerbListProps): JSX.Element {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<"open" | "evaluation">("open")
  const [conjugatedVerb, setSelected] = useState<ConjugatedVerb | null>(null)
  const [response, setResponse] = useState<true | false | null>(null);

  const answerRef = useRef<HTMLInputElement>(null)
  const [finished, setFinished] = useState<boolean>(false)


  function EvaluateResponse({ conjugatedVerb }: VerbEvaluation): JSX.Element {
    console.log("should we save it to db? ", conjugatedVerb.answer)
    return (<>
      <Col>
        <Button className="w-100" variant="danger" onClick={() => { setState("open"); setFinished(!finished) }}>Danger</Button>
      </Col>
      <Col >
        <Button className="w-100" variant="success" onClick={() => { setState("open"); setFinished(!finished) }}>Success</Button>
      </Col>
    </>
    )

  }

  useEffect(() => {
    fetchFromJsonDb(0, range)
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
    console.log(response)
    setResponse((answerRef?.current?.value === conjugatedVerb?.answer) ? true : false)

  }


  return (
    <>
      <HeaderComponent></HeaderComponent>
      <Container className="min-vh-75 h-100  d-flex justify-content-center align-items-center align-self-center page-wrapper " >

        <Container className="bg-body text-center" >
          <Row className="justify-content-center">
            <Col className="text-center">
              <h2>{conjugatedVerb?.infinitivo}</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <Container><Button>{conjugatedVerb?.mode} {conjugatedVerb?.tense}</Button></Container>
            </Col>
          </Row>
          <Row>
            <Col>
              <Container>{conjugatedVerb?.person}</Container>

            </Col>
          </Row>
          <Row>
            <Col>
              {conjugatedVerb !== null && state == "evaluation" &&
                <VerbResponse correct={false} conjugatedVerb={conjugatedVerb} />
              }

            </Col>
          </Row>

        </Container>
      </Container>
      <div className="footer-wrapper">
        <footer className="container-fluid">
          <div id="footerPrimary" className="container">
            {typed &&
              <Row>
                <Col>
                  <form onSubmit={handleSubmit}>
                    <input onInput={(e) => console.log((e.target as HTMLInputElement).value)} ref={answerRef}></input>
                  </form>
                </Col>
              </Row>
            }
            {!typed && state == "open" &&
              <Row>
                <Col className="col-12">
                  <Button variant='info' onClick={() => setState("evaluation")} className='col-12'>Check</Button>
                </Col>
              </Row>
            }
            {conjugatedVerb !== null && state == "evaluation" &&
              <Row>
                <EvaluateResponse conjugatedVerb={conjugatedVerb} />
              </Row>
            }
          </div>
        </footer>
      </div>
    </>
  );
}
export default VerbQuiz;