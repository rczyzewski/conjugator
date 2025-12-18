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

:::exercise[dddd]{h=333}
    Hola mundo
:::

text
`;

    const processor = unified().use(remarkParse).use(remarkDirective);

    const tree = processor.parse(md);

    const transformed = await processor.run(tree)

    expect(transformed).exist
  });
});
