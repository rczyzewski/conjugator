import { Plugin } from "unified";

import type { Parent } from "unist";
import { visit } from "unist-util-visit";

export const remarkExerciseDirective: Plugin = () => {
  return (tree) => {
    visit(
      tree,
      "containerDirective",
      (node: any, index: number, parent: Parent | undefined) => {
        if (!parent || index === null) return;
        if (
          node.name !== "exercise" &&
          node.name !== "conjugaction"  &&
          node.name !== "verify" 
        )
          return;

        // Extract instructions from first child if it's a paragraph with directiveLabel
        let instructions = node.label || "";
        let contentChildren = node.children ?? [];

        if (node.children && node.children.length > 0) {
          const firstChild = node.children[0];
          if (
            firstChild.type === "paragraph" &&
            firstChild.data?.directiveLabel
          ) {
            // Extract text from the directive label paragraph
            instructions =
              firstChild.children?.map((c: any) => c.value ?? "").join("") ??
              "";
            // Use remaining children for content (skip the first one)
            contentChildren = node.children.slice(1);
          }
        }

        const paragraph = {
          type: node.name,
          data: {
            hName: "exercise",
            hProperties: node.attributes || {},
            instructions: instructions,
          },
          children: contentChildren,
        };

        parent.children.splice(index, 1, paragraph);
      }
    );
  };
};


