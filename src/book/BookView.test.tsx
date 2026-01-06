import { describe, it, expect, vi, beforeEach, afterEach, test } from "vitest";
import BookView from "./BookView";
import { Book } from "./bookModel";
import markdownToBook from "./markdownToBook";

import { render } from 'vitest-browser-react'

const mockBook: Book =  await markdownToBook( `
# Test Book
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

const exerciseFillMissingWords : Book = await markdownToBook(
`
# Test Book
## Chapter 1

:::exercise[put words in the right spots]
En muchas casas el belén {aparecía} de pronto en el salón, y la familia {acomodaba} las figuras en el portal poco a poco hasta el 24 de diciembre. Los niños {descubrían} cada figura con sorpresa, como si fuese la primera vez.
:::

`
)
test('renders FillMissingWords', async () => {
  const { getByText, getByRole } = await render(<BookView book={exerciseFillMissingWords} />)

  await expect.element(getByText('Chapter 1')).toBeInTheDocument()
  await expect.element(getByText('En muchas casas')).toBeInTheDocument()
 // await expect.element(getByText('diciembre.')).toBeInTheDocument()
})

const exerciseVerbQuiz : Book = await markdownToBook(
`
# Test Book
## Chapter 1

:::conjugaction[Instructions for the exercise]{tense=indicativo.presente}
- riecordar
- visitar
- oler
- compartir
:::


`
)
test('renders VerbQuiz', async () => {
  const { getByText, getByRole } = await render(<BookView book={exerciseVerbQuiz} />)

  await expect.element(getByText('Chapter 1')).toBeInTheDocument()
 // await expect.element(getByText('diciembre.')).toBeInTheDocument()
})


const verifyBook : Book = await markdownToBook(
`
# Test Book
## Chapter 1

::::verify
- [x] La familia preparó una gran cena navideña en casa de los abuelos.
- [ ] Todos decidieron pasar la Navidad en la playa tomando el sol.
:::


`
)
test('renders VerifyExercise', async () => {
  const { getByText, getByRole } = await render(<BookView book={verifyBook} />)

  await expect.element(getByText('Chapter 1')).toBeInTheDocument()
 // await expect.element(getByText('diciembre.')).toBeInTheDocument()
})
