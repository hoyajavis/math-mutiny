import { ReactNode } from 'react';

export type GameMode = 'home' | 'sequential' | 'random' | 'challenge' | 'learning';

export type Question = 
  | { type: 'arithmetic'; id: string; a: number; b: number; answer: number; operator: string }
  | { type: 'fraction'; id: string; fractionType: 'visual' | 'simplification' | 'improperToMixed' | 'mixedToImproper' | 'decimal'; a: string; b?: string; answer: string; shaded?: number; total?: number };

export interface AppConfig {
  appId: 'multiplication' | 'division' | 'fractions';
  title: string;
  theme: {
    primaryBg: string;
    primaryText: string;
    primaryBorder: string;
    buttonBg: string;
    buttonHoverShadow: string;
    buttonShadow: string;
  };
  skills: { id: string | number; label: string; prefix: string }[];
  generateQuestions: (mode: GameMode, skillId?: string | number, cardsRecord?: Record<string, import('ts-fsrs').Card>) => Question[];
  bosses: {
    name: string;
    hp: number;
    taunts: string[];
    hitMessages: string[];
    defeatedMessage: string;
  }[];
  tips: { id: string | number; title: string; text: string; visual: string; graphic?: ReactNode }[];
  sarcasm: {
    idle: string[];
    correct: string[];
    incorrect: string[];
  };
}
