import { useState, useEffect } from 'react';

import matchesService from '../services/matches.service';
import type { MatchesResLiveRes, MatchResult } from '../types/matches.type';
import { useSse } from '@/shared/hooks/useSse';

type UseMatchesResult = {
  matches: MatchResult[] | null,
  isLoading: boolean;
  error: string | null;
  loadLatest: () => Promise<void>;
  loadFiltered: (playerName: string, date: string) => Promise<void>;
}

export function useMatches(isLive: boolean): UseMatchesResult {
  const [matches, setMatches] = useState<MatchResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: liveData, error: liveError } = useSse<MatchesResLiveRes>(
    matchesService.getLatestLiveUrl(),
    isLive,
  );

  useEffect(() => {
    if (!liveData) {
      return;
    }

    if (!('type' in liveData)) {
      setMatches(liveData.matches);
      return;
    }

    if (liveData.type === 'matches_delta') {
      setMatches((prev) => {
        const delta = liveData.matches;
        if (!prev) {
          return delta;
        }

        return [...delta, ...prev];
      });
    }
  }, [liveData]);

  useEffect(() => {
    if (!liveError)
      return;
    setError(liveError);
  }, [liveError]);

  useEffect(() => {
    void loadLatest();
  }, []);

  const loadLatest = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await matchesService.latest();
      setMatches(res.matches);
    } catch (err) {
      console.error('failed to fetch latest matches', err);
      setError('Failed to load latest matches');
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFiltered = async (playerName: string, date: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await matchesService.search({ playerName, date });
      setMatches(res.matches);
    } catch (err) {
      console.error('failed to fetch filtered matches', err);
      setError('Failed to load matches');
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { matches, isLoading, error, loadLatest, loadFiltered };
};
