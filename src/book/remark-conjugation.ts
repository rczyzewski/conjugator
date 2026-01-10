import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { ConjugationNode } from './conjugation-node';

import { parse as yamlParse } from "yaml";


const remarkConjugation: Plugin = () => {
  return (tree) => {
    visit(tree, "containerDirective", (node: any, index, parent) => {
      if (node.name !== "conjugation") return;

      // Extract only the YAML content, excluding the label
      
      
      const f = node.children.filter((it: any) =>it.type === "code")
                .filter((it: any )=> it.lang === "yaml")[0]

      const ddd = yamlParse(f.value);
      const conjugactionNode: ConjugationNode = {
        type: "conjugation",
        ...ddd,
      };

      parent.children.splice(index, 1, conjugactionNode);
    });
  };
};

export default remarkConjugation;
