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


Figure out where the missing word should be 

:::exercise[put words in the right spots]
Tras el {fortuito} encuentro, quedó un leve {menoscabo} en su ánimo. No fue una {nimiedad}, sino un {desvarío} que dejó {secuelas}. Aun así, mantuvo un gesto {altivo}, comió de forma {frugal} y evitó cualquier {carcajada}. En sus ojos brilló un débil {fulgor}, mientras la {escarcha} cubría la calle.
:::

Now let's train a litle bit conjugaction

:::conjugaction[Instructions for the exercise]{tense=indicativo.presente}
* ser
* estar
* tener
* comer
* vivir
* leer
* hablar
* escribir
:::

Now let's play true or false

::::verify[find true or false statments]{property1=333, property2=value2}
  [x] Perros son mejor que los gtos.
  [x] La piedra gana tijeras.
  [x] Tijeras ganan papel.
  [ ] Piedra gana papel
::::

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
