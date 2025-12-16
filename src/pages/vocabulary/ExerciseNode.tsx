import { Plugin } from 'unified'


import type { Parent, Node } from 'unist'
import { visit } from 'unist-util-visit'


export interface ExerciseInlineNode extends Node {
    type: 'exerciseInline'
    options: string[]
  }

  
  const remarkExerciseDirective: Plugin = () => {
    return (tree) => {
      visit(tree, 'containerDirective', (node: any, index: number, parent: Parent | undefined) => {
        if (!parent || index === null) return
        if (node.name !== 'exercise') return
  
        const paragraph = {
          type: 'exercise',
          data: {
            hName: 'exercise',
            hProperties: node.attributes || {},
          },
          children: node.children ?? [],
        }
  
        parent.children.splice(index, 1, paragraph)
      })
    }
  }
  
export default remarkExerciseDirective