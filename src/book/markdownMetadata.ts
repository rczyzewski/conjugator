import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import { toString } from "mdast-util-to-string";
import { parse as yamlParse } from "yaml";
import type { BookMetadata } from "./bookModel";

export type MarkdownFrontmatter = Record<string, unknown> & {
  title?: string;
  author?: string;
  level?: string;
  file?: string;
  description?: string;
  category?: string[];
  tags?: string[];
  image?: string;
  order?: number;
};

export interface MarkdownMetadataExtract {
  readonly frontmatter: MarkdownFrontmatter | null;
  readonly hasFrontmatter: boolean;
  readonly firstHeading: string | null;
  readonly firstParagraph: string | null;
  readonly hasContent: boolean;
}

function safeYamlParse(yamlText: string): MarkdownFrontmatter | null {
  try {
    return (yamlParse(yamlText) as MarkdownFrontmatter) ?? null;
  } catch {
    return null;
  }
}

export async function extractMarkdownMetadata(markdown: string): Promise<MarkdownMetadataExtract> {
  const processor = unified().use(remarkParse).use(remarkFrontmatter);
  const tree = processor.parse(markdown) as any;
  const transformed = await processor.run(tree);
  const children: any[] = (transformed as any).children ?? [];

  const yamlNode = children.find((n) => n.type === "yaml") ?? null;
  const hasFrontmatter = yamlNode != null;
  const frontmatter = yamlNode ? safeYamlParse(toString(yamlNode)) : null;

  const headingNode = children.find((n) => n.type === "heading") ?? null;
  const firstHeading = headingNode ? toString(headingNode) : null;

  const paragraphNode =
    children.find((n) => n.type === "paragraph" && toString(n).trim().length > 0) ?? null;
  const firstParagraph = paragraphNode ? toString(paragraphNode) : null;

  const nonYamlChildren = children.filter((n) => n.type !== "yaml");
  const hasContent = nonYamlChildren.some((n) => toString(n).trim().length > 0);

  return { frontmatter, hasFrontmatter, firstHeading, firstParagraph, hasContent };
}

export async function extractBookMetadata(
  markdown: string,
  fallbackFile?: string
): Promise<BookMetadata | undefined> {
  const { frontmatter } = await extractMarkdownMetadata(markdown);
  if (!frontmatter) return undefined;

  // Normalize to your `BookMetadata` shape; keep it tolerant to missing fields.
  return {
    title: String(frontmatter.title ?? ""),
    author: String(frontmatter.author ?? ""),
    description: String(frontmatter.description ?? ""),
    level: String(frontmatter.level ?? ""),
    category: (frontmatter.category as string[] | undefined) ?? [],
    tags: (frontmatter.tags as string[] | undefined) ?? [],
    file: String(frontmatter.file ?? fallbackFile ?? ""),
    image: (frontmatter.image as string | undefined) ?? undefined,
  };
}


