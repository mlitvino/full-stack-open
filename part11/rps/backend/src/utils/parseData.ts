import type { GameData, Move } from '../types/legacy-api.type.js';

const VALID_MOVES: Move[] = ['ROCK', 'PAPER', 'SCISSORS'];

export function extractGames(payloadContainer: { parsed: unknown }): GameData[] {
  const payload = payloadContainer.parsed;
  if (Array.isArray(payload)) {
    return parseData(payload as GameData[]);
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const record = payload as { data?: unknown };
  const candidate = record.data ?? payload;

  if (Array.isArray(candidate)) {
    return parseData(candidate as GameData[]);
  }

  if (candidate && typeof candidate === 'object') {
    return parseData([candidate as GameData]);
  }

  return [];
}

export function parseData(data: GameData[]): GameData[] {
  const parsed: GameData[] = [];

  for (const gameUnknown of data as unknown[]) {
    if (!gameUnknown || typeof gameUnknown !== 'object') {
      continue;
    }

    const game = gameUnknown as {
      type?: unknown;
      gameId?: unknown;
      time?: unknown;
      playerA?: { name?: unknown; played?: unknown };
      playerB?: { name?: unknown; played?: unknown };
    };

    if (game.type !== 'GAME_RESULT') {
      continue;
    }

    if (typeof game.gameId !== 'string' || game.gameId.length === 0) {
      continue;
    }

    const normalizedTime = normalizeTime(game.time);
    if (normalizedTime === -1) {
      continue;
    }

    const playerA = normalizePlayer(game.playerA);
    const playerB = normalizePlayer(game.playerB);
    if (!playerA || !playerB) {
      continue;
    }

    parsed.push({
      type: 'GAME_RESULT',
      gameId: game.gameId,
      time: normalizedTime,
      playerA,
      playerB,
    });
  }

  return parsed;
}

function normalizeTime(time: unknown): number {
  const ms = normalizeTimeToMs(time);
  if (ms === null)
    return -1;
  return isReasonableTimestamp(ms) ? ms : -1;
}

function normalizeTimeToMs(time: unknown): number {
  if (typeof time === 'number' && Number.isFinite(time)) {
    if (time > 0 && time < 1_000_000_000_000) {
      return time * 1000;
    }
    return time;
  }

  if (typeof time === 'string' && time.trim().length > 0) {
    const parsed = Date.parse(time);
    return Number.isFinite(parsed) ? parsed : -1;
  }

  return -1;
}

function isReasonableTimestamp(ms: number): boolean {
  const min = Date.UTC(2000, 0, 1);
  const max = Date.now();
  return ms >= min && ms <= max;
}

function normalizePlayer(playerUnknown: unknown): { name: string; played: Move } | null {
  if (!playerUnknown || typeof playerUnknown !== 'object') {
    return null;
  }

  const player = playerUnknown as { name?: unknown; played?: unknown };
  if (typeof player.name !== 'string' || player.name.length === 0) {
    return null;
  }

  if (typeof player.played !== 'string') {
    return null;
  }

  const played = player.played.toUpperCase();
  if (!VALID_MOVES.includes(played as Move)) {
    return null;
  }

  return {
    name: player.name,
    played: played as Move,
  };
}
