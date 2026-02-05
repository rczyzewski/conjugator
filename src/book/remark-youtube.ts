import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { YoutubeNode } from './youtube-node';



const remarkYoutube: Plugin = () => {
  return (tree) => {
    visit(tree, 'containerDirective', (node: any, index , parent) => {
      if (node.name !== 'youtube') return;

      const videoId = node.attributes?.id;
      if (!videoId) return;
 
    
      const title =
      node.children?.[0]?.children?.[0]?.value;

    const youtubeNode: YoutubeNode = {
      type: 'youtube',
      videoId,
      title,
      children: [],
    };    

    parent.children.splice(index, 1, youtubeNode);

    });
  };
};

export default remarkYoutube;
