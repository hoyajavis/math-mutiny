import { useState, useEffect } from 'react';

export const useHighScores = () => {
  const [randomHighScore, setRandomHighScore] = useState(0);
  const [challengeHighScore, setChallengeHighScore] = useState(0);

  useEffect(() => {
    const savedRandom = localStorage.getItem('math_mutiny_random_high');
    if (savedRandom) setRandomHighScore(parseInt(savedRandom));

    const savedChallenge = localStorage.getItem('math_mutiny_challenge_high');
    if (savedChallenge) setChallengeHighScore(parseInt(savedChallenge));
  }, []);

  const recordRandomScore = (xp: number) => {
    if (xp > randomHighScore) {
      setRandomHighScore(xp);
      localStorage.setItem('math_mutiny_random_high', xp.toString());
      return true;
    }
    return false;
  };

  const recordChallengeScore = (timeRemaining: number) => {
    if (timeRemaining > challengeHighScore) {
      setChallengeHighScore(timeRemaining);
      localStorage.setItem('math_mutiny_challenge_high', timeRemaining.toString());
      return true;
    }
    return false;
  };

  const resetHighScores = () => {
    setRandomHighScore(0);
    setChallengeHighScore(0);
    localStorage.removeItem('math_mutiny_random_high');
    localStorage.removeItem('math_mutiny_challenge_high');
  };

  return { randomHighScore, challengeHighScore, recordRandomScore, recordChallengeScore, resetHighScores };
};
