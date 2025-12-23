import { IListBlock, Block, IListItemBlock, IParagraphBlock } from "./bookModel"
import ListGroup from 'react-bootstrap/ListGroup';

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
        return renderParagraph(block as IParagraphBlock)
    }
    if (block.type == "list") {
        return renderListView(block);
    }
    return <p>unable to display block of type: {block.type}</p>

}

export function renderParagraph(block: IParagraphBlock) {
    return <p> {block.text}</p>


}