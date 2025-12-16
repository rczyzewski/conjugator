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
  
  export interface ParagraphBlock {
    type: 'paragraph'
    text: string
  }
  
  export interface ExerciseBlock {
    type: 'exercise'
    attributes: Record<string, string>
    content: string[]
  }
  