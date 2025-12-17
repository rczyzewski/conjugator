import { Book } from "./bookModel"
import FillMissingWords from "./FillMissingWords";

export default function BookView({ book }: { book: Book }) {
    console.log(book);
    return (
      <div>
        <h1>{book.title}</h1>
  
        {book.chapters.map((chapter, i) => (
          <section key={i}>
            <h2>{chapter.title}</h2>
  
            {chapter.blocks.map((block, j) => {
              if (block.type === 'paragraph') {
                return <p key={j}>{block.text}</p>
              }
  
              if (block.type === 'exercise') {
                return (
               <FillMissingWords paragraphs={block.content}/>
                )
              }
            })}
          </section>
        ))}
      </div>
    )
  }
  