import { useState, useEffect } from 'react';

export const RANKS = [
  { threshold: 0, name: 'NOOB' },
  { threshold: 100, name: 'CALCULATOR' },
  { threshold: 500, name: 'MATHLETE' },
  { threshold: 1000, name: 'NUMBER CRUNCHER' },
  { threshold: 2500, name: 'EQUATION MASTER' },
  { threshold: 5000, name: 'MATH WIZARD' },
  { threshold: 10000, name: 'LASER LORD' },
  { threshold: 50000, name: 'MATH-BOT OVERLORD' },
];

export function getRank(xp: number) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].threshold) {
      return RANKS[i].name;
    }
  }
  return RANKS[0].name;
}

export const useXP = () => {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const savedXp = localStorage.getItem('math_mutiny_xp');
    if (savedXp) {
      setXp(parseInt(savedXp, 10));
    }
  }, []);

  const addXp = (amount: number) => {
    setXp((prev) => {
      const newXp = prev + amount;
      localStorage.setItem('math_mutiny_xp', newXp.toString());
      return newXp;
    });
  };

  const resetXP = () => {
    setXp(0);
    localStorage.removeItem('math_mutiny_xp');
  };

  return { xp, addXp, resetXP, rank: getRank(xp) };
};
