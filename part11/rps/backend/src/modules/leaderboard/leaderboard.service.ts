import type { GameData } from '../../types/legacy-api.type.js';
import type { LeaderboardQuery } from './dto/leaderboard-query.dto.js';
import type { LeaderboardRes } from './dto/leaderboard-res.dto.js';
import type { LeaderboardRow } from './types/leaderboard.type.js';

import { defineWinner } from '../../utils/defineWinner.js';
import { findRangeGames, rangeHasAllDays } from '../../utils/dateSearch.js';
import { toUtcDayStartMs, minutes } from '../../utils/time.js';

import { CacheService } from '../../services/cache.service.js';
import type { LegacyApiService } from '../../services/legacy-api.service.js';
import type { Repository } from 'typeorm';
import { Match } from '../../repositories/matches.entity.js';

export class LeaderBoardService {
  constructor(
    private readonly legacyApiService: LegacyApiService,
    private readonly cache: CacheService<LeaderboardRes>,
    private readonly matchesRepository: Repository<Match>,
  ) {}

  async getLeaderboardOfToday(): Promise<LeaderboardRes> {
    const today = new Date();
    return this.getLeaderboard({ from: today, to: today });
  }

  async getLeaderboard(range: LeaderboardQuery): Promise<LeaderboardRes> {
    const fromStartMs = toUtcDayStartMs(range.from);
    const toStartMs = toUtcDayStartMs(range.to);
    const cacheKey = `:${fromStartMs}:${toStartMs}`;

    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const games = await this.prepareMatches(fromStartMs, toStartMs);
    const leaderboard = this.formLeaderboard(games);
    const sortedLeaderboard = this.sortLeaderboard(leaderboard);

    const res = {
      from: new Date(fromStartMs).toISOString().slice(0, 10),
      to: new Date(toStartMs).toISOString().slice(0, 10),
      leaderboard: sortedLeaderboard,
    };

    const todayStartMs = toUtcDayStartMs(new Date());
    const ttlMs = toStartMs === todayStartMs ? minutes(1) : undefined;
    this.cache.set(cacheKey, res, ttlMs);

    return res;
  };

  formLeaderboard(games: GameData[]): LeaderboardRow[] {
    const table = new Map<string, LeaderboardRow>();

    for (const game of games) {
      const playerA = table.get(game.playerA.name) ?? { name: game.playerA.name, wins: 0 };
      const playerB = table.get(game.playerB.name) ?? { name: game.playerB.name, wins: 0 };

      table.set(playerA.name, playerA);
      table.set(playerB.name, playerB);

      const winner = defineWinner(game.playerA.played, game.playerB.played);
      if (winner === 'PlayerA') {
        playerA.wins++;
      } else if (winner === 'PlayerB') {
        playerB.wins++;
      }
    }

    return [...table.values()];
  }

  private async prepareMatches(fromStartMs: number, toStartMs: number): Promise<GameData[]>  {
    const dbQuery = this.matchesRepository
      .createQueryBuilder('match')
      .where('match.start_of_day_ms BETWEEN :from AND :to', {
        from: fromStartMs,
        to: toStartMs,
      })
      .orderBy('match.played_at_ms', 'DESC');

    const storedMatches = await dbQuery.getMany();

    if (storedMatches.length > 0 && rangeHasAllDays(storedMatches, fromStartMs, toStartMs)) {
      return storedMatches.map((m) => ({
        type: 'GAME_RESULT' as const,
        gameId: m.gameId,
        time: m.playedAtMs,
        playerA: { name: m.playerAName, played: m.playerAMove },
        playerB: { name: m.playerBName, played: m.playerBMove },
      }));
    }

    return findRangeGames(this.legacyApiService, fromStartMs, toStartMs);
  }

  private sortLeaderboard(players: LeaderboardRow[]): LeaderboardRow[] {
    if (players.length < 2) {
      return players;
    }

    const pivot = players[Math.floor(players.length / 2)];
    const left: LeaderboardRow[] = [];
    const middle: LeaderboardRow[] = [];
    const right: LeaderboardRow[] = [];

    for (const player of players) {
      const cmp = this.comparePlayers(player, pivot);

      if (cmp < 0) {
        left.push(player);
      } else if (cmp > 0) {
        right.push(player);
      } else {
        middle.push(player);
      }
    }

    return [
      ...this.sortLeaderboard(left),
      ...middle,
      ...this.sortLeaderboard(right),
    ];
  }

  private comparePlayers(
    playerA: LeaderboardRow,
    playerB: LeaderboardRow,
  ): number {
    if (playerA.wins !== playerB.wins) {
      return playerB.wins - playerA.wins;
    }

    return playerA.name.localeCompare(playerB.name);
  }
}
