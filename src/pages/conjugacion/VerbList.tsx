import React, { useRef, useEffect, useState, JSX } from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import Card from 'react-bootstrap/Card';


interface Conjugations {
  [tense: string]: {
    [person: string]: string;
  };
}

interface VerbEntry {
  verbo: string;
  imperativo: Conjugations;
  indicativo: Conjugations;
  subjuntivo: Conjugations;
}

function getRandomItem<T>(set: T[]): T {
  return Array.from(set)[Math.floor(Math.random() * set.length)];
}

interface VerbListProps {
  title: string;
  range: number;
}

class ConjugatedVerb {
  constructor(
    public readonly infinitivo: string,
    public readonly mode: string,
    public readonly tense: string,
    public readonly person: string,
    public readonly answer: string
  ) { }

}
function fetchData(range: number) {

  let maxPages = Math.ceil(range / 100);
  Array.from({ length: maxPages })
    .map((_, index) => index + 1)
    .map(it => it.toString().padStart(3, "0"))
    .map(it => process.env.PUBLIC_URL + `/verbs/esp_verbos_cleaned_batch_{it}.json`);
}

function VerbList({ title, range }: VerbListProps): JSX.Element {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conjugatedVerb, setSelected] = useState<ConjugatedVerb | null>(null)
  const [response, setResponse] = useState<"OK" | "NO" | null>(null);
  const answerRef = useRef<HTMLInputElement>(null)



  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/verbs/esp_verbos_cleaned_batch_001.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: VerbEntry[]) => {

        let selectedVerb = getRandomItem(data);

        const modes = Object.getOwnPropertyNames(selectedVerb).filter(it => it !== "verbo");
        const mode = getRandomItem(modes)
        const modeData = selectedVerb[mode as keyof VerbEntry] as Conjugations;
        console.log("moodData: ", modeData)

        const tense = getRandomItem(Object.getOwnPropertyNames(modeData))

        const tenseData = modeData[tense]
        console.log(tenseData)
        const persons = Object.getOwnPropertyNames(tenseData);

        const pe = getRandomItem(persons);


        let selectedData = new ConjugatedVerb(selectedVerb.verbo, mode, tense, pe, tenseData[pe]);

        setSelected(selectedData)
        setLoading(false);

      })
      .catch((err: TypeError) => {
        setError(err.message);
        console.log(err.stack)
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>My custom Error Error: {error}</div>;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(e);
    setResponse((answerRef?.current?.value === conjugatedVerb?.answer) ? "OK": "NO" )  

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
        <Card.Header>{title}</Card.Header>
        <Card.Title>{ }</Card.Title>
        <Card.Subtitle>{conjugatedVerb?.mode} {conjugatedVerb?.tense}</Card.Subtitle>
        <Card.Title>{conjugatedVerb?.person}</Card.Title>
        <div>
          <form onSubmit={handleSubmit}>
            <input onInput={(e) => console.log((e.target as HTMLInputElement).value)} ref={answerRef}></input>
          </form>
          <div>Rersponse: {response} </div>
        </div>
        <h2>expected answer: {conjugatedVerb?.answer}</h2>
      </Card>
    </>
  );
}
export default VerbList;