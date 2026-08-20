import type { GameData } from '../types/legacy-api.type.js';
import type { LegacyApiService } from '../services/legacy-api.service.js';
import { toUtcDayStartMs, days } from './time.js';
import { parseData } from './parseData.js';
import type { Match } from '../repositories/matches.entity.js';

export function rangeHasAllDays(
  storedMatches: Match[],
  fromStartMs: number,
  toStartMs: number,
): boolean {
  const daysInDb = new Set(storedMatches.map((match) => match.startOfDayMs));

  for (let dayMs = fromStartMs; dayMs <= toStartMs; dayMs += days(1)) {
    if (!daysInDb.has(dayMs)) {
      return false;
    }
  }

  return true;
}

export async function findRangeGames(
  legacyApiService: LegacyApiService,
  fromStartMs: number,
  toStartMs: number,
): Promise<GameData[]> {
  let response = await legacyApiService.getFirst();
  const rangeGames: GameData[] = [];

  while (true) {
    const parsedData = parseData(response.data);
    if (parsedData.length > 0) {
      const bounds = getPageDayBounds(parsedData);

      if (bounds) {
        const { headDayStartMs, tailDayStartMs } = bounds;
        const isFullOverlap = headDayStartMs <= toStartMs && tailDayStartMs >= fromStartMs;
        const hasNoOverlap = tailDayStartMs > toStartMs || headDayStartMs < fromStartMs;
        const isPartialOverlap = !isFullOverlap && !hasNoOverlap;

        if (isFullOverlap) {
          rangeGames.push(...parsedData);
        } else if (isPartialOverlap) {
          rangeGames.push(...extractPartialPage(parsedData, fromStartMs, toStartMs));
        }

        if (headDayStartMs < fromStartMs) {
          break;
        }
      }
    }

    if (!response.cursor) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      response = await legacyApiService.getOne(response.cursor);
    } catch {
      return rangeGames;
    }
  }

  return rangeGames;
}

function getPageDayBounds(data: GameData[]): {
  headDayStartMs: number;
  tailDayStartMs: number;
} | null {
  if (data.length === 0) {
    return null;
  }

  return {
    headDayStartMs: toUtcDayStartMs(data[0].time),
    tailDayStartMs: toUtcDayStartMs(data[data.length - 1].time),
  };
}

function extractPartialPage(
  data: GameData[],
  fromStartMs: number,
  toStartMs: number,
): GameData[] {
  if (data.length === 0) {
    return [];
  }

  const headDayStartMs = toUtcDayStartMs(data[0].time);
  const tailDayStartMs = toUtcDayStartMs(data[data.length - 1].time);

  const firstAtMostTo = headDayStartMs <= toStartMs
    ? 0
    : binarySearch(data, toStartMs, 'firstAtMost');
  if (firstAtMostTo === -1) {
    return [];
  }

  const lastAtLeastFrom = tailDayStartMs >= fromStartMs
    ? data.length - 1
    : binarySearch(data, fromStartMs, 'lastAtLeast');
  if (lastAtLeastFrom === -1 || firstAtMostTo > lastAtLeastFrom) {
    return [];
  }

  return data.slice(firstAtMostTo, lastAtLeastFrom + 1);
}

function binarySearch(
  data: GameData[],
  target: number,
  mode: 'firstAtMost' | 'lastAtLeast',
): number {
  let left = 0;
  let right = data.length - 1;
  let answer = -1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const day = toUtcDayStartMs(data[mid].time);

    if (mode === 'firstAtMost') {
      if (day <= target) {
        answer = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (day >= target) {
        answer = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return answer;
}
