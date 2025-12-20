export interface Book {
    title: string
    chapters: Chapter[]
  }
  
  export interface Chapter {
    title: string
    blocks: Block[]
  }
  
  export type Block =
    | ParagraphBlock
    | ExerciseBlock
    | ConjugationBlock
    | VerifyBlock
    | ListBlock
    | TableBlock
  
  export interface ParagraphBlock {
    type: 'paragraph'
    text: string
  }
  
  export interface ExerciseBlock {
    type: 'exercise'
    instructions?: string
    attributes: Record<string, string>
    content: string[]
  }
//TODO: paragraph/exercise/conjugaction should be enum

  export interface ConjugationBlock {
    type: 'conjugaction'
    instructions?: string
    attributes: Record<string, string>
    content: string[]
  }

  export interface VerifyBlock {
    type: 'verify'
    instructions?: string
    attributes: Record<string, string>
    content: string[]
  }

  export interface ListBlock {
    type: 'list'
    ordered: boolean
    items: string[]
  }

  export interface TableBlock {
    type: 'table'
    headers: string[]
    rows: string[][]
  }
  