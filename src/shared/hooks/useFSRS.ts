import { useState, useEffect } from 'react';
import { db } from '../db/db';
import { FSRS, createEmptyCard, Rating, type Card } from 'ts-fsrs';
import { useUser } from './useUser';

const fsrs = new FSRS({});

export const useFSRS = () => {
  const { currentUser } = useUser();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [currentUser]);

  const recordAttempt = async (
    factId: string, 
    isCorrect: boolean, 
    latencyMs: number, 
    mode: string
  ) => {
    if (!currentUser) return;

    const timestamp = new Date();

    // 1. Log the attempt
    await db.attemptLogs.add({
      userId: currentUser,
      factId,
      isCorrect,
      latencyMs,
      timestamp,
      mode
    });

    // 2. Calculate FSRS Rating based on latency and correctness
    let rating: Rating = Rating.Again;
    if (isCorrect) {
      if (latencyMs <= 2500) {
        rating = Rating.Easy;
      } else if (latencyMs <= 6000) {
        rating = Rating.Good;
      } else {
        rating = Rating.Hard;
      }
    } else {
      rating = Rating.Again;
    }

    // 3. Get or create current card state
    const compositeId = `${currentUser}_${factId}`;
    const state = await db.factStates.get(compositeId);
    
    let card: Card;
    if (state) {
      card = state.card;
    } else {
      card = createEmptyCard(timestamp);
    }

    // 4. Calculate next state
    const scheduling = fsrs.repeat(card, timestamp);
    // TypeScript workaround since ts-fsrs might index ratings via numeric keys
    const nextCard = scheduling[rating].card;

    // 5. Save updated state
    await db.factStates.put({
      id: compositeId,
      userId: currentUser,
      factId,
      card: nextCard,
      lastUpdate: timestamp
    });

    // 6. Prune old logs (optional, e.g., older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    await db.attemptLogs
      .where('timestamp')
      .below(thirtyDaysAgo)
      .delete();
  };

  const getCard = async (factId: string): Promise<Card | null> => {
    if (!currentUser) return null;
    const state = await db.factStates.get(`${currentUser}_${factId}`);
    return state ? state.card : null;
  };

  const getAllCards = async () => {
    if (!currentUser) return [];
    return await db.factStates.where('userId').equals(currentUser).toArray();
  };

  const getGroupStability = async (filterFn: (factId: string) => boolean): Promise<number> => {
    if (!currentUser) return 0;
    const cards = await db.factStates.where('userId').equals(currentUser).toArray();
    const matchingCards = cards.filter(c => filterFn(c.factId));
    
    if (matchingCards.length === 0) return 0;
    
    const totalStability = matchingCards.reduce((sum, state) => sum + state.card.stability, 0);
    const avgStability = totalStability / matchingCards.length;
    
    // Normalize: 10 days stability = 1.0 mastery (100% green)
    return Math.min(avgStability / 10, 1);
  };

  const getGroupStabilities = async (filters: Record<string, (factId: string) => boolean>): Promise<Record<string, number>> => {
    if (!currentUser) return {};
    const cards = await db.factStates.where('userId').equals(currentUser).toArray();

    const result: Record<string, number> = {};
    for (const [key, filterFn] of Object.entries(filters)) {
      const matchingCards = cards.filter(c => filterFn(c.factId));
      if (matchingCards.length === 0) {
        result[key] = 0;
      } else {
        const totalStability = matchingCards.reduce((sum, state) => sum + state.card.stability, 0);
        const avgStability = totalStability / matchingCards.length;
        result[key] = Math.min(avgStability / 10, 1);
      }
    }
    return result;
  };

  return { recordAttempt, getCard, getAllCards, getGroupStability, getGroupStabilities, isReady };
};
