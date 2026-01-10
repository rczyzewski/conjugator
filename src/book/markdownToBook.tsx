import { Literal, Table, List, Paragraph,  Parent, Node, Blockquote, TableCell, Link } from 'mdast'
import { Book, Chapter, ListItemBlock, ParagraphBlock, ParagraphText, TextStrong, TextRegular, TextInlineCode, CodeBlock, ListBlock, QuoteBlock, TableBlock, ContentBlock, TextSpecial, TextEmphasis, TextLink, TextImage, YouTubeBlock, BookMetadata } from './bookModel'

import remarkGfm from 'remark-gfm'
import { unified } from "unified";
import remarkParse from "remark-parse";
import { remarkExerciseDirective  }from "./ExerciseNode";
import remarkDirective from "remark-directive";
import remarkSpecialText from './remark-special-text';
import remarkYoutube from './remark-youtube';
import { YoutubeNode } from './youtube-node';
import remarkFrontmatter from 'remark-frontmatter';
import { toString } from 'mdast-util-to-string';
import { parse as yamlParse } from "yaml";
import remarkConjugation from './remark-conjugation';
import { ConjugationNode } from './conjugation-node';


export default async function  markdownToBook(markdown: string): Promise<Book> {

    const processor = unified()
      .use(remarkParse)
      .use(remarkFrontmatter)
      .use(remarkSpecialText)
      .use(remarkGfm)
      .use(remarkDirective)
      .use(remarkYoutube)
      .use(remarkConjugation)
      .use(remarkExerciseDirective);
 
    const tree = processor.parse(markdown);
    const transformedTree = await processor.run(tree);

   return  astToBook(transformedTree as Parent);
}

export function remarkToBook(node: Node): ContentBlock {
  if (node.type == 'paragraph') {
    const content = extractText(node as Paragraph)
    return new ParagraphBlock(content);
  }
  if (node.type === "code") {
     const code  = (node as any).value ?? ''
    return  new CodeBlock(code)
    }
  if (node.type === "list") {
    const listNode = node as List;
    return new ListBlock(extractListItemsFromNode(listNode), listNode.ordered || false)
  }
  if( node.type==="table"){
    const table = node as Table
    const allRows = table.children
      .map(it => it.children.map(d => new ParagraphBlock(extractText(d))))

    return new TableBlock(allRows[0], allRows.slice(1))
  }

  if (node.type === "blockquote") {
    const quoteNode = node as Blockquote
    return new QuoteBlock(quoteNode.children.map(it => remarkToBook(it)))
  }
  if (node.type === "youtube") {
    const aaa = node as YoutubeNode;
    return new YouTubeBlock(aaa.videoId)
  }

  return new ParagraphBlock([new TextRegular("Unknown node" + node.type)]);
}

export function toInnerTypes(tree: Parent): ContentBlock[] {
  return tree.children.map(it => remarkToBook(it))
}

function extractListItemsFromNode(node: List): ListItemBlock[] {
  return  node.children.map(it=> new ListItemBlock(toInnerTypes(it), it.checked))
}

export function astToBook(tree: Parent): Book {
  const book: Book = {

    metadata: undefined,
    chapters: [],
  }

  let currentChapter: Chapter | null = null

  for (const node of tree.children) {
    // Handle YAML frontmatter
    if (node.type === 'yaml')
      try {
        const yamlContent = toString(node)
        const ddd = yamlParse(yamlContent) as BookMetadata;
        book.metadata = ddd

     console.log(ddd)
     
      } catch (e) {
        console.error("Error parsing YAML:", e);
      }

    // Capítulos
    if (node.type === 'heading' ) {
      currentChapter = {
        title: (node.children[0] as Literal).value,
        blocks: [],
      }
      book.chapters.push(currentChapter)
      continue;
    }

    if (currentChapter == null) continue 
    

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

    if ( node.type === 'youtube')
    {
      const aaa = node as YoutubeNode;
      const b = new YouTubeBlock(aaa.videoId)
      currentChapter.blocks.push(b)
      console.log(node)

    }

    if (node.type === 'conjugation' ) {
      const conjugation = node as ConjugationNode;

      const data = (node as any).data ?? {}

      currentChapter.blocks.push({
        type: "conjugation",
        attributes: data.hProperties ?? {},
        instructions: data.instructions,
        verbs: conjugation.verbs,
        tenses: conjugation.tenses
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

    if (node.type === "blockquote"
      || node.type === "code"
      || node.type === 'paragraph'
      || node.type === 'list'
      || node.type === 'table') {
      currentChapter.blocks.push(remarkToBook(node))
    }


  }

  return book
}

function extractText(node: Paragraph | TableCell | Link ): ParagraphText[] {
  return node.children
    .flatMap(it => {
     const content  = (it as any).value ?? ''
      if (it.type === "strong") {
        return it.children.map(it => extractLiteralText(it as Literal)).map(it => new TextStrong(it));
      }
      if (it.type === "link") {
       const children =  extractText(it)
        return new TextLink(it.url,  children)
      }
      if (it.type === "emphasis") {
        return it.children.map(it => extractLiteralText(it as Literal)).map(it => new TextEmphasis(it))
      }
      if (it.type === "image"  ) {
        return new TextImage(it.url, it.alt || undefined )
      }

      if (it.type === "inlineCode"  ) {
        return new TextInlineCode(content)
      }
      if( it.type === "specialText"){
          return new TextSpecial(content)
      }
      return new TextRegular(content)
    })
}

function extractLiteralText(node: Literal): string {
return node.value ?? ''
}