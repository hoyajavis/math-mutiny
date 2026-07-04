import { useState, useEffect } from 'react';
import { useUser } from './useUser';

export const useHighScores = () => {
  const { currentUser } = useUser();
  const [randomHighScore, setRandomHighScore] = useState(0);
  const [challengeHighScore, setChallengeHighScore] = useState(0);

  const getRandomKey = () => `math_mutiny_random_high_${currentUser}`;
  const getChallengeKey = () => `math_mutiny_challenge_high_${currentUser}`;

  useEffect(() => {
    if (!currentUser) return;
    
    const savedRandom = localStorage.getItem(getRandomKey());
    if (savedRandom) setRandomHighScore(parseInt(savedRandom));
    else setRandomHighScore(0);

    const savedChallenge = localStorage.getItem(getChallengeKey());
    if (savedChallenge) setChallengeHighScore(parseInt(savedChallenge));
    else setChallengeHighScore(0);
  }, [currentUser]);

  const recordRandomScore = (xp: number) => {
    if (!currentUser) return false;
    if (xp > randomHighScore) {
      setRandomHighScore(xp);
      localStorage.setItem(getRandomKey(), xp.toString());
      return true;
    }
    return false;
  };

  const recordChallengeScore = (timeRemaining: number) => {
    if (!currentUser) return false;
    if (timeRemaining > challengeHighScore) {
      setChallengeHighScore(timeRemaining);
      localStorage.setItem(getChallengeKey(), timeRemaining.toString());
      return true;
    }
    return false;
  };

  const resetHighScores = () => {
    if (!currentUser) return;
    setRandomHighScore(0);
    setChallengeHighScore(0);
    localStorage.removeItem(getRandomKey());
    localStorage.removeItem(getChallengeKey());
  };

  return { randomHighScore, challengeHighScore, recordRandomScore, recordChallengeScore, resetHighScores };
};
