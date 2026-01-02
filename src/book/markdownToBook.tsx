import { Literal, Table, List, Paragraph,  Parent, Node, Blockquote, Code, TableCell, TableRow } from 'mdast'
import { Book, Block, Chapter, ListItemBlock, ParagraphBlock, ParagraphText, TextStrong, TextRegular, TextInlineCode } from './bookModel'

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
  if (node.type === "code") {
     const ddd  = (node as any).value ?? ''
    return {
      type: 'code',
      text: ddd
    }
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
  if (node.type === "blockquote") {
    const quoteNode = node as Blockquote

    return { type: "blockquote", text: quoteNode.children.map(it => remarkToBook(it)) }
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

    if (node.type.toString() === 'exercise' ) {
      const data = (node as any).data ?? {}

      const children = (node as Parent).children.map(it=> remarkToBook(it));

      currentChapter.blocks.push({
        type: 'exercise',
        attributes: data.hProperties ?? {},
        instructions: data.instructions,
        content: children
      })
    }


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
    if  ( node.type=== "blockquote" || node.type ==="code")
    {  currentChapter.blocks.push(remarkToBook(node))}

    // Listas
    if (node.type === 'list') {
      currentChapter.blocks.push({
        type: 'list',
        ordered: node.ordered || false,
        items: extractListItemsFromNode(node),
      })
    }

     //Tablas
     if (node.type === 'table') {
         const table  = node  as Table 
         const allRows = table.children.map(it=> (it as TableRow))
          .map(it=> it.children.map( d=> new ParagraphBlock(extractText(d))))
       currentChapter.blocks.push({
         type: 'table',
         headers: allRows[0],
         rows: allRows.slice(1)
       })
    }

  }

  return book
}

function extractText(node: Paragraph | TableCell): ParagraphText[] {
  return node.children
    .flatMap(it => {
     const ddd  = (it as any).value ?? ''
     console.log("#####",it.type);
      if (it.type === "strong" || it.type === "emphasis" || it.type === "link"  ) {

          return it.children.map(it=> extractLiteralText(it as Literal)).map(it=> new TextStrong(it));
      }
      if (it.type === "image"  ) {
        return new TextRegular("image<" + ddd + ">")
      }
      if (it.type === "inlineCode"  ) {
        return new TextInlineCode(ddd)
      }
      return new TextRegular(ddd)
    })
}

function extractLiteralText(node: Literal): string {
return node.value ?? ''
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