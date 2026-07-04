import { useState, useEffect } from 'react';
import { useUser } from './useUser';

export interface TableStats {
  attempts: number;
  correct: number;
  completions: number;
}

export const useMastery = () => {
  const { currentUser } = useUser();
  const [stats, setStats] = useState<Record<string, TableStats>>({});

  const getStorageKey = () => `math_mutiny_mastery_${currentUser}`;

  useEffect(() => {
    if (!currentUser) return;
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse mastery stats", e);
      }
    } else {
      setStats({});
    }
  }, [currentUser]);

  const recordAnswer = (table: number, questionId: string, isCorrect: boolean) => {
    if (!currentUser) return;
    setStats(prev => {
      const tKey = `table_${table}`;
      const qKey = `q_${questionId}`;
      const currentTable = prev[tKey] || { attempts: 0, correct: 0, completions: 0 };
      const currentQuestion = prev[qKey] || { attempts: 0, correct: 0, completions: 0 };
      
      const newStats = {
        ...prev,
        [tKey]: {
          ...currentTable,
          attempts: currentTable.attempts + 1,
          correct: currentTable.correct + (isCorrect ? 1 : 0),
        },
        [qKey]: {
          ...currentQuestion,
          attempts: currentQuestion.attempts + 1,
          correct: currentQuestion.correct + (isCorrect ? 1 : 0),
        }
      };
      localStorage.setItem(getStorageKey(), JSON.stringify(newStats));
      return newStats;
    });
  };

  const recordCompletion = (table: number) => {
    if (!currentUser) return;
    setStats(prev => {
      const tKey = `table_${table}`;
      const currentTable = prev[tKey] || { attempts: 0, correct: 0, completions: 0 };
      const newStats = {
        ...prev,
        [tKey]: {
          ...currentTable,
          completions: currentTable.completions + 1,
        }
      };
      localStorage.setItem(getStorageKey(), JSON.stringify(newStats));
      return newStats;
    });
  };

  const getMastery = (table: number) => {
    const s = stats[`table_${table}`];
    if (!s || s.attempts === 0) return 0;
    
    // Accuracy (0 to 1)
    const accuracy = s.correct / Math.max(s.attempts, 1);
    
    // Volume/Completion component (0 to 1)
    // 3 completions is considered "mastered" volume for this factor
    const completionFactor = Math.min(s.completions / 3, 1);
    
    // Base experience (max 0.2 from just attempting)
    const attemptFactor = Math.min(s.attempts / 50, 1);

    // Calculate score: 60% accuracy, 30% completions, 10% pure attempts
    // If accuracy is low, we shouldn't reward completions as much
    const score = (accuracy * 0.6) + (completionFactor * accuracy * 0.3) + (attemptFactor * 0.1);
    
    return Math.max(0, Math.min(score, 1));
  };
  
  const getQuestionMastery = (questionId: string) => {
    const s = stats[`q_${questionId}`];
    if (!s || s.attempts === 0) return 0;
    return s.correct / Math.max(s.attempts, 1);
  };
  
  const getQuestionAttempts = (questionId: string) => {
    const s = stats[`q_${questionId}`];
    return s ? s.attempts : 0;
  };

  const resetMastery = () => {
    if (!currentUser) return;
    setStats({});
    localStorage.removeItem(getStorageKey());
  };

  return { stats, recordAnswer, recordCompletion, getMastery, getQuestionMastery, getQuestionAttempts, resetMastery };
};
