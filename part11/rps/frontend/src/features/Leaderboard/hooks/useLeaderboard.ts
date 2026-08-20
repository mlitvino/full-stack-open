import { useState, useEffect } from 'react';
import leaderboardService from '../services/leaderboard.service';
import type { LeaderboardRow, LeaderboardLiveRes } from '../types/leaderboard.type';
import { useSse } from '@/shared/hooks/useSse';

type UseLeaderboardResult = {
  leaderboard: LeaderboardRow[] | null;
  isLoading: boolean;
  error: string | null;
  loadToday: () => Promise<void>;
  loadRange: (from: string, to: string) => Promise<void>;
}

export function useLeaderboard(isLive: boolean): UseLeaderboardResult {
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: liveData, error: liveError } = useSse<LeaderboardLiveRes>(
    leaderboardService.getTodayLiveUrl(),
    isLive,
  );

  useEffect(() => {
    if (!liveData)
      return;

    if ('from' in liveData && 'to' in liveData && 'leaderboard' in liveData) {
      setLeaderboard(liveData.leaderboard);
      return;
    }

    if (liveData.type === 'leaderboard_delta') {
      setLeaderboard((prev) => {
        const delta = liveData.leaderboard;
        if (!prev) {
          return delta;
        }

        const next = [...prev];

        const insertInOrder = (row: LeaderboardRow): void => {
          let i = next.findIndex((r) => r.name === row.name);
          if (i  !== -1) {
            next[i] = { ...next[i], wins: row.wins };
          } else {
            next.push({ ...row });
            i = next.length + 1;
          }

          while (i > 0) {
            const prevRow = next[i - 1];
            const currRow = next[i];
            const shouldSwap = currRow.wins > prevRow.wins;
            if (!shouldSwap)
              break;
            next[i - 1] = currRow;
            next[i] = prevRow;
            i -= 1;
          }
        };

        for (const { name, wins } of delta) {
          const existingIndex = next.findIndex((r) => r.name === name);
          if (existingIndex !== -1) {
            const existing = next[existingIndex];
            insertInOrder({ name, wins: existing.wins + wins });
          } else {
            insertInOrder({ name, wins });
          }
        }

        return next;
      });
    }
  }, [liveData]);

  useEffect(() => {
    if (!liveError)
      return;
    setError(liveError);
  }, [liveError]);

  const loadToday = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await leaderboardService.today();
      setLeaderboard(res.leaderboard);
    } catch (err) {
      console.error('failed to fetch leaderboard of today', err);
      setError('Failed to load leaderboard.');
      setLeaderboard([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRange = async (from: string, to: string): Promise<void> => {
    if (!from || !to) {
      setError('Both From and To dates are required.');
      setLeaderboard([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await leaderboardService.range(to, from);
      setLeaderboard(res.leaderboard);
    } catch (err) {
      console.error('failed to fetch leaderboard by date range', err);
      setError('Failed to load leaderboard for the selected range.');
      setLeaderboard([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadToday();
  }, []);

  return { leaderboard, isLoading, error, loadToday, loadRange };
}
