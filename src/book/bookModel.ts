
export interface BookMetadata {
  title: string
  author: string
  description: string
  level: string
  category: string[]
  tags: string[]
  file: string
}

export interface Book {
    metadata?:  BookMetadata
    chapters: Chapter[]
  }
  
  export interface Chapter {
    title: string
    blocks: Block[]
  }
  
export interface BlockElement {
  getText() : ParagraphText[]
}

export type ContentBlock  = ParagraphBlock | ListBlock | QuoteBlock | CodeBlock | TableBlock |
YouTubeBlock
 export type Block =
     | IExerciseBlock
     | IConjugationBlock
     | IVerifyBlock
     | ContentBlock


export  interface ParagraphText{
  }

 export  class TextSpecial implements ParagraphText{
    constructor( public readonly text: string){}
  }

 export  class TextRegular implements ParagraphText{
    constructor( public readonly text: string){}
  }

 export  class TextInlineCode implements ParagraphText{
    constructor( public readonly text: string){}
  }

 export  class TextLink{
    constructor( public readonly url: string, 
      public readonly children : ParagraphText[],
      public readonly title? : string , 
     ){
    }
  }

 export class TextImage implements ParagraphText {
   constructor(public readonly url: string, public readonly text?: string) {}
 }

 export  class TextEmphasis implements ParagraphText{
    constructor( public readonly text: string){}
  }

 export  class TextStrong{
    constructor( public readonly text: string){}
  }
  

export class CodeBlock implements  BlockElement{
    public readonly type = "code";
    constructor( public readonly code: string  ){}
  getText(): ParagraphText[] {
    return [ new TextInlineCode( this.code) ]
  }

}
  export class ParagraphBlock implements BlockElement{
    public readonly type = "paragraph";
    constructor(public readonly text:  ParagraphText[]){}
    getText(): ParagraphText[] { return this.text }
  }
  
  export interface IExerciseBlock {
    type: 'exercise'
    instructions?: string
    attributes: Record<string, string>
    content: ContentBlock[]
  }

  export interface IConjugationBlock {
    type: "conjugation";
    instructions?: string;
    attributes: Record<string, string>;
    tenses: string[];
    verbs: string[];
  }

  export interface IVerifyBlock {
    type: 'verify'
    instructions?: string
    items: ListItemBlock[]
  }

export class QuoteBlock implements BlockElement {
  public readonly type = "blockquote";
  constructor(public text: ContentBlock[]) {}

  getText(): ParagraphText[] {
    return this.text.flatMap((it) => it.getText());
  }
}

  export class ListItemBlock implements  BlockElement{
    constructor(public readonly items: ContentBlock[], public readonly checked : boolean|null | undefined ){}
    getText(): ParagraphText[] {
      return this.items.flatMap(it=> it.getText())
    }
  }


  export class ListBlock implements BlockElement{
    public readonly type = "list";
    constructor(public readonly items: ListItemBlock[], public readonly ordered : boolean = false){}
    getText(): ParagraphText[] {
      return  this.items.flatMap(it=> it.getText())
    }
  }

  export class TableBlock implements BlockElement{
    public readonly type = "table";
    constructor(
      public readonly headers: ParagraphBlock[],
      public readonly rows: ParagraphBlock[][]
    ) {}
    getText(): ParagraphText[] {
      const fromHeader =  this.headers.flatMap(it=> it.getText())
      const fromRows = this.rows.flatMap(it=>it).flatMap(it=> it.getText())
      return  [ ...fromHeader, ...fromRows]

    }
  }
  export class YouTubeBlock implements BlockElement{
    public readonly type = "youtube";
    constructor( public readonly videoId : string) {}

    getText(): ParagraphText[] {
        return []
    }
  }
  