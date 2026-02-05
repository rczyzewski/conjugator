import type { YoutubeNode } from './youtube-node';
import type { ConjugationNode } from './conjugation-node'; 

declare module 'mdast' {
  interface RootContentMap {
    youtube: YoutubeNode;
    conjugation  : ConjugationNode;
  }
}
