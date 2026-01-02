import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRoot, Root } from "react-dom/client";
import BookView from "./BookView";
import { Book } from "./bookModel";
import markdownToBook from "./markdownToBook";

describe("BookView", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    vi.resetAllMocks();
    root.unmount();
    document.body.removeChild(container);
  });

  it("should render book title and chapters", async () => {

    const mockBook: Book =  await markdownToBook( `# Test Book
## Chapter 1
Some content


## Chapter 2
More content
`);

    root.render(<BookView book={mockBook} />);

    // Check that book title is rendered
    const titleElement = container.querySelector("h2");
    expect(titleElement?.textContent).toBe("Test Book");

    // Check that chapters are rendered
    const chapterTitles = container.querySelectorAll("h3");
    expect(chapterTitles.length).toBe(2);
    expect(chapterTitles[0]?.textContent).toBe("1. Chapter 1");
    expect(chapterTitles[1]?.textContent).toBe("2. Chapter 2");
  });

});

