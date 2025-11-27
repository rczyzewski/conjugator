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


function VerbList( { title, range }: VerbListProps ):JSX.Element   {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tense, setTense] = useState<string[] | null>(null);
  const [verb, setVerb] = useState<VerbEntry | null>(null);
  const [person, setPerson] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [response, setResponse] = useState<"OK" | "NO" | null>(null);
  const answerRef = useRef<HTMLInputElement>(null)

  function getResponse() {
    const [mood, tenseName] = tense ?? ["indicativo", "presente"];

    // Access the verbo property from the verb state
    // Access mood properties using dynamic mood name
    const moodData = verb?.[mood as keyof VerbEntry];

    console.log(`${mood} mood:`, moodData);

    // Get tense out of mood data
    const tenseData = typeof moodData === 'object' ? moodData?.[tenseName] : undefined;
    console.log(`${tenseName} tense:`, tenseData);

    // Get specific person from tense
    const personData = typeof tenseData === 'object' ? tenseData?.[person ?? "1s"] : undefined;
    console.log(`${person ?? "1s"} person:`, personData);

    return personData;
  }


  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/verbs/esp_verbos_cleaned_batch_001.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: VerbEntry[]) => {

        let selectedVerb = getRandomItem(data);

        setVerb(selectedVerb);
        const modes = Object.getOwnPropertyNames(selectedVerb).filter(it => it !== "verbo");
        const mode = getRandomItem(modes)
        const modeData = selectedVerb[mode as keyof VerbEntry] as Conjugations;
        console.log("moodData: ", modeData)

        const tense = getRandomItem(Object.getOwnPropertyNames(modeData))
        setTense([mode, tense])

        const tenseData = modeData[tense]
        console.log(tenseData)
        const persons = Object.getOwnPropertyNames(tenseData);

        const pe = getRandomItem(persons);

        setPerson(pe)
        setAnswer(tenseData[pe])

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

    if (answerRef?.current?.value === answer) {
      setResponse("OK")
    }
    else {
      setResponse("NO")
    }
  }

  let variant ="Secondary"

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
        <Card.Title>{verb?.verbo}</Card.Title>
        <Card.Subtitle>{tense?.[0] || ""} {tense?.[1]||""}</Card.Subtitle>
        <Card.Title>{person}</Card.Title>
      <div>
        <form onSubmit={handleSubmit}>
          <input onInput={(e) => console.log((e.target as HTMLInputElement).value)} ref={answerRef}></input>
        </form>
        <div>Rersponse: {response} </div>
      </div>
        <h2>expected answer: {answer}</h2>
    </Card>
    </>
  );
}
export default VerbList;