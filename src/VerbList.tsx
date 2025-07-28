import React, { useEffect, useState } from 'react';

interface Conjugations {
  [tense: string]: {
    [person: string]: string;
  };
}

interface VerbEntry {
  verbo: string;
  [mood: string]: Conjugations | string;
}
  var persons = ["1s", "2s", "1p", "2p", "3s", "3p"];  

  var tenses = [
  ["imperativo", "negativo"],
  ["imperativo", "afirmativo"],
  ["indicativo", "futuro"],
  ["indicativo", "presente"],
  ["indicativo", "preterito"],
  ["indicativo", "imperfecto"],
  ["indicativo", "condicional"],
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


  useEffect(()=> {
    setTense(getRandomItem(tenses));
    setPerson(getRandomItem(persons))

 //   setTense(getRandomItem(tenses));

  } )


  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/verbs/esp_verbos_cleaned_batch_001.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: VerbEntry[]) => {
        setVerbs(data);
        setVerb(getRandomItem(data));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Spanish Verbs</h2>
      <h2>verbo: {verb?.verbo}</h2>
      <h2>tiempo: {tense}</h2>
      <h2>person {person}</h2>
      <ul>
        {verbs.slice(0, 10).map((verb, idx) => (
          <li key={idx} style={{ marginBottom: '1em' }}>
            <strong>{verb.verbo}</strong>
            <ul>
              {verb.indicativo && typeof verb.indicativo === 'object' &&
                Object.entries(verb.indicativo).slice(0, 1).map(([tense, forms]) => (
                  <li key={tense}>
                    <em>{tense}</em>:
                    <ul>
                      {Object.entries(forms as { [person: string]: string }).slice(0, 3).map(
                        ([person, form]) => (
                          <li key={person}>
                            {person}: {form}
                          </li>
                        )
                      )}
                    </ul>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerbList; 