import { Mode, Tense, tenses } from "./Tenses";

const SETTINGS_KEY= "conjugationSetup";

export interface IConjugationSettings{
    tenses: Tense[]
    verbsTopLimit: number 
}

class ConjugationsSettingService {
  constructor(private settingsKey: string = SETTINGS_KEY) {}

  getConutatyionSetting(): IConjugationSettings {
    let a = localStorage.getItem(this.settingsKey);

    if (a) {
      let tmp = JSON.parse(a) as IConjugationSettings;

      return { ...tmp, tenses :  tmp.tenses.map(it=> new Tense(it.name, new Mode(it.mode.name)))  } as IConjugationSettings

    }
    return {
      tenses: [ tenses[0]],
      verbsTopLimit: 10,
    } as IConjugationSettings;
  }
  setConutatyionSetting(a : IConjugationSettings){
     localStorage.setItem(this.settingsKey, JSON.stringify(a));
  }
}

const congationService = new ConjugationsSettingService()
export default congationService 