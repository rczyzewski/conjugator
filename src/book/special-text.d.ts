import type { Literal } from 'mdast';

export interface SpecialText extends Literal {
  type: 'specialText';
  value: string;
}


