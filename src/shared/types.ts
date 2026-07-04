export type GameMode = 'home' | 'sequential' | 'random' | 'challenge' | 'learning';

export interface Question {
  id?: string;
  a: number | string;
  b?: number | string;
  answer: number | string;
  fractionType?: 'visual' | 'simplification' | 'improperToMixed' | 'mixedToImproper' | 'decimal';
}
