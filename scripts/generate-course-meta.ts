import { promises as fs } from "node:fs";
import * as path from "node:path";
import { extractMarkdownMetadata } from "../src/book/markdownMetadata";

type ChapterMeta = {
  readonly slug: string;
  readonly file: string;
  readonly title: string;
  readonly description?: string;
  readonly href: string;
  readonly updatedAt: string;
  readonly hasContent: boolean;
  readonly level?: string;
  readonly category?: string[];
  readonly tags?: string[];
  readonly image?: string;
  readonly order?: number;
};

type CourseMeta = {
  readonly courseId: string;
  readonly generatedAt: string;
  readonly chapters: ChapterMeta[];
};

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

function titleFromSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// unified/AST parsing lives in `src/book/markdownMetadata.ts` to match the web pipeline.

async function generateForCourseDir(courseDir: string): Promise<CourseMeta | null> {
  const courseId = path.basename(courseDir);
  const entries = await fs.readdir(courseDir, { withFileTypes: true });
  const mdFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  if (mdFiles.length === 0) return null;

  const chapters: ChapterMeta[] = [];

  for (const fileName of mdFiles) {
    const filePath = path.join(courseDir, fileName);
    const slug = fileName.replace(/\.md$/i, "");
    const raw = await fs.readFile(filePath, "utf8");
    const stat = await fs.stat(filePath);

    const parsed = await extractMarkdownMetadata(raw);

    const title =
      (parsed.frontmatter?.title as string | undefined) ??
      parsed.firstHeading ??
      titleFromSlug(slug);
    const description =
      (parsed.frontmatter?.description as string | undefined) ??
      parsed.firstParagraph ??
      undefined;

    const image = (parsed.frontmatter?.image as string | undefined) ?? undefined;
    const level = (parsed.frontmatter?.level as string | undefined) ?? undefined;
    const category = (parsed.frontmatter?.category as string[] | undefined) ?? undefined;
    const tags = (parsed.frontmatter?.tags as string[] | undefined) ?? undefined;
    const order =
      typeof parsed.frontmatter?.order === "number"
        ? (parsed.frontmatter.order as number)
        : undefined;

    chapters.push({
      slug,
      file: fileName,
      title,
      description,
      level,
      category,
      tags,
      image,
      order,
      href: `/course/${courseId}/chapter/${slug}`,
      updatedAt: stat.mtime.toISOString(),
      hasContent: parsed.hasContent,
    });
  }

  // If any `order` is present, sort by it then by slug.
  const anyOrder = chapters.some((c) => typeof c.order === "number");
  const sorted = anyOrder
    ? [...chapters].sort((a, b) => {
        const ao = a.order ?? Number.MAX_SAFE_INTEGER;
        const bo = b.order ?? Number.MAX_SAFE_INTEGER;
        if (ao !== bo) return ao - bo;
        return a.slug.localeCompare(b.slug);
      })
    : chapters;

  return {
    courseId,
    generatedAt: new Date().toISOString(),
    chapters: sorted,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = args.get("root") || path.join(process.cwd(), "public", "courses");

  const onlyCourse = args.get("course"); // optional: es01
  const outName = args.get("out") || "meta.json";

  const courseDirs = onlyCourse
    ? [path.join(root, onlyCourse)]
    : (await fs.readdir(root, { withFileTypes: true }))
        .filter((e) => e.isDirectory())
        .map((e) => path.join(root, e.name))
        .filter((p) => path.basename(p) !== "sample");

  const results: Array<{ dir: string; meta: CourseMeta }> = [];

  for (const dir of courseDirs) {
    try {
      const meta = await generateForCourseDir(dir);
      if (!meta) continue;
      const outPath = path.join(dir, outName);
      await fs.writeFile(outPath, JSON.stringify(meta, null, 2) + "\n", "utf8");
      results.push({ dir, meta });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Failed to generate meta for ${dir}:`, e);
      process.exitCode = 1;
    }
  }

  // eslint-disable-next-line no-console
  console.log(
    `Generated ${outName} for ${results.length} course(s):\n` +
      results.map((r) => `- ${path.basename(r.dir)} (${r.meta.chapters.length} chapters)`).join("\n")
  );
}

main();


