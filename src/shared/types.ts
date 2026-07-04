export type GameMode = 'home' | 'sequential' | 'random' | 'challenge' | 'learning';

export interface Question {
  id?: string;
  a: number;
  b: number;
  answer: number;
}
