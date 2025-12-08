export class Mode {
    constructor(public name: string){}

} 

export class Tense {
  constructor(public name: string, public mode: Mode) {}
  get id(): string {
    return `${this.mode.name}_${this.name}`;
  }
  get fullName(): string {
    return `${this.mode.name} ${this.name}`;
  }
}

let indicativo = new Mode("indicativo");
let subjuntivo = new Mode("subjuntivo")
let imperativo = new Mode("imperativo")

export const tenses : Array<Tense> = [
    new Tense("presente", indicativo),
    new Tense("futuro", indicativo),
    new Tense("condicional", indicativo),
    new Tense("imperfecto", indicativo),
    new Tense("preterito", indicativo),
    new Tense("presente", subjuntivo),
    new Tense("futuro", subjuntivo),
    new Tense("imperfecto", subjuntivo),
    new Tense("imperfecto2", subjuntivo),
    new Tense("afirmativo", imperativo),
    new Tense("negativo", imperativo),
]

//TODO: to be removed
export const tiempos: Array<[string, string]> = [
    ["indicativo", "presente"],
    ["indicativo", "futuro"],
    ["indicativo", "condicional"],
    ["indicativo", "imperfecto"],
    ["indicativo", "preterito"],
    ["subjuntivo", "presente"],
    ["subjuntivo", "futuro"],
    ["subjuntivo", "imperfecto"],
    ["subjuntivo", "imperfecto2"],
    ["imperativo", "afirmativo"],
    ["imperativo", "negativo"]
]
export const persons = [ "1s", "2s", "3s" , "1p", "2p", "3p" ]