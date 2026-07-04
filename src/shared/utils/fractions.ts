import { Question } from '../types';
import { type Card } from 'ts-fsrs';

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

export const generateVisualFacts = (count: number): Question[] => {
  return Array.from({ length: count }, () => {
    const d = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const n = Math.floor(Math.random() * (d - 1)) + 1; // 1 to d-1
    return {
      id: `vis_${n}_${d}`,
      fractionType: 'visual',
      a: n,
      b: d,
      answer: `${n}/${d}`
    };
  });
};

export const generateSimplificationFacts = (count: number): Question[] => {
  return Array.from({ length: count }, () => {
    let d = Math.floor(Math.random() * 10) + 3; // 3 to 12
    let factor = Math.floor(Math.random() * 4) + 2; // 2 to 5
    let n = Math.floor(Math.random() * (d - 1)) + 1;
    // ensure reducible
    let unsimplifiedN = n * factor;
    let unsimplifiedD = d * factor;
    
    let divisor = gcd(unsimplifiedN, unsimplifiedD);
    let finalN = unsimplifiedN / divisor;
    let finalD = unsimplifiedD / divisor;

    return {
      id: `simp_${unsimplifiedN}_${unsimplifiedD}`,
      fractionType: 'simplification',
      a: unsimplifiedN,
      b: unsimplifiedD,
      answer: finalD === 1 ? `${finalN}` : `${finalN}/${finalD}`
    };
  });
};

export const generateImproperToMixedFacts = (count: number): Question[] => {
  return Array.from({ length: count }, () => {
    const d = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const w = Math.floor(Math.random() * 4) + 1; // 1 to 4
    const n = Math.floor(Math.random() * (d - 1)) + 1; // 1 to d-1
    
    const improperN = w * d + n;
    
    return {
      id: `imp2mix_${improperN}_${d}`,
      fractionType: 'improperToMixed',
      a: improperN,
      b: d,
      answer: `${w} ${n}/${d}`
    };
  });
};

export const generateMixedToImproperFacts = (count: number): Question[] => {
  return Array.from({ length: count }, () => {
    const d = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const w = Math.floor(Math.random() * 4) + 1; // 1 to 4
    const n = Math.floor(Math.random() * (d - 1)) + 1; // 1 to d-1
    
    const improperN = w * d + n;
    
    return {
      id: `mix2imp_${w}_${n}_${d}`,
      fractionType: 'mixedToImproper',
      a: `${w} ${n}/${d}`,
      answer: `${improperN}/${d}`
    };
  });
};

export const generateDecimalFacts = (count: number): Question[] => {
  const decDenoms = [2, 4, 5, 8, 10];
  return Array.from({ length: count }, () => {
    const d = decDenoms[Math.floor(Math.random() * decDenoms.length)];
    const n = Math.floor(Math.random() * (d - 1)) + 1; // 1 to d-1
    
    return {
      id: `dec_${n}_${d}`,
      fractionType: 'decimal',
      a: n,
      b: d,
      answer: (n / d).toString()
    };
  });
};

export const generateAllFractionTypes = (count: number): Question[] => {
  const generators = [
    generateVisualFacts,
    generateSimplificationFacts,
    generateImproperToMixedFacts,
    generateMixedToImproperFacts,
    generateDecimalFacts
  ];
  
  return Array.from({ length: count }, () => {
    const generator = generators[Math.floor(Math.random() * generators.length)];
    return generator(1)[0];
  });
};

export const generateFractionChallengeFSRS = (
  count: number,
  cards: Record<string, Card>
): Question[] => {
  // Generate a vast pool of potential questions across all types
  const pool: Question[] = [
    ...generateVisualFacts(40),
    ...generateSimplificationFacts(40),
    ...generateImproperToMixedFacts(40),
    ...generateMixedToImproperFacts(40),
    ...generateDecimalFacts(40)
  ];

  const now = new Date().getTime();

  const weights = pool.map(q => {
    const card = cards[q.id!];
    
    if (!card) return 20; // Unseen
    
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
    let selected = pool[0];
    for (let j = 0; j < pool.length; j++) {
      r -= weights[j];
      if (r <= 0) {
        selected = pool[j];
        break;
      }
    }
    result.push({ ...selected });
  }
  return result;
};
