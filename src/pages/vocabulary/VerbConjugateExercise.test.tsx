
import { describe, it, expect, vi, beforeEach, afterEach, test } from "vitest";

import { render } from 'vitest-browser-react'
import { Book } from "../../book/bookModel";
import markdownToBook from "../../book/markdownToBook";
import VerbConjugateExercise from "./VerbConjugateExercise";

const mockBook: Book =  await markdownToBook( `
# Test Book
## Chapter 1
Some content


## Chapter 2
More content
`);


test('renders name', async () => {
  const { getByText, getByRole } = await render(<VerbConjugateExercise title="STH" words={["ser"]} tenses={["preterito"]} />)

  await expect.element(getByText('Check')).toBeInTheDocument()

})