import Dexie, { type Table } from 'dexie';
import { type Card } from 'ts-fsrs';

export interface FactState {
  id: string; // Composite key: `${userId}_${factId}`
  userId: string;
  factId: string;
  card: Card;
  lastUpdate: Date;
}

export interface AttemptLog {
  id?: number;
  userId: string;
  factId: string;
  isCorrect: boolean;
  latencyMs: number;
  timestamp: Date;
  mode: string;
}

export class MathMutinyDB extends Dexie {
  factStates!: Table<FactState, string>;
  attemptLogs!: Table<AttemptLog, number>;

  constructor(dbName: string) {
    super(dbName);
    this.version(2).stores({
      factStates: 'id, userId, factId',
      attemptLogs: '++id, userId, factId, timestamp'
    });
  }
}

export let db: MathMutinyDB;

export const initDB = (dbName: string) => {
  db = new MathMutinyDB(dbName);
};
