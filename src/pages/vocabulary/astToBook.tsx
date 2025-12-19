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

    if (node.type.toString() === 'conjugaction' ) {
      const data = (node as any).data ?? {}
      currentChapter.blocks.push({
        type: 'conjugaction',
        attributes: data.hProperties ?? {},
        instructions: data.instructions,
        content: extractListItems(node),
      })
    }

    if (node.type.toString() === 'verify' ) {
      const data = (node as any).data ?? {}
      currentChapter.blocks.push({
        type: 'verify',
        attributes: data.hProperties ?? {},
        instructions: data.instructions,
        content: extractTaskListItems(node),
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

function extractFromParagraph(node: any): string {
  return node.children
    ?.flatMap((t:any)=>t.children)
    .map((c: any) => c.value ?? '')
    .join('') ?? ''
}

function extractTextForExercise(node: any): string[] {
    return node.children
      .flatMap((it: any ) =>it.children)
      .map((c:Literal) => c.value ?? '')
  }

function extractListItems(node: any): string[] {
  if (!Array.isArray(node.children)) return []
  return node.children.flatMap((child: any) => {
    if (child.type === 'list') {
      return child.children
        .filter((li: any) => li.type === 'listItem')
        .map((li: any) => extractFromParagraph(li));
    }
    return [];
  })
}

function extractTaskListItems(node: any): string[] {
  if (!Array.isArray(node.children)) return []
  
  const result: string[] = []
  
  for (const child of node.children) {
    // Task lists are parsed as 'list' nodes
    if (child.type === 'list') {
      const listItems = child.children?.filter((li: any) => li.type === 'listItem') || []
      for (const li of listItems) {
        // Extract text from paragraph nodes within list items
        const paragraphs = li.children?.filter((c: any) => c.type === 'paragraph') || []
        if (paragraphs.length > 0) {
          const text = paragraphs
            .map((p: any) => extractText(p))
            .join(' ')
            .trim()
          if (text.length > 0) {
            result.push(text)
          }
        } else {
          // Fallback: try to extract text directly from list item children
          const text = extractFromParagraph(li).trim()
          if (text.length > 0) {
            result.push(text)
          }
        }
      }
    } else if (child.type === 'paragraph') {
      // Handle if children are directly paragraphs (fallback)
      const text = extractText(child).trim()
      if (text.length > 0) {
        result.push(text)
      }
    }
  }
  
  return result
}