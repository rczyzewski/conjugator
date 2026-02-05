import { Book }  from "./bookModel"

import { JSX, useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import BookView from "./BookView";
import markdownToBook from "./markdownToBook";
import { useParams } from "react-router-dom";

import { PUBLIC_URL } from "../pages/conjugation/VerbsService";
import HeaderComponent from "../components/HeaderComponent";
import Container from "react-bootstrap/esm/Container";

export function fetchBook(url:string):Promise<string>{

    return fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Error en ${url}`);
        return res.text();
      })


}
export default function BookLoader(): JSX.Element {
  const [book, setBook] = useState<Book | null>(null)
    let params = useParams();
    const chapter = params.chapter;
    const course = params.course;
  
  useEffect(() => {

    // BASE_URL-safe join (PUBLIC_URL may already include a trailing slash)
    const base = PUBLIC_URL.endsWith("/") ? PUBLIC_URL.slice(0, -1) : PUBLIC_URL;
    const url = `${base}/courses/${course}/${chapter}.md`
      fetchBook(url)
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
