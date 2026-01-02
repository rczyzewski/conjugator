import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRoot, Root } from "react-dom/client";
import BookLoader from "./BookLoader";
import { Book } from "./bookModel";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useParams: vi.fn(() => ({ course: "es01", chapter: "food" })),
}));

// Mock markdownToBook
vi.mock("./markdownToBook", () => ({
  default: vi.fn(async () => {
    return {
      title: "Test Book",
      chapters: [],
    } as Book;
  }),
}));

describe("BookLoader", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    vi.resetAllMocks();
    root.unmount();
    document.body.removeChild(container);
  });

  it("should render spinner initially and then BookView after fetch", async () => {
    const mockMarkdown = "# Test Book\n## Chapter 1\nSome content";
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      text: async () => mockMarkdown,
    });

    root.render(<BookLoader />);

    // Initially should show spinner
    expect(container.querySelector(".spinner-border")).toBeTruthy();

    // Wait for fetch to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // After fetch, should render BookView (no spinner)
    expect(container.querySelector(".spinner-border")).toBeFalsy();
  });
});

