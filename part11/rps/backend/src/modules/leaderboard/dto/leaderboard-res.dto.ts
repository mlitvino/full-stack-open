import type { LeaderboardRow } from '../types/leaderboard.type.js';

export type LeaderboardRes = {
  from: string;
  to: string;
  leaderboard: LeaderboardRow[];
};
