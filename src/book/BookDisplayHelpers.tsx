import { JSX } from "react";
import {  TextRegular, ParagraphText, TextInlineCode, TextStrong,   ParagraphBlock, ListBlock, QuoteBlock, ListItemBlock, TableBlock, CodeBlock, ContentBlock } from "./bookModel"
import ListGroup from 'react-bootstrap/ListGroup';
import Table from "react-bootstrap/Table";
import Alert from 'react-bootstrap/Alert';
import { BiInfoCircle } from "react-icons/bi";
import { PiWarningLight } from "react-icons/pi";


export function renderBlock(block: ContentBlock): JSX.Element  {
    if (block instanceof ParagraphBlock) {
        return renderParagraph(block )
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
        {block.items.map((item, itemIndex) => (<ListGroup.Item key={itemIndex} className="m-0" as="li">
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
    if( text instanceof TextInlineCode) return <code>{text.text}</code>
    if( text instanceof TextStrong) return <span className="fw-bold">{text.text}</span>
return <p>Don't know what to display { JSON.stringify(text)}</p>

}

export function renderTable(table: TableBlock){
                 return (
                   <Table  striped bordered hover>
                     <thead>
                      <tr>
                         {table.headers.map((header, headerIndex) => (
                           <th key={headerIndex}>{renderBlock(header)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{renderBlock(cell)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                );

            }