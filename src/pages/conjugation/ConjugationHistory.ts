import { openDB, DBSchema, IDBPDatabase } from "idb";



export class ConjugationHistoryVerb {
  constructor(
    public readonly infinitivo: string,
    public readonly mode: string,
    public readonly tense: string,
    public readonly person: string,
    public readonly answer: string,
    public readonly answered: Date,
    public readonly incomming?: Date,
    public readonly stars: number = 0
  ) {}
  get key() :  string {
     return `${this.infinitivo}_ ${this.mode}_${this.tense}_${this.person}`
  }
}

interface MyDB extends DBSchema {
  test1: {
    key: string;
    value: ConjugationHistoryVerb;
    indexes: {
      compoundIndex: [string, string, string, string];
      answered: [Date];
    };
  };
}

async function demo(): Promise<IDBPDatabase<MyDB>> {
  const db: IDBPDatabase<MyDB> = await openDB<MyDB>("my-db3", 1, {
    upgrade(db) {
      const store = db.createObjectStore("test1");
      store.createIndex("compoundIndex", ["verb", "mode", "tense", "person"]);
      store.createIndex("answered",  "answered");
    },
  });

  return db;
}

class ConjugationHistoryCollectionService {
  constructor(public db: IDBPDatabase<MyDB>) {}
  async get(key: string): Promise<ConjugationHistoryVerb|undefined> {
    return await db.get("test1", key);
  }

  async insert(entry: ConjugationHistoryVerb): Promise<void> {
    await db.put("test1", entry, entry.key);
  }

 async findInTimeRange() {
    return db.getAllFromIndex("test1", "answered");
  }
}

const db = await demo();
export default new ConjugationHistoryCollectionService(db);
