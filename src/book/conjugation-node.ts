import type { Parent } from 'mdast';

export interface ConjugationNode extends Parent {
  type: 'conjugation';
  tenses: string[];
  verbs : string[]
}
