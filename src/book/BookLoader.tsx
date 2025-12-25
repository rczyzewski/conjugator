import { Book }  from "./bookModel"

import { JSX, useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import BookView from "./BookView";
import markdownToBook from "./markdownToBook";
import { useParams } from "react-router-dom";

import { PUBLIC_URL } from "../pages/conjugacion/VerbsService";
import HeaderComponent from "../components/HeaderComponent";
import Container from "react-bootstrap/esm/Container";

export default function BookLoader(): JSX.Element {
  const [book, setBook] = useState<Book | null>(null)
    let params = useParams();
    const chapter = params.chapter;
    const course = params.course;
  
  useEffect(() => {

    const url = `${PUBLIC_URL}/courses/${course}/${chapter}.md`

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Error en ${url}`);
        return res.text();
      })
      .then((res) => markdownToBook(res))
      .then(res => setBook(res))

  }, [])

  return (
    <>
      <HeaderComponent />
      <Container>
        {book ? <BookView book={book} /> : <Spinner animation="border" size="sm" />}
      </Container>
    </>
  );

}
