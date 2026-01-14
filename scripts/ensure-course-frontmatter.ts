import { promises as fs } from "node:fs";
import * as path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkStringify from "remark-stringify";
import { extractMarkdownMetadata } from "../src/book/markdownMetadata";

function parseArgs(argv: string[]) {
  const args = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : "true";
    args.set(key, value);
  }
  return args;
}

// Metadata extraction uses the shared unified/AST helper in `src/book/markdownMetadata.ts`.

function titleFromSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function toFrontmatterYaml({
  title,
  file,
  description,
  author = "Unknown",
  level = "",
  category = [],
  tags = [],
}: {
  title: string;
  file: string;
  description: string;
  author?: string;
  level?: string;
  category?: string[];
  tags?: string[];
}): string {
  const descLines = (description || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const descIndented = descLines.map((l) => "    " + l).join("\n");
  const descBlock = descLines.length === 0
    ? "description: |\n    \n"
    : "description: | \n" + descIndented + "\n";

  const catIndented = category.map((c) => "    - " + c).join("\n");
  const catBlock = category.length === 0
    ? "category: []\n"
    : "category:\n" + catIndented + "\n";

  const tagsIndented = tags.map((t) => "  - " + t).join("\n");
  const tagsBlock = tags.length === 0
    ? "tags: []\n"
    : "tags:\n" + tagsIndented + "\n";

  return (
    "---\n" +
    `title: ${title}\n` +
    `author: ${author}\n` +
    (level ? `level: ${level}\n` : "level: \n") +
    `file: ${file}\n` +
    descBlock +
    catBlock +
    tagsBlock +
    "\n---\n\n"
  );
}

async function removeLeadingH1IfRedundant(markdown: string, title: string): Promise<string> {
  const processor = unified().use(remarkParse).use(remarkFrontmatter).use(remarkStringify);
  const tree = await processor.run(processor.parse(markdown));
  const children: any[] = (tree as any).children ?? [];
  const firstHeadingNode = children.find((n) => n.type === "heading") ?? null;
  if (!firstHeadingNode) return markdown;
  if (firstHeadingNode.depth !== 1) return markdown;
  if (String(processor.stringify(firstHeadingNode)).replace(/\s+$/, "").replace(/^#+\s+/, "") !== title) {
    return markdown;
  }

  // Remove the first heading node from the root
  const idx = children.findIndex((n) => n.type === "heading");
  if (idx >= 0) children.splice(idx, 1);

  return String(processor.stringify(tree as any)).replace(/^\s*\n/, "");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = args.get("root") || path.join(process.cwd(), "public", "courses");
  const course = args.get("course");
  if (!course) {
    // eslint-disable-next-line no-console
    console.error('Missing required "--course", e.g. --course es01');
    process.exit(1);
  }

  const courseDir = path.join(root, course);
  const entries = await fs.readdir(courseDir, { withFileTypes: true });
  const mdFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  let updated = 0;
  let skipped = 0;

  for (const fileName of mdFiles) {
    const filePath = path.join(courseDir, fileName);
    const slug = fileName.replace(/\.md$/i, "");
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = await extractMarkdownMetadata(raw);

    if (parsed.hasFrontmatter) {
      skipped += 1;
      continue;
    }

    const title = parsed.firstHeading ?? titleFromSlug(slug);
    const description = parsed.firstParagraph ?? "";

    const fm = toFrontmatterYaml({
      title,
      file: fileName,
      description,
      author: "Unknown",
      level: "",
      category: [],
      tags: [],
    });

    const cleanedBody = await removeLeadingH1IfRedundant(raw, title);
    await fs.writeFile(filePath, fm + cleanedBody.replace(/^\s*\n/, ""), "utf8");
    updated += 1;
  }

  // eslint-disable-next-line no-console
  console.log(
    `Frontmatter ensured for course ${course}: updated ${updated}, skipped ${skipped} (already had frontmatter).`
  );
}

main();


