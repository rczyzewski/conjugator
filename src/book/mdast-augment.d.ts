import type { YoutubeNode } from './youtube-node';

declare module 'mdast' {
  interface RootContentMap {
    youtube: YoutubeNode;
  }
}
