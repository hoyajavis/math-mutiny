import { useState, useEffect } from 'react';
import { GameMode, AppConfig, Question } from '../types';

export function useGameState(mode: GameMode, config: AppConfig) {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(mode === 'challenge' ? 60 : 0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [comboAnimation, setComboAnimation] = useState(false);

  // Boss state
  const [currentBoss, setCurrentBoss] = useState(config.bosses[0]);
  const [bossHp, setBossHp] = useState(currentBoss.hp);
  const [bossDefeated, setBossDefeated] = useState(false);

  useEffect(() => {
    let timer: number;
    if (!isGameOver && !isTransitioning) {
      timer = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        if (mode === 'challenge') {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setIsGameOver(true);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameOver, isTransitioning, mode]);

  const addScore = (points: number) => setScore(s => s + points);
  
  const incrementCombo = () => {
    setCombo(c => {
      const newCombo = c + 1;
      if (newCombo % 5 === 0) {
        setComboAnimation(true);
        setTimeout(() => setComboAnimation(false), 500);
      }
      return newCombo;
    });
  };

  const resetCombo = () => setCombo(0);
  const incrementStreak = () => setStreak(s => s + 1);
  const resetStreak = () => setStreak(0);

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setCombo(0);
    setXpEarned(0);
    setTimeLeft(mode === 'challenge' ? 60 : 0);
    setTimeElapsed(0);
    setIsGameOver(false);
    setBossDefeated(false);
    setCurrentBoss(config.bosses[0]);
    setBossHp(config.bosses[0].hp);
  };

  return {
    score, addScore,
    streak, incrementStreak, resetStreak,
    combo, incrementCombo, resetCombo, comboAnimation,
    xpEarned, setXpEarned,
    timeLeft, setTimeLeft,
    timeElapsed,
    isGameOver, setIsGameOver,
    isTransitioning, setIsTransitioning,
    currentBoss, setCurrentBoss,
    bossHp, setBossHp,
    bossDefeated, setBossDefeated,
    resetGame
  };
}
