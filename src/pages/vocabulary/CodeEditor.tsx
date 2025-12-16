import React, { useEffect, useState } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import  Button  from "react-bootstrap/Button"
import  Col  from "react-bootstrap/Col"
import  Container from "react-bootstrap/Container"
import  Row from "react-bootstrap/Row"
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkExercise from "./ExerciseNode";
import remarkDirective from "remark-directive";
import HeaderComponent from "../../components/HeaderComponent";
import BookView from "./BookView";
import { astToBook } from "./astToBook";
import { Root } from "mdast";
import { Book } from "./bookModel";

export const test = `
# Classes de español

## Repaso de las palabras

Pone las palabras en lugar donde partenecen

:::exercise
El {mozo} del bar caminaba un poco {cojo} por el salón, donde el sol {abrasa} desde primera hora.
Cerca del {fregadero}, había dejado unas {golosinas} para los niños que dormían en la {litera} del fondo.
Tenía {panza}, pero una {melena} espesa y una sonrisa amplia en el {morro}.
Su {lema} era claro: vivir con calma, aunque fuera {moroso} con el tiempo,
y disfrutar de cada {nimiedad} que había {adquirido} con los años.
:::

## Another book chapter

Here is a paragraph that explain something about something elese or whatever

:::exercise

El {mozo} del hostal despertó temprano, aunque el calor ya {abrasa}ba desde el amanecer. Caminaba algo {cojo} por el pasillo, con cuidado de no despertar a los huéspedes que dormían en la {litera} del fondo. En la cocina, junto al {fregadero}, dejó una bolsa de {golosinas} para los niños, mientras se secaba la frente con una bayeta.

Tenía algo de {panza}, pero también una gran {melena} que le caía por la nuca y un {morro} siempre dispuesto a sonreír. Su {lema} era sencillo: vivir sin prisas y no preocuparse por las {nimiedad}es. Aunque a veces era un poco {moroso} con el alquiler, decía que todo lo importante ya lo había {adquirido}: tranquilidad, tiempo y buen humor.

Al final del día, se sentó en una silla, notando un leve dolor en la {nuca}, y pensó que, pese al cansancio, no cambiaría su vida por ninguna otra.
:::

## Another book chapter

Some other text
Some other text goes here.
Something


:::exercise
El calor {abrasa}ba el {tórax} y la {nuca} de los viajeros que llegaban al hostal al mediodía. En el pasillo, un hombre algo {cojo} se apoyaba en la pared, con dolor en el {costado} y la {ingle}, consecuencia de una caída {fortuita} semanas atrás.

Dormía en una {litera} antigua, junto a un {catre} mal colocado que siempre {mengua}ba el espacio de la habitación. Aun así, no se quejaba por {nimiedad}es. Su {lema} era aceptar cada {menoscabo} con calma y sin {desvarío}.

Por la noche, mientras limpiaba el {fregadero} con una {bayeta}, pensó en las cosas que había {adquirido} con los años: resistencia, silencio y una extraña paz {diáfana}, pese a las {secuelas} que el tiempo deja en el cuerpo.
:::


`;

export default function CodeEditor({ myMarkdown }: { myMarkdown: string }) {
  async function renderBook(code: string) {
    const processor = unified()
      .use(remarkParse)
      .use(remarkDirective)
      .use(remarkExercise);

    const tree = processor.parse(code);
    const transformedTree = await processor.run(tree);

    console.log(transformedTree);

    //   if ( transformedTree typeof Root)
    const book = astToBook(transformedTree as Root);
    setBook(book);
  }

  const onChange = React.useCallback(async (val: string) => {
    // console.log('val:', val);
    setCode(val);
    renderBook(val);
  }, []);

  const [code, setCode] = useState<string>(myMarkdown);
  const [book, setBook] = useState<Book | null>(null);
  const [editor, setEditor] = useState<boolean>(false);

  useEffect(() => {
    renderBook(code);
  }, []);

  return (
    <>
      <HeaderComponent />
      <Container>
        <Row>
        <Col>
            <Button>Load sample.</Button> <Button>Download</Button> <Button>Upload</Button> <Button onClick={()=> setEditor(!editor)}>Toogle Editor</Button>
        
        </Col>
        </Row>
        <Row>
          {editor && <Col className="">
            <CodeMirror
              maxWidth="800px"
              onChange={onChange}
              value={code}
              extensions={[
                markdown({ base: markdownLanguage, codeLanguages: languages }),
              ]}
            />
          </Col>}
          <Col>
            <Container>
              {" "}
              {book == null ? (
                <code>No content yet</code>
              ) : (
                <BookView book={book} />
              )}{" "}
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}
