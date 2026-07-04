import { Question } from '../types';
import { type Card } from 'ts-fsrs';

export const generateSequential = (table: number): Question[] => {
  const up = Array.from({ length: 13 }, (_, i) => ({
    id: `${table}x${i}`,
    a: table,
    b: i,
    answer: table * i
  }));
  const down = Array.from({ length: 12 }, (_, i) => ({
    id: `${table}x${11 - i}`,
    a: table,
    b: 11 - i,
    answer: table * (11 - i)
  }));
  return [...up, ...down];
};

export const generateRandom = (count: number): Question[] => {
  return Array.from({ length: count }, () => {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    return { id: `${a}x${b}`, a, b, answer: a * b };
  });
};

export const generateChallengeFSRS = (
  count: number,
  cards: Record<string, Card>
): Question[] => {
  const allPairs = [];
  for (let a = 1; a <= 12; a++) {
    for (let b = 1; b <= 12; b++) {
      allPairs.push({ id: `${a}x${b}`, a, b, answer: a * b });
    }
  }

  const now = new Date().getTime();

  const weights = allPairs.map(pair => {
    const card = cards[pair.id];
    
    if (!card) {
      return 20; // Unseen problems have decent priority
    }
    
    const dueTime = new Date(card.due).getTime();
    if (dueTime <= now) {
      const daysOverdue = (now - dueTime) / (1000 * 60 * 60 * 24);
      return Math.min(100, 50 + daysOverdue * 10);
    } else {
      return Math.max(1, 10 - card.stability);
    }
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  const result: Question[] = [];
  for (let i = 0; i < count; i++) {
    let r = Math.random() * totalWeight;
    let selected = allPairs[0];
    for (let j = 0; j < allPairs.length; j++) {
      r -= weights[j];
      if (r <= 0) {
        selected = allPairs[j];
        break;
      }
    }
    result.push({ ...selected });
  }
  return result;
};

export const generateDivisionSequential = (divisor: number): Question[] => {
  const up = Array.from({ length: 13 }, (_, quotient) => ({
    id: `${divisor}d${quotient}`, // id format: divisor_d_quotient
    a: divisor * quotient, // Dividend
    b: divisor,            // Divisor
    answer: quotient
  }));
  const down = Array.from({ length: 12 }, (_, i) => {
    const quotient = 11 - i;
    return {
      id: `${divisor}d${quotient}`,
      a: divisor * quotient,
      b: divisor,
      answer: quotient
    };
  });
  return [...up, ...down];
};

export const generateDivisionRandom = (count: number): Question[] => {
  return Array.from({ length: count }, () => {
    const divisor = Math.floor(Math.random() * 12) + 1; // 1 to 12
    const quotient = Math.floor(Math.random() * 13);    // 0 to 12
    return { 
      id: `${divisor}d${quotient}`, 
      a: divisor * quotient, 
      b: divisor, 
      answer: quotient 
    };
  });
};

export const generateDivisionChallengeFSRS = (
  count: number,
  cards: Record<string, Card>
): Question[] => {
  const allPairs = [];
  for (let divisor = 1; divisor <= 12; divisor++) {
    for (let quotient = 0; quotient <= 12; quotient++) {
      allPairs.push({ 
        id: `${divisor}d${quotient}`, 
        a: divisor * quotient, 
        b: divisor, 
        answer: quotient 
      });
    }
  }

  const now = new Date().getTime();

  const weights = allPairs.map(pair => {
    const card = cards[pair.id];
    
    if (!card) {
      return 20; // Unseen problems have decent priority
    }
    
    const dueTime = new Date(card.due).getTime();
    if (dueTime <= now) {
      const daysOverdue = (now - dueTime) / (1000 * 60 * 60 * 24);
      return Math.min(100, 50 + daysOverdue * 10);
    } else {
      return Math.max(1, 10 - card.stability);
    }
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  const result: Question[] = [];
  for (let i = 0; i < count; i++) {
    let r = Math.random() * totalWeight;
    let selected = allPairs[0];
    for (let j = 0; j < allPairs.length; j++) {
      r -= weights[j];
      if (r <= 0) {
        selected = allPairs[j];
        break;
      }
    }
    result.push({ ...selected });
  }
  return result;
};

