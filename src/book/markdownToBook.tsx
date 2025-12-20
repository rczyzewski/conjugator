import { Root, Literal} from 'mdast'
import { Book, Chapter } from './bookModel'

import remarkGfm from 'remark-gfm'
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkExercise from "./ExerciseNode";
import remarkDirective from "remark-directive";


export default async function  markdownToBook(markdown: string): Promise<Book> {

    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkDirective)
      .use(remarkExercise);

    const tree = processor.parse(markdown);
    const transformedTree = await processor.run(tree);

   return   astToBook(transformedTree as Root);
}

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

    // Listas
    if (node.type === 'list') {
      currentChapter.blocks.push({
        type: 'list',
        ordered: node.ordered || false,
        items: extractListItemsFromNode(node),
      })
    }

    // Tablas
    if (node.type === 'table') {
        const rows = extractTableRows(node);
      currentChapter.blocks.push({
        type: 'table',
        headers: rows[0],
        rows: rows.slice(1),
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

function extractListItemsFromNode(node: any): string[] {
  if (!Array.isArray(node.children)) return []
  return node.children
    .filter((li: any) => li.type === 'listItem')
    .map((li: any) => {
      // Extract text from all children of list item
      const paragraphs = li.children?.filter((c: any) => c.type === 'paragraph') || []
      if (paragraphs.length > 0) {
        return paragraphs
          .map((p: any) => extractText(p))
          .join(' ')
          .trim()
      }
      return extractFromParagraph(li).trim()
    })
    .filter((text: string) => text.length > 0)
}


function extractTableRows(node: any): string[][] {
  if (!node.children) return []
  
  return [...node.children]
    .filter((row: any) => row.type === 'tableRow')
    .map((row: any) => {
      if (!row.children) return []
      return row.children
        .filter((cell: any) => cell.type === 'tableCell')
        .map((cell: any) => extractText(cell).trim())
    })
}