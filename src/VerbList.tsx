import React, { useRef, useEffect, useState } from 'react';


 interface Conjugations {
  [tense: string]: {
    [person: string]: string;
  };
}

 interface VerbEntry {
  verbo: string;
  imperativo:  Conjugations  ;
  indicativo:  Conjugations  ;
  subjuntivo: Conjugations ;
}
  var persons = ["1s", "2s", "1p", "2p", "3s", "3p"];  

  var tenses : Array< [string, string]> = [
  ["imperativo", "negativo"],
  ["imperativo", "afirmativo"],
  ["indicativo", "futuro"],
  ["indicativo", "presente"],
  ["indicativo", "preterito"],
  ["indicativo", "imperfecto"],
  ["indicativo", "condicional"],
  ["subjuntivo", "presente"],
  ["subjuntivo", "preterito"],
  ["subjuntivo", "futuro"],
  ]

function getRandomItem<T>(set: T[]): T {
      return Array.from(set)[Math.floor(Math.random() * set.length)];
    }


const VerbList: React.FC = () => {
  const [verbs, setVerbs] = useState<VerbEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tense, setTense] = useState<string[]|null>(null);
  const [verb, setVerb] = useState<VerbEntry|null>(null);
  const [person, setPerson] = useState<string|null>(null);
  const [answer, setAnswer] = useState<string|null>(null);
 const [response, setResponse] = useState<"OK"|"NO"|null>(null); 
 const answerRef = useRef<HTMLInputElement>(null)

 function getResponse(){ 
   const [ mood, tenseName ] = tense?? ["indicativo"  , "presente" ] ;
   
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
        setVerbs(data);
        let r = getRandomItem(data);
        setVerb(r);

        const te = getRandomItem(tenses)
        setTense(te);
        const pe = getRandomItem(persons);
        setPerson(pe)

        let expectedAnswer = r.indicativo[te[1]!][pe]
        setAnswer(expectedAnswer)

        setLoading(false);

      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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

  return (
    <div>
      <h2>Spanish Verbs</h2>
      <h2>verbo: {verb?.verbo}</h2>
      <h2>mode: {tense?.[0] || null} tense: {tense?.[1] || null} </h2>
      <h2>person {person}</h2>
      <h2>expected answer: {answer}</h2>
      <form onSubmit={handleSubmit}>
      <input onInput={(e) => console.log((e.target as HTMLInputElement).value)} ref={answerRef}></input>
    </form>
    <div>Rersponse: {response} </div>
    </div>
  );

}
export default VerbList;