import React, { useEffect, useState } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
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
# Here comes title - title is optional

## Repaso de las palabras

Pone las palabras en lugar donde partenecen

:::exercise[Help the main character gain some more punds]{type=abc}
El {mozo} del bar caminaba un poco {cojo} por el salón, donde el sol {abrasa} 
desde primera hora.Cerca del {fregadero}, había dejado unas {golosinas}.
:::

## Another book chapter

Here is a paragraph that explain something about something elese or whatever

:::exercise
El {mozo} del hostal despertó temprano, aunque el calor ya {abrasa}ba 
desde el amanecer. Caminaba algo {cojo} por el pasillo, con cuidado de no despertar a los huéspedes que dormían en la {litera} del fondo. 
En la cocina, junto al {fregadero}, dejó una bolsa de {golosinas} para los niños, 
mientras se secaba la frente con una bayeta.

Tenía algo de {panza}, pero también una gran {melena} que le caía por la nuca y un {morro} siempre 
dispuesto a sonreír. Su {lema} era sencillo: vivir sin prisas y no preocuparse por las {nimiedad}es. 
Aunque a veces era un poco {moroso} con el alquiler, decía que todo lo importante ya lo había {adquirido}: 
tranquilidad, tiempo y buen humor.

Al final del día, se sentó en una silla, notando un leve dolor en la {nuca}, y pensó que, 
pese al cansancio, no cambiaría su vida por ninguna otra.
:::

## Another book chapter

:::exercise
El calor {abrasa}ba el {tórax} y la {nuca} de los viajeros que llegaban al hostal al mediodía. 
En el pasillo, un hombre algo {cojo} se apoyaba en la pared, con dolor en el {costado} y la {ingle}, 
consecuencia de una caída {fortuita} semanas atrás.

Dormía en una {litera} antigua, junto a un {catre} mal colocado que siempre {mengua}ba el espacio 
de la habitación. Aun así, no se quejaba por {nimiedad}es. Su {lema} era aceptar cada {menoscabo} 
con calma y sin {desvarío}.

Por la noche, mientras limpiaba el {fregadero} con una {bayeta}, pensó en las cosas que había {adquirido} 
con los años: resistencia, silencio y una extraña paz {diáfana}, pese a las {secuelas} que el 
tiempo deja en el cuerpo.
:::


`;
/**
 * Opens the user's system file dialog prompting to download
 * the given data.
 *
 * @param fileName default name of the saved file. This is what will show up as file name in the user's file dialog.
 * @param data the content of the file.
 * @param mime [mime type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type) of the file
 * @param bom
 */
export function download(
  fileName: string,
  data: string,
  mime = "text/plain",
) {
  const blob = new Blob([data], { type: mime });

  const a = document.createElement("a");

  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 200);
}

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
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        setCode(text);
        renderBook(text);
      }
    };
    reader.readAsText(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  useEffect(() => {
    renderBook(code);
  }, []);

  return (
    <>
      <HeaderComponent />
      <Container>
        <Row className="mb-3">
          <Col>
            <Button>Load sample.</Button>{" "}
            <Button onClick={() => download("fake", code)}>Download</Button>{" "}
            <Button onClick={() => document.getElementById("fileInput")?.click()}>
              Upload
            </Button>{" "}
            <Button onClick={() => setEditor(!editor)}>Toogle Editor</Button>
            <input
              id="fileInput"
              type="file"
              accept=".md,.txt"
              style={{ display: "none" }}
              onChange={onFileInputChange}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col >
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              style={{
                border: isDragging ? "2px dashed #007bff" : "2px dashed #ccc",
                borderRadius: "8px",
                padding: "30px",
                textAlign: "center",
                backgroundColor: isDragging ? "#f8f9fa" : "#fff",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {isDragging ? (
                <span className="text-primary fw-bold">Drop the file here</span>
              ) : (
                <span className="text-muted">
                  Drag & drop a markdown file here, or click to upload
                </span>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          {editor && <Col className="w-50">
            <CodeMirror
              style={{ fontSize: "12px" }}
              onChange={onChange}
              value={code}
              extensions={[
                markdown({ base: markdownLanguage, codeLanguages: languages }),
                EditorView.lineWrapping,
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
