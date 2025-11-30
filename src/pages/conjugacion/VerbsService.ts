import { from , firstValueFrom} from "rxjs";
import { mergeMap, toArray, map, skip, take } from "rxjs/operators";

const PUBLIC_URL = "https://rczyzewski.github.io/conjugator";

export interface Conjugations {
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

export function pickRandom<T>(set: T[]): T {
  return Array.from(set)[Math.floor(Math.random() * set.length)];
}

export class ConjugatedVerb {
  constructor(
    public readonly infinitivo: string,
    public readonly mode: string,
    public readonly tense: string,
    public readonly person: string,
    public readonly answer: string
  ) {}
}

interface FetchProperties {
  skip: number;
  take: number;
  pages: number[];
}
export function getFetchPages(start: number, end: number): FetchProperties {
  let firstPage = Math.floor(start / 100);
  let lastPage = Math.ceil(end / 100);

  const pages = Array.from({ length: lastPage - firstPage }).map(
    (_, index) => firstPage + index + 1
  );

  return { skip: start % 100, take: end - start, pages: pages };
}

// ...
export default function fetchFromJsonDb(
  start: number,
  end: number
): Promise<VerbEntry[]> {
  let ddd = getFetchPages(start, end);

  return firstValueFrom(
    from(ddd.pages).pipe(
      // 1. Por cada URL, hago un fetch → Item[]
      map((it) => it.toString().padStart(3, "0")),
      map((it) => PUBLIC_URL + `/verbs/esp_verbos_cleaned_batch_${it}.json`),
      mergeMap((url) =>
        from(
          fetch(url).then((res) => {
            if (!res.ok) throw new Error(`Error en ${url}`);
            return res.json() as Promise<VerbEntry[]>;
          })
        )
      ),
      mergeMap((itemsFromFile: VerbEntry[]) => from(itemsFromFile)),
      skip(ddd.skip),
      take(ddd.take),
      toArray() // → Item[]
    ),
    { defaultValue: [] }
  );
}