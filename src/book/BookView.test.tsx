import { describe, it, expect, vi, beforeEach, afterEach, test } from "vitest";
import BookView from "./BookView";
import { Book } from "./bookModel";
import markdownToBook from "./markdownToBook";

import { render } from 'vitest-browser-react'

     const mockBook: Book =  await markdownToBook( `# Test Book
## Chapter 1
Some content


## Chapter 2
More content
`);

test('renders name', async () => {
  const { getByText, getByRole } = await render(<BookView book={mockBook} />)

  await expect.element(getByText('Some content')).toBeInTheDocument()
  await expect.element(getByText('More content')).toBeInTheDocument()
})


