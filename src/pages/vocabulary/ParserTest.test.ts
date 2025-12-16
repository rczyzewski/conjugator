import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkDirective from "remark-directive";


describe("VerbsService", () => {
  beforeEach(() => {
    // globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Testing getting URLs", async () => {
    const md = `## Title

:::exercise
    Hola mundo
:::

text
`;

    const processor = unified().use(remarkParse).use(remarkDirective);

    const tree = processor.parse(md);

    const transformed = await processor.run(tree)

    console.log("tree", tree);
    console.log("transfomred:", transformed);
    expect(transformed).exist
  });
});
