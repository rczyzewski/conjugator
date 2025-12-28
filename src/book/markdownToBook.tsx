import { Literal, Table, List, Paragraph,  Parent, Node, PhrasingContent} from 'mdast'
import { Book, Block, Chapter, ListItemBlock, ParagraphBlock, ParagraphText, TextStrong, TextRegular } from './bookModel'

import remarkGfm from 'remark-gfm'
import { unified } from "unified";
import remarkParse from "remark-parse";
import { remarkExerciseDirective  }from "./ExerciseNode";
import remarkDirective from "remark-directive";


export default async function  markdownToBook(markdown: string): Promise<Book> {

    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkDirective)
      .use(remarkExerciseDirective);

    const tree = processor.parse(markdown);
    const transformedTree = await processor.run(tree);

   return  astToBook(transformedTree as Parent);
}

export function remarkToBook(node: Node): Block {
  if (node.type == 'paragraph') {
    const ddd = extractText(node as Paragraph)
    return new ParagraphBlock(ddd);
  }
  if (node.type === "verify") {
    const dd = node as List;
    return {
      type: 'verify',
      instructions :"none",
      items: extractListItemsFromNode(dd),
    }
  }
  if (node.type === "list") {
    const dd = node as List;
    return {
      type: 'list',
      ordered: dd.ordered || false,
      items: extractListItemsFromNode(dd),
    }
  }
  return new ParagraphBlock([new TextRegular("someTextNewList")]);
}

export function toInnerTypes(tree: Parent): Block[] {
  return tree.children.map(it => remarkToBook(it))
}

function extractListItemsFromNode(node: List): ListItemBlock[] {
  return  node.children.map(it=> new ListItemBlock(toInnerTypes(it), it.checked))
}

export function astToBook(tree: Parent): Book {
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
    // if (node.type.toString() === 'exercise' ) {
    //   const data = (node as any).data ?? {}
    //   currentChapter.blocks.push({
    //     type: 'exercise',
    //    attributes: data.hProperties ?? {}, 
    //    instructions: data.instructions,
    //     content: [ new ParagraphBlock( extractTextForExercise(node).join())] 
    //   })
    // }

    if (node.type.toString() === 'conjugaction' ) {
      const data = (node as any).data ?? {}
      currentChapter.blocks.push({
        type: 'conjugaction',
        attributes: data.hProperties ?? {},
        instructions: data.instructions,
        content: extractListItemsForConjugaction(node),
      })
    }

    if (node.type.toString() === 'verify' ) {
      const data = (node as any).data ?? {}
       
       
      currentChapter.blocks.push({
        type: 'verify',
        instructions: data.instructions,
        items: (node as any).children.map((it: Node) => remarkToBook(it)),
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
    // if (node.type === 'table') {
    //     const rows = extractTableRows(node);
    //   currentChapter.blocks.push({
    //     type: 'table',
    //     headers: rows[0],
    //     rows: rows.slice(1),
    //   })
    //}
    // 

  }

  return book
}

function extractText(node: Paragraph): ParagraphText[] {
  return node.children
    .map(it => {
     const ddd  = (it as any).value ?? ''
      if (it.type === "strong") {
        return new TextStrong(ddd);
      }
      return new TextRegular(ddd)
    })
}



function extractListItemsForConjugaction(node: any): string[] {

  function extractTextForExercise(node: any): string[] {
    return node.children
      .flatMap((it: any) => it.children)
      .map((c: Literal) => c.value ?? '')
  }

  if (!Array.isArray(node.children)) return []
  return node.children.flatMap((child: any) => {
    if (child.type === 'list') {
      return child.children
        .filter((li: any) => li.type === 'listItem')
        .map((li: any) => extractTextForExercise(li));
    }
    return [];
  })
}

// export function extractTaskListItems(node: any): string[] {
//   if (!Array.isArray(node.children)) return []
  
//   const result: string[] = []
  
//   for (const child of node.children) {
//     // Task lists are parsed as 'list' nodes
//     if (child.type === 'list') {
//       const listItems = child.children?.filter((li: any) => li.type === 'listItem') || []
//       for (const li of listItems) {
//         // Extract text from paragraph nodes within list items
//         const paragraphs = li.children?.filter((c: any) => c.type === 'paragraph') || []
//         if (paragraphs.length > 0) {
//           const text = paragraphs
//             .map((p: any) => extractText(p as Paragraph))
//             .join(' ')
//             .trim()
//           if (text.length > 0) {
//             result.push(text)
//           }
//         } else {
//           // Fallback: try to extract text directly from list item children
//           const text = extractFromParagraph(li).trim()
//           if (text.length > 0) {
//             result.push(text)
//           }
//         }
//       }
//     } else if (child.type === 'paragraph') {
//       // Handle if children are directly paragraphs (fallback)
//       result.push(
//           extractText(child).map(it=>it.text).join(""))
//     }
//   }
  
//   return result
// }



// function extractTableRows(node: Table): string[][] {
  
//   if (!node.children) return []
  
//   return [...node.children]
//     .filter((row: any) => row.type === 'tableRow')
//     .map((row: any) => {
//       if (!row.children) return []
//       return row.children
//         .filter((cell: any) => cell.type === 'tableCell')
//         .map((cell: any) => extractText(cell).trim())
//     })
// }