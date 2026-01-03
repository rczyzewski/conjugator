import { JSX } from "react";
import { IListBlock, Block, IListItemBlock, IParagraphBlock, TextRegular, ParagraphText, TextInlineCode, TextStrong, IQuoteBlock, ICodeBlock, ITableBlock } from "./bookModel"
import ListGroup from 'react-bootstrap/ListGroup';
import Table from "react-bootstrap/Table";
import Alert from 'react-bootstrap/Alert';
import { BiInfoCircle } from "react-icons/bi";
import { PiWarningLight } from "react-icons/pi";

export function renderListView(block: IListBlock) {
    return <ListGroup numbered={block.ordered} className="p-2">
        {block.items.map((item, itemIndex) => (<ListGroup.Item key={itemIndex} as="li">
            {
                renderBlockView(item)
            }
        </ListGroup.Item>))}
    </ListGroup>
}

export function renderBlockView(block: IListItemBlock) {
    return block.items.map(it => renderBlock(it))
}

export function renderBlock(block: Block) {
    if (block.type == "paragraph") {
        return renderParagraph(block )
    }
    if (block.type == "list") {
        return renderListView(block);
    }
    if ( block.type == "blockquote")
            return renderBlockQuote(block) 
    
    if (block.type == "code") {
        return renderCode(block);
    }
    if (block.type == "table") {
        return renderTable(block);
    }

    return <p>unable to display block of type: {block.type}</p>

}
function renderCode(a : ICodeBlock){

  return <Alert variant="warning">
   <h3> <PiWarningLight/></h3>
    <code><pre>{a.text}</pre></code>
  </Alert>
}


export function renderParagraph(block: IParagraphBlock) {
      
     return <p> { block.text.map( renderText)     }</p>
}
export function renderBlockQuote(block: IQuoteBlock) {
      
     return <Alert className="fade alert alert-info show" style={{ backgroundColor: "AA1111"}}> 
     <h3><BiInfoCircle></BiInfoCircle></h3>
     { block.text.map(  renderBlock)     }</Alert>
        


}

export function renderText(text: ParagraphText): JSX.Element{
    if( text instanceof TextRegular ) return <span>{text.text}</span>
    if( text instanceof TextInlineCode) return <code>{text.text}</code>
    if( text instanceof TextStrong) return <span className="fw-bold">{text.text}</span>
return <p>Don't know what to display { JSON.stringify(text)}</p>

}

export function renderTable(table: ITableBlock){


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