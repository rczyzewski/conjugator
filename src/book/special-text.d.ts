import type { Literal } from 'mdast';

export interface SpecialText extends Literal {
  type: 'specialText';
  value: string;
}

export interface CluedText extends Literal {
  type: 'cluedText';
  value: string;
  clue: string;
}


