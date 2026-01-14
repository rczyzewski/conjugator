
import { expect, test } from "vitest";

import { render } from 'vitest-browser-react'
import VerbConjugateExercise from "./VerbConjugateExercise";


test('renders name', async () => {
  const { getByText } = await render(<VerbConjugateExercise title="STH" words={["ser"]} tenses={["preterito"]} />)

  await expect.element(getByText('Check')).toBeInTheDocument()

})