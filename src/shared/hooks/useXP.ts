import { useState, useEffect } from 'react';
import { useUser } from './useUser';

export const RANKS = [
  { threshold: 0, name: 'NOOB' },
  { threshold: 500, name: 'CALCULATOR' },
  { threshold: 1500, name: 'MATHLETE' },
  { threshold: 3000, name: 'NUMBER CRUNCHER' },
  { threshold: 6000, name: 'EQUATION MASTER' },
  { threshold: 12000, name: 'MATH WIZARD' },
  { threshold: 25000, name: 'LASER LORD' },
  { threshold: 50000, name: 'MATH-BOT OVERLORD' },
  { threshold: 75000, name: 'QUANTUM BRAIN' },
  { threshold: 100000, name: 'OMNISCIENT ALGORITHM' },
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
  const { currentUser } = useUser();
  const [xp, setXp] = useState(0);

  const getStorageKey = () => `math_mutiny_xp_${currentUser}`;

  useEffect(() => {
    if (!currentUser) return;
    const savedXp = localStorage.getItem(getStorageKey());
    if (savedXp) {
      setXp(parseInt(savedXp, 10));
    } else {
      setXp(0);
    }
  }, [currentUser]);

  const addXp = (amount: number) => {
    if (!currentUser) return;
    setXp((prev) => {
      const newXp = prev + amount;
      localStorage.setItem(getStorageKey(), newXp.toString());
      return newXp;
    });
  };

  const resetXP = () => {
    if (!currentUser) return;
    setXp(0);
    localStorage.removeItem(getStorageKey());
  };

  return { xp, addXp, resetXP, rank: getRank(xp) };
};
