export  interface Conjugations {
  [tense: string]: {
    [person: string]: string;
  };
}

export interface VerbEntry {
  verbo: string;
  imperativo: Conjugations;
  indicativo: Conjugations;
  subjuntivo: Conjugations;
}

export  function pickRandom<T>(set: T[]): T {
  return Array.from(set)[Math.floor(Math.random() * set.length)];
}



export  class ConjugatedVerb {
  constructor(
    public readonly infinitivo: string,
    public readonly mode: string,
    public readonly tense: string,
    public readonly person: string,
    public readonly answer: string
  ) { }

}
async function  myFetch( url : string ): Promise<Array<VerbEntry>> { 
    
    return   fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json()  ;
      }) 
      .then((data: VerbEntry[]) => data)

    }


export default function fetchData(range: number) : Promise<VerbEntry[]> {

 console.log("fetchData is started" )
  let maxPages = Math.ceil(range / 100);

 const  PUBLIC_URL = "https://rczyzewski.github.io/conjugator"



return  Array.from({ length: maxPages })
    .map((_, index) => index + 1)
    .map(it => it.toString().padStart(3, "0"))
    .map(it => PUBLIC_URL + `/verbs/esp_verbos_cleaned_batch_${it}.json`)
    .map( it=> myFetch(it))[0]!
}