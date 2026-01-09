import React, { useEffect, useState } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import HeaderComponent from "../../components/HeaderComponent";
import BookView from "../../book/BookView";
import { Book } from "../../book/bookModel";
import markdownToBook from "../../book/markdownToBook";
import { fetchBook } from "../../book/BookLoader";
import { PUBLIC_URL } from "../conjugacion/VerbsService";
export const test = `
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

export default function CodeEditor({ myMarkdown }: { readonly myMarkdown: string }) {

  async function renderBook(code: string) {
    const book = await markdownToBook(code)
    setBook(book);
  }

  const onChange = React.useCallback(async (val: string) => {
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
            <Button className="m-1" onClick={async () => {
              const url = `${PUBLIC_URL}/courses/sample/book_tutorial.md`
              const bookRawContent = await fetchBook(url)
              setCode(bookRawContent)
              renderBook(bookRawContent)
            }}>Load sample</Button>
            <Button className="m-1" onClick={() => download(book?.metadata?.file || 'book.md', code)}>Download</Button>
            <Button className="m-1" onClick={() => document.getElementById("fileInput")?.click()}>Upload</Button>
            <Button className="m-1" onClick={() => setEditor(!editor)}>Toogle Editor</Button>
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
            <Container
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
                display: "none"
              }}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {isDragging ? (
                <span className="text-primary fw-bold">Drop the file here</span>
              ) : (
                <span className="text-muted" >
                  Drag & drop a markdown file here, or click to upload
                </span>
              )}
            </Container>
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
