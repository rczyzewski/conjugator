import { Root, Literal} from 'mdast'
import { Book, Chapter } from './bookModel'

export function astToBook(tree: Root): Book {
  const book: Book = {
    title: '',
    chapters: [],
  }

  let currentChapter: Chapter | null = null

  for (const node of tree.children) {
    // Título del libro
    if (node.type === 'heading' && node.depth === 1) {
      
      book.title =(  node.children[0] as Literal).value;
       continue;
    }

    // Capítulos
    if (node.type === 'heading' && node.depth === 2) {
      currentChapter = {
        title: (node.children[0] as Literal).value,
        blocks: [],
      }
      book.chapters.push(currentChapter)
      continue;
    }

    if (currentChapter == null) continue 
    
    // Párrafo normal
    if (node.type === 'paragraph') {
      currentChapter.blocks.push({
        type: 'paragraph',
        text: extractText(node),
      })
    }

    // Ejercicio
    if (node.type.toString() === 'exercise' ) {
      const data = (node as any).data ?? {}
      currentChapter.blocks.push({
        type: 'exercise',
       attributes: data.hProperties ?? {}, 
       instructions: data.instructions,
        content: extractTextForExercise(node),
      })
    }
  }

  return book
}

function extractText(node: any): string {
  return node.children
    ?.map((c: any) => c.value ?? '')
    .join('') ?? ''
}

function extractTextForExercise(node: any): string[] {
    return node.children
      .flatMap((it: any ) =>it.children)
      .map((c:Literal) => c.value ?? '')
  }