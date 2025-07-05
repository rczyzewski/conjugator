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

const VerbList: React.FC = () => {
  const [verbs, setVerbs] = useState<VerbEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/esp_verbs_01.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setVerbs(data);
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