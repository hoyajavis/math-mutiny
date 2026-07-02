import { Question } from '../types';

export const generateSequential = (table: number): Question[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    a: table,
    b: i + 1,
    answer: table * (i + 1)
  }));
};

export const generateRandom = (count: number): Question[] => {
  return Array.from({ length: count }, () => {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    return { a, b, answer: a * b };
  });
};
