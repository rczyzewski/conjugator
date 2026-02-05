import type { Parent } from 'mdast';

export interface YoutubeNode extends Parent {
  type: 'youtube';
  videoId: string;
  title?: string;
  children: [];
}
