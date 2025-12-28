export interface Book {
    title: string
    chapters: Chapter[]
  }
  
  export interface Chapter {
    title: string
    blocks: Block[]
  }
  
  export type Block =
    | IParagraphBlock
    | IExerciseBlock
    | IConjugationBlock
    | IVerifyBlock
    | IListBlock
    | ITableBlock
  

export  interface ParagraphText{
  text:string;
  }

 export  class TextRegular implements ParagraphText{
    constructor( public readonly text: string){}
  }

 export  class TextStrong{
    constructor( public readonly text: string){}
  }
  
  export interface IParagraphBlock {
    type: 'paragraph'
    text: ParagraphText[]
  }

  export class ParagraphBlock implements IParagraphBlock{
    public readonly type = "paragraph";
    constructor(public readonly text:  ParagraphText[]){}
  }
  
  export interface IExerciseBlock {
    type: 'exercise'
    instructions?: string
    attributes: Record<string, string>
    content: IParagraphBlock[]
  }

  export interface IConjugationBlock {
    type: 'conjugaction'
    instructions?: string
    attributes: Record<string, string>
    content: string[]
  }

  export interface IVerifyBlock {
    type: 'verify'
    instructions?: string
    items: IListItemBlock[]
  }



  export interface IListItemBlock{
    checked: boolean | null |undefined
    items: Block[]
  }

  export class ListItemBlock implements IListItemBlock{
    constructor(public readonly items: Block[], public readonly checked : boolean|null | undefined ){}
  }

  export interface IListBlock {
    type: 'list'
    ordered: boolean
    items: IListItemBlock[]
  }

  export interface ITableBlock {
    type: 'table'
    headers: ParagraphText[]
    rows: ParagraphText[][]
  }
  