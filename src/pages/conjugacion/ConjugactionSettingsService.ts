import { Mode, Tense, tenses } from "./Tenses";

const SETTINGS_KEY= "conjugactionSetup";

export interface IConjugacionSettings{
    tenses: Tense[]
    verbsTopLimit: number 
}

class ConjugationsSettingService {
  constructor(private settingsKey: string = SETTINGS_KEY) {}

  getConutatyionSetting(): IConjugacionSettings {
    let a = localStorage.getItem(this.settingsKey);

    if (a) {
      let tmp = JSON.parse(a) as IConjugacionSettings;

      return { ...tmp, tenses :  tmp.tenses.map(it=> new Tense(it.name, new Mode(it.mode.name)))  } as IConjugacionSettings

    }
    return {
      tenses: [ tenses[0]],
      verbsTopLimit: 10,
    } as IConjugacionSettings;
  }
  setConutatyionSetting(a : IConjugacionSettings){
     localStorage.setItem(this.settingsKey, JSON.stringify(a));
  }
}

const congationService = new ConjugationsSettingService()
export default congationService 