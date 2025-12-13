import React, { useRef, useEffect, useState, JSX } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import fetchFromJsonDb, { VerbEntry, pickRandom, ConjugatedVerb, flatMapVerbEntry } from './VerbsService';

import ConjugactionHistoryService , {ConjugactionHistoryVerb} from './ConjugactionHistory';
import congationService, { IConjugacionSettings } from './ConjugactionSettingsService';


interface VerbListProps {
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

function VerbQuiz({ typed = false }: VerbListProps): JSX.Element {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<"open" | "evaluation">("open")
  const [conjugatedVerb, setSelected] = useState<ConjugatedVerb | null>(null)
  const [response, setResponse] = useState<true | false | null>(null);

  const answerRef = useRef<HTMLInputElement>(null)
  const [finished, setFinished] = useState<boolean>(false)

  function handleResponse(correct: boolean): void {
    setState("open");
    setFinished(!finished);
    const cv = conjugatedVerb;

    if (cv) {
      const ddd = new ConjugactionHistoryVerb(cv.infinitivo, cv.mode, cv.tense, cv.person, cv.answer, new Date());
      ConjugactionHistoryService.get(ddd.key)
     let  newStars =  Math.max( correct ? ddd.stars + 1  : ddd.stars -1, 0)

      const ddd2 = new ConjugactionHistoryVerb(cv.infinitivo, cv.mode, cv.tense, cv.person, cv.answer, new Date(), undefined, newStars)

      ConjugactionHistoryService.insert(ddd2)
    }

}

  function EvaluateResponse({ conjugatedVerb }: VerbEvaluation): JSX.Element {
    console.log("should we save it to db? ", conjugatedVerb.answer)
    return (<>
      <Col>
        <Button className="w-100" variant="danger" onClick={()=>handleResponse(false)}>Danger</Button>
      </Col>
      <Col >
        <Button className="w-100" variant="success" onClick={()=>handleResponse(true)}>Success</Button>
      </Col>
    </>
    )

  }

  useEffect(() => {
    const ddd: IConjugacionSettings = congationService.getConutatyionSetting()

    const predicate: (a: ConjugatedVerb) => boolean = (a: ConjugatedVerb) => {
      return ddd.tenses.some(tense => 
        tense.mode.name === a.mode && tense.name === a.tense
      );
    }

    fetchFromJsonDb(0, ddd.verbsTopLimit )
      .then((data: VerbEntry[]) => {

        let selectedVerb = pickRandom(data);

        const allConjugatedVerbs: ConjugatedVerb[] = flatMapVerbEntry(selectedVerb)
        .filter(it=> predicate(it));
        
        let selectedData = pickRandom(allConjugatedVerbs);


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