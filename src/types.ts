export type GameMode = 'home' | 'sequential' | 'random' | 'challenge' | 'learning';

export interface Question {
  a: number;
  b: number;
  answer: number;
}
