import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Text } from 'mdast';
import type { SpecialText } from './special-text';

const SPECIAL_RE = /\{([^}]+)\}/g;

declare module 'mdast' {
    interface PhrasingContentMap {
      specialText: SpecialText;
    }
  }


const remarkSpecialText: Plugin = () => {
  return (tree) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index == null) return;

      const value = node.value;
      let match;
      let lastIndex = 0;

      const nodes = [];

      while ((match = SPECIAL_RE.exec(value))) {
        if (match.index > lastIndex) {
          nodes.push({
            type: 'text',
            value: value.slice(lastIndex, match.index),
          });
        }

        const specialNode: SpecialText = {
          type: 'specialText',
          value: match[1],
        };

        nodes.push(specialNode);
        lastIndex = match.index + match[0].length;
      }

      if (nodes.length === 0) return;

      if (lastIndex < value.length) {
        nodes.push({
          type: 'text',
          value: value.slice(lastIndex),
        });
      }

      (parent as any).children.splice(index, 1, ...nodes);
      return index + nodes.length;
    });
  };
};

export default remarkSpecialText;
