import { JSX } from "react";
import {  TextRegular, ParagraphText, TextInlineCode, TextStrong,   ParagraphBlock, ListBlock, QuoteBlock, ListItemBlock, TableBlock, CodeBlock, ContentBlock, TextSpecial, TextCluedSpecial, TextEmphasis, TextLink, TextImage, YouTubeBlock, HeadingBlock } from "./bookModel"
import ListGroup from 'react-bootstrap/ListGroup';
import Table from "react-bootstrap/Table";
import Alert from 'react-bootstrap/Alert';
import { BiInfoCircle } from "react-icons/bi";
import { PiWarningLight } from "react-icons/pi";
import Button from "react-bootstrap/Button";

function hashString(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

  export function renderBlock(block: ContentBlock): JSX.Element  {
    if (block instanceof HeadingBlock) {
      return renderHeading(block);
    }
    if (block instanceof ParagraphBlock) {
        return renderParagraph(block )
    }
      if(block instanceof YouTubeBlock) { 
      const url = "https://www.youtube.com/embed/" + block.videoId;
      return <iframe title={`YouTube video ${block.videoId}`} src={url}>Texto del vídeo</iframe>
      }
    if (block instanceof ListBlock) {
        return renderListView(block);
    }
    if ( block instanceof QuoteBlock)
            return renderBlockQuote(block) 
    if (block instanceof CodeBlock) {
        return renderCode(block);
    }
    
    if (block instanceof ListItemBlock) {
        return renderListItem(block);
    }
    if (block instanceof TableBlock) {
        return renderTable(block);
    }

    return <p>unable to display block of type</p>

}

function renderHeading(h: HeadingBlock): JSX.Element {
  const level = Math.min(Math.max(h.depth, 1), 6);
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Tag id={h.anchorId} style={{ scrollMarginTop: "1rem" }}>
      {h.text.map(renderText)}
    </Tag>
  );
}

function renderCode(a : CodeBlock){

  return <Alert variant="warning">
    <code>
        <PiWarningLight size={25} className="mx-3" />
        {a.code}
    </code>
  </Alert>
}

export function renderListView(block: ListBlock) {
    return <ListGroup numbered={block.ordered} className=" list-group-flush" style={{ listStyle: "square", listStyleType: "circle"}}>
        {block.items.map((item, itemIndex) => (<ListGroup.Item key={hashString(item.getText().map((t: any) => t?.text ?? "").join("") + `-${itemIndex}`)} className="m-0" as="li">
            {
                renderListItem(item)
            }
        </ListGroup.Item>))}
    </ListGroup>
}

export function renderListItem(block: ListItemBlock) : JSX.Element  {
    return <>{block.items.map(it => renderBlock(it))}</>
}

export function renderParagraph(block: ParagraphBlock) {
     return <p> { block.text.map( renderText)     }</p>
}
export function renderBlockQuote(block: QuoteBlock) {
  return <Alert className="fade alert alert-info show" >
    <BiInfoCircle size={25} className="mx-3" style={{float: "left"}}/>
    {block.text.map(renderBlock)}
  </Alert>

}

export function renderText(text: ParagraphText): JSX.Element{
    if( text instanceof TextRegular ) return <span>{text.text}</span>
    if( text instanceof TextEmphasis ) return <i>{text.text}</i>
    if( text instanceof TextImage ) return <img src={text.url} alt={text.text} />
    if( text instanceof TextInlineCode) return <code>{text.text}</code>
    if( text instanceof TextLink) return <a href={text.url}>{text.children.map(it=>renderText(it))}</a>
    if( text instanceof TextStrong) return <span className="fw-bold">{text.text}</span>
    if( text instanceof TextSpecial) 
      return  <Button className='p-0 m-1' variant={"info"} >{text.text}</Button>
    if( text instanceof TextCluedSpecial)
      return <Button className='p-0 m-1' variant={"info"} title={text.clue}>{text.text}</Button>

return <p>Don't know what to display { JSON.stringify(text)}</p>

}

export function renderTable(table: TableBlock){
                 return (
                   <Table  striped bordered hover>
                     <thead>
                      <tr>
                         {table.headers.map((header, headerIndex) => (
                           <th key={hashString(header.getText().map((t: any)=>t?.text ?? "").join("") + `-${headerIndex}`)}>{renderBlock(header)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, rowIndex) => (
                        <tr key={hashString(row.map((cell)=>cell.getText().map((t: any)=>t?.text ?? "").join("")).join("|") + `-${rowIndex}`)}>
                          {row.map((cell, cellIndex) => (
                            <td key={hashString(cell.getText().map((t: any)=>t?.text ?? "").join("") + `-${rowIndex}-${cellIndex}`)}>{renderBlock(cell)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                );

            }