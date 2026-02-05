import { Literal, Table, List, Paragraph,  Parent, Node, Blockquote, Heading } from 'mdast'
import { Book, Chapter, ListItemBlock, ParagraphBlock, ParagraphText, TextStrong, TextRegular, TextInlineCode, CodeBlock, ListBlock, QuoteBlock, TableBlock, ContentBlock, TextSpecial, TextCluedSpecial, TextEmphasis, TextLink, TextImage, YouTubeBlock, BookMetadata, HeadingBlock, IExerciseClueBlock } from './bookModel'

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
import { extractBookMetadata } from "./markdownMetadata";


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

   const book = astToBook(transformedTree as Parent);
   // Prefer a single shared metadata parser; keep AST conversion focused on content.
   book.metadata = (await extractBookMetadata(markdown, book.metadata?.file)) ?? book.metadata;
   return book;
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
      .map(it => it.children.map(d => new ParagraphBlock(extractText(d as any))))

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
  const contentTypes = new Set(["blockquote", "code", "paragraph", "list", "table"]);
  let headingCounter = 0;

  function handleHeading(h: Heading): { currentChapter: Chapter | null; headingCounter: number } {
    const headingText = toString(h).trim();

    if (h.depth === 1) {
      if (!book.metadata) {
        book.metadata = {
          title: headingText,
          author: "",
          description: "",
          level: "",
          category: [],
          tags: [],
          file: "",
        };
      } else if (!book.metadata.title) {
        book.metadata.title = headingText;
      }
      return { currentChapter, headingCounter };
    }

    if (h.depth === 2) {
      const nextChapter: Chapter = { title: headingText, blocks: [] };
      book.chapters.push(nextChapter);
      return { currentChapter: nextChapter, headingCounter };
    }

    if (currentChapter != null) {
      const nextCounter = headingCounter + 1;
      const anchorId = `h-${nextCounter}-${headingText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}`;
      currentChapter.blocks.push(
        new HeadingBlock(h.depth, extractText(h), anchorId)
      );
      return { currentChapter, headingCounter: nextCounter };
    }
    return { currentChapter, headingCounter };
  }

  for (const node of tree.children) {
    // YAML frontmatter (kept for backward compatibility; prefer extractBookMetadata() upstream)
    if (node.type === "yaml") {
      try {
        const yamlContent = toString(node);
        book.metadata = yamlParse(yamlContent) as BookMetadata;
      } catch (e) {
        console.error("Error parsing YAML:", e);
      }
      continue;
    }

    // Headings:
    // - depth 1: treat as book title if not provided by metadata
    // - depth 2: major chapter
    // - depth 3+: minor headings inside current chapter
    if (node.type === "heading") {
      const next = handleHeading(node);
      currentChapter = next.currentChapter;
      headingCounter = next.headingCounter;
      continue;
    }

    if (currentChapter == null) continue;

    const type = node.type.toString();
    switch (type) {
      case "exercise": {
        const data = (node as any).data ?? {};
        const children = (node as Parent).children.map((it) => remarkToBook(it));
        currentChapter.blocks.push({
          type: "exercise",
          attributes: data.hProperties ?? {},
          instructions: data.instructions,
          content: children,
        });
        break;
      }
      case "exercise_clue": {
        const data = (node as any).data ?? {};
        const children = (node as Parent).children.map((it) => remarkToBook(it));
        currentChapter.blocks.push({
          type: "exercise_clue",
          attributes: data.hProperties ?? {},
          instructions: data.instructions,
          content: children,
        } as IExerciseClueBlock);
        break;
      }
      case "youtube":
        currentChapter.blocks.push(new YouTubeBlock((node as any).videoId));
        break;
      case "conjugation": {
        const conjugation = node as any;
        const data = (node as any).data ?? {};
        currentChapter.blocks.push({
          type: "conjugation",
          attributes: data.hProperties ?? {},
          instructions: data.instructions,
          verbs: conjugation.verbs,
          tenses: conjugation.tenses,
        });
        break;
      }
      case "verify": {
        const data = (node as any).data ?? {};
        currentChapter.blocks.push({
          type: "verify",
          instructions: data.instructions,
          items: (node as any).children.map((it: Node) => remarkToBook(it)),
        });
        break;
      }
      default:
        if (contentTypes.has(type)) currentChapter.blocks.push(remarkToBook(node));
        break;
    }


  }

  return book
}

function extractText(node: any): ParagraphText[] {
  const children: any[] = node?.children ?? [];
  return children.flatMap((it: any) => {
    const content = it?.value ?? "";
    if (it.type === "strong") {
      return it.children
        .map((c: any) => extractLiteralText(c as Literal))
        .map((t: string) => new TextStrong(t));
    }
    if (it.type === "link") {
      const linkChildren = extractText(it);
      return new TextLink(it.url, linkChildren);
    }
    if (it.type === "emphasis") {
      return it.children
        .map((c: any) => extractLiteralText(c as Literal))
        .map((t: string) => new TextEmphasis(t));
    }
    if (it.type === "image") {
      return new TextImage(it.url, it.alt || undefined);
    }
    if (it.type === "inlineCode") {
      return new TextInlineCode(content);
    }
    if (it.type === "specialText") {
      return new TextSpecial(content);
    }
    if (it.type === "cluedText") {
      return new TextCluedSpecial(content, String(it.clue ?? ""));
    }
    return new TextRegular(content);
  });
}

function extractLiteralText(node: Literal): string {
return node.value ?? ''
}